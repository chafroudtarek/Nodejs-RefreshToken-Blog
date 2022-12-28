import connection from "./utils/connection";
import { config } from "./config/config";
import logger from "./utils/logging";
import cors from "cors";
import routes from "./routes/index";
import cookieparser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler";
import express from "express";


const NAMESPACE = "Main";


const app = express();

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.use(express.json());
app.use(cookieparser());

app.use(routes);
app.use(errorHandler);

const start = async () => {
  try {
    connection.sync();
    app.listen(config.server.port, () => {
      logger.info(
        ` ${NAMESPACE} : Server running on ${config.server.hostname}:${config.server.port}`
      );
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void start();
