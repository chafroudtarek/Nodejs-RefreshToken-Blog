import { RefreshToken } from "../models/refreshToken.model";
import { User } from "../models/user";
import { Sequelize } from "sequelize-typescript";
import { config } from "../config/config";

const connection = new Sequelize({
  dialect: "mysql",
  host: config.database.host,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  logging: false,
  models: [
    User,
    RefreshToken
  ],
});

export default connection;
