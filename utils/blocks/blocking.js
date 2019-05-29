const { isNotBlocked, increaseAttempts, refreshAttempts } = require("./utils");
const { login } = require("../auth");
const settings = require("../../config/settings");

const getUsernameIPkey = (username, ip) => `${username}_${ip}`;

const checkDeviceWasUsedPreviously = (username, deviceId) =>
  isTrustedDevice("username", username, deviceId);

const checkUserBlock = async (req, res, usernameIPkey, ipAddr, isDeviceTrusted) => {

  const [resUsernameAndIP, resSlowByIP, resSlowUsername] = await Promise.all([
    isNotBlocked("usernameIPkey", usernameIPkey, settings.usernameIpLoginAttemptParams),
    isNotBlocked("ipAddress", ipAddr, settings.ipLoginAttemptParams),
    isNotBlocked("username", req.body.username, settings.usernameLoginAttemptParams)
  ]);

  let retrySecs = 0;

  // Check if IP, Username + IP or Username is already blocked
  if (!isDeviceTrusted && resSlowByIP !== null && resSlowByIP.remainingPoints <= 0) {
    retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
    res.set('Retry-After', String(retrySecs));
  } else if (resUsernameAndIP !== null && resUsernameAndIP.remainingPoints <= 0) {
    retrySecs = Number.MAX_SAFE_INTEGER;
  } else if (!isDeviceTrusted && resSlowUsername !== null && resSlowUsername.remainingPoints <= 0) {
    retrySecs = Number.MAX_SAFE_INTEGER;
  }
  return retrySecs;
}

const incrementUserAttempts = async (req, res, user, ipAddr, usernameIPkey, isDeviceTrusted) => {
  if (!user.isLoggedIn) {
    try {
      const limiterPromises = [];

      if (!isDeviceTrusted) {
        limiterPromises.push(increaseAttempts("ipAddress", ipAddr, settings.ipLoginAttemptParams));
      }

      if (user.exists) {
        // Count failed attempts only for registered users
        limiterPromises.push(increaseAttempts("usernameIPkey", usernameIPkey, settings.usernameIpLoginAttemptParams));
        if (!isDeviceTrusted) {
          limiterPromises.push(increaseAttempts("username", req.body.username, settings.usernameLoginAttemptParams));
        }
      }
      
      if (limiterPromises.length > 0) {
        await Promise.all(limiterPromises);
      }

      res.status(400).send({ auth: user.auth, token: user.token, message: "Email or password is wrong" });
    } catch (rlRejected) {
      if (rlRejected instanceof Error) {
        throw rlRejected;
      } else {
        // All available points are consumed from some/all limiters, block request
        res.status(429).send('Too Many Requests');
      }
    }
  }

  if (user.isLoggedIn) {
    await refreshAttempts("usernameIPkey", usernameIPkey);
    res.status(200).send({ auth: user.auth, token: user.token });
  }
}

const loginRoute = async (req, res) => {
  const ipAddr = req.connection.remoteAddress;

  const usernameIPkey = getUsernameIPkey(req.body.username, ipAddr);
  let isDeviceTrusted = false;
  if (req.cookies && req.cookies.deviceId) {
    isDeviceTrusted = await checkDeviceWasUsedPreviously(req.body.username, req.cookies.deviceId);
  }

  const retrySecs = await checkUserBlock(req, res, usernameIPkey, ipAddr, isDeviceTrusted);

  if (retrySecs > 0) {
    res.status(429).send('Too Many Requests');
  } else {
    const { username, password } = req.body;
    login(username, password, async (err, user) => {
      if (!user) return res.status(500).send(err.errMessage);
      await incrementUserAttempts(req, res, user, ipAddr, usernameIPkey, isDeviceTrusted);
    });
  }
}

module.exports = {
  loginRoute
}