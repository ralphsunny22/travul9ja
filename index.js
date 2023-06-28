import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

app.use(express.json()) //so dat we can send data to our db
app.use(cookieParser())
app.use(cors());

const port = 5000;
app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
})
