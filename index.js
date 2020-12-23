const debug = require("debug")("windows-pac-resolver");

let lib;
function _loadModules() {
	if (lib) {
		return;
	}
	lib = require("bindings")("binding");
}

function isFilePath(path) {
	return (0 === path.indexOf("\\\\")) || (":" === path[1] && ("\\" === path[2] || "/" === path[2]));
}

function generatePacFile(proxyDetails = "") {
	let data = `function FindProxyForURL(url, host) {`;

	if (typeof proxyDetails === "string" && proxyDetails.length > 0) {
		proxyDetails = `return "PROXY ${proxyDetails}";`;
	} else if (typeof proxyDetails === "object") {
		if (0 === Object.keys(proxyDetails).length) {
			proxyDetails = "";
		} else {
			proxyDetails = Object.keys(proxyDetails)
				.reduce((prev, curr) => {
					return `${prev} if (url.substr(0,${curr.length + 1}) === "${curr}:") { return "PROXY ${proxyDetails[curr]}"; }`
				}, "");
		}
	}

	return `${data} ${proxyDetails} return "DIRECT"; }`;
}

function extractProxyAddress(proxyDetails = "") {
	if (proxyDetails.indexOf("=") === -1) {
		return proxyDetails;
	}

	return proxyDetails
		.split(";")
		.reduce((prev, proxyProtocolDetails) => {
			const [protocol = "", url = ""] = proxyProtocolDetails.split("=", 2);
			if (protocol && url) {
				prev[protocol] = url;
			}
			return prev;
		}, {});
}

function generateDataURI(data) {
	return `data:text/plain;base64,${Buffer.from(data).toString("base64")}`;
}

function switchToURI(path) {
	if (!isFilePath(path)) {
		return path;
	}
	if (0 !== path.indexOf("\\\\")) {
		path = `/${path}`;
	}
	return `file://${path}`;
}

function toPACUri(path) {
	if (!path) {
		return "";
	}
	path = path.replace(/\\/g, "/")
	return `pac+${(switchToURI(path) || "").trim()}`;
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
	if (!ieProxyDetails) {
		return;
	}
	if (ieProxyDetails.autoConfigurationFileEnabled) {
		return toPACUri(ieProxyDetails.autoConfigurationFile);
	}
	if (ieProxyDetails.manualConfigurationFile) {
		return toPACUri(ieProxyDetails.manualConfigurationFile);
	}
	if (ieProxyDetails.manualProxyAddress) {
		const proxyDetails = extractProxyAddress(ieProxyDetails.manualProxyAddress);
		const proxyPacData = generatePacFile(proxyDetails);
		const proxyPacDataURI = generateDataURI(proxyPacData);
		return toPACUri(proxyPacDataURI);
	}
}

module.exports = {
	getPACUri,
}