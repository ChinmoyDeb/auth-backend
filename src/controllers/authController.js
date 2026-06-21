const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const register = async (req, res) => {

    try {

        const { email, password, phone } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                phone
            }
        });

        res.status(201).json({
            message: "User created",
            user
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {

            return res.status(401).json({
                message: "Invalid credentials"
            });

        }

        const match = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!match) {

            return res.status(401).json({
                message: "Invalid credentials"
            });

        }
if (user.is2FAEnabled) {

    const otp = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    await prisma.oTP.create({
        data: {
            code: otp,
            purpose: "LOGIN_2FA",
            expiresAt: new Date(
                Date.now() + 5 * 60 * 1000
            ),
            userId: user.id
        }
    });
    fs.appendFileSync(
    "logs/otp.log",
    `OTP (LOGIN_2FA): ${otp}\n`
);

    return res.json({
        requires2FA: true,
        otp
    });

}

        const accessToken = jwt.sign(
    {
        userId: user.id
    },
    process.env.JWT_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE
    }
);

const refreshToken = jwt.sign(
    {
        userId: user.id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE
    }
);

await prisma.refreshToken.create({
    data: {
        tokenHash: await bcrypt.hash(refreshToken, 10),
        expiresAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        ),
        userId: user.id
    }
});

res.json({
    accessToken,
    refreshToken
});

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};
const profile = async (req, res) => {

    try {

        const user = await prisma.user.findUnique({
    where: {
        id: req.user.userId
    },
    select: {
        id: true,
        email: true,
        phone: true,
        isActive: true,
        is2FAEnabled: true,
        createdAt: true
    }
});

        res.json(user);

    } catch (error) {

        res.status(500).json({
            message: "Server Error"
        });

    }

};
const refresh = async (req, res) => {

    try {

        const { refreshToken } = req.body;

        if (!refreshToken) {

            return res.status(401).json({
                message: "Missing refresh token"
            });

        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const accessToken = jwt.sign(
            {
                userId: decoded.userId
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRE
            }
        );

        res.json({
            accessToken
        });

    } catch (error) {

        res.status(401).json({
            message: "Invalid refresh token"
        });

    }

};
const logout = async (req, res) => {

    try {

        const { refreshToken } = req.body;

        if (!refreshToken) {

            return res.status(400).json({
                message: "Missing refresh token"
            });

        }

        await prisma.refreshToken.deleteMany({
    where: {
        userId: jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        ).userId
    }
});

        res.json({
            message: "Logged out"
        });

    } catch (error) {

        res.status(500).json({
            message: "Server Error"
        });

    }

};
const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        await prisma.oTP.create({
            data: {
                code: otp,
                purpose: "RESET_PASSWORD",
                expiresAt: new Date(
                    Date.now() + 10 * 60 * 1000
                ),
                userId: user.id
            }
        });
        fs.appendFileSync(
    "logs/otp.log",
    `OTP (RESET_PASSWORD): ${otp}\n`
);

        res.json({
            message: "OTP generated",
            otp
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};
const resetPassword = async (req, res) => {

    try {

        const {
            email,
            otp,
            newPassword
        } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        const otpRecord = await prisma.oTP.findFirst({
    where: {
        userId: user.id,
        code: otp,
        used: false,
        expiresAt: {
            gt: new Date()
        }
    }
});

        if (!otpRecord) {

            return res.status(400).json({
                message: "Invalid OTP"
            });

        }

        const passwordHash =
            await bcrypt.hash(
                newPassword,
                10
            );

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                passwordHash
            }
        });

        await prisma.oTP.update({
            where: {
                id: otpRecord.id
            },
            data: {
                used: true
            }
        });

        res.json({
            message: "Password reset successful"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};
const enable2FA = async (req, res) => {

    try {

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        await prisma.oTP.create({
            data: {
                code: otp,
                purpose: "ENABLE_2FA",
                expiresAt: new Date(
                    Date.now() + 5 * 60 * 1000
                ),
                userId: req.user.userId
            }
        });
        fs.appendFileSync(
    "logs/otp.log",
    `OTP (ENABLE_2FA): ${otp}\n`
);

        res.json({
            message: "OTP generated",
            otp
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};
const verify2FA = async (req, res) => {

    try {

        const { email, otp } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        const record = await prisma.oTP.findFirst({
    where: {
        userId: user.id,
        code: otp,
        used: false
    }
});

        if (!record) {

            return res.status(400).json({
                message: "Invalid OTP"
            });

        }

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                is2FAEnabled: true
            }
        });

        await prisma.oTP.update({
            where: {
                id: record.id
            },
            data: {
                used: true
            }
        });

        const accessToken = jwt.sign(
    {
        userId: user.id
    },
    process.env.JWT_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE
    }
);

const refreshToken = jwt.sign(
    {
        userId: user.id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE
    }
);

await prisma.refreshToken.create({
    data: {
        tokenHash: await bcrypt.hash(refreshToken, 10),
        expiresAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        ),
        userId: user.id
    }
});

res.json({
    accessToken,
    refreshToken
});

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

module.exports = {
    register,
    login,
    profile,
    refresh,
    logout,
    forgotPassword,
    resetPassword,
    enable2FA,
    verify2FA
};