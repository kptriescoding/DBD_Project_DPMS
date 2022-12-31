import { SQL_DB, SQL_HOST,SQL_PASS,SQL_USER } from "./env.js";
import mysql from "mysql2/promise"
   

const sqlInit=async()=>{
    let config={
        host: SQL_HOST,
        user: SQL_USER,
        password: SQL_PASS,
    }
    const dpool=mysql.createPool(config)

//Creating Database if doesn't exist
    let query
    try{
        query="CREATE DATABASE IF NOT EXISTS CPMS;"
    await dpool.execute(query)
    }catch(err){
        console.log(err)
    }
    config={
        host: SQL_HOST,
        user: SQL_USER,
        password: SQL_PASS,
        database:SQL_DB
    }
    const pool=mysql.createPool(config)
    try{
        query=`TYPE Timeline is 
        CREATE TABLE IF NOT EXISTS PROJECTS(
            ProjectID int PRIMARY KEY,
            Title varchar(255),
            ToolsToBeUsed varchar(255),
            from varchar(255),
            SkillsetRequired varchar(255),
            Timeline
            )`
        console.log(await pool.execute(query))
        console.log("Here")
        // query="CREATE TABLE IF NOT EXISTS PROFESSORS"
        // await pool.execute(query)
        // query="CREATE TABLE IF NOT EXISTS STUDENTS"
        // await pool.execute(query)
    }
    catch(err){

    }
    
}
let config={
    host: SQL_HOST,
    user: SQL_USER,
    password: SQL_PASS,
    database:SQL_DB
}
export const mysqlPool=mysql.createPool(config)
export default sqlInit