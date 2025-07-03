// 防止控制台窗口在 Windows Release 版本中额外出现
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    AppHandle, Manager, tray::TrayIconBuilder, tray::TrayIconEvent,
    tray::MouseButton, tray::MouseButtonState, menu::{MenuBuilder, MenuItemBuilder},
    Window, WebviewWindow, Emitter
};
use tauri_plugin_autostart::ManagerExt;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn enter_fullscreen_break(window: Window) -> Result<(), String> {
    // 设置窗口全屏
    window.set_fullscreen(true).map_err(|e| e.to_string())?;
    // 设置窗口置顶
    window.set_always_on_top(true).map_err(|e| e.to_string())?;
    // 获取焦点
    window.set_focus().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn exit_fullscreen_break(window: Window) -> Result<(), String> {
    // 取消全屏
    window.set_fullscreen(false).map_err(|e| e.to_string())?;
    // 取消置顶
    window.set_always_on_top(false).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn get_autostart_enabled(app_handle: AppHandle) -> Result<bool, String> {
    app_handle.autolaunch().is_enabled().map_err(|e| e.to_string())
}

#[tauri::command]
async fn set_autostart_enabled(app_handle: AppHandle, enabled: bool) -> Result<(), String> {
    let autostart_manager = app_handle.autolaunch();
    if enabled {
        autostart_manager.enable().map_err(|e| e.to_string())
    } else {
        autostart_manager.disable().map_err(|e| e.to_string())
    }
}

#[tauri::command]
async fn toggle_window_visibility(window: WebviewWindow) -> Result<(), String> {
    if window.is_visible().map_err(|e| e.to_string())? {
        window.hide().map_err(|e| e.to_string())?;
    } else {
        window.show().map_err(|e| e.to_string())?;
        window.set_focus().map_err(|e| e.to_string())?;
    }
    Ok(())
}

// 同步版本的窗口切换函数，用于托盘事件处理
fn toggle_window_visibility_sync(window: &WebviewWindow) -> Result<(), String> {
    let is_visible = window.is_visible().map_err(|e| e.to_string())?;
    
    if is_visible {
        window.hide().map_err(|e| e.to_string())?;
    } else {
        window.show().map_err(|e| e.to_string())?;
        window.set_focus().map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
async fn start_work_timer(app_handle: AppHandle) -> Result<(), String> {
    // 向前端发送开始工作的事件
    if let Some(window) = app_handle.get_webview_window("main") {
        window.emit("start-work", ()).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
async fn start_break_timer(app_handle: AppHandle, break_type: String) -> Result<(), String> {
    // 向前端发送开始休息的事件
    if let Some(window) = app_handle.get_webview_window("main") {
        window.emit("start-break", break_type).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
async fn show_settings() -> Result<(), String> {
    // 可以在这里添加设置界面的逻辑
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            Some(vec!["--minimized"]),
        ))
        .setup(|app| {
            #[cfg(desktop)]
            {
                // 桌面端功能初始化
                let _ = app.handle().plugin(tauri_plugin_updater::Builder::new().build());
                
                // 创建系统托盘菜单
                let toggle_item = MenuItemBuilder::with_id("toggle", "显示/隐藏窗口").build(app)?;
                let start_work_item = MenuItemBuilder::with_id("start_work", "开始工作").build(app)?;
                let start_break_item = MenuItemBuilder::with_id("start_break", "开始小憩").build(app)?;
                let start_rest_item = MenuItemBuilder::with_id("start_rest", "开始休息").build(app)?;
                let settings_item = MenuItemBuilder::with_id("settings", "设置").build(app)?;
                let quit_item = MenuItemBuilder::with_id("quit", "退出").build(app)?;
                
                let menu = MenuBuilder::new(app)
                    .items(&[
                        &toggle_item,
                        &start_work_item,
                        &start_break_item,
                        &start_rest_item,
                        &settings_item,
                        &quit_item
                    ])
                    .build()?;
                
                // 创建系统托盘
                let _tray = TrayIconBuilder::new()
                    .icon(app.default_window_icon().unwrap().clone())
                    .menu(&menu)
                    .show_menu_on_left_click(false)
                    .title("Blink 专注提醒助手")
                    .on_menu_event(move |app, event| {
                        match event.id().as_ref() {
                            "toggle" => {
                                if let Some(window) = app.get_webview_window("main") {
                                    let _ = toggle_window_visibility_sync(&window);
                                }
                            }
                            "start_work" => {
                                if let Some(window) = app.get_webview_window("main") {
                                    // 确保窗口可见
                                    if !window.is_visible().unwrap_or(false) {
                                        let _ = window.show();
                                        let _ = window.set_focus();
                                    }
                                    let _ = window.emit("tray-start-work", ());
                                }
                            }
                            "start_break" => {
                                if let Some(window) = app.get_webview_window("main") {
                                    // 确保窗口可见
                                    if !window.is_visible().unwrap_or(false) {
                                        let _ = window.show();
                                        let _ = window.set_focus();
                                    }
                                    let _ = window.emit("tray-start-break", "short");
                                }
                            }
                            "start_rest" => {
                                if let Some(window) = app.get_webview_window("main") {
                                    // 确保窗口可见
                                    if !window.is_visible().unwrap_or(false) {
                                        let _ = window.show();
                                        let _ = window.set_focus();
                                    }
                                    let _ = window.emit("tray-start-break", "long");
                                }
                            }
                            "settings" => {
                                if let Some(window) = app.get_webview_window("main") {
                                    // 确保窗口可见
                                    if !window.is_visible().unwrap_or(false) {
                                        let _ = window.show();
                                        let _ = window.set_focus();
                                    }
                                    // 发送切换到设置页面的事件
                                    let _ = window.emit("show-settings", ());
                                }
                            }
                            "quit" => {
                                app.exit(0);
                            }
                            _ => {}
                        }
                    })
                    .on_tray_icon_event(|tray, event| {
                        match event {
                            TrayIconEvent::Click {
                                button,
                                button_state,
                                ..
                            } => {
                                if matches!(button, MouseButton::Left) && matches!(button_state, MouseButtonState::Up) {
                                    let app = tray.app_handle();
                                    if let Some(window) = app.get_webview_window("main") {
                                        let _ = toggle_window_visibility_sync(&window);
                                    }
                                }
                            }
                            TrayIconEvent::DoubleClick {
                                button,
                                ..
                            } => {
                                if matches!(button, MouseButton::Left) {
                                    let app = tray.app_handle();
                                    if let Some(window) = app.get_webview_window("main") {
                                        let _ = toggle_window_visibility_sync(&window);
                                        let _ = window.emit("tray-start-work", ());
                                    }
                                }
                            }
                            _ => {
                                // 静默处理其他事件（鼠标进入、离开、移动等）
                            }
                        }
                    })
                    .build(app)?;
            }
            Ok(())
        })
        .on_window_event(|window, event| {
            match event {
                tauri::WindowEvent::CloseRequested { api, .. } => {
                    // 阻止窗口关闭，改为隐藏到托盘
                    window.hide().unwrap();
                    api.prevent_close();
                }
                _ => {}
            }
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            enter_fullscreen_break,
            exit_fullscreen_break,
            get_autostart_enabled,
            set_autostart_enabled,
            toggle_window_visibility,
            start_work_timer,
            start_break_timer,
            show_settings
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
