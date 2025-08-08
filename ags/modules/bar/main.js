const { Gtk } = imports.gi;
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Battery from 'resource:///com/github/Aylur/ags/service/battery.js';

import WindowTitle from "./normal/spaceleft.js";
import Indicators from "./normal/spaceright.js";
import Music from "./normal/music.js";
import System from "./normal/system.js";
import { enableClickthrough } from "../.widgetutils/clickthrough.js";
import { RoundedCorner } from "../.commonwidgets/cairo_roundedcorner.js";
import { currentShellMode } from '../../variables.js';



const sideBarBoldness = 10;

const NormalOptionalWorkspaces = async () => {
    try {
        return (await import('./normal/workspaces_hyprland.js')).default();
    } catch {
        try {
            return (await import('./normal/workspaces_sway.js')).default();
        } catch {
            return null;
        }
    }
};

const FocusOptionalWorkspaces = async () => {
    try {
        return (await import('./focus/workspaces_hyprland.js')).default();
    } catch {
        try {
            return (await import('./focus/workspaces_sway.js')).default();
        } catch {""
            return null;
        }
    }
};

const Hyprland = (await import('resource:///com/github/Aylur/ags/service/hyprland.js')).default;

        const topdesc = Widget.Label({
            //className: 'txt-smaller bar-wintitle-topdesc txt',
            setup: (self) => self.hook(Hyprland.active.client, label => { // Hyprland.active.client
                label.label = Hyprland.active.client.class.length === 0 ? 'Desktop' : Hyprland.active.client.class;
            }),
        })

        const wintitle = Widget.Label({
            //className: 'txt-smallie bar-wintitle-txt',
            setup: (self) => {
                self.hook(Hyprland.active.client, label => { // Hyprland.active.client
                    label.label = Hyprland.active.client.title.length === 0 ? `Workspace ${Hyprland.active.workspace.id}` : Hyprland.active.client.title;
                });
                self.hook(Hyprland.active.workspace, label => { // Hyprland.active.client
                    label.label = Hyprland.active.client.title.length === 0 ? `Workspace ${Hyprland.active.workspace.id}` : Hyprland.active.client.title;
                });
            }
        })

const Seperator = (size = 10) => Widget.Separator({
    css : 'min-height:' + size + 'px;'
})
const BarGroup = ({ child }) => Widget.Box({
    className: 'bar-group-margin bar-sides',
    css:'margin: 5px;',
    children: [
        Widget.Box({
            //className: `bar-group${userOptions.appearance.borderless ? '-borderless' : ''} bar-group-standalone bar-group-pad-system`,
            children: [child],
        }),
    ]
});

export const Bar = async (monitor = 0) => {
    const SideModule = (children) => Widget.Box({
        className: 'bar-sidemodule',
        children: children,
    });
    const normalBarContent = Widget.CenterBox({
        vertical: true,
        className: 'bar-bg',

        setup: (self) => {
            const styleContext = self.get_style_context();
            const minHeight = styleContext.get_property('min-height', Gtk.StateFlags.NORMAL);
            // execAsync(['bash', '-c', `hyprctl keyword monitor ,addreserved,${minHeight},0,0,0`]).catch(print);
        },
        startWidget: Widget.Box({
            hpack: 'center',
            children:[
                await NormalOptionalWorkspaces(),
            ]
        }),
        centerWidget: await WindowTitle(monitor),
        endWidget: Widget.Box({
            vertical:true,
            children:[
                Widget.Box({
                    vexpand:true
                }),
                //Widget.Box({css:'margin-left: 2px;min-height:200px;', children:[Music(monitor)]}), Şimdi beklemeli
                System(),
                Seperator(20),
                BarGroup({ child: Indicators(monitor) })
            ]
        }),
    });

    
    return Widget.Window({
        monitor,
        name: `bar${monitor}`,
        anchor: ['top', 'left', 'bottom'],
        exclusivity: 'exclusive',
        visible: true,
        child: Widget.Stack({
            homogeneous: false,
            transition: 'slide_right_left',
            transitionDuration: userOptions.animations.durationLarge,
            shown: 'normal',
            children: {
                'normal': normalBarContent,
            },
            setup: (self) => self.hook(currentShellMode, (self) => {
                self.shown = currentShellMode.value[monitor];
            })
        }),
    });
}

export const BarTop = (monitor = 0) => Widget.Window({
    monitor,
    name: `barcornerlt${monitor}`, //keywords: barstilblur topbarın da soldaki ana bar gibi css e sahip olması için
    anchor: ['top', 'left', 'right'],
    exclusivity: 'exclusive',
    visible: true,
    child: Widget.Box({css:'min-height:' + sideBarBoldness + 'px;',className: 'bar-bg'}),
    setup: enableClickthrough,
})
export const BarBottom = (monitor = 0) => Widget.Window({
    monitor,
    name: `barcorner${monitor}`, //keywords: barstilblur topbarın da soldaki ana bar gibi css e sahip olması için
    anchor: ['bottom', 'left', 'right'],
    exclusivity: 'exclusive',
    visible: true,
    child: Widget.Box({css:'min-height:' + sideBarBoldness + 'px;',className: 'bar-bg'}),
    setup: enableClickthrough,
})
export const BarRight = (monitor = 0) => Widget.Window({
    monitor,
    name: `barcornerrt${monitor}`, //keywords: barstilblur topbarın da soldaki ana bar gibi css e sahip olması için
    anchor: ['right', 'top', 'bottom'],
    exclusivity: 'exclusive',
    visible: true,
    child: Widget.Box({css:'min-width:' + sideBarBoldness + 'px;',className: 'bar-bg'}),
    setup: enableClickthrough,
})


export const BarCornerTopleft = (monitor = 0) => Widget.Window({
    monitor,
    name: `barcornertl${monitor}`,
    layer: 'top',
    anchor: ['top', 'left'],
    exclusivity: 'exclusive',
    visible: true,
    child: RoundedCorner('topleft', { className: 'corner', }),
    setup: enableClickthrough,
});
export const BarCornerTopright = (monitor = 0) => Widget.Window({
    monitor,
    name: `barcornertr${monitor}`,
    layer: 'top',
    anchor: ['top', 'right'],
    exclusivity: 'normal',
    visible: true,
    child: RoundedCorner('topright', { className: 'corner', }),
    setup: enableClickthrough,
});
export const BarCornerBottomleft = (monitor = 0) => Widget.Window({
    monitor,
    name: `barcornerbl${monitor}`,
    layer: 'top',
    anchor: ['bottom', 'left'],
    exclusivity: 'normal',
    visible: true,
    child: RoundedCorner('bottomleft', { className: 'corner', }),
    setup: enableClickthrough,
});
export const BarCornerBottomright = (monitor = 0) => Widget.Window({
    monitor,
    name: `barcornerbr${monitor}`,
    layer: 'top',
    anchor: ['bottom', 'right'],
    exclusivity: 'normal',
    visible: true,
    child: RoundedCorner('bottomright', { className: 'corner', }),
    setup: enableClickthrough,
});



