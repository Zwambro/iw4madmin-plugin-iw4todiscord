var plugin = {
    author: 'Zwambro',
    version: 1.0,
    name: 'Plugin to send certain IW4MAdmin events to discord',

    // 
    bans_webhook: "PAST_YOUR_BANS_CHANNEL_WEBHOOK_HERE",
    reports_webhook: "PAST_YOUR_REPORTS_CHANNEL_WEBHOOK_HERE",
    serverstatus_webhook: "PAST_YOUR_SERVERS-STATUS_CHANNEL_WEBHOOK_HERE",

    // Enable or disable ban/kick/tempban/unban events
    enableBans: true,

    // Enable or disable Report event
    enableReports: true,

    // Enable or disable servers status
    enableServersStatus: true,

    manager: null,
    logger: null,


    sendBansWebHook: function (embed) {
        try {
            var params = {
                "embeds": [embed]
            }
            var client1 = new System.Net.Http.HttpClient();
            var result1 = client1.PostAsync(this.bans_webhook, new System.Net.Http.StringContent(JSON.stringify(params), System.Text.Encoding.UTF8, "application/json")).Result;
            var resCl1 = result1.Content;
            resCl1.Dispose();
            result1.Dispose();
            client1.Dispose();
        } catch (e) {
            this.logger.WriteWarning('There was a problem sending this webhook: ' + e.message);
        }
    },

    sendReportsWebHook: function (embed) {
        try {
            var params = {
                "embeds": [embed]
            }
            var client1 = new System.Net.Http.HttpClient();
            var result1 = client1.PostAsync(this.reports_webhook, new System.Net.Http.StringContent(JSON.stringify(params), System.Text.Encoding.UTF8, "application/json")).Result;
            var resCl1 = result1.Content;
            resCl1.Dispose();
            result1.Dispose();
            client1.Dispose();
        } catch (e) {
            this.logger.WriteWarning('There was a problem sending this webhook: ' + e.message);
        }
    },

    sendServersStatusWebHook: function (embed) {
        try {
            var params = {
                "embeds": [embed]
            }
            var client1 = new System.Net.Http.HttpClient();
            var result1 = client1.PostAsync(this.serverstatus_webhook, new System.Net.Http.StringContent(JSON.stringify(params), System.Text.Encoding.UTF8, "application/json")).Result;
            var resCl1 = result1.Content;
            resCl1.Dispose();
            result1.Dispose();
            client1.Dispose();
        } catch (e) {
            this.logger.WriteWarning('There was a problem sending this webhook: ' + e.message);
        }
    },

    getMapThumb: function (server) {
        var iconUrl = "";

        if (server.GameName === 1) {
            if (server.CurrentMap.Name == "mp_convoy") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/3/3c/Bare_Load_Screen_Ambush_CoD4.jpg/revision/latest/scale-to-width-down/1000?cb=20100723075603';
            } else if (server.CurrentMap.Name == "mp_backlot") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/0/0f/Backlot_loadscreen_CoD4.jpg/revision/latest/scale-to-width-down/1000?cb=20100723075613';
            } else if (server.CurrentMap.Name == "mp_bloc") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/9/9d/Bare_Load_Screen_Bloc_CoD4.jpg/revision/latest/scale-to-width-down/1000?cb=20100723075638';
            } else if (server.CurrentMap.Name == "mp_bog") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/2/29/Bog_Map_Image_CoD4.jpg/revision/latest?cb=20100723075648';
            } else if (server.CurrentMap.Name == "mp_countdown") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/e/e9/Bare_Load_Screen_Countdown_CoD4.jpg/revision/latest?cb=20100723075829';
            } else if (server.CurrentMap.Name == "mp_crash") {
                iconUrl = 'https://www.gamegrin.com/assets/Uploads/_resampled/resizedimage640400-Bare-Load-Screen-Crash-CoD4.jpg';
            } else if (server.CurrentMap.Name == "mp_crossfire") {
                iconUrl = 'https://www.gamegrin.com/assets/Uploads/_resampled/resizedimage640360-Cod4-map-crossfire.jpg';
            } else if (server.CurrentMap.Name == "mp_citystreets") {
                iconUrl = 'https://www.gamegrin.com/assets/Uploads/_resampled/resizedimage640360-Cod4-map-district.jpg';
            } else if (server.CurrentMap.Name == "mp_farm") {
                iconUrl = 'https://www.gamegrin.com/assets/Uploads/_resampled/resizedimage640400-Bare-Load-Screen-Downpour-CoD4.jpg';
            } else if (server.CurrentMap.Name == "mp_overgrown") {
                iconUrl = 'https://www.gamegrin.com/assets/Uploads/_resampled/resizedimage640400-Bare-Load-Screen-Overgrown-CoD4.jpg';
            } else if (server.CurrentMap.Name == "mp_pipeline") {
                iconUrl = 'https://www.gamegrin.com/assets/Uploads/_resampled/resizedimage640360-Cod4-map-pipeline.jpg';
            } else if (server.CurrentMap.Name == "mp_shipment") {
                iconUrl = 'https://www.gamegrin.com/assets/Uploads/_resampled/resizedimage640360-Shipment-Load.jpg';
            } else if (server.CurrentMap.Name == "mp_showdown") {
                iconUrl = 'https://www.gamegrin.com/assets/Uploads/_resampled/resizedimage640360-Showdown-MWR.jpg';
            } else if (server.CurrentMap.Name == "mp_strike") {
                iconUrl = 'https://www.gamegrin.com/assets/Uploads/_resampled/resizedimage640400-Cod4-map-strike.jpg';
            } else if (server.CurrentMap.Name == "mp_vacant") {
                iconUrl = 'https://www.gamegrin.com/assets/Uploads/_resampled/resizedimage640360-Cod4-map-vacant.jpg';
            } else if (server.CurrentMap.Name == "mp_cargoship") {
                iconUrl = 'https://www.gamegrin.com/assets/Uploads/_resampled/resizedimage640400-Cod4-map-wetwork.jpg';
            } else if (server.CurrentMap.Name == "mp_crash_snow") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/f/f7/Bare_Load_Screen_Winter_Crash_CoD4.jpg/revision/latest/scale-to-width-down/1000?cb=20100723080720';
            } else if (server.CurrentMap.Name == "mp_broadcast") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/e/ec/Broadcast_loading_screen_CoD4.jpg/revision/latest/scale-to-width-down/1000?cb=20100723080927';
            } else if (server.CurrentMap.Name == "mp_creek") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/e/e1/CreekCOD4.jpg/revision/latest/scale-to-width-down/1000?cb=20100723075941';
            } else if (server.CurrentMap.Name == "mp_carentan") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/0/0c/ChinatownCOD4.jpg/revision/latest/scale-to-width-down/1000?cb=20110727174233';
            } else if (server.CurrentMap.Name == "mp_killhouse") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/4/48/Cod4-killhouse.jpg/revision/latest/scale-to-width-down/1000?cb=20100723081127';
            } else {
                iconUrl = "https://cdn0.iconfinder.com/data/icons/flat-design-basic-set-1/24/error-exclamation-512.png";
            }
        } else if (server.GameName === 2) {
            if (server.CurrentMap.Name == "mp_rust") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/3/33/Rust.jpg/revision/latest/scale-to-width-down/1000?cb=20100720174413';
            } else if (server.CurrentMap.Name == "mp_terminal") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/1/14/Bare_Load_Screen_Terminal_MW2.jpg/revision/latest/scale-to-width-down/1000?cb=20100720174519';
            } else if (server.CurrentMap.Name == "mp_crash") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/9/9f/Bare_Load_Screen_Crash_MW2.jpg/revision/latest/scale-to-width-down/1000?cb=20100613115705';
            } else if (server.CurrentMap.Name == "mp_afghan") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/8/83/Afghan_loading_screen_MW2.png/revision/latest/scale-to-width-down/640?cb=20130310131229';
            } else if (server.CurrentMap.Name == "mp_derail") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/2/20/Derail.jpg/revision/latest/scale-to-width-down/1000?cb=20100720174408';
            } else if (server.CurrentMap.Name == "mp_estate") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/9/91/Estate.jpg/revision/latest/scale-to-width-down/1000?cb=20100720174409';
            } else if (server.CurrentMap.Name == "mp_favela") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/2/29/Favela_Map_MW2.jpg/revision/latest/scale-to-width-down/1000?cb=20100720174410';
            } else if (server.CurrentMap.Name == "mp_highrise") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/4/49/Highrise-promo.jpg/revision/latest/scale-to-width-down/1000?cb=20100720174411';
            } else if (server.CurrentMap.Name == "mp_invasion") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/9/95/Invasion_MW2.jpg/revision/latest/scale-to-width-down/1000?cb=20100720174410';
            } else if (server.CurrentMap.Name == "mp_checkpoint") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/9/9f/Karachi-prev.jpg/revision/latest/scale-to-width-down/1000?cb=20100720174412';
            } else if (server.CurrentMap.Name == "mp_quarry") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/8/8a/Loadscreen_mp_quarry.jpg/revision/latest/scale-to-width-down/1000?cb=20091207173135';
            } else if (server.CurrentMap.Name == "mp_rundown") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/3/3a/Rundown-prev.jpg/revision/latest/scale-to-width-down/1000?cb=20100720174412';
            } else if (server.CurrentMap.Name == "mp_boneyard") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/e/ef/Scrapyard.jpg/revision/latest/scale-to-width-down/1000?cb=20100720174413';
            } else if (server.CurrentMap.Name == "mp_nightshift") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/d/d2/Skidrow.jpg/revision/latest/scale-to-width-down/1000?cb=20100720174516';
            } else if (server.CurrentMap.Name == "mp_subbase") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/1/1e/Sub_Base.jpg/revision/latest/scale-to-width-down/1000?cb=20100720174517';
            } else if (server.CurrentMap.Name == "mp_underpass") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/b/b5/Underpass.jpg/revision/latest/scale-to-width-down/1000?cb=20100720174519';
            } else if (server.CurrentMap.Name == "mp_brecourt") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/c/cc/Wasteland.jpg/revision/latest/scale-to-width-down/1000?cb=20100720174520';
            } else if (server.CurrentMap.Name == "mp_overgrown") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/7/7d/Bare_Load_Screen_Overgrown_CoD4.jpg/revision/latest/scale-to-width-down/1000?cb=20110727174104';
            } else if (server.CurrentMap.Name == "mp_strike") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/b/b0/Loadscreen_mp_strike.jpg/revision/latest/scale-to-width-down/1000?cb=20100712195725';
            } else if (server.CurrentMap.Name == "mp_vacant") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/6/67/Loadscreen_mp_vacant.jpg/revision/latest/scale-to-width-down/1000?cb=20100712195617';
            } else if (server.CurrentMap.Name == "mp_abandon") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/c/c3/Carnival_loadscreen.jpg/revision/latest/scale-to-width-down/1000?cb=20100712195429';
            } else if (server.CurrentMap.Name == "mp_trailerpark") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/c/cf/Trailer_Park.jpg/revision/latest/scale-to-width-down/1000?cb=20100712195448';
            } else if (server.CurrentMap.Name == "mp_fuel2") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/d/de/Fuel_loadscreen.jpg/revision/latest/scale-to-width-down/1000?cb=20100712195521';
            } else if (server.CurrentMap.Name == "mp_storm") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/6/60/MW2_Storm.jpg/revision/latest/scale-to-width-down/1000?cb=20100613115722';
            } else if (server.CurrentMap.Name == "mp_complex") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/0/0e/MW2_Bailout.jpg/revision/latest/scale-to-width-down/1000?cb=20100613115812';
            } else if (server.CurrentMap.Name == "mp_compact") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/d/d7/MW2_Salvage.jpg/revision/latest/scale-to-width-down/1000?cb=20100613115824';
            } else if (server.CurrentMap.Name == "mp_nuked") {
                iconUrl = 'https://i.ytimg.com/vi/ysr0CyyJx8E/maxresdefault.jpg';
            } else if (server.CurrentMap.Name == "iw4_credits") {
                iconUrl = 'https://i.ytimg.com/vi/VniF3DnE5uk/maxresdefault.jpg';
            } else if (server.CurrentMap.Name == "mp_killhouse") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/4/48/Cod4-killhouse.jpg/revision/latest/scale-to-width-down/1000?cb=20100723081127';
            } else if (server.CurrentMap.Name == "mp_bog_sh") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/2/29/Bog_Map_Image_CoD4.jpg/revision/latest/scale-to-width-down/1000?cb=20100723075648';
            } else if (server.CurrentMap.Name == "mp_cargoship_sh") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/d/d4/Cargo_loadscreen_BOII.png/revision/latest/scale-to-width-down/1000?cb=20130120072815';
            } else if (server.CurrentMap.Name == "mp_cargoship") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/d/d4/Cargo_loadscreen_BOII.png/revision/latest/scale-to-width-down/1000?cb=20130120072815';
            } else if (server.CurrentMap.Name == "mp_shipment") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/9/9b/Shipment_Load.jpg/revision/latest/scale-to-width-down/1000?cb=20100723080524';
            } else if (server.CurrentMap.Name == "mp_shipment_long") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/9/9b/Shipment_Load.jpg/revision/latest/scale-to-width-down/1000?cb=20100723080524';
            } else if (server.CurrentMap.Name == "mp_rust_long") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/3/33/Rust.jpg/revision/latest/scale-to-width-down/1000?cb=20100720174413';
            } else if (server.CurrentMap.Name == "mp_firingrange") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/8/82/Bare_Load_Screen_Firing_Range_BO.jpg/revision/latest/scale-to-width-down/1000?cb=20110303121918';
            } else if (server.CurrentMap.Name == "mp_storm_spring") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/6/60/MW2_Storm.jpg/revision/latest/scale-to-width-down/1000?cb=20100613115722';
            } else if (server.CurrentMap.Name == "mp_fav_tropical") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/2/29/Favela_Map_MW2.jpg/revision/latest/scale-to-width-down/1000?cb=20100720174410';
            } else if (server.CurrentMap.Name == "mp_estate_tropical") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/9/91/Estate.jpg/revision/latest/scale-to-width-down/1000?cb=20100720174409';
            } else if (server.CurrentMap.Name == "mp_crash_tropical") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/9/9f/Bare_Load_Screen_Crash_MW2.jpg/revision/latest/scale-to-width-down/1000?cb=20100613115705';
            } else if (server.CurrentMap.Name == "mp_bloc_sh") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/9/9d/Bare_Load_Screen_Bloc_CoD4.jpg/revision/latest/scale-to-width-down/1000?cb=20100723075638';
            } else if (server.CurrentMap.Name == "mp_cross_fire") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/5/53/Cod4_map_crossfire.jpg/revision/latest/scale-to-width-down/1000?cb=20100723075954';
            } else if (server.CurrentMap.Name == "mp_bloc") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/9/9d/Bare_Load_Screen_Bloc_CoD4.jpg/revision/latest/scale-to-width-down/1000?cb=20100723075638';
            } else if (server.CurrentMap.Name == "oilrig") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/3/30/Mg_oilrig.jpg/revision/latest/scale-to-width-down/480?cb=20120716172859';
            } else if (server.CurrentMap.Name == "co_hunted") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/f/f4/Bare_Load_Screen_Village_MW3.png/revision/latest/scale-to-width-down/1000?cb=20120320235505';
            } else {
                iconUrl = "https://cdn0.iconfinder.com/data/icons/flat-design-basic-set-1/24/error-exclamation-512.png";
            }
        } else if (server.GameName === 3) {
            if (server.CurrentMap.Name == "mp_seatown") {
                iconUrl = "https://static.wikia.nocookie.net/callofduty/images/a/a7/Bare_Load_Screen_Seatown_MW3.png/revision/latest/scale-to-width-down/1000?cb=20120320235504";
            } else if (server.CurrentMap.Name == "mp_alpha") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/a/a6/Lockdown_loading_screen_MW3.PNG/revision/latest/scale-to-width-down/1000?cb=20130728192041';
            } else if (server.CurrentMap.Name == "mp_bravo") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/2/20/Bare_Load_Screen_Mission_MW3.png/revision/latest/scale-to-width-down/1000?cb=20120320235416';
            } else if (server.CurrentMap.Name == "mp_carbon") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/c/c8/Bare_Load_Screen_Carbon_MW3.png/revision/latest?cb=20120320235417';
            } else if (server.CurrentMap.Name == "mp_dome") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/f/f1/Bare_Load_Screen_Dome_MW3.png/revision/latest/scale-to-width-down/1000?cb=20120320235417';
            } else if (server.CurrentMap.Name == "mp_plaza2") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/6/65/Bare_Loading_Screen_Arkaden_MW3.png/revision/latest/scale-to-width-down/1000?cb=20120519230749';
            } else if (server.CurrentMap.Name == "mp_exchange") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/5/52/Bare_Load_Screen_Downturn_MW3.png/revision/latest?cb=20120320235418';
            } else if (server.CurrentMap.Name == "mp_bootleg") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/5/52/Bare_Load_Screen_Downturn_MW3.png/revision/latest?cb=20120320235418';
            } else if (server.CurrentMap.Name == "mp_hardhat") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/5/5a/Bare_Load_Screen_Hardhat_MW3.png/revision/latest?cb=20120519225919';
            } else if (server.CurrentMap.Name == "mp_interchange") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/4/4b/Bare_Load_Screen_Interchange_MW3.png/revision/latest?cb=20120320235418';
            } else if (server.CurrentMap.Name == "mp_lambeth") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/d/d8/Bare_Loading_Screen_Fallen_MW3.png/revision/latest?cb=20120320235419';
            } else if (server.CurrentMap.Name == "mp_radar") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/3/3c/Bare_Load_Screen_Outpost_MW3.png/revision/latest?cb=20120320235504';
            } else if (server.CurrentMap.Name == "mp_mogadishu") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/3/39/Bare_Load_Screen_Bakaara_MW3.png/revision/latest?cb=20120320235502';
            } else if (server.CurrentMap.Name == "mp_paris") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/f/fe/Bare_Load_Screen_Resistance_MW3.png/revision/latest?cb=20120320235503';
            } else if (server.CurrentMap.Name == "mp_underground") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/0/09/Bare_Load_Screen_Underground_MW3.png/revision/latest?cb=20120320235504';
            } else if (server.CurrentMap.Name == "mp_village") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/f/f4/Bare_Load_Screen_Village_MW3.png/revision/latest?cb=20120320235505';
            } else if (server.CurrentMap.Name == "mp_aground_ss") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/3/31/Sideview_Aground_MW3.jpg/revision/latest?cb=20120512095024';
            } else if (server.CurrentMap.Name == "mp_boardwalk") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/2/2c/Boardwalk_loadscreen_MW3.png/revision/latest?cb=20140411094526';
            } else if (server.CurrentMap.Name == "mp_burn_ss") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/d/d0/U-Turn_loadscreen_MW3.png/revision/latest?cb=20140411095015';
            } else if (server.CurrentMap.Name == "mp_cement") {
                iconUrl = "https://static.wikia.nocookie.net/callofduty/images/0/0f/Foundation_loadscreen_MW3.png/revision/latest?cb=20140411095546";
            } else if (server.CurrentMap.Name == "mp_courtyard_ss") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/4/46/Main_Statue_Erosion_MW3.jpg/revision/latest?cb=20120512094647';
            } else if (server.CurrentMap.Name == "mp_crosswalk_ss") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/d/dd/Intersection_loadscreen_MW3.png/revision/latest?cb=20140411100832';
            } else if (server.CurrentMap.Name == "mp_hillside_ss") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/1/1f/Bare_Load_Screen_Getaway_MW3.jpg/revision/latest?cb=20120512095322';
            } else if (server.CurrentMap.Name == "mp_italy") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/3/38/Bare_Load_Screen_Piazza_MW3.jpg/revision/latest?cb=20120110185200';
            } else if (server.CurrentMap.Name == "mp_meteora") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/4/4b/Bare_Load_Screen_Sanctuary_MW3.jpg/revision/latest?cb=20120410173611';
            } else if (server.CurrentMap.Name == "mp_moab") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/3/30/Bridge_Gulch_MW3.jpg/revision/latest?cb=20120802172028';
            } else if (server.CurrentMap.Name == "mp_morningwood") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/d/d1/Bare_Load_Screen_Black_Box_MW3.jpg/revision/latest?cb=20120309203305';
            } else if (server.CurrentMap.Name == "mp_nola") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/a/aa/Missiles_Parish_MW3.jpg/revision/latest?cb=20120802172330';
            } else if (server.CurrentMap.Name == "mp_overwatch") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/3/35/Bare_Load_Screen_Overwatch_MW3.jpg/revision/latest?cb=20120207181435';
            } else if (server.CurrentMap.Name == "mp_park") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/e/e8/Bare_Load_Screen_Liberation_MW3.png/revision/latest?cb=20120120153252';
            } else if (server.CurrentMap.Name == "mp_qadeem") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/c/c1/Bare_Load_Screen_Oasis_MW3.jpg/revision/latest?cb=20120512100009';
            } else if (server.CurrentMap.Name == "mp_restrepo_ss") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/2/28/Bare_Load_Screen_Lookout_MW3.jpg/revision/latest?cb=20120512095607';
            } else if (server.CurrentMap.Name == "mp_roughneck") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/2/2d/Crane_Off_Shore_MW3.jpg/revision/latest?cb=20120712172115';
            } else if (server.CurrentMap.Name == "mp_shipbreaker") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/4/4f/Bare_ELITE_Calendar_Decommission_MW3.jpg/revision/latest?cb=20120802171643';
            } else if (server.CurrentMap.Name == "mp_six_ss") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/2/2a/Bare_ELITE_Calendar_Vortex_MW3.jpg/revision/latest?cb=20120624135437';
            } else if (server.CurrentMap.Name == "mp_terminal_cls") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/6/68/Terminal_Loading_Screen_MW3.png/revision/latest?cb=20120826091508';
            } else if (server.CurrentMap.Name == "mp_highrise") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/4/49/Highrise-promo.jpg/revision/latest?cb=20100720174411';
            } else {
                iconUrl = "https://cdn0.iconfinder.com/data/icons/flat-design-basic-set-1/24/error-exclamation-512.png";
            }
        } else if (server.GameName === 4) {
            if (server.CurrentMap.Name == "mp_prisonbreak") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/a/a6/Prison_Break_CoDG.jpg/revision/latest?cb=20160123214305';
            } else if (server.CurrentMap.Name == "mp_dart") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/b/be/Octane_Menu_Icon_CoDG.jpg/revision/latest?cb=20160222225028';
            } else if (server.CurrentMap.Name == "mp_lonestar") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/2/23/Tremor_Menu_Icon_CoDG.jpg/revision/latest?cb=20160222233807';
            } else if (server.CurrentMap.Name == "mp_frag") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/e/e4/Freight_Menu_Icon_CoDG.jpg/revision/latest?cb=20160222225820';
            } else if (server.CurrentMap.Name == "mp_snow") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/9/90/Whiteout_Menu_Icon_CoDG.jpg/revision/latest?cb=20160222234606';
            } else if (server.CurrentMap.Name == "mp_fahrenheit") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/a/aa/Stormfront_Menu_Icon_CoDG.jpg/revision/latest?cb=20160222233307';
            } else if (server.CurrentMap.Name == "mp_hashima") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/c/c3/Siege_Menu_Icon_CoDG.jpg/revision/latest?cb=20160222231338';
            } else if (server.CurrentMap.Name == "mp_warhawk") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/9/97/Warhawk_Menu_Icon_CoDG.jpg/revision/latest?cb=20160222234210';
            } else if (server.CurrentMap.Name == "mp_sovereign") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/d/de/Sovereign_Menu_Icon_CoDG.jpg/revision/latest?cb=20160222231915';
            } else if (server.CurrentMap.Name == "mp_zebra") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/8/86/Overlord_Menu_Icon_CoDG.jpg/revision/latest?cb=20160222230253';
            } else if (server.CurrentMap.Name == "mp_skeleton") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/b/b6/Stonehaven_Menu_Icon_CoDG.jpg/revision/latest?cb=20160222232822';
            } else if (server.CurrentMap.Name == "mp_chasm") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/f/fe/Chasm_Menu_Icon_CoDG.jpg/revision/latest?cb=20160222201016';
            } else if (server.CurrentMap.Name == "mp_flooded") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/5/56/Flooded_Menu_Icon_CoDG.jpg/revision/latest?cb=20160222225348';
            } else if (server.CurrentMap.Name == "mp_strikezone") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/0/02/Strikezone_Menu_Icon_CoDG.jpg/revision/latest?cb=20180514000159';
            } else if (server.CurrentMap.Name == "mp_descent_new") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/2/21/Free_Fall_Loading_Screen_CoDG.jpg/revision/latest?cb=20160219035443';
            } else if (server.CurrentMap.Name == "mp_dome_ns") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/8/83/Unearthed_Loading_Screen_CoDG.jpg/revision/latest?cb=20150618191214';
            } else if (server.CurrentMap.Name == "mp_ca_impact") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/7/77/Collision_Loading_Screen_CoDG.jpg/revision/latest?cb=20150618190921';
            } else if (server.CurrentMap.Name == "mp_ca_behemoth") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/4/4d/Behemoth_Loading_Screen_CoDG.jpg/revision/latest?cb=20150618190417';
            } else if (server.CurrentMap.Name == "mp_battery3") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/0/08/Ruins_Loading_Screen_CoDG.jpg/revision/latest?cb=20150618185226';
            } else if (server.CurrentMap.Name == "mp_dig") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/9/94/Pharaoh_Loading_Screen_CoDG.jpg/revision/latest?cb=20150618191459';
            } else if (server.CurrentMap.Name == "mp_favela_iw6") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/4/4b/Favela_Map_CoDG.jpg/revision/latest?cb=20150618192317';
            } else if (server.CurrentMap.Name == "mp_pirate") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/b/b3/Mutiny_Loading_Screen_CoDG.jpg/revision/latest?cb=20150618192100';
            } else if (server.CurrentMap.Name == "mp_zulu") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/1/14/Departed_Loading_Screen_CoDG.jpg/revision/latest?cb=20150618191721';
            } else if (server.CurrentMap.Name == "mp_conflict") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/c/cc/Dynasty_Menu_Icon_CoDG.jpg/revision/latest?cb=20160117004931';
            } else if (server.CurrentMap.Name == "mp_mine") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/9/9d/Goldrush_Nemesis_CoDG.jpg/revision/latest?cb=20160117231327';
            } else if (server.CurrentMap.Name == "mp_shipment_ns") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/f/f5/Showtime_Menu_Icon_CoDG.png/revision/latest?cb=20160117030703';
            } else if (server.CurrentMap.Name == "mp_zerosub") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/f/f2/Subzero_Nemesis_CoDG.jpg/revision/latest?cb=20160117230851';
            } else if (server.CurrentMap.Name == "mp_boneyard_ns") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/8/87/Ignition_Loading_Screen_CoDG.jpg/revision/latest?cb=20150618184639';
            } else if (server.CurrentMap.Name == "mp_ca_red_river") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/9/93/Containment_Loading_Screen_CoDG.jpg/revision/latest?cb=20150618184139';
            } else if (server.CurrentMap.Name == "mp_ca_rumble") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/2/2b/BayView_Loading_Screen_CoDG.jpg/revision/latest?cb=20150618183749';
            } else if (server.CurrentMap.Name == "mp_swamp") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/5/56/Fog_Loading_Screen_CoDG.jpg/revision/latest?cb=20150618183104';
            } else if (server.CurrentMap.Name == "mp_alien_town") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/a/a9/Point_of_Contact_loading_screen_CoDG.png/revision/latest?cb=20140818190238';
            } else if (server.CurrentMap.Name == "mp_alien_armory") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/3/3b/Nightfall_Screenshot_CoDG.jpg/revision/latest?cb=20170705221821';
            } else if (server.CurrentMap.Name == "mp_alien_beacon") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/f/f2/Mayday_CoDG.jpg/revision/latest?cb=20160117211635';
            } else if (server.CurrentMap.Name == "mp_alien_dlc3") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/5/52/CoDG_Invasion_Extinction_Awakening_o.jpg/revision/latest?cb=20140605021520';
            } else if (server.CurrentMap.Name == "mp_alien_last") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/d/db/Exodus_CoDG.jpg/revision/latest?cb=20160117203311';
            } else {
                iconUrl = "https://cdn0.iconfinder.com/data/icons/flat-design-basic-set-1/24/error-exclamation-512.png";
            }
        } else if (server.GameName === 5) {
            if (server.CurrentMap.Name == "mp_airfield") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/0/04/Airfield.jpg/revision/latest?cb=20100703083537';
            } else if (server.CurrentMap.Name == "mp_asylum") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/9/99/Asylum.jpg/revision/latest?cb=20100703075737';
            } else if (server.CurrentMap.Name == "mp_castle") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/e/e1/Castle.jpg/revision/latest?cb=20100703075702';
            } else if (server.CurrentMap.Name == "mp_shrine") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/b/b5/Cliffside.jpg/revision/latest?cb=20110702030241';
            } else if (server.CurrentMap.Name == "mp_courtyard") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/3/30/Courtyard.jpg/revision/latest?cb=20100703075822';
            } else if (server.CurrentMap.Name == "mp_dome") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/6/64/Dome.jpg/revision/latest?cb=20100703075919';
            } else if (server.CurrentMap.Name == "mp_downfall") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/0/03/Downfall_Loadscreen_WaW.png/revision/latest?cb=20121128143425';
            } else if (server.CurrentMap.Name == "mp_hangar") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/b/be/Hanger.jpg/revision/latest?cb=20100703080146';
            } else if (server.CurrentMap.Name == "mp_makin") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/f/fa/Makin.jpg/revision/latest?cb=20110710131317';
            } else if (server.CurrentMap.Name == "mp_outskirts") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/4/44/Outskirts.jpg/revision/latest?cb=20100703080341';
            } else if (server.CurrentMap.Name == "mp_roundhouse") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/2/25/Roundhouse.jpg/revision/latest?cb=20100703080407';
            } else if (server.CurrentMap.Name == "mp_suburban") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/f/fb/Upheaval.jpg/revision/latest?cb=20100703081123';
            } else if (server.CurrentMap.Name == "mp_kneedeep") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/d/d1/KneeDeepLoad.jpg/revision/latest?cb=20100703075448';
            } else if (server.CurrentMap.Name == "mp_nachtfeuer") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/7/73/Nightfire.jpg/revision/latest?cb=20100703081308';
            } else if (server.CurrentMap.Name == "mp_subway") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/6/6f/Station.jpg/revision/latest?cb=20100703081515';
            } else if (server.CurrentMap.Name == "mp_kwai") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/d/de/Banzaiscreenshot.jpg/revision/latest?cb=20100703081611';
            } else if (server.CurrentMap.Name == "mp_stalingrad") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/5/58/Corrosionscreenshot.jpg/revision/latest?cb=20100703081643';
            } else if (server.CurrentMap.Name == "mp_docks") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/5/50/Subpensscreenshot.jpg/revision/latest?cb=20100703081718';
            } else if (server.CurrentMap.Name == "mp_drum") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/3/30/Battery.jpg/revision/latest?cb=20100703081836';
            } else if (server.CurrentMap.Name == "mp_bgate") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/9/9e/Breach.jpg/revision/latest?cb=20100703082957';
            } else if (server.CurrentMap.Name == "mp_vodka") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/f/f3/Revolution.jpg/revision/latest?cb=20100703083210';
            } else {
                iconUrl = "https://cdn0.iconfinder.com/data/icons/flat-design-basic-set-1/24/error-exclamation-512.png";
            }
        } else if (server.GameName === 6) {
            if (server.CurrentMap.Name == "mp_array") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_berlinwall2") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_gridlock") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_cracked") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_crisis") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_discovery") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_drivein") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_firingrange") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_duga") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_area51") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_hanoi") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_cairo") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_golfcourse") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_hotel") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_havoc") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_kowloon") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_cosmodrome") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_nuked") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_radiation") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_silo") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_stadium") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_outskirts") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_mountain") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_villa") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_russianbase") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_zoo") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else {
                iconUrl = "https://cdn0.iconfinder.com/data/icons/flat-design-basic-set-1/24/error-exclamation-512.png";
            }
        } else if (server.GameName === 7) {
            if (server.CurrentMap.Name == "mp_la") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/b/ba/Aftermath_loading_screen_BOII.png/revision/latest?cb=20130125112538';
            } else if (server.CurrentMap.Name == "mp_dockside") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/d/d4/Cargo_loadscreen_BOII.png/revision/latest?cb=20130120072815';
            } else if (server.CurrentMap.Name == "mp_carrier") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/8/88/Carrier_loadscreen_BOII.png/revision/latest?cb=20121209072436';
            } else if (server.CurrentMap.Name == "mp_drone") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/5/5b/Drone_loadscreen_BOII.png/revision/latest?cb=20121209074205';
            } else if (server.CurrentMap.Name == "mp_express") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/d/d1/Express_Load_Screen_BOII.png/revision/latest?cb=20121209074544';
            } else if (server.CurrentMap.Name == "mp_hijacked") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/7/79/Hijacked_Load_Screen_BOII.png/revision/latest?cb=20121209075028';
            } else if (server.CurrentMap.Name == "mp_meltdown") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/9/92/Meltdown_Load_Screen_BOII.png/revision/latest?cb=20121209075341';
            } else if (server.CurrentMap.Name == "mp_overflow") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/8/80/Overflow_Load_Screen_BOII.png/revision/latest?cb=20121209075750';
            } else if (server.CurrentMap.Name == "mp_nightclub") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/7/74/Plaza_Load_Screen_BOII.png/revision/latest?cb=20130125112602';
            } else if (server.CurrentMap.Name == "mp_raid") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/2/29/Raid_Load_Screen_BOII.png/revision/latest?cb=20121209080157';
            } else if (server.CurrentMap.Name == "mp_slums") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/0/04/Slums_Load_Screen_BOII.png/revision/latest?cb=20121209080826';
            } else if (server.CurrentMap.Name == "mp_village") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/1/1f/Standoff_Load_Screen_BOII.png/revision/latest?cb=20121209080838';
            } else if (server.CurrentMap.Name == "mp_turbine") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/5/50/Turbine_Load_Screen_BOII.png/revision/latest?cb=20121209081207';
            } else if (server.CurrentMap.Name == "mp_socotra") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/6/6d/Yemen_Load_Screen_BOII.png/revision/latest?cb=20121209071959';
            } else if (server.CurrentMap.Name == "mp_nuketown_2020") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/0/03/Nuketown_2025_Load_Screen_BOII.png/revision/latest?cb=20121217102325';
            } else if (server.CurrentMap.Name == "mp_downhill") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/2/28/Downhill_In-Game.jpg/revision/latest?cb=20130201205402';
            } else if (server.CurrentMap.Name == "mp_mirage") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/d/d3/Mirage_loadscreen_BOII.png/revision/latest?cb=20140426185229';
            } else if (server.CurrentMap.Name == "mp_hydro") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/4/44/Hydro_In-Game.jpg/revision/latest?cb=20130201204341';
            } else if (server.CurrentMap.Name == "mp_skate") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/8/86/Grind_In-Game.jpg/revision/latest?cb=20130201203728';
            } else if (server.CurrentMap.Name == "mp_concert") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/4/4d/Encore_loadscreen_BOII.png/revision/latest?cb=20130905100408';
            } else if (server.CurrentMap.Name == "mp_magma") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/3/30/Magma_loadscreen_BOII.png/revision/latest?cb=20130905100136';
            } else if (server.CurrentMap.Name == "mp_vertigo") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/f/f6/Vertigo_loadscreen_BOII.png/revision/latest?cb=20130905095457';
            } else if (server.CurrentMap.Name == "mp_studio") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/1/1e/Studio_loadscreen_BOII.png/revision/latest?cb=20130905095718';
            } else if (server.CurrentMap.Name == "mp_uplink") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/f/fc/Uplink_loadscreen_BOII.png/revision/latest?cb=20130905095254';
            } else if (server.CurrentMap.Name == "mp_bridge") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/0/04/Detour_loadscreen_BOII.png/revision/latest?cb=20130905095021';
            } else if (server.CurrentMap.Name == "mp_castaway") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/e/ee/Cove_loadscreen_BOII.png/revision/latest?cb=20130905100640';
            } else if (server.CurrentMap.Name == "mp_paintball") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/2/2e/Rush_loadscreen_BOII.png/revision/latest?cb=20130905095938';
            } else if (server.CurrentMap.Name == "mp_dig") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/8/83/Dig_loadscreen_BOII.png/revision/latest?cb=20140426105014';
            } else if (server.CurrentMap.Name == "mp_frostbite") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/4/43/Frost_loadscreen_BOII.png/revision/latest?cb=20140426105546';
            } else if (server.CurrentMap.Name == "mp_pod") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/4/42/Pod_loadscreen_BOII.png/revision/latest?cb=20140426105842';
            } else if (server.CurrentMap.Name == "mp_takeoff") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/3/3f/Takeoff_loadscreen_BOII.png/revision/latest?cb=20140426110209';
            } else if (server.CurrentMap.Name == "zm_buried") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/7/71/Buried_menu_BOII.png/revision/latest?cb=20161102222409';
            } else if (server.CurrentMap.Name == "zm_highrise") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/6/60/Die_Rise_menu_selection_BO2.png/revision/latest?cb=20161102222915';
            } else if (server.CurrentMap.Name == "zm_nuked") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/7/74/Nuketown_menu_selection_BO2.png/revision/latest?cb=20161102222934';
            } else if (server.CurrentMap.Name == "zm_prison") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/a/aa/Mob_of_the_Dead_menu_selection_BO2.png/revision/latest?cb=20161102222825';
            } else if (server.CurrentMap.Name == "zm_tomb") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/b/b2/Origins_Lobby_Icon_BO2.png/revision/latest?cb=20161102222425';
            } else if (server.CurrentMap.Name == "zm_transit_dr") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/b/b4/Diner_TranZit_BOII.png/revision/latest?cb=20130224071848';
            } else if (server.CurrentMap.Name == "zm_transit") {
                iconUrl = 'https://static.wikia.nocookie.net/callofduty/images/f/f9/TranZit_lobby_BOII.png/revision/latest?cb=20161102222339';
            } else {
                iconUrl = "https://cdn0.iconfinder.com/data/icons/flat-design-basic-set-1/24/error-exclamation-512.png";
            }
        } else if (server.GameName === 8) {
            if (server.CurrentMap.Name == "mp_apartments") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_biodome") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_chinatown") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_ethiopia") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_havoc") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_infection") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_metro") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_redwood") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_sector") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_spire") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_stronghold") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_veiled") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_nuketown_x") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_crucible") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_rise") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_skyjacked") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_waterpark") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_aerospace") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_banzai") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_conduit") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_kung_fu") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_arena") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_cryogen") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_rome") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_shrine") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_city") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_miniature") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_ruins") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else if (server.CurrentMap.Name == "mp_western") {
                iconUrl = 'https://steamuserimages-a.akamaihd.net/ugc/863988638212339129/C9EB9FF7B11F17932561FCFE67810F0E42E9FFAF/';
            } else {
                iconUrl = "https://cdn0.iconfinder.com/data/icons/flat-design-basic-set-1/24/error-exclamation-512.png";
            }
        } else if (server.GameName === 9) {
            iconUrl = "https://cdn0.iconfinder.com/data/icons/flat-design-basic-set-1/24/error-exclamation-512.png";
        }
        return iconUrl;
    },

    getAdmiName: function (gameEvent, basURL) {
        var adminname = "";

        if (gameEvent.Origin.CleanedName == "IW4MAdmin") {
            adminname = "`IW4MAdmin`";
        } else {
            adminname = "[`" + gameEvent.Origin.CleanedName + "`](" + basURL + "client/profileasync/" + gameEvent.Origin.ClientId + ")";
        }
        return adminname;

    },
    onEventAsync: function (gameEvent, server) {

        var basURL = this.manager.GetApplicationSettings().Configuration().WebfrontUrl;
        var game = "";
        var authUrl = "";
        var color = "";
        if ((!basURL.endsWith("/"))) {
            basURL += "/";
        }

        if (server.eventParser.Name === "CoD4x Parser") {
            game = "CoD4x";
            authUrl = "http://orig05.deviantart.net/8749/f/2008/055/0/c/call_of_duty_4__dock_icon_by_watts240.png";
            color = 6723840;
        } else if (server.eventParser.Name === "IW4x Parser") {
            game = "IW4x";
            authUrl = "https://i.gyazo.com/758b6933287392106bfdddc24b09d502.png";
            color = 11331072;
        } else if (server.eventParser.Name === "Tekno MW3 Parser") {
            game = "TeknoMW3";
            authUrl = "https://orig00.deviantart.net/9af1/f/2011/310/2/1/modern_warfare_3_logo_by_wifsimster-d4f9ozd.png";
            color = 39219;
        } else if (server.eventParser.Name === "Plutonium IW5 Parser") {
            game = "PlutoIW5";
            authUrl = "https://orig00.deviantart.net/9af1/f/2011/310/2/1/modern_warfare_3_logo_by_wifsimster-d4f9ozd.png";
            color = 39219;
        } else if (server.eventParser.Name === "IW6x Parser") {
            game = "IW6x";
            authUrl = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/26fef988-18ad-48d8-a2a7-863b56ff376f/d7ccksp-ef2e9553-f841-4d0b-b84a-d32acfec22d3.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI2ZmVmOTg4LTE4YWQtNDhkOC1hMmE3LTg2M2I1NmZmMzc2ZlwvZDdjY2tzcC1lZjJlOTU1My1mODQxLTRkMGItYjg0YS1kMzJhY2ZlYzIyZDMucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.RH0ORneDCfkwCQZlCxEfywboloy4j_8b7ABfA_3l5nQ";
            color = 39321;
        } else if (server.eventParser.Name === "Plutonium T4 Parser") {
            game = "PlutoT4";
            authUrl = "https://aux3.iconspalace.com/uploads/673716477224553414.png";
            color = 7829308;
        } else if (server.eventParser.Name === "RektT5m Parser") {
            game = "RektT5M";
            authUrl = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/8678cecb-9a26-4eba-91ba-a768c9e7ebf0/d9gfn65-39ecb111-e20e-4d48-8b00-825d40f19698.png";
            color = 6064778;
        } else if (server.eventParser.Name === "Plutonium T6 Parser") {
            game = "PlutoT6";
            authUrl = "https://i.pinimg.com/originals/5a/44/5c/5a445c5c733c698b32732550ec797e91.jpg";
            color = 15108608;
        } else if (server.eventParser.Name === "Black Ops 3 Parser") {
            game = "Call of Duty: Black Ops III";
            authUrl = "https://cdn.imgbin.com/8/11/19/imgbin-call-of-duty-advanced-warfare-call-of-duty-united-offensive-call-of-duty-black-ops-call-of-duty-modern-warfare-2-call-of-duty-modern-warfare-3-others-SvSR3WX8D3DjpHw2Pv7uwZ8e1.jpg";
            color = 16737792;
        } else if (server.eventParser.Name === "S1x Parser") {
            game = "SHG1";
            authUrl = "https://img.utdstc.com/icon/245/d52/245d52392811b3ed9f0a0dadb463a94cb5069811867551476e94d3efeec08f4b:200";
            color = 13421568;
        }

        if (gameEvent.Type != 3 && gameEvent.Type != 6 && gameEvent.Type === 12) {
            if (!this.enableServersStatus) {
                return;
            }
            embed = {
                "title": "Servers Status",
                "description": "Lost connection to **" + server.Hostname.replace(/\^[0-9:;c]/g, "") + "**",
                "timestamp": new Date(),
                "color": 15073280,
                "author": {
                    "name": game,
                    "icon_url": authUrl
                },
            }
            this.sendServersStatusWebHook(embed);
        }
        if (gameEvent.Type === 13) {
            if (!this.enableServersStatus) {
                return;
            }
            embed1 = {
                "title": "Servers Status",
                "description": "Restored connection to **" + server.Hostname.replace(/\^[0-9:;c]/g, "") + "**",
                "timestamp": new Date(),
                "color": 3394611,
                "author": {
                    "name": game,
                    "icon_url": authUrl
                },
            }
            this.sendServersStatusWebHook(embed1);
        }
        if (gameEvent.Type === 103) {
            if (!this.enableReports) {
                return;
            }
            var admins = "";

            server.GetClientsAsList().forEach(function (players) {
                if (players.Level > 1 && !players.Masked) {
                    admins += "" + players.CleanedName.toString() + ", ";
                }
            });
            if (!admins) {
                admins = "No admin online";
            }
            embed2 = {
                "author": {
                    "name": game,
                    "icon_url": authUrl
                },
                "description": "" + this.getAdmiName(gameEvent, basURL) + " Reported [`" + gameEvent.Target.CleanedName + "` @" + gameEvent.Target.ClientId + "](" + basURL + "client/profileasync/" + gameEvent.Target.ClientId + ")",
                "timestamp": new Date(),
                "color": color,
                "footer": {
                    "text": "Online Admins: " + admins,
                },
                "thumbnail": {
                    "url": this.getMapThumb(server)
                },
                "fields": [{
                        "name": "Server",
                        "value": server.Hostname.replace(/\^[0-9:;c]/g, ""),
                        "inline": false
                    },
                    {
                        "name": "Reason",
                        "value": gameEvent.Data.replace(/\^[0-9:;c]/g, ""),
                        "inline": false
                    },
                ]
            }
            this.sendReportsWebHook(embed2);
        }
        if (gameEvent.Type === 106) {
            if (!this.enableBans) {
                return;
            }
            embed3 = {
                "author": {
                    "name": game,
                    "icon_url": authUrl
                },
                "description": "" + this.getAdmiName(gameEvent, basURL) + " Kicked [`" + gameEvent.Target.CleanedName + "` @" + gameEvent.Target.ClientId + "](" + basURL + "client/profileasync/" + gameEvent.Target.ClientId + ")",
                "timestamp": new Date(),
                "color": 15466496,
                "fields": [{
                        "name": "Reason",
                        "value": gameEvent.Data.replace(/\^[0-9:;c]/g, ""),
                        "inline": false
                    },
                    {
                        "name": "Server",
                        "value": server.Hostname.replace(/\^[0-9:;c]/g, ""),
                        "inline": true
                    },
                ]
            }
            this.sendBansWebHook(embed3);
        }
        if (gameEvent.Type === 107) {
            if (!this.enableBans) {
                return;
            }
            embed4 = {
                "author": {
                    "name": game,
                    "icon_url": authUrl
                },
                "description": "" + this.getAdmiName(gameEvent, basURL) + " Temp-Banned [`" + gameEvent.Target.CleanedName + "` @" + gameEvent.Target.ClientId + "](" + basURL + "client/profileasync/" + gameEvent.Target.ClientId + ")",
                "timestamp": new Date(),
                "color": 15466496,
                "fields": [{
                        "name": "Reason",
                        "value": gameEvent.Data.replace(/\^[0-9:;c]/g, ""),
                        "inline": false
                    },
                    {
                        "name": "Server",
                        "value": server.Hostname.replace(/\^[0-9:;c]/g, ""),
                        "inline": true
                    },
                    {
                        "name": "Duration",
                        "value": gameEvent.Extra.toString(),
                        "inline": true
                    },
                ]
            }
            this.sendBansWebHook(embed4);
        }
        if (gameEvent.Type === 108) {
            if (!this.enableBans) {
                return;
            }
            embed5 = {
                "author": {
                    "name": game,
                    "icon_url": authUrl
                },
                "description": "" + this.getAdmiName(gameEvent, basURL) + " Banned [`" + gameEvent.Target.CleanedName + "` @" + gameEvent.Target.ClientId + "](" + basURL + "client/profileasync/" + gameEvent.Target.ClientId + ")",
                "timestamp": new Date(),
                "color": 15466496,
                "fields": [{
                        "name": "Reason",
                        "value": gameEvent.Data.replace(/\^[0-9:;c]/g, ""),
                        "inline": false
                    },
                    {
                        "name": "Server",
                        "value": server.Hostname.replace(/\^[0-9:;c]/g, ""),
                        "inline": true
                    },
                    {
                        "name": "Duration",
                        "value": "Permanent",
                        "inline": true
                    },
                ]
            }
            this.sendBansWebHook(embed5);
        }
        if (gameEvent.Type === 109) {
            if (!this.enableBans) {
                return;
            }
            embed6 = {
                "author": {
                    "name": game,
                    "icon_url": authUrl
                },
                "description": "" + this.getAdmiName(gameEvent, basURL) + " Unbanned [`" + gameEvent.Target.CleanedName + "` @" + gameEvent.Target.ClientId + "](" + basURL + "client/profileasync/" + gameEvent.Target.ClientId + ")",
                "timestamp": new Date(),
                "color": 15132390,
                "footer": {
                    "text": "Reason: " + gameEvent.Data.replace(/\^[0-9:;c]/g, "")
                }
            }
            this.sendBansWebHook(embed6);
        }
    },

    onLoadAsync: function (manager) {
        this.manager = manager;
        this.logger = manager.GetLogger(0);
    },

    onUnloadAsync: function () {},

    onTickAsync: function (server) {}
};