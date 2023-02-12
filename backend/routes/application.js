import Router from "express";
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
  try {
    let res1 = await mysqlPool.query(query1);
    let res3 = await mysqlPool.query(query3);
    if (student.applicationStatus == "accept") {
      let res2 = await mysqlPool.query(query2);
    }
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
