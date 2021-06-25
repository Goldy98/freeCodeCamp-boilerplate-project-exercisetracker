import { getFormattedTodayDate } from "./helpers.js";
import { Users } from "./models.js";

export async function createUser(username) {
  const user = new Users({ username });
  await user.save();
  return {
    _id: user._id,
    username,
  }
}

export async function getUsers({ from, to, limit }) {
  let users;

  if (from && to && limit) {
    users = await Users.find({ "exercices.date": { $gte: from, $lte: to } }).limit(parseInt(limit));
  } else {
    users = await Users.find();
  }
  return users;
}

export async function addExercices(userId, description, duration, date) {
  const theUser = await Users.findById(userId);

  const dateToUse = date ? date : getFormattedTodayDate();

  theUser.exercices.push({ description, duration, date: dateToUse });

  await theUser.save();

  return theUser;

}