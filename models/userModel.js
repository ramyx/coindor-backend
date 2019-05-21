const { getCollection, getId } = require("./database");

const updateUser = async (userId, newFields) => {
  const _id = getId(userId);
  const user = await getCollection('user').findOne({ _id });
  if (!user) {
    throw Error('User doesn\'t exist');
  }
  const newUser = Object.assign(user, newFields);
  await getCollection('user').updateOne({ _id }, { $set: newUser });
};

const getUsers = async () => {
  const users = await getCollection('user').find().toArray();
  return users;
}

module.exports = {
  updateUser,
  getUsers
};
