import express, { Router, Request, Response, NextFunction } from "express";
import {
  signUp,
  login,
  loginAsGuest,
  setDefaultPfp,
  markOffline,
} from "../Controllers/AuthController";
// import {
//   signupValidationRules,
//   validateSignup,
// } from '../middleware/validateSignup';

const router: Router = express.Router();

// router.post('/signup', signupValidationRules, validateSignup, signUp);

router.post("/register", (req: Request, res: Response, next: NextFunction) => {
  signUp(req, res, next);
});

// router.post('/login', login);
router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  login(req, res, next);
});

router.post("/login/guest", loginAsGuest);

router.post("/logoutStatus:userId", markOffline);
// router.get('/logout', logOut);
router.post(
  "/pfp/:email",
  (req: Request, res: Response, next: NextFunction) => {
    setDefaultPfp(req, res, next);
  }
);
export default router;
