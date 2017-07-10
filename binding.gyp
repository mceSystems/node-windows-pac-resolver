{
	"targets": [
		{
			"includes": [
				"auto.gypi"
			],
			"sources": [
				"native\\winhttpBindings.cpp"
			],
			"libraries": [ "WinHTTP.lib" ]
		}
	],
	"includes": [
		"auto-top.gypi"
	]
}
