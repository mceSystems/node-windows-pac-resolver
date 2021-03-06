#include "stdafx.h"
#include "napi.h"
#include <iostream>
#include <codecvt>
#include <windows.h>
#include <winhttp.h>

using namespace std;
using namespace Napi;

Value getIEProxyDetails(const CallbackInfo& info)
{
	wstring ret = L"{";
	WINHTTP_CURRENT_USER_IE_PROXY_CONFIG proxyInfo = {0};
	if (WinHttpGetIEProxyConfigForCurrentUser(&proxyInfo))
	{
		ret += L"\"autoConfigurationFileEnabled\": ";		
		ret.append(proxyInfo.fAutoDetect ? L"true" : L"false");
		ret.append(L",");
		if (proxyInfo.fAutoDetect)
		{
			ret.append(L"\"autoConfigurationFile\": \"");
			LPWSTR lpwszAutoConfigUrl = NULL;
			WinHttpDetectAutoProxyConfigUrl(WINHTTP_AUTO_DETECT_TYPE_DHCP | WINHTTP_AUTO_DETECT_TYPE_DNS_A, &lpwszAutoConfigUrl);
			if (NULL != lpwszAutoConfigUrl)
			{
				ret.append(lpwszAutoConfigUrl);
			}
			GlobalFree(lpwszAutoConfigUrl);
			ret.append(L"\",");
		}
		ret.append(L"\"manualConfigurationFile\": \"");
		if (NULL != proxyInfo.lpszAutoConfigUrl)
		{
			ret.append(proxyInfo.lpszAutoConfigUrl);
			GlobalFree(proxyInfo.lpszAutoConfigUrl);
		}
		ret.append(L"\",\"manualProxyAddress\": \"");
		if (NULL != proxyInfo.lpszProxy)
		{
			ret.append(proxyInfo.lpszProxy);
			GlobalFree(proxyInfo.lpszProxy);
		}
		ret.append(L"\",\"manualProxyAddressBypass\": \"");
		if (NULL != proxyInfo.lpszProxyBypass)
		{
			ret.append(proxyInfo.lpszProxyBypass);
			GlobalFree(proxyInfo.lpszProxyBypass);
		}
	}
	ret.append(L"\"}");

	using convert_type = codecvt_utf8<wchar_t>;
	wstring_convert<convert_type, wchar_t> converter;
	return String::New(info.Env(), converter.to_bytes(ret));
}

Object Init(Env env, Object exports) {
	exports.Set(String::New(env, "getIEProxyDetails"), Function::New<getIEProxyDetails>(env));
	return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)