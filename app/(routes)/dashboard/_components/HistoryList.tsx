"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import AddNewSessionDialog from "./AddNewSessionDialog";
import axios from "axios";
import HistoryTable from "./HistoryTable";
import { Loader } from "lucide-react";

const HistoryList = () => {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetHistoryList();
  }, []);

  const GetHistoryList = async () => {
    try {
      const result = await axios.get("/api/session-chat?sessionId=all");
      console.log(result.data);
      setHistoryList(result.data);
    } catch (error) {
      console.error("Error fetching history list:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader className="h-10 w-10 animate-spin"/>
      </div>
    );
  }

  return (
    <div>
      {historyList.length == 0 ? (
        <div className="flex items-center justify-center gap-4 p-10 bg-gray-100 shadow-md rounded-2xl">
          <div>
            <Image src={"/assistance.png"} alt="" width={300} height={0} />
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <h2 className="font-bold text-xl">No recent Consultations</h2>
            <p>It looks like you havn't consultated to any doctors yet!</p>
            <AddNewSessionDialog />
          </div>
        </div>
      ) : (
        <div>
          <HistoryTable historyList={historyList} />
        </div>
      )}
    </div>
  );
};

export default HistoryList;
