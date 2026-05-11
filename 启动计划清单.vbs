' 启动桌面计划清单
Dim shell
Set shell = CreateObject("WScript.Shell")
shell.Run "pythonw desktop_plan.py", 0, False
Set shell = Nothing
