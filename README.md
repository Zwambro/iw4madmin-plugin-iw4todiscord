# [IW4MAdmin](https://github.com/RaidMax/IW4M-Admin) [![GitHub license](https://img.shields.io/github/license/RaidMax/IW4M-Admin)](https://github.com/Zwambro/iw4madmin-plugin-iw4todiscord/blob/master/LICENSE) [![GitHub stars](https://img.shields.io/github/stars/RaidMax/IW4M-Admin)](https://github.com/RaidMax/IW4M-Admin/stargazers)  
[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/J3J821KUJ)

# IW4ToDiscord plugin for IW4MAdmin
Bans log
![iwtodiscord](https://i.ibb.co/KwrrySD/imageonline-co-merged-image-5.png)

Reports log
![iwtodiscord](https://i.ibb.co/4F9pQFw/imageonline-co-merged-image-6.png)

Chats log
![iwtodiscord](https://i.ibb.co/QkwTBDj/imageonline-co-merged-image-7.png)

Servers Status log

![iwtodiscord](https://i.ibb.co/GRM2nHL/imageonline-co-merged-image-8.png)

Unban logs

![iwtodiscord](https://i.ibb.co/27S54QZ/Screenshot-from-2021-10-28-21-04-35.png)


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
    "Version": 1.31,
    "ReportWebhook": "your_report_webhook_url",
    "BansWebhook": "your_bans_webhook_url",
    "ServerStatusWebhook": "your_status_webhook_url",
    "ChatlogWebhook": "your_chatlog_webhook_url"
  }
  ```
6. Replace `your_report_webhook_url` with your Report Channel webhook, and replace `your_bans_webhook_url` with Ban Channel webhook, and `your_status_webhook_url` with your Server Status Channel webhook, and replace `your_chatlog_webhook_url` with Chatlog Channel webhook, save the new configs.
7. Have fun.

### Special thanks and acknowledgements
- [DANGER](https://discord.gg/NJx9Khb) clan for testing.
- [Xerxes](https://github.com/xerxes-at) for YADB plugin.
- IW4Madmin developers.
- Miltan aka WatchMiltan.
