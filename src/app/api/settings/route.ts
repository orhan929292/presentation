import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const settings = await prisma.setting.findMany();
  const settingsObj = settings.reduce((acc: any, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  return NextResponse.json(settingsObj);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await req.json();

  for (const [key, value] of Object.entries(data)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value: value as string },
      create: { key, value: value as string },
    });
  }

  return NextResponse.json({ success: true });
}
