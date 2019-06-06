const Timestamp = require('mongodb').Timestamp;
const { getCollection, getId } = require("./database");

const addUser = async (user) => {
  user.lastSession = new Timestamp(new Date().getTime(), 1);
  if (!user.role) {
    user.role = 'user';
    user.status = 'pending';
  }
  return await getCollection('user').insertOne(user);
};

const updateUser = async (userId, newFields) => {
  const _id = getId(userId);
  const user = await getCollection('user').findOne({ _id });
  if (!user) {
    throw Error('User doesn\'t exist');
  }
  const newUser = Object.assign(user, newFields);
  await getCollection('user').updateOne(
    { _id },
    {
      $set: newUser 
    }
  );
};

const getUsers = async () => {
  const users = await getCollection('user').find().toArray();
  return users;
}

const getUserById = async (userId) => {
  const _id = getId(userId);
  return await getCollection('user').findOne({ _id });
}

const getUserByUsername = async (username) => {
  return await getCollection('user').findOne({ username });
}

module.exports = {
  addUser,
  updateUser,
  getUsers,
  getUserById,
  getUserByUsername
};
