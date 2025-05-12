import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import route from "./routes/userRoute.js"
import cors from "cors"

const app = express();
app.use(bodyParser.json());
app.use(cors());
dotenv.config();
const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;

mongoose
    .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { 
        console.log("Connected to MongoDB Atlas");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) =>  console.log('Error connecting to MongoDB:', err));        

app.use("/api", route);