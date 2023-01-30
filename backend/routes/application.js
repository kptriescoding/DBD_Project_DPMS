import Router from "express";
import { mysqlPool } from "../models/sqlInit.js";
import applicationSchema from "../models/Application.js";
import studentApplicationSchema from "../models/StudentAppplications.js";

const router = Router();

/**
 * GENERAL APPLICATION ONLY PROJECT RELATED IN project.js
 */

export const createApplication= async (req, res) => {
  try {
    const application = req.body.data;
    // console.log(application)
    // console.log("hereI");
    let check = await applicationSchema.findOne({
      projectID: application.projectID,
    });
    if (check) throw Error("Application Exists");
    const newApplication = new applicationSchema({
      projectID: application.projectID,
      professorEmail: application.professorEmail,
      projectName: application.projectName,
      applicationStatus: "Open",
      announcement: [],
      appliedStudents: [],
    });
    const success = await newApplication.save();
    console.log("sfvds fdf ");
    if (!success) throw Error("Something Went Wrong");
    return success
  } catch (err) {
    throw err

  }
}

router.post("/students_apply", async (req, res) => {
  const student = req.body.data;
  console.log(student)
  try {
    let check = await applicationSchema.findOne({
      projectID: student.projectID,
    });
    let studentcheck = await studentApplicationSchema.findOne({
      email: student.email,
    });
    if (!studentcheck) {
      const newStudent= new studentApplicationSchema({
        email:student.email,
        appliedApplications:[]
     })
     studentcheck=await newStudent.save()
    }
    if (!check)check= await createApplication(req,res)
    let newStudents = check.appliedStudents;
    for (let i = 0; i < newStudents.length; i++) {
      if (newStudents[i].email === student.email)
        throw Error("Student Already Applied");
    }
    studentcheck.appliedApplications.push({
      projectName: check.projectName,
      projectID: check.projectID,
      professorEmail: check.professorEmail,
      status: "Applied",
    });
    newStudents.push({
      name: student.studentName,
      CGPA: student.CGPA,
      email: student.email,
      status: "Applied",
    });
    let success = await applicationSchema.findOneAndUpdate(
      { projectID: student.projectID },
      { appliedStudents: newStudents }
    );
    if (!success) throw Error("Something Went Wrong");
    success = await studentApplicationSchema.findOneAndUpdate(
      { email: student.email },
      { appliedApplications: studentcheck.appliedApplications }
    );
    return res.status(200).json({
      success: true,
      application: success,
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
    });
  }
});

router.post("/get_application", async (req, res) => {
  const projectID = req.body.data.projectID;
  try {
    let check = await applicationSchema.findOne({ projectID: projectID });
    if (!check) throw Error("Application Doesn't Exists");
    return res.status(200).json({
      success: true,
      application: check,
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
    });
  }
});

//Have to check these routers didn;t check yet below ones

router.post("/update_application", async (req, res) => {
  const projectID = req.body.data.projectID;
  const application = req.body.data;
  try {
    let check = await applicationSchema.findOne({ projectID: projectID });
    if (!check) throw Error("Application Doesn't Exists");
    check = await applicationSchema.findOneAndReplace(
      { projectID: projectID },
      application
    );
    if (!check)
      return res.status(200).json({
        success: true,
        application: check,
      });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
    });
  }
});

router.post("/get_all_applications", async (req, res) => {
  try {
    let check = await applicationSchema.find();
    if (!check) throw Error("Application Doesn't Exists");
    return res.status(200).json({
      success: true,
      application: check,
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
    });
  }
});

router.post("/accept_or_reject_student", async (req, res) => {
  let data=req.body.data
  console.log(data)
  try {
    let studentcheck = await studentApplicationSchema.findOne({
      email: data.studentEmail,
    });
    let check=await applicationSchema.findOne({projectID:data.projectId})
    if(!check)throw new Error("Application doesn;t exist")
    if (!studentcheck) throw new Error("Student doesn't exist ");
    

    let arr = studentcheck.appliedApplications;
    var foundIndex = arr.findIndex(
      (x) => x.projectID == data.projectID
    );
    arr[foundIndex].status = req.body.data.accept_or_reject;
    let updateSuccess = studentApplicationSchema.findOneAndUpdate(
      { email: data.studentEmail },
      { appliedApplications: arr }
    );
    if(!updateSuccess)throw Error("Something Went wrong")
    arr=check.appliedStudents;
    foundIndex=arr.findIndex((x)=>x.email===data.studentEmail)
    arr[foundIndex].status=data.accept_or_reject
    updateSuccess=applicationSchema.findOneAndUpdate({projectID:data.projectID},{appliedStudents:arr})
    if(!updateSuccess)throw Error("Something went wrong")
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
    });
  }
});

router.post("/get_all_applications_under_me", async (req, res) => {
  let professorEmail=req.body.data.professorEmail
  try {
    let check = await applicationSchema.find({
      professorEmail: professorEmail,
    });
    if (!check) throw Error("Professor Doesn't Exists");

    let ret = [];
  
    check.forEach((project) => {
      project.appliedStudents.forEach((student) => {
        // if(student.status!=="Applied")return;
        ret.push({
          professorEmail: professorEmail,
          projectID: project.projectID,
          projectName: project.projectName,
          student: student,
        });
      });
    });
    console.log(ret)
    return res.status(200).json({
      success: true,
      applications: ret,
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
    });
  }
});
export default router;
