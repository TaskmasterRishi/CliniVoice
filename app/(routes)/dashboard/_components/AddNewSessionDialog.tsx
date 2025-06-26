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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, ClipboardPlus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

const AddNewSessionDialog = () => {
  const [note, setNote] = useState<string>();
  const [loading, setLoading] = useState(false);
  const onClickNext = async () => {
    setLoading(true);
    const result = await axios.post("/api/suggest-doctors", {
      notes: note,
    });
    console.log(result.data);
    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <ClipboardPlus className="h-4 w-4" />
          Start a Consultation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Basic Details</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-4">
              <h2 className="text-sm font-medium">
                Add symptoms or any other details
              </h2>
              <Textarea
                placeholder="Describe the symptoms or details here..."
                className="min-h-[150px]"
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline">Cancel</Button>
          <Button disabled={!note} onClick={() => onClickNext()}>
            next <ArrowRight />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewSessionDialog;
