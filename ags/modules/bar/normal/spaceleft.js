import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Brightness from '../../../services/brightness.js';
import Indicator from '../../../services/indicator.js';
import { distance } from '../../.miscutils/mathfuncs.js';
import { MaterialIcon } from '../../.commonwidgets/materialicon.js';


const OSD_DISMISS_DISTANCE = 10;



//wintitle.set_angle(270);
//topdesc.set_angle(270);

const WindowTitle = async () => {
    try {
        const Hyprland = (await import('resource:///com/github/Aylur/ags/service/hyprland.js')).default;

        const topdesc = Widget.Label({
            css: `font-family: "JetBrains Mono NF";font-size: 20px;font-weight: normal;`,
            className: 'txt-norm bar-wintitle-txt txt',
            setup: (self) => self.hook(Hyprland.active.client, label => { // Hyprland.active.client
                var text = Hyprland.active.client.class.length === 0 ? 'Desktop' : Hyprland.active.client.class;
                if (text.length > 20) {
                    label.label = text.substring(0, 20) + '...';
                }else {
                    label.label = text;
                }
            }),
        })

        const wintitle = Widget.Label({
            
            css: 'color: rgba(0,0,0,0);',
            className: 'txt-tiny bar-wintitle-topdesc',
            //setup: (self) => {
            //    self.hook(Hyprland.active.client, label => { // Hyprland.active.client
            //        label.label = Hyprland.active.client.title.length === 0 ? `Workspace ${Hyprland.active.workspace.id}` : Hyprland.active.client.title;
            //    });
            //    self.hook(Hyprland.active.workspace, label => { // Hyprland.active.client
            //        label.label = Hyprland.active.client.title.length === 0 ? `Workspace ${Hyprland.active.workspace.id}` : Hyprland.active.client.title;
            //    });
            //}
        })
        topdesc.set_angle(270);
        wintitle.set_angle(270);
        wintitle.label = 'ThisDotsForkedByVagueSyntaxFromEnd-4Dots(ii-ags branch)(github.com/darksignal7)(github.com/end-4)'; 
        return Widget.CenterBox({
            startWidget: wintitle,
            centerWidget: Widget.Box({
                hpack: 'center',vpack:'center',
                vertical:true,
                children: [
                    MaterialIcon("computer", "big"),
                    Widget.Separator({css:'min-height:15px;'}),
                    topdesc
                ]
            }),
            endWidget: wintitle
        })
    } catch {
        return null;
    }
}


export default async (monitor = 0) => {
    const optionalWindowTitleInstance = await WindowTitle();
    return Widget.EventBox({
        child : optionalWindowTitleInstance,
    });
}
