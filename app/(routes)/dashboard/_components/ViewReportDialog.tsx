'use client'
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SessionDetail } from "../medical-agent/[sessionId]/page";
import moment from "moment";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Report = {
  agent?: string;
  chiefComplaint?: string;
  symptoms?: string[];
  medicationsMentioned?: string[];
  recommendations?: string[];
  summary?: string;
};

type Props = {
  record: SessionDetail & { report?: Report };
};

const ViewReportDialog = ({ record }: Props) => {
  const { user } = useUser();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    symptoms: false,
    medications: false,
    recommendations: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size={"sm"}
          className="hover:bg-blue-50 text-sm hover:text-blue-600 transition-colors"
        >
          View Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px] rounded-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">
              Consultation Report
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Summary of your medical consultation
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-50 p-3 rounded-lg"
            >
              <h2 className="font-bold text-base text-gray-800 mb-2">Session Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={"outline"} className="text-blue-500"><span className="text-gray-600 font-medium">Specialist:</span></Badge>
                    <span className="text-sm">{record?.selectedDoctor?.specialist}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={"outline"} className="text-blue-500"><span className="text-gray-600 font-medium">Date:</span></Badge>
                    <span className="text-sm">{moment(new Date(record.createdOn)).format('MMMM Do YYYY, h:mm a')}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={"outline"} className="text-blue-500"><span className="text-gray-600 font-medium">Patient:</span></Badge>
                    <span className="text-sm">{user?.firstName} {user?.lastName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={"outline"} className="text-blue-500"><span className="text-gray-600 font-medium">Agent:</span></Badge>
                    <span className="text-sm">{record?.report?.agent || "N/A"}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 p-3 rounded-lg"
            >
              <h2 className="font-bold text-base text-gray-800 mb-2">Chief Complaint</h2>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {record?.report?.chiefComplaint || "No chief complaint specified."}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-50 p-4 rounded-lg"
            >
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("symptoms")}>
                <h2 className="font-bold text-lg text-gray-800">Symptoms</h2>
                {expandedSections.symptoms ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              <AnimatePresence>
                {expandedSections.symptoms && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 flex flex-wrap gap-2">
                      {record?.report?.symptoms?.length ? (
                        record.report.symptoms.map((symptom: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-blue-500">
                            {symptom}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500">No symptoms specified.</span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-50 p-4 rounded-lg"
            >
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("medications")}>
                <h2 className="font-bold text-lg text-gray-800">Medications Mentioned</h2>
                {expandedSections.medications ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              <AnimatePresence>
                {expandedSections.medications && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 flex flex-wrap gap-2">
                      {record?.report?.medicationsMentioned?.length ? (
                        record.report.medicationsMentioned.map((medication: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-blue-500">
                            {medication}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500">No medications mentioned.</span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-50 p-4 rounded-lg"
            >
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("recommendations")}>
                <h2 className="font-bold text-lg text-gray-800">Recommendations</h2>
                {expandedSections.recommendations ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              <AnimatePresence>
                {expandedSections.recommendations && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 flex flex-wrap gap-2">
                      {record?.report?.recommendations?.length ? (
                        record.report.recommendations.map((recommendation: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-blue-500">
                            {recommendation}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500">No recommendations provided.</span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-50 p-4 rounded-lg"
            >
              <h2 className="font-bold text-lg text-gray-800 mb-2">Summary</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {record?.report?.summary || "No summary available."}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewReportDialog;
