import { Router } from "express";
import { mysqlPool } from "../models/sqlInit.js";

const router = Router();

/**
 * @route   POST project/create
 * @desc    Create a new Project
 * @access  Logged in as Professor
 */
router.post("/create", async (req, res) => {
  console.log(req.body.data);
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

router.post("/get_my_projects", async (req, res) => {
  console.log(req.body.data);
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
      for (let i = 0; i < sqlRes.length ; i++) {
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
      for (let i = 0; i < sqlRes.length - 1; i++) {
        let cur = sqlRes[i][0];
        console.log(cur)
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

export default router;
