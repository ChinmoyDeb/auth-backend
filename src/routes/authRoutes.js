const express = require("express");

const { body } = require("express-validator");

const validationMiddleware = require(
    "../middleware/validationMiddleware"
);

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    register,
    login,
    profile,
    refresh,
    logout,
    forgotPassword,
    resetPassword,
    enable2FA,
    verify2FA
} = require("../controllers/authController");

router.post(
    "/register",
    [
        body("email").isEmail(),
        body("password").isLength({
            min: 6
        }),
        body("phone").notEmpty()
    ],
    validationMiddleware,
    register
);

router.post(
    "/login",
    [
        body("email").isEmail(),
        body("password").notEmpty()
    ],
    validationMiddleware,
    login
);


router.post("/refresh", refresh);

router.post("/logout", logout);

router.post(
    "/forgot-password",
    [
        body("email").isEmail()
    ],
    validationMiddleware,
    forgotPassword
);

router.post(
    "/reset-password",
    [
        body("email").isEmail(),
        body("otp").notEmpty(),
        body("newPassword").isLength({
            min: 6
        })
    ],
    validationMiddleware,
    resetPassword
);


router.post("/2fa/enable", authMiddleware, enable2FA);

router.post(
    "/2fa/verify",
    [
        body("email").isEmail(),
        body("otp").notEmpty()
    ],
    validationMiddleware,
    verify2FA
);

router.get("/profile", authMiddleware, profile);

module.exports = router;