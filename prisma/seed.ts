import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {
        password: hashedPassword,
        role: "ADMIN",
    },
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log({ admin });

  // Initial settings
  const settings = [
    { key: "logo_url", value: "/wellbeing-logo.png" },
    { key: "primary_color", value: "#1a472a" }, // Dark green from image
    { key: "accent_color", value: "#ffffff" },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: {
        key: setting.key,
        value: setting.value,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
