const { Gtk } = imports.gi;
import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
const { execAsync, exec } = Utils;
const { Box, Button, Entry, EventBox, Icon, Label, Scrollable, Overlay } = Widget;

var output = 'testing';




export async function getRawMetadata(){
	try {
		const sonuc = await execAsync(['playerctl', 'metadata', '--player=spotify']);
		output = sonuc;
	}finally{};
	return output;
}

export async function getPosition() {
	try {
		const sonuc = await execAsync(['playerctl', 'position', '--player=spotify']);
		output = sonuc;
	}finally{};
	return output;
}

export async function getStatus() {
	try {
		const sonuc = await execAsync(['playerctl', 'status', '--player=spotify']);
		output = sonuc;
	}finally{};
	return output;
}
