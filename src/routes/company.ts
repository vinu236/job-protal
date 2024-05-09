import { Router } from "express";
import { validateCompanyBodyMiddleware } from "../validations/company";
import { companyRegister } from "../controller/company";
import { checkUserWithEmailExistsMiddleware } from "../middleware/auth";

const router = Router();

// company register router:post
router.post(
  "/register-company",
  validateCompanyBodyMiddleware,
  checkUserWithEmailExistsMiddleware,
  companyRegister
);

export { router as companyRouter };
