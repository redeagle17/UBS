import { UserModel } from "../models/user.model.js";

const createUser = async (firstName, lastName, email, password) => {
    
    if(!firstName || !email || !password){
        const error = new Error("All fields are required!");
        error.statusCode = 400;
        throw error;
    }

    const existingUser = await UserModel.findOne({ email })
    if(existingUser){
        const error = new Error("User already exist!");
        error.statusCode = 409;
        throw error;
    }

    await UserModel.create({
        fullName: { firstName, lastName },
        email,
        password
    });

    const user = await UserModel.findOne({ email }).select("-password");

    return user;
}

export { createUser };