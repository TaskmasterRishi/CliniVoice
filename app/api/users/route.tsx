import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const user = await currentUser();

  try {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (users.length === 0) {
      const result = await db.insert(usersTable).values({
        name: user?.fullName ?? "",
        email: email,
        credits: 10,
        //@ts-ignore
      }).returning({usersTable})
      return NextResponse.json(result[0]?.usersTable)
    }

    return NextResponse.json(users[0]);
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}