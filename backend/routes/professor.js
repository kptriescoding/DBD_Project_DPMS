import { Router } from "express";
import { mysqlPool } from "../models/sqlInit.js";

const router = Router();

/**
 * @route   POST professor/is_signup
 * @desc    Get if professor has registered
 * @access  Public
 */

router.post("/is_signup", async (req, res) => {
  // console.log("Here")
  // console.log(req.body.data)
  let user = req.body.data;
  let query = `
    SELECT Email
    FROM Professor
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
    return res.status(200).json({
      isSignup: false,
    });
  }

  return;
});

/**
 * @route   POST professor/save_user
 * @desc    Saves the professor Details
 * @access  Logged in
 */
router.post("/save_user", async (req, res) => {
  console.log(req.body.data);
  let user = req.body.data;
  let query = `
    INSERT INTO Professor VALUES
    ("${user.firstName}",
    "${user.lastName}",
    "${user.middleName}",
    "${user.email}",
    "${user.yearOfJoining}",
    "${user.deptName}"
    )
    `;
  try {
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

router.post("/get_user", async (req, res) => {
  let user = req.body.data;
  let query = `
    SELECT *
    FROM Professor
    WHERE Email="${user.email}"
    `;
  let data;
  let skills=null
  let skillQuery=`
  SELECT Field_Of_Expertise
  From Professor_Field_Of_Expertise
  WHERE Professor_Email="${user.email}"
  `

  try {
    let sqlRes = await mysqlPool.query(query);
    user = sqlRes[0][0];
    sqlRes=await mysqlPool.query(skillQuery)
    if(sqlRes[0])skills=sqlRes[0].map((skill)=>({label:skill.Field_Of_Expertise,value:skill.Field_Of_Expertise}))
    if(skills===null)skills=[]
    data = {
      firstName: user.First_Name,
      lastName: user.Last_Name,
      middleName: user.Middle_Name,
      yearOfJoining: user.Year_Of_Joining,
      email: user.Email,
      deptName: user.Department_Name,
      skills:skills
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
 * @route   POST professor/get_students_working_under_me
 * @desc    Gets the Students Working Under the Professor
 * @access  Logged in
 */

router.post("/get_students_working_under_me", async (req, res) => {
  console.log(req.body.data);
  let user = req.body.data;
  let query = `
    SELECT * FROM Student 
    WHERE Email=(SELECT Student_Email FROM Works_on
    WHERE  Project_ID=(SELECT Project_ID
    FROM Project
    WHERE Professor_Email="${user.email}"))
    `;
  try {
    var students = [];
    const sqlRes = await mysqlPool.query(query);

    for (let i = 0; i < sqlRes.length; i++) {
      let user = sqlRes[i][0];
      students.push({
        firstName: user.First_Name,
        lastName: user.Last_Name,
        middleName: user.Middle_Name,
        cgpa: user.cgpa,
        deptName: user.Department_Name,
        usn: user.usn,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
    });
  }
  return res.status(200).json({
    success: true,
    studetns: students,
  });
});

/**
 * @route   POST professor/update_user
 * @desc    Update the professor Details
 * @access  Logged in
 */
router.post("/update_user", async (req, res) => {
  let user = req.body.data;
  let skills=user.skills
  let query = `
  UPDATE Professor SET
    First_Name="${user.firstName}",
    Last_Name="${user.lastName}",
    Middle_Name="${user.middleName}",
    Year_of_Joining="${user.yearOfJoining}",
    Department_Name="${user.deptName}"
    WHERE Email="${user.email}"
    `;
    let skillQuery
    let deleteQuery=`
    DELETE FROM Professor_Field_Of_Expertise WHERE Professor_Email="${user.email}"`
try {
await mysqlPool.query(deleteQuery)
    for(let i in skills){
      skillQuery=`REPLACE INTO Professor_Field_Of_Expertise VALUES ("${skills[i]}","${user.email}")`
      await mysqlPool.query(skillQuery)
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

router.post("/get_professor_admin", async (req, res) => {
  console.log(req.body.data);
  let queryOption = req.body.data;
  let query = "";
  if (queryOption.query === "List Of Professors")
    query = "select * from Professor";
  else if (queryOption.query === "Count of Students under Each Professor")
    query =
      "select p.Email,count(distinct st.Student_Email) as No_Of_Students from Professor as p,Works_on as st where exists (select * from Project where Professor_Email=p.Email AND st.Project_ID=Project.Project_ID) group by p.Email;";
  else if (
    queryOption.query ===
    "No Of Projects,total funding raised,  Under Each Professor"
  )
    query =
      "select First_Name,Last_Name,p.Email as Professor_Email,count(pr.Project_ID) as No_Of_Projects,sum(pr.Funding) as Funding_Amount_in_Rs  from Professor as p,Project as pr where pr.Professor_Email=p.Email group by Email;";
  let sqlRes;
  try {
    sqlRes = await mysqlPool.query(query);
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
    });
  }
  return res.status(200).json({
    success: true,
    professors: sqlRes[0],
  });
});

export default router;
