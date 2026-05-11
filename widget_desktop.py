"""
📋 桌面计划清单 - 纸质感便签挂件
每个任务独立配色，像不同颜色的便签纸贴在木板上
"""

import tkinter as tk
from tkinter import font as tkfont
import json
import os
import sys
import random
import math
import uuid
import time
from datetime import datetime, date, timedelta


# ============================
#  配置
# ============================
CONFIG_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.widget_config.json')
DATA_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.widget_data.json')

WINDOW_WIDTH = 300
WINDOW_HEIGHT = 300

# 便签配色 — 整体木板/桌面底色
COLORS = {
    'board': '#2C2416',        # 深色木纹底
    'board_light': '#3D3220',  # 浅木纹
    'text': '#3D2B1F',         # 深棕色文字
    'text_secondary': '#8B7355',
    'text_light': '#A09070',
    'accent_red': '#E94560',
    'shadow': 'rgba(0,0,0,0.2)',
    'header_bg': '#FFF9E6',
    'header_text': '#3D2B1F',
    'header_date': '#A09070',
    'input_text': '#3D2B1F',
}

# 任务便签配色 — 每种颜色代表一张不同颜色的便签纸
NOTE_COLORS = [
    {'bg': '#FFF9E6', 'fg': '#3D2B1F', 'done': '#D5C8A0', 'header': '#F5EDD0'},   # 米黄
    {'bg': '#FFE8E8', 'fg': '#5C3030', 'done': '#D4B0B0', 'header': '#F5D0D0'},   # 粉红
    {'bg': '#E8F5E8', 'fg': '#2D5C2D', 'done': '#A8C8A8', 'header': '#D0EDD0'},   # 浅绿
    {'bg': '#E8F0FF', 'fg': '#2D3D6C', 'done': '#A8B8D8', 'header': '#D0E0F5'},   # 浅蓝
    {'bg': '#FFF0E0', 'fg': '#6C3D1F', 'done': '#D0B898', 'header': '#F5E0D0'},   # 浅橙
    {'bg': '#F0E8FF', 'fg': '#3D2D5C', 'done': '#B8A8C8', 'header': '#E0D0F5'},   # 浅紫
    {'bg': '#FFFAE0', 'fg': '#5C4D1F', 'done': '#C8C098', 'header': '#F5F0D0'},   # 浅黄
    {'bg': '#E8FFEE', 'fg': '#1F5C3D', 'done': '#98C8A8', 'header': '#D0F5E0'},   # 薄荷
    {'bg': '#FFECE8', 'fg': '#6C2820', 'done': '#D0ACA8', 'header': '#F5D8D0'},   # 珊瑚
    {'bg': '#E8F8FA', 'fg': '#1F4D5C', 'done': '#98BCC8', 'header': '#D0EEF5'},   # 天蓝
    {'bg': '#FFF5E8', 'fg': '#5C3820', 'done': '#C8B098', 'header': '#F5E5D0'},   # 杏色
    {'bg': '#F5E8F0', 'fg': '#4D2D40', 'done': '#B8A0B0', 'header': '#EDD0E0'},   # 淡紫粉
    {'bg': '#F0FFF0', 'fg': '#2D4D2D', 'done': '#A8C0A8', 'header': '#E0F5E0'},   # 草绿
    {'bg': '#FFF0F0', 'fg': '#5C2D2D', 'done': '#C8A8A8', 'header': '#F5E0E0'},   # 淡粉
    {'bg': '#F0F0FF', 'fg': '#2D2D5C', 'done': '#A8A8C8', 'header': '#E0E0F5'},   # 淡紫蓝
]

# 目前选用的任务颜色（索引）
_task_color_index = {}


# ============================
#  任务数据
# ============================
class Task:
    def __init__(self, text, date_category='today', target_date=None, color_idx=None):
        self.id = str(uuid.uuid4())[:8]
        self.text = text
        self.done = False
        self.date_category = date_category
        self.target_date = target_date
        self.created_at = time.time()
        self.color_idx = color_idx if color_idx is not None else random.randint(0, len(NOTE_COLORS)-1)

    def get_colors(self):
        c = NOTE_COLORS[self.color_idx % len(NOTE_COLORS)]
        if self.done:
            return {'bg': c['done'], 'fg': c['fg'], 'header': c['done']}
        return c


