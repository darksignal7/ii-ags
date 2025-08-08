const { Gdk, Gtk, Gio, GLib } = imports.gi;
import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import { RoundedCorner } from '../.commonwidgets/cairo_roundedcorner.js';

import Applications from 'resource:///com/github/Aylur/ags/service/applications.js';
const { execAsync, exec } = Utils;
import { execAndNotClose ,execAndClose, expandTilde, hasUnterminatedBackslash, couldBeMath, launchCustomCommand, ls } from './miscfunctions.js';
import {
    CalculationResultButton, CustomCommandButton, DirectoryButton,
    DesktopEntryButton, ExecuteCommandButton, SearchButton, AiButton, NoResultButton, ClipHistoryButton,
    WallpaperButton, StartupButton
} from './searchbuttons.js';
import { checkKeybind } from '../.widgetutils/keybind.js';
import GeminiService from '../../services/gemini.js';


//import { cliphistOutput } from '../../scripts/clipboard/cliphist_data.js';

const cacheIconPath = '/home/vaguesyntax/.cache/ags/wallpaper_cache/';

function readJsonArrayDirectlyAGS(filePath) {
    const file = Gio.File.new_for_path(filePath);
    const data = file.load_contents(null);
    const fixedData = data[1];
    const decoder = new TextDecoder('utf-8'); // Genellikle UTF-8 kullanılır
    const jsonContentString = decoder.decode(fixedData);
    const parsedData = JSON.parse(jsonContentString);
    return parsedData;
}



// Add math funcs 
const { abs, sin, cos, tan, cot, asin, acos, atan, acot } = Math;

const pi = Math.PI;
// trigonometric funcs for deg
const sind = x => sin(x * pi / 180);
const cosd = x => cos(x * pi / 180);
const tand = x => tan(x * pi / 180);
const cotd = x => cot(x * pi / 180);
const asind = x => asin(x) * 180 / pi;
const acosd = x => acos(x) * 180 / pi;
const atand = x => atan(x) * 180 / pi;
const acotd = x => acot(x) * 180 / pi;

const MAX_RESULTS = 10;
const OVERVIEW_SCALE = 0.18; // = overview workspace box / screen size
const OVERVIEW_WS_NUM_SCALE = 0.09;
const OVERVIEW_WS_NUM_MARGIN_SCALE = 0.07;
const TARGET = [Gtk.TargetEntry.new('text/plain', Gtk.TargetFlags.SAME_APP, 0)];

function iconExists(iconName) {
    let iconTheme = Gtk.IconTheme.get_default();
    return iconTheme.has_icon(iconName);
}


Array.prototype.query = function(sorgu) {
  return this.filter(eleman => eleman.toLowerCase().includes(sorgu.toLowerCase()));
};

const OptionalOverview = async () => {
    try {
        return (await import('./overview_hyprland.js')).default();
    } catch {
        return Widget.Box({});
        // return (await import('./overview_hyprland.js')).default();
    }
};


const overviewContent = await OptionalOverview();

