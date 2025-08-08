import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { execAndNotClose ,execAndClose, couldBeMath, launchCustomCommand } from './miscfunctions.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
const { execAsync, exec } = Utils;

export const searchItem = ({ materialIconName, name, actionName, content, onActivate, icon = '', icon_size = 0,icons = [], extraClassName = '', ...rest }) => {
    const actionText = Widget.Revealer({
        revealChild: false,
        transition: "crossfade",
        transitionDuration: userOptions.animations.durationLarge,
        child: Widget.Label({
            className: 'overview-search-results-txt txt txt-small txt-action',
            label: `${actionName}`,
        })
    });
    const actionTextRevealer = Widget.Revealer({
        revealChild: false,
        transition: "slide_left",
        transitionDuration: userOptions.animations.durationSmall,
        child: actionText,
    });
    return Widget.Button({
        className: `overview-search-result-btn txt ${extraClassName}`,
        onClicked: onActivate,
        child: Widget.Box({
            children: [
                Widget.Box({
                    vertical: false,
                    children: [
                        Widget.Label({
                            className: `icon-material overview-search-results-icon`,
                            label: `${materialIconName}`,
                        }),
                        Widget.Box({
                            vertical: true,
                            children: [
                                Widget.Label({
                                    hpack: 'start',
                                    className: 'overview-search-results-txt txt-smallie txt-subtext',
                                    label: `${name}`,
                                    truncate: "end",
                                }),
                                Widget.Label({
                                    hpack: 'start',
                                    className: 'overview-search-results-txt txt-norm',
                                    label: `${content}`,
                                    truncate: "end",
                                }),
                            ]
                        }),
                        Widget.Box({ hexpand: true }),
                        actionTextRevealer,
                    ],
                })
            ]
        }),
        setup: (self) => self
            .on('focus-in-event', (button) => {
                actionText.revealChild = true;
                actionTextRevealer.revealChild = true;
            })
            .on('focus-out-event', (button) => {
                actionText.revealChild = false;
                actionTextRevealer.revealChild = false;
            })
        ,
    });   
}


export const wallpaperSelect = ({ icon , iconSize , realIcon}) => {
    const pngicon = icon.replace(/\.[^.]+$/, ".png");
    const lastSlashIndex = icon.lastIndexOf('/');
    var path = '';
    var fixedPath = '';
    if (lastSlashIndex !== -1) {
        const result = icon.substring(lastSlashIndex + 1, icon.length - 4);
        path = result;
    }
    fixedPath = path.substring(0, 20);
    const actionText = Widget.Revealer({
        revealChild: false,
        transition: "crossfade",
        transitionDuration: userOptions.animations.durationLarge,
        child: Widget.Label({
            className: 'overview-search-results-txt txt-smallie txt-subtext',
            label: 'Select',
        })
    });
    const actionTextRevealer = Widget.Revealer({
        revealChild: false,
        transition: "slide_down",
        transitionDuration: userOptions.animations.durationSmall,
        child: actionText,
    });
    return Widget.Button({
        className: `overview-search-result-btn txt `,
        onClicked: () => {
            exec('swww img ' + `${realIcon}`);
            exec('cp '  + `${realIcon}` + ' /home/vaguesyntax/Belgeler/local-wallpaper/uploads/wallpaper.png')
            execAndClose('/home/vaguesyntax/.config/ags/scripts/color_generation/colorgen.sh ' + `${realIcon}` + ' --apply --smart').catch(print);
        },
        child: Widget.Box({
            vertical: true,
            children :[
                Widget.Box({
                    vertical: true,
                    children:[
                        Widget.Box({
                            className: `overview-search-result-btn txt `,
                            children: [
                                Widget.Icon({
                                    css: 'border-radius: 24px;box-shadow: 0px 0px 4px 3px rgba(0, 0, 0, 0.5);',
                                    icon: `${pngicon}`,
                                    size: `${iconSize}`,
                                })
                            ]
                        }),
                        Widget.Label({
                            className: 'overview-search-results-txt txt txt-small txt-action',
                            label: '  ' + fixedPath,
                        }),
                        
                    ]
                }),
                Widget.Box({ hexpand: true }),
                actionTextRevealer,
            ]
        }),
        setup : (self) => self
            .on('focus-in-event', (button) => {
                actionText.revealChild = true;
                actionTextRevealer.revealChild = true;
            })
            .on('focus-out-event', (button) => {
                actionText.revealChild = false;
                actionTextRevealer.revealChild = false;
            }),
    })
}

function changeWallpaper (img){
    
    //execAndClose('/home/vaguesyntax/.config/ags/scripts/color_generation/colorgen.sh' + `${img}` + '--apply --smart');  
}