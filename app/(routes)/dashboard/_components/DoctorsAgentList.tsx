import { AIDoctorAgents } from '@/shared/list'
import React from 'react'
import { CardContainer, CardBody } from './AiDoctorAgentCard'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const DoctorsAgentList = () => {
  return (
    <div>
        <div>
            <h2 className='text-2xl font-semibold'>AI Specialist Doctors Agent</h2>
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5'>
            {AIDoctorAgents.map((doctor, index) => (
                <CardContainer key={index} className='max-w-xl'>
                    <CardBody className="bg-white rounded-lg flex flex-col shadow-xl border-3 h-full p-2">
                        <Image
                            src={doctor.image} 
                            alt={doctor.specialist} 
                            width={200}
                            height={300}
                            className="w-full h-[230px] md:h-[300px] object-cover object-top rounded-t-sm mb-4"
                        />
                        <div className="flex flex-col flex-grow">
                            <h3 className="text-md md:text-xl font-bold">{doctor.specialist}</h3>
                            <p className="rext-xs md:text-lg text-gray-600 flex-grow line-clamp-2">{doctor.description}</p>
                            <Button className='mt-2'>Consult Doctor</Button>
                        </div>
                    </CardBody>
                </CardContainer>
            ))}
        </div>
    </div>
  )
}

export default DoctorsAgentList