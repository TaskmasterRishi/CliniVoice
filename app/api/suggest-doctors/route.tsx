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

    // Log the raw response for debugging
    console.log("Raw OpenAI response:", completion.choices[0].message);

    const rawRep = completion.choices[0].message;
    if (!rawRep.content) {
      console.error("No content in OpenAI response");
      return NextResponse.json([]);
    }

    // Clean and parse the response
    const Resp = rawRep.content.trim().replace('```json', '').replace('```', '');
    console.log("Cleaned response:", Resp);

    let JSONResp;
    try {
      JSONResp = JSON.parse(Resp);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      return NextResponse.json([]);
    }

    console.log("Parsed JSON response:", JSONResp);

    // Ensure the response is an array
    const doctors = Array.isArray(JSONResp) ? JSONResp : [];
    return NextResponse.json(doctors);
  } catch (e) {
    console.error("Error in suggest-doctors API:", e);
    return NextResponse.json([]);
  }
}
