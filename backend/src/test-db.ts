import prisma from "./config/prisma";

async function testDatabase() {
  try {
    const users = await prisma.user.findMany();

    console.log("Database connected successfully!");
    console.log("Users found:", users.length);
  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();