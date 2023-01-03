import mongoose from "mongoose";

const draggableTasksSchema=new mongoose.Schema({
    ProjectID:{
        type:String
    },
    ToDo:[{
        Name:{
            type:String
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

    }],
    InProgress:[{
        Name:{
            type:String
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

    }],
    ToBeReviewed:[{
        Name:{
            type:String
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

    }],
    Completed:[{
        Name:{
            type:String
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