import React from 'react'

export default function Content({
    headText='SMM BOOSTER', 
    HeaderSubText='The all-in-one platform to grow your social media presence and boost your engagement.',
    welcomeText= 'Welcome to'
}){

    
  return (
      <div className="lg:flex flex-1 bg-[#00786A] h-screen pb-10 text-white p-5 pt-12 flex-col justify-center items-start">
        <div className="max-w-md mx-auto">
            <p className='text-2xl mb-4'>{welcomeText}</p>
          <h2 className="text-6xl drop-shadow-xl font-bold mb-6">{headText}</h2>
          <p className="text-lg mb-8 text-emerald-100">
            {HeaderSubText}
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-1">Lightning Fast Growth</h3>
                <p className="text-emerald-100">Get real engagement from real users instantly</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-1">Affordable Pricing</h3>
                <p className="text-emerald-100">Start growing your brand without breaking the bank</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-1">Secure & Reliable</h3>
                <p className="text-emerald-100">Your data and privacy are always protected</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-[#00786A]">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2 *:flex *:justify-center *:items-center text-[#00786A] *:font-extrabold">
                <div className="w-8 h-8 bg-white rounded-full border-2 border-[#00786A]">
                  P
                </div>
                <div className="w-8 h-8 bg-white rounded-full border-2 border-[#00786A]">
                  C
                </div>
                <div className="w-8 h-8 bg-white rounded-full border-2 border-[#00786A]">
                  O
                </div>
              </div>
              <p className="text-sm text-emerald-100">
                <span className="font-semibold">1000+</span> active users trust us
              </p>
            </div>
          </div>
        </div>
      </div>
  )
}