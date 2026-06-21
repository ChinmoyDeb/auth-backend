const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {

    const passwordHash = await bcrypt.hash("password123", 10);

    await prisma.user.upsert({
        where: {
            email: "seed@test.com"
        },
        update: {},
        create: {
            email: "seed@test.com",
            passwordHash,
            phone: "+919999999999"
        }
    });

    console.log("Seed data inserted");

}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });