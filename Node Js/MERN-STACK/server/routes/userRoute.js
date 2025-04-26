import express from "express";

import { create, getAllUsers } from "../controller/userController.js";

const router = express.Router();

router.post("/user", create);
router.get("/users", getAllUsers); 

export default router;