import {model,Schema} from "mongoose"


const UserSchema:Schema = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		quote: { type: String },
	},
	{ collection: 'user-data',timestamps: true,
    useFindAndModify: false },
    
)

export default model("User", UserSchema)

