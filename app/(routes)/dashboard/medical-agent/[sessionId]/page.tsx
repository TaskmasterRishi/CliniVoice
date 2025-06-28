"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Doctor } from "../../_components/AddNewSessionDialog";
import { Circle, LoaderCircle, PhoneCall, PhoneOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Vapi from "@vapi-ai/web";
import { motion } from "framer-motion";

type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: JSON;
  selectedDoctor: Doctor;
  createdOn: string;
  createdBy: string;
};


const hoverVariants = {
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
};

const MedicalVoiceAgent = () => {
  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>();
  const [isLoading, setIsLoading] = useState(false);
  const [callStarted, setCallStarted] = useState(false);
  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "");

  useEffect(() => {
    if (sessionId) {
      getSessionDetail();
    }
  }, [sessionId]);

  const getSessionDetail = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get(`/api/session-chat?sessionId=${sessionId}`);
      setSessionDetail(result.data);
    } catch (error) {
      console.error("Error fetching session details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startCall = () => {
    vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || "");
    vapi.on("call-start", () => {
      setCallStarted(true);
    });
    vapi.on("call-end", () => {
      setCallStarted(false);
    });
    vapi.on("message", (message) => {
      if (message.type === "transcript") {
        console.log(`${message.role}: ${message.transcript}`);
      }
    });
  };

  return (
    <div className="pt-10 px-4 md:px-8 h-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Medical Consultation
          </h1>
          <div className="flex items-center gap-2 px-3 py-1 border border-gray-200 rounded-full w-fit text-sm bg-gray-50">
            {callStarted ? 
            <Circle className="h-4 w-4 text-green-500 fill-green-500"/> :
            <LoaderCircle className="h-4 w-4 text-red-500 animate-spin"/>  
          }
            <span className="text-gray-600">{callStarted? 'Connected...' : 'Not Connected...'}</span>
          </div>
        </div>
        <div className="text-lg font-medium text-gray-700">00:00</div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full">
          <div className="flex flex-col items-center gap-4 w-full md:w-80">
            {sessionDetail?.selectedDoctor?.image ? (
              <Card className="w-full">
                <CardHeader className="items-center flex flex-col justify-center">
                  <div className="relative flex flex-col items-center">
                    <Image
                      src={sessionDetail.selectedDoctor.image}
                      alt={
                        sessionDetail.selectedDoctor.specialist ||
                        "Doctor image"
                      }
                      width={200}
                      height={200}
                      className="h-[200px] w-[200px] object-cover object-top rounded-full border-4 border-primary"
                    />
                    <div className="absolute -bottom-3 left-1/2 transform text-center -translate-x-1/2 bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
                      {sessionDetail.selectedDoctor.specialist}
                    </div>
                  </div>
                  <CardDescription className="text-gray-500 mt-4 text-center">
                    AI Medical voice agent
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <Skeleton className="h-32 w-32 rounded-full" />
            )}

            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg">Your consult</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  {sessionDetail?.notes || "No notes available"}
                </p>
              </CardContent>
            </Card>

            {!callStarted ? (
              <motion.div variants={hoverVariants} whileHover="hover">
                <Button className="w-full" size="lg" onClick={startCall}>
                  <PhoneCall className="h-4 w-4 mr-2" /> Start Call
                </Button>
              </motion.div>
            ) : (
              <motion.div variants={hoverVariants} whileHover="hover">
                <Button variant={"destructive"} className="w-full" size="lg">
                  <PhoneOff className="h-4 w-4 mr-2" /> Disconnect
                </Button>
              </motion.div>
            )}
          </div>

          <Card className="flex-1 bg-secondary">
            <CardHeader>
              <CardTitle>Consultation</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-[40vh] md:h-[65vh] gap-4">
              <div className="text-center space-y-2">
                <p className="text-gray-400 text-sm">Assistance message</p>
                <p className="text-sm text-gray-600">User message</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MedicalVoiceAgent;
