import { Router } from "express";
import { mysqlPool } from "../models/sqlInit.js";
// import { createApplication } from "./application.js";
import applicationSchema from "../models/Application.js";
import { createNotifications } from "./application.js";
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
    let deleteQuery=`
        DELETE FROM Project_Skill WHERE Project_ID="${project.projectID}"`
        await mysqlPool.query(deleteQuery)

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
  let query = `
  select *,DATEDIFF(End_Date, Start_Date) AS days from Project
  where Project_ID not in (select Project_ID from Application where Email="${req.body.data.email}" or isClosed=1)
  `;
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
        funding: cur.Funding,
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

router.post("/get_projects_report", async (req, res) => {
  let queryOption = req.body.data;
  let query = "";
  const queryOptions={
    "List Of Projects":`select *,DATEDIFF(End_Date, Start_Date) AS No_of_Days from Project`,
    "Projects This Professor is Working On":`SELECT * FROM Project where Professor_Email="${queryOption.email}"`,
    "Projects This Student is Working On":`SELECT * FROM  Project where Project_ID in (Select Project_ID from Works_on where Student_Email="${queryOption.email}")`

  }
  query=queryOptions[queryOption.query]
  if(query===-1)query=""
  try {
    var projects = [];
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

router.post("/sql_query", async (req, res) => {
  let query = req.body.data.query;
  let sqlRes
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
    data:sqlRes[0]
  });
});
router.post("/collaborator",async(req,res)=>{
  let data = req.body.data;
  let query = `select Collaborator,sum(Funding) as Total_Funding  from Project group by Collaborator order by Total_Funding desc  LIMIT ${data.limit};`
  let sqlRes
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
    collaborators:sqlRes[0]
  });
})

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

router.post("/create_announcement", async (req, res) => {
  // console.log(req.body.data);
  let announcement = req.body.data;
  let query = `
    INSERT INTO Announcement VALUES
    (
    "${Date.now()}",
    "${announcement.description}",
    "${announcement.projectID}",
    "${announcement.dateOfAnnouncement}",
    0,
    "${announcement.email}"
    )`
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

router.post("/get_announcements", async (req, res) => {
  let projectID=req.body.data.projectID
  let query = `select * FROM Announcement WHERE Project_ID="${projectID}"`;
  try {
    let announcements = [];
    const sqlRes = await mysqlPool.query(query);
    if(sqlRes[0])announcements=sqlRes[0].map((announcement)=>({announcementID:announcement.Announcement_ID,
      description:announcement.Description,
      projectID:announcement.Project_ID,
      dateOfAnnouncement:announcement.Date_of_Announcement,
      professorEmail:announcement.Email
    }
    ))
    return res.status(200).json({
      success: true,
      announcements:announcements,
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
    });
  }
});


router.post("/get_by_projectID", async (req, res) => {
  let projectID = req.body.data.projectID;
  let query = `
  select * from Project where Project_ID="${projectID}"
  `;
  let projectQuery=`
  SELECT * FROM Project_Skill
  WHERE Project_ID="${projectID}"
  `
  let skills=[]
  try {
      let sqlRes = await mysqlPool.query(query);
      let cur=sqlRes[0][0]
      sqlRes=await mysqlPool.query(projectQuery)
      if(sqlRes[0])skills=sqlRes[0].map((skill)=>({label:skill.Skill,value:skill.Skill}))
      if(skills===null)skills=[]
       var project={
          projectName: cur.Title,
          projectDescription: cur.Description,
          projectId: cur.Project_ID,
          collaborator: cur.Collaborator,
          funding:cur.Funding,
          startDate:cur.Start_Date,
          endDate:cur.End_Date,
          skills:skills
        };
        return res.status(200).json({
          success: true,
          project: project,
        });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
    });
  }
});

/**
 * @route   POST project/update
 * @desc    Update and Existing Project
 * @access  Logged in as Professor
 */
router.post("/update", async (req, res) => {
  // console.log(req.body.data);
  let project = req.body.data;
  let query = `
    UPDATE Project SET
    Title="${project.title}",
    Description="${project.description}",
    Collaborator ="${project.collaborator}",
    Start_Date="${project.startDate}",
    End_Date="${project.endDate}",
    Professor_Email="${project.professorEmail}",
    Funding="${project.funding}"
    WHERE Project_ID="${project.projectID}"
    `;

  try {
    await mysqlPool.query(query);
    let deleteQuery=`DELETE FROM Project_Skill WHERE Project_ID="${project.projectID}"`
        await mysqlPool.query(deleteQuery);
    let skills = project.skills;
    for (let i = 0; i < skills.length; i++) {
      let skillQuery = `
        REPLACE INTO Project_Skill VALUES
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

export default router;
