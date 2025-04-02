import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
console.log("connecté à la BD");

export default prisma;
