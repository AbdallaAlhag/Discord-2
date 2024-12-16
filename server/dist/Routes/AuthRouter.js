"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = require("../Controllers/AuthController");
// import {
//   signupValidationRules,
//   validateSignup,
// } from '../middleware/validateSignup';
const router = express_1.default.Router();
// router.post('/signup', signupValidationRules, validateSignup, signUp);
router.post("/register", (req, res, next) => {
    (0, AuthController_1.signUp)(req, res, next);
});
// router.post('/login', login);
router.post("/login", (req, res, next) => {
    (0, AuthController_1.login)(req, res, next);
});
router.post("/login/guest", AuthController_1.loginAsGuest);
router.post("/logoutStatus:userId", AuthController_1.markOffline);
// router.get('/logout', logOut);
router.post("/pfp/:email", (req, res, next) => {
    (0, AuthController_1.setDefaultPfp)(req, res, next);
});
exports.default = router;
