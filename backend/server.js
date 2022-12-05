import express from "express"
import path from "path"
import cors from "cors"
import dotenv from "dotenv"
import mysql from "mysql"
import pg from 'pg'


const __dirname=path.resolve()
const Client=pg.Client
// var con = mysql.createConnection({
//    host: "localhost",
//    user: "yourusername",
//    password: "yourpassword"
//  });
 
//  con.connect((err)=>{
//    if (!err)
   // console.log("Connected!");
   // else 
   // console.log("Error")
//  });

dotenv.config({path:__dirname+"/.env"});

const client = new Client({
   user: process.env.PG_USER,
   host: process.env.PG_HOST,
   database: process.env.PG_USER,
   password: process.env.PG_PASS,
   port: 5432,
 })
 client.connect((err)=>{
   if (!err)
   console.log("Connected!");
   else 
   console.log("Error")
 });
 client.query("CREATE TABLE Persons (PersonID int,LastName varchar(255),FirstName varchar(255),Address varchar(255),City varchar(255));");
const app=express()

const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use(express.static(path.join(__dirname, "client","build")))


const PORT = process.env.PORT || 8081;
// app.get("*",(req,res)=>{
//     res.sendFile(path.join(__dirname, "client","build","index.html"))
// })

app.listen(PORT, console.log(`Server started on port ${PORT}`));