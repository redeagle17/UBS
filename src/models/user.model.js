import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {   
        fullName: {
            firstName: {
                type: String,
                required: true,
                minLength: [3, "First name must be at least 3 characters long"]
            },
            lastName: {
                type: String,
                minLength: [3, "Last name must be at least 3 characters long"]
            },
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        socketId: {
            type: String
        }
    }
)

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET, { expiresIn: "24h"})
    return token;
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

export const UserModel = mongoose.model("User", userSchema)