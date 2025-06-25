"use client";
import Image from "next/image";
import React, { useState } from "react";

const HistoryList = () => {
  const [historyList, setHistoryList] = useState([]);
  return (
    <div>
      {historyList.length == 0 ? (
        <div className="flex items-center justify-center gap-4 bg-gray-200 mt-10 shadow rounded-2xl">
          <div>
            <Image src={"/assistance.png"} alt="" width={300} height={0} />
          </div>
          <div>
            <h2 className="font-bold text-xl">No recent Consultations</h2>
            <p>It looks like you havn't consultated to any doctors yet!</p>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default HistoryList;
