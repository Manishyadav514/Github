import { getDevices,addDevices,updatedevices,deletedevices} from "../controllers/devices";
import { Router } from "express";
import { loginuser, registeruser } from "../controllers/users";

const router:Router= Router()

router.get("/devices",getDevices)
router.post("/adddevice",addDevices)
router.post("/register",registeruser)
router.post("/login",loginuser)
router.put("/updatedevice/:id",updatedevices)
router.delete("/deletedevice/:id",deletedevices)
export default router