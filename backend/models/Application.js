import mongoose from "mongoose"

const applicationSchema=new mongoose.Schema({
    projectID:{
        type:String
    },
    professorEmail:{
        type:String
    },
    projectName:{
        type:String
    },
    applicationStatus:{
        type:String
    },
    announcement:[{
        name:{
        type:String
        },
        description:{
            type:String
        },
        date:{
            type:Date
        }
    }],
    appliedStudents:[{
        name:{
            type:String
        },
        CGPA:{
            type:String
        },
        email:{
            type:String
        },
        status:{
            type:String
        }
    }]

});
const application=mongoose.model("application",applicationSchema);
export default application;