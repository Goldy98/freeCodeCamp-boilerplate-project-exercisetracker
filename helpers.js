
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from "dotenv";
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);


dotenv.config();

const { connect } = mongoose;

export let dbConnection;

export async function connectToDB(dbUrl) {
  try {
    dbConnection = await connect(dbUrl, { useUnifiedTopology: true, useNewUrlParser: true });
    console.log("Successfully connected to Database");
  } catch (error) {
    console.log('Failed to connect to database. ERROR:', error);
  }
}

export function getFormattedTodayDate() {
  const date = new Date();
  const day = date.getDate();
  const month = date.getUTCMonth() + 1;

  return `${date.getFullYear()}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
}