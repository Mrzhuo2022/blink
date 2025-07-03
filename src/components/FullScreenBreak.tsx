import React, { useEffect } from 'react';
import { useTimer } from '@/hooks/useTimer';
import { useTimerStore } from '@/store/timer';
import { Button } from '@/components/ui/Button';
import BlinkLogo from '@/components/BlinkLogo';
import { X, Coffee, Moon, Wind } from 'lucide-react';
import { getGradientClass } from '@/lib/themes';
import BreakTip from './BreakTip';

const FullScreenBreak: React.FC = () => {
  const { timeLeft, mode, isBreakForced, endBreak, formatTime, getProgress } = useTimer();

  const { settings } = useTimerStore();

  const progress = getProgress();
  const isShortBreak = mode === 'short-break';

  // 获取当前主题的背景渐变色
  const backgroundClass = getGradientClass(settings.colorTheme, isShortBreak ? 'short' : 'long');

  // 判断是否可以跳过休息：非强制休息且未启用严格模式
  const canSkipBreak = !isBreakForced && !settings.enableStrictMode;

  // 处理ESC键退出全屏
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && canSkipBreak) {
        endBreak();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [endBreak, canSkipBreak]);

  return (
    <div
      className={`fullscreen-break fixed inset-0 z-50 flex items-center justify-center p-4 ${backgroundClass} overflow-hidden`}
    >
      {/* 简化的背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="bg-white/8 absolute -left-[20vw] -top-[20vh] h-[40vh] w-[40vw] animate-pulse rounded-full blur-3xl"></div>
        <div
          className="bg-white/6 absolute -bottom-[20vh] -right-[20vw] h-[45vh] w-[45vw] animate-pulse rounded-full blur-3xl"
          style={{ animationDelay: '1.5s' }}
        ></div>
        <div
          className="bg-white/3 absolute left-1/2 top-1/2 h-[60vh] w-[60vw] -translate-x-1/2 -translate-y-1/2 transform animate-pulse rounded-full blur-3xl"
          style={{ animationDelay: '3s' }}
        ></div>
      </div>

      {/* 主要内容 - 适应屏幕的紧凑布局 */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-8 text-center text-white">
        {/* 顶部关闭按钮 */}
        {canSkipBreak && (
          <div className="absolute right-4 top-4 z-20">
            <Button
              onClick={endBreak}
              variant="ghost"
              size="lg"
              className="rounded-full p-3 text-white/80 backdrop-blur-md transition-all duration-300 hover:bg-white/25 hover:text-white"
            >
              <X size={24} />
            </Button>
          </div>
        )}

        {/* Blink 品牌标识 */}
        <div className="mb-8">
          <BlinkLogo size="lg" variant="dark" className="scale-110 transform opacity-95" />
        </div>

        {/* 休息类型图标和标题 */}
        <div className="mb-10">
          <div className="mb-5 flex justify-center">
            {isShortBreak ? (
              <div className="rounded-2xl bg-white/20 p-5 shadow-xl backdrop-blur-md">
                <Coffee size={40} />
              </div>
            ) : (
              <div className="rounded-2xl bg-white/20 p-5 shadow-xl backdrop-blur-md">
                <Moon size={40} />
              </div>
            )}
          </div>
          <h1 className="text-4xl font-bold drop-shadow-xl sm:text-5xl">
            {isShortBreak ? '☕ 小憩时间' : '🌙 休息时间'}
          </h1>
        </div>

        {/* 时间显示和进度环 */}
        <div className="relative mx-auto mb-10 h-72 w-72 sm:h-80 sm:w-80">
          <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
            {/* 背景圆环 */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="2"
              fill="none"
            />
            {/* 进度圆环 */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>

          {/* 时间文本 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="mb-2 font-mono text-5xl font-bold text-white sm:text-6xl">
              {formatTime(timeLeft)}
            </div>
            <div className="text-base text-white/80">{isShortBreak ? '小憩中' : '休息中'}</div>
          </div>
        </div>

        {/* 休息建议 */}
        {isBreakForced && (
          <BreakTip
            icon={<Wind size={18} />}
            title="休息建议"
            text="短暂的休息能带来更持久的专注力。试试眺望远方，或者闭上眼睛放松几分钟。"
            className="border border-blue-400/30 bg-blue-500/20"
          />
        )}

        {/* 小憩提示 */}
        {!isBreakForced && isShortBreak && (
          <BreakTip
            icon={<Coffee size={18} />}
            title="小憩一下"
            text="站起来走动一下，让眼睛离开屏幕，看看窗外。"
          />
        )}

        {/* 长时休息提示 */}
        {!isBreakForced && !isShortBreak && (
          <BreakTip
            icon={<Moon size={18} />}
            title="放松一下"
            text="是时候进行一次充分的休息了，为下一个专注周期储备能量。"
          />
        )}

        {/* 跳过休息按钮 */}
        {canSkipBreak && (
          <div className="flex flex-col items-center gap-3">
            <Button
              onClick={endBreak}
              variant="outline"
              className="rounded-xl border border-white/40 bg-white/20 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/30"
            >
              <X size={18} className="mr-2" />
              跳过休息
            </Button>
            <div className="text-sm text-white/60">
              按 <span className="rounded-md bg-white/20 px-2 py-1 font-mono">ESC</span> 快速跳过
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FullScreenBreak;
