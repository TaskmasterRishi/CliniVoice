import { db } from "@/config/db";
import { sessionChatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const { notes, selectedDoctor } = await req.json();
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionId = uuidv4();
    const result = await db
      .insert(sessionChatTable)
      .values({
        sessionId: sessionId,
        notes: notes,
        selectedDoctor: selectedDoctor,
        createdBy: user.primaryEmailAddress?.emailAddress,
        createdOn: new Date().toISOString(),
      })
      //@ts-ignore
      .returning(sessionChatTable);
      
    return NextResponse.json(result[0]);
  } catch (e) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    const user = await currentUser();

    if (!user || !sessionId) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    const result = await db
      .select()
      .from(sessionChatTable)
      .where(eq(sessionChatTable.sessionId, sessionId));

    if (!result.length) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (e) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
