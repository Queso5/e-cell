"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import Aurora from "./aurora"

interface CountdownProps {
  targetDate: string
  colorStops?: string[]
  amplitude?: number
  blend?: number
  speed?: number
}

const CountdownWithAurora: React.FC<CountdownProps> = ({
  targetDate,
  colorStops = ["#ffd319", "#ff2975", "#8c1eff"],
  amplitude = 1.0,
  blend = 0.5,
  speed = 0.5,
}) => {
  const calculateTimeLeft = useCallback(() => {
    const difference = +new Date(targetDate) - +new Date()
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 }

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }
    return timeLeft
  }, [targetDate])

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    return () => clearInterval(timer)
  }, [calculateTimeLeft])

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* Aurora background - full viewport width */}
      <div className="absolute inset-0 z-0">
        <Aurora 
          colorStops={colorStops} 
          amplitude={amplitude} 
          blend={blend} 
          speed={speed}
          className="w-full h-full"
        />
      </div>

      {/* Countdown timer overlay */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4">
        <div className="flex flex-wrap items-start justify-center gap-2 md:gap-4">
          {Object.entries(timeLeft).map(([unit, value], index) => (
            <>
              <div key={unit} className="timer">
                <div className="rounded-xl bg-black/25 backdrop-blur-sm py-8 min-w-[140px] md:min-w-[180px] flex items-center justify-center flex-col gap-4">
                  <h3 className="font-bold text-4xl md:text-7xl text-white text-center">
                    {value.toString().padStart(2, '0')}
                  </h3>
                  <p className="text-xl md:text-2xl uppercase font-medium text-white text-center w-full tracking-wider">
                    {unit}
                  </p>
                </div>
              </div>
              {index < Object.entries(timeLeft).length - 1 && (
                <div className="flex items-center justify-center mt-8">
                  <span className="text-4xl md:text-7xl font-bold text-white">:</span>
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CountdownWithAurora

