import {Router} from "express"
import { mysqlPool } from "../models/sqlInit.js"

const router=Router()

/**
 * @route   POST student/is_signup
 * @desc    Get if student has registered
 * @access  Public
 */

router.post("/is_signup",async (req,res)=>{
    // console.log("Here")
    // console.log(req.body.data)
    let user=req.body.data
    let query=`
    SELECT Email
    FROM Student
    WHERE Email="${user.email}"
    `
    try{
    let sqlRes =await mysqlPool.query(query)
    if(sqlRes[0].length===1)
        return res.status(200).json(
        {
            isSignup:true
        }
    )
    else
    return res.status(200).json(
        {
            isSignup:false
        })

    }
    catch(err){
        console.log(err)
        return res.status(200).json(
            {
                isSignup:false
            })
    }
    
    return ;
})


/**
 * @route   POST student/save_user
 * @desc    Saves the Student Details
 * @access  Logged in
 */
router.post("/save_user",async(req,res)=>{
    console.log(req.body.data);
    let user=req.body.data;
    let query=`
    INSERT INTO Student VALUES
    ("${user.firstName}",
    "${user.lastName}",
    "${user.middleName}",
    "${user.tempAddress}",
    "${user.permAddress}",
    "${user.USN}",
    "${user.CGPA}",
    "${user.resume}",
    "${user.Sem}",
    "${user.email}",
    "${user.deptName}"
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

/**
 * @route   POST student/get_user
 * @desc    Gets the Student Details
 * @access  Logged in
 */

router.post("/get_user",async(req,res)=>{
    let user=req.body.data
    let query=`
    SELECT *
    FROM Student
    WHERE Email="${user.email}"
    `
    let data;
    try{
     const sqlRes=await mysqlPool.query(query)
     user=sqlRes[0][0];
     data={
        firstName:user.First_Name,
        lastName:user.Last_Name,
        middleName:user.Middle_Name,
        tempAddress:user.Local_Address,
        permAddress:user.Permanent_Address,
        CGPA:user.CGPA,
        USN:user.USN,
        Sem:user.Semester,
        summary:user.Summary,
        resume:user.Resume,
        email:user.Email,
        deptName:user.Department_Name,
    }
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
            success:true,
            user:data
        }
    )
})

/**
 * @route   POST student/update_user
 * @desc    Saves the Student Details
 * @access  Logged in
 */
router.post("/update_user",async(req,res)=>{
    console.log(req.body.data);
    let user=req.body.data;
    let query = `
  UPDATE Student SET
    First_Name="${user.firstName}",
    Last_Name="${user.lastName}",
    Middle_Name="${user.middleName}",
    Local_Address="${user.tempAddress}",
    Permanent_Address="${user.permAddress}",
    USN="${user.USN}",
    CGPA="${user.CGPA}",
    Resume="${user.resume}",
    Semester="${user.Sem}",
    Department_Name="${user.deptName}"
    WHERE Email="${user.email}"
    `;
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
export default router;