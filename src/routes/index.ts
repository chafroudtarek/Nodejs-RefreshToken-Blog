import express from "express";
import { authusers } from "./apis/auth";


const router = express.Router();

router.use("/api/auth", authusers);


export default router;
