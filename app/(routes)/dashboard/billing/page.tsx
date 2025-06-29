import { PricingTable } from '@clerk/nextjs'
import React from 'react'

const Billing = () => {
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 h-fit lg:px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
          <p className="text-lg text-gray-600">
            Select the subscription that fits your needs. Upgrade or downgrade anytime.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <PricingTable />
        </div>
      </div>
    </div>
  )
}

export default Billing