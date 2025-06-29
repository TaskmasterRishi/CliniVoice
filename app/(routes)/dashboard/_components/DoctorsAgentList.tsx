"use client";
import { AIDoctorAgents } from "@/shared/list";
import React, { useState } from "react";
import { CardContainer, CardBody } from "./AiDoctorAgentCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Crown } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";

interface DoctorAgent {
  id: number;
  specialist: string;
  description: string;
  image: string;
  agentPrompt: string;
  voiceId: string;
  modelId?: string;
  subscriptionRequired: boolean;
}

const DoctorsAgentList = () => {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const router = useRouter();

  const { has } = useAuth();
  const paidUser = has && has({ plan: "pro" });
  console.log(paidUser);

  const onStartConsultation = async (doctor: DoctorAgent) => {
    setLoadingId(doctor.id);
    try {
      const result = await axios.post("/api/session-chat", {
        notes: "New Consultation to : " + doctor.specialist,
        selectedDoctor: {
          ...doctor,
          modelId: doctor.modelId || "default-model-id"
        },
      });

      if (result.data?.sessionId) {
        router.push("/dashboard/medical-agent/" + result.data.sessionId);
      }
    } catch (error) {
      console.error("Error starting consultation:", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      <div>
        <h2 className="text-2xl font-semibold">AI Specialist Doctors Agent</h2>
      </div>
      <div className="grid grid-cols-2 md:px-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {AIDoctorAgents.map((doctor, index) => (
          <CardContainer key={index} className="max-w-xl relative">
            {doctor.subscriptionRequired && (
              <Badge className="absolute right-5 top-5 z-10 bg-black/70">
                <Crown className="w-6 h-6 text-yellow-500" />
                <span>Premium</span>
              </Badge>
            )}
            <CardBody className="bg-white rounded-lg flex flex-col shadow-xl border-3 h-full p-2">
              <Image
                src={doctor.image}
                alt={doctor.specialist}
                width={200}
                height={300}
                className="w-full h-[230px] md:h-[300px] object-cover object-top rounded-t-sm mb-4"
              />
              <div className="flex flex-col flex-grow">
                <h3 className="text-md md:text-md font-bold">
                  {doctor.specialist}
                </h3>
                <p className="text-xs md:text-md text-gray-600 flex-grow line-clamp-2">
                  {doctor.description}
                </p>
                <Button 
                  className="mt-2" 
                  disabled={loadingId === doctor.id || (doctor.subscriptionRequired && !paidUser)}
                  onClick={() => onStartConsultation(doctor)}
                >
                  {loadingId === doctor.id ? "Loading..." : "Consult Doctor"}
                </Button>
              </div>
            </CardBody>
          </CardContainer>
        ))}
      </div>
    </div>
  );
};

export default DoctorsAgentList;
