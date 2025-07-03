import { create } from 'zustand';

export interface TimerState {
  isRunning: boolean;
  timeLeft: number;
  totalTime: number;
  mode: 'work' | 'short-break' | 'long-break';
  workDuration: number; // 分钟
  shortBreakDuration: number; // 小憩时间，分钟
  longBreakDuration: number; // 休息时间，分钟
  completedSessions: number;
  shortBreakCount: number; // 连续小憩次数计数器
  isBreakForced: boolean;
  isFullScreen: boolean; // 是否全屏状态
  currentView: 'timer' | 'settings'; // 当前显示的页面
  // 设置相关状态
  settings: {
    workTriggerTime: number; // 工作时间到达多少分钟后触发强制休息提醒，0表示禁用
    shortBreakTriggerTime: number; // 短休息触发时间（工作多少分钟后提醒短休息）
    enableStrictMode: boolean; // 严格模式，休息时无法跳过
    enableNotifications: boolean; // 是否启用通知
    enableSounds: boolean; // 是否启用提示音
    autoStartBreaks: boolean; // 是否自动开始休息
    autoStartWork: boolean; // 休息结束后是否自动开始工作
    workSessionsUntilLongBreak: number; // 多少个工作周期后强制长休息
    colorTheme: 'default' | 'warm' | 'cool' | 'nature' | 'sunset' | 'ocean'; // 色彩主题预设
    enableAutostart: boolean; // 是否启用开机自启动
    enableTrayIcon: boolean; // 是否启用系统托盘图标
    minimizeToTray: boolean; // 是否最小化到系统托盘
  };
}

export interface TimerActions {
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setWorkDuration: (minutes: number) => void;
  setShortBreakDuration: (minutes: number) => void;
  setLongBreakDuration: (minutes: number) => void;
  switchMode: (mode: 'work' | 'short-break' | 'long-break') => void;
  tick: () => void;
  forceShortBreak: () => void;
  forceLongBreak: () => void;
  endBreak: () => void;
  enterFullScreen: () => void;
  exitFullScreen: () => void;
  // 设置相关操作
  setCurrentView: (view: 'timer' | 'settings') => void;
  updateSettings: (settings: Partial<TimerState['settings']>) => void;
  resetSettings: () => void;
  // 托盘快捷操作
  startWork: () => void;
  startBreak: (type: 'short' | 'long') => void;
}

export type TimerStore = TimerState & TimerActions;

