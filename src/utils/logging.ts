import winston from "winston";
import { format, createLogger } from "winston";

const { combine, timestamp, prettyPrint } = format;
const CATEGORY = "winston custom format";

var options = {
  file: {
    level: "error",
    filename: "logs/error.log",
    handleExceptions: true,
    colorize: true,
  },
};

const logger = createLogger({
  level: "debug",
  format: combine(
    timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),

    prettyPrint()
  ),

  transports: [
    new winston.transports.File(options.file),
    new winston.transports.File({ filename: "logs/combined.log" }),
    new winston.transports.Console(),
  ],
});

export default logger;
