import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Award, Flame, Clock, Target, Zap } from 'lucide-react';
import { useFocus } from '../../hooks/useFocus';
import { useDashboardContext } from '../../contexts/DashboardContext';
import { useUserLevel } from '../../hooks/useUserLevel';
import { format } from 'date-fns';
import SimpleLevelModal from '../../components/dashboard/SimpleLevelModal';
import './FocusPage.css';

const TIMER_PRESETS = [15, 25, 45, 60];
const SESSION_TYPES = ['Study', 'Work', 'Project', 'Reading'];

// Level indicator UI is provided in the header button; no separate component needed here.

export default function FocusPage() {
  const { sessions, badges, streak, totalTime, loading: focusLoading, createSession } = useFocus();
  const { level } = useUserLevel();
  const { loading: dashboardLoading, refreshStats } = useDashboardContext();
  
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState('Study');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showLevelModal, setShowLevelModal] = useState(false);

  useEffect(() => {
    // Request notification permission when component mounts
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Handle session completion
  const handleSessionComplete = useCallback(async () => {
    setIsActive(false);
    
    if (startTime) {
      const endTime = new Date();
      await createSession({
        duration,
        type: sessionType,
        completed: true,
        notes: '',
        startTime,
        endTime
      });
      await refreshStats();

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Focus Session Complete! 🎉', {
          body: `Great work! You completed a ${duration} minute ${sessionType} session.`,
          icon: '/logo.svg'
        });
      }
    }
  }, [startTime, duration, sessionType, createSession, refreshStats]);

  // Timer controls
  const handleStart = () => {
    if (!isActive) {
      setIsActive(true);
      setStartTime(new Date());
    }
  };

  const handlePause = () => {
    if (isActive) {
      setIsActive(false);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
    setStartTime(null);
  };

  const handleDurationChange = (mins: number) => {
    if (!isActive) {
      setDuration(mins);
      setTimeLeft(mins * 60);
    }
  };

  // Timer countdown effect
  useEffect(() => {
    let interval: number | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            handleSessionComplete();
            return 0;
          }
          return time - 1;
        });
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      // Session complete
      handleSessionComplete()
    }
    
    return () => {
      if (interval !== null) window.clearInterval(interval)
    }
  }, [isActive, timeLeft, handleSessionComplete])



  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100

  if (focusLoading || dashboardLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-gray-600">Loading focus zone...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Target className="w-7 h-7 text-white" strokeWidth={2} />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Focus Zone</h1>
                <p className="text-sm text-gray-600 mt-0.5">Stay focused and productive 🎯</p>
              </div>
            </div>
            <motion.button
              onClick={() => setShowLevelModal(true)}
              className="hidden md:flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer relative group overflow-hidden"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Open level modal"
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-pink-400 blur-lg" />
              </div>
              
              {/* Content */}
              <div className="relative z-10 flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6">
                  <Award className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <span className="text-sm font-bold tracking-wide">Level {level || 1}</span>
              </div>
            </motion.button>
          </div>

          {/* Level modal (clickable from the header) */}
          <SimpleLevelModal isOpen={showLevelModal} onClose={() => setShowLevelModal(false)} level={level} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Your Statistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Streak */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="group relative h-full overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-800" />
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-orange-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              
              <div className="relative z-10 p-6 h-full flex flex-col justify-between min-h-[200px]">
                <motion.div
                  className="inline-flex w-14 h-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg group-hover:bg-white/30 transition-all duration-300"
                  whileHover={{ scale: 1.15 }}
                >
                  <Flame className="w-7 h-7 text-white" strokeWidth={2} />
                </motion.div>

                <div className="space-y-2 pt-4">
                  <p className="text-white/80 text-sm font-medium">Current Streak</p>
                  <p className="text-4xl font-bold text-white">{streak.streak}</p>
                  <p className="text-white/70 text-xs">days 🔥</p>
                </div>
              </div>
            </motion.div>

            {/* This Week */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="group relative h-full overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800" />
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              
              <div className="relative z-10 p-6 h-full flex flex-col justify-between min-h-[200px]">
                <motion.div
                  className="inline-flex w-14 h-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg group-hover:bg-white/30 transition-all duration-300"
                  whileHover={{ scale: 1.15 }}
                >
                  <Clock className="w-7 h-7 text-white" strokeWidth={2} />
                </motion.div>

                <div className="space-y-2 pt-4">
                  <p className="text-white/80 text-sm font-medium">This Week</p>
                  <p className="text-4xl font-bold text-white">{totalTime.totalHours}h</p>
                  <p className="text-white/70 text-xs">{totalTime.totalSessions} sessions</p>
                </div>
              </div>
            </motion.div>

            {/* Badges Earned */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="group relative h-full overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-800" />
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-green-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              
              <div className="relative z-10 p-6 h-full flex flex-col justify-between min-h-[200px]">
                <motion.div
                  className="inline-flex w-14 h-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-lg group-hover:bg-white/30 transition-all duration-300"
                  whileHover={{ scale: 1.15 }}
                >
                  <Award className="w-7 h-7 text-white" strokeWidth={2} />
                </motion.div>

                <div className="space-y-2 pt-4">
                  <p className="text-white/80 text-sm font-medium">Badges Earned</p>
                  <p className="text-4xl font-bold text-white">{badges.length}</p>
                  <p className="text-white/70 text-xs">Nice work! ⭐</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Timer Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Timer */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
            >
              {/* Session Type */}
              <div className="flex gap-2 mb-6">
                {SESSION_TYPES.map((type) => (
                  <motion.button
                    key={type}
                    onClick={() => !isActive && setSessionType(type)}
                    disabled={isActive}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      sessionType === type
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                    whileHover={!isActive ? { scale: 1.05 } : {}}
                    whileTap={!isActive ? { scale: 0.98 } : {}}
                  >
                    {type}
                  </motion.button>
                ))}
              </div>

              {/* Timer Display */}
              <div className="relative mb-8">
                <svg className="w-full max-w-sm mx-auto" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="8"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="#A78BFA"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 90}`}
                    strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                    transform="rotate(-90 100 100)"
                    style={{ transition: 'stroke-dashoffset 0.5s linear' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-gray-900">
                      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </div>
                    <div className="text-lg text-gray-600 mt-2 font-semibold">{sessionType} Session</div>
                  </div>
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex justify-center gap-4 mb-8">
                {!isActive ? (
                  <motion.button
                    onClick={handleStart}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play className="w-5 h-5" />
                    Start
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handlePause}
                    className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Pause className="w-5 h-5" />
                    Pause
                  </motion.button>
                )}
                <motion.button
                  onClick={handleReset}
                  className="px-8 py-4 bg-gray-200 text-gray-700 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-300 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </motion.button>
              </div>

              {/* Duration Presets */}
              <div className="grid grid-cols-4 gap-3">
                {TIMER_PRESETS.map((preset) => (
                  <motion.button
                    key={preset}
                    onClick={() => handleDurationChange(preset)}
                    disabled={isActive}
                    className={`py-3 rounded-lg font-semibold transition-all ${
                      duration === preset
                        ? 'bg-purple-100 border-2 border-purple-600 text-purple-600'
                        : 'bg-gray-50 border-2 border-gray-200 text-gray-600 hover:bg-gray-100'
                    } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                    whileHover={!isActive ? { scale: 1.05 } : {}}
                    whileTap={!isActive ? { scale: 0.98 } : {}}
                  >
                    {preset}m
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Badges</h3>
              
              {badges.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">🏆</div>
                  <p className="text-sm text-gray-600 font-medium">Complete sessions to earn badges!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {badges.slice(0, 5).map((badge) => (
                    <motion.div
                      key={badge._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 hover:shadow-md transition-all"
                    >
                      <div className="text-2xl">🏆</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-sm">{badge.badgeName}</div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(badge.earnedAt), 'MMM d')}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Latest Achievement */}
            {badges.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl shadow-lg p-6 text-white border border-amber-500"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5" />
                  <h3 className="text-lg font-bold">Latest Achievement</h3>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-3">🎉</div>
                  <div className="font-bold mb-2">{badges[0].badgeName}</div>
                  <div className="text-sm text-white/80">
                    Earned {format(new Date(badges[0].earnedAt), 'MMM d')}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Recent Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-gray-900">Recent Sessions</h2>
          
          {sessions.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100 text-center">
              <div className="text-6xl mb-4">⏰</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No sessions yet</h3>
              <p className="text-gray-600">Start your first focus session above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.slice(0, 6).map((session, idx) => (
                <motion.div
                  key={session._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group p-4 rounded-lg bg-white border-2 border-gray-100 hover:border-purple-300 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-900 text-sm">{session.type}</span>
                    {session.completed && (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
                        <span className="text-green-600 font-bold">✓</span>
                      </span>
                    )}
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {session.duration}m
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(session.startTime), 'MMM d, h:mm a')}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
