import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SessionDetail } from "../medical-agent/[sessionId]/page";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import moment from "moment"
import ViewReportDialog from "./ViewReportDialog";

type Props = {
  historyList: SessionDetail[];
  isLoading?: boolean;
};

const HistoryTable = ({ historyList, isLoading = false }: Props) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <Table className="border-collapse w-full">
      <TableCaption className="text-lg font-semibold mb-4">Previous Consultations</TableCaption>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[300px] font-semibold text-gray-700">AI Medical Specialist</TableHead>
          <TableHead className="font-semibold text-gray-700">Description</TableHead>
          <TableHead className="font-semibold text-gray-700">Date</TableHead>
          <TableHead className="text-right font-semibold text-gray-700">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {historyList.map((record: SessionDetail) => (
          <TableRow key={record.id} className="hover:bg-gray-50 transition-colors">
            <TableCell className="font-medium py-4">{record.selectedDoctor.specialist}</TableCell>
            <TableCell className="py-4">{record.notes}</TableCell>
            <TableCell className="py-4">
             {moment(new Date(record.createdOn)).fromNow()}
            </TableCell>
            <TableCell className="text-right py-4">
              <ViewReportDialog record = {record}/>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default HistoryTable;
