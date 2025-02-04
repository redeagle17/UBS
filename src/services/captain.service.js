import { CaptainModel } from "../models/captain.model.js";

const createCaptain = async (firstName, lastName, email, password, color, plate, capacity, vehicleType) => {

    if(!firstName || !email || !password || !color || !plate || !capacity || !vehicleType){
        const error = new Error("All fields are required!");
        error.statusCode = 400;
        throw error;
    }

    const existingCaptain = await CaptainModel.findOne({ email })
    if(existingCaptain){
        const error = new Error("User already exist!");
        error.statusCode = 409;
        throw error;
    }

    await CaptainModel.create({
        fullName: { firstName, lastName },
        email: email,
        password: password,
        vehicle: {
            color, 
            plate, 
            capacity, 
            vehicleType
        }
    });

    const captain = await CaptainModel.findOne({ email }).select("-password");

    return captain;
}

const existingCaptain = async (email) => {

    const existingCaptain = await CaptainModel.findOne({ email }).select("+password");
    if(!existingCaptain){
        const error = new Error("User not found!");
        error.statusCode = 404;
        throw error;
    }
    return existingCaptain;
}

export { createCaptain, existingCaptain };