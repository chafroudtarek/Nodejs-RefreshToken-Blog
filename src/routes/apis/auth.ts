import {
  register,
  login,
  refreshToken,
  getLoggenInUser,
} from "./../../controllers/auth.controller";

import { Router } from "express";
import auth from "../../middleware/auth";

const router = Router();

router.post(
  "/register",
  register
);
router.post(
  "/login",
  login
);
router.get("/getloggenin",auth, getLoggenInUser);
router.get("/refresh", refreshToken);

export { router as authusers };
