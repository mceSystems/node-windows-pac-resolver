{
	"targets": [
		{
			"includes": [
				"auto.gypi"
			],
			"sources": [
				"native\\winhttpBindings.cpp"
			],
			"libraries": [ "WinHTTP.lib" ],
			"msbuild_settings": {
				"ClCompile": {
					"RuntimeLibrary": "MultiThreaded"
				}
			}
		}
	],
	"includes": [
		"auto-top.gypi"
	]
}
