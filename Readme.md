Generates a pac URI, according to windows global settings, using WinHTTP API

Installation
============

Just run

	npm install windows-pac-resolver

API
===
	const wpr = require('windows-pac-resolver');
	const pacURI = wpr.getPACUri();

### getPACUri()
Returns a "pac+<protocol>://..." URI, with the PAC file configured for the system. Returns `undefined` if no proxy is configured.

If a proxy is manually configured, it will generate a PAC file on-the-fly and return a data uri with the proxy information.

Can be used with modules like [proxy-agent](https://www.npmjs.com/package/proxy-agent) or [pac-proxy-agent](https://www.npmjs.com/package/pac-proxy-agent)

License
=======

MIT
