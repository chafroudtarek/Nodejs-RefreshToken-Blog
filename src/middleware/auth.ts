import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import logger from "../utils/logging";

const auth = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`  MIDDLEWARE => auth ...`);
  let token = req.headers.authorization?.split(" ")[1];

  if (token) {
    jwt.verify(
      token,
      config.server.token.secret,

      (error, decoded) => {
        if (error) {
          return res.status(403).json({
            message: "Token is not valid",
          });
        } else {
          res.locals.user = decoded;
          next();
        }
      }
    );
  } else {
    return res.status(401).json({
      message: "No Token, authorization denied",
      success: false,
    });
  }
};

export default auth;
