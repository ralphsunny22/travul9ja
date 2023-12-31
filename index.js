import express from "express"
import dotenv from "dotenv";
import cors from "cors"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import multer from "multer"
import createSchema from "./routes/schema.js"
import authRoutes from "./routes/auth.js"
import transportModeRoutes from "./routes/transportModes.js"
import userRoutes from "./routes/users.js"

const app = express();
dotenv.config();

app.use(express.json()) //so dat we can send data to our db
//app.use(cookieParser())

//postman body form-data requests
const upload = multer();
app.use(upload.any());

// Parse URL-encoded bodies
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/db", createSchema)
app.use("/api/auth", authRoutes)
app.use("/api/transport-mode", transportModeRoutes)
app.use("/api/user", userRoutes)

const port = 5000;
app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
})
