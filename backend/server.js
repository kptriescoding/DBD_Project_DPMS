import express from "express"
import path from "path"
import cors from "cors"
import mongoose from "mongoose"

import sqlInit from "./models/sqlInit.js"
import {DATABASE_URL} from "./env.js"

import studentRouter from "./routes/student.js"
import professorRouter from "./routes/professor.js"
import projectRouter from "./routes/projects.js"
import dragdropRouter from "./routes/dragdrop.js"

const __dirname=path.resolve()

const url=DATABASE_URL
mongoose
    .connect(url,
        { useNewUrlParser: true,
             useUnifiedTopology: true
        })
    .then(() => console.log("Database Connected Successfully"))
    .catch(err => console.log(err));


sqlInit()


const app=express()

const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/student",studentRouter);
app.use("/professor",professorRouter)
app.use("/project",projectRouter);
app.use("/project/dragdrop",dragdropRouter)

app.use(express.static(path.join(__dirname, "client","build")))


const PORT = process.env.PORT || 8081;
// app.get("*",(req,res)=>{
//     res.sendFile(path.join(__dirname, "client","build","index.html"))
// })

app.listen(PORT, console.log(`Server started on port ${PORT}`));