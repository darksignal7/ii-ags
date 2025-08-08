// This file is for popup notifications
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
const { Box } = Widget;
import Notification from '../.commonwidgets/notification.js';
import { RoundedCorner } from '../.commonwidgets/cairo_roundedcorner.js';


const wholeThing = Box({
    vertical: true,
    hpack: 'end',
    className: 'bar-bg notif-right-upper',
    attribute: {
        'map': new Map(),
        'dismiss': (box, id, force = false) => {
            
            if (!id || !box.attribute.map.has(id))
                return;
            
            const notifWidget = box.attribute.map.get(id);
            if (notifWidget == null || notifWidget.attribute.hovered && !force)
                return; // cuz already destroyed

            notifWidget.revealChild = false;
            notifWidget.attribute.destroyWithAnims();
            box.attribute.map.delete(id);
        },
        'notify': (box, id) => {
            if (!id || Notifications.dnd) return;
            if (!Notifications.getNotification(id)) return;
            
            box.attribute.map.delete(id);

            const notif = Notifications.getNotification(id);
            const newNotif = Notification({
                notifObject: notif,
                isPopup: true,
                roundedCorners: false,
            });
            box.attribute.map.set(id, newNotif);
            box.pack_end(box.attribute.map.get(id), false, false, 0);
            //box.pack_end(newNotif, false, false, 0);
            box.show_all();
        },
    },
    setup: (self) => self
       
        .hook(Notifications, (box, id) => box.attribute.notify(box, id), 'notified',  interval())
        .hook(Notifications, (box, id) => box.attribute.dismiss(box, id), 'dismissed')
        .hook(Notifications, (box, id) => {
            box.attribute.dismiss(box, id, true), 'closed'
        })
    ,
});

const corner = RoundedCorner('topright', { className: 'corner' })
const corner2 = RoundedCorner('topright', { className: 'corner' })

var intervar

function interval(){
    intervar = setInterval(test, 100)
}
function test(){
    if (wholeThing.get_children().length == 0){
        toggle(false);
    }else {
        toggle(true);
    }
}
function on(){
    toggle(true)
}

function toggle(on){
    corner.visible = on;
    corner2.visible = on;
    wholeThing.toggleClassName('bar-bg', on);
}


const notifV = Widget.Box({
    vertical : true,
    children: [
        wholeThing,
        corner
    ]
})

const notifH = Widget.Box({
    css: 'margin-left: 425px;',
    children: [
        corner2,
        notifV
    ]
})

export const notifWithExport = () => {
    return notifH;
}
