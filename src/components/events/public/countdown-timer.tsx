"use client"

import { useState, useEffect } from "react"

interface CountdownTimerProps {
  targetDate: Date
  className?: string
  cardBg?: string | null
  textColor?: string
  labelColor?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownTimer({
  targetDate,
  className = "",
  cardBg = "rgba(255,255,255,0.1)",
  textColor = "#ffffff",
  labelColor = "#cccccc",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    const calculateTimeLeft = (): TimeLeft => {
      const difference = targetDate.getTime() - new Date().getTime()

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return (
      <div className={`flex gap-4 ${className}`}>
        {["Days", "Hours", "Min", "Sec"].map((label) => (
          <div key={label} className="flex flex-col items-center">
            <div
              className="backdrop-blur-sm rounded-lg px-4 py-3 min-w-[70px]"
              style={{ backgroundColor: cardBg || 'rgba(255,255,255,0.1)' }}
            >
              <span className="text-3xl font-bold" style={{ color: textColor }}>--</span>
            </div>
            <span className="text-sm mt-2" style={{ color: labelColor }}>{label}</span>
          </div>
        ))}
      </div>
    )
  }

  const timeUnits = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Sec" },
  ]

  return (
    <div className={`flex gap-4 ${className}`}>
      {timeUnits.map(({ value, label }) => (
        <div key={label} className="flex flex-col items-center">
          <div
            className="backdrop-blur-sm rounded-lg px-4 py-3 min-w-[70px]"
            style={{ backgroundColor: cardBg || 'rgba(255,255,255,0.1)' }}
          >
            <span className="text-3xl font-bold" style={{ color: textColor }}>
              {value.toString().padStart(2, "0")}
            </span>
          </div>
          <span className="text-sm mt-2" style={{ color: labelColor }}>{label}</span>
        </div>
      ))}
    </div>
  )
}
