import express from "express";
const app = express()
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { connectToDB, __dirname } from "./helpers.js";
import { addExercices, createUser, getUsers } from "./handler.js";

const { urlencoded } = bodyParser;

dotenv.config();

app.use(cors());

app.use(express.static('public'));

app.use(urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users.map((user) => {
      return { _id: user.id, username: user.username };
    }))
  } catch (error) {
    console.log('error:', error);
    res.json({ data: null });
  }
});

app.post("/api/users", async (req, res) => {
  const { username } = req.body;

  try {
    const result = await createUser(username);
    res.json(result);
  } catch (error) {
    console.log('error:', error);
    res.json({ data: null })
  }
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  const { description, duration, date } = req.body;
  const { _id } = req.params;

  try {
    const user = await addExercices(_id, description, duration, date);
    res.json(user);
  } catch (error) {
    console.log('error:', error);
    res.json({ data: null })
  }
});

app.get("/api/users/:_id/logs", async (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;
  console.log('req.query:', req.query);

  try {
    const usersData = await getUsers({ from, to, limit });
    res.json(usersData.map((user) => {
      return {
        _id: user.id,
        username: user.username,
        log: user.exercices.map((exo) => {
          return {
            description: exo.description,
            duration: exo.duration,
            date: exo.date
          }
        }),
        count: user.exercices.length
      }
    }));
  } catch (error) {
    console.log('error:', error);
    res.json({ data: null })
  }
});


const listener = app.listen(process.env.PORT || 3000, async () => {
  await connectToDB(process.env.MONGO_URL);

  console.log('Your app is listening on port ' + listener.address().port)

})
