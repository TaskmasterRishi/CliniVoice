"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, ClipboardPlus, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { CardBody, CardContainer } from "./AiDoctorAgentCard";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export type Doctor = {
  id: number;
  image: string;
  specialist: string;
  description: string;
  agentPrompt: string;
  voiceId: string;
  modelId : string;
  subscriptionRequired: boolean;
}

const AddNewSessionDialog = () => {
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState<Doctor[] | null>(
    null
  );
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const router = useRouter();

  const {has} = useAuth();
  const paidUser = has && has({plan : "pro"})
  console.log(paidUser);

  const onClickNext = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/suggest-doctors", {
        notes: note,
      });
      // Filter out premium doctors if the user is not paid
      const filteredDoctors = paidUser ? result.data : result.data.filter((doctor: Doctor) => !doctor.subscriptionRequired);
      setSuggestedDoctors(filteredDoctors);
    } catch (error) {
      console.error("Error suggesting doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const onStartConsultation = async () => {
    //save all data to database
    setLoading(true);
    const result = await axios.post("/api/session-chat", {
      notes: note,
      selectedDoctor: selectedDoctor,
    });

    console.log(result.data);
    if (result.data?.sessionId) {
      console.log(result.data?.sessionId);
      //route to conversation screen
      router.push("/dashboard/medical-agent/" + result.data.sessionId);
    }
    setLoading(false);
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    if (selectedDoctor?.id === doctor.id) {
      setSelectedDoctor(null);
    } else {
      setSelectedDoctor(doctor);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="gap-2">
            <ClipboardPlus className="h-4 w-4" />
            Start a Consultation
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add Basic Details</DialogTitle>
          <DialogDescription asChild>
            <AnimatePresence mode="wait">
              {!suggestedDoctors ? (
                <motion.div
                  key="textarea"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <h2 className="text-sm font-medium">
                    Add symptoms or any other details
                  </h2>
                  <Textarea
                    placeholder="Describe the symptoms or details here..."
                    className="min-h-[150px]"
                    onChange={(e) => setNote(e.target.value)}
                    value={note}
                  />
                </motion.div>
              ) : (
                <div>
                  <p>Select the doctor</p>
                  <motion.div
                    key="cards"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                  >
                    {suggestedDoctors.map((doctor, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 1 }}
                        onClick={() => handleDoctorSelect(doctor)}
                      >
                        <CardContainer className="max-w-xl">
                          <CardBody
                            className={`bg-white rounded-lg flex flex-col justify-center border-2 cursor-pointer items-center h-full p-4 ${
                              selectedDoctor?.id === doctor.id
                                ? "border-blue-500"
                                : ""
                            }`}
                          >
                            <Image
                              src={doctor.image}
                              alt={doctor.specialist}
                              width={70}
                              height={50}
                              className="w-[50px] h-[50px] object-cover object-top rounded-full mb-4"
                            />
                            <div className="flex flex-col flex-grow">
                              <h3 className="text-md font-bold">
                                {doctor.specialist}
                              </h3>
                              <p className="text-xs line-clamp-2">
                                {doctor.description}
                              </p>
                            </div>
                          </CardBody>
                        </CardContainer>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button className="w-full" variant="outline">
                Cancel
              </Button>
            </motion.div>
          </DialogClose>
          {!suggestedDoctors ? (
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                className="w-full"
                disabled={!note || loading}
                onClick={onClickNext}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    next <ArrowRight />
                  </>
                )}
              </Button>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                className="w-full sm:w-auto"
                onClick={() => onStartConsultation()}
                disabled={!selectedDoctor}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Start Consultation <ArrowRight />
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewSessionDialog;
