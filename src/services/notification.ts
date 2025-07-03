import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification';
import { useTimerStore } from '@/store/timer';

export class NotificationService {
  private static instance: NotificationService;
  private permissionGranted = false;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public async initialize(): Promise<void> {
    try {
      this.permissionGranted = await isPermissionGranted();

      if (!this.permissionGranted) {
        const permission = await requestPermission();
        this.permissionGranted = permission === 'granted';
      }
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  }

  private async sendNotificationIfEnabled(
    title: string,
    body: string,
    icon?: string,
  ): Promise<void> {
    // 获取当前的设置
    const { settings } = useTimerStore.getState();

    if (this.permissionGranted && settings.enableNotifications) {
      await sendNotification({
        title,
        body,
        icon,
      });
    }
  }

  public async sendWorkComplete(): Promise<void> {
    await this.sendNotificationIfEnabled(
      '工作时间结束！',
      '你已经专注工作了一段时间，现在该休息一下了。',
      'work-complete',
    );
  }

  public async sendShortBreakReminder(): Promise<void> {
    await this.sendNotificationIfEnabled(
      '小憩时间',
      '稍微休息一下，闭目养神几分钟。',
      'short-break',
    );
  }

  public async sendLongBreakReminder(): Promise<void> {
    await this.sendNotificationIfEnabled(
      '休息时间',
      '是时候好好休息一下，放松眼睛和大脑了。',
      'long-break',
    );
  }

  public async sendBreakComplete(): Promise<void> {
    await this.sendNotificationIfEnabled(
      '休息结束',
      '休息时间结束，准备开始新的工作周期吧！',
      'break-complete',
    );
  }

  public async sendForceLongBreakWarning(): Promise<void> {
    await this.sendNotificationIfEnabled(
      '护眼强制休息',
      '您已完成2次小憩，现在需要强制休息15分钟来保护眼睛健康！',
      'force-break',
    );
  }

  public async sendEyeProtectionReminder(): Promise<void> {
    await this.sendNotificationIfEnabled(
      '护眼提醒',
      '您已完成多次小憩，下次休息将是强制长休息哦！',
      'eye-protection',
    );
  }
}
