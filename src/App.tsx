import TimerDisplay from './components/TimerDisplay';
import FullScreenBreak from './components/FullScreenBreak';
import Settings from './components/Settings';
import { useTimerStore } from './store/timer';
import { WindowService } from './services/window';
import { useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';

function App() {
  const { isFullScreen, mode, currentView, startWork, startBreak, setCurrentView } =
    useTimerStore();
  const windowService = WindowService.getInstance();

  // 监听全屏状态变化，控制窗口
  useEffect(() => {
    if (isFullScreen && (mode === 'short-break' || mode === 'long-break')) {
      // 进入全屏休息模式
      windowService.enterFullscreenBreak();
    } else if (!isFullScreen) {
      // 退出全屏休息模式
      windowService.exitFullscreenBreak();
    }
  }, [isFullScreen, mode, windowService]);

  // 监听托盘事件
  useEffect(() => {
    const setupTrayEventListeners = async () => {
      try {
        console.log('设置托盘事件监听器...');

        // 监听托盘开始工作事件
        await listen('tray-start-work', () => {
          console.log('接收到托盘开始工作事件');
          startWork();
          setCurrentView('timer');
        });

        // 监听托盘开始休息事件
        await listen('tray-start-break', (event) => {
          console.log('接收到托盘开始休息事件:', event.payload);
          const breakType = event.payload as string;
          if (breakType === 'short') {
            startBreak('short');
          } else if (breakType === 'long') {
            startBreak('long');
          }
          setCurrentView('timer');
        });

        // 监听显示设置事件
        await listen('show-settings', () => {
          console.log('接收到显示设置事件');
          // 显示设置页面
          setCurrentView('settings');
        });

        console.log('托盘事件监听器设置完成');
      } catch (error) {
        console.error('设置托盘事件监听器失败:', error);
      }
    };

    setupTrayEventListeners();
  }, [startWork, startBreak, setCurrentView]);

  // 如果是休息模式且全屏，显示全屏休息组件
  if (isFullScreen && (mode === 'short-break' || mode === 'long-break')) {
    return <FullScreenBreak />;
  }

  // 根据当前视图显示对应的组件
  if (currentView === 'settings') {
    return <Settings />;
  }

  return <TimerDisplay />;
}

export default App;
