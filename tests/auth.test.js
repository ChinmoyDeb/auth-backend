const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/config/prisma");

describe("Auth API", () => {

    let email = `user${Date.now()}@test.com`;
    let password = "123456";

    let accessToken = "";
    let refreshToken = "";

    test("Login", async () => {

        await request(app)
            .post("/api/auth/register")
            .send({
                email,
                password,
                phone: "+919999999999"
            });

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email,
                password
            });

        accessToken = response.body.accessToken;
        refreshToken = response.body.refreshToken;

        expect(response.statusCode).toBe(200);

    });

    test("Profile with token", async () => {

        const response = await request(app)
            .get("/api/auth/profile")
            .set(
                "Authorization",
                `Bearer ${accessToken}`
            );

        expect(response.statusCode).toBe(200);

    });

    test("Profile without token", async () => {

        const response = await request(app)
            .get("/api/auth/profile");

        expect(response.statusCode).toBe(401);

    });

    test("Refresh token", async () => {

        const response = await request(app)
            .post("/api/auth/refresh")
            .send({
                refreshToken
            });

        expect(response.statusCode).toBe(200);

    });

    test("Duplicate register", async () => {

        const email = `dup${Date.now()}@test.com`;

        await request(app)
            .post("/api/auth/register")
            .send({
                email,
                password: "123456",
                phone: "+919999999999"
            });

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                email,
                password: "123456",
                phone: "+919999999999"
            });

        expect(response.statusCode).toBe(400);

    });

    test("Invalid login", async () => {

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "notfound@test.com",
                password: "123456"
            });

        expect(response.statusCode).toBe(401);

    });

    test("Register user", async () => {

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                email: `user${Date.now()}@test.com`,
                password: "123456",
                phone: "+919999999999"
            });

        expect(response.statusCode).toBe(201);

    });

    test("GET /", async () => {

        const response = await request(app)
            .get("/");

        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("API Running");

    });

    test("Logout", async () => {

        const response = await request(app)
            .post("/api/auth/logout")
            .send({
                refreshToken
            });

        expect(response.statusCode).toBe(200);

    });

    test("Forgot password", async () => {

        const response = await request(app)
            .post("/api/auth/forgot-password")
            .send({
                email
            });

        global.resetOtp = response.body.otp;

        expect(response.statusCode).toBe(200);

    });

    test("Reset password", async () => {

        const response = await request(app)
            .post("/api/auth/reset-password")
            .send({
                email,
                otp: global.resetOtp,
                newPassword: "newpass123"
            });

        expect(response.statusCode).toBe(200);

    });

    test("Login with new password", async () => {

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email,
                password: "newpass123"
            });

        accessToken = response.body.accessToken;
        refreshToken = response.body.refreshToken;

        expect(response.statusCode).toBe(200);

    });

    test("Enable 2FA", async () => {

        const response = await request(app)
            .post("/api/auth/2fa/enable")
            .set(
                "Authorization",
                `Bearer ${accessToken}`
            );

        global.enableOtp = response.body.otp;

        expect(response.statusCode).toBe(200);

    });

    test("Verify 2FA", async () => {

        const response = await request(app)
            .post("/api/auth/2fa/verify")
            .send({
                email,
                otp: global.enableOtp
            });

        expect(response.statusCode).toBe(200);

    });

    test("Login requires 2FA", async () => {

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email,
                password: "newpass123"
            });

        global.loginOtp = response.body.otp;

        expect(response.body.requires2FA).toBe(true);

    });

    test("Verify login OTP", async () => {

        const response = await request(app)
            .post("/api/auth/2fa/verify")
            .send({
                email,
                otp: global.loginOtp
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();

    });
    test("Reused OTP fails", async () => {

    const response = await request(app)
        .post("/api/auth/2fa/verify")
        .send({
            email,
            otp: global.loginOtp
        });

    expect(response.statusCode).toBe(400);

});
test("Expired OTP fails", async () => {

    const response = await request(app)
        .post("/api/auth/forgot-password")
        .send({
            email
        });

    const otp = response.body.otp;

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    await prisma.oTP.updateMany({
        where: {
            userId: user.id,
            code: otp
        },
        data: {
            expiresAt: new Date(
                Date.now() - 1000
            )
        }
    });

    const resetResponse = await request(app)
        .post("/api/auth/reset-password")
        .send({
            email,
            otp,
            newPassword: "anotherpass123"
        });

    expect(resetResponse.statusCode).toBe(400);

});

});