const debug = require("debug")("windows-pac-resolver");
const path = require("path");

let lib;
function _loadModules() {
	if(lib){
		return;
	}
	lib = require("nbind").init(path.resolve(__dirname)).lib;
}

function isFilePath(path){
	return (0 === path.indexOf("\\\\")) || (":" === path[1] && ("\\" === path[2] || "/" === path[2]));
}

function switchToURI(path){
	if(!isFilePath(path)){
		return path;
	}
	if(0 !== path.indexOf("\\\\")){
		path = `/${path}`;
	}
	return `file://${path}`;
}

function toPACUri(path){
	if(!path){
		return "";
	}
	path = path.replace(/\\/g, "/")
	return `pac+${switchToURI(path)}`;
}

function getPACUri() {
	_loadModules();
	let ieProxyDetails;
	try {
		const rawDetails = lib.getIEProxyDetails().replace(/\\/g, "\\\\");
		ieProxyDetails = JSON.parse(rawDetails);
		debug(`Successfully retrieved IE proxy details: ${JSON.stringify(ieProxyDetails)}`);
	} catch (e) {
		debug(`Failed retrieving IE proxy details: ${e.message}`);
		return;
	}
	if(!ieProxyDetails){
		return;
	}
	if(ieProxyDetails.autoConfigurationFileEnabled){
		return toPACUri(ieProxyDetails.autoConfigurationFile);
	}
	if(ieProxyDetails.manualConfigurationFile){
		return toPACUri(ieProxyDetails.manualConfigurationFile);
	}
}

module.exports = {
	getPACUri,
}