import { Router } from "express";
import { body } from "express-validator";
import { authUser } from "../middlewares/auth.middleware.js";
import { registerCaptain, loginCaptain } from "../controllers/captain.controller.js";

const router = Router()

router.post("/register",[
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullName.firstName").isLength({min:3}).withMessage("First name must be at least 3 characters"),
    body("password").isLength({min:6}).withMessage("Password must be of 6 character long."),
    body("vehicle.color").isLength({ min: 3 }).withMessage("Color must be at least 3 characters long"),
    body("vehicle.plate").isLength({ min: 3 }).withMessage("Plate must be at least 3 characters long"),
    body("vehicle.capacity").isInt({ min: 1 }).withMessage("Capacity must be at least 1"),
    body("vehicle.vehicleType").isIn([ "car", "motorcycle", "auto" ]).withMessage("Invalid vehicle type")
], registerCaptain)

router.post("/login", [
    body("email").isEmail().withMessage("Invalid Email")
], loginCaptain)


export default router;