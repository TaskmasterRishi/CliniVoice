import React from 'react'
import HistoryList from './_components/HistoryList'
import DoctorsAgentList from './_components/DoctorsAgentList'
import AddNewSessionDialog from './_components/AddNewSessionDialog'

const Dashboard = () => {
  return (
    <div className='pt-10 px-10 md:px-20 overflow-y-hidden flex flex-col gap-10'>
      <div className='flex items-center w-full justify-between'>
        <h1 className='font-semibold text-2xl'>My Dashboard</h1>
        <AddNewSessionDialog/>
      </div>
      <HistoryList/>
      <DoctorsAgentList/>
    </div>
  )
}

export default Dashboard