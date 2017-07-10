Generates a pac URI, according to windows global settings, using WinHTTP API
===============================

Installation
============

Then, just run

	npm install windows-pac-resolver

API
===

	const wpr = require('windows-pac-resolver');
	const pacURI = wpr.getPACUri();

### getPACUri()
Returns a "pac+<protoco>://..." URI, with the PAC file configured for the system. Returns `undefined` if no proxy is configured 

License
=======

MIT
