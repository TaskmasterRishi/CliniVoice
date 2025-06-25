import React from 'react'
import HistoryList from './_components/HistoryList'
import { Button } from '@/components/ui/button'
import { ClipboardPlus } from 'lucide-react'

const Dashboard = () => {
  return (
    <div className='h-[200vh] pt-10 overflow-y-hidden'>
      <div className='flex items-center w-full justify-between'>
        <h1 className='font-semibold text-2xl'>My Dashboard</h1>
        <Button><ClipboardPlus/>Consult with Doctor</Button>
      </div>
      <HistoryList/>
    </div>
  )
}

export default Dashboard