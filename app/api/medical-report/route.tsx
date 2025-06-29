import { db } from "@/config/db";
import { openai } from "@/config/OpenAiModel";
import { sessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const REPORT_GEN_PROMPT = `You are an AI Medical Voice Agent that just finished a voice conversation with a user. Based on the doctor AI agent info and conversation between AI Medical Agent and user transcript, generate a structured report with the following fields:
1. sessionId: a unique session identifier
2. agent: the medical specialist name (e.g., "General Physician AI")
3. user: name of the patient or "Anonymous" if not provided
4. timestamp: current date and time in ISO format
5. chiefComplaint: one-sentence summary of the main health concern
6. summary: a 2-3 sentence summary of the conversation, symptoms, and recommendations
7. symptoms: list of symptoms mentioned by the user
8. duration: how long the user has experienced the symptoms
9. severity: mild, moderate, or severe
10. medicationsMentioned: list of any medicines mentioned
11. recommendations: list of AI suggestions (e.g., rest, see a doctor)
Return the result in this JSON format:
{
  "sessionId": "string",
  "agent": "string",
  "user": "string",
  "timestamp": "ISO Date string",
  "chiefComplaint": "string",
  "summary": "string",
  "symptoms": ["symptom1", "symptom2"],
  "duration": "string",
  "severity": "string",
  "medicationsMentioned": ["med1", "med2"],
  "recommendations": ["rec1", "rec2"]
}
Only include valid fields. Respond with nothing else.`;

export async function POST(req: NextRequest) {
  const { sessionId, sessionDetail, messages } = await req.json();

  try {
    const UserInput =
      "AI Doctor Agent Information: " +
      JSON.stringify(sessionDetail) +
      ", Conversation: " +
      JSON.stringify(messages);
      
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash-preview-05-20",
      messages: [
        { role: "system", content: REPORT_GEN_PROMPT },
        {
          role: "user",
          content: UserInput,
        },
      ],
    });

    console.log("Raw OpenAI response:", completion.choices[0].message);
    const rawResp = completion.choices[0].message;
    const Resp = rawResp.content
      ?.trim()
      .replace("```json", "")
      .replace("```", "") || '{}';

    let JSONResp;
    try {
      JSONResp = JSON.parse(Resp);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
    }

    //save to dashboard
    const result = await db.update(sessionChatTable).set({
      report: JSONResp,
      conversation : messages,
    }).where(eq(sessionChatTable?.sessionId, sessionId));

    return NextResponse.json(JSONResp);
  } catch (e) {
    console.error("Error in medical-report API:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
