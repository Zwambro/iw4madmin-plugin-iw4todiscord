# IW4MAdmin [![GitHub license](https://img.shields.io/github/license/RaidMax/IW4M-Admin)](https://github.com/RaidMax/IW4M-Admin/blob/2.4-pr/LICENSE) [![GitHub stars](https://img.shields.io/github/stars/RaidMax/IW4M-Admin)](https://github.com/RaidMax/IW4M-Admin/stargazers)  
[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/J3J821KUJ)

# IW4ToDiscord plugin for IW4MAdmin
![iwtodiscord](https://i.ibb.co/q9qrBn6/pjimage-2-1.jpg)
## Introduction
This plugin is based on the idea of the YADB plugin but with some extra features like:
- Improve the appearance of the embeds (bans and reports).
- Showing Unban event too on discord.
- You can see online admins in report webhook.

## Installation
1. Remove **YADB.dll** plugin from Plugins folder (take a backup of this plugin first).
2. Copy/past **IW4ToDiscord.js** plugin to __IW4MAdmin/plugins__ directory.
3. Open **IW4ToDiscord.js**, and copy your bans discord webhook in `bans_webhook: "PAST_YOUR_BANS_CHANNEL_WEBHOOK_HERE"` *(replace `"PAST_YOUR_BANS_CHANNEL_WEBHOOK_HERE"` with your bans discord webhook)*.
4. Past your report discord webhook in `reports_webhook: "PAST_YOUR_REPORTS_CHANNEL_WEBHOOK_HERE"` *(replace `"PAST_YOUR_REPORTS_CHANNEL_WEBHOOK_HERE"` with your discord discord webhook)*.
5. Past your servers status discord webhook in `serverstatus_webhook: "PAST_YOUR_SERVERS-STATUS_CHANNEL_WEBHOOK_HERE"` *(replace `"PAST_YOUR_SERVERS-STATUS_CHANNEL_WEBHOOK_HERE"` with your discord discord webhook)*.

### Special thanks and acknowledgements
- DANGER clan for testing.
- [Xerxes](https://github.com/xerxes-at) for YADB plugin.
- IW4Madmin developers.
