import React from 'react';
import { useTimer } from '@/hooks/useTimer';
import { useTimerStore } from '@/store/timer';
import { Button } from '@/components/ui/Button';
import BlinkLogo from '@/components/BlinkLogo';
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Coffee,
  Focus,
  Moon,
  AlertTriangle,
  Info,
  BatteryCharging,
} from 'lucide-react';
import InfoCard from './InfoCard';

const TimerDisplay: React.FC = () => {
  const {
    isRunning,
    timeLeft,
    mode,
    completedSessions,
    shortBreakCount,
    isBreakForced,
    startTimer,
    pauseTimer,
    resetTimer,
    forceShortBreak,
    forceLongBreak,
    endBreak,
    formatTime,
    getProgress,
  } = useTimer();

  const { settings, setCurrentView } = useTimerStore();

  const progress = getProgress();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-2xl rounded-3xl border border-white/30 bg-white/90 p-8 shadow-2xl backdrop-blur-lg dark:border-gray-700/50 dark:bg-gray-800/95">
        {/* 顶部标题栏 */}
        <div className="mb-8 flex items-center justify-between">
          <BlinkLogo size="md" />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 rounded-xl px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setCurrentView('settings')}
            >
              <Settings size={18} />
              设置
            </Button>
          </div>
        </div>

        {/* 状态指示器 */}
        <div className="mb-8 flex items-center justify-center">
          <div
            className={`flex items-center gap-3 rounded-2xl px-6 py-3 shadow-lg backdrop-blur-sm ${
              mode === 'work'
                ? 'border border-blue-200 bg-blue-100/70 text-blue-700 dark:border-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                : mode === 'short-break'
                  ? 'border border-green-200 bg-green-100/70 text-green-700 dark:border-green-800 dark:bg-green-900/50 dark:text-green-300'
                  : 'border border-purple-200 bg-purple-100/70 text-purple-700 dark:border-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
            }`}
          >
            {mode === 'work' ? (
              <Focus size={22} />
            ) : mode === 'short-break' ? (
              <Coffee size={22} />
            ) : (
              <Moon size={22} />
            )}
            <span className="text-lg font-semibold">
              {mode === 'work' ? '专注工作' : mode === 'short-break' ? '小憩时间' : '休息时间'}
            </span>
          </div>
        </div>

        {/* 进度环 */}
        <div className="relative mx-auto mb-10 h-80 w-80">
          <svg className="h-full w-full -rotate-90 transform drop-shadow-lg" viewBox="0 0 100 100">
            {/* 背景圆环 */}
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* 进度圆环 */}
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="currentColor"
              strokeWidth="7"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}`}
              className={`drop-shadow-lg transition-all duration-1000 ${
                mode === 'work'
                  ? 'text-blue-500'
                  : mode === 'short-break'
                    ? 'text-green-500'
                    : 'text-purple-500'
              }`}
            />
          </svg>

          {/* 时间显示 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="mb-2 font-mono text-6xl font-bold text-gray-800 drop-shadow-lg dark:text-white">
              {formatTime(timeLeft)}
            </div>
            <div className="text-base font-semibold text-gray-600 dark:text-gray-300">
              已完成 {completedSessions} 个周期
            </div>
            {/* 长休息进度提示 */}
            {mode === 'work' &&
              settings.workSessionsUntilLongBreak > 1 &&
              shortBreakCount < settings.workSessionsUntilLongBreak && (
                <div className="animate-fade-in mt-3 flex w-auto items-center justify-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-500 shadow-inner dark:bg-gray-700/50 dark:text-gray-400">
                  <BatteryCharging size={14} className="text-green-500" />
                  <span className="font-medium">
                    再专注{' '}
                    <span className="font-bold text-gray-700 dark:text-gray-200">
                      {settings.workSessionsUntilLongBreak - shortBreakCount}
                    </span>{' '}
                    次即可长时休息
                  </span>
                </div>
              )}
          </div>
        </div>

        {/* 提示信息区域 */}
        <div className="min-h-[40px]">
          {/* 强制休息警告 */}
          {mode === 'work' && shortBreakCount >= settings.workSessionsUntilLongBreak && (
            <InfoCard
              icon={<AlertTriangle size={18} />}
              title="休息一下吧"
              text={`您已连续专注 ${shortBreakCount} 个周期，下次将是健康长休息。`}
              className="animate-fade-in border-yellow-300/70 bg-yellow-100/80 text-yellow-800 dark:border-yellow-800/60 dark:bg-yellow-900/40 dark:text-yellow-200"
            />
          )}

          {/* 休息中的提示 */}
          {isBreakForced && (mode === 'short-break' || mode === 'long-break') && (
            <InfoCard
              icon={<Info size={18} />}
              title="健康休息时间"
              text="为了您的健康，请完成这次休息，让眼睛和大脑都放松一下。"
              className="animate-fade-in border-blue-300/70 bg-blue-100/80 text-blue-800 dark:border-blue-800/60 dark:bg-blue-900/40 dark:text-blue-200"
            />
          )}
        </div>

        {/* 主要控制按钮 */}
        <div className="mb-6 flex justify-center gap-4">
          <Button
            onClick={isRunning ? pauseTimer : startTimer}
            disabled={isBreakForced && (mode === 'short-break' || mode === 'long-break')}
            size="lg"
            className={`flex transform items-center gap-3 rounded-2xl px-8 py-3 text-base font-semibold shadow-xl transition-all duration-300 hover:scale-105 ${
              isRunning
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
            }`}
          >
            {isRunning ? <Pause size={22} /> : <Play size={22} />}
            {isRunning ? '暂停' : '开始'}
          </Button>

          <Button
            onClick={resetTimer}
            variant="outline"
            size="lg"
            className="flex transform items-center gap-3 rounded-2xl border-2 bg-white/90 px-8 py-3 text-base font-semibold shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-50 dark:bg-gray-800/90 dark:hover:bg-gray-700"
          >
            <RotateCcw size={22} />
            重置
          </Button>
        </div>

        {/* 休息控制按钮 */}
        <div className="min-h-[60px]">
          {mode === 'work' && !isBreakForced && (
            <div className="animate-fade-in flex justify-center gap-4">
              <Button
                onClick={forceShortBreak}
                variant="secondary"
                className="flex transform items-center gap-2 rounded-xl border-2 border-green-300/80 bg-gradient-to-r from-green-100 to-green-200 px-6 py-2 text-sm font-semibold text-green-700 shadow-lg transition-all duration-300 hover:scale-105 hover:border-green-400 hover:from-green-200 hover:to-green-300"
              >
                <Coffee size={18} />
                小憩
              </Button>

              <Button
                onClick={forceLongBreak}
                variant="outline"
                className="flex transform items-center gap-2 rounded-xl border-2 border-purple-300/80 bg-gradient-to-r from-purple-100 to-purple-200 px-6 py-2 text-sm font-semibold text-purple-700 shadow-lg transition-all duration-300 hover:scale-105 hover:border-purple-400 hover:from-purple-200 hover:to-purple-300"
              >
                <Moon size={18} />
                休息
              </Button>
            </div>
          )}
        </div>

        {/* 强制休息结束按钮 */}
        {isBreakForced && (
          <div className="animate-fade-in mt-4 flex justify-center">
            <Button
              onClick={endBreak}
              variant="destructive"
              className="flex transform items-center gap-2 rounded-xl border-2 border-gray-500 bg-gradient-to-r from-gray-600 to-gray-700 px-8 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:border-gray-400 hover:from-gray-700 hover:to-gray-800"
            >
              结束强制休息
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimerDisplay;
