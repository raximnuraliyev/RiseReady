import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Wind, Clock, Square, Play, Pause } from 'lucide-react'

const TECHNIQUES = [
  { id: 'box', title: 'Box Breathing', steps: ['Inhale 4s', 'Hold 4s', 'Exhale 4s', 'Hold 4s'], cycle: 16 },
  { id: '4-7-8', title: '4-7-8 Breath', steps: ['Inhale 4s', 'Hold 7s', 'Exhale 8s'], cycle: 19 },
  { id: 'paced', title: 'Paced Breathing', steps: ['Inhale 5s', 'Exhale 5s'], cycle: 10 },
]

export default function BreathingExercise() {
  const [running, setRunning] = useState(false)
  const [techIndex, setTechIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => { if (timerRef.current) window.clearInterval(timerRef.current) }
  }, [])

  const start = () => {
    const cycle = TECHNIQUES[techIndex].cycle
    setTimeLeft(cycle)
    setRunning(true)
    timerRef.current = window.setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current)
          setRunning(false)
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  const stop = () => {
    if (timerRef.current) window.clearInterval(timerRef.current)
    setRunning(false)
    setTimeLeft(0)
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-[#1F4E79]">Breathing Exercises</h3>
          <div className="text-sm text-gray-500">Calm your mind in minutes</div>
        </div>
        <div className="text-sm text-gray-500">{running ? 'In session' : 'Ready to relax'}</div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-center">
        <div className="flex-1 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TECHNIQUES.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setTechIndex(i)}
                className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3 ${i === techIndex ? 'border-[#37A6FF] bg-[#EAF7FF]' : 'border-gray-100 hover:bg-gray-50'}`}
              >
                <div className="mt-1">
                  {i === 0 && <Square className="w-6 h-6 text-[#37A6FF]" />}
                  {i === 1 && <Clock className="w-6 h-6 text-[#37A6FF]" />}
                  {i === 2 && <Wind className="w-6 h-6 text-[#37A6FF]" />}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-[#1F4E79] text-lg">{t.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{t.steps.join(' • ')}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={running ? stop : start}
              className="px-5 py-3 bg-[#37A6FF] text-white rounded-lg font-semibold flex items-center gap-3 shadow"
            >
              {running ? <><Pause className="w-5 h-5"/> Stop</> : <><Play className="w-5 h-5"/> Start</>}
            </button>
            <div className="text-sm text-gray-600">{timeLeft > 0 ? `${timeLeft}s remaining` : 'Ready'}</div>
          </div>
        </div>

        <div className="w-48 h-48 flex items-center justify-center">
          <motion.div
            animate={{ scale: running ? 1.15 + (timeLeft % 4) * 0.02 : 1 }}
            transition={{ duration: 1.1, repeat: running ? Infinity : 0, ease: 'easeInOut' }}
            className="w-40 h-40 rounded-full bg-gradient-to-br from-[#A7F3D0] to-[#6EE7B7] flex items-center justify-center shadow-xl"
          >
            <div className="text-2xl font-bold text-[#065F46]">
              {timeLeft > 0 ? <span>{Math.ceil(timeLeft)}s</span> : <Wind className="w-8 h-8" />}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
