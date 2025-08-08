const { Gtk } = imports.gi;
import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
const { execAsync, exec } = Utils;
const { Box, Button, Entry, EventBox, Icon, Label, Scrollable, Overlay, CenterBox, LevelBar, ProgressBar } = Widget;
import SidebarModule from './module.js';
import { MaterialIcon } from '../../.commonwidgets/materialicon.js';
import { setupCursorHover } from '../../.widgetutils/cursorhover.js';
const { Gdk } = imports.gi.Gdk;
const { Cairo }  = imports.cairo;
const { Pango } = imports.gi.Pango;
const { PangoCairo } = imports.gi.PangoCairo;


`spotify mpris:trackid             /com/spotify/track/3hxIUxnT27p5WcmjGUXNwx
spotify mpris:length              164571000
spotify mpris:artUrl              https://i.scdn.co/image/ab67616d0000b273350ab7a839c04bfd5225a9f5
spotify xesam:album               Shut up My Moms Calling
spotify xesam:albumArtist         Hotel Ugly
spotify xesam:artist              Hotel Ugly
spotify xesam:autoRating          0.88
spotify xesam:discNumber          1
spotify xesam:title               Shut up My Moms Calling
spotify xesam:trackNumber         1
spotify xesam:url                 https://open.spotify.com/track/3hxIUxnT27p5WcmjGUXNwx`


import { getRawMetadata } from '../../../services/musiccontrol.js';
import { getPosition } from '../../../services/musiccontrol.js';
import { getStatus } from '../../../services/musiccontrol.js';

const UPDATEINTERVAL = 2000;
const MAXWIDTH = 400;
const MAXWIDTHBAR = 1;
const ARTPATH = '/home/vaguesyntax/.cache/ags/coverart.jpg';
const OPACITY = 0.7;
var percentBar = 0;

