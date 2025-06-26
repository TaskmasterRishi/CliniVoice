import { openai } from "@/config/OpenAiModel";
import { AIDoctorAgents } from "@/shared/list";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { notes } = await req.json();
  try {
     const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash-preview-05-20",
      messages: [
        { role: "system", content: JSON.stringify(AIDoctorAgents) },
        {
          role: "user",
          content:
            "User Notes/Symptomes:" +
            notes +
            "Depends on the notes and the symptones, Please suggest list of the doctors, Return object in json only",
        },
      ],
    });
    const rawRep = completion.choices[0].message;
    //@ts-ignore
    const Resp = rawRep.content.trim().replace('```json','').replace('```','')
    const JSONResp = JSON.parse(Resp);
    return NextResponse.json(JSONResp);
  } catch (e) {
    return NextResponse.json(e);
  }
}