export const useTimerStore = create<TimerStore>((set, get) => ({
  // 初始状态
  isRunning: false,
  timeLeft: 25 * 60, // 25分钟，以秒为单位
  totalTime: 25 * 60,
  mode: 'work',
  workDuration: 25,
  shortBreakDuration: 5, // 小憩5分钟
  longBreakDuration: 15, // 休息15分钟
  completedSessions: 0,
  shortBreakCount: 0, // 连续小憩次数计数器
  isBreakForced: false,
  isFullScreen: false,
  currentView: 'timer', // 默认显示计时器页面
  settings: {
    workTriggerTime: 50, // 工作50分钟后提醒休息
    shortBreakTriggerTime: 25, // 工作25分钟后提醒短休息
    enableStrictMode: false, // 默认关闭严格模式
    enableNotifications: true, // 默认开启通知
    enableSounds: true, // 默认开启提示音
    autoStartBreaks: false, // 默认不自动开始休息
    autoStartWork: false, // 默认不自动开始工作
    workSessionsUntilLongBreak: 2, // 2次小憩后强制长休息（护眼机制）
    colorTheme: 'default', // 默认色彩主题
    enableAutostart: false, // 默认关闭开机自启动
    enableTrayIcon: true, // 默认开启系统托盘图标
    minimizeToTray: true, // 默认最小化到系统托盘
  },

  // 行为
  startTimer: () => {
    set({ isRunning: true });
  },

  pauseTimer: () => {
    set({ isRunning: false });
  },

  resetTimer: () => {
    const state = get();
    let duration: number;
    if (state.mode === 'work') {
      duration = state.workDuration;
    } else if (state.mode === 'short-break') {
      duration = state.shortBreakDuration;
    } else {
      duration = state.longBreakDuration;
    }

    set({
      isRunning: false,
      timeLeft: duration * 60,
      totalTime: duration * 60,
    });
  },

  setWorkDuration: (minutes: number) => {
    const state = get();
    if (state.mode === 'work') {
      set({
        workDuration: minutes,
        timeLeft: minutes * 60,
        totalTime: minutes * 60,
      });
    } else {
      set({ workDuration: minutes });
    }
  },

  setShortBreakDuration: (minutes: number) => {
    const state = get();
    if (state.mode === 'short-break') {
      set({
        shortBreakDuration: minutes,
        timeLeft: minutes * 60,
        totalTime: minutes * 60,
      });
    } else {
      set({ shortBreakDuration: minutes });
    }
  },

  setLongBreakDuration: (minutes: number) => {
    const state = get();
    if (state.mode === 'long-break') {
      set({
        longBreakDuration: minutes,
        timeLeft: minutes * 60,
        totalTime: minutes * 60,
      });
    } else {
      set({ longBreakDuration: minutes });
    }
  },

  switchMode: (mode: 'work' | 'short-break' | 'long-break') => {
    const state = get();
    let duration: number;
    if (mode === 'work') {
      duration = state.workDuration;
    } else if (mode === 'short-break') {
      duration = state.shortBreakDuration;
    } else {
      duration = state.longBreakDuration;
    }

    set({
      mode,
      timeLeft: duration * 60,
      totalTime: duration * 60,
      isRunning: false,
      isBreakForced: false,
      // 切换到工作模式时不重置计数器，保持护眼周期
    });
  },

  tick: () => {
    const state = get();
    if (state.timeLeft > 0) {
      set({ timeLeft: state.timeLeft - 1 });
    } else {
      // 时间到了
      if (state.mode === 'work') {
        // 工作时间结束，判断是否需要强制长休息
        const shouldForceLongBreak =
          state.shortBreakCount >= state.settings.workSessionsUntilLongBreak;

        if (shouldForceLongBreak) {
          // 强制长休息（不能跳过）
          set({
            mode: 'long-break',
            timeLeft: state.longBreakDuration * 60,
            totalTime: state.longBreakDuration * 60,
            completedSessions: state.completedSessions + 1,
            shortBreakCount: 0, // 重置小憩计数器
            isBreakForced: true, // 强制休息，不能跳过
            isRunning: state.settings.autoStartBreaks,
            isFullScreen: true, // 进入全屏
          });
        } else {
          // 普通小憩（可以跳过）
          set({
            mode: 'short-break',
            timeLeft: state.shortBreakDuration * 60,
            totalTime: state.shortBreakDuration * 60,
            completedSessions: state.completedSessions + 1,
            shortBreakCount: state.shortBreakCount + 1, // 增加小憩计数
            isBreakForced: false, // 小憩可以跳过
            isRunning: state.settings.autoStartBreaks,
            isFullScreen: state.settings.autoStartBreaks, // 自动开始时进入全屏
          });
        }
      } else {
        // 休息时间结束，回到工作模式
        set({
          mode: 'work',
          timeLeft: state.workDuration * 60,
          totalTime: state.workDuration * 60,
          isBreakForced: false,
          isRunning: state.settings.autoStartWork,
          isFullScreen: false, // 退出全屏
        });
      }
    }
  },

  forceShortBreak: () => {
    const state = get();
    set({
      mode: 'short-break',
      timeLeft: state.shortBreakDuration * 60,
      totalTime: state.shortBreakDuration * 60,
      shortBreakCount: state.shortBreakCount + 1, // 增加小憩计数
      isBreakForced: false, // 手动触发的小憩可以跳过
      isRunning: true,
      isFullScreen: true, // 进入全屏
    });
  },

  forceLongBreak: () => {
    const state = get();
    set({
      mode: 'long-break',
      timeLeft: state.longBreakDuration * 60,
      totalTime: state.longBreakDuration * 60,
      shortBreakCount: 0, // 重置小憩计数器
      isBreakForced: true, // 长休息强制执行
      isRunning: true,
      isFullScreen: true, // 进入全屏
    });
  },

  endBreak: () => {
    const state = get();
    set({
      mode: 'work',
      timeLeft: state.workDuration * 60,
      totalTime: state.workDuration * 60,
      isBreakForced: false,
      isRunning: false,
      isFullScreen: false, // 退出全屏
    });
  },

  enterFullScreen: () => {
    set({ isFullScreen: true });
  },

  exitFullScreen: () => {
    set({ isFullScreen: false });
  },

  // 设置相关操作
  setCurrentView: (view: 'timer' | 'settings') => {
    set({ currentView: view });
  },

  updateSettings: (newSettings: Partial<TimerState['settings']>) => {
    const state = get();
    set({
      settings: {
        ...state.settings,
        ...newSettings,
      },
    });
  },

  resetSettings: () => {
    set({
      settings: {
        workTriggerTime: 50,
        shortBreakTriggerTime: 25,
        enableStrictMode: false,
        enableNotifications: true,
        enableSounds: true,
        autoStartBreaks: false,
        autoStartWork: false,
        workSessionsUntilLongBreak: 2,
        colorTheme: 'default',
        enableAutostart: false,
        enableTrayIcon: true,
        minimizeToTray: true,
      },
    });
  },

  // 托盘快捷操作
  startWork: () => {
    const state = get();
    set({
      mode: 'work',
      timeLeft: state.workDuration * 60,
      totalTime: state.workDuration * 60,
      isRunning: true,
      isFullScreen: false,
      isBreakForced: false,
    });
  },

  startBreak: (type: 'short' | 'long') => {
    const state = get();
    const duration = type === 'short' ? state.shortBreakDuration : state.longBreakDuration;
    set({
      mode: type === 'short' ? 'short-break' : 'long-break',
      timeLeft: duration * 60,
      totalTime: duration * 60,
      shortBreakCount: type === 'short' ? state.shortBreakCount + 1 : 0,
      isRunning: true,
      isFullScreen: true,
      isBreakForced: type === 'long', // 长休息强制执行
    });
  },
}));
