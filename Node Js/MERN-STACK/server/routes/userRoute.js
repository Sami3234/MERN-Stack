import express from "express";

import { create } from "../controller/userController.js";

const router = express.Router();

router.post("/user", create);

export default router;