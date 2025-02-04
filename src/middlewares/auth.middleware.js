import { UserModel } from "../models/user.model.js";
import { blacklistModel } from "../models/blacklistToken.model.js";
import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {

    const token = req.cookies.token || req.headers.authorization.split(' ')[1];
    
    if(!token){
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    const blacklistToken = await blacklistModel.findOne({
        token: token
    });
     
    if(blacklistToken){
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    try {

        const decodeToken = jwt.verify(token, process.env.JWT_SECRET, {
            expiresIn: "24h"
        });
        const user = await UserModel.findById(decodeToken._id);
        req.user = user;

        return next();
        
    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Unauthorized",
            error: error
        })

    }

}

export { authUser };