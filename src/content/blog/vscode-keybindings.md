---
title: 'Dear VS Code, Cmd+H is your cue to hide'
description: 'A piece of advice on making VS Code behave a bit more like it actually was meant to live on your Mac.'
pubDate: 2026-09-20
tags: ['rant', 'ux', 'vscode', 'electron', 'macos']
author: toni
---

If I had to boil down my frustrations with software and user experience to one simple piece of
advice, it would be *"assumptions about the user context or preference do not travel well"*.

Case in point, VS Code on macOS.

VS Code is built with Electron and it originates from the Windows ecosystem, which can be a dangerous
combination if you put any value on user experience. On macOS, this premise is unfortunately reflected
in a glaring disregard towards the conventions of the platform when it comes to keyboard shortcuts.

You read that correctly, Mac users use keyboard shortcuts too.

If an application wants to act like a good citizen on a platform, it absolutelty should not override
system-level keyboard shortcuts, like VS Code does on macOS. Try hiding the app with Cmd + H and see
what happens. Odds are that, depending on the view your in, nothing happens.

If you look for help online to remedy this, it's possible that the expert advice will guide you
towards the macOS System Settings to resolve the conflict by modifying or disabling the shortcuts
native to the platform. That's such an awful example of backwards thinking that I have a hard time
coming up with an analogy for it. I will update this post when I do.

When compared with the majority of Electron apps out there, the one good thing with VS Code is that
it is customizable. In the perfect world I would not have to do this myself, but it is possible for
me to bring up the ``keybindings.json`` (Cmd + Shift + P -> Preferences: Open Keyboard Shortcuts
(JSON)) and essentially nuke the offending bindings originating from Windows.

Here's what my ``keybindings.json`` looks like. Look closely at those first four. That minus is a
mighty weapon.

```json
// Restore Cmd+H to native macOS application hide
{ "key": "cmd+h", "command": "-editor.action.startFindReplaceAction" },

// Restore Cmd+M to native macOS application Minimize 
// (VS Code uses this for Toggle Tab Key Moves Focus)
{ "key": "cmd+m", "command": "-editor.action.toggleTabFocusMode" },

// Restore Cmd+Shift+H to standard macOS behaviors
// (VS Code uses this for Replace in Files)
{ "key": "cmd+shift+h", "command": "-workbench.action.replaceInFiles" },

// Restore Alt/Option keys from behaving like Windows "Alt menus"
// Prevents option-clicks or accidental navigation bar highlights
{ "key": "alt", "command": "-workbench.action.menuBarFocus" },

// Re-bind Replace using native Apple alignment (Opt+Cmd+F)
{
    "key": "alt+cmd+f",
    "command": "editor.action.startFindReplaceAction",
    "when": "editorFocus"
},
{
    "key": "alt+cmd+shift+f",
    "command": "workbench.action.replaceInFiles"
}
```

Now, if there only was a way to make Mac Catalyst apps like **Music** to act like native Mac apps...
