import mongoose from "mongoose";

const draggableTasksSchema=new mongoose.Schema({
    ProjectID:{
        type:String
    },
    Columns:[
        {
            type:String
        }
    ],
    Tasks:[{
        Name:{
            type:String
        },
        Column:{
            type:Number
        },
        Description:{
            type:String
        },
        Members:[{
            type:String
        }],
        Labels:[{
            type:String
        }],
        Date:{
            type:Date
        }
    }]
});
const draggableTasks=mongoose.model("draggableTasks",draggableTasksSchema);
export default draggableTasks;