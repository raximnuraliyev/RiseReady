import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Award, Flame, Clock, Target, Zap } from 'lucide-react';
import { useFocus } from '../../hooks/useFocus';
import { useDashboardContext } from '../../contexts/DashboardContext';
import { useUserLevel } from '../../hooks/useUserLevel';
import { format } from 'date-fns';
import LevelModal from '../../components/dashboard/LevelModal';
import DashboardBackground from '../../components/DashboardBackgrounds'

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
          new Notification('Focus Session Complete', {
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
    <div className="min-h-screen relative bg-gradient-to-br from-[#FAFAFA] to-[#F0F0FF] pb-20">
      <DashboardBackground variant="focus" />
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-2xl flex items-center justify-center shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
                <div>
                <h1 className="text-3xl font-bold text-[#1F4E79]">Focus Zone</h1>
                <p className="text-sm text-gray-600 mt-0.5">Stay focused and productive</p>
              </div>
            </div>
            <button
              onClick={() => setShowLevelModal(true)}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/20 rounded-full border-2 border-[#FFD700]/30 hover:shadow-lg transition-all duration-200"
              aria-label="Open level modal"
            >
              <Award className="w-5 h-5 text-[#FFA500]" />
              <span className="font-semibold text-[#1F4E79]">Level {level}</span>
            </button>
          </div>

          {/* Level modal (clickable from the header) */}
          <LevelModal isOpen={showLevelModal} onClose={() => setShowLevelModal(false)} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Current Streak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-3xl shadow-lg p-6 text-white relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm font-medium">Current Streak</span>
                <Flame className="w-8 h-8" />
              </div>
              <div className="text-4xl font-bold mb-1">{streak.streak} days</div>
              <div className="text-white/80 text-sm">Keep the fire burning!</div>
            </div>
          </motion.div>

          {/* This Week */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-3xl shadow-lg p-6 text-white relative overflow-hidden"
          >
              <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm font-medium">This Week</span>
                <Clock className="w-8 h-8" />
              </div>
              <div className="text-4xl font-bold mb-1">{totalTime.totalHours}h</div>
              <div className="text-white/80 text-sm">{totalTime.totalSessions} sessions</div>
            </div>
          </motion.div>

          {/* Badges Earned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-3xl shadow-lg p-6 text-white relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm font-medium">Badges Earned</span>
                <Award className="w-8 h-8" />
              </div>
              <div className="text-4xl font-bold mb-1">{badges.length}</div>
              <div className="text-white/80 text-sm">Nice work!</div>
            </div>
          </motion.div>
        </div>

        {/* Timer Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Timer */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
            >
              {/* Session Type */}
              <div className="flex gap-2 mb-6">
                {SESSION_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => !isActive && setSessionType(type)}
                    disabled={isActive}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      sessionType === type
                        ? 'bg-[#8B5CF6] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Timer Display */}
              <div className="relative">
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
                    stroke="#8B5CF6"
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
                    <div className="text-6xl font-bold text-[#1F4E79]">
                      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </div>
                    <div className="text-lg text-gray-600 mt-2">{sessionType} Session</div>
                  </div>
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex justify-center gap-4 mt-8">
                {!isActive ? (
                  <button
                    onClick={handleStart}
                    className="px-8 py-4 bg-[#8B5CF6] text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-[#7C3AED] transition-colors shadow-lg"
                  >
                    <Play className="w-5 h-5" />
                    Start
                  </button>
                ) : (
                  <button
                    onClick={handlePause}
                    className="px-8 py-4 bg-[#F59E0B] text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-[#D97706] transition-colors shadow-lg"
                  >
                    <Pause className="w-5 h-5" />
                    Pause
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-200 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </button>
              </div>

              {/* Duration Presets */}
              <div className="grid grid-cols-4 gap-3 mt-6">
                {TIMER_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handleDurationChange(preset)}
                    disabled={isActive}
                    className={`py-3 rounded-xl font-semibold transition-all ${
                      duration === preset
                        ? 'bg-[#EAF7FF] border-2 border-[#8B5CF6] text-[#8B5CF6]'
                        : 'bg-gray-50 border-2 border-gray-200 text-gray-600 hover:bg-gray-100'
                    } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {preset} min
                  </button>
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
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-lg font-bold text-[#1F4E79] mb-4">Your Badges</h3>
              
              {badges.length === 0 ? (
                <div className="text-center py-6">
                    <div className="mb-2">
                      <Award className="w-10 h-10 text-amber-400 mx-auto" />
                    </div>
                  <p className="text-sm text-gray-600">Complete sessions to earn badges!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {badges.slice(0, 5).map((badge) => (
                    <div
                      key={badge._id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-[#FFD700]/10 to-[#FFA500]/10 border border-[#FFD700]/20"
                    >
                      <div>
                        <Award className="w-6 h-6 text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[#1F4E79] text-sm">{badge.badgeName}</div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(badge.earnedAt), 'MMM d, yyyy')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Latest Achievement */}
            {badges.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/20 rounded-3xl shadow-lg p-6 border-2 border-[#FFD700]/30"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-[#FFA500]" />
                  <h3 className="text-lg font-bold text-[#1F4E79]">Latest Achievement</h3>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-3">
                    <Zap className="w-12 h-12 text-[#FFA500] mx-auto" />
                  </div>
                  <div className="font-bold text-[#1F4E79] mb-1">{badges[0].badgeName}</div>
                  <div className="text-sm text-gray-600">
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
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100"
        >
          <h2 className="text-xl font-bold text-[#1F4E79] mb-4">Recent Sessions</h2>
          
          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <Clock className="w-16 h-16 mx-auto text-[#8B5CF6]" />
              </div>
              <h3 className="text-lg font-bold text-[#1F4E79] mb-2">No sessions yet</h3>
              <p className="text-gray-600">Start your first focus session above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.slice(0, 6).map((session) => (
                <div
                  key={session._id}
                  className="p-4 rounded-xl border-2 border-gray-100 hover:border-[#8B5CF6]/30 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-[#1F4E79]">{session.type}</span>
                    {session.completed && (
                      <span className="text-green-500">✓</span>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-[#8B5CF6] mb-1">
                    {session.duration} min
                  </div>
                  <div className="text-sm text-gray-600">
                    {format(new Date(session.startTime), 'MMM d, h:mm a')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