var playing = false

    const NameBox = Box({
        
    })
    const NameWidget = Label({
        className: 'bar-music-playstate-playing',
        css: 'color: white;'
    })
    const ArtistWidget = Label({
        justification: 'fill',
        className: 'bar-music-playstate-playing',
        css: 'color: white;'
    }) 
    const PlayerLabel = Label({
        className: 'bar-music-playstate-playing',
        css: 'color: white;',
        label: 'Spotify'
    })
    const DurationLabel = Label({
        className: 'bar-music-playstate-playing',
        css: 'color: white;'
    })
    const DurationLabelBox = Box({

        vexpand: true,
        hexpand: true,

    })
    const NameCenterWidget = CenterBox({
        css: '',
        vertical: true,
        startWidget : NameWidget,
        centerWidget: ArtistWidget,
        
    });
    const NextButton = Widget.Button({
        setup: setupCursorHover,
        css: 'margin-left: 10px;',
        child: MaterialIcon('skip_next', 'large'),
        onClicked: () => execAsync(['playerctl', 'next', '--player=spotify']),
    })
    const PreviousButton = Widget.Button({
        setup: setupCursorHover,
        css: 'margin-right: 10px;',
        child: MaterialIcon('skip_previous', 'large'),
        onClicked: () => execAsync(['playerctl', 'previous', '--player=spotify']),
    })
    const PlayPauseButton = Widget.Button({
        setup: setupCursorHover,
        child: NameBox,
        onClicked: () => execAsync(['playerctl', 'play-pause', '--player=spotify']),
    });
    const MusicControl = CenterBox({
        startWidget: PreviousButton,
        centerWidget: PlayPauseButton,
        endWidget: NextButton

    });
    const CenterWidget = Box({
        vertical: false,
        children:[
            NameCenterWidget,
            Box({
                hexpand: true,
            }),
            MusicControl
        ]
    });
    const SongPosition = Box({
        
        vexpand: true,
        hexpand: true,
    });
    const InvertSongPosition = Box({
        hexpand: true,
        vexpand: true
    })
    
    const SongDurationBox = CenterBox({
        
        vertical: false,
        startWidget: SongPosition,
        centerWidget: InvertSongPosition,
    });
    const BottomCenterBox = CenterBox({
        
        vertical: true,
        startWidget: Box({
            hexpand: true
        }),
        centerWidget: SongDurationBox,
        endWidget: Box({
            hexpand: true
        })
    });
    const TestBox = CenterBox({
        css: 'background-color: rgba(0, 0, 0, ' + OPACITY + ');border-radius: 20px;',
        className: 'sidebar-module',
        vertical: true,
        startWidget: Box({
            
            children: [
                CenterBox({
                    
                    vertical: true,
                    startWidget: Box({hexpand:true}),
                    centerWidget: Box({
                        children: [
                            DurationLabel,
                            DurationLabelBox,
                            PlayerLabel
                        ]
                    }),
                    endWidget: Box({hexpand:true})
                })
                
            ]
        }),
        centerWidget: CenterWidget,
        endWidget: BottomCenterBox
    });
    const BarNameLabel = Label({
        className: 'bar-music-playstate-playing',
        css: 'color: white;font-size: 12px;margin-top: 6px;margin-bottom: 6px;',
        maxWidthChars: 20,
        //wrap: true,
        //useMarkup: true,
        justification: 'center',
        truncate: 'center',
    })
    const BarIconBox = Box({
        css : 'margin-left: 6px;',
    })
    const BarCircularProgress = Widget.CircularProgress({
        css: 'min-width: 24px;'
            + 'min-height: 24px;'
            + 'font-size: 3px;' 
            + 'background-color: #131313;' 
            + 'color: white;',
        rounded: true,
        inverted: false,
        startAt: 0.75,
        child: BarIconBox
    });
    const BarOverlay = CenterBox({
        
        vertical: true,
        css: 'background-color: rgba(0, 0, 0, ' + OPACITY + ');border-radius: 12px;min-width: 32px;',
        startWidget: Box({
            css : 'margin-left: 3px;margin-top: 3px;',
            children: [
                BarCircularProgress
            ]
        }),
        centerWidget: Box({
            css :'margin-left: 3px;',
            children: [
                BarNameLabel
                
            ]
        }),
    });
    const EventBoxBar = EventBox({
        child: BarOverlay,
        onPrimaryClick: () => execAsync(['playerctl', 'play-pause', '--player=spotify']).catch(print),
        onSecondaryClick: () => execAsync(['playerctl', 'next', '--player=spotify']).catch(print),
        onMiddleClick: () => execAsync(['playerctl', 'previous', '--player=spotify']).catch(print),
    })
    const MusicBox = Box({
        children: [
            TestBox
        ]
    });
    const MusicBar = Box({
        //hexpand: true, 
        children: [
            EventBoxBar
        ]
    })
    
    var Play = MaterialIcon('pause', 'norm');
    var Pause = MaterialIcon('play_arrow', 'norm');
    var PlayBar = MaterialIcon('pause', 'tiny');
    var PauseBar = MaterialIcon('play_arrow', 'tiny');
    
    var status
    var artUrl
    var title
    var position
    var length
    var percent
    var artist
    var metadata
    
    
    setInterval(updateMetadata, UPDATEINTERVAL);
    setInterval(checkPlaying, UPDATEINTERVAL);
    async function checkPlaying(){
        status = await getStatus();
        if (status == 'Playing'){
            playing = true
        }else {
            playing = false
        }
    }
    if (playing){
        setInterval(updatePlaying, UPDATEINTERVAL);
    }else {
        setInterval(updateStopped, UPDATEINTERVAL);
    }
    
    async function updatePlaying(){
        metadata = await getRawMetadata();
        title = await getData(metadata, 'title');
        if (BarNameLabel.label != title){
            updateMetadata();
        }
    }
    async function updateStopped() {
        
    }
    async function updateMetadata(){
        
        status = await getStatus();
        if (status != 'Playing'){
            NameBox.child = Pause;
            BarIconBox.child = PauseBar;
            return
        }

        metadata = await getRawMetadata();
        artUrl = await getData(metadata, 'artUrl');
        title = await getData(metadata, 'title');
        position = await getData(metadata, 'position');
        length = await getData(metadata, 'length');
        percent = MAXWIDTH * position / length;
        artist = await getData(metadata, 'artist');
        
        

        if (title.length > 40){
            NameWidget.label = title.substring(0, 40) + '...';
        }else
        {
            NameWidget.label = title;
        }
    
        
        percentBar =  parseFloat(position) / parseFloat(length);
        ArtistWidget.label = artist;
        DurationLabel.label = status + '         ' +  convertMinutes(Math.floor(position)) + ' - ' + convertMinutes(Math.floor(length)); 
        if (title.length > 20){
            BarNameLabel.label = title.substring(0, 20) + '...';
        }else {
            BarNameLabel.label = title
        }
        BarNameLabel.set_angle(270);
        


        BarCircularProgress.value = percentBar;
        if (status === 'Playing'){
            NameBox.child = Play;
            BarIconBox.child = PlayBar;
        }
        else{ 
            NameBox.child = Pause;
            BarIconBox.child = PauseBar;
        }
        
        MusicBox.css = `
                background-image: url("${artUrl}");
                min-height: 150px;
                background-position: center;
                border-radius: 20px;`;
        MusicBar.css = `
                background-image: url("${artUrl}");
                background-size: cover;
                background-position: center;
                border-radius: 12px;`;
        SongPosition.css = `
                background-color: white;
                border-radius: 20px;
                min-width: ${percent}px;
                min-height: 2px;`;
        InvertSongPosition.css = `
                min-width: ${MAXWIDTH - percent}px;`
        //--------------------------------------------//
    }
    
    const SM =  SidebarModule({
        icon: MaterialIcon('music_note', 'norm'),
        name: getString('Music'), 
        child: Box({
            //css: 'min-height: 100px;',
            vertical: true,
            className: 'spacing-v-5',
            css: 'min-width: 400px;',
            children: [
                MusicBox,
            ],
        })
    });
    export default () => {
        return SM;
    }
    


export function getMusicBox(){
    return Box({
        children:[
            MusicBar
        ]
    });
}



async function getData(metadata, data){
    if (data == 'position'){
        return await getPosition();
    }else if (data == 'status'){
        return await getStatus();
    }else {
        return getDataFromMetadata(metadata, data);
    }
}

function getDataFromMetadata(metadata, data){
    var lines = metadata.split('\n');
    if (data == 'length'){
        const nano = getElement(lines, 1);
        return JSON.stringify(nano/1000000);
    }else if (data == 'artUrl'){
        return getElement(lines, 2);
    }else if (data == 'artist'){
        return getElement(lines, 5);
    }else if (data == 'title'){
        return getElement(lines, 8);
    }else if (data == 'position'){
        return getPosition();
    }else {
        return 'NaN';
    }
}
function getElement(lines, number){
    const keys = lines[number].split(' ').filter(p => p !== '');
    const remainingElements = keys.slice(2);
    const result = remainingElements.join(' ');
    return result
}

function downloadCoverArt(url){
    execAsync(['wget', url, '-O', ARTPATH]);
    return ARTPATH;
}

function convertMinutes(second){
    var minutes = Math.floor(second / 60);
    var seconds = second % 60;
    return minutes + ':' + seconds;
}