import { UserModel } from "../models/user.model.js";
import { blacklistModel } from "../models/blacklistToken.model.js";
import { createUser, existingUser } from "../services/user.service.js";
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
        const {email, password} = req.body;
        
        const user = await existingUser(email);

        const isPasswordCorrect = await user.comparePassword(password);
        if(!isPasswordCorrect){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            })
        }

        const token = user.generateAuthToken()
        res.cookie("token", token);

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
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

const getUserProfile = async (req, res, next) => {
    return res.status(200).json({
        success: true,
        user: req.user
    })
}

const logoutUser = async (req, res, next) => {
    
    res.clearCookie("token");
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];
    await blacklistModel.create({ token });

    return res.status(200).json({
        success: true,
        message: "Logged Out"
    });
}

export { registerUser, loginUser, getUserProfile, logoutUser };