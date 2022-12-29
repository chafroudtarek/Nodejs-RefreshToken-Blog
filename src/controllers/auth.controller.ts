import { User } from "../models/user";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import logger from "../utils/logging";
import { ApplicationError } from "../shared/applicationError";
import { AuthError } from "../shared/errors/authError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { createRefreshToken, verifyExpiration } from "../utils/refreshtoken";
import { RefreshToken } from "../models/refreshToken.model";

const NAMESPACE = "AUTH CONTROLLER";

/**
 **asyncHandler : for handling exceptions that occur within async functions by passing them to our express error handlers.
 ** This will ensure that any errors that occur are properly handled and communicated to the client.
 */
export const getLoggenInUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(` ${NAMESPACE} : Starting getLoggenInUser ...`);

    /**
     ** We can access the user that was stored in res.locals.user by the middleware
     ** This variable is useful for retrieving the logged in user and using it in our controllers.
     */
    const { id } = res.locals.user;
    //Check if the user exists in our database.
    const response = await User.findByPk(id);

    if (!response) {
      //**This code returns a custom error that has been handled by our error handler.
      throw new ApplicationError(AuthError.FAILED_AUTHENTIFICATION);
    }
    //here is our response
    res.status(200).json({ response, success: true });
    logger.info(` ${NAMESPACE} : getLoggenInUser get terminated ...`);
  }
);

export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(` ${NAMESPACE} : Starting register ...`);

    const { email, firstname, lastname, phone, password } = req.body;

    if (!email || !password) {
      throw new ApplicationError(AuthError.BAD_REQUEST);
    }

    const user = await User.findOne({ where: { email } });

    if (user) {
      logger.error(
        ` ${NAMESPACE} : email exist in  register function line 51'"`
      );
      throw new ApplicationError(AuthError.EMAIL_ALREADY_EXIST);
    }
    const _user = new User({
      firstname,
      lastname,
      email,
      password,
      phone,
    });
    //Hashing user password
    const hash = bcrypt.hashSync(password, 5);
    _user.password = hash;
    await _user.save();

    logger.info(` ${NAMESPACE} :  register  successfully line 66 `);

    //Generate user token
    const token = jwt.sign({ id: _user.id }, config.server.token.secret, {
      expiresIn: config.server.token.expireTime,
    });

    res.status(200).json({
      message: "Register Successful",
      accessToken: token,
      user: _user,
    });
    logger.info(` ${NAMESPACE} : register get terminated ...`);
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(` ${NAMESPACE} : Starting login ...`);
    const { email } = req.body;
    if (!email) {
      logger.error(` ${NAMESPACE} : invlaid data in  login function line 91`);
      throw new ApplicationError(AuthError.BAD_REQUEST);
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      logger.error(
        ` ${NAMESPACE} : user doesn't found in  login function line 97`
      );
      throw new ApplicationError(AuthError.NOT_FOUND);
    }
    const isMatch = bcrypt.compareSync(req.body.password, user.password);

    if (!isMatch) {
      logger.error(
        ` ${NAMESPACE} : wrong password in  login function line 104`
      );
      throw new ApplicationError(AuthError.CREDENTIALS_ERROR);
    }

    //**generate refresh token for the user  */
    let refreshToken = await createRefreshToken(user);
    const token = jwt.sign({ id: user.id }, config.server.token.secret, {
      expiresIn: config.server.token.expireTime,
    });
    logger.info(` ${NAMESPACE} :  login  successfully line 75`);
    const { password, ...filteruser } = user.dataValues;

    //** Set the refresh token in the cookies of the response object with an expiry of 24 hours
    //**Send the response back to the client with the refresh token in the cookies.  */
    res
      .cookie("refreshToken", refreshToken, {
        expires: new Date(new Date().getTime() + 60 * 60 * 24 * 1000),
      })
      .status(200)
      .json({
        message: "Authentication Successful",
        accessToken: token,
        user: filteruser,
        success: true,
      });

    logger.info(` ${NAMESPACE} : login get terminated ...`);
  }
);

export const refreshToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(` ${NAMESPACE} : Starting refreshToken ...`);

    //**Retrieve the refresh token from the cookies" */
    const { refreshToken } = req.cookies;
    if (refreshToken == null) {
      logger.error(
        ` ${NAMESPACE} :  refresh token is required  in  refresh function line 145`
      );
      throw new ApplicationError(AuthError.REQUIRED_REFRESH_TOKEN);
    }
    //Check if it exists
    const checkrefreshToken : any  = await RefreshToken.findOne({ where: { token:refreshToken } });
    if (verifyExpiration(checkrefreshToken)) {
      await RefreshToken.destroy({ where: { token:refreshToken } });
      logger.error(
        ` ${NAMESPACE} :  refresh token is expired  in  refresh function line 154`
      );
      throw new ApplicationError(AuthError.EXPIRED_TOKEN);
    }
    
    //**If the refresh token exists and has been verified, generate a new access token
    let newAccessToken = jwt.sign(
      { email: refreshToken.email },
      config.server.token.secret,
      {
        expiresIn: config.server.token.expireTime,
      }
    );
    logger.info(` ${NAMESPACE} :  refresh token  successfully line 167`);
    res.status(200).json({
      accessToken: newAccessToken,
    });
    logger.info(` ${NAMESPACE} : refreshToken get terminated ...`);
  }
);
