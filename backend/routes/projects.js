import { Router } from "express";
import { mysqlPool } from "../models/sqlInit.js";
import { createApplication } from "./application.js";
import applicationSchema from "../models/Application.js";
const router = Router();

/**
 * @route   POST project/create
 * @desc    Create a new Project
 * @access  Logged in as Professor
 */
router.post("/create", async (req, res) => {
  // console.log(req.body.data);
  let project = req.body.data;
  let query = `
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
    `;

  try {


    const application = req.body.data;
    // console.log(application)
    // console.log("hereI");
    
   await createApplication(req,res)



    await mysqlPool.query(query);
    let skills = project.skills;
    for (let i = 0; i < skills.length; i++) {
      let skillQuery = `
        INSERT INTO Project_Skill VALUES
        ("${skills[i]}",
        "${project.projectID}"
        )
        `;
      try {
        await mysqlPool.query(skillQuery);
      } catch (err) {
        console.log(err);
        return res.status(200).json({
          success: false,
        });
      }
    }
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
function getDuration(days) {
  if (days / 30 < 1) return days + " days";
  else {
    days = days / 30;
    if (days < 12)
      return days == 1
        ? Math.round(days) + " month"
        : Math.round(days) + " months";
    else {
      days = days / 12;
      return days == 1
        ? Math.round(days) + " year"
        : Math.round(days) + " years";
    }
  }
}
router.post("/get_projects", async (req, res) => {
  let query = `select *,DATEDIFF(End_Date, Start_Date) AS days from Project`;
  try {
    var projects = [];
    const sqlRes = await mysqlPool.query(query);
    for (let i = 0; i < sqlRes[0].length; i = i + 1) {
      let cur = sqlRes[0][i];
      projects.push({
        projectName: cur.Title,
        professorEmail: cur.Professor_Email,
        projectDescription: cur.Description,
        projectId: cur.Project_ID,
        collaborator: cur.Collaborator,
        projectDuration: getDuration(cur.days),
      });
    }
    return res.status(200).json({
      success: true,
      projects: projects,
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
    });
  }
});

router.post("/get_projects_for_word_search", async (req, res) => {
  let words = req.body.data.words.split(" ");
  let query = "select * from Project where ";
  query =
    query +
    `Project.Title like "%${words[0]}%" OR Project.Description like "%${words[0]}%" `;
  for (let i = 1; i < words.length; i++) {
    query =
      query +
      `OR Project.Title like "%${words[i]}%" OR Project.Description like "%${words[i]}%" `;
  }
  try {
    var projects = [];
    const sqlRes = await mysqlPool.query(query);
    for (let i = 0; i < sqlRes[0].length; i = i + 1) {
      let cur = sqlRes[0][i];
      projects.push({
        projectName: cur.Title,
        professorEmail: cur.Professor_Email,
        projectDescription: cur.Description,
        projectId: cur.Project_ID,
        collaborator: cur.Collaborator,
      });
    }
    return res.status(200).json({
      success: true,
      projects: projects,
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
    });
  }
});

router.post("/get_my_projects", async (req, res) => {
  let email = req.body.data.email;
  let isProfessor = req.body.data.isProfessor;

  let query = `
  select * from Project where Professor_Email="${email}"
  `;
  let studentQuery = `
  select * from Project where Project_ID in
  (
    select Project_ID from Works_on where Student_Email="${email}"
  )
  `;
  try {
    var projects = [];
    if (isProfessor) {
      const sqlRes = await mysqlPool.query(query);
      for (let i = 0; i < sqlRes[0].length; i = i + 1) {
        let cur = sqlRes[0][i];
        projects.push({
          projectName: cur.Title,
          projectDescription: cur.Description,
          projectId: cur.Project_ID,
          collaborator: cur.Collaborator,
        });
      }
      return res.status(200).json({
        success: true,
        projects: projects,
      });
    } else {
      const sqlRes = await mysqlPool.query(studentQuery);
      for (let i = 0; i < sqlRes[0].length; i++) {
        let cur = sqlRes[0][i];
        projects.push({
          projectName: cur.Title,
          projectDescription: cur.Description,
          projectId: cur.Project_ID,
          collaborator: cur.Collaborator,
        });
      }
      return res.status(200).json({
        success: true,
        projects: projects,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
    });
  }
});

router.post("/add_student", async (req, res) => {
  let query = `insert into Works_on values (
    "${req.body.data.studentEmail}",
    "${req.body.data.projectID}"
    )`;
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

export default router;
