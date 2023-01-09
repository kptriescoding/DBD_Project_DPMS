import { Router } from "express";
import { mysqlPool } from "../models/sqlInit.js";

const router=Router()

/**
 * @route   POST project/create
 * @desc    Create a new Project
 * @access  Logged in as Professor
 */
router.post("/create",async(req,res)=>{
    console.log(req.body.data);
    let project=req.body.data;
    let query=`
    INSERT INTO Project VALUES
    ("${project.title}",
    "${project.description}",
    "${project.collaborator}",
    "${project.startDate}",
    "${project.endDate}",
    "${project.projectID}",
    "${project.professorEmail}",
    "${project.funding}"
    )
    `
    try{
     await mysqlPool.query(query)
    }
    catch(err){
        console.log(err)
        return res.status(200).json(
            {
                success:false
            })
    }
    return res.status(200).json(
        {
            success:true
        }
    )
})

export default router