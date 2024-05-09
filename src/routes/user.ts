import { Router } from "express";
import { profileUpdate, userRegister } from "../controller/user";
import {
  ValidateRegisterMiddleware,
  ValidateUpdateProfileMiddleware,
} from "../validations/user";
import { checkUserWithEmailExistsMiddleware } from "../middleware/auth";
import { uploadProfile } from "../utils/multerConfig";
import passport from "passport";

const router = Router();
// register router
router.post(
  "/register",
  uploadProfile.any(),  
  (req,res)=>{
    console.log(req.files
    )
    console.log(req.body)
  },
  // ValidateRegisterMiddleware,
  // checkUserWithEmailExistsMiddleware,
  userRegister
);

router.put(
  "/profile",
  ValidateUpdateProfileMiddleware,
  passport.authenticate("jwt", { session: false }),
  uploadProfile.any(),
  profileUpdate,
); // jwt auth)

export { router as userRouter };
