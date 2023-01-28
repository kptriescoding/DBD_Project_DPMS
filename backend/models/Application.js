import mongoose from "mongoose"

const applicationSchema=new mongoose.Schema({
    projectID:{
        type:String
    },
    professorEmail:{
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
        USN:{
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