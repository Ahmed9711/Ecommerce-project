import mongoose from "mongoose";

export const ConnectionDB = async () => {
    return await mongoose.connect(process.env.DB_CLOUD)
    .then(() => console.log("DB Connected"))
    .catch(() => console.log("DB Connection error"));
}

mongoose.set('strictQuery',true)