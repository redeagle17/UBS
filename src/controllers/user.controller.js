import { UserModel } from "../models/user.model.js";
import { createUser } from "../services/user.service.js";
import { validationResult } from "express-validator";

const registerUser = async (req, res, next) => {
    try {

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            })
        }

        const {fullName, email, password} = req.body;

        const hashedPassword = await UserModel.hashPassword(password)
        const user = await createUser(fullName.firstName, fullName.lastName, email, hashedPassword)
        const token = user.generateAuthToken()

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user
        })
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
}

const loginUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            })
        }
    } catch (error) {
        
    }
}

export { registerUser, loginUser };