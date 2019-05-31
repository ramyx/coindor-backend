const { getCollection } = require("./database");


const getLoginDevice = async (field, fieldValue) => {
  return await getCollection('loginDevice').findOne({ [field]: fieldValue });
};

const registerLoginDevice = async (field, fieldValue) => {
  const existingLoginDevice = await getLoginDevice(field, fieldValue);
  if (existingLoginDevice) {
    return;
  }
  const loginDevice = {};
  loginDevice[field] = fieldValue;
  loginDevice.loginAttempts = 1;
  loginDevice.isLocked = false;
  return await getCollection('loginDevice').insertOne(loginDevice);
};

const increaseLoginAttempts = async (field, fieldValue) => {
  const loginDevice = await getLoginDevice(field, fieldValue);
  if (!loginDevice) {
    await registerLoginDevice(field, fieldValue);
  } else {
    await getCollection('loginDevice').updateOne(
      { [field]: fieldValue },
      { $inc: { loginAttempts: 1} }
    );
  }
};

const updateLoginDevice = async (field, fieldValue, newFields) => {
  let loginDevice = await getLoginDevice(field, fieldValue);
  if (!loginDevice) {
    await registerLoginDevice(field, fieldValue);
    loginDevice = await getLoginDevice(field, fieldValue);
  }
  const newLoginDevice = Object.assign(loginDevice, newFields);
  await getCollection('loginDevice').updateOne(
    { [field]: fieldValue },
    {
      $set: newLoginDevice 
    }
  );
};

const isTrustedDevice = async (field, fieldValue, deviceId) => {
  const loginDevice = await getLoginDevice(field, fieldValue);
  let { devicesUsed } = loginDevice;
  if (!devicesUsed || devicesUsed.indexOf(deviceId) === -1) {
    !devicesUsed ? devicesUsed = [] : devicesUsed.push(deviceId);
    updateLoginDevice(field, fieldValue, { devicesUsed })
    return false;
  }
  return true;
}

module.exports = {
  getLoginDevice,
  increaseLoginAttempts,
  updateLoginDevice,
  isTrustedDevice
};
