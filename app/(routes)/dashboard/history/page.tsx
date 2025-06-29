import React from "react";
import HistoryList from "../_components/HistoryList";

const History = () => {
  return (
    <div className="pt-10 px-10 md:px-20 overflow-y-hidden flex flex-col gap-10">
      <HistoryList />
    </div>
  );
};

export default History;
 