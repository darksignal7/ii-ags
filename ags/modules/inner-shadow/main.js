import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import App from 'resource:///com/github/Aylur/ags/app.js'

import { enableClickthrough } from "../.widgetutils/clickthrough.js";

export const GeneralInner = (monitor = 0) => Widget.Window({
    name: `inner-shadow${monitor}`,
    monitor,
    layer: 'background',
    //layer: 'top',
    exclusivity: 'normal',
    visible: true,
    anchor: ['top', 'left', 'right'],
    child: Widget.Box({
        className: 'inner-shadow-inset',
    }),
    setup: enableClickthrough,
});
