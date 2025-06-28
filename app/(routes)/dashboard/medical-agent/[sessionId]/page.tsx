"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Doctor } from "../../_components/AddNewSessionDialog";
import { LoaderCircle, PhoneCall, PhoneOff } from "lucide-react";
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

type message = {
  role: string;
  text: string;
};

const MedicalVoiceAgent = () => {
  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>();
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<Vapi | null>(null);
  const [currentRole, setCurrentRole] = useState<string | null>();
  const [liveTranscript, setLiveTranscript] = useState<string>();
  const [messages, setMessages] = useState<message[]>([]);
  const [isStartingCall, setIsStartingCall] = useState(false);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [totalCallDuration, setTotalCallDuration] = useState<number>(0);

  useEffect(() => {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (args[0]?.includes?.("Ignoring settings for browser- or platform-unsupported input processor(s): audio")) {
        return; // Ignore this specific warning
      }
      originalConsoleError(...args);
    };

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  useEffect(() => {
    if (sessionId) {
      getSessionDetail();
    }
  }, [sessionId]);

  useEffect(() => {
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "");
    setVapiInstance(vapi);

    vapi.on("call-start", () => {
      setIsConnected(true);
    });

    vapi.on("call-end", () => {
      setIsConnected(false);
      setIsSpeaking(false);
    });

    vapi.on("speech-start", () => {
      setIsSpeaking(true);
      setCurrentRole("assistant");
    });

    vapi.on("speech-end", () => {
      setIsSpeaking(false);
      setCurrentRole("user");
    });

    vapi.on("message", (message) => {
      if (message.type === "transcript") {
        const { role, transcriptType, transcript } = message;
        if (transcriptType === "partial") {
          setLiveTranscript(transcript);
          setCurrentRole(role);
        } else if (transcriptType === "final") {
          // Final transcript
          setMessages((prev) => [...(prev || []), { role, text: transcript }]);
          setLiveTranscript("");
          setCurrentRole(null);
        }
        console.log(`${message.role} : ${message.transcript}`);
      }
    });

    vapi.on("error", (error) => {
      console.error("Vapi error:", error);
    });

    return () => {
      vapi.stop();
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
        setTotalCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isConnected]);

  useEffect(() => {
    if (isConnected) {
      setCallDuration(0);
    }
  }, [isConnected]);

  const getSessionDetail = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get(
        `/api/session-chat?sessionId=${sessionId}`
      );
      setSessionDetail(result.data);
    } catch (error) {
      console.error("Error fetching session details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startCall = () => {
    if (vapiInstance) {
      setIsStartingCall(true);
      vapiInstance.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || "").catch((error) => {
        console.error("Failed to start call:", error);
      }).finally(() => {
        setIsStartingCall(false);
      });
    }
  };

  const stopCall = () => {
    if (vapiInstance) {
      vapiInstance.stop();
    }
  };

  return (
    <div className="pt-10 px-4 md:px-8 h-full flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Medical Consultation
          </h1>
          <div className="flex items-center gap-2 px-3 py-1 border border-gray-200 rounded-full w-fit text-sm bg-gray-50">
            {isConnected ? (
              <div className="flex items-center gap-1">
                <div
                  className={`h-2 w-2 rounded-full ${
                    isSpeaking ? "bg-red-500 animate-pulse" : "bg-green-500"
                  }`}
                />
                <span className="text-gray-600">
                  {isSpeaking ? "Speaking..." : "Connected"}
                </span>
              </div>
            ) : (
              <div className="flex gap-2 items-center justify-center">
                <LoaderCircle className="h-4 w-4 text-red-500 animate-spin" />
                <p className="text-red-400">Not Connected</p>
              </div>
            )}
          </div>
        </div>
        <div className="text-lg font-medium text-gray-700">
          {`${Math.floor(totalCallDuration / 60)}:${(totalCallDuration % 60).toString().padStart(2, '0')}`}
        </div>
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
                <CardTitle className="text-lg text-center">
                  Your consult
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 text-sm">
                  {sessionDetail?.notes || "No notes available"}
                </p>
              </CardContent>
            </Card>

            {!isConnected ? (
              <motion.div variants={hoverVariants} whileHover="hover">
                <Button className="w-full" size="lg" onClick={startCall} disabled={isStartingCall}>
                  {isStartingCall ? (
                    <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <PhoneCall className="h-4 w-4 mr-2" />
                  )}
                  {isStartingCall ? "Starting..." : "Start Call"}
                </Button>
              </motion.div>
            ) : (
              <motion.div variants={hoverVariants} whileHover="hover">
                <Button
                  variant={"destructive"}
                  className="w-full"
                  size="lg"
                  onClick={stopCall}
                >
                  <PhoneOff className="h-4 w-4 mr-2" /> Disconnect
                </Button>
              </motion.div>
            )}
          </div>

          <Card className="flex-1 bg-secondary">
            <CardHeader>
              <CardTitle>Consultation</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-[40vh] md:h-[65vh]">
              {messages.length === 0 ? (
                <p className="text-gray-400 text-sm">
                  No transcript displayed.
                </p>
              ) : (
                <div className="w-full space-y-4">
                  {messages?.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.role === "assistant" ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                          msg.role === "assistant"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        <p className="font-medium">{msg.role}:</p>
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  {liveTranscript && liveTranscript?.length > 0 && (
                    <div className={`flex ${currentRole === "assistant" ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                          currentRole === "assistant"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        <p className="font-medium">{currentRole}:</p>
                        <p>{liveTranscript}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MedicalVoiceAgent;
