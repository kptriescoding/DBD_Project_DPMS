export const queryDeptTable=`CREATE TABLE IF NOT EXISTS Department
(
  Name CHAR(50) NOT NULL,
  Year__Of_Establishment INT NOT NULL,
  PRIMARY KEY (Name)
);`

export const queryStudentTable=`CREATE TABLE IF NOT EXISTS Student
(
  First_Name CHAR(20) NOT NULL,
  Last_Name CHAR(20) NOT NULL,
  Middle_Name CHAR(20) NOT NULL,
  Local_Address VARCHAR(100) NOT NULL,
  Permanent_Address_ VARCHAR(100) NOT NULL,
  USN VARCHAR(10) NOT NULL,
  CGPA FLOAT NOT NULL,
  Summary VARCHAR(255) NOT NULL,
  Resume VARCHAR(100) NOT NULL,
  Semester INT NOT NULL,
  Email VARCHAR(30) NOT NULL,
  Department_Name CHAR(50) NOT NULL,
  PRIMARY KEY (Email),
  FOREIGN KEY (Department_Name) REFERENCES Department(Name)
);`

export const queryStudentSkillTable=`CREATE TABLE IF NOT EXISTS Student_Skill
(
  Skill VARCHAR(50) NOT NULL,
  Student_Email VARCHAR(30) NOT NULL,
  PRIMARY KEY (Skill, Student_Email),
  FOREIGN KEY (Student_Email) REFERENCES Student(Email)
);`

export const queryStudentAchievementTable=`CREATE TABLE IF NOT EXISTS Student_Achievement
(
  Achievement VARCHAR(255) NOT NULL,
  Student_Email VARCHAR(30) NOT NULL,
  PRIMARY KEY (Achievement, Student_Email),
  FOREIGN KEY (Student_Email) REFERENCES Student(Email)
);`

export const queryProfessorTable=`CREATE TABLE IF NOT EXISTS Professor
(
  First_Name_ CHAR(30) NOT NULL,
  Last_Name CHAR(30) NOT NULL,
  Middle_Name CHAR(30) NOT NULL,
  Email VARCHAR(30) NOT NULL,
  Year_Of_Joining INT NOT NULL,
  Department_Name CHAR(50) NOT NULL,
  PRIMARY KEY (Email),
  FOREIGN KEY (Department_Name) REFERENCES Department(Name)
);`

export const queryAnnouncementTable=`CREATE TABLE IF NOT EXISTS Announcement
(
  Announcement_ID VARCHAR(20) NOT NULL,
  Date_of_Announcement DATE NOT NULL,
  isImmediate INT NOT NULL,
  Email VARCHAR(30) NOT NULL,
  PRIMARY KEY (Announcement_ID),
  FOREIGN KEY (Email) REFERENCES Professor(Email)
);`

export const queryProfessorFieldOfExpertise=`CREATE TABLE IF NOT EXISTS Professor_Field_Of_Expertise
(
  Field_Of_Expertise VARCHAR(100) NOT NULL,
  Professor_Email VARCHAR(30) NOT NULL,
  PRIMARY KEY (Field_Of_Expertise, Professor_Email),
  FOREIGN KEY (Professor_Email) REFERENCES Professor(Email)
);`

export const queryProfessorPaperPublished=`CREATE TABLE IF NOT EXISTS Professor_Paper_Published
(
  Paper_Published VARCHAR(255) NOT NULL,
  Professor_Email VARCHAR(30) NOT NULL,
  PRIMARY KEY (Paper_Published, Professor_Email),
  FOREIGN KEY (Professor_Email) REFERENCES Professor(Email)
);`

export const queryProjectTable=`CREATE TABLE IF NOT EXISTS Project
(
  Title VARCHAR(50) NOT NULL,
  Description VARCHAR(255) NOT NULL,
  Collaborator VARCHAR(100) NOT NULL,
  Start_Date DATE NOT NULL,
  End_Date DATE NOT NULL,
  Project_ID VARCHAR(20) NOT NULL,
  Announcement_ID VARCHAR(20) NOT NULL,
  Professor_Email VARCHAR(30) NOT NULL,
  PRIMARY KEY (Project_ID),
  FOREIGN KEY (Announcement_ID) REFERENCES Announcement(Announcement_ID),
  FOREIGN KEY (Professor_Email) REFERENCES Professor(Email)
);`

export const queryWorksOnTable=`CREATE TABLE IF NOT EXISTS Works_on
(
  Student_Email VARCHAR(30) NOT NULL,
  Project_ID VARCHAR(20) NOT NULL,
  PRIMARY KEY (Student_Email, Project_ID),
  FOREIGN KEY (Student_Email) REFERENCES Student(Email),
  FOREIGN KEY (Project_ID) REFERENCES Project(Project_ID)
);`

export const queryProjectSkillTable=`CREATE TABLE IF NOT EXISTS Project_Skill
(
  Skill VARCHAR(50) NOT NULL,
  Project_ID VARCHAR(20) NOT NULL,
  PRIMARY KEY (Skill, Project_ID),
  FOREIGN KEY (Project_ID) REFERENCES Project(Project_ID)
);`
