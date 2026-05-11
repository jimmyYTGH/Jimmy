"""📋 桌面计划清单 - 轻量版"""
import webview, json, os

CFG = os.path.join(os.path.dirname(__file__), '.widget_config.json')

class PlanAPI:
    def __init__(self):
        self.cfg = self._load()

    def _load(self):
        try:
            with open(CFG) as f: return json.load(f)
        except: return {'pinned': False}

    def _save(self):
        with open(CFG, 'w') as f: json.dump(self.cfg, f, indent=2)

    def get_pin_state(self):
        return {'pinned': self.cfg.get('pinned', False)}

    def toggle_pin(self):
        self.cfg['pinned'] = not self.cfg.get('pinned', False)
        self._save()
        return {'pinned': self.cfg['pinned']}

    def minimize_window(self):
        try: webview.windows[0].minimize()
        except: pass

    def quit_app(self):
        os._exit(0)

if __name__ == '__main__':
    api = PlanAPI()
    webview.create_window(
        '每日计划', 'plan_widget.html',
        js_api=api, width=320, height=520,
        resizable=False, frameless=True,
        on_top=api.cfg.get('pinned', False),
    )
    webview.start(private_mode=False)
