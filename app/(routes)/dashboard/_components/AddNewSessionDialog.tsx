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

interface Doctor {
  image: string;
  specialist: string;
  description: string;
}

const AddNewSessionDialog = () => {
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState<Doctor[] | null>(null);

  const onClickNext = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/suggest-doctors", {
        notes: note,
      });
      setSuggestedDoctors(result.data);
    } catch (error) {
      console.error("Error suggesting doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <ClipboardPlus className="h-4 w-4" />
          Start a Consultation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add Basic Details</DialogTitle>
          <DialogDescription asChild>
            {!suggestedDoctors ? (
              <div className="space-y-4">
                <h2 className="text-sm font-medium">
                  Add symptoms or any other details
                </h2>
                <Textarea
                  placeholder="Describe the symptoms or details here..."
                  className="min-h-[150px]"
                  onChange={(e) => setNote(e.target.value)}
                  value={note}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {suggestedDoctors.map((doctor, index) => (
                  <CardContainer key={index} className='max-w-xl'>
                    <CardBody className="bg-white rounded-lg flex flex-col justify-center border-2 items-center h-full p-4">
                      <Image
                        src={doctor.image} 
                        alt={doctor.specialist} 
                        width={70}
                        height={50}
                        className="w-[50px] h-[50px] object-cover object-top rounded-full mb-4"
                      />
                      <div className="flex flex-col flex-grow">
                        <h3 className="font-bold">{doctor.specialist}</h3>
                        <p className="line-clamp-2">{doctor.description}</p>
                        <Button className='text-sm mt-2'>Consult Doctor</Button>
                      </div>
                    </CardBody>
                  </CardContainer>
                ))}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          {!suggestedDoctors ? (
            <Button disabled={!note || loading} onClick={onClickNext}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  next <ArrowRight />
                </>
              )}
            </Button>
          ) : (
            <Button>Start Consultation</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewSessionDialog;
