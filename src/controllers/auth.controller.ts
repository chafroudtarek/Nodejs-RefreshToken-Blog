
import { User } from "../models/user";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import logger from "../utils/logging";

const NAMESPACE = "AUTH CONTROLLER";

export const getLoggenInUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info(` ${NAMESPACE} : Starting getLoggenInUser ...`);
  const { id } = res.locals.user;

  //All of the processes will be present in this part

  logger.info(` ${NAMESPACE} : getLoggenInUser get terminated ...`);
};

export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(` ${NAMESPACE} : Starting register ...`);
  
    //All of the processes will be present in this part

    logger.info(` ${NAMESPACE} : register get terminated ...`);
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(` ${NAMESPACE} : Starting login ...`);

    //All of the processes will be present in this part

    logger.info(` ${NAMESPACE} : login get terminated ...`);
  }
);

export const refreshToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(` ${NAMESPACE} : Starting refreshToken ...`);
    
    //All of the processes will be present in this part

    logger.info(` ${NAMESPACE} : refreshToken get terminated ...`);
  }
);


