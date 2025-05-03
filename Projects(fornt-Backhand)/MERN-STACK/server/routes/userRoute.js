import express from "express";

import { create, deleteUser, getAllUsers, getUserById, update, } from "../controller/userController.js";

const router = express.Router();

router.post("/user", create);
router.get("/users", getAllUsers); 
router.get("/user/:id", getUserById); 
router.put("/update/user/:id", update);
router.delete("/delete/user/:id", deleteUser)


export default router;