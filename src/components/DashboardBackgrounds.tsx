import React from 'react'
import { motion } from 'framer-motion'

type Variant =
  | 'overview'
  | 'focus'
  | 'wellbeing'
  | 'skills'
  | 'career'
  | 'calendar'
  | 'budget'
  | 'community'

const blob = (size: number, color: string, style: React.CSSProperties, key: string) => (
  <motion.div
    key={key}
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: [0.8, 1.05, 0.95], opacity: [0, 0.6, 0.35] }}
    transition={{ duration: 8 + Math.random() * 6, repeat: Infinity, repeatType: 'reverse' }}
    style={{
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: '50%',
      filter: 'blur(40px)',
      mixBlendMode: 'screen',
      ...style,
      background: color,
    }}
  />
)

export function DashboardBackground({ variant }: { variant: Variant }) {
  // Each variant composes a few blurred gradient blobs and subtle animated shapes
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Shared subtle gradient overlay */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 10% 10%, rgba(255,255,255,0.03), transparent 20%), radial-gradient(ellipse at 90% 90%, rgba(0,0,0,0.02), transparent 25%)',
        }}
      />

      {variant === 'overview' && (
        <>
          {blob(480, 'linear-gradient(135deg, rgba(59,130,246,0.35), rgba(99,102,241,0.2))', { right: '-10%', top: '-8%' }, 'ov1')}
          {blob(360, 'linear-gradient(135deg, rgba(16,185,129,0.28), rgba(6,95,70,0.12))', { left: '-12%', bottom: '-6%' }, 'ov2')}
          {blob(220, 'linear-gradient(135deg, rgba(244,63,94,0.18), rgba(234,88,12,0.08))', { left: '30%', top: '20%' }, 'ov3')}
        </>
      )}

      {variant === 'focus' && (
        <>
          {blob(420, 'linear-gradient(135deg, rgba(99,102,241,0.28), rgba(99,102,241,0.14))', { left: '-8%', top: '10%' }, 'f1')}
          {blob(260, 'linear-gradient(135deg, rgba(16,185,129,0.22), rgba(34,197,94,0.08))', { right: '12%', bottom: '6%' }, 'f2')}
          <motion.div
            initial={{ rotate: 0, opacity: 0.12 }}
            animate={{ rotate: [0, 8, -6, 0], opacity: [0.12, 0.2, 0.12, 0.12] }}
            transition={{ duration: 12, repeat: Infinity }}
            style={{
              position: 'absolute',
              right: '-6%', top: '40%', width: 300, height: 300, borderRadius: 24,
              background: 'linear-gradient(180deg, rgba(245,158,11,0.06), rgba(59,130,246,0.04))',
              filter: 'blur(30px)'
            }}
          />
        </>
      )}

      {variant === 'wellbeing' && (
        <>
          {blob(420, 'linear-gradient(135deg, rgba(236,72,153,0.16), rgba(168,85,247,0.12))', { left: '-6%', bottom: '6%' }, 'w1')}
          {blob(300, 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(34,197,94,0.12))', { right: '6%', top: '6%' }, 'w2')}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            style={{
              position: 'absolute', left: '20%', top: '30%', width: 220, height: 220, borderRadius: '18%',
              background: 'linear-gradient(135deg, rgba(255,230,179,0.14), rgba(245,158,11,0.06))',
              filter: 'blur(36px)'
            }}
          />
        </>
      )}

      {variant === 'skills' && (
        <>
          {blob(380, 'linear-gradient(135deg, rgba(99,102,241,0.22), rgba(6,95,70,0.06))', { left: '-10%', top: '8%' }, 's1')}
          {blob(260, 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(34,197,94,0.08))', { right: '-6%', bottom: '8%' }, 's2')}
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.08, 0.98, 1] }}
            transition={{ duration: 9, repeat: Infinity }}
            style={{ position: 'absolute', left: '40%', top: '15%', width: 200, height: 200, borderRadius: 16, background: 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(99,102,241,0.04))', filter: 'blur(28px)'}}
          />
        </>
      )}

      {variant === 'career' && (
        <>
          {blob(420, 'linear-gradient(135deg, rgba(34,197,94,0.22), rgba(6,95,70,0.08))', { left: '-8%', top: '4%' }, 'c1')}
          {blob(240, 'linear-gradient(135deg, rgba(59,130,246,0.16), rgba(99,102,241,0.06))', { right: '8%', top: '20%' }, 'c2')}
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 6, -4, 0] }}
            transition={{ duration: 14, repeat: Infinity }}
            style={{ position: 'absolute', left: '30%', bottom: '10%', width: 260, height: 160, borderRadius: 20, background: 'linear-gradient(90deg, rgba(245,158,11,0.06), rgba(59,130,246,0.04))', filter: 'blur(30px)'}}
          />
        </>
      )}

      {variant === 'calendar' && (
        <>
          {blob(460, 'linear-gradient(135deg, rgba(99,102,241,0.26), rgba(59,130,246,0.12))', { right: '-12%', top: '-6%' }, 'cal1')}
          {blob(300, 'linear-gradient(135deg, rgba(236,72,153,0.14), rgba(249,115,22,0.08))', { left: '-8%', bottom: '-6%' }, 'cal2')}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: [0, 18, -12, 0] }}
            transition={{ duration: 11, repeat: Infinity }}
            style={{ position: 'absolute', left: '10%', top: '40%', width: 180, height: 180, borderRadius: 18, background: 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(34,197,94,0.04))', filter: 'blur(28px)'}}
          />
        </>
      )}

      {variant === 'budget' && (
        <>
          {blob(420, 'linear-gradient(135deg, rgba(16,185,129,0.28), rgba(6,95,70,0.12))', { right: '-10%', top: '-6%' }, 'b1')}
          {blob(300, 'linear-gradient(135deg, rgba(59,130,246,0.18), rgba(99,102,241,0.08))', { left: '-8%', bottom: '-6%' }, 'b2')}
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.06, 0.98, 1] }}
            transition={{ duration: 10, repeat: Infinity }}
            style={{ position: 'absolute', right: '20%', bottom: '20%', width: 220, height: 220, borderRadius: 24, background: 'linear-gradient(135deg, rgba(245,158,11,0.06), rgba(16,185,129,0.04))', filter: 'blur(32px)'}}
          />
        </>
      )}

      {variant === 'community' && (
        <>
          {blob(380, 'linear-gradient(135deg, rgba(244,63,94,0.18), rgba(168,85,247,0.1))', { left: '-8%', top: '-4%' }, 'com1')}
          {blob(300, 'linear-gradient(135deg, rgba(59,130,246,0.16), rgba(34,197,94,0.08))', { right: '-6%', bottom: '-8%' }, 'com2')}
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 5, -3, 0] }}
            transition={{ duration: 13, repeat: Infinity }}
            style={{ position: 'absolute', left: '25%', top: '20%', width: 200, height: 140, borderRadius: 20, background: 'linear-gradient(90deg, rgba(99,102,241,0.06), rgba(59,130,246,0.04))', filter: 'blur(28px)'}}
          />
        </>
      )}
    </div>
  )
}

export default DashboardBackground
