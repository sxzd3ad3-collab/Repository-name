import { PrismaClient } from "@prisma/client";
import { copyFileSync, existsSync, mkdirSync } from "fs";
import path from "path";

function prepareVercelDb() {
  if (!process.env.VERCEL) return;
  const dest = "/tmp/app.db";
  if (!existsSync(dest)) {
    const src = path.join(process.cwd(), "prisma", "prod.db");
    if (existsSync(src)) copyFileSync(src, dest);
  }
  process.env.DATABASE_URL = "file:/tmp/app.db";
  mkdirSync("/tmp/uploads", { recursive: true });
}

prepareVercelDb();

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
