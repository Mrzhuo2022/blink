// 防止控制台窗口在 Windows Release 版本中额外出现
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    blink::run()
}
