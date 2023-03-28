import { SQL_DB, SQL_HOST,SQL_PASS,SQL_USER } from "../env.js";
import mysql from "mysql2/promise"
import {
    queryAnnouncementTable,
    queryApplicationTable,
    queryDeptTable,
    queryProfessorFieldOfExpertise,
    // queryProfessorPaperPublished,
    queryProfessorTable,
    queryProjectSkillTable,
    queryProjectTable,
    // queryStudentAchievementTable,
    queryStudentSkillTable,
    queryStudentTable,
    queryWorksOnTable,
    // defaultDepartmentQueries
} from "./sqlTableQueryPlanetScale.js"
   

const sqlInit=async()=>{
//     let config={
//         host: SQL_HOST,
//         user: SQL_USER,
//         password: SQL_PASS,
//     }
//     const dpool=mysql.createPool(config)

// //Creating Database if doesn't exist
//     let query
//     try{
//         query="CREATE DATABASE IF NOT EXISTS CPMS;"
//     await dpool.execute(query)
//     }catch(err){
//         console.log(err)
//     }
    config={
        host: SQL_HOST,
        user: SQL_USER,
        password: SQL_PASS,
        database:SQL_DB,
        port:3306,
        ssl:{"rejectUnauthorized":true}
    }
    const pool=mysql.createPool(config)
    try{
        
        await pool.execute(queryDeptTable)

        await pool.execute(queryProfessorTable)
        await pool.execute(queryProfessorFieldOfExpertise)
        // await pool.execute(queryProfessorPaperPublished)

        await pool.execute(queryStudentTable)
        // await pool.execute(queryStudentAchievementTable)
        await pool.execute(queryStudentSkillTable)

        await pool.execute(queryProjectTable)
        await pool.execute(queryProjectSkillTable)

        await pool.execute(queryApplicationTable)
        
        await pool.execute(queryWorksOnTable)

        await pool.execute(queryAnnouncementTable)
        // await pool.execute(defaultDepartmentQueries)
    }
    catch(err){
        console.log(err)
    }
    
}
let config={
    host: SQL_HOST,
    user: SQL_USER,
    password: SQL_PASS,
    database:SQL_DB,
    port:3306,
    ssl:{"rejectUnauthorized":true}
}
export const mysqlPool=mysql.createPool(config)
export default sqlInit