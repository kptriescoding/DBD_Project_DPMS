import Router from "express"
import { mysqlPool } from "../models/sqlInit.js"

const router=Router()

router.post("/get",async (req,res)=>{
    // console.log(req.body.data)
    
})
router.post("/create",async (req,res)=>{
    // console.log(req.body.data)
    let announcement = req.body.data;
  let query = `
    INSERT INTO Announcement VALUES
    ("${announcement.announcementID}",
    "${announcement.description}",
    "${announcement.projectID}",
    "${announcement.dateOfAnnouncement}",
    "${announcement.isImmediate}",
    "${announcement.email}"
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
})
export default router;