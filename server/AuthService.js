const jwt = require('jsonwebtoken');
const crypto = require('crypto')

global.secretKey = null

function setSecretKey(key) {
  global.secretKey = key;
}

function isAuthenticated(token, userID) {
  console.log(token, userID);
  try {
    const user = jwt.verify(token, 'Hello World');
    console.log("Hello: ", jwt.verify(token, 'Hello World'), user.userID.userID, userID);
    if (user.userID.userID === userID) {
      return true;
    }
    else {
      return false;
    }
  } catch {
    return false;
  }
}

console.log(global.secretKey)

module.exports = {
  setSecretKey,
  isAuthenticated
};