class TaskManager:
    def __init__(self):
        self.tasks = []
        self.load()

    def add(self, text, date_category='today', target_date=None):
        # 取一个和已有任务不同的颜色
        used_colors = {t.color_idx for t in self.tasks}
        available = [i for i in range(len(NOTE_COLORS)) if i not in used_colors]
        color_idx = random.choice(available) if available else random.randint(0, len(NOTE_COLORS)-1)

        task = Task(text, date_category, target_date, color_idx)
        self.tasks.insert(0, task)
        self.save()
        return task

    def toggle(self, task_id):
        for t in self.tasks:
            if t.id == task_id:
                t.done = not t.done
                self.save()
                return True
        return False

    def delete(self, task_id):
        self.tasks = [t for t in self.tasks if t.id != task_id]
        self.save()

    def clear_completed(self):
        self.tasks = [t for t in self.tasks if not t.done]
        self.save()

    def get_stats(self):
        pending = sum(1 for t in self.tasks if not t.done)
        done = sum(1 for t in self.tasks if t.done)
        return pending, done

    def get_grouped(self):
        groups = {'today': [], 'tomorrow': [], 'future': []}
        for t in self.tasks:
            if t.date_category in groups:
                groups[t.date_category].append(t)
            else:
                groups['future'].append(t)
        for key in groups:
            groups[key].sort(key=lambda x: (x.done, x.created_at))
        return groups

    def save(self):
        try:
            data = []
            for t in self.tasks:
                data.append({
                    'id': t.id, 'text': t.text, 'done': t.done,
                    'date_category': t.date_category,
                    'target_date': t.target_date,
                    'created_at': t.created_at,
                    'color_idx': t.color_idx,
                })
            with open(DATA_FILE, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            print(f'Save: {e}')

    def load(self):
        try:
            if os.path.exists(DATA_FILE):
                with open(DATA_FILE, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                for item in data:
                    t = Task(
                        item['text'],
                        item.get('date_category', 'today'),
                        item.get('target_date'),
                        item.get('color_idx', random.randint(0, len(NOTE_COLORS)-1))
                    )
                    t.id = item['id']
                    t.done = item['done']
                    t.created_at = item.get('created_at', time.time())
                    self.tasks.append(t)
        except Exception as e:
            print(f'Load: {e}')


class Config:
    def __init__(self):
        self.pinned = False
        self.pos_x = None
        self.pos_y = None
        self.load()

    def load(self):
        try:
            if os.path.exists(CONFIG_FILE):
                with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
                    cfg = json.load(f)
                    self.pinned = cfg.get('pinned', False)
                    self.pos_x = cfg.get('pos_x')
                    self.pos_y = cfg.get('pos_y')
        except Exception:
            pass

    def save(self):
        try:
            with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
                json.dump({
                    'pinned': self.pinned,
                    'pos_x': self.pos_x,
                    'pos_y': self.pos_y,
                    'updated': datetime.now().isoformat(),
                }, f, ensure_ascii=False, indent=2)
        except Exception:
            pass


# ============================
#  自定义组件 — 纸质感便签卡片
# ============================
class NoteCard(tk.Frame):
    """一张便签纸卡片"""

    def __init__(self, parent, task, on_toggle, on_delete, **kw):
        colors = task.get_colors()
        super().__init__(
            parent,
            bg=colors['bg'],
            highlightthickness=0,
            **kw
        )
        self.task = task
        self.colors = colors
        self.on_toggle = on_toggle
        self.on_delete = on_delete
        self._deleting = False
        self._hover = False

        self._build()
        self._bind_events()

    def _build(self):
        c = self.colors
        is_future = self.task.date_category != 'today'
        pad = 4

        # 便签头部色条 (像便签纸顶部的颜色条)
        header = tk.Frame(self, bg=c.get('header', c['bg']), height=4)
        header.pack(fill='x')
        header.pack_propagate(False)

        # 内容行
        content = tk.Frame(self, bg=c['bg'])
        content.pack(fill='x', padx=2, pady=(1, 2))

        # 复选框
        cb_size = 18
        cb_frame = tk.Frame(content, bg=c['bg'], width=cb_size+4, height=cb_size+4)
        cb_frame.pack(side='left', padx=(6, 4), pady=6)
        cb_frame.pack_propagate(False)

        self.cb_canvas = tk.Canvas(cb_frame, width=cb_size, height=cb_size,
                                    bg=c['bg'], highlightthickness=0)
        self.cb_canvas.pack()
        self._draw_checkbox()

        # 任务文字 — 颜色不变，完成时加删除线
        text_color = c['fg']
        strike = self.task.done

        self.text_label = tk.Label(
            content,
            text=self.task.text,
            font=('Microsoft YaHei', 11, 'overstrike' if strike else 'normal'),
            bg=c['bg'], fg=text_color,
            anchor='w', wraplength=150,
            justify='left'
        )
        self.text_label.pack(side='left', fill='x', expand=True, pady=7)

        # 日期徽章（未来计划）
        if is_future and self.task.target_date:
            badge_text = self.task.target_date[-5:]
            self.badge = tk.Label(
                content,
                text=badge_text,
                font=('Microsoft YaHei', 8),
                bg=c['bg'], fg=COLORS['text_secondary'],
                padx=5, pady=1
            )
            self.badge.pack(side='right', padx=(0, 2), pady=6)

        # 删除按钮
        self.del_btn = tk.Label(
            content, text='✕',
            font=('Microsoft YaHei', 11),
            bg=c['bg'], fg=COLORS['text_light'],
            cursor='hand2', padx=4
        )
        self.del_btn.pack(side='right', pady=6)

    def _draw_checkbox(self):
        c = self.colors
        self.cb_canvas.delete('all')
        size = 18

        if self.task.done:
            # 已完成：绿色实心勾
            self.cb_canvas.create_rectangle(
                1, 1, size-1, size-1,
                outline='#95B895', fill='#C8E6C8',
                width=1
            )
            self.cb_canvas.create_text(
                size//2, size//2, text='✓',
                fill='#5A8A5A',
                font=('Microsoft YaHei', 11, 'bold')
            )
        else:
            # 未完成：虚线或实线框
            is_future = self.task.date_category != 'today'
            if is_future:
                self.cb_canvas.create_rectangle(
                    2, 2, size-2, size-2,
                    outline=COLORS['text_secondary'],
                    width=1, dash=(3, 2)
                )
            else:
                self.cb_canvas.create_rectangle(
                    2, 2, size-2, size-2,
                    outline=COLORS['text_secondary'],
                    width=1
                )

    def _apply_hover(self):
        """应用悬停高亮"""
        bg = self._lighten(self.colors['bg'], 18)
        self.configure(bg=bg)

        def _recursive_apply(w, bg):
            try:
                if hasattr(w, 'configure'):
                    w.configure(bg=bg)
            except:
                pass
            for child in w.winfo_children():
                _recursive_apply(child, bg)

        for child in self.winfo_children():
            _recursive_apply(child, bg)

    def _apply_normal(self):
        """恢复正常颜色"""
        bg = self.colors['bg']
        self.configure(bg=bg)

        def _recursive_apply(w, bg):
            try:
                if hasattr(w, 'configure'):
                    w.configure(bg=bg)
            except:
                pass
            for child in w.winfo_children():
                _recursive_apply(child, bg)

        for child in self.winfo_children():
            _recursive_apply(child, bg)

    def _bind_events(self):
        # 悬停效果 — 绑定到自身及所有子组件
        # 解决 tkinter 中进入子组件会触发父组件 Leave 的问题
        def on_enter(e):
            if self._deleting: return
            self._hover = True
            self._apply_hover()

        def on_leave(e):
            if self._deleting: return
            # 确认鼠标真的离开了整个卡片，而非进入子组件
            try:
                x = e.x_root
                y = e.y_root
                widget_under = self.winfo_containing(x, y)
                if widget_under:
                    # 从 widget_under 向上遍历，看是否还在 self 内
                    parent = widget_under
                    while parent:
                        if parent is self:
                            # 仍在卡片范围内 — 不取消高亮
                            return
                        parent = parent.master
            except:
                pass
            self._hover = False
            self._apply_normal()

        def bind_recursive(w):
            w.bind('<Enter>', on_enter, add='+')
            w.bind('<Leave>', on_leave, add='+')
            for child in w.winfo_children():
                bind_recursive(child)

        bind_recursive(self)

        # 点击勾选
        self.cb_canvas.bind('<Button-1>', lambda e: self.on_toggle(self.task.id))
        self.text_label.bind('<Button-1>', lambda e: self.on_toggle(self.task.id))

        # 删除
        self.del_btn.bind('<Button-1>', lambda e: self._do_delete())

    def _lighten(self, hex_color, amount=20):
        """使颜色变亮"""
        hex_color = hex_color.lstrip('#')
        if len(hex_color) != 6:
            return hex_color
        r = min(255, int(hex_color[0:2], 16) + amount)
        g = min(255, int(hex_color[2:4], 16) + amount)
        b = min(255, int(hex_color[4:6], 16) + amount)
        return f'#{r:02x}{g:02x}{b:02x}'

    def _do_delete(self):
        if self._deleting:
            return
        self._deleting = True
        self._animate_delete()

    def _animate_delete(self):
        steps = 6
        def shrink(step=0):
            if step < steps:
                alpha = 1.0 - (step / steps) * 0.8
                # 使用 pack_forget/pack 模拟消失
                if step == 0:
                    self.configure(bg=self._lighten(self.colors['bg'], 40))
                self.update()
                self.after(50, lambda: shrink(step + 1))
            else:
                self.on_delete(self.task.id)

        shrink()


# ============================
#  桌面挂件主窗口
# ============================
class DesktopWidget:
    def __init__(self):
        self.config = Config()
        self.tasks = TaskManager()
        self._drag_data = {'x': 0, 'y': 0, 'dragging': False}
        self._date_category = 'today'
        self._selected_date = None

        # 创建窗口
        self.root = tk.Tk()
        self.root.title('📋 每日计划')
        self.root.configure(bg=COLORS['board'])
        self.root.overrideredirect(True)
        self.root.attributes('-topmost', self.config.pinned)
        self.root.attributes('-alpha', 0.97)

        # 窗口圆角（通过透明背景实现）
        self.root.wm_attributes('-transparentcolor', '#010101')

        # 位置
        sw = self.root.winfo_screenwidth()
        sh = self.root.winfo_screenheight()
        if self.config.pos_x is not None:
            x, y = self.config.pos_x, self.config.pos_y
        else:
            x = sw - WINDOW_WIDTH - 50
            y = max(30, sh // 2 - WINDOW_HEIGHT // 2 - 40)
        self.root.geometry(f'{WINDOW_WIDTH}x{WINDOW_HEIGHT}+{x}+{y}')

        self._build_ui()
        self._refresh_tasks()
        self._clock()

        # 输入框自动获取焦点
        self.root.after(200, lambda: self._input_entry.focus_force())

    # ============================
    #  UI — 木板背景
    # ============================
    def _build_ui(self):
        # 主容器 — 模拟木板纹理
        self.main = tk.Frame(self.root, bg=COLORS['board'])
        self.main.pack(fill='both', expand=True)

        # 阴影效果（内阴影边框）
        shadow_frame = tk.Frame(self.main, bg=COLORS['board_light'], padx=2, pady=2)
        shadow_frame.pack(fill='both', expand=True, padx=4, pady=4)

        # 内层 — 便签本主体
        self.notebook = tk.Frame(shadow_frame, bg='#FFF9E6')
        self.notebook.pack(fill='both', expand=True)

        # ---- 标题栏 ----
        self._build_header()

        # ---- 任务列表 ----
        self._build_task_list()

        # ---- 输入区 ----
        self._build_input()

        # ---- 状态栏 ----
        self._build_statusbar()

    def _build_header(self):
        """标题栏 — 像便签本顶部的装订区域"""
        header = tk.Frame(self.notebook, bg='#FFF9E6')
        header.pack(fill='x', padx=0, pady=(0, 0))

        # 装订孔装饰
        binding = tk.Frame(header, bg='#FFF9E6', height=18)
        binding.pack(fill='x')
        for i in range(5):
            dot = tk.Canvas(binding, width=8, height=8, bg='#FFF9E6', highlightthickness=0)
            dot.pack(side='left', expand=True, pady=4)
            dot.create_oval(0, 0, 8, 8, fill='#D8CCB0', outline='')

        # 标题行
        title_row = tk.Frame(header, bg='#FFF9E6')
        title_row.pack(fill='x', padx=18, pady=(2, 4))

        title_group = tk.Frame(title_row, bg='#FFF9E6')
        title_group.pack(side='left')

        tk.Label(
            title_group, text='📋 每日计划',
            font=('Microsoft YaHei', 15, 'bold'),
            bg='#FFF9E6', fg=COLORS['header_text']
        ).pack(anchor='w')

        self._date_label = tk.Label(
            title_group, text='',
            font=('Microsoft YaHei', 9),
            bg='#FFF9E6', fg=COLORS['header_date']
        )
        self._date_label.pack(anchor='w')

        # 按钮
        btn_frame = tk.Frame(title_row, bg='#FFF9E6')
        btn_frame.pack(side='right')

        self._pin_btn = tk.Label(
            btn_frame, text='📌',
            font=('Microsoft YaHei', 12),
            bg='#FFF9E6', fg=COLORS['text_secondary'],
            cursor='hand2', padx=3
        )
        self._pin_btn.pack(side='left')
        self._pin_btn.bind('<Button-1>', lambda e: self._toggle_pin())
        self._update_pin_btn()

        close_btn = tk.Label(
            btn_frame, text='✕',
            font=('Microsoft YaHei', 12),
            bg='#FFF9E6', fg=COLORS['text_secondary'],
            cursor='hand2', padx=3
        )
        close_btn.pack(side='left')
        close_btn.bind('<Button-1>', lambda e: self._quit())

        # 拖拽绑定
        for w in (header, binding, title_row, title_group):
            w.bind('<Button-1>', self._drag_start)
            w.bind('<B1-Motion>', self._drag_move)

    def _build_task_list(self):
        """可滚动的任务列表"""
        list_container = tk.Frame(self.notebook, bg='#FFF9E6')
        list_container.pack(fill='both', expand=True, padx=8)

        # 列表顶部装饰线
        tk.Frame(list_container, bg='#EDE0C8', height=1).pack(fill='x', padx=10)

        # 滚动区域
        canvas_frame = tk.Frame(list_container, bg='#FFF9E6')
        canvas_frame.pack(fill='both', expand=True, pady=(2, 0))

        self._canvas = tk.Canvas(
            canvas_frame, bg='#FFF9E6',
            highlightthickness=0, bd=0
        )
        self._scrollbar = tk.Scrollbar(
            canvas_frame, orient='vertical',
            command=self._canvas.yview
        )
        self._scrollable = tk.Frame(self._canvas, bg='#FFF9E6')

        self._scrollable.bind(
            '<Configure>',
            lambda e: self._canvas.configure(scrollregion=self._canvas.bbox('all'))
        )

        self._canvas_win = self._canvas.create_window(
            (0, 0), window=self._scrollable, anchor='nw',
            width=self._canvas.winfo_width()
        )
        self._canvas.configure(yscrollcommand=self._scrollbar.set)

        self._canvas.pack(side='left', fill='both', expand=True)
        self._scrollbar.pack(side='right', fill='y')

        # Canvas 自适应宽度
        def _cfg_canvas(event):
            self._canvas.itemconfig(self._canvas_win, width=event.width - 4)
        self._canvas.bind('<Configure>', _cfg_canvas)

        # 滚轮（只绑定到画布，不干扰输入框）
        def _on_wheel(event):
            self._canvas.yview_scroll(int(-1 * (event.delta / 120)), 'units')
        self._canvas.bind('<MouseWheel>', _on_wheel)

    def _build_input(self):
        """输入区域"""
        input_container = tk.Frame(self.notebook, bg='#FFF9E6')
        input_container.pack(fill='x', padx=14, pady=(4, 2))

        # 输入框容器
        entry_bg = tk.Frame(input_container, bg='#F5EDD8', highlightthickness=1,
                           highlightcolor='#D8CCB0', highlightbackground='#D8CCB0')
        entry_bg.pack(fill='x', ipady=2)

        self._input_entry = tk.Entry(
            entry_bg,
            font=('Microsoft YaHei', 11),
            bg='#F5EDD8', fg=COLORS['input_text'],
            bd=0, relief='flat',
            insertbackground=COLORS['text'],
            cursor='xterm',
        )
        self._input_entry.pack(side='left', fill='x', expand=True, ipady=4, ipadx=8)
        self._input_entry.bind('<Return>', lambda e: self._add_task())

        # 点击输入框背景区域也聚焦
        entry_bg.bind('<Button-1>', lambda e: self._input_entry.focus())
        input_container.bind('<Button-1>', lambda e: self._input_entry.focus())

        # 日期按钮
        self._date_btn = tk.Label(
            entry_bg, text='📅',
            font=('Microsoft YaHei', 12),
            bg='#F5EDD8', fg=COLORS['text_secondary'],
            cursor='hand2', padx=6
        )
        self._date_btn.pack(side='left')
        self._date_btn.bind('<Button-1>', lambda e: self._cycle_date())
        self._update_date_btn()

        # 添加按钮
        add_btn = tk.Label(
            entry_bg, text='＋',
            font=('Microsoft YaHei', 14),
            bg='#8B7355', fg='#FFF9E6',
            cursor='hand2', padx=10
        )
        add_btn.pack(side='left')
        add_btn.bind('<Button-1>', lambda e: self._add_task())

    def _build_statusbar(self):
        """底部状态"""
        status = tk.Frame(self.notebook, bg='#FFF9E6')
        status.pack(fill='x', padx=16, pady=(2, 10))

        self._status_label = tk.Label(
            status, text='',
            font=('Microsoft YaHei', 9),
            bg='#FFF9E6', fg=COLORS['text_secondary']
        )
        self._status_label.pack(side='left')

        self._clear_btn = tk.Label(
            status, text='清除已完成 ▾',
            font=('Microsoft YaHei', 9),
            bg='#FFF9E6', fg=COLORS['text_secondary'],
            cursor='hand2'
        )
        self._clear_btn.pack(side='right')
        self._clear_btn.bind('<Button-1>', lambda e: self._clear_completed())

    # ============================
    #  渲染任务
    # ============================
    def _refresh_tasks(self):
        """刷新任务列表"""
        for w in self._scrollable.winfo_children():
            w.destroy()

        groups = self.tasks.get_grouped()
        has_any = False

        group_labels = [
            ('today', '📌 今天'),
            ('tomorrow', '🔮 明天'),
            ('future', '📅 未来计划'),
        ]

        for key, label in group_labels:
            tasks = groups.get(key, [])
            if not tasks:
                continue
            has_any = True

            # 分组标题
            grp = tk.Frame(self._scrollable, bg='#FFF9E6')
            grp.pack(fill='x', pady=(6, 2))

            tk.Label(
                grp, text=label,
                font=('Microsoft YaHei', 9, 'bold'),
                bg='#FFF9E6', fg=COLORS['text_secondary']
            ).pack(side='left', padx=10)

            # 分割线
            line = tk.Frame(grp, bg='#EDE0C8', height=1)
            line.pack(side='right', fill='x', expand=True, padx=(6, 10), pady=5)

            # 任务便签
            for task in tasks:
                card = NoteCard(
                    self._scrollable, task,
                    on_toggle=lambda tid: self._toggle_task(tid),
                    on_delete=lambda tid: self._delete_task(tid)
                )
                card.pack(fill='x', padx=8, pady=3)

        if not has_any:
            empty = tk.Frame(self._scrollable, bg='#FFF9E6')
            empty.pack(fill='both', expand=True, pady=50)
            tk.Label(
                empty, text='📝',
                font=('Microsoft YaHei', 36),
                bg='#FFF9E6', fg=COLORS['text_light']
            ).pack()
            tk.Label(
                empty, text='写一个任务吧',
                font=('Microsoft YaHei', 11),
                bg='#FFF9E6', fg=COLORS['text_light']
            ).pack(pady=(6, 0))

        pending, done = self.tasks.get_stats()
        self._status_label.config(text=f'待办 {pending}   ✓ {done}')

    # ============================
    #  操作
    # ============================
    def _add_task(self):
        text = self._input_entry.get().strip()
        if not text:
            return

        cat = self._date_category
        target = None
        if cat == 'future':
            target = self._selected_date or str(date.today() + timedelta(days=1))
        elif cat == 'tomorrow':
            target = str(date.today() + timedelta(days=1))

        if target == str(date.today()):
            cat = 'today'
            target = None

        self.tasks.add(text, cat, target)
        self._input_entry.delete(0, 'end')
        self._date_category = 'today'
        self._update_date_btn()
        self._refresh_tasks()
        self._scroll_to_top()

    def _scroll_to_top(self):
        self._canvas.yview_moveto(0)

    def _toggle_task(self, task_id):
        self.tasks.toggle(task_id)
        self._refresh_tasks()

    def _delete_task(self, task_id):
        self.tasks.delete(task_id)
        self._refresh_tasks()

    def _clear_completed(self):
        self.tasks.clear_completed()
        self._refresh_tasks()

    # ============================
    #  日期
    # ============================
    def _cycle_date(self):
        cats = ['today', 'tomorrow', 'future']
        idx = cats.index(self._date_category) if self._date_category in cats else 0
        self._date_category = cats[(idx + 1) % len(cats)]
        if self._date_category == 'future' and not self._selected_date:
            self._selected_date = str(date.today() + timedelta(days=1))
        self._update_date_btn()

        # 提示
        labels = {'today': '今天', 'tomorrow': '明天', 'future': '指定日期'}
        self._flash_input(labels.get(self._date_category, ''))

    def _flash_input(self, msg):
        """输入框闪烁提示"""
        original_bg = self._input_entry['bg']
        self._input_entry.delete(0, 'end')
        self._input_entry.insert(0, f'📌 添加到: {msg}')
        self._input_entry.configure(fg=COLORS['text_secondary'])
        self._input_entry.after(800, self._clear_flash)

    def _clear_flash(self):
        self._input_entry.delete(0, 'end')
        self._input_entry.configure(fg=COLORS['input_text'])

    def _update_date_btn(self):
        icons = {'today': '📅', 'tomorrow': '🔮', 'future': '📅'}
        self._date_btn.config(text=icons.get(self._date_category, '📅'))
        if self._date_category == 'today':
            self._date_btn.config(fg=COLORS['text_secondary'])
        else:
            self._date_btn.config(fg='#45B7D1')

    # ============================
    #  窗口
    # ============================
    def _toggle_pin(self):
        self.config.pinned = not self.config.pinned
        self.root.attributes('-topmost', self.config.pinned)
        self.config.save()
        self._update_pin_btn()

    def _update_pin_btn(self):
        self._pin_btn.config(
            fg=COLORS['accent_red'] if self.config.pinned else COLORS['text_secondary']
        )

    def _quit(self):
        self.config.save()
        self.root.destroy()
        sys.exit(0)

    def _drag_start(self, event):
        self._drag_data['x'] = event.x_root
        self._drag_data['y'] = event.y_root

    def _drag_move(self, event):
        dx = event.x_root - self._drag_data['x']
        dy = event.y_root - self._drag_data['y']
        x = self.root.winfo_x() + dx
        y = self.root.winfo_y() + dy
        self.root.geometry(f'+{x}+{y}')
        self._drag_data['x'] = event.x_root
        self._drag_data['y'] = event.y_root
        # 保存
        self.config.pos_x = x
        self.config.pos_y = y

    # ============================
    #  时钟
    # ============================
    def _clock(self):
        now = datetime.now()
        # datetime.weekday(): 0=周一, 6=周日
        weekdays = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
        self._date_label.config(
            text=f'{now.month}月{now.day}日 {weekdays[now.weekday()]}'
        )
        self.root.after(60000, self._clock)

    # ============================
    #  启动
    # ============================
    def run(self):
        try:
            self.root.mainloop()
        except KeyboardInterrupt:
            self.config.save()
            sys.exit(0)


if __name__ == '__main__':
    app = DesktopWidget()
    app.run()
