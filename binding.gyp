{
	"targets": [
		{
			"includes": [
				"auto.gypi"
			],
			"sources": [
				"native\\winhttpBindings.cpp"
			],
			"libraries": [ 
				"WinHTTP.lib",
				"-DelayLoad:node.exe"
			],
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
