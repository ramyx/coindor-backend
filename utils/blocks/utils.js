const moment = require("moment");
const { increaseLoginAttempts, updateLoginDevice, getLoginDevice } = require("../../models/loginModel");

const lock = async (field, fieldValue, blockDuration) => {
  const lockUntil = moment().add(blockDuration, 'seconds').valueOf();
  await updateLoginDevice(field, fieldValue, {
    lockUntil,
    isLocked: true
  });
}

const refreshAttempts = async (field, fieldValue) => {
  await updateLoginDevice(field, fieldValue, {
    loginAttempts: 1,
    lastAttempt: moment().valueOf(),
    isLocked: false
  });
}

const increaseAttempts = async (field, fieldValue, params) =>
  new Promise((resolve, reject) =>
    getLoginDevice(field, fieldValue).then(loginDevice => {
      if (loginDevice && loginDevice.loginAttempts >= params.maxWrongAttempts - 1) {
        lock(field, fieldValue, params.blockDuration).then(() => resolve());
      } else {
        increaseLoginAttempts(field, fieldValue).then(() => { resolve() });
      }
    })
  );

const isNotBlocked = (field, fieldValue, params) =>
  new Promise((resolve, reject) =>
    getLoginDevice(field, fieldValue).then(loginDevice => {
      if (!loginDevice) {
        resolve({ remainingPoints: 1 });
      } else if (loginDevice.isLocked) {
        const lockTimeEnded = loginDevice.lockUntil < moment().valueOf();
        if (lockTimeEnded) {
          refreshAttempts(field, fieldValue).then(() => resolve({ remainingPoints: 1 }));
        }
        const result = { remainingPoints: -1 };
        if (field === "ipAddress") {
          result.msBeforeNext = moment(loginDevice.lockUntil).diff(moment());
        }
        resolve(result);
      } else {
        const loginAttempsNeedRefresh = !loginDevice.lastAttempt ||
          moment(loginDevice.lastAttempt).add(params.durationOfAttempts).valueOf() < moment().valueOf();
        if (loginAttempsNeedRefresh) {
          refreshAttempts(field, fieldValue).then(() => resolve({ remainingPoints: 1 }));
        }
        resolve({ remainingPoints: 1 });
      }
    })
  );

module.exports = {
  isNotBlocked,
  increaseAttempts,
  refreshAttempts
};
