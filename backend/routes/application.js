import Router from "express";
import sendEmailMailGet from "../mailApi/sendMailgetAPI.js";
import { mysqlPool } from "../models/sqlInit.js";

const router = Router();

export const createNotifications = async (req, res) => {
  const notification = req.body.data;
  const query = `
    Insert into Application values(
      ${notification.forStudent},
      0,
      "${notification.description}",
      "${notification.applicationStatus}",
      "${notification.Project_ID}",
      "${notification.Email}",
      "${notification.notificationTime}"
    )
    `;
  try {
    await mysqlPool.query(query);
    // await mysqlPool.query(query1);
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
    });
  }
  return res.status(200).json({
    success: true,
  });
};

router.post("/ask_student_to_join", async (req, res) => {
  createNotifications(req, res);
});
router.post("/apply_for_project", async (req, res) => {
  createNotifications(req, res);
  console.log("success");
});
router.post("/close_open_project_application", async (req, res) => {
  let project = req.body.data;
  let query = `
  UPDATE Application SET 
  notificationTime ="${project.notificationTime}",
    isClosed=${project.close}
    WHERE 
    Project_ID = "${project.Project_ID}" 
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

router.post("/get_notification_for_student", async (req, res) => {
  let student = req.body.data;
  let query = `(
    select * from Application where 
    forStudent=1 AND 
    Email="${student.Email}" AND
    applicationStatus!="pending"
    ORDER BY notificationTime DESC
  )`;

  try {
    let result = await mysqlPool.query(query);
    return res.status(200).json({
      success: true,
      notification: result[0],
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
    });
  }
});

router.post("/get_notification_for_professor", async (req, res) => {
  let professor = req.body.data;
  let query = `
    select * from Application where 
    forStudent=0 AND 
    Project_ID in (
      select Project_ID from Project where Professor_Email="${professor.Professor_Email}"
    ) AND isClosed=0 ORDER BY notificationTime DESC 
  `;
  let result;
  try {
    result = await mysqlPool.query(query);
    return res.status(200).json({
      success: true,
      notification: result[0],
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
    });
  }
});

router.post("/update_application_from_professor", async (req, res) => {
  let professor = req.body.data;
  let query1 = `
  UPDATE Application SET 
    description = "${professor.description}",
    applicationStatus="${professor.applicationStatus}",
    notificationTime ="${professor.notificationTime}"
    WHERE Email="${professor.Email}" AND
    Project_ID = "${professor.Project_ID}" AND
    forStudent=0
  `;

  let query2 = `
  Insert into Works_on values(
    "${professor.Email}",
    "${professor.Project_ID}"
  )
  `;
  let query3 = `
  Insert into Application values(
    1,
    1,
    "${professor.description}",
    "${professor.applicationStatus}",
    "${professor.Project_ID}",
    "${professor.Email}",
    "${professor.notificationTime}"
  )
  `;
  try {
    let res1 = await mysqlPool.query(query1);
    let res3 = await mysqlPool.query(query3);
    if (professor.applicationStatus == "accept") {
      let res2 = await mysqlPool.query(query2);
    }
    let subject=" Welcome to our Project Management System!"
    let text=`Dear Student,

    I hope this email finds you well. I am writing to update you on the status of your recent project application.
    
    The status of your application has been updated on our website. You can check the status of your application by logging into your account and visiting the "Applications" section.
    
    If your application has been accepted, please take the necessary steps to confirm your participation in the project as soon as possible. Our team will be in touch with you soon with more information on the next steps.
    
    If your application has been rejected, we would like to thank you for your interest in our projects and for taking the time to apply. We encourage you to keep an eye on our website for other opportunities that

    Best regards,
    
    College Project Management System
    RVCE`
    sendEmailMailGet(professor.Email,subject,text)
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
    });
  }
});

router.post("/update_application_from_student", async (req, res) => {
  let student = req.body.data;
  let query1 = `
  UPDATE Application SET 
    description = "${student.description}",
    applicationStatus="${student.applicationStatus}",
    notificationTime ="${student.notificationTime}"
    WHERE Email="${student.Email}" AND
    Project_ID = "${student.Project_ID}" AND
    forStudent=1
  `;

  let query2 = `
  Insert into Works_on values(
    "${student.Email}",
    "${student.Project_ID}"
  )
  `;
  let query3 = `
  Insert into Application values(
    0,
    0,
    "${student.description}",
    "${student.applicationStatus}",
    "${student.Project_ID}",
    "${student.Email}",
    "${student.notificationTime}"
  )
  `;
  let getProdEmailQuery=`Select * from Project where Project_ID="${student.Project_ID}"`
  try {
    await mysqlPool.query(query1);
    await mysqlPool.query(query3);
    if (student.applicationStatus == "accept") {
      await mysqlPool.query(query2);
    }
    let res4=await mysqlPool.query(getProdEmailQuery)
    let subject=" Welcome to our Project Management System!"
    let text=`Dear Professor,

    I hope this email finds you well. I am writing to inform you about the decision on the project request that you submitted on our platform.

After a careful review and consideration, the status of your project request has been updated on our website. You can check the status by logging into your account and visiting the "Project Requests" section.

If the request has been accepted, a student has agreed to take on the project and will be in touch with you soon to discuss the next steps. We are confident that this student has the skills and expertise to complete the project to your satisfaction.

If the request has been rejected, we apologize for the inconvenience. Our platform connects professors with a large pool of talented students, and sometimes there may not be a student available to take on a particular project. However, you are welcome to submit a new project request at any time.

If you have any questions or concerns, please do not hesitate to reach out to us.

    Best regards,
    
    College Project Management System Team,
    RVCE`
    sendEmailMailGet(res4[0][0].Professor_Email,subject,text)
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
    });
  }
});

export default router;
