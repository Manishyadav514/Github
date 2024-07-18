import {device} from "../controllers/devices/types/device"
import {model,Schema} from "mongoose"

const deviceSchema :Schema = new Schema (
    {
        name:{
            type:String,
            required:true
        },

        state:{
            type:Boolean,
            required:true
        },

        image:{
            type:String,
            required:true
        },

        location:{
            type:String,
            required:true
        },

    },
    {timestamps: true,
    useFindAndModify: false }
)

export default model<device>("Device",deviceSchema)