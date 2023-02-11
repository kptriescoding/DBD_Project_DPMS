import {Router} from "express"
import draggableTasks from "../models/DraggableTasks.js"
import { mysqlPool } from "../models/sqlInit.js"

const router=Router()
/**
 * @route   GET project/dragdrop/create
 * @desc    Create a dragdrop of a project
 * @access  Logged in
 */

router.post("/create",async(req,res)=>{
    const project=req.body.data
    try{
        let dragTask=await draggableTasks.findOne({ProjectID:project.projectID})
    if(dragTask)throw Error("Drag Task Exists")
    const newDragTask=new draggableTasks({
        ProjectID:project.projectID,
        Tasks:[],
        Columns:["To Do","In Progress","To Be Reviewed","Completed"]
    })
    const success=await newDragTask.save()
    if(!success)throw Error("Something Went Wrong")
    return res.status(200).json({
        success:true
    })
    }
    catch(err){
        console.log(err)
        return res.status(200).json({
            success:false
        })
    }
})

/**
 * @route   GET project/dragdrop/get
 * @desc    Get the stored dragdrop of a project
 * @access  Logged in
 */

router.post("/get",async (req,res)=>{
    const user=req.body.data
    let members=[]
    try{
        let dragTask=await draggableTasks.findOne({ProjectID:user.projectID})
        let profQuery=`Select * from Project where Project_ID=${user.projectID}`
        let studentQuery=`Select * from Works_on where Project_ID=${user.projectID}`
    if(!dragTask)throw Error("Drag Task Doesn't Exists")
    let sqlRes=await mysqlPool.query(profQuery)
    let prof=sqlRes[0][0]
    sqlRes=await mysqlPool.query(studentQuery)
    if(sqlRes[0])members=sqlRes[0].map((student)=>({label:student.Student_Email,value:student.Student_Email}))
    members.push({label:prof.Professor_Email,value:prof.Professor_Email})
    return res.status(200).json({
        dragTask:dragTask,
        members:members,
        success:true
    })
    }
    catch(err){
        console.log(err)
        return res.status(200).json({
            success:false
        })
    }
})

/**
 * @route   GET project/dragdrop/update
 * @desc    Update the stored dragdrop of a project
 * @access  Logged in
 */

router.post("/update",async (req,res)=>{
    const user=req.body.data
    try{
        // console.log(user.dragTask.Tasks[0])
        let dragTask=await draggableTasks.findOne({ProjectID:user.projectID})
    if(!dragTask)throw Error("Drag Task Doesn't Exists")
        dragTask=await draggableTasks.findOneAndReplace({ProjectID:user.projectID},user.dragTask)
        if(!dragTask)throw Error("Replace Failed")
    return res.status(200).json({
        dragTask:dragTask,
        success:true
    })
    }
    catch(err){
        console.log(err)
        return res.status(200).json({
            success:false
        })
    }
})

export default router

