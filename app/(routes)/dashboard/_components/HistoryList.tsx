"use client";
import { Button } from "@/components/ui/button";
import { ClipboardPlus } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const HistoryList = () => {
  const [historyList, setHistoryList] = useState([]);
  return (
    <div className="mt-10">
      {historyList.length == 0 ? (
        <div className="flex items-center justify-center gap-4 p-10 bg-gray-100 shadow-md rounded-2xl">
          <div>
            <Image src={"/assistance.png"} alt="" width={300} height={0} />
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <h2 className="font-bold text-xl">No recent Consultations</h2>
            <p>It looks like you havn't consultated to any doctors yet!</p>
            <Button>
              <ClipboardPlus />
                Start a Consultation
            </Button>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default HistoryList;
