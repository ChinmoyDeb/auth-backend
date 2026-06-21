\# Auth Backend



A secure authentication backend built using \*\*Node.js\*\*, \*\*Express.js\*\*, \*\*PostgreSQL\*\*, and \*\*Prisma ORM\*\*.



This project implements:



\- JWT Authentication

\- Refresh Token Flow

\- Two Factor Authentication (OTP)

\- Forgot Password Flow

\- Password Reset

\- Protected Routes

\- Request Validation

\- Rate Limiting

\- Automated Tests

\- Prisma Migrations

\- Seed Data

\- Mock SMS Gateway



\---



\# Features



\## User Registration



Create a new account with:



\- Email

\- Password

\- Phone Number



Passwords are hashed using bcrypt before being stored.



\---



\## Login



Users can login using email and password.



Returns:



\- Access Token

\- Refresh Token



If 2FA is enabled:



\- `requires2FA = true`

\- OTP verification is required before issuing tokens.



\---



\## JWT Authentication



Protected routes require a valid access token.



Access tokens are short-lived.



\---



\## Refresh Tokens



Long-lived refresh tokens are stored in PostgreSQL.



Used to generate new access tokens.



\---



\## Logout



Invalidates stored refresh tokens.



\---



\## Two Factor Authentication (2FA)



Users can enable 2FA.



OTP is generated and delivered using a mock SMS gateway.



OTP is:



\- Single use

\- Time limited

\- Stored in PostgreSQL



\---



\## Forgot Password



Users can request a password reset.



OTP is generated.



OTP:



\- Expires automatically

\- Can only be used once



\---



\## Password Reset



Users provide:



\- Email

\- OTP

\- New Password



Password is updated after successful verification.



\---



\## Validation



Input validation is performed using:



\- express-validator



Checks:



\- Valid email

\- Password length

\- Required fields



\---



\## Rate Limiting



Authentication routes are protected using:



\- express-rate-limit



Helps prevent brute-force attacks.



\---



\## Automated Testing



Integration tests cover:



\- Registration

\- Login

\- Duplicate registration

\- Invalid login

\- Protected profile route

\- Refresh token flow

\- Logout

\- Forgot password

\- Password reset

\- Login with new password

\- Enable 2FA

\- Verify 2FA

\- Login requiring OTP

\- OTP verification

\- Reused OTP

\- Expired OTP



Current Status:



\*\*18 tests passed\*\*



\---



\# Technology Stack



\## Backend



\- Node.js

\- Express.js



\## Database



\- PostgreSQL

\- Prisma ORM



\## Authentication



\- JWT

\- bcrypt



\## Validation



\- express-validator



\## Security



\- express-rate-limit



\## Testing



\- Jest

\- Supertest



\---



\# Project Structure



```text

auth-backend

│

├── prisma

│   ├── migrations

│   ├── schema.prisma

│   └── seed.js

│

├── src

│   ├── config

│   │     prisma.js

│   │

│   ├── controllers

│   │     authController.js

│   │

│   ├── middleware

│   │     authMiddleware.js

│   │     validationMiddleware.js

│   │

│   ├── routes

│   │     authRoutes.js

│   │

│   ├── app.js

│   └── server.js

│

├── tests

│     auth.test.js

│

├── logs

│     otp.log

│

├── PROOF\_OF\_SUBMISSION

│

├── README.md

├── SUBMISSION.md

├── CHECKLIST.md

├── package.json

└── package-lock.json

```



\---



\# Requirements



Install:



\- Node.js 18+

\- PostgreSQL

\- Git



\---



\# Clone Repository



```bash

git clone https://github.com/ChinmoyDeb/auth-backend.git



cd auth-backend

```



\---



\# Install Dependencies



```bash

npm install

```



\---



\# Environment Variables



Create a file named:



```text

.env

```



Example:



```env

DATABASE\_URL="postgresql://postgres:password@localhost:5432/authdb"



JWT\_SECRET="your\_jwt\_secret"



REFRESH\_TOKEN\_SECRET="your\_refresh\_secret"



ACCESS\_TOKEN\_EXPIRE=15m



REFRESH\_TOKEN\_EXPIRE=7d



PORT=5000

```



\---



\# Generate Prisma Client



```bash

npx prisma generate

```



\---



\# Apply Database Migrations



```bash

npx prisma migrate dev

```



\---



\# Seed Database



```bash

npm run seed

```



\---



\# Start Development Server



```bash

npm run dev

```



Server:



```text

http://localhost:5000

```



\---



\# Production Mode



```bash

npm start

```



\---



\# API Endpoints



\## Register



POST



```text

/api/auth/register

```



Body:



```json

{

&#x20; "email": "user@test.com",

&#x20; "password": "password123",

&#x20; "phone": "+919999999999"

}

```



\---



\## Login



POST



```text

/api/auth/login

```



Body:



```json

{

&#x20; "email": "user@test.com",

&#x20; "password": "password123"

}

```



\---



\## Refresh Token



POST



```text

/api/auth/refresh

```



\---



\## Logout



POST



```text

/api/auth/logout

```



\---



\## Enable 2FA



POST



```text

/api/auth/2fa/enable

```



Requires Bearer Token.



\---



\## Verify 2FA



POST



```text

/api/auth/2fa/verify

```



\---



\## Forgot Password



POST



```text

/api/auth/forgot-password

```



\---



\## Reset Password



POST



```text

/api/auth/reset-password

```



\---



\## Profile



GET



```text

/api/auth/profile

```



Requires Authorization header.



\---



\# OTP Delivery



This project uses a mock SMS gateway.



Generated OTPs are logged to:



```text

logs/otp.log

```



This allows testing without external SMS providers.



\---



\# Running Tests



```bash

npm test

```



Expected output:



```text

18 tests passed

```



\---



\# Security Measures



\- bcrypt password hashing

\- JWT access tokens

\- Refresh tokens

\- Request validation

\- Rate limiting

\- Protected routes

\- Single-use OTPs

\- OTP expiration

\- Prisma ORM to prevent SQL injection



\---



\# Database



Database used:



\*\*PostgreSQL\*\*



Managed using:



\*\*Prisma ORM\*\*



Migration files are located inside:



```text

prisma/migrations

```



\---



\# Seed Data



Seed script:



```text

prisma/seed.js

```



Run:



```bash

npm run seed

```



\---



\# Proof Of Submission



Folder:



```text

PROOF\_OF\_SUBMISSION

```



Contains:



\- challenge.txt

\- proof.txt

\- proof\_pub.pem

\- compute\_proof.ps1



\---



\# Repository



https://github.com/ChinmoyDeb/auth-backend



\---



\# Author



Chinmoy Deb



B.Tech CSE 



VIT Vellore



2023 - 2027

