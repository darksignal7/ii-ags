const { Gtk } = imports.gi;
import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
const { execAsync, exec } = Utils;
const { Box, Button, Entry, EventBox, Icon, Label, Scrollable, Overlay } = Widget;
import SidebarModule from './module.js';
import { MaterialIcon } from '../../.commonwidgets/materialicon.js';
import { setupCursorHover } from '../../.widgetutils/cursorhover.js';
import { truncateToPrecision } from '../../.miscutils/mathfuncs.js';



const FirstUnit = Entry({
    css: "background-color: rgba(255, 255, 255, 0.02);\
    border-radius: 14px;\
    min-height: 35px;",
    hexpand: true,
    widthChars: 10,
    className: 'txt-small techfont margin-left-2',
    placeholderText: '        English',
});

const SecondUnit = Entry({
    css: "background-color: rgba(255, 255, 255, 0.02);\
    border-radius: 14px;\
    min-height: 35px;",
    hexpand: true,
    widthChars: 10,
    className: 'txt-small techfont margin-left-2',
    placeholderText: '           Turkish',
});

async function runTranslateCommand(textToTranslate, sourceLanguage = 'en', targetLanguage = 'tr') {
    //const command = `trans -b -t tr -s en "${textToTranslate.replace(/"/g, '\\"')}"`;
    const command = `trans -b -t ${targetLanguage} -s ${sourceLanguage} "${textToTranslate.replace(/"/g, '\\"')}"`;

    const result = await execAsync(command);


        
    if (typeof result === 'object' && result !== null && 'stdout' in result) {
        const output = result.stdout.trim();
        return output;
    } else if (typeof result === 'string') {
        let cleanOutput = result.trim();
        cleanOutput = cleanOutput.replace(/\[nesne[\s\S]*?\]|\s*(jsobj|yerel)@0x[0-9a-fA-F]+\s*/g, '').trim();
        return cleanOutput;
    } else {
        return "Hata: Çeviri alınamadı.";
    }
}

FirstUnit.onAccept = async () => {
    const text = FirstUnit.text;
    if (text.trim() === "") {
        return;
    }
    const translatedResult = await runTranslateCommand(text, 'en', 'tr');
    SecondUnit.text = translatedResult;
};

SecondUnit.onAccept = async () => {
    const text = SecondUnit.text;
    if (text.trim() === "") {
        return;
    }
    const translatedResult = await runTranslateCommand(text, 'tr', 'en');
    FirstUnit.text = translatedResult;
};

export default () => SidebarModule({
    icon: MaterialIcon('translate', 'norm'),
    name: getString('Translate'), 
    child: Box({
        vertical: true,
        className: 'spacing-v-5',
        children: [
            FirstUnit,
            SecondUnit,
        ],
    })
});