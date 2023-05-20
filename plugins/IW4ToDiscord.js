/*
Copyright (c) 2021 Ouchekkir Abdelmouaine

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
const init = (registerNotify, serviceResolver, config, scriptHelper) => {
    registerNotify('IManagementEventSubscriptions.ClientPenaltyAdministered', (clientPenaltyEvent, _) => plugin.onClientPenalty(clientPenaltyEvent));
    registerNotify('IManagementEventSubscriptions.ClientPenaltyRevoked', (clientPenaltyEvent, _) => plugin.onClientPenalty(clientPenaltyEvent));
    registerNotify('IManagementEventSubscriptions.ClientStateAuthorized', (clientAuthorizedEvent, _) => plugin.onClientAuthorized(clientAuthorizedEvent));
    registerNotify('IManagementEventSubscriptions.ClientStateDisposed', (clientDisposedEvent, _) => plugin.onClientDisposed(clientDisposedEvent));
    registerNotify('IGameServerEventSubscriptions.ConnectionInterrupted', (connectionInterruptedEvent, _) => plugin.onServerConnectionInterrupted(connectionInterruptedEvent));
    registerNotify('IGameServerEventSubscriptions.ConnectionRestored', (connectionRestoredEvent, _) => plugin.onServerConnectionRestored(connectionRestoredEvent));
    registerNotify('IGameServerEventSubscriptions.MonitoringStarted', (serverMonitoredEvent, _) => plugin.onServerMonitored(serverMonitoredEvent));
    registerNotify('IGameEventSubscriptions.ClientMessaged', (clientMessagedEvent, _) => plugin.onClientSayEvent(clientMessagedEvent));

    plugin.onLoad(serviceResolver, config, scriptHelper);
    return plugin;
};

const plugin = {
    author: 'Zwambro, Amos, RaidMax',
    version: 2.1,
    name: 'IW4ToDiscord',

    manager: null,
    logger: null,
    configHandler: null,
    scriptHelper: null,
    baseURL: null,
    webhookConfig: {
        reports: null,
        bans: null,
        status: null,
        say: null,
        connections: null
    },

    onLoad: function (serviceResolver, config, scriptHelper) {
        this.baseUrl = serviceResolver.resolveService('ApplicationConfiguration').webfrontUrl;
        this.manager = serviceResolver.resolveService('IManager');
        this.logger = serviceResolver.resolveService('ILogger', ["ScriptPluginV2"]);
        this.scriptHelper = scriptHelper;

        this.configHandler = config;
        this.configHandler.setName(this.name);

        this.webhookConfig = {
            reports: this.configHandler.getValue("ReportWebhook", webhook => plugin.webhookConfig.reports = webhook),
            bans: this.configHandler.getValue("BansWebhook", webhook => plugin.webhookConfig.bans = webhook),
            status: this.configHandler.getValue("ServerStatusWebhook", webhook => plugin.webhookConfig.status = webhook),
            say: this.configHandler.getValue("ChatlogWebhook", webhook => plugin.webhookConfig.say = webhook),
            connections: this.configHandler.getValue("ConnectionsWebhook", webhook => plugin.webhookConfig.connections = webhook)
        };

        if (this.webhookConfig.reports === undefined) {
            this.configHandler.setValue("ReportWebhook", 'your_report_webhook_url');
        }
        if (this.webhookConfig.bans === undefined) {
            this.configHandler.setValue("BansWebhook", 'your_bans_webhook_url');
        }
        if (this.webhookConfig.status === undefined) {
            this.configHandler.setValue("ServerStatusWebhook", "your_status_webhook_url");
        }
        if (this.webhookConfig.say === undefined) {
            this.configHandler.setValue("ChatlogWebhook", "your_chatlog_webhook_url");
        }
        if (this.webhookConfig.connections === undefined) {
            this.configHandler.setValue("ConnectionsWebhook", "your_connection_webhook_url");
        }

        this.logger.logInformation('{Name} {Version} by {Author} loaded.', this.name, this.version, this.author);
    },

    onClientSayEvent: function (clientMessagedEvent) {
        const server = clientMessagedEvent.client.currentServer;
        const gameInfo = this.gameInfo(server);
        const embed = {
            "author": {
                "name": gameInfo.game,
                "icon_url": gameInfo.iconUrl
            },
            "title": clientMessagedEvent.client.cleanedName,
            "description": clientMessagedEvent.message?.stripColors(),
            "timestamp": new Date(),
            "color": 3564200,
            "footer": {
                "text": server.serverName.stripColors()
            }
        };

        this.sendWebHook(embed, "Chatlog");
    },

    onClientAuthorized: function (clientAuthorizedEvent) {
        const server = clientAuthorizedEvent.client.currentServer;
        const gameInfo = this.gameInfo(server);
        const embed = {
            "author": {
                "name": gameInfo.game,
                "icon_url": gameInfo.iconUrl
            },
            "title": clientAuthorizedEvent.client.cleanedName,
            "description": 'Connected',
            "timestamp": new Date(),
            "color": 96820,
            "footer": {
                "text": server.serverName.stripColors()
            }
        };

        this.sendWebHook(embed, "Connection");
    },

    onClientDisposed: function (clientDisposedEvent) {
        const server = clientDisposedEvent.client.currentServer;
        const gameInfo = this.gameInfo(server);
        const embed = {
            "author": {
                "name": gameInfo.game,
                "icon_url": gameInfo.iconUrl
            },
            "title": clientDisposedEvent.client.cleanedName,
            "description": 'Disconnected',
            "timestamp": new Date(),
            "color": 10029348,
            "footer": {
                "text": server.serverName.stripColors()
            }
        };

        this.sendWebHook(embed, "Connection");
    },


    onClientPenalty: function (clientPenaltyEvent) {
        const server = clientPenaltyEvent.client.currentServer;
        const gameInfo = this.gameInfo(server);
        const offense = clientPenaltyEvent.penalty.offense?.stripColors();
        const adminNameAndUrl = this.getNameAndUrl(clientPenaltyEvent.penalty.punisher);
        const clientNameAndUrl = this.getNameAndUrl(clientPenaltyEvent.client);
        let duration = 0;
        if (clientPenaltyEvent.penalty.expires !== undefined) duration = (clientPenaltyEvent.penalty.expires - clientPenaltyEvent.penalty.when).toString();

        if (clientPenaltyEvent.penalty.type === 'Report') this.onReportEvent(server, gameInfo, adminNameAndUrl, clientNameAndUrl, offense);
        if (clientPenaltyEvent.penalty.type === 'Kick') this.onClientKickEvent(server, gameInfo, adminNameAndUrl, clientNameAndUrl, offense);
        if (clientPenaltyEvent.penalty.type === 'TempBan') this.onClientTempBanEvent(server, gameInfo, adminNameAndUrl, clientNameAndUrl, offense, duration);
        if (clientPenaltyEvent.penalty.type === 'Ban') this.onClientBanEvent(server, gameInfo, adminNameAndUrl, clientNameAndUrl, offense);
        if (clientPenaltyEvent.penalty.type === 'Unban') this.onClientUnbanEvent(server, gameInfo, adminNameAndUrl, clientNameAndUrl, offense);
    },

    onClientUnbanEvent: function (server, gameInfo, adminNameAndUrl, clientNameAndUrl, offense) {
        const embed = {
            "author": {
                "name": gameInfo.game,
                "icon_url": gameInfo.iconUrl
            },
            "description": `${adminNameAndUrl} Unbanned ${clientNameAndUrl}`,
            "timestamp": new Date(),
            "color": 15132390,
            "footer": {
                "text": `Reason: ${offense}`
            }
        };

        this.sendWebHook(embed, "Bans");
    },

    onClientBanEvent: function (server, gameInfo, adminNameAndUrl, clientNameAndUrl, offense) {
        const embed = {
            "author": {
                "name": gameInfo.game,
                "icon_url": gameInfo.iconUrl
            },
            "description": `${adminNameAndUrl} Banned ${clientNameAndUrl}`,
            "timestamp": new Date(),
            "color": 15466496,
            "fields": [{
                "name": "Reason",
                "value": offense,
                "inline": false
            }, {
                "name": "Server",
                "value": server.serverName.stripColors(),
                "inline": true
            }, {
                "name": "Duration",
                "value": "Permanent",
                "inline": true
            }]
        };

        this.sendWebHook(embed, "Bans");
    },

    onClientTempBanEvent: function (server, gameInfo, adminNameAndUrl, clientNameAndUrl, offense, duration) {
        const embed = {
            "author": {
                "name": gameInfo.game,
                "icon_url": gameInfo.iconUrl
            },
            "description": `${adminNameAndUrl} Temp Banned ${clientNameAndUrl}`,
            "timestamp": new Date(),
            "color": 15466496,
            "fields": [{
                "name": "Reason",
                "value": offense,
                "inline": false
            }, {
                "name": "Server",
                "value": server.serverName.stripColors(),
                "inline": true
            }, {
                "name": "Duration",
                "value": this.timeFormat(duration),
                "inline": true
            }]
        };

        this.sendWebHook(embed, "Bans");
    },

    onClientKickEvent: function (server, gameInfo, adminNameAndUrl, clientNameAndUrl, offense) {
        const embed = {
            "author": {
                "name": gameInfo.game,
                "icon_url": gameInfo.iconUrl
            },
            "description": `${adminNameAndUrl} Kicked ${clientNameAndUrl}`,
            "timestamp": new Date(),
            "color": 15466496,
            "fields": [{
                "name": "Reason",
                "value": offense,
                "inline": false
            }, {
                "name": "Server",
                "value": server.serverName.stripColors(),
                "inline": true
            }]
        };

        this.sendWebHook(embed, "Bans");
    },

    onReportEvent: function (server, gameInfo, adminNameAndUrl, clientNameAndUrl, offense) {
        let admins = Array.from(server.getClientsAsList()).map(function (player) {
            if (player.level !== "User" && player.level !== "Trusted" && player.level !== "Flagged" && !player.masked) {
                return player.cleanedName;
            }
            return "";
        }).filter((item) => item !== "").join(", ");

        if (!admins) {
            admins = "No admins online";
        }

        const embed = {
            "author": {
                "name": gameInfo.game,
                "icon_url": gameInfo.iconUrl
            },
            "description": `${adminNameAndUrl} Reported ${clientNameAndUrl}`,
            "timestamp": new Date(),
            "color": gameInfo.color,
            "footer": {
                "text": `Online Admins: ${admins}`
            },
            "thumbnail": {
                "url": this.getMapThumb(server)
            },
            "fields": [{
                "name": "Server",
                "value": server.serverName.stripColors(),
                "inline": false
            }, {
                "name": "Reason",
                "value": offense,
                "inline": false
            }]
        };

        this.sendWebHook(embed, "Reports");
    },

    onServerMonitored: function (serverMonitoredEvent) {
        let server = serverMonitoredEvent.server;
        let gameInfo = this.gameInfo(server);
        const embed = {
            "title": "Servers Status",
            "description": `** ${server.serverName.stripColors()} started being monitored **`,
            "timestamp": new Date(),
            "color": 3394699,
            "author": {
                "name": gameInfo.game,
                "icon_url": gameInfo.iconUrl
            },
        };

        this.sendWebHook(embed, "ServerStatus");
    },

    onServerConnectionInterrupted: function (connectionInterruptedEvent) {
        let gameInfo = this.gameInfo(connectionInterruptedEvent.server);
        const embed = {
            "title": "Servers Status",
            "description": `Lost connection to ** ${connectionInterruptedEvent.server.serverName.stripColors()} **`,
            "timestamp": new Date(),
            "color": 15073280,
            "author": {
                "name": gameInfo.game,
                "icon_url": gameInfo.iconUrl
            },
        };

        this.sendWebHook(embed, "ServerStatus");
    },

    onServerConnectionRestored: function (connectionRestoredEvent) {
        let gameInfo = this.gameInfo(connectionRestoredEvent.server);
        const embed = {
            "title": "Servers Status",
            "description": `Restored connection to ** ${connectionRestoredEvent.server.serverName.stripColors()} **`,
            "timestamp": new Date(),
            "color": 3394611,
            "author": {
                "name": gameInfo.game,
                "icon_url": gameInfo.iconUrl
            },
        };

        this.sendWebHook(embed, "ServerStatus");
    },

    sendWebHook: function (embed, webhookType) {
        let params = {
            "embeds": [embed]
        };

        let webhookUrl = "";
        switch (webhookType) {
            case "Bans":
                webhookUrl = this.webhookConfig.bans;
                break;
            case "Reports":
                webhookUrl = this.webhookConfig.reports;
                break;
            case "ServerStatus":
                webhookUrl = this.webhookConfig.status;
                break;
            case "Chatlog":
                webhookUrl = this.webhookConfig.say;
                break;
            case "Connection":
                webhookUrl = this.webhookConfig.connections;
                break;
        }

        const pluginScript = importNamespace('IW4MAdmin.Application.Plugin.Script');
        const request = new pluginScript.ScriptPluginWebRequest(webhookUrl,
            JSON.stringify(params), 'POST', 'application/json', null);

        this.scriptHelper.requestUrl(request, (response) => {
            if (response.isError !== undefined) this.logger.logWarning('There was a problem sending this webhook: {@Error}', response);
        });
    },

    getNameAndUrl: function (client) {
        let adminName;
        if (client.cleanedName === "IW4MAdmin") {
            adminName = "`IW4MAdmin`";
        } else {
            adminName = `[${client.cleanedName}](${this.baseUrl}/client/profileasync/${client.clientId})`;
        }
        return adminName;
    },

    timeFormat: function (time) {
        let splitTime = time.includes(".") ? time.split(/[.:]+/) : time.split(":");
        let [days, hours, minutes, seconds] = [null, null, null, null];

        if (splitTime.length >= 4) {
            days = parseInt(splitTime[splitTime.length - 4]);
            days = days > 0 ? `${days} day${days === 1 ? '' : 's'} ` : '';
        }

        if (splitTime.length >= 3) {
            hours = parseInt(splitTime[splitTime.length - 3]);
            hours = hours > 0 ? `${hours} hour${hours === 1 ? '' : 's'} ` : '';
        }

        if (splitTime.length >= 2) {
            minutes = parseInt(splitTime[splitTime.length - 2]);
            minutes = minutes > 0 ? `${minutes} minute${minutes === 1 ? '' : 's'} ` : '';
        }

        if (splitTime.length >= 1) {
            seconds = parseInt(splitTime[splitTime.length - 1]);
            seconds = seconds > 0 ? `${seconds} second${seconds === 1 ? '' : 's'} ` : '';
        }

        return `${days || ''}${hours || ''}${minutes || ''}${seconds || ''}`.trim();
    },


    gameInfo: function (server) {
        const games = {
            "CoD4x Parser": {
                name: "CoD4x",
                iconUrl: "http://orig05.deviantart.net/8749/f/2008/055/0/c/call_of_duty_4__dock_icon_by_watts240.png",
                color: 6723840
            },
            "H1-Mod Parser": {
                name: "H1-Mod",
                iconUrl: "https://i.ibb.co/zS4pc0B/166013016241761317.png",
                color: 6723844
            },
            "IW4x Parser": {
                name: "IW4x",
                iconUrl: "https://i.gyazo.com/758b6933287392106bfdddc24b09d502.png",
                color: 11331072
            },
            "Tekno MW3 Parser": {
                name: "TeknoMW3",
                iconUrl: "https://orig00.deviantart.net/9af1/f/2011/310/2/1/modern_warfare_3_logo_by_wifsimster-d4f9ozd.png",
                color: 39219
            },
            "Plutonium IW5 Parser": {
                name: "PlutoIW5",
                iconUrl: "https://orig00.deviantart.net/9af1/f/2011/310/2/1/modern_warfare_3_logo_by_wifsimster-d4f9ozd.png",
                color: 39219
            },
            "IW6x Parser": {
                name: "IW6x",
                iconUrl: "https://i.gyazo.com/82b84341e141f6420db6c6ef1d9037bb.png",
                color: 39321
            },
            "Plutonium T4 MP Parser": {
                name: "PlutoT4",
                iconUrl: "https://i.gyazo.com/1e1987d84038aae38610cab9c999868d.png",
                color: 7829308
            },
            "Plutonium T4 CO-OP/Zombies Parser": {
                name: "PlutoT4 Singleplayer",
                iconUrl: "https://i.gyazo.com/1e1987d84038aae38610cab9c999868d.png",
                color: 7829308
            },
            "RektT5m Parser": {
                name: "RektT5M",
                iconUrl: "https://i.gyazo.com/a8a22764fafd4cc178329717b9bb35dd.png",
                color: 6064778
            },
            "Plutonium T5 Parser": {
                name: "PlutoT5",
                iconUrl: "https://i.gyazo.com/a8a22764fafd4cc178329717b9bb35dd.png",
                color: 6064778
            },
            "Plutonium T6 Parser": {
                name: "PlutoT6",
                iconUrl: "https://i.gyazo.com/5a445c5c733c698b32732550ec797e91.png",
                color: 15108608
            },
            "Black Ops 3 Parser": {
                name: "Call of Duty: Black Ops III",
                iconUrl: "https://i.gyazo.com/5691ca84d47e219cdec76901ff142159.png",
                color: 16737792
            },
            "BOIII Parser": {
                name: "BOIII",
                iconUrl: "https://i.imgur.com/nIi5QFP.jpg",
                color: 16737792
            },
            "S1x Parser": {
                name: "SHG1",
                iconUrl: "https://i.gyazo.com/d524bf93e1fc38fa46f8fe1ed5162493.png",
                color: 13421568
            },
            "CS:GO Parser": {
                name: "CSGO",
                iconUrl: "https://www.freeiconspng.com/uploads/csgo-icon-4.png",
                color: 1911881
            },
            "CS:GO (SourceMod) Parser": {
                name: "CSGO (SourceMod)",
                iconUrl: "https://www.freeiconspng.com/uploads/csgo-icon-4.png",
                color: 1911881
            }
        };

        const defaultGame = {
            name: "Not Supported Game",
            iconUrl: "https://www.freeiconspng.com/uploads/csgo-icon-4.png",
            color: "0000000"
        };

        const game = games[server.eventParser.name] || defaultGame;

        return {game: game.name, iconUrl: game.iconUrl, color: game.color};
    },

    getMapThumb: (server) => {
        const defaultIconUrl = "https://cdn0.iconfinder.com/data/icons/flat-design-basic-set-1/24/error-exclamation-512.png";

        let gameCode = server.gameCode;
        if (server.gameCode === "H1") gameCode = "IW3";

        if (mapUrls.hasOwnProperty(gameCode) && mapUrls[gameCode].hasOwnProperty(server.currentMap.name)) {
            return mapUrls[gameCode][server.currentMap.name];
        } else {
            return defaultIconUrl;
        }
    }
};

const mapUrls = {
    "IW3": {
        "mp_convoy": "https://static.wikia.nocookie.net/callofduty/images/3/3c/Bare_Load_Screen_Ambush_CoD4.jpg/revision/latest?cb=20100723075603",
        "mp_backlot": "https://static.wikia.nocookie.net/callofduty/images/0/0f/Backlot_loadscreen_CoD4.jpg/revision/latest?cb=20100723075613",
        "mp_bloc": "https://static.wikia.nocookie.net/callofduty/images/9/9d/Bare_Load_Screen_Bloc_CoD4.jpg/revision/latest?cb=20100723075638",
        "mp_bog": "https://static.wikia.nocookie.net/callofduty/images/2/29/Bog_Map_Image_CoD4.jpg/revision/latest?cb=20100723075648",
        "mp_countdown": "https://static.wikia.nocookie.net/callofduty/images/e/e9/Bare_Load_Screen_Countdown_CoD4.jpg/revision/latest?cb=20100723075829",
        "mp_crash": "https://www.gamegrin.com/assets/Uploads/_resampled/resizedimage640400-Bare-Load-Screen-Crash-CoD4.jpg",
        "mp_crossfire": "https://www.gamegrin.com/assets/Uploads/_resampled/resizedimage640360-Cod4-map-crossfire.jpg",
        "mp_citystreets": "https://www.gamegrin.com/assets/Uploads/_resampled/resizedimage640360-Cod4-map-district.jpg",
        "mp_farm": "https://www.gamegrin.com/assets/Uploads/_resampled/resizedimage640400-Bare-Load-Screen-Downpour-CoD4.jpg",
        "mp_overgrown": "https://www.gamegrin.com/assets/Uploads/_resampled/resizedimage640400-Bare-Load-Screen-Overgrown-CoD4.jpg",
        "mp_pipeline": "https://www.gamegrin.com/assets/Uploads/_resampled/resizedimage640360-Cod4-map-pipeline.jpg",
        "mp_shipment": "https://www.gamegrin.com/assets/Uploads/_resampled/resizedimage640360-Shipment-Load.jpg",
        "mp_showdown": "https://www.gamegrin.com/assets/Uploads/_resampled/resizedimage640360-Showdown-MWR.jpg",
        "mp_strike": "https://www.gamegrin.com/assets/Uploads/_resampled/resizedimage640400-Cod4-map-strike.jpg",
        "mp_vacant": "https://www.gamegrin.com/assets/Uploads/_resampled/resizedimage640360-Cod4-map-vacant.jpg",
        "mp_cargoship": "https://www.gamegrin.com/assets/Uploads/_resampled/resizedimage640400-Cod4-map-wetwork.jpg",
        "mp_crash_snow": "https://static.wikia.nocookie.net/callofduty/images/f/f7/Bare_Load_Screen_Winter_Crash_CoD4.jpg/revision/latest?cb=20100723080720",
        "mp_broadcast": "https://static.wikia.nocookie.net/callofduty/images/e/ec/Broadcast_loading_screen_CoD4.jpg/revision/latest?cb=20100723080927",
        "mp_creek": "https://static.wikia.nocookie.net/callofduty/images/e/e1/CreekCOD4.jpg/revision/latest?cb=20100723075941",
        "mp_carentan": "https://static.wikia.nocookie.net/callofduty/images/0/0c/ChinatownCOD4.jpg/revision/latest?cb=20110727174233",
        "mp_killhouse": "https://static.wikia.nocookie.net/callofduty/images/4/48/Cod4-killhouse.jpg/revision/latest?cb=20100723081127",
    },
    "IW4": {
        "mp_rust": "https://static.wikia.nocookie.net/callofduty/images/3/33/Rust.jpg/revision/latest?cb=20100720174413",
        "mp_terminal": "https://static.wikia.nocookie.net/callofduty/images/1/14/Bare_Load_Screen_Terminal_MW2.jpg/revision/latest?cb=20100720174519",
        "mp_crash": "https://static.wikia.nocookie.net/callofduty/images/9/9f/Bare_Load_Screen_Crash_MW2.jpg/revision/latest?cb=20100613115705",
        "mp_afghan": "https://static.wikia.nocookie.net/callofduty/images/8/83/Afghan_loading_screen_MW2.png/revision/latest?cb=20130310131229",
        "mp_derail": "https://static.wikia.nocookie.net/callofduty/images/2/20/Derail.jpg/revision/latest?cb=20100720174408",
        "mp_estate": "https://static.wikia.nocookie.net/callofduty/images/9/91/Estate.jpg/revision/latest?cb=20100720174409",
        "mp_favela": "https://static.wikia.nocookie.net/callofduty/images/2/29/Favela_Map_MW2.jpg/revision/latest?cb=20100720174410",
        "mp_highrise": "https://static.wikia.nocookie.net/callofduty/images/4/49/Highrise-promo.jpg/revision/latest?cb=20100720174411",
        "mp_invasion": "https://static.wikia.nocookie.net/callofduty/images/9/95/Invasion_MW2.jpg/revision/latest?cb=20100720174410",
        "mp_checkpoint": "https://static.wikia.nocookie.net/callofduty/images/9/9f/Karachi-prev.jpg/revision/latest?cb=20100720174412",
        "mp_quarry": "https://static.wikia.nocookie.net/callofduty/images/8/8a/Loadscreen_mp_quarry.jpg/revision/latest?cb=20091207173135",
        "mp_rundown": "https://static.wikia.nocookie.net/callofduty/images/3/3a/Rundown-prev.jpg/revision/latest?cb=20100720174412",
        "mp_boneyard": "https://static.wikia.nocookie.net/callofduty/images/e/ef/Scrapyard.jpg/revision/latest?cb=20100720174413",
        "mp_nightshift": "https://static.wikia.nocookie.net/callofduty/images/d/d2/Skidrow.jpg/revision/latest?cb=20100720174516",
        "mp_subbase": "https://static.wikia.nocookie.net/callofduty/images/1/1e/Sub_Base.jpg/revision/latest?cb=20100720174517",
        "mp_underpass": "https://static.wikia.nocookie.net/callofduty/images/b/b5/Underpass.jpg/revision/latest?cb=20100720174519",
        "mp_brecourt": "https://static.wikia.nocookie.net/callofduty/images/c/cc/Wasteland.jpg/revision/latest?cb=20100720174520",
        "mp_overgrown": "https://static.wikia.nocookie.net/callofduty/images/7/7d/Bare_Load_Screen_Overgrown_CoD4.jpg/revision/latest?cb=20110727174104",
        "mp_strike": "https://static.wikia.nocookie.net/callofduty/images/b/b0/Loadscreen_mp_strike.jpg/revision/latest?cb=20100712195725",
        "mp_vacant": "https://static.wikia.nocookie.net/callofduty/images/6/67/Loadscreen_mp_vacant.jpg/revision/latest?cb=20100712195617",
        "mp_abandon": "https://static.wikia.nocookie.net/callofduty/images/c/c3/Carnival_loadscreen.jpg/revision/latest?cb=20100712195429",
        "mp_trailerpark": "https://static.wikia.nocookie.net/callofduty/images/c/cf/Trailer_Park.jpg/revision/latest?cb=20100712195448",
        "mp_fuel2": "https://static.wikia.nocookie.net/callofduty/images/d/de/Fuel_loadscreen.jpg/revision/latest?cb=20100712195521",
        "mp_storm": "https://static.wikia.nocookie.net/callofduty/images/6/60/MW2_Storm.jpg/revision/latest?cb=20100613115722",
        "mp_complex": "https://static.wikia.nocookie.net/callofduty/images/0/0e/MW2_Bailout.jpg/revision/latest?cb=20100613115812",
        "mp_compact": "https://static.wikia.nocookie.net/callofduty/images/d/d7/MW2_Salvage.jpg/revision/latest?cb=20100613115824",
        "mp_nuked": "https://i.ytimg.com/vi/ysr0CyyJx8E/maxresdefault.jpg",
        "iw4_credits": "https://i.ytimg.com/vi/VniF3DnE5uk/maxresdefault.jpg",
        "mp_killhouse": "https://static.wikia.nocookie.net/callofduty/images/4/48/Cod4-killhouse.jpg/revision/latest?cb=20100723081127",
        "mp_bog_sh": "https://static.wikia.nocookie.net/callofduty/images/2/29/Bog_Map_Image_CoD4.jpg/revision/latest?cb=20100723075648",
        "mp_cargoship_sh": "https://static.wikia.nocookie.net/callofduty/images/d/d4/Cargo_loadscreen_BOII.png/revision/latest?cb=20130120072815",
        "mp_cargoship": "https://static.wikia.nocookie.net/callofduty/images/d/d4/Cargo_loadscreen_BOII.png/revision/latest?cb=20130120072815",
        "mp_shipment": "https://static.wikia.nocookie.net/callofduty/images/9/9b/Shipment_Load.jpg/revision/latest?cb=20100723080524",
        "mp_shipment_long": "https://static.wikia.nocookie.net/callofduty/images/9/9b/Shipment_Load.jpg/revision/latest?cb=20100723080524",
        "mp_rust_long": "https://static.wikia.nocookie.net/callofduty/images/3/33/Rust.jpg/revision/latest?cb=20100720174413",
        "mp_firingrange": "https://static.wikia.nocookie.net/callofduty/images/8/82/Bare_Load_Screen_Firing_Range_BO.jpg/revision/latest?cb=20110303121918",
        "mp_storm_spring": "https://static.wikia.nocookie.net/callofduty/images/6/60/MW2_Storm.jpg/revision/latest?cb=20100613115722",
        "mp_fav_tropical": "https://static.wikia.nocookie.net/callofduty/images/2/29/Favela_Map_MW2.jpg/revision/latest?cb=20100720174410",
        "mp_estate_tropical": "https://static.wikia.nocookie.net/callofduty/images/9/91/Estate.jpg/revision/latest?cb=20100720174409",
        "mp_crash_tropical": "https://static.wikia.nocookie.net/callofduty/images/9/9f/Bare_Load_Screen_Crash_MW2.jpg/revision/latest?cb=20100613115705",
        "mp_bloc_sh": "https://static.wikia.nocookie.net/callofduty/images/9/9d/Bare_Load_Screen_Bloc_CoD4.jpg/revision/latest?cb=20100723075638",
        "mp_cross_fire": "https://static.wikia.nocookie.net/callofduty/images/5/53/Cod4_map_crossfire.jpg/revision/latest?cb=20100723075954",
        "mp_bloc": "https://static.wikia.nocookie.net/callofduty/images/9/9d/Bare_Load_Screen_Bloc_CoD4.jpg/revision/latest?cb=20100723075638",
        "oilrig": "https://static.wikia.nocookie.net/callofduty/images/3/30/Mg_oilrig.jpg/revision/latest480?cb=20120716172859",
        "co_hunted": "https://static.wikia.nocookie.net/callofduty/images/f/f4/Bare_Load_Screen_Village_MW3.png/revision/latest?cb=20120320235505",
    },
    "IW5": {
        "mp_seatown": "https://static.wikia.nocookie.net/callofduty/images/a/a7/Bare_Load_Screen_Seatown_MW3.png/revision/latest?cb=20120320235504",
        "mp_alpha": "https://static.wikia.nocookie.net/callofduty/images/a/a6/Lockdown_loading_screen_MW3.PNG/revision/latest?cb=20130728192041",
        "mp_bravo": "https://static.wikia.nocookie.net/callofduty/images/2/20/Bare_Load_Screen_Mission_MW3.png/revision/latest?cb=20120320235416",
        "mp_carbon": "https://static.wikia.nocookie.net/callofduty/images/c/c8/Bare_Load_Screen_Carbon_MW3.png/revision/latest?cb=20120320235417",
        "mp_dome": "https://static.wikia.nocookie.net/callofduty/images/f/f1/Bare_Load_Screen_Dome_MW3.png/revision/latest?cb=20120320235417",
        "mp_plaza2": "https://static.wikia.nocookie.net/callofduty/images/6/65/Bare_Loading_Screen_Arkaden_MW3.png/revision/latest?cb=20120519230749",
        "mp_exchange": "https://static.wikia.nocookie.net/callofduty/images/5/52/Bare_Load_Screen_Downturn_MW3.png/revision/latest?cb=20120320235418",
        "mp_bootleg": "https://static.wikia.nocookie.net/callofduty/images/5/52/Bare_Load_Screen_Downturn_MW3.png/revision/latest?cb=20120320235418",
        "mp_hardhat": "https://static.wikia.nocookie.net/callofduty/images/5/5a/Bare_Load_Screen_Hardhat_MW3.png/revision/latest?cb=20120519225919",
        "mp_interchange": "https://static.wikia.nocookie.net/callofduty/images/4/4b/Bare_Load_Screen_Interchange_MW3.png/revision/latest?cb=20120320235418",
        "mp_lambeth": "https://static.wikia.nocookie.net/callofduty/images/d/d8/Bare_Loading_Screen_Fallen_MW3.png/revision/latest?cb=20120320235419",
        "mp_radar": "https://static.wikia.nocookie.net/callofduty/images/3/3c/Bare_Load_Screen_Outpost_MW3.png/revision/latest?cb=20120320235504",
        "mp_mogadishu": "https://static.wikia.nocookie.net/callofduty/images/3/39/Bare_Load_Screen_Bakaara_MW3.png/revision/latest?cb=20120320235502",
        "mp_paris": "https://static.wikia.nocookie.net/callofduty/images/f/fe/Bare_Load_Screen_Resistance_MW3.png/revision/latest?cb=20120320235503",
        "mp_underground": "https://static.wikia.nocookie.net/callofduty/images/0/09/Bare_Load_Screen_Underground_MW3.png/revision/latest?cb=20120320235504",
        "mp_village": "https://static.wikia.nocookie.net/callofduty/images/f/f4/Bare_Load_Screen_Village_MW3.png/revision/latest?cb=20120320235505",
        "mp_aground_ss": "https://static.wikia.nocookie.net/callofduty/images/3/31/Sideview_Aground_MW3.jpg/revision/latest?cb=20120512095024",
        "mp_boardwalk": "https://static.wikia.nocookie.net/callofduty/images/2/2c/Boardwalk_loadscreen_MW3.png/revision/latest?cb=20140411094526",
        "mp_burn_ss": "https://static.wikia.nocookie.net/callofduty/images/d/d0/U-Turn_loadscreen_MW3.png/revision/latest?cb=20140411095015",
        "mp_cement": "https://static.wikia.nocookie.net/callofduty/images/0/0f/Foundation_loadscreen_MW3.png/revision/latest?cb=20140411095546",
        "mp_courtyard_ss": "https://static.wikia.nocookie.net/callofduty/images/4/46/Main_Statue_Erosion_MW3.jpg/revision/latest?cb=20120512094647",
        "mp_crosswalk_ss": "https://static.wikia.nocookie.net/callofduty/images/d/dd/Intersection_loadscreen_MW3.png/revision/latest?cb=20140411100832",
        "mp_hillside_ss": "https://static.wikia.nocookie.net/callofduty/images/1/1f/Bare_Load_Screen_Getaway_MW3.jpg/revision/latest?cb=20120512095322",
        "mp_italy": "https://static.wikia.nocookie.net/callofduty/images/3/38/Bare_Load_Screen_Piazza_MW3.jpg/revision/latest?cb=20120110185200",
        "mp_meteora": "https://static.wikia.nocookie.net/callofduty/images/4/4b/Bare_Load_Screen_Sanctuary_MW3.jpg/revision/latest?cb=20120410173611",
        "mp_moab": "https://static.wikia.nocookie.net/callofduty/images/3/30/Bridge_Gulch_MW3.jpg/revision/latest?cb=20120802172028",
        "mp_morningwood": "https://static.wikia.nocookie.net/callofduty/images/d/d1/Bare_Load_Screen_Black_Box_MW3.jpg/revision/latest?cb=20120309203305",
        "mp_nola": "https://static.wikia.nocookie.net/callofduty/images/a/aa/Missiles_Parish_MW3.jpg/revision/latest?cb=20120802172330",
        "mp_overwatch": "https://static.wikia.nocookie.net/callofduty/images/3/35/Bare_Load_Screen_Overwatch_MW3.jpg/revision/latest?cb=20120207181435",
        "mp_park": "https://static.wikia.nocookie.net/callofduty/images/e/e8/Bare_Load_Screen_Liberation_MW3.png/revision/latest?cb=20120120153252",
        "mp_qadeem": "https://static.wikia.nocookie.net/callofduty/images/c/c1/Bare_Load_Screen_Oasis_MW3.jpg/revision/latest?cb=20120512100009",
        "mp_restrepo_ss": "https://static.wikia.nocookie.net/callofduty/images/2/28/Bare_Load_Screen_Lookout_MW3.jpg/revision/latest?cb=20120512095607",
        "mp_roughneck": "https://static.wikia.nocookie.net/callofduty/images/2/2d/Crane_Off_Shore_MW3.jpg/revision/latest?cb=20120712172115",
        "mp_shipbreaker": "https://static.wikia.nocookie.net/callofduty/images/4/4f/Bare_ELITE_Calendar_Decommission_MW3.jpg/revision/latest?cb=20120802171643",
        "mp_six_ss": "https://static.wikia.nocookie.net/callofduty/images/2/2a/Bare_ELITE_Calendar_Vortex_MW3.jpg/revision/latest?cb=20120624135437",
        "mp_terminal_cls": "https://static.wikia.nocookie.net/callofduty/images/6/68/Terminal_Loading_Screen_MW3.png/revision/latest?cb=20120826091508",
        "mp_rust": "https://static.wikia.nocookie.net/callofduty/images/3/33/Rust.jpg/revision/latest?cb=20100720174413",
        "mp_highrise": "https://static.wikia.nocookie.net/callofduty/images/4/49/Highrise-promo.jpg/revision/latest?cb=20100720174411",
        "mp_favela": "https://static.wikia.nocookie.net/callofduty/images/2/29/Favela_Map_MW2.jpg/revision/latest?cb=20100720174410",
        "mp_nuked": "https://i.ytimg.com/vi/ysr0CyyJx8E/maxresdefault.jpg",
        "mp_nightshift": "https://static.wikia.nocookie.net/callofduty/images/d/d2/Skidrow.jpg/revision/latest?cb=20100720174516"
    },
    "IW6": {
        "mp_prisonbreak": "https://static.wikia.nocookie.net/callofduty/images/a/a6/Prison_Break_CoDG.jpg/revision/latest?cb=20160123214305",
        "mp_dart": "https://static.wikia.nocookie.net/callofduty/images/b/be/Octane_Menu_Icon_CoDG.jpg/revision/latest?cb=20160222225028",
        "mp_lonestar": "https://static.wikia.nocookie.net/callofduty/images/2/23/Tremor_Menu_Icon_CoDG.jpg/revision/latest?cb=20160222233807",
        "mp_frag": "https://static.wikia.nocookie.net/callofduty/images/e/e4/Freight_Menu_Icon_CoDG.jpg/revision/latest?cb=20160222225820",
        "mp_snow": "https://static.wikia.nocookie.net/callofduty/images/9/90/Whiteout_Menu_Icon_CoDG.jpg/revision/latest?cb=20160222234606",
        "mp_fahrenheit": "https://static.wikia.nocookie.net/callofduty/images/a/aa/Stormfront_Menu_Icon_CoDG.jpg/revision/latest?cb=20160222233307",
        "mp_hashima": "https://static.wikia.nocookie.net/callofduty/images/c/c3/Siege_Menu_Icon_CoDG.jpg/revision/latest?cb=20160222231338",
        "mp_warhawk": "https://static.wikia.nocookie.net/callofduty/images/9/97/Warhawk_Menu_Icon_CoDG.jpg/revision/latest?cb=20160222234210",
        "mp_sovereign": "https://static.wikia.nocookie.net/callofduty/images/d/de/Sovereign_Menu_Icon_CoDG.jpg/revision/latest?cb=20160222231915",
        "mp_zebra": "https://static.wikia.nocookie.net/callofduty/images/8/86/Overlord_Menu_Icon_CoDG.jpg/revision/latest?cb=20160222230253",
        "mp_skeleton": "https://static.wikia.nocookie.net/callofduty/images/b/b6/Stonehaven_Menu_Icon_CoDG.jpg/revision/latest?cb=20160222232822",
        "mp_chasm": "https://static.wikia.nocookie.net/callofduty/images/f/fe/Chasm_Menu_Icon_CoDG.jpg/revision/latest?cb=20160222201016",
        "mp_flooded": "https://static.wikia.nocookie.net/callofduty/images/5/56/Flooded_Menu_Icon_CoDG.jpg/revision/latest?cb=20160222225348",
        "mp_strikezone": "https://static.wikia.nocookie.net/callofduty/images/0/02/Strikezone_Menu_Icon_CoDG.jpg/revision/latest?cb=20180514000159",
        "mp_descent_new": "https://static.wikia.nocookie.net/callofduty/images/2/21/Free_Fall_Loading_Screen_CoDG.jpg/revision/latest?cb=20160219035443",
        "mp_dome_ns": "https://static.wikia.nocookie.net/callofduty/images/8/83/Unearthed_Loading_Screen_CoDG.jpg/revision/latest?cb=20150618191214",
        "mp_ca_impact": "https://static.wikia.nocookie.net/callofduty/images/7/77/Collision_Loading_Screen_CoDG.jpg/revision/latest?cb=20150618190921",
        "mp_ca_behemoth": "https://static.wikia.nocookie.net/callofduty/images/4/4d/Behemoth_Loading_Screen_CoDG.jpg/revision/latest?cb=20150618190417",
        "mp_battery3": "https://static.wikia.nocookie.net/callofduty/images/0/08/Ruins_Loading_Screen_CoDG.jpg/revision/latest?cb=20150618185226",
        "mp_dig": "https://static.wikia.nocookie.net/callofduty/images/9/94/Pharaoh_Loading_Screen_CoDG.jpg/revision/latest?cb=20150618191459",
        "mp_favela_iw6": "https://static.wikia.nocookie.net/callofduty/images/4/4b/Favela_Map_CoDG.jpg/revision/latest?cb=20150618192317",
        "mp_pirate": "https://static.wikia.nocookie.net/callofduty/images/b/b3/Mutiny_Loading_Screen_CoDG.jpg/revision/latest?cb=20150618192100",
        "mp_zulu": "https://static.wikia.nocookie.net/callofduty/images/1/14/Departed_Loading_Screen_CoDG.jpg/revision/latest?cb=20150618191721",
        "mp_conflict": "https://static.wikia.nocookie.net/callofduty/images/c/cc/Dynasty_Menu_Icon_CoDG.jpg/revision/latest?cb=20160117004931",
        "mp_mine": "https://static.wikia.nocookie.net/callofduty/images/9/9d/Goldrush_Nemesis_CoDG.jpg/revision/latest?cb=20160117231327",
        "mp_shipment_ns": "https://static.wikia.nocookie.net/callofduty/images/f/f5/Showtime_Menu_Icon_CoDG.png/revision/latest?cb=20160117030703",
        "mp_zerosub": "https://static.wikia.nocookie.net/callofduty/images/f/f2/Subzero_Nemesis_CoDG.jpg/revision/latest?cb=20160117230851",
        "mp_boneyard_ns": "https://static.wikia.nocookie.net/callofduty/images/8/87/Ignition_Loading_Screen_CoDG.jpg/revision/latest?cb=20150618184639",
        "mp_ca_red_river": "https://static.wikia.nocookie.net/callofduty/images/9/93/Containment_Loading_Screen_CoDG.jpg/revision/latest?cb=20150618184139",
        "mp_ca_rumble": "https://static.wikia.nocookie.net/callofduty/images/2/2b/BayView_Loading_Screen_CoDG.jpg/revision/latest?cb=20150618183749",
        "mp_swamp": "https://static.wikia.nocookie.net/callofduty/images/5/56/Fog_Loading_Screen_CoDG.jpg/revision/latest?cb=20150618183104",
        "mp_alien_town": "https://static.wikia.nocookie.net/callofduty/images/a/a9/Point_of_Contact_loading_screen_CoDG.png/revision/latest?cb=20140818190238",
        "mp_alien_armory": "https://static.wikia.nocookie.net/callofduty/images/3/3b/Nightfall_Screenshot_CoDG.jpg/revision/latest?cb=20170705221821",
        "mp_alien_beacon": "https://static.wikia.nocookie.net/callofduty/images/f/f2/Mayday_CoDG.jpg/revision/latest?cb=20160117211635",
        "mp_alien_dlc3": "https://static.wikia.nocookie.net/callofduty/images/5/52/CoDG_Invasion_Extinction_Awakening_o.jpg/revision/latest?cb=20140605021520",
        "mp_alien_last": "https://static.wikia.nocookie.net/callofduty/images/d/db/Exodus_CoDG.jpg/revision/latest?cb=20160117203311"
    },
    "T4": {
        "mp_airfield": "https://static.wikia.nocookie.net/callofduty/images/0/04/Airfield.jpg/revision/latest?cb=20100703083537",
        "mp_asylum": "https://static.wikia.nocookie.net/callofduty/images/9/99/Asylum.jpg/revision/latest?cb=20100703075737",
        "mp_castle": "https://static.wikia.nocookie.net/callofduty/images/e/e1/Castle.jpg/revision/latest?cb=20100703075702",
        "mp_shrine": "https://static.wikia.nocookie.net/callofduty/images/b/b5/Cliffside.jpg/revision/latest?cb=20110702030241",
        "mp_courtyard": "https://static.wikia.nocookie.net/callofduty/images/3/30/Courtyard.jpg/revision/latest?cb=20100703075822",
        "mp_dome": "https://static.wikia.nocookie.net/callofduty/images/6/64/Dome.jpg/revision/latest?cb=20100703075919",
        "mp_downfall": "https://static.wikia.nocookie.net/callofduty/images/0/03/Downfall_Loadscreen_WaW.png/revision/latest?cb=20121128143425",
        "mp_hangar": "https://static.wikia.nocookie.net/callofduty/images/b/be/Hanger.jpg/revision/latest?cb=20100703080146",
        "mp_makin": "https://static.wikia.nocookie.net/callofduty/images/f/fa/Makin.jpg/revision/latest?cb=20110710131317",
        "mp_outskirts": "https://static.wikia.nocookie.net/callofduty/images/4/44/Outskirts.jpg/revision/latest?cb=20100703080341",
        "mp_roundhouse": "https://static.wikia.nocookie.net/callofduty/images/2/25/Roundhouse.jpg/revision/latest?cb=20100703080407",
        "mp_suburban": "https://static.wikia.nocookie.net/callofduty/images/f/fb/Upheaval.jpg/revision/latest?cb=20100703081123",
        "mp_kneedeep": "https://static.wikia.nocookie.net/callofduty/images/d/d1/KneeDeepLoad.jpg/revision/latest?cb=20100703075448",
        "mp_nachtfeuer": "https://static.wikia.nocookie.net/callofduty/images/7/73/Nightfire.jpg/revision/latest?cb=20100703081308",
        "mp_subway": "https://static.wikia.nocookie.net/callofduty/images/6/6f/Station.jpg/revision/latest?cb=20100703081515",
        "mp_kwai": "https://static.wikia.nocookie.net/callofduty/images/d/de/Banzaiscreenshot.jpg/revision/latest?cb=20100703081611",
        "mp_stalingrad": "https://static.wikia.nocookie.net/callofduty/images/5/58/Corrosionscreenshot.jpg/revision/latest?cb=20100703081643",
        "mp_docks": "https://static.wikia.nocookie.net/callofduty/images/5/50/Subpensscreenshot.jpg/revision/latest?cb=20100703081718",
        "mp_drum": "https://static.wikia.nocookie.net/callofduty/images/3/30/Battery.jpg/revision/latest?cb=20100703081836",
        "mp_bgate": "https://static.wikia.nocookie.net/callofduty/images/9/9e/Breach.jpg/revision/latest?cb=20100703082957",
        "mp_vodka": "https://static.wikia.nocookie.net/callofduty/images/f/f3/Revolution.jpg/revision/latest?cb=20100703083210",
        "nazi_zombie_prototype": "https://static.wikia.nocookie.net/callofduty/images/2/2b/Nacht_Der_Untoten_Menu_Selection_WaW.png/revision/latest?cb=20161009103531",
        "nazi_zombie_asylum": "https://static.wikia.nocookie.net/callofduty/images/a/a1/Verruckt_Menu_Selection_WaW.png/revision/latest?cb=20161009103542",
        "nazi_zombie_sumpf": "https://static.wikia.nocookie.net/callofduty/images/2/2f/Shi_No_Numa_Menu_Selection_WaW.png/revision/latest?cb=20161009103553",
        "nazi_zombie_factory": "https://static.wikia.nocookie.net/callofduty/images/8/86/Der_Riese_Menu_Selection_WaW.png/revision/latest?cb=20161009103603"
    },
    "T5": {
        "mp_array": "https://static.wikia.nocookie.net/callofduty/images/3/35/Bare_Load_Screen_Array_BO.jpg/revision/latest?cb=20110303121651",
        "mp_berlinwall2": "https://static.wikia.nocookie.net/callofduty/images/7/78/Berlin_Wall_loadscreen_BO.jpg/revision/latest?cb=20121108093747",
        "mp_gridlock": "https://static.wikia.nocookie.net/callofduty/images/7/7a/Recreated_Load_Screen_Convoy_BO.jpg/revision/latest?cb=20110606062753",
        "mp_cracked": "https://static.wikia.nocookie.net/callofduty/images/1/1e/Bare_Load_Screen_Cracked_BO.jpg/revision/latest?cb=20110303121738",
        "mp_crisis": "https://static.wikia.nocookie.net/callofduty/images/f/f6/Bare_Load_Screen_Crisis_BO.jpg/revision/latest?cb=20110303121824",
        "mp_discovery": "https://static.wikia.nocookie.net/callofduty/images/0/09/Discovery_loadscreen_BO.jpg/revision/latest?cb=20121108094733",
        "mp_drivein": "https://static.wikia.nocookie.net/callofduty/images/9/9e/Galactic_Sign_Drive-In_BO.png/revision/latest?cb=20120118175649",
        "mp_firingrange": "https://static.wikia.nocookie.net/callofduty/images/8/82/Bare_Load_Screen_Firing_Range_BO.jpg/revision/latest?cb=20110303121918",
        "mp_duga": "https://static.wikia.nocookie.net/callofduty/images/4/41/Bare_Load_Screen_Grid_BO.jpg/revision/latest?cb=20110303122000",
        "mp_area51": "https://static.wikia.nocookie.net/callofduty/images/a/a2/Hangar_18_loadscreen_BO.png/revision/latest?cb=20130714193416",
        "mp_hanoi": "https://static.wikia.nocookie.net/callofduty/images/e/eb/Bare_Load_Screen_Hanoi_BO.jpg/revision/latest?cb=20110303122041",
        "mp_cairo": "https://static.wikia.nocookie.net/callofduty/images/e/e7/Bare_Load_Screen_Havana_BO.jpg/revision/latest?cb=20110303122124",
        "mp_golfcourse": "https://static.wikia.nocookie.net/callofduty/images/4/48/Overview_Hazard_BO.png/revision/latest?cb=20120119064515",
        "mp_hotel": "https://static.wikia.nocookie.net/callofduty/images/c/ca/Bare_Load_Screen_Hotel_BO.png/revision/latest?cb=20110617143724",
        "mp_havoc": "https://static.wikia.nocookie.net/callofduty/images/c/c6/Bare_Load_Screen_Jungle_BO.jpg/revision/latest?cb=20110303122217",
        "mp_kowloon": "https://static.wikia.nocookie.net/callofduty/images/a/a7/Kowloon_loadscreen_BO.jpg/revision/latest?cb=20121108094415",
        "mp_cosmodrome": "https://static.wikia.nocookie.net/callofduty/images/c/c6/Bare_Load_Screen_Launch_BO.jpg/revision/latest?cb=20110303122251",
        "mp_nuked": "https://i.ytimg.com/vi/ysr0CyyJx8E/maxresdefault.jpg",
        "mp_radiation": "https://static.wikia.nocookie.net/callofduty/images/2/20/Bare_Load_Screen_Radiation_BO.jpg/revision/latest?cb=20110303122417",
        "mp_silo": "https://static.wikia.nocookie.net/callofduty/images/a/a7/Warhead_Silo_BO.png/revision/latest?cb=20120121223541",
        "mp_stadium": "https://static.wikia.nocookie.net/callofduty/images/2/24/Stadium_loadscreen_BO.jpg/revision/latest?cb=20121108092948",
        "mp_outskirts": "https://static.wikia.nocookie.net/callofduty/images/2/2d/Bare_Load_Screen_Stockpile_BO.jpg/revision/latest?cb=20110605094802",
        "mp_mountain": "https://static.wikia.nocookie.net/callofduty/images/5/54/Bare_Load_Screen_Summit_BO.jpg/revision/latest?cb=20110303122702",
        "mp_villa": "https://static.wikia.nocookie.net/callofduty/images/2/2a/Bare_Load_Screen_Villa_BO.jpg/revision/latest?cb=20110303122503",
        "mp_russianbase": "https://static.wikia.nocookie.net/callofduty/images/1/12/Bare_Load_Screen_WMD_BO.jpg/revision/latest?cb=20110303122544",
        "mp_zoo": "https://static.wikia.nocookie.net/callofduty/images/7/78/Recreated_Load_Screen_Zoo_BO.jpg/revision/latest?cb=20110606065905"
    },
    "T6": {
        "mp_la": "https://static.wikia.nocookie.net/callofduty/images/b/ba/Aftermath_loading_screen_BOII.png/revision/latest?cb=20130125112538",
        "mp_dockside": "https://static.wikia.nocookie.net/callofduty/images/d/d4/Cargo_loadscreen_BOII.png/revision/latest?cb=20130120072815",
        "mp_carrier": "https://static.wikia.nocookie.net/callofduty/images/8/88/Carrier_loadscreen_BOII.png/revision/latest?cb=20121209072436",
        "mp_drone": "https://static.wikia.nocookie.net/callofduty/images/5/5b/Drone_loadscreen_BOII.png/revision/latest?cb=20121209074205",
        "mp_express": "https://static.wikia.nocookie.net/callofduty/images/d/d1/Express_Load_Screen_BOII.png/revision/latest?cb=20121209074544",
        "mp_hijacked": "https://static.wikia.nocookie.net/callofduty/images/7/79/Hijacked_Load_Screen_BOII.png/revision/latest?cb=20121209075028",
        "mp_meltdown": "https://static.wikia.nocookie.net/callofduty/images/9/92/Meltdown_Load_Screen_BOII.png/revision/latest?cb=20121209075341",
        "mp_overflow": "https://static.wikia.nocookie.net/callofduty/images/8/80/Overflow_Load_Screen_BOII.png/revision/latest?cb=20121209075750",
        "mp_nightclub": "https://static.wikia.nocookie.net/callofduty/images/7/74/Plaza_Load_Screen_BOII.png/revision/latest?cb=20130125112602",
        "mp_raid": "https://static.wikia.nocookie.net/callofduty/images/2/29/Raid_Load_Screen_BOII.png/revision/latest?cb=20121209080157",
        "mp_slums": "https://static.wikia.nocookie.net/callofduty/images/0/04/Slums_Load_Screen_BOII.png/revision/latest?cb=20121209080826",
        "mp_village": "https://static.wikia.nocookie.net/callofduty/images/1/1f/Standoff_Load_Screen_BOII.png/revision/latest?cb=20121209080838",
        "mp_turbine": "https://static.wikia.nocookie.net/callofduty/images/5/50/Turbine_Load_Screen_BOII.png/revision/latest?cb=20121209081207",
        "mp_socotra": "https://static.wikia.nocookie.net/callofduty/images/6/6d/Yemen_Load_Screen_BOII.png/revision/latest?cb=20121209071959",
        "mp_nuketown_2020": "https://static.wikia.nocookie.net/callofduty/images/0/03/Nuketown_2025_Load_Screen_BOII.png/revision/latest?cb=20121217102325",
        "mp_downhill": "https://static.wikia.nocookie.net/callofduty/images/2/28/Downhill_In-Game.jpg/revision/latest?cb=20130201205402",
        "mp_mirage": "https://static.wikia.nocookie.net/callofduty/images/d/d3/Mirage_loadscreen_BOII.png/revision/latest?cb=20140426185229",
        "mp_hydro": "https://static.wikia.nocookie.net/callofduty/images/4/44/Hydro_In-Game.jpg/revision/latest?cb=20130201204341",
        "mp_skate": "https://static.wikia.nocookie.net/callofduty/images/8/86/Grind_In-Game.jpg/revision/latest?cb=20130201203728",
        "mp_concert": "https://static.wikia.nocookie.net/callofduty/images/4/4d/Encore_loadscreen_BOII.png/revision/latest?cb=20130905100408",
        "mp_magma": "https://static.wikia.nocookie.net/callofduty/images/3/30/Magma_loadscreen_BOII.png/revision/latest?cb=20130905100136",
        "mp_vertigo": "https://static.wikia.nocookie.net/callofduty/images/f/f6/Vertigo_loadscreen_BOII.png/revision/latest?cb=20130905095457",
        "mp_studio": "https://static.wikia.nocookie.net/callofduty/images/1/1e/Studio_loadscreen_BOII.png/revision/latest?cb=20130905095718",
        "mp_uplink": "https://static.wikia.nocookie.net/callofduty/images/f/fc/Uplink_loadscreen_BOII.png/revision/latest?cb=20130905095254",
        "mp_bridge": "https://static.wikia.nocookie.net/callofduty/images/0/04/Detour_loadscreen_BOII.png/revision/latest?cb=20130905095021",
        "mp_castaway": "https://static.wikia.nocookie.net/callofduty/images/e/ee/Cove_loadscreen_BOII.png/revision/latest?cb=20130905100640",
        "mp_paintball": "https://static.wikia.nocookie.net/callofduty/images/2/2e/Rush_loadscreen_BOII.png/revision/latest?cb=20130905095938",
        "mp_dig": "https://static.wikia.nocookie.net/callofduty/images/8/83/Dig_loadscreen_BOII.png/revision/latest?cb=20140426105014",
        "mp_frostbite": "https://static.wikia.nocookie.net/callofduty/images/4/43/Frost_loadscreen_BOII.png/revision/latest?cb=20140426105546",
        "mp_pod": "https://static.wikia.nocookie.net/callofduty/images/4/42/Pod_loadscreen_BOII.png/revision/latest?cb=20140426105842",
        "mp_takeoff": "https://static.wikia.nocookie.net/callofduty/images/3/3f/Takeoff_loadscreen_BOII.png/revision/latest?cb=20140426110209",
        "zm_buried": "https://static.wikia.nocookie.net/callofduty/images/7/71/Buried_menu_BOII.png/revision/latest?cb=20161102222409",
        "zm_highrise": "https://static.wikia.nocookie.net/callofduty/images/6/60/Die_Rise_menu_selection_BO2.png/revision/latest?cb=20161102222915",
        "zm_nuked": "https://static.wikia.nocookie.net/callofduty/images/7/74/Nuketown_menu_selection_BO2.png/revision/latest?cb=20161102222934",
        "zm_prison": "https://static.wikia.nocookie.net/callofduty/images/a/aa/Mob_of_the_Dead_menu_selection_BO2.png/revision/latest?cb=20161102222825",
        "zm_tomb": "https://static.wikia.nocookie.net/callofduty/images/b/b2/Origins_Lobby_Icon_BO2.png/revision/latest?cb=20161102222425",
        "zm_transit_dr": "https://static.wikia.nocookie.net/callofduty/images/b/b4/Diner_TranZit_BOII.png/revision/latest?cb=20130224071848",
        "zm_transit": "https://static.wikia.nocookie.net/callofduty/images/f/f9/TranZit_lobby_BOII.png/revision/latest?cb=20161102222339"
    },
    "T7": {
        "mp_apartments": "https://static.wikia.nocookie.net/callofduty/images/4/41/Evac_Map_Preview_BO3.png/revision/latest?cb=20200804015812",
        "mp_biodome": "https://static.wikia.nocookie.net/callofduty/images/a/a8/Aquarium_Map_Preview_BO3.png/revision/latest?cb=20200804014624",
        "mp_chinatown": "https://static.wikia.nocookie.net/callofduty/images/a/aa/Exodus_Map_Preview_BO3.png/revision/latest?cb=20200804015813",
        "mp_ethiopia": "https://static.wikia.nocookie.net/callofduty/images/5/50/Hunted_menu_icon_BO3.jpg/revision/latest?cb=20180311204011",
        "mp_havoc": "https://static.wikia.nocookie.net/callofduty/images/1/17/Havoc_Map_Preview_BO3.png/revision/latest?cb=20200804002228",
        "mp_infection": "https://static.wikia.nocookie.net/callofduty/images/9/9a/Infection_Map_Preview_BO3.png/revision/latest?cb=20200804015817",
        "mp_metro": "https://static.wikia.nocookie.net/callofduty/images/6/60/Metro_Map_Preview_BO3.png/revision/latest?cb=20200804015818",
        "mp_redwood": "https://static.wikia.nocookie.net/callofduty/images/1/18/Redwood_Map_Preview_BO3.png/revision/latest?cb=20200804015819",
        "mp_sector": "https://static.wikia.nocookie.net/callofduty/images/7/7e/Combine_Map_Preview_BO3.png/revision/latest?cb=20200804015811",
        "mp_spire": "https://static.wikia.nocookie.net/callofduty/images/e/e8/Breach_Map_Preview_BO3.png/revision/latest?cb=20200804015810",
        "mp_stronghold": "https://static.wikia.nocookie.net/callofduty/images/4/42/Stronghold_Map_Preview_BO3.png/revision/latest?cb=20200804022135",
        "mp_veiled": "https://static.wikia.nocookie.net/callofduty/images/e/ee/Fringe_Map_Preview_BO3.png/revision/latest?cb=20200804015814",
        "mp_nuketown_x": "https://static.wikia.nocookie.net/callofduty/images/e/ef/Nuk3town_menu_icon_BO3.jpg/revision/latest?cb=20180523201916",
        "mp_crucible": "https://static.wikia.nocookie.net/callofduty/images/7/79/Gauntlet_Loading_Screen_BO3.png/revision/latest?cb=20160131214452",
        "mp_rise": "https://static.wikia.nocookie.net/callofduty/images/7/79/Rise_Loading_Screen_BO3.png/revision/latest?cb=20160131214729",
        "mp_skyjacked": "https://static.wikia.nocookie.net/callofduty/images/4/4d/Skyjacked_menu_icon_BO3.jpg/revision/latest?cb=20180523010428",
        "mp_waterpark": "https://static.wikia.nocookie.net/callofduty/images/e/e0/Splash_Loading_Screen_BO3.png/revision/latest?cb=20160131214058",
        "mp_aerospace": "https://static.wikia.nocookie.net/callofduty/images/4/47/Spire_menu_icon_BO3.jpg/revision/latest?cb=20180523013350",
        "mp_banzai": "https://static.wikia.nocookie.net/callofduty/images/1/12/Verge_menu_icon_BO3.jpg/revision/latest?cb=20180523011351",
        "mp_conduit": "https://static.wikia.nocookie.net/callofduty/images/5/59/Rift_menu_icon_BO3.jpg/revision/latest?cb=20180523205348",
        "mp_kung_fu": "https://static.wikia.nocookie.net/callofduty/images/6/6e/Knockout_menu_icon_BO3.jpg/revision/latest?cb=20180523012843",
        "mp_arena": "https://static.wikia.nocookie.net/callofduty/images/f/f9/Rumble_menu_icon_BO3.jpg/revision/latest?cb=20180311222050",
        "mp_cryogen": "https://static.wikia.nocookie.net/callofduty/images/d/da/Screen_Shot_2018-03-27_at_15.26.07.png/revision/latest?cb=20180401121336",
        "mp_rome": "https://static.wikia.nocookie.net/callofduty/images/8/80/Empire_Map_Icon_BOIII.jpg/revision/latest?cb=20160812181614",
        "mp_shrine": "https://static.wikia.nocookie.net/callofduty/images/f/fc/Screen_Shot_2018-04-01_at_13.43.54.png/revision/latest?cb=20180401124753",
        "mp_city": "https://static.wikia.nocookie.net/callofduty/images/0/0e/Rupture_BOIII.jpeg/revision/latest?cb=20160825190008",
        "mp_miniature": "https://static.wikia.nocookie.net/callofduty/images/e/e1/Micro_Loading_Screen_BO3.png/revision/latest?cb=20170612151647",
        "mp_ruins": "https://static.wikia.nocookie.net/callofduty/images/c/cc/Screen_Shot_2018-04-01_at_13.44.50.png/revision/latest?cb=20180401143041",
        "mp_western": "https://static.wikia.nocookie.net/callofduty/images/2/25/Outlaw_BOIII.jpeg/revision/latest?cb=20160825185938",
        "zm_zod": "https://static.wikia.nocookie.net/callofduty/images/1/14/Shadows_of_Evil_Menu_Selection_BO3.png/revision/latest/scale-to-width-down/1000?cb=20160923082206",
        "zm_castle": "https://static.wikia.nocookie.net/callofduty/images/e/e4/Der_Eisendrache_Menu_Selection_BO3.png/revision/latest/scale-to-width-down/1000?cb=20160923082230",
        "zm_island": "https://static.wikia.nocookie.net/callofduty/images/0/06/Zetsubou_No_Shima_Menu_Selection_BO3.png/revision/latest/scale-to-width-down/1000?cb=20160923082244",
        "zm_stalingrad": "https://static.wikia.nocookie.net/callofduty/images/7/72/Gorod_Krovi_Menu_Selection_BO3.png/revision/latest/scale-to-width-down/1000?cb=20160923082253",
        "zm_gensis": "https://static.wikia.nocookie.net/callofduty/images/d/de/Revelations_Menu_Selection_BO3.png/revision/latest/scale-to-width-down/1000?cb=20161007033102",
        "zm_cosmodrome": "https://static.wikia.nocookie.net/callofduty/images/d/d8/Ascension_Menu_Selection_BO3.png/revision/latest/scale-to-width-down/1000?cb=20170617042103",
        "zm_theater": "https://static.wikia.nocookie.net/callofduty/images/e/ec/Kino_Der_Toten_Menu_Selection_BO3.png/revision/latest/scale-to-width-down/1000?cb=20170617042116",
        "zm_moon": "https://static.wikia.nocookie.net/callofduty/images/4/4a/Moon_Menu_Selection_BO3.png/revision/latest/scale-to-width-down/1000?cb=20170617042150",
        "zm_prototype": "https://static.wikia.nocookie.net/callofduty/images/6/64/Nacht_Der_Untoten_Menu_Selection_BO3.png/revision/latest/scale-to-width-down/1000?cb=20170617042202",
        "zm_tomb": "https://static.wikia.nocookie.net/callofduty/images/0/09/Origins_Menu_Selection_BO3.png/revision/latest/scale-to-width-down/1000?cb=20170617042215",
        "zm_temple": "https://static.wikia.nocookie.net/callofduty/images/7/76/Shangri_La_Menu_Selection_BO3.png/revision/latest/scale-to-width-down/1000?cb=20170617042246",
        "zm_sumpf": "https://static.wikia.nocookie.net/callofduty/images/1/16/Shi_No_Numa_Menu_Selection_BO3.png/revision/latest/scale-to-width-down/1000?cb=20170617042257",
        "zm_factory": "https://static.wikia.nocookie.net/callofduty/images/4/4d/The_Giant_Menu_Selection_BO3.png/revision/latest/scale-to-width-down/1000?cb=20160923082219",
        "zm_asylum": "https://static.wikia.nocookie.net/callofduty/images/e/e4/Verruckt_Menu_Selection_BO3.png/revision/latest/scale-to-width-down/1000?cb=20170617042321"
    },
    "SHG1": {
        "mp_refraction": "https://static.wikia.nocookie.net/callofduty/images/a/a5/Ascend_loading_screen_AW.png/revision/latest?cb=20150402170105",
        "mp_lab2": "https://static.wikia.nocookie.net/callofduty/images/e/e7/Bio_Lab_loading_screen_AW.png/revision/latest?cb=20150402164955",
        "mp_comeback": "https://static.wikia.nocookie.net/callofduty/images/a/a3/Comeback_loading_screen_AW.png/revision/latest?cb=20150402170220",
        "mp_laser2": "https://static.wikia.nocookie.net/callofduty/images/c/c2/Defender_Map_AW.png/revision/latest?cb=20150125135028",
        "mp_detroit": "https://static.wikia.nocookie.net/callofduty/images/c/cb/Detroit_Map_AW.png/revision/latest?cb=20150125135608",
        "mp_greenband": "https://static.wikia.nocookie.net/callofduty/images/6/63/Greenband_loading_screen_AW.png/revision/latest?cb=20150402170141",
        "mp_levity": "https://static.wikia.nocookie.net/callofduty/images/7/76/Horizon_loading_screen_AW.png/revision/latest?cb=20150402165803",
        "mp_instinct": "https://static.wikia.nocookie.net/callofduty/images/7/73/Instinct_Map_AW.png/revision/latest?cb=20150125135946",
        "mp_recovery": "https://static.wikia.nocookie.net/callofduty/images/f/f1/Recovery_Map_AW.png/revision/latest?cb=20150125140230",
        "mp_venus": "https://static.wikia.nocookie.net/callofduty/images/a/aa/Retreat_loading_screen_AW.png/revision/latest?cb=20150402170027",
        "mp_prison": "https://static.wikia.nocookie.net/callofduty/images/2/2e/Riot_Map_AW.png/revision/latest?cb=20150125140554",
        "mp_solar": "https://static.wikia.nocookie.net/callofduty/images/6/65/Solar_Map_AW.png/revision/latest?cb=20150125140854",
        "mp_terrace": "https://static.wikia.nocookie.net/callofduty/images/1/10/Terrace_loading_screen_AW.png/revision/latest?cb=20150402165845",
        "mp_dam": "https://static.wikia.nocookie.net/callofduty/images/4/46/Atlas_Gorge_Map_AW.png/revision/latest?cb=20150125134232",
        "mp_spark": "https://static.wikia.nocookie.net/callofduty/images/2/20/Chop_Shop_Environment_AW.png/revision/latest?cb=20150429185159",
        "mp_climate_3": "https://static.wikia.nocookie.net/callofduty/images/8/85/Climate_Environment_AW.png/revision/latest?cb=20150429183851",
        "mp_sector17": "https://static.wikia.nocookie.net/callofduty/images/e/ea/Compound_Promo_AW.png/revision/latest?cb=20150526191037",
        "mp_lost": "https://static.wikia.nocookie.net/callofduty/images/7/7a/Core_Environment_AW.jpg/revision/latest?cb=20150116234301",
        "mp_torqued": "https://static.wikia.nocookie.net/callofduty/images/2/2a/Drift_Environment_AW.jpg/revision/latest?cb=20150116234625",
        "mp_fracture": "https://static.wikia.nocookie.net/callofduty/images/5/58/Fracture_Loading_Screen_AW.png/revision/latest?cb=20161128124952",
        "mp_kremlin": "https://static.wikia.nocookie.net/callofduty/images/9/99/Kremlin_Loading_Screen_AW.png/revision/latest?cb=20161128125546",
        "mp_lair": "https://static.wikia.nocookie.net/callofduty/images/f/f2/Overload_Loading_Screen_AW.png/revision/latest?cb=20161128115756",
        "mp_bigben2": "https://static.wikia.nocookie.net/callofduty/images/4/46/Parliament_Loading_Screen_AW.png/revision/latest?cb=20161128125556",
        "mp_perplex_1": "https://static.wikia.nocookie.net/callofduty/images/d/d9/Perplex_Environment_AW.png/revision/latest?cb=20150429181437",
        "mp_liberty": "https://static.wikia.nocookie.net/callofduty/images/7/7c/Quarantine_Loading_Screen_AW.png/revision/latest?cb=20160214220724",
        "mp_clowntown3": "https://static.wikia.nocookie.net/callofduty/images/4/45/Sideshow_Environment_AW.jpg/revision/latest?cb=20150116234923",
        "mp_blackbox": "https://static.wikia.nocookie.net/callofduty/images/1/14/Site_244_Environment_AW.png/revision/latest?cb=20150429183525",
        "mp_highrise2": "https://static.wikia.nocookie.net/callofduty/images/d/db/Skyrise_Loading_Screen_AW.png/revision/latest?cb=20161128125606",
        "mp_seoul2": "https://static.wikia.nocookie.net/callofduty/images/e/e2/Swarm_artwork_AW.png/revision/latest?cb=20150727184217",
        "mp_urban": "https://static.wikia.nocookie.net/callofduty/images/5/52/Urban_Environment_AW.jpg/revision/latest?cb=20150116235245",
        "mp_zombie_ark": "https://static.wikia.nocookie.net/callofduty/images/d/db/Outbreak_Environment_AW.jpg/revision/latest?cb=20150116235718",
        "mp_zombie_brg": "https://static.wikia.nocookie.net/callofduty/images/2/2e/Infection_environment_AW.jpg/revision/latest?cb=20150318181252",
        "mp_zombie_h2o": "https://static.wikia.nocookie.net/callofduty/images/b/bd/Carrier_Ingame_Icon_AW.jpg/revision/latest?cb=20180805025428",
        "mp_zombie_lab": "https://static.wikia.nocookie.net/callofduty/images/d/d9/ExoZombies_Descent_AW.jpg/revision/latest?cb=20150803181055"
    },
    "CSGO": {
        "ar_baggage": "https://static.wikia.nocookie.net/cswikia/images/3/35/Csgo_ar_baggage.png/revision/latest/scale-to-width-down/1000?cb=20120422195558",
        "ar_dizzy": "https://static.wikia.nocookie.net/cswikia/images/2/20/Ar_dizzy_thumbnail.jpg/revision/latest/scale-to-width-down/1000?cb=20170610032801",
        "ar_lunacy": "https://static.wikia.nocookie.net/cswikia/images/c/ca/Ar_lunacy.png/revision/latest/scale-to-width-down/1000?cb=20191119180902",
        "ar_monastery": "https://static.wikia.nocookie.net/cswikia/images/e/e1/Ar_monastery.png/revision/latest/scale-to-width-down/1000?cb=20201203223644",
        "ar_shoots": "https://static.wikia.nocookie.net/cswikia/images/2/23/Shoots-overview.png/revision/latest/scale-to-width-down/1000?cb=20210831221835",
        "cs_agency": "https://static.wikia.nocookie.net/cswikia/images/c/c7/Cs_agency_thumbnail.jpg/revision/latest/scale-to-width-down/1000?cb=20170610042527",
        "cs_assault": "https://static.wikia.nocookie.net/cswikia/images/0/00/Cs_assault_go.png/revision/latest/scale-to-width-down/1000?cb=20140819095651",
        "cs_italy": "https://static.wikia.nocookie.net/cswikia/images/2/2c/Cs_italy_csgo.png/revision/latest/scale-to-width-down/1000?cb=20140819100829",
        "cs_militia": "https://static.wikia.nocookie.net/cswikia/images/2/2b/Csgo_militia_pic1.jpg/revision/latest/scale-to-width-down/1000?cb=20190123130803",
        "cs_office": "https://static.wikia.nocookie.net/cswikia/images/f/f7/Csgo-cs-office.png/revision/latest/scale-to-width-down/1000?cb=20140820132335",
        "de_ancient": "https://static.wikia.nocookie.net/cswikia/images/9/94/De_ancient.png/revision/latest/scale-to-width-down/1000?cb=20201204072600",
        "de_bank": "https://static.wikia.nocookie.net/cswikia/images/a/a9/Csgo-de-bank.png/revision/latest/scale-to-width-down/1000?cb=20140820131729",
        "de_cache": "https://static.wikia.nocookie.net/cswikia/images/5/5b/De_cache.png/revision/latest/scale-to-width-down/1000?cb=20200415102625",
        "de_calavera": "https://static.wikia.nocookie.net/cswikia/images/2/24/EozeThnXYAouxrf.jpg/revision/latest/scale-to-width-down/1000?cb=20210116194812",
        "de_canals": "https://static.wikia.nocookie.net/cswikia/images/5/56/De_canals_thumbnail.jpg/revision/latest/scale-to-width-down/1000?cb=20170316114745",
        "de_cbble": "https://static.wikia.nocookie.net/cswikia/images/f/f1/De_cbble_loading_screen.jpg/revision/latest/scale-to-width-down/1000?cb=20210828112634",
        "de_dust2": "https://static.wikia.nocookie.net/cswikia/images/4/42/Dust2_asite1.png/revision/latest/scale-to-width-down/1000?cb=20211006143721",
        "de_grind": "https://static.wikia.nocookie.net/cswikia/images/d/da/Csgo_grind_map.jpg/revision/latest/scale-to-width-down/1000?cb=20210515220952",
        "de_inferno": "https://static.wikia.nocookie.net/cswikia/images/f/f0/Inferno.jpg/revision/latest/scale-to-width-down/1000?cb=20161014013320",
        "de_lake": "https://static.wikia.nocookie.net/cswikia/images/0/08/Csgo-de-lake.png/revision/latest/scale-to-width-down/1000?cb=20140820130934",
        "de_mirage": "https://static.wikia.nocookie.net/cswikia/images/1/1e/CSGO_Mirage_latest_version.jpg/revision/latest/scale-to-width-down/1000?cb=20200301201524",
        "de_mocha": "https://static.wikia.nocookie.net/cswikia/images/0/0b/Csgo_map_Mocha.jpg/revision/latest/scale-to-width-down/1000?cb=20210519213544",
        "de_nuke": "https://static.wikia.nocookie.net/cswikia/images/9/93/CSGO_Nuke_22_Nov_2019_update_picture_1.jpg/revision/latest/scale-to-width-down/1000?cb=20210903110157",
        "de_overpass": "https://static.wikia.nocookie.net/cswikia/images/6/6e/Csgo-de-overpass.png/revision/latest/scale-to-width-down/1000?cb=20140820130544",
        "de_pitstop": "https://static.wikia.nocookie.net/cswikia/images/c/c6/Csgo_map_Pitstop.jpg/revision/latest/scale-to-width-down/1000?cb=20210526194248",
        "de_safehouse": "https://static.wikia.nocookie.net/cswikia/images/2/27/Csgo-de-safehouse.png/revision/latest/scale-to-width-down/1000?cb=20140820130431",
        "de_shortdust": "https://static.wikia.nocookie.net/cswikia/images/7/70/Csgo-shortdust-mid.png/revision/latest/scale-to-width-down/1000?cb=20141113033209",
        "de_shortnuke": "https://static.wikia.nocookie.net/cswikia/images/8/8b/De_shortnuke.jpg/revision/latest/scale-to-width-down/1000?cb=20180421181417",
        "de_stmarc": "https://static.wikia.nocookie.net/cswikia/images/8/83/Stmarc_tspawn.png/revision/latest/scale-to-width-down/1000?cb=20210912141050",
        "de_sugarcane": "https://static.wikia.nocookie.net/cswikia/images/c/c7/Csgo-de-sugarcane.png/revision/latest/scale-to-width-down/1000?cb=20140820125612",
        "de_train": "https://static.wikia.nocookie.net/cswikia/images/4/4a/De_train_thumbnail.png/revision/latest/scale-to-width-down/1000?cb=20181004200630",
        "de_vertigo": "https://static.wikia.nocookie.net/cswikia/images/a/a5/Vertigo-b-site-overview.png/revision/latest/scale-to-width-down/1000?cb=20210901105128",
        "dz_blacksite": "https://static.wikia.nocookie.net/cswikia/images/c/c1/Dz_blacksite.png/revision/latest/scale-to-width-down/1000?cb=20201203223002",
        "dz_frostbite": "https://static.wikia.nocookie.net/cswikia/images/c/c6/Dz_frostbite.png/revision/latest/scale-to-width-down/1000?cb=20211025085227",
        "dz_sirocco": "https://static.wikia.nocookie.net/cswikia/images/7/7f/Sirocco-center.png/revision/latest/scale-to-width-down/1000?cb=20211020085720"
    }
};
