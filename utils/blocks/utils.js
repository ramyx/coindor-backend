const moment = require("moment");
const Timestamp = require('mongodb').Timestamp;
const { increaseLoginAttempts, updateLoginDevice, getLoginDevice } = require("../../models/loginModel");

const lock = async (field, fieldValue, blockDuration) => {
  const lockUntil = new Timestamp(moment().add(blockDuration, 'seconds').valueOf(), 1);
  await updateLoginDevice(field, fieldValue, {
    lockUntil,
    isLocked: true
  });
}

const refreshAttempts = async (field, fieldValue, loginAttempts) => {
  await updateLoginDevice(field, fieldValue, {
    loginAttempts: parseInt(loginAttempts),
    lastAttempt: new Timestamp(new Date().getTime(), 1),
    isLocked: false
  });
}

const increaseAttempts = async (field, fieldValue, params) =>
  new Promise((resolve, reject) =>
    getLoginDevice(field, fieldValue).then(loginDevice => {
      increaseLoginAttempts(field, fieldValue).then(() => { 
        if (loginDevice && loginDevice.loginAttempts >= params.maxWrongAttempts - 1) {
          return lock(field, fieldValue, params.blockDuration).then(() => resolve()).catch(err => reject(err));
        }
        return resolve();
      }).catch(err => reject(err));
    }).catch(err => reject(err))
  );

const isNotBlocked = (field, fieldValue, params) =>
  new Promise((resolve, reject) =>
    getLoginDevice(field, fieldValue).then(loginDevice => {
      if (!loginDevice) {
        resolve({ remainingPoints: 1 });
      } else if (loginDevice.isLocked) {
        const lockTimeEnded = loginDevice.lockUntil.toString() < moment().valueOf();
        if (lockTimeEnded) {
          return refreshAttempts(field, fieldValue, "0")
            .then(() => resolve({ remainingPoints: 1 }))
            .catch(err => reject(err));
        }
        const result = { remainingPoints: -1 };
        if (field === "ipAddress") {
          result.msBeforeNext = moment(loginDevice.lockUntil.toString()).diff(moment());
        }
        resolve(result);
      } else {
        const loginAttempsNeedRefresh = !loginDevice.lastAttempt ||
          moment(loginDevice.lastAttempt.toString()).add(params.durationOfAttempts, 'seconds').valueOf() < moment().valueOf();
        if (loginAttempsNeedRefresh) {
          refreshAttempts(field, fieldValue, "1")
            .then(() => resolve({ remainingPoints: 1 }))
            .catch(err => reject(err));
        }
        resolve({ remainingPoints: 1 });
      }
    }).catch(err => reject(err))
  );

module.exports = {
  isNotBlocked,
  increaseAttempts,
  refreshAttempts
};
