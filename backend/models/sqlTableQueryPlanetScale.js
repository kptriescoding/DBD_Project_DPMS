/**
 * TODO:
 * Add Departments Query for Some Obvious Ones
 */

export const queryDeptTable=`CREATE TABLE IF NOT EXISTS Department
(
  Name CHAR(50) NOT NULL,
  Year__Of_Establishment INT NOT NULL,
  PRIMARY KEY (Name)
);`

export const queryStudentTable=`bpn`

export const queryStudentSkillTable=`CREATE TABLE IF NOT EXISTS Student_Skill
(
  Skill VARCHAR(50) NOT NULL,
  Student_Email VARCHAR(30) NOT NULL,
  PRIMARY KEY (Skill, Student_Email)
);`


export const queryProfessorTable=`CREATE TABLE IF NOT EXISTS Professor
(
  First_Name CHAR(30) NOT NULL,
  Last_Name CHAR(30) NOT NULL,
  Middle_Name CHAR(30) ,
  Email VARCHAR(50) NOT NULL,
  Year_Of_Joining INT NOT NULL,
  Department_Name CHAR(50) NOT NULL,
  PRIMARY KEY (Email)
);`

export const queryProfessorFieldOfExpertise=`CREATE TABLE IF NOT EXISTS Professor_Field_Of_Expertise
(
  Field_Of_Expertise VARCHAR(100) NOT NULL,
  Professor_Email VARCHAR(50) NOT NULL,
  PRIMARY KEY (Field_Of_Expertise, Professor_Email)
);`


export const queryProjectTable=`CREATE TABLE IF NOT EXISTS Project
(
  Title VARCHAR(50) NOT NULL,
  Description VARCHAR(255) NOT NULL,
  Collaborator VARCHAR(100),
  Start_Date DATE NOT NULL,
  End_Date DATE NOT NULL,
  Project_ID VARCHAR(20) NOT NULL,
  Professor_Email VARCHAR(50) NOT NULL,
  Funding FLOAT,
  PRIMARY KEY (Project_ID)
);`


export const queryProjectSkillTable=`CREATE TABLE IF NOT EXISTS Project_Skill
(
  Skill VARCHAR(50) NOT NULL,
  Project_ID VARCHAR(20) NOT NULL,
  PRIMARY KEY (Skill, Project_ID)
);`


export const queryAnnouncementTable=`CREATE TABLE IF NOT EXISTS Announcement
(
  Announcement_ID VARCHAR(20) NOT NULL,
  Description VARCHAR(255) NOT NULL,
  Project_ID VARCHAR(20) NOT NULL,
  Date_of_Announcement DATE NOT NULL,
  isImmediate INT NOT NULL,
  Email VARCHAR(50) NOT NULL,
  PRIMARY KEY (Announcement_ID,Project_ID)
);`

export const queryWorksOnTable=`CREATE TABLE IF NOT EXISTS Works_on
(
  Student_Email VARCHAR(50) NOT NULL,
  Project_ID VARCHAR(20) NOT NULL,
  PRIMARY KEY (Student_Email, Project_ID)
);`

export const queryApplicationTable= `CREATE TABLE IF NOT EXISTS Application
(
  forStudent BIT NOT NULL,
  isClosed BIT NOT NULL,
  description VARCHAR(255) NOT NULL,
  applicationStatus VARCHAR(20) NOT NULL,
  Project_ID VARCHAR(20) NOT NULL,
  Email VARCHAR(50) NOT NULL,
  notificationTime DATETIME NOT NULL,
);`