export const SearchAndWindows = () => {
    var _appSearchResults = [];
    var _wallpaperFixed = [];
    var _barWidth = 385;

    
    
    const resultsBox = Widget.Box({
        className: 'overview-search-box-result-styled',
        vertical: true,
        css: 'background:transparent;',
    });
    _barWidth = 385;
    const overlayBox = Widget.Scrollable({
        className: 'overview-search-box-result-styled txt-small txt',
        hscroll : 'always',
        vscroll : 'never',
        child: resultsBox,
    })
    const resultsRevealer = Widget.Revealer({
        transitionDuration: userOptions.animations.durationLarge,
        revealChild: true,
        transition: 'slide_down',
        //duration: 200,
        hpack: 'center',
        child: overlayBox,
    });
    const entryPromptRevealer = Widget.Revealer({
        transition: 'crossfade',
        transitionDuration: userOptions.animations.durationLarge,
        revealChild: true,
        hpack: 'center',
        child: Widget.Label({
            className: 'overview-search-prompt  txt-small txt',
            label: getString('Type to search')
        }),
    });


    const entryIconRevealer = Widget.Revealer({
        transition: 'crossfade',
        transitionDuration: userOptions.animations.durationLarge,
        revealChild: false,
        hpack: 'end',
        child: Widget.Label({
            className: 'txt txt-large icon-material overview-search-icon',
            label: 'search',
        }),
    });

    const entryIcon = Widget.Box({
        className: 'overview-search-prompt-box overview-search-entry-styled',
        setup: box => box.pack_start(entryIconRevealer, true, true, 0),
    });
    
    const entry = Widget.Entry({
        placeholder_text: 'Hover to focus..',
        className: 'overview-search-entry-styled txt-small txt',
        hpack: 'center',
        onAccept: (self) => { // This is when you hit Enter
            resultsBox.children[resultsBox.children.length - 1].onClicked();
        },
        onChange: (entry) => { // this is when you type

            const isAction = entry.text[0] == '>' && entry.text[1] != 'w';
            const isDir = (['/', '~'].includes(entry.text[0]));
            resultsBox.get_children().forEach(ch => ch.destroy())
            // check empty if so then dont do stuff
            if (entry.text == '') {
                resultsRevealer.revealChild = true;
                overviewContent.revealChild = true;
                entryPromptRevealer.revealChild = true;
                entryIconRevealer.revealChild = true;
                entry.toggleClassName('overview-search-entry-extended', true);
                resultsBox.toggleClassName('overview-search-box-extended', false);
                overlayBox.toggleClassName('overview-search-box-extended', false);
                
                
                resultsBox.children = [
                        StartupButton('wallpaper', 'Wallpaper (>img)', 'Change wallpaper', '>img'), 
                        StartupButton('colors', 'Color Variant (>color)', 'Change current color', '>color'),
                        StartupButton('light_mode', 'Light (>light)', 'Light mode', '>light'),
                        StartupButton('dark_mode', 'Dark (>dark)', 'Dark mode', '>dark'),
                        StartupButton('contrast', 'Bad Apple (>badapple)', 'Black and white', '>badapple'),
                        StartupButton('texture', 'Material (>material)', 'Material theme', '>material'),
                        ];
                return;
            }
            
            
            const text = entry.text;
            resultsRevealer.revealChild = true;
            overviewContent.revealChild = false;
            entryPromptRevealer.revealChild = false;
            entryIconRevealer.revealChild = true;
            entry.toggleClassName('overview-search-entry-extended', true);
            resultsBox.toggleClassName('overview-search-box-extended', true);
            overlayBox.toggleClassName('overview-search-box-extended', true);
            _appSearchResults = Applications.query(text);
            let _wallpaperSearchResults = readJsonArrayDirectlyAGS('/home/vaguesyntax/.config/ags/scripts/wallpaper/icon_paths.json');
            _wallpaperFixed = _wallpaperSearchResults.query(text.substring(6));
            resultsBox.vertical = true;
           
            if (text.startsWith(';')){
                let textToAdd = MAX_RESULTS;
                let cliphist = readJsonArrayDirectlyAGS('/home/vaguesyntax/.config/ags/scripts/clipboard/cliphist_data.json')
                cliphist.forEach((item) => {

                    if (textToAdd == 0) return;
                    resultsBox.pack_end(ClipHistoryButton({ text: item }), true, true, 0);
                    textToAdd--;
                    
                }) 
            }

            if (text.startsWith('>wall')) {
                overlayBox.toggleClassName('overview-search-box-extended-wall', true);
                entry.toggleClassName('overview-search-entry-extended-wall', true);
                let textToAdd = 250;
                _wallpaperFixed.forEach((icon) => {
                    const lastSlash = icon.lastIndexOf('/');
                    const iconFileName = icon.substring(lastSlash + 1);
                    if (textToAdd == 0) return;
                    textToAdd--;
                    resultsBox.pack_end(WallpaperButton({ icon: cacheIconPath + iconFileName, iconSize: '250', realIcon: icon }), true,true,0);
                    resultsBox.vertical = false;
                    
                })
            }else {
                overlayBox.toggleClassName('overview-search-box-extended-wall', false);
                entry.toggleClassName('overview-search-entry-extended-wall', false);
            }

            // Calculate
            if (userOptions.search.enableFeatures.mathResults && couldBeMath(text)) { // Eval on typing is dangerous; this is a small workaround.
                try {
                    const fullResult = eval(text.replace(/\^/g, "**"));
                    resultsBox.pack_end(CalculationResultButton({ result: fullResult, text: text }), true, true, 0);
                } catch (e) {
                    // console.log(e);
                }
            }
            // Add directory entries
            if (userOptions.search.enableFeatures.directorySearch && isDir) {
                var contents = [];
                contents = ls({ path: text, silent: true });
                contents.forEach((item) => {
                    resultsBox.pack_end(DirectoryButton(item), true, true, 0);
                })
            }
            // Custom commands such as >todo , >logout etc
            if (userOptions.search.enableFeatures.actions && isAction) { // Eval on typing is dangerous, this is a workaround.
                resultsBox.pack_end(CustomCommandButton({ text: entry.text }), true, true, 0);
            }
            // LOOK HERE
            // Add application entries
            let appsToAdd = MAX_RESULTS;
            _appSearchResults.forEach(app => {
                if (appsToAdd == 0) return;
                //resultsBox.add(DesktopEntryButton(app));
                resultsBox.pack_end(DesktopEntryButton(app), true, true, 0);
                appsToAdd--;
            });
            
            // Fallbacks
            // if the first word is an actual command
            if (!text.startsWith('>wall') && !text.startsWith('>todo')) {
                
            
            if (userOptions.search.enableFeatures.commands && !isAction && !hasUnterminatedBackslash(text) && exec(`bash -c "command -v ${text.split(' ')[0]}"`) != '') {
                resultsBox.pack_end(ExecuteCommandButton({ command: entry.text, terminal: entry.text.startsWith('sudo') }), true, true, 0);
            }

            // Add fallback: search
            if (userOptions.search.enableFeatures.aiSearch)
                resultsBox.add(AiButton({ text: entry.text }));
            if (userOptions.search.enableFeatures.webSearch)
                resultsBox.add(SearchButton({ text: entry.text }));
            }
            if (resultsBox.children.length == 0) resultsBox.add(NoResultButton());
            resultsBox.show_all();
           
            
        },
    });
    //entry.set_alignment(0.5);
    const entryOuterBox = Widget.Box({
        className: 'overview-search-outer-box', 
        children: [
            entry,
        ]
    })
    const entryHolderBox = Widget.Box({
        className: 'overview-search-box-styled',
        children:[
            entryIcon,
            entryOuterBox,
        ]
    })
    const wholeThing = Widget.Box({

        vertical: true,
        children: [
            resultsRevealer,
            Widget.Box({
                hpack: 'center',
                children: [
                    //RoundedCorner('bottomright', {className: 'corner' }),

                    Widget.Box({
                        className: 'overview-search-icon-box',
                        setup: (box) => {
                            box.pack_start(entryPromptRevealer, true, true, 0)
                        },
                    }),
                    entryHolderBox,
                    
                    //RoundedCorner('bottomleft', {className: 'corner' }),
                ]
            }),
        ],
        setup: (self) => self
            .hook(App, (_b, name, visible) => {
                entry.grab_focus_without_selecting();
                if (name == 'overview') { // && !visible,
                    entry.set_text('');
                    
                    /// Do not put these to variables (or constants), they are not working as they should
                    resultsBox.children = [
                        StartupButton('wallpaper', 'Wallpaper (>img)', 'Change wallpaper', '>img'), 
                        StartupButton('colors', 'Color Variant (>color)', 'Change current color', '>color'),
                        StartupButton('light_mode', 'Light (>light)', 'Light mode', '>light'),
                        StartupButton('dark_mode', 'Dark (>dark)', 'Dark mode', '>dark'),
                        StartupButton('contrast', 'Bad Apple (>badapple)', 'Black and white', '>badapple'),
                        StartupButton('texture', 'Material (>material)', 'Material theme', '>material'),
                        ,];
                    
                }
            })
            .on('key-press-event', (widget, event) => { // Typing
                const keyval = event.get_keyval()[1];
                const modstate = event.get_state()[1];
                if (checkKeybind(event, userOptions.keybinds.overview.altMoveLeft))
                    entry.set_position(Math.max(entry.get_position() - 1, 0));
                else if (checkKeybind(event, userOptions.keybinds.overview.altMoveRight))
                    entry.set_position(Math.min(entry.get_position() + 1, entry.get_text().length));
                else if (checkKeybind(event, userOptions.keybinds.overview.deleteToEnd)) {
                    const text = entry.get_text();
                    const pos = entry.get_position();
                    const newText = text.slice(0, pos);
                    entry.set_text(newText);
                    entry.set_position(newText.length);
                }
                else if (!(modstate & Gdk.ModifierType.CONTROL_MASK)) { // Ctrl not held
                    if (keyval >= 32 && keyval <= 126 && widget != entry) {
                        Utils.timeout(1, () => entry.grab_focus());
                        entry.set_text(entry.text + String.fromCharCode(keyval));
                        entry.set_position(-1);
                    }
                }
            })
        ,
    });
    const roundedBox = Widget.Box({
        className: 'inner-shadow',
        children: [
            wholeThing,
            
        ]
    })
    const returnedBox = Widget.Box({
        children: [
            RoundedCorner('bottomright', {className: 'corner' }),
            roundedBox,
            RoundedCorner('bottomleft', {className: 'corner' })
        ]
    })
    return returnedBox
};
