\# Auth Backend



A secure PostgreSQL backend implementing JWT Authentication, Refresh Tokens, Two-Factor Authentication (2FA) using OTP, Forgot Password flow, and automated tests.



\## Features



\* User Registration

\* User Login

\* JWT Access Token Authentication

\* Refresh Token Support

\* Logout

\* Protected Profile Endpoint

\* Two-Factor Authentication (OTP)

\* Forgot Password Flow

\* Password Reset using OTP

\* Single-use OTPs

\* OTP Expiration

\* Refresh Token Storage in PostgreSQL

\* Request Validation

\* Rate Limiting

\* Automated Tests

\* Prisma ORM + PostgreSQL



\---



\## Tech Stack



\* Node.js

\* Express.js

\* PostgreSQL

\* Prisma ORM

\* JWT

\* bcrypt

\* Jest

\* Supertest

\* express-validator

\* express-rate-limit



\---



\## Project Structure



```

auth-backend

│

├── prisma/

├── src/

│   ├── config/

│   ├── controllers/

│   ├── middleware/

│   ├── routes/

│   ├── app.js

│   └── server.js

│

├── tests/

├── logs/

├── PROOF\_OF\_SUBMISSION/

├── README.md

├── SUBMISSION.md

├── CHECKLIST.md

└── package.json

```



\---



\## Installation



Clone repository:



```bash

git clone https://github.com/ChinmoyDeb/auth-backend.git

cd auth-backend

```



Install dependencies:



```bash

npm install

```



\---



\## Environment Variables



Create `.env`



```env

DATABASE\_URL=postgresql://username:password@localhost:5432/authdb



JWT\_SECRET=secret

REFRESH\_TOKEN\_SECRET=refreshsecret



ACCESS\_TOKEN\_EXPIRE=15m

REFRESH\_TOKEN\_EXPIRE=7d



PORT=5000

```



\---



\## Database Migration



Run:



```bash

npx prisma migrate dev

```



Generate Prisma client:



```bash

npx prisma generate

```



\---



\## Seed Database



```bash

npm run seed

```



\---



\## Run Server



Development:



```bash

npm run dev

```



Production:



```bash

npm start

```



\---



\## API Endpoints



\### Register



POST



```

/api/auth/register

```



Body:



```json

{

&#x20; "email":"user@test.com",

&#x20; "password":"password123",

&#x20; "phone":"+919999999999"

}

```



\---



\### Login



POST



```

/api/auth/login

```



\---



\### Refresh Token



POST



```

/api/auth/refresh

```



\---



\### Logout



POST



```

/api/auth/logout

```



\---



\### Enable 2FA



POST



```

/api/auth/2fa/enable

```



\---



\### Verify 2FA



POST



```

/api/auth/2fa/verify

```



\---



\### Forgot Password



POST



```

/api/auth/forgot-password

```



\---



\### Reset Password



POST



```

/api/auth/reset-password

```



\---



\### Protected Profile



GET



```

/api/auth/profile

```



\---



\## OTP Delivery



This project uses a mock SMS gateway.



Generated OTPs are stored inside:



```

logs/otp.log

```



This avoids SMS provider costs while preserving the complete OTP flow.



\---



\## Running Tests



```bash

npm test

```



Current status:



```

18 tests passed

```



\---



\## Security Features



\* bcrypt password hashing

\* JWT access tokens

\* Refresh tokens

\* Input validation

\* Rate limiting

\* Single-use OTPs

\* OTP expiration

\* Protected routes

\* PostgreSQL storage

\* Prisma ORM to prevent SQL injection



\---



\## Proof of Submission



Files are available in:



```

PROOF\_OF\_SUBMISSION/

```



Contains:



\* challenge.txt

\* proof.txt

\* proof\_pub.pem

\* compute\_proof.ps1



\---



\## Repository



https://github.com/ChinmoyDeb/auth-backend



\---



\## Author



Chinmoy Deb



B.Tech CSE (IoT), VIT Vellore



