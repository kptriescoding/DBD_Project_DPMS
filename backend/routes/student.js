import { Router } from "express";
import { mysqlPool } from "../models/sqlInit.js";
import studentApplicationSchema from "../models/StudentAppplications.js";

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

router.post("/get_students_admin", async (req, res) => {
  let queryOption = req.body.data;
  let query = "";
  if (queryOption.query === "List Of Students") query = "select * from Student";
  else if (queryOption.query === "No Of Projects Each Student is Working On")
    query =
      "select First_Name,Last_Name,Email,CGPA ,count(Student_Email) as Projects_Working_On from Student,Works_on where Student.Email=Student_Email group by Student_Email;";

  try {
    var students = [];
    const sqlRes = await mysqlPool.query(query);
    if (queryOption.query === "List Of Students") {
      for (let i = 0; i < sqlRes[0].length; i = i + 1) {
        let cur = sqlRes[0][i];
        students.push({
          First_Name: cur.First_Name,
          Last_Name: cur.Last_Name,
          Email: cur.Email,
          USN: cur.USN,
          Department_Name: cur.Department_Name,
          CGPA: cur.CGPA,
        });
      }
    } else if (
      queryOption.query === "No Of Projects Each Student is Working On"
    ) {
      for (let i = 0; i < sqlRes[0].length; i = i + 1) {
        let cur = sqlRes[0][i];
        students.push({
          First_Name: cur.First_Name,
          Last_Name: cur.Last_Name,
          Email: cur.Email,
          CGPA: cur.CGPA,
          Projects_Working_On: cur.Projects_Working_On,
        });
      }
    }
    return res.status(200).json({
      success: true,

      result: students,
    });
  } catch (err) {
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
