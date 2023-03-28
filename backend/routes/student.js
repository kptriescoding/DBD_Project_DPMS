import { Router } from "express";
import { mysqlPool } from "../models/sqlInit.js";
import studentApplicationSchema from "../models/StudentAppplications.js";
import sendEmailMailGet from "../mailApi/sendMailgetAPI.js";
const router = Router();

/**
 * @route   POST student/is_signup
 * @desc    Get if student has registered
 * @access  Public
 */

router.post("/is_signup", async (req, res) => {
  let user = req.body.data;
  let query = `
    SELECT Email
    FROM Student
    WHERE Email="${user.email}"
    `;
  try {
    let sqlRes = await mysqlPool.query(query);
    if (sqlRes[0].length === 1)
      return res.status(200).json({
        isSignup: true,
      });
    else
      return res.status(200).json({
        isSignup: false,
      });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      isSignup: false,
    });
  }

  return;
});

/**
 * @route   POST student/save_user
 * @desc    Saves the Student Details
 * @access  Logged in
 */
router.post("/save_user", async (req, res) => {
  let user = req.body.data;
  let query = `
    INSERT INTO Student VALUES
    ("${user.firstName}",
    "${user.lastName}",
    "${user.middleName}",
    "${user.tempAddress}",
    "${user.permAddress}",
    "${user.USN}",
    "${user.CGPA}",
    "${user.Sem}",
    "${user.email}",
    "${user.deptName}"
    )
    `;
  try {
    await mysqlPool.query(query);
    const newStudent = new studentApplicationSchema({
      email: user.email,
      appliedApplications: [],
    });
    const res = await newStudent.save();
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
    });
  }
  let subject=" Welcome to our Project Management System!"
    let text=`Dear ${user.firstName},

    We hope this email finds you well. We am writing to extend a warm welcome to our Project Management System and to thank you for choosing us as your platform for managing your projects as a student.
    
    We are thrilled to have you on board and would like to make sure that your experience with our system is as smooth and productive as possible. Our platform is designed to help you stay organized, manage your tasks efficiently and collaborate with your team effectively.
    
    If you have any questions or need help at any time, please do not hesitate to reach out to our support team. Our team is always ready to assist you and ensure that you get the most out of our system.
    
    We are committed to providing you with the best possible experience, and we look forward to supporting you as you use our platform to achieve your goals as a student.
    
    Best regards,
    
    College Project Management System
    RVCE`
    sendEmailMailGet(user.email,subject,text)
  return res.status(200).json({
    success: true,
  });
});

/**
 * @route   POST student/get_user
 * @desc    Gets the Student Details
 * @access  Logged in
 */

router.post("/get_user", async (req, res) => {
  let user = req.body.data;
  let query = `
    SELECT *
    FROM Student
    WHERE Email="${user.email}"
    `;
  let skillQuery = `
  SELECT *
  FROM Student_Skill
  WHERE Student_Email="${user.email}"
  `;
  let data;
  let skills;
  try {
    let sqlRes = await mysqlPool.query(query);
    user = sqlRes[0][0];
    sqlRes = await mysqlPool.query(skillQuery);
    if (sqlRes[0])
      skills = sqlRes[0].map((skill) => ({
        label: skill.Skill,
        value: skill.Skill,
      }));
    if (skills === null) skills = [];
    data = {
      firstName: user.First_Name,
      lastName: user.Last_Name,
      middleName: user.Middle_Name,
      tempAddress: user.Local_Address,
      permAddress: user.Permanent_Address,
      CGPA: user.CGPA,
      USN: user.USN,
      Sem: user.Semester,
      summary: user.Summary,
      email: user.Email,
      deptName: user.Department_Name,
      skills: skills,
    };
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
    });
  }
  return res.status(200).json({
    success: true,
    user: data,
  });
});

/**
 * @route   POST student/update_user
 * @desc    Saves the Student Details
 * @access  Logged in
 */
router.post("/update_user", async (req, res) => {
  let user = req.body.data;
  let skills = user.skills;
  let query = `
  UPDATE Student SET
    First_Name="${user.firstName}",
    Last_Name="${user.lastName}",
    Middle_Name="${user.middleName}",
    Local_Address="${user.tempAddress}",
    Permanent_Address="${user.permAddress}",
    USN="${user.USN}",
    CGPA="${user.CGPA}",
    Semester="${user.Sem}",
    Department_Name="${user.deptName}"
    WHERE Email="${user.email}"
    `;
  let skillQuery;
  let deleteQuery = `
        DELETE FROM Student_Skill WHERE Student_Email="${user.email}"`;
  try {
    await mysqlPool.query(deleteQuery);
    for (let i in skills) {
      skillQuery = `INSERT INTO Student_Skill VALUES ("${skills[i]}","${user.email}")`;
      await mysqlPool.query(skillQuery);
    }
    await mysqlPool.query(query);
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
    });
  }
  return res.status(200).json({
    success: true,
  });
});

router.post("/get_students_report", async (req, res) => {
  let queryOption = req.body.data;
  let query = "";
const queryOptions={
  "List Of Students":"select * from Student",
  "No Of Projects Each Student is Working On":"select First_Name,Last_Name,Email,CGPA ,count(Student_Email) as Projects_Working_On from Student,Works_on where Student.Email=Student_Email group by Student_Email;",
  "Student Working Under This Professor":`Select * from Student where Email in (Select Student_Email from Works_on WHERE Project_ID in (Select Project_ID from Project Where Professor_Email="${queryOption.email}"))`,
  "No of Students Working Under This Professor For Each Project":`Select P.Project_ID,P.Title,P.Description ,count(P.Project_ID) as Students_Working_On from Student as S , Works_on as W ,Project as P where S.Email =W.Student_Email and W.Project_ID=P.Project_ID and P.Professor_Email="${queryOption.email}" GROUP BY P.Project_ID`,
  "List of Students Working Under This Professor With Project Name":`Select P.Project_ID,P.Title,P.Description ,S.First_Name,S.Last_Name,S.Middle_Name,S.Email from Student as S , Works_on as W ,Project as P where S.Email =W.Student_Email and W.Project_ID=P.Project_ID and P.Professor_Email="${queryOption.email}" `,
  "List of Students Along with their Projects":`Select P.Project_ID,P.Title,P.Description ,S.First_Name,S.Last_Name,S.Middle_Name,S.Email from Student as S , Works_on as W ,Project as P where S.Email =W.Student_Email and W.Project_ID=P.Project_ID`
}
query=queryOptions[queryOption.query]
if(!query)query=""
console.log(queryOptions[queryOption.query])
  try {
    const sqlRes = await mysqlPool.query(query);
    return res.status(200).json({
      success: true,
      result: sqlRes[0],
    });
  } catch (err) {
    if(query)
    console.log(err);
    return res.status(200).json({
      success: false,
    });
  }
});


router.post("/get_students_for_professor_apply", async (req, res) => {
  let input = req.body.data;

  // let query = `
  // select * from Student where Email not in (select Email from Application where forStudent=1 AND Project_ID="${input.Project_ID}")
  // `;
  let query = `
  select * from Student`;

  let ans;
  try {
    ans = await mysqlPool.query(query);
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
    });
  }
  return res.status(200).json({
    success: true,
    students: ans[0],
  });
});
export default router;
