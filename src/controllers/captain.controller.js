import { CaptainModel } from "../models/captain.model.js";
import { blacklistModel } from "../models/blacklistToken.model.js";
import { validationResult } from "express-validator";
import { createCaptain, existingCaptain } from "../services/captain.service.js";

const registerCaptain = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            })
        }

        const {fullName, email, password, vehicle} = req.body;

        const isCaptainExist = await CaptainModel.findOne({email});
        if(isCaptainExist){
            return res.status(400).json({
                success: false,
                message: "Captain already exist!"
            })
        }

        const hashedPassword = await CaptainModel.hashPassword(password)
        const user = await createCaptain(fullName.firstName, fullName.lastName, email, hashedPassword,vehicle.color, vehicle.plate, vehicle.capacity, vehicle.vehicleType)
        const token = user.generateAuthToken()

        return res.status(201).json({
            success: true,
            message: "Captain registered successfully",
            token,
            user
        })

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Interval Server error"
        })
    }
}


const loginCaptain = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array()
            })
        }
        const {email, password} = req.body;
        
        const user = await existingCaptain(email);

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
            message: "Captain logged in successfully",
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

const getCaptainProfile = async (req, res, next) => {
    return res.status(200).json({
        success: true,
        captain: req.captain
    })
}

const logoutCaptain = async (req, res, next) => {
    
    res.clearCookie("token");
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1]
    await blacklistModel.create({ token });

    return res.status(200).json({
        success: true,
        message: "Logged Out"
    });
}

export { registerCaptain, loginCaptain, getCaptainProfile, logoutCaptain };