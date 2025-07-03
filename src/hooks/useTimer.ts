import { useEffect } from 'react';
import { useTimerStore } from '@/store/timer';
import { NotificationService } from '@/services/notification';

export const useTimer = () => {
  const store = useTimerStore();
  const notificationService = NotificationService.getInstance();

  useEffect(() => {
    // 初始化通知服务
    notificationService.initialize();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (store.isRunning) {
      interval = setInterval(() => {
        const prevTimeLeft = store.timeLeft;
        const prevMode = store.mode;

        store.tick();

        // 检查是否刚刚切换模式
        if (prevTimeLeft === 1) {
          if (prevMode === 'work') {
            const shouldForceLongBreak =
              store.shortBreakCount >= store.settings.workSessionsUntilLongBreak;

            if (shouldForceLongBreak) {
              // 工作结束，进入强制长休息
              notificationService.sendWorkComplete();
              notificationService.sendForceLongBreakWarning();
            } else {
              // 工作结束，进入普通小憩
              notificationService.sendWorkComplete();
              notificationService.sendShortBreakReminder();
            }
          } else if (prevMode === 'short-break') {
            // 小憩结束
            notificationService.sendBreakComplete();
          } else if (prevMode === 'long-break') {
            // 休息结束
            notificationService.sendBreakComplete();
          }
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [store.isRunning]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgress = (): number => {
    return ((store.totalTime - store.timeLeft) / store.totalTime) * 100;
  };

  return {
    ...store,
    formatTime,
    getProgress,
  };
};
