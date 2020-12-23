{
	"targets": [
		{
			"target_name": "binding",
			"sources": [
				"native\\winhttpBindings.cpp"
			],
			"include_dirs": [
                "<!@(node -p \"require('node-addon-api').include\")"
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
	]
}
