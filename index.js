import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import multer from "multer"
import authRoutes from "./routes/auth.js"

const app = express();

app.use(express.json()) //so dat we can send data to our db
//app.use(cookieParser())

//postman body form-data requests
const upload = multer();
app.use(upload.any());

// Parse URL-encoded bodies
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/auth", authRoutes)

const port = 5000;
app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
})
