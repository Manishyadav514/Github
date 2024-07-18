import { Document } from "mongoose";

export interface device extends Document{
    name:string
    state:boolean
    image:string
    location:string
}

export default device