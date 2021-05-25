# [IW4MAdmin](https://github.com/RaidMax/IW4M-Admin) [![GitHub license](https://img.shields.io/github/license/RaidMax/IW4M-Admin)](https://github.com/RaidMax/IW4M-Admin/blob/2.4-pr/LICENSE) [![GitHub stars](https://img.shields.io/github/stars/RaidMax/IW4M-Admin)](https://github.com/RaidMax/IW4M-Admin/stargazers)  
[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/J3J821KUJ)

# IW4ToDiscord plugin for IW4MAdmin
![iwtodiscord](https://i.ibb.co/f9FfXYD/Hnet-com-image-1.jpg) ![iwtodiscord](https://i.ibb.co/0Q6PNxD/Hnet-com-image.jpg)

## Requirement
- You may need IW4MAdmin version `2021.5.15.3` or later.

## Introduction
This plugin is based on the idea of the YADB plugin but with some extra features like:
- Improve the appearance of the embeds (bans and reports).
- Showing Unban event too on discord.
- You can see online admins in report webhook.

## Installation
1. Remove **YADB.dll** plugin from Plugins folder if you have it (take a backup of this plugin first).
2. Copy/past **IW4ToDiscord.js** plugin to __IW4MAdmin/plugins__ directory.
3. restart IW4MAdmin.
4. Create a Webhook for: Game Reports channel, Game Bans channel, and Server Status channel, on your discord.
5. Open `IW4MAdmin/Configuration/ScriptPluginSettings.json`, you'll see something like:
  ```
  "IW4ToDiscord": {
    "Author": "Zwambro",
    "Version": 1.1,
    "ReportWebhook": "PASTREPORTDISCORDWEBHOOKHERE",
    "BansWebhook": "PASTBANSDISCORDWEBHOOKHERE",
    "ServerStatusWebhook": "PASTSERVERSTATUSDISCORDWEBHOOKHERE"
  }
  ```
6. Replace `PASTREPORTDISCORDWEBHOOKHERE` with your Report Channel webhook, and replace `PASTBANSDISCORDWEBHOOKHERE` with Ban Channel webhook, and `PASTSERVERSTATUSDISCORDWEBHOOKHERE` with your Server Status Channel webhook. save the new configs.
7. Have fun.

### Special thanks and acknowledgements
- [DANGER](https://discord.gg/NJx9Khb) clan for testing.
- [Xerxes](https://github.com/xerxes-at) for YADB plugin.
- IW4Madmin developers.
- Miltan aka WatchMiltan.
