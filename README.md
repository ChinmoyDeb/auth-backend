

\# PostgreSQL Backend Challenge



\## Features



\* JWT Authentication

\* Access Token + Refresh Token

\* OTP-based Two Factor Authentication

\* Forgot Password Flow

\* Protected Profile Endpoint

\* PostgreSQL + Prisma ORM

\* Input Validation using express-validator

\* Rate Limiting

\* Mock SMS Gateway (logs OTPs to logs/otp.log)

\* Automated Tests



\## Setup



Install dependencies:



```bash

npm install

```



Apply migrations:



```bash

npx prisma migrate dev

```



Insert seed data:



```bash

npm run seed

```



Start server:



```bash

npm run dev

```



Run tests:



```bash

npm test

```



\## Environment Variables



Create a .env file containing:



\* DATABASE\_URL

\* JWT\_SECRET

\* REFRESH\_TOKEN\_SECRET

\* ACCESS\_TOKEN\_EXPIRE

\* REFRESH\_TOKEN\_EXPIRE



\## OTP Delivery



OTP messages are logged in:



```

logs/otp.log

```



instead of using Twilio.



\## Test Account



Email:



```

seed@test.com

```



Password:



```

password123

```



