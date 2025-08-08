import Widget from 'resource:///com/github/Aylur/ags/widget.js';
const { Box, Label, Scrollable } = Widget;
import QuickScripts from './tools/quickscripts.js';
import ColorPicker from './tools/colorpicker.js';
import Conversions from './tools/conversions.js';
import Translate from './tools/translate.js';
import Name from './tools/name.js';
import Music from './tools/music.js';

export default Scrollable({
    hscroll: "never",
    vscroll: "automatic",
    child: Box({
        vertical: true,
        className: 'spacing-v-10',
        children: [,
            Music(),
            Translate(),
            QuickScripts(),
            Conversions(),
            ColorPicker(),
            Box({ vexpand: true }),
            Name(),
        ]
    })
});
