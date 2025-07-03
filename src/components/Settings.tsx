import React, { useState, useEffect } from 'react';
import { useTimerStore } from '@/store/timer';
import { Button } from '@/components/ui/Button';
import { themeInfos, getGradientClass } from '@/lib/themes';
import {
  ArrowLeft,
  Bell,
  Volume2,
  Lock,
  Play,
  RotateCcw,
  Clock,
  Coffee,
  Moon,
  Zap,
  Palette,
  Monitor,
  Eye,
  Settings as SettingsIcon,
} from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';

const Settings: React.FC = () => {
  const {
    settings,
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    setCurrentView,
    updateSettings,
    resetSettings,
    setWorkDuration,
    setShortBreakDuration,
    setLongBreakDuration,
  } = useTimerStore();

  // 本地状态用于临时存储输入值
  const [tempWorkDuration, setTempWorkDuration] = useState(workDuration);
  const [tempShortBreakDuration, setTempShortBreakDuration] = useState(shortBreakDuration);
  const [tempLongBreakDuration, setTempLongBreakDuration] = useState(longBreakDuration);
  const [autostartEnabled, setAutostartEnabled] = useState(false);
  const [loadingAutostart, setLoadingAutostart] = useState(false);

  // 加载开机自启动状态
  useEffect(() => {
    const loadAutostartStatus = async () => {
      try {
        const enabled = await invoke<boolean>('get_autostart_enabled');
        setAutostartEnabled(enabled);
      } catch (error) {
        console.error('Failed to get autostart status:', error);
      }
    };

    loadAutostartStatus();
  }, []);

  // 处理开机自启动切换
  const handleAutostartToggle = async (enabled: boolean) => {
    setLoadingAutostart(true);
    try {
      await invoke('set_autostart_enabled', { enabled });
      setAutostartEnabled(enabled);
      updateSettings({ enableAutostart: enabled });
    } catch (error) {
      console.error('Failed to toggle autostart:', error);
    } finally {
      setLoadingAutostart(false);
    }
  };

  const handleSave = () => {
    // 保存时间设置
    setWorkDuration(tempWorkDuration);
    setShortBreakDuration(tempShortBreakDuration);
    setLongBreakDuration(tempLongBreakDuration);

    // 返回计时器页面
    setCurrentView('timer');
  };

  const handleReset = () => {
    // 重置所有设置
    resetSettings();
    setTempWorkDuration(25);
    setTempShortBreakDuration(5);
    setTempLongBreakDuration(15);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-white/20 bg-white/80 p-6 shadow-2xl backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-800/90">
        {/* 标题栏 */}
        <div className="mb-8 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentView('timer')}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft size={18} />
            返回
          </Button>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800 dark:text-white">
            <SettingsIcon size={24} />
            设置
          </h1>
          <div className="w-20"></div> {/* 占位符用于居中标题 */}
        </div>

        <div className="space-y-8">
          {/* 时间设置 */}
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-lg dark:border-gray-600 dark:from-gray-700 dark:to-gray-600">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-semibold text-gray-800 dark:text-white">
              <div className="rounded-lg bg-blue-500 p-2">
                <Clock size={20} className="text-white" />
              </div>
              时间设置
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* 工作时间 */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <div className="rounded bg-blue-100 p-1 dark:bg-blue-900">
                    <Zap size={14} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  工作时间
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={tempWorkDuration}
                    onChange={(e) => setTempWorkDuration(parseInt(e.target.value) || 1)}
                    className="w-24 rounded-xl border-2 border-blue-200 bg-white px-4 py-3 text-center font-semibold text-gray-900 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-blue-600 dark:bg-gray-800 dark:text-white"
                  />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">分钟</span>
                </div>
              </div>

              {/* 小憩时间 */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <div className="rounded bg-green-100 p-1 dark:bg-green-900">
                    <Coffee size={14} className="text-green-600 dark:text-green-400" />
                  </div>
                  小憩时间
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={tempShortBreakDuration}
                    onChange={(e) => setTempShortBreakDuration(parseInt(e.target.value) || 1)}
                    className="w-24 rounded-xl border-2 border-green-200 bg-white px-4 py-3 text-center font-semibold text-gray-900 transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-green-600 dark:bg-gray-800 dark:text-white"
                  />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">分钟</span>
                </div>
              </div>

              {/* 休息时间 */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <div className="rounded bg-purple-100 p-1 dark:bg-purple-900">
                    <Moon size={14} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  休息时间
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={tempLongBreakDuration}
                    onChange={(e) => setTempLongBreakDuration(parseInt(e.target.value) || 5)}
                    className="w-24 rounded-xl border-2 border-purple-200 bg-white px-4 py-3 text-center font-semibold text-gray-900 transition-all focus:border-purple-500 focus:ring-2 focus:ring-purple-500 dark:border-purple-600 dark:bg-gray-800 dark:text-white"
                  />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">分钟</span>
                </div>
              </div>
            </div>
          </div>

          {/* 触发时间设置 */}
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white">
              <Bell size={20} />
              提醒触发时间
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* 短休息触发时间 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  短休息提醒（工作多久后提醒）
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={settings.shortBreakTriggerTime}
                    onChange={(e) =>
                      updateSettings({
                        shortBreakTriggerTime: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-20 rounded-lg border bg-white px-3 py-2 text-center text-gray-900 focus:border-transparent focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">分钟（0=禁用）</span>
                </div>
              </div>

              {/* 长休息触发时间 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  强制休息提醒
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="240"
                    value={settings.workTriggerTime}
                    onChange={(e) =>
                      updateSettings({
                        workTriggerTime: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-20 rounded-lg border bg-white px-3 py-2 text-center text-gray-900 focus:border-transparent focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">分钟（0=禁用）</span>
                </div>
              </div>
            </div>

            {/* 护眼功能设置 */}
            <div className="mt-4 space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Eye size={16} className="text-blue-500" />
                护眼功能：几次小憩后强制长休息
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={settings.workSessionsUntilLongBreak}
                  onChange={(e) =>
                    updateSettings({
                      workSessionsUntilLongBreak: parseInt(e.target.value) || 2,
                    })
                  }
                  className="w-20 rounded-lg border bg-white px-3 py-2 text-center text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">次小憩后强制长休息</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                💡 推荐设置为2次，有效保护眼睛健康：小憩(可跳过) → 小憩(可跳过) → 强制休息(不可跳过)
              </p>
            </div>
          </div>

          {/* 功能开关 */}
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white">
              <Lock size={20} />
              功能开关
            </h2>

            <div className="space-y-4">
              {/* 严格模式 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock size={16} className="text-red-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      严格模式
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      休息时间无法跳过，强制完成
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={settings.enableStrictMode}
                    onChange={(e) =>
                      updateSettings({
                        enableStrictMode: e.target.checked,
                      })
                    }
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:peer-focus:ring-blue-800"></div>
                </label>
              </div>

              {/* 通知开关 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={16} className="text-blue-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      桌面通知
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">显示系统通知提醒</div>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={settings.enableNotifications}
                    onChange={(e) =>
                      updateSettings({
                        enableNotifications: e.target.checked,
                      })
                    }
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:peer-focus:ring-blue-800"></div>
                </label>
              </div>

              {/* 提示音开关 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 size={16} className="text-green-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      提示音
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">播放提示音效</div>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={settings.enableSounds}
                    onChange={(e) =>
                      updateSettings({
                        enableSounds: e.target.checked,
                      })
                    }
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:peer-focus:ring-blue-800"></div>
                </label>
              </div>

              {/* 自动开始休息 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Play size={16} className="text-orange-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      自动开始休息
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      工作结束后自动开始休息计时
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={settings.autoStartBreaks}
                    onChange={(e) =>
                      updateSettings({
                        autoStartBreaks: e.target.checked,
                      })
                    }
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:peer-focus:ring-blue-800"></div>
                </label>
              </div>

              {/* 自动开始工作 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RotateCcw size={16} className="text-purple-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      自动开始工作
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      休息结束后自动开始工作计时
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={settings.autoStartWork}
                    onChange={(e) =>
                      updateSettings({
                        autoStartWork: e.target.checked,
                      })
                    }
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:peer-focus:ring-blue-800"></div>
                </label>
              </div>
            </div>
          </div>

          {/* 后台运行设置 */}
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white">
              <Monitor size={20} />
              后台运行设置
            </h2>

            <div className="space-y-4">
              {/* 开机自启动 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-green-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      开机自启动
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      系统启动时自动运行应用
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={autostartEnabled}
                    onChange={(e) => handleAutostartToggle(e.target.checked)}
                    disabled={loadingAutostart}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-disabled:opacity-50 dark:border-gray-600 dark:bg-gray-600 dark:peer-focus:ring-blue-800"></div>
                </label>
              </div>

              {/* 系统托盘图标 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye size={16} className="text-blue-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      系统托盘图标
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      在系统托盘中显示应用图标
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={settings.enableTrayIcon}
                    onChange={(e) =>
                      updateSettings({
                        enableTrayIcon: e.target.checked,
                      })
                    }
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:peer-focus:ring-blue-800"></div>
                </label>
              </div>

              {/* 最小化到托盘 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowLeft size={16} className="text-purple-500" />
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      最小化到托盘
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      关闭窗口时隐藏到系统托盘
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={settings.minimizeToTray}
                    onChange={(e) =>
                      updateSettings({
                        minimizeToTray: e.target.checked,
                      })
                    }
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-600 dark:peer-focus:ring-blue-800"></div>
                </label>
              </div>
            </div>
          </div>

          {/* 色彩主题设置 */}
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-700">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-white">
              <Palette size={20} />
              色彩主题
            </h2>

            <div className="space-y-4">
              {/* 主题提示 */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                <div className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  💡 护眼提示
                </div>
                <div className="mt-1 text-xs text-blue-700 dark:text-blue-400">
                  推荐使用「冷静主题」或「自然主题」，低饱和度色彩有助于缓解眼部疲劳
                </div>
              </div>

              {/* 主题选择器 */}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {themeInfos.map((theme) => (
                  <div
                    key={theme.id}
                    className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 ${
                      settings.colorTheme === theme.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                    }`}
                    onClick={() =>
                      updateSettings({
                        colorTheme: theme.id as
                          | 'default'
                          | 'warm'
                          | 'cool'
                          | 'nature'
                          | 'sunset'
                          | 'ocean',
                      })
                    }
                  >
                    {/* 主题预览 */}
                    <div className="mb-3 flex gap-2">
                      <div
                        className={`h-8 w-8 rounded-full ${getGradientClass(theme.id, 'short')}`}
                        title={theme.preview.shortBreak}
                      ></div>
                      <div
                        className={`h-8 w-8 rounded-full ${getGradientClass(theme.id, 'long')}`}
                        title={theme.preview.longBreak}
                      ></div>
                    </div>

                    {/* 主题信息 */}
                    <div>
                      <h3 className="mb-1 text-sm font-semibold text-gray-800 dark:text-white">
                        {theme.name}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {theme.description}
                      </p>
                    </div>

                    {/* 选中标识 */}
                    {settings.colorTheme === theme.id && (
                      <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                        <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center gap-3 border-2 px-6 py-3 text-lg font-semibold text-red-600 shadow-lg hover:border-red-300 hover:bg-red-50"
            >
              <RotateCcw size={20} />
              重置默认
            </Button>

            <Button
              onClick={handleSave}
              className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-3 text-lg font-semibold text-white shadow-lg hover:from-blue-600 hover:to-indigo-700"
            >
              保存设置
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
