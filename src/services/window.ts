import { invoke } from '@tauri-apps/api/core';

export class WindowService {
  private static instance: WindowService;

  public static getInstance(): WindowService {
    if (!WindowService.instance) {
      WindowService.instance = new WindowService();
    }
    return WindowService.instance;
  }

  private constructor() {}

  /**
   * 进入全屏休息模式
   */
  public async enterFullscreenBreak(): Promise<void> {
    try {
      await invoke('enter_fullscreen_break');
    } catch (error) {
      console.error('Failed to enter fullscreen break:', error);
    }
  }

  /**
   * 退出全屏休息模式
   */
  public async exitFullscreenBreak(): Promise<void> {
    try {
      await invoke('exit_fullscreen_break');
    } catch (error) {
      console.error('Failed to exit fullscreen break:', error);
    }
  }
}
