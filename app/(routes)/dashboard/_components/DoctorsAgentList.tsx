import { AIDoctorAgents } from '@/shared/list'
import React from 'react'
import { CardContainer, CardBody } from './AiDoctorAgentCard'
import { Button } from '@/components/ui/button'

const DoctorsAgentList = () => {
  return (
    <div>
        <div>
            <h2 className='text-2xl font-semibold'>AI Specialist Doctors Agent</h2>
        </div>
        <div className='grid grid-cols-5 gap-5'>
            {AIDoctorAgents.map((doctor, index) => (
                <CardContainer key={index} className='max-w-xl'>
                    <CardBody className="bg-white rounded-lg flex flex-col shadow-xl border-3 h-fit p-2">
                        <img 
                            src={doctor.image} 
                            alt={doctor.specialist} 
                            className="w-full h-80 object-cover object-top rounded-t-sm mb-4"
                        />
                        <h3 className="text-xl font-bold">{doctor.specialist}</h3>
                        <p className="text-gray-600">{doctor.description}</p>
                        <Button className='mt-2'>Consult Doctor</Button>
                    </CardBody>
                </CardContainer>
            ))}
        </div>
    </div>
  )
}

export default DoctorsAgentList