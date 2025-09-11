import React, { useState, useEffect } from 'react'
import logo from '../assets/DR-Logo.png'
const Welcome = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onComplete()
    }, 1500)

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100
        return prev + 2
      })
    }, 40)

    return () => {
      clearTimeout(timer)
      clearInterval(progressTimer)
    }
  }, [onComplete])

  if (!isVisible) return null

  return (
    <div className='fixed inset-0 bg-olive flex items-center justify-center z-50 overflow-hidden'>
      {/* Decorative Circles */}
      <div className='absolute top-20 left-20 w-32 h-32 bg-emerald-800 rounded-full opacity-15 animate-pulse'></div>
      <div className='absolute top-40 right-32 w-24 h-24 bg-emerald-700 rounded-full opacity-30 animate-bounce' style={{animationDelay: '0.5s'}}></div>
      <div className='absolute bottom-32 left-32 w-20 h-20 bg-emerald-500 rounded-full opacity-25 animate-ping'></div>
      <div className='absolute bottom-20 right-20 w-28 h-28 bg-emerald-600 rounded-full opacity-20 animate-pulse' style={{animationDelay: '1s'}}></div>
      <div className='absolute top-1/2 left-10 w-16 h-16 bg-emerald-700 rounded-full opacity-15 animate-bounce' style={{animationDelay: '0.3s'}}></div>
      <div className='absolute top-1/3 right-16 w-12 h-12 bg-emerald-800 rounded-full opacity-20 animate-ping' style={{animationDelay: '0.7s'}}></div>
      <div className='absolute bottom-1/3 left-16 w-18 h-18 bg-emerald-900 rounded-full opacity-15 animate-pulse' style={{animationDelay: '1.2s'}}></div>
      
      <div className='text-center relative z-10'>
        {/* Logo/Title */}
        <div className='mb-8'>
         <img src={logo} alt="logo" />
          <p className='text-dark-green text-xl'>Protecting Our Earth</p>
        </div>

        {/* Animated Dots */}
        <div className='flex justify-center space-x-2 mb-8'>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className='w-3 h-3 bg-dark-green rounded-full animate-bounce'
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
        
        {/* Progress Bar */}
        <div className='w-64 bg-green rounded-full h-2 mx-auto mb-4'>
          <div 
            className='bg-dark-green h-2 rounded-full transition-all duration-100 ease-out'
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Loading Text */}
        <p className='text-dark-green text-lg'>Loading...</p>
      </div>
    </div>
  )
}

export default Welcome