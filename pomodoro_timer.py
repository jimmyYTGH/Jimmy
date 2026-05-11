"""
桌面番茄钟 - Pomodoro Timer
一个功能完整的桌面番茄钟应用，使用 Python tkinter 构建
"""

import tkinter as tk
from tkinter import ttk, messagebox
import time
import threading
import json
import os
from datetime import datetime
import platform

# 尝试导入通知库
try:
    from plyer import notification
    HAS_NOTIFICATION = True
except ImportError:
    HAS_NOTIFICATION = False

# 尝试导入音频库
try:
    import winsound
    HAS_WINSOUND = True
except ImportError:
    HAS_WINSOUND = False


class PomodoroTimer:
    """番茄钟主应用类"""

    # 颜色主题
    COLORS = {
        "bg": "#2B2B2B",
        "fg": "#FFFFFF",
        "accent": "#FF6B6B",
        "accent2": "#4ECDC4",
        "accent3": "#FFE66D",
        "work": "#FF6B6B",
        "short_break": "#4ECDC4",
        "long_break": "#45B7D1",
        "card_bg": "#363636",
        "button_bg": "#404040",
        "button_hover": "#505050",
        "text_secondary": "#AAAAAA",
        "progress_bg": "#404040",
    }

    # 默认设置
    DEFAULTS = {
        "work_minutes": 25,
        "short_break_minutes": 5,
        "long_break_minutes": 15,
        "long_break_interval": 4,  # 每几个番茄钟后长休息
        "daily_goal": 12,          # 每日目标番茄数
        "auto_start_break": False,
        "auto_start_work": False,
        "sound_enabled": True,
        "notification_enabled": True,
    }

    def __init__(self, root):
        self.root = root
        self.root.title("🍅 桌面番茄钟")
        self.root.geometry("380x520")
        self.root.configure(bg=self.COLORS["bg"])
        self.root.resizable(False, False)

        # 设置窗口图标（如果可用）
        try:
            self.root.iconbitmap(default="")
        except Exception:
            pass

        # 加载设置
        self.settings_file = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "pomodoro_settings.json"
        )
        self.settings = self.load_settings()

        # 番茄钟状态
        self.current_mode = "work"  # work, short_break, long_break
        self.is_running = False
        self.is_paused = False
        self.remaining_seconds = self.settings["work_minutes"] * 60
        self.completed_pomodoros = 0
        self.completed_today = self.load_today_count()
        self.current_cycle = 0
        self.timer_thread = None

        # 构建 UI
        self.setup_ui()

        # 窗口关闭事件
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)

        # 更新显示
        self.update_display()

    # ========== 设置管理 ==========

    def load_settings(self):
        """加载设置"""
        try:
            if os.path.exists(self.settings_file):
                with open(self.settings_file, "r", encoding="utf-8") as f:
                    settings = json.load(f)
                    for key in self.DEFAULTS:
                        if key not in settings:
                            settings[key] = self.DEFAULTS[key]
                    return settings
        except Exception:
            pass
        return dict(self.DEFAULTS)

    def save_settings(self):
        """保存设置"""
        try:
            with open(self.settings_file, "w", encoding="utf-8") as f:
                json.dump(self.settings, f, ensure_ascii=False, indent=2)
        except Exception:
            pass

    def load_today_count(self):
        """加载今日完成数"""
        count_file = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "pomodoro_count.json"
        )
        try:
            if os.path.exists(count_file):
                with open(count_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    today = datetime.now().strftime("%Y-%m-%d")
                    if data.get("date") == today:
                        return data.get("count", 0)
        except Exception:
            pass
        return 0

    def save_today_count(self):
        """保存今日完成数"""
        count_file = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "pomodoro_count.json"
        )
        try:
            data = {
                "date": datetime.now().strftime("%Y-%m-%d"),
                "count": self.completed_today,
            }
            with open(count_file, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        except Exception:
            pass

    # ========== UI 构建 ==========

    def setup_ui(self):
        """构建用户界面"""
        self.root.columnconfigure(0, weight=1)

        # 标题栏
        title_frame = tk.Frame(self.root, bg=self.COLORS["bg"])
        title_frame.pack(fill="x", pady=(15, 5))
        title_label = tk.Label(
            title_frame,
            text="🍅 番茄钟",
            font=("Microsoft YaHei", 16, "bold"),
            bg=self.COLORS["bg"],
            fg=self.COLORS["fg"],
        )
        title_label.pack()

        # 今日进度
        self.goal_frame = tk.Frame(self.root, bg=self.COLORS["bg"])
        self.goal_frame.pack(fill="x", padx=30, pady=(0, 5))
        self.goal_label = tk.Label(
            self.goal_frame,
            text="",
            font=("Microsoft YaHei", 9),
            bg=self.COLORS["bg"],
            fg=self.COLORS["text_secondary"],
        )
        self.goal_label.pack()

        # 模式切换标签
        self.mode_frame = tk.Frame(self.root, bg=self.COLORS["bg"])
        self.mode_frame.pack(fill="x", padx=20, pady=(5, 0))

        self.mode_labels = {}
        modes = [
            ("work", "专注", self.COLORS["work"]),
            ("short_break", "短休", self.COLORS["short_break"]),
            ("long_break", "长休", self.COLORS["long_break"]),
        ]
        for mode_key, mode_text, color in modes:
            lbl = tk.Label(
                self.mode_frame,
                text=mode_text,
                font=("Microsoft YaHei", 11),
                bg=self.COLORS["bg"],
                fg=self.COLORS["text_secondary"],
                padx=15,
                cursor="hand2",
            )
            lbl.pack(side="left", expand=True)
            lbl.bind("<Button-1>", lambda e, m=mode_key: self.switch_mode(m))
            self.mode_labels[mode_key] = lbl
        self.update_mode_labels()

        # 计时器显示
        self.timer_frame = tk.Frame(self.root, bg=self.COLORS["bg"])
        self.timer_frame.pack(expand=True, fill="both", padx=30)

        # 圆形进度（模拟）
        self.canvas = tk.Canvas(
            self.timer_frame,
            width=220,
            height=220,
            bg=self.COLORS["bg"],
            highlightthickness=0,
        )
        self.canvas.pack(expand=True)

        # 绘制进度环背景
        self.canvas.create_oval(10, 10, 210, 210, outline=self.COLORS["progress_bg"], width=8)
        # 进度圆弧（动态更新）
        self.progress_arc = self.canvas.create_arc(
            10, 10, 210, 210,
            start=90, extent=0,
            outline=self.COLORS["work"],
            width=8,
            style="arc",
        )

        # 时间文本
        self.time_text = self.canvas.create_text(
            110, 95,
            text="25:00",
            font=("Microsoft YaHei", 42, "bold"),
            fill=self.COLORS["fg"],
        )
        # 模式文本
        self.mode_text = self.canvas.create_text(
            110, 135,
            text="点击开始",
            font=("Microsoft YaHei", 11),
            fill=self.COLORS["text_secondary"],
        )
        # 番茄计数
        self.pomodoro_text = self.canvas.create_text(
            110, 158,
            text="",
            font=("Microsoft YaHei", 9),
            fill=self.COLORS["text_secondary"],
        )

        # 控制按钮
        self.btn_frame = tk.Frame(self.root, bg=self.COLORS["bg"])
        self.btn_frame.pack(fill="x", padx=30, pady=(10, 5))

        btn_width = 10
        self.start_btn = tk.Button(
            self.btn_frame,
            text="▶ 开始",
            font=("Microsoft YaHei", 11, "bold"),
            bg=self.COLORS["accent"],
            fg="white",
            bd=0,
            padx=20,
            pady=8,
            cursor="hand2",
            activebackground="#E05555",
            activeforeground="white",
            command=self.toggle_timer,
        )
        self.start_btn.pack(side="left", expand=True, padx=5)

        self.reset_btn = tk.Button(
            self.btn_frame,
            text="↺ 重置",
            font=("Microsoft YaHei", 11),
            bg=self.COLORS["button_bg"],
            fg=self.COLORS["fg"],
            bd=0,
            padx=20,
            pady=8,
            cursor="hand2",
            activebackground=self.COLORS["button_hover"],
            activeforeground="white",
            command=self.reset_timer,
        )
        self.reset_btn.pack(side="left", expand=True, padx=5)

        self.skip_btn = tk.Button(
            self.btn_frame,
            text="⏭ 跳过",
            font=("Microsoft YaHei", 11),
            bg=self.COLORS["button_bg"],
            fg=self.COLORS["fg"],
            bd=0,
            padx=20,
            pady=8,
            cursor="hand2",
            activebackground=self.COLORS["button_hover"],
            activeforeground="white",
            command=self.skip_phase,
        )
        self.skip_btn.pack(side="left", expand=True, padx=5)

        # 底部状态栏
        self.status_frame = tk.Frame(self.root, bg=self.COLORS["bg"])
        self.status_frame.pack(fill="x", padx=20, pady=(5, 10))

        self.status_label = tk.Label(
            self.status_frame,
            text="今日完成: 0 个番茄  |  第 0 轮",
            font=("Microsoft YaHei", 9),
            bg=self.COLORS["bg"],
            fg=self.COLORS["text_secondary"],
        )
        self.status_label.pack()

        # 设置按钮
        self.settings_btn = tk.Button(
            self.status_frame,
            text="⚙ 设置",
            font=("Microsoft YaHei", 9),
            bg=self.COLORS["bg"],
            fg=self.COLORS["text_secondary"],
            bd=0,
            cursor="hand2",
            activebackground=self.COLORS["bg"],
            activeforeground=self.COLORS["fg"],
            command=self.open_settings,
        )
        self.settings_btn.pack(side="right")

        # 设置窗口
        self.settings_window = None

    def update_mode_labels(self):
        """更新模式标签高亮"""
        for key, lbl in self.mode_labels.items():
            if key == self.current_mode:
                color_map = {
                    "work": self.COLORS["work"],
                    "short_break": self.COLORS["short_break"],
                    "long_break": self.COLORS["long_break"],
                }
                lbl.config(fg=color_map[key])
            else:
                lbl.config(fg=self.COLORS["text_secondary"])

    # ========== 核心逻辑 ==========

    def switch_mode(self, mode):
        """切换模式"""
        if self.is_running:
            return
        self.current_mode = mode
        minutes_map = {
            "work": self.settings["work_minutes"],
            "short_break": self.settings["short_break_minutes"],
            "long_break": self.settings["long_break_minutes"],
        }
        self.remaining_seconds = minutes_map[mode] * 60
        self.is_paused = False
        self.start_btn.config(text="▶ 开始")
        self.update_mode_labels()
        self.update_display()

    def toggle_timer(self):
        """开始/暂停计时"""
        if not self.is_running:
            self.is_running = True
            self.is_paused = False
            self.start_btn.config(text="⏸ 暂停")
            self.timer_thread = threading.Thread(target=self.run_timer, daemon=True)
            self.timer_thread.start()
        elif self.is_paused:
            self.is_paused = False
            self.start_btn.config(text="⏸ 暂停")
        else:
            self.is_paused = True
            self.start_btn.config(text="▶ 继续")

    def run_timer(self):
        """计时器主循环"""
        while self.is_running and self.remaining_seconds > 0:
            if not self.is_paused:
                time.sleep(1)
                self.remaining_seconds -= 1
                self.update_display()
                self.update_progress()
            else:
                time.sleep(0.1)

        if self.is_running and self.remaining_seconds <= 0:
            self.is_running = False
            self.start_btn.config(text="▶ 开始")
            self.root.after(0, self.on_timer_complete)

    def update_display(self):
        """更新显示"""
        minutes = self.remaining_seconds // 60
        seconds = self.remaining_seconds % 60
        time_str = f"{minutes:02d}:{seconds:02d}"

        # UI 线程安全更新
        self.root.after(0, lambda: self.canvas.itemconfig(self.time_text, text=time_str))

        # 更新模式文字
        mode_display = {
            "work": "专注时间",
            "short_break": "短休息",
            "long_break": "长休息",
        }
        mode_str = mode_display.get(self.current_mode, "")
        status = "进行中" if self.is_running and not self.is_paused else (
            "已暂停" if self.is_paused else "点击开始"
        )
        self.root.after(0, lambda: self.canvas.itemconfig(self.mode_text, text=mode_str))

        # 番茄计数
        if self.completed_pomodoros > 0:
            pomo_icons = "🍅" * min(self.completed_pomodoros, 10)
            self.root.after(0, lambda: self.canvas.itemconfig(
                self.pomodoro_text, text=pomo_icons
            ))
        else:
            self.root.after(0, lambda: self.canvas.itemconfig(self.pomodoro_text, text=""))

        # 状态栏
        status_text = f"今日完成: {self.completed_today} 个番茄  |  第 {self.completed_pomodoros + 1} 轮"
        self.root.after(0, lambda: self.status_label.config(text=status_text))

        # 目标进度
        goal = self.settings["daily_goal"]
        self.root.after(0, lambda: self.goal_label.config(
            text=f"今日目标: {min(self.completed_today, goal)}/{goal}  🍅"
        ))

    def update_progress(self):
        """更新进度环"""
        minutes_map = {
            "work": self.settings["work_minutes"],
            "short_break": self.settings["short_break_minutes"],
            "long_break": self.settings["long_break_minutes"],
        }
        total = minutes_map[self.current_mode] * 60
        if total > 0:
            progress = (total - self.remaining_seconds) / total
            extent = -progress * 360
            color_map = {
                "work": self.COLORS["work"],
                "short_break": self.COLORS["short_break"],
                "long_break": self.COLORS["long_break"],
            }
            self.root.after(0, lambda: self.canvas.itemconfig(
                self.progress_arc,
                extent=extent,
                outline=color_map[self.current_mode],
            ))

    def on_timer_complete(self):
        """计时完成时"""
        # 播放提示音
        if self.settings["sound_enabled"] and HAS_WINSOUND:
            try:
                winsound.Beep(800, 300)
                winsound.Beep(1000, 300)
            except Exception:
                pass

        # 发送通知
        if self.settings["notification_enabled"] and HAS_NOTIFICATION:
            try:
                if self.current_mode == "work":
                    notification.notify(
                        title="🍅 番茄钟",
                        message="专注时间结束！休息一下吧！",
                        timeout=5,
                    )
                else:
                    notification.notify(
                        title="🍅 番茄钟",
                        message="休息结束！开始新的专注！",
                        timeout=5,
                    )
            except Exception:
                pass

        if self.current_mode == "work":
            # 完成一个番茄
            self.completed_pomodoros += 1
            self.completed_today += 1
            self.save_today_count()

            # 是否该长休息
            if self.completed_pomodoros % self.settings["long_break_interval"] == 0:
                self.current_mode = "long_break"
            else:
                self.current_mode = "short_break"

            minutes = self.settings[f"{self.current_mode}_minutes"]
            self.remaining_seconds = minutes * 60

            if self.settings["auto_start_break"]:
                self.is_running = True
                self.start_btn.config(text="⏸ 暂停")
                self.timer_thread = threading.Thread(target=self.run_timer, daemon=True)
                self.timer_thread.start()
        else:
            # 休息结束，回到工作
            self.current_mode = "work"
            self.remaining_seconds = self.settings["work_minutes"] * 60

            if self.settings["auto_start_work"]:
                self.is_running = True
                self.start_btn.config(text="⏸ 暂停")
                self.timer_thread = threading.Thread(target=self.run_timer, daemon=True)
                self.timer_thread.start()

        self.update_mode_labels()
        self.update_display()

    def reset_timer(self):
        """重置计时器"""
        self.is_running = False
        self.is_paused = False
        minutes_map = {
            "work": self.settings["work_minutes"],
            "short_break": self.settings["short_break_minutes"],
            "long_break": self.settings["long_break_minutes"],
        }
        self.remaining_seconds = minutes_map[self.current_mode] * 60
        self.start_btn.config(text="▶ 开始")

        # 重置进度环
        self.root.after(0, lambda: self.canvas.itemconfig(
            self.progress_arc, extent=0
        ))

        self.update_display()

    def skip_phase(self):
        """跳过当前阶段"""
        if self.is_running:
            self.is_running = False
            self.start_btn.config(text="▶ 开始")
            self.remaining_seconds = 0
            self.on_timer_complete()

    # ========== 设置界面 ==========

    def open_settings(self):
        """打开设置窗口"""
        if self.settings_window and self.settings_window.winfo_exists():
            self.settings_window.lift()
            return

        self.settings_window = tk.Toplevel(self.root)
        self.settings_window.title("⚙ 设置")
        self.settings_window.geometry("350x420")
        self.settings_window.configure(bg=self.COLORS["bg"])
        self.settings_window.resizable(False, False)
        self.settings_window.transient(self.root)
        self.settings_window.grab_set()

        # 设置变量
        self.setting_vars = {}
        entry_config = {
            "work_minutes": ("专注时间 (分钟)", 1, 60),
            "short_break_minutes": ("短休息 (分钟)", 1, 30),
            "long_break_minutes": ("长休息 (分钟)", 1, 60),
            "long_break_interval": ("长休息间隔 (番茄数)", 1, 10),
            "daily_goal": ("每日目标 (番茄数)", 1, 50),
        }

        row = 0
        for key, (label, min_val, max_val) in entry_config.items():
            tk.Label(
                self.settings_window,
                text=label,
                font=("Microsoft YaHei", 10),
                bg=self.COLORS["bg"],
                fg=self.COLORS["fg"],
                anchor="w",
            ).grid(row=row, column=0, padx=20, pady=(10, 0), sticky="w")

            var = tk.StringVar(value=str(self.settings[key]))
            entry = tk.Entry(
                self.settings_window,
                textvariable=var,
                font=("Microsoft YaHei", 10),
                bg=self.COLORS["card_bg"],
                fg=self.COLORS["fg"],
                bd=0,
                width=8,
                justify="center",
                insertbackground=self.COLORS["fg"],
            )
            entry.grid(row=row, column=1, padx=20, pady=(10, 0), sticky="e")
            self.setting_vars[key] = (var, min_val, max_val)
            row += 1

        # 复选框
        row += 1
        self.auto_break_var = tk.BooleanVar(
            value=self.settings["auto_start_break"]
        )
        tk.Checkbutton(
            self.settings_window,
            text="自动开始休息",
            variable=self.auto_break_var,
            font=("Microsoft YaHei", 10),
            bg=self.COLORS["bg"],
            fg=self.COLORS["fg"],
            selectcolor=self.COLORS["card_bg"],
            activebackground=self.COLORS["bg"],
            activeforeground=self.COLORS["fg"],
        ).grid(row=row, column=0, columnspan=2, padx=20, pady=5, sticky="w")

        row += 1
        self.auto_work_var = tk.BooleanVar(
            value=self.settings["auto_start_work"]
        )
        tk.Checkbutton(
            self.settings_window,
            text="自动开始专注",
            variable=self.auto_work_var,
            font=("Microsoft YaHei", 10),
            bg=self.COLORS["bg"],
            fg=self.COLORS["fg"],
            selectcolor=self.COLORS["card_bg"],
            activebackground=self.COLORS["bg"],
            activeforeground=self.COLORS["fg"],
        ).grid(row=row, column=0, columnspan=2, padx=20, pady=5, sticky="w")

        row += 1
        self.sound_var = tk.BooleanVar(
            value=self.settings["sound_enabled"]
        )
        tk.Checkbutton(
            self.settings_window,
            text="启用提示音",
            variable=self.sound_var,
            font=("Microsoft YaHei", 10),
            bg=self.COLORS["bg"],
            fg=self.COLORS["fg"],
            selectcolor=self.COLORS["card_bg"],
            activebackground=self.COLORS["bg"],
            activeforeground=self.COLORS["fg"],
        ).grid(row=row, column=0, columnspan=2, padx=20, pady=5, sticky="w")

        row += 1
        self.notif_var = tk.BooleanVar(
            value=self.settings["notification_enabled"]
        )
        tk.Checkbutton(
            self.settings_window,
            text="启用桌面通知",
            variable=self.notif_var,
            font=("Microsoft YaHei", 10),
            bg=self.COLORS["bg"],
            fg=self.COLORS["fg"],
            selectcolor=self.COLORS["card_bg"],
            activebackground=self.COLORS["bg"],
            activeforeground=self.COLORS["fg"],
        ).grid(row=row, column=0, columnspan=2, padx=20, pady=5, sticky="w")

        # 保存按钮
        row += 1
        save_btn = tk.Button(
            self.settings_window,
            text="💾 保存设置",
            font=("Microsoft YaHei", 11, "bold"),
            bg=self.COLORS["accent2"],
            fg="white",
            bd=0,
            padx=30,
            pady=8,
            cursor="hand2",
            activebackground="#3DBDB5",
            activeforeground="white",
            command=self.save_settings_from_ui,
        )
        save_btn.grid(row=row, column=0, columnspan=2, pady=20)

    def save_settings_from_ui(self):
        """从设置界面保存"""
        for key, (var, min_val, max_val) in self.setting_vars.items():
            try:
                val = int(var.get())
                val = max(min_val, min(max_val, val))
                self.settings[key] = val
            except ValueError:
                pass

        self.settings["auto_start_break"] = self.auto_break_var.get()
        self.settings["auto_start_work"] = self.auto_work_var.get()
        self.settings["sound_enabled"] = self.sound_var.get()
        self.settings["notification_enabled"] = self.notif_var.get()

        self.save_settings()

        # 重置计时器以应用新设置
        if not self.is_running:
            minutes_map = {
                "work": self.settings["work_minutes"],
                "short_break": self.settings["short_break_minutes"],
                "long_break": self.settings["long_break_minutes"],
            }
            self.remaining_seconds = minutes_map[self.current_mode] * 60
            self.update_display()

        self.settings_window.destroy()
        self.settings_window = None

        messagebox.showinfo("设置", "设置已保存！")

    def on_closing(self):
        """关闭窗口"""
        if self.is_running:
            result = messagebox.askyesno("确认", "计时器正在运行，确定要退出吗？")
            if not result:
                return
        self.is_running = False
        self.save_today_count()
        self.root.destroy()


def main():
    """主函数"""
    root = tk.Tk()
    app = PomodoroTimer(root)
    root.mainloop()


if __name__ == "__main__":
    main()
