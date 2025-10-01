import React from 'react'
import InputField from '../components/InputField'
import History from '../components/History'

function Homepage() {
  return (
     <div className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8 flex flex-col items-center">

      <InputField />
      <History />
    </div>
  )
}

export default Homepage