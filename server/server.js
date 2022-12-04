const express = require('express');
const bodyParser = require('body-parser');
const JSONdb = require('simple-json-db');
const cors = require('cors');
const app = express();
const mdns = require('mdns');
const port = 3005;

const corsOptions = {
    origin: '*',
};

let services = [];

let settings = {
    parent_hostname: '',
    poster_display_speed: 15000,
    transition_type: 'fade',
    random_order: false,
    wifi_country_code: '',
    wifi_sid: '',
    wifi_password: '',
    coming_soon_text: 'Coming Soon',
    now_playing_text: 'Now Playing',
    speaker_config: '',
    speaker_config_location: 'top-right',
    show_speaker_config: true,
    override_parent_sequence: false,
    override_parent_transitons: false,
    override_parent_colors: false,
    poster_bg_color: '#000000',
    header_bg_color: '#000000',
    header_text_color: '#FFFFFF',
    show_header_border: true,
    header_border_color: '#FFFFFF',
    header_font: 'default',
    header_font_size: 'normal',
    footer_bg_color: '#000000',
    footer_text_color: '#FFFFFF',
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

let browser = mdns.createBrowser(mdns.tcp('movieposter'));
browser.on('serviceUp', function (service) {
    services.push(service);
});
browser.on('serviceDown', function (service) {
    services.splice(services.indexOf(service), 1);
});
browser.start();

const db = new JSONdb('storage.json');

app.get('/settings', function (req, res) {
    let theseSettings = {};
    if (!db.has('settings')) {
        db.set('settings', settings);
        theseSettings = settings;
    } else {
        theseSettings = db.get('settings');
    }

    res.json({ settings: theseSettings });
});

app.post('/settings', function (req, res) {
    let request = req.body;
    db.set('settings', request.settings);
    let theseSettings = request.settings;

    res.json({ settings: theseSettings });
});

app.get('/reset-settings', function (req, res) {
    db.set('settings', settings);
    res.json({ success: true, settings: settings });
});

app.get('/upgrade-settings', function (req, res) {
    //db.set('settings', settings);
    res.json({ success: true, settings: settings });
});

app.get('/discover-devices', function (req, res) {
    res.json({ services: services });
});

app.post('/set-device', function (req, res) {
    let data = req.body;
    let settings = db.get('settings');
    settings.parent_hostname = data.host;
    db.set('settings', settings);

    res.json({ success: true, host: data.host });
});

app.listen(port, function () {
    console.log(`DMP Add-on server listening on port ${port}!`);
});
