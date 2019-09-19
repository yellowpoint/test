//微信jsdk 1.3.2开始
! function(e, n) {
	"function" == typeof define && (define.amd || define.cmd) ? define(function() {
		return n(e)
	}) : n(e, !0)
}(this, function(e, n) {
	function i(n, i, t) {
		e.WeixinJSBridge ? WeixinJSBridge.invoke(n, o(i), function(e) {
			c(n, e, t)
		}) : u(n, t)
	}

	function t(n, i, t) {
		e.WeixinJSBridge ? WeixinJSBridge.on(n, function(e) {
			t && t.trigger && t.trigger(e), c(n, e, i)
		}) : t ? u(n, t) : u(n, i)
	}

	function o(e) {
		return e = e || {}, e.appId = C.appId, e.verifyAppId = C.appId, e.verifySignType = "sha1", e.verifyTimestamp = C.timestamp + "", e.verifyNonceStr = C.nonceStr, e.verifySignature = C.signature, e
	}

	function r(e) {
		return {
			timeStamp: e.timestamp + "",
			nonceStr: e.nonceStr,
			package: e.package,
			paySign: e.paySign,
			signType: e.signType || "SHA1"
		}
	}

	function a(e) {
		return e.postalCode = e.addressPostalCode, delete e.addressPostalCode, e.provinceName = e.proviceFirstStageName, delete e.proviceFirstStageName, e.cityName = e.addressCitySecondStageName, delete e.addressCitySecondStageName, e.countryName = e.addressCountiesThirdStageName, delete e.addressCountiesThirdStageName, e.detailInfo = e.addressDetailInfo, delete e.addressDetailInfo, e
	}

	function c(e, n, i) {
		"openEnterpriseChat" == e && (n.errCode = n.err_code), delete n.err_code, delete n.err_desc, delete n.err_detail;
		var t = n.errMsg;
		t || (t = n.err_msg, delete n.err_msg, t = s(e, t), n.errMsg = t), (i = i || {})._complete && (i._complete(n), delete i._complete), t = n.errMsg || "", C.debug && !i.isInnerInvoke && alert(JSON.stringify(n));
		var o = t.indexOf(":");
		switch(t.substring(o + 1)) {
			case "ok":
				i.success && i.success(n);
				break;
			case "cancel":
				i.cancel && i.cancel(n);
				break;
			default:
				i.fail && i.fail(n)
		}
		i.complete && i.complete(n)
	}

	function s(e, n) {
		var i = e,
			t = v[i];
		t && (i = t);
		var o = "ok";
		if(n) {
			var r = n.indexOf(":");
			"confirm" == (o = n.substring(r + 1)) && (o = "ok"), "failed" == o && (o = "fail"), -1 != o.indexOf("failed_") && (o = o.substring(7)), -1 != o.indexOf("fail_") && (o = o.substring(5)), "access denied" != (o = (o = o.replace(/_/g, " ")).toLowerCase()) && "no permission to execute" != o || (o = "permission denied"), "config" == i && "function not exist" == o && (o = "ok"), "" == o && (o = "fail")
		}
		return n = i + ":" + o
	}

	function d(e) {
		if(e) {
			for(var n = 0, i = e.length; n < i; ++n) {
				var t = e[n],
					o = h[t];
				o && (e[n] = o)
			}
			return e
		}
	}

	function u(e, n) {
		if(!(!C.debug || n && n.isInnerInvoke)) {
			var i = v[e];
			i && (e = i), n && n._complete && delete n._complete, console.log('"' + e + '",', n || "")
		}
	}

	function l(e) {
		if(!(w || T || C.debug || x < "6.0.2" || A.systemType < 0)) {
			var n = new Image;
			A.appId = C.appId, A.initTime = V.initEndTime - V.initStartTime, A.preVerifyTime = V.preVerifyEndTime - V.preVerifyStartTime, N.getNetworkType({
				isInnerInvoke: !0,
				success: function(e) {
					A.networkType = e.networkType;
					var i = "https://open.weixin.qq.com/sdk/report?v=" + A.version + "&o=" + A.isPreVerifyOk + "&s=" + A.systemType + "&c=" + A.clientVersion + "&a=" + A.appId + "&n=" + A.networkType + "&i=" + A.initTime + "&p=" + A.preVerifyTime + "&u=" + A.url;
					n.src = i
				}
			})
		}
	}

	function p() {
		return(new Date).getTime()
	}

	function f(n) {
		k && (e.WeixinJSBridge ? "preInject" === I.__wxjsjs__isPreInject ? I.addEventListener && I.addEventListener("WeixinJSBridgeReady", n, !1) : n() : I.addEventListener && I.addEventListener("WeixinJSBridgeReady", n, !1))
	}

	function m() {
		N.invoke || (N.invoke = function(n, i, t) {
			e.WeixinJSBridge && WeixinJSBridge.invoke(n, o(i), t)
		}, N.on = function(n, i) {
			e.WeixinJSBridge && WeixinJSBridge.on(n, i)
		})
	}

	function g(e) {
		if("string" == typeof e && e.length > 0) {
			var n = e.split("?")[0],
				i = e.split("?")[1];
			return n += ".html", void 0 !== i ? n + "?" + i : n
		}
	}
	if(!e.jWeixin) {
		var h = {
				config: "preVerifyJSAPI",
				onMenuShareTimeline: "menu:share:timeline",
				onMenuShareAppMessage: "menu:share:appmessage",
				onMenuShareQQ: "menu:share:qq",
				onMenuShareWeibo: "menu:share:weiboApp",
				onMenuShareQZone: "menu:share:QZone",
				previewImage: "imagePreview",
				getLocation: "geoLocation",
				openProductSpecificView: "openProductViewWithPid",
				addCard: "batchAddCard",
				openCard: "batchViewCard",
				chooseWXPay: "getBrandWCPayRequest",
				openEnterpriseRedPacket: "getRecevieBizHongBaoRequest",
				startSearchBeacons: "startMonitoringBeacons",
				stopSearchBeacons: "stopMonitoringBeacons",
				onSearchBeacons: "onBeaconsInRange",
				consumeAndShareCard: "consumedShareCard",
				openAddress: "editAddress"
			},
			v = function() {
				var e = {};
				for(var n in h) e[h[n]] = n;
				return e
			}(),
			I = e.document,
			S = I.title,
			y = navigator.userAgent.toLowerCase(),
			_ = navigator.platform.toLowerCase(),
			w = !(!_.match("mac") && !_.match("win")),
			T = -1 != y.indexOf("wxdebugger"),
			k = -1 != y.indexOf("micromessenger"),
			M = -1 != y.indexOf("android"),
			P = -1 != y.indexOf("iphone") || -1 != y.indexOf("ipad"),
			x = function() {
				var e = y.match(/micromessenger\/(\d+\.\d+\.\d+)/) || y.match(/micromessenger\/(\d+\.\d+)/);
				return e ? e[1] : ""
			}(),
			V = {
				initStartTime: p(),
				initEndTime: 0,
				preVerifyStartTime: 0,
				preVerifyEndTime: 0
			},
			A = {
				version: 1,
				appId: "",
				initTime: 0,
				preVerifyTime: 0,
				networkType: "",
				isPreVerifyOk: 1,
				systemType: P ? 1 : M ? 2 : -1,
				clientVersion: x,
				url: encodeURIComponent(location.href)
			},
			C = {},
			L = {
				_completes: []
			},
			B = {
				state: 0,
				data: {}
			};
		f(function() {
			V.initEndTime = p()
		});
		var E = !1,
			O = [],
			N = {
				config: function(e) {
					C = e, u("config", e);
					var n = !1 !== C.check;
					f(function() {
						if(n) i(h.config, {
							verifyJsApiList: d(C.jsApiList)
						}, function() {
							L._complete = function(e) {
								V.preVerifyEndTime = p(), B.state = 1, B.data = e
							}, L.success = function(e) {
								A.isPreVerifyOk = 0
							}, L.fail = function(e) {
								L._fail ? L._fail(e) : B.state = -1
							};
							var e = L._completes;
							return e.push(function() {
								l()
							}), L.complete = function(n) {
								for(var i = 0, t = e.length; i < t; ++i) e[i]();
								L._completes = []
							}, L
						}()), V.preVerifyStartTime = p();
						else {
							B.state = 1;
							for(var e = L._completes, t = 0, o = e.length; t < o; ++t) e[t]();
							L._completes = []
						}
					}), m()
				},
				ready: function(e) {
					0 != B.state ? e() : (L._completes.push(e), !k && C.debug && e())
				},
				error: function(e) {
					x < "6.0.2" || (-1 == B.state ? e(B.data) : L._fail = e)
				},
				checkJsApi: function(e) {
					var n = function(e) {
						var n = e.checkResult;
						for(var i in n) {
							var t = v[i];
							t && (n[t] = n[i], delete n[i])
						}
						return e
					};
					i("checkJsApi", {
						jsApiList: d(e.jsApiList)
					}, (e._complete = function(e) {
						if(M) {
							var i = e.checkResult;
							i && (e.checkResult = JSON.parse(i))
						}
						e = n(e)
					}, e))
				},
				onMenuShareTimeline: function(e) {
					t(h.onMenuShareTimeline, {
						complete: function() {
							i("shareTimeline", {
								title: e.title || S,
								desc: e.title || S,
								img_url: e.imgUrl || "",
								link: e.link || location.href,
								type: e.type || "link",
								data_url: e.dataUrl || ""
							}, e)
						}
					}, e)
				},
				onMenuShareAppMessage: function(e) {
					t(h.onMenuShareAppMessage, {
						complete: function() {
							i("sendAppMessage", {
								title: e.title || S,
								desc: e.desc || "",
								link: e.link || location.href,
								img_url: e.imgUrl || "",
								type: e.type || "link",
								data_url: e.dataUrl || ""
							}, e)
						}
					}, e)
				},
				onMenuShareQQ: function(e) {
					t(h.onMenuShareQQ, {
						complete: function() {
							i("shareQQ", {
								title: e.title || S,
								desc: e.desc || "",
								img_url: e.imgUrl || "",
								link: e.link || location.href
							}, e)
						}
					}, e)
				},
				onMenuShareWeibo: function(e) {
					t(h.onMenuShareWeibo, {
						complete: function() {
							i("shareWeiboApp", {
								title: e.title || S,
								desc: e.desc || "",
								img_url: e.imgUrl || "",
								link: e.link || location.href
							}, e)
						}
					}, e)
				},
				onMenuShareQZone: function(e) {
					t(h.onMenuShareQZone, {
						complete: function() {
							i("shareQZone", {
								title: e.title || S,
								desc: e.desc || "",
								img_url: e.imgUrl || "",
								link: e.link || location.href
							}, e)
						}
					}, e)
				},
				startRecord: function(e) {
					i("startRecord", {}, e)
				},
				stopRecord: function(e) {
					i("stopRecord", {}, e)
				},
				onVoiceRecordEnd: function(e) {
					t("onVoiceRecordEnd", e)
				},
				playVoice: function(e) {
					i("playVoice", {
						localId: e.localId
					}, e)
				},
				pauseVoice: function(e) {
					i("pauseVoice", {
						localId: e.localId
					}, e)
				},
				stopVoice: function(e) {
					i("stopVoice", {
						localId: e.localId
					}, e)
				},
				onVoicePlayEnd: function(e) {
					t("onVoicePlayEnd", e)
				},
				uploadVoice: function(e) {
					i("uploadVoice", {
						localId: e.localId,
						isShowProgressTips: 0 == e.isShowProgressTips ? 0 : 1
					}, e)
				},
				downloadVoice: function(e) {
					i("downloadVoice", {
						serverId: e.serverId,
						isShowProgressTips: 0 == e.isShowProgressTips ? 0 : 1
					}, e)
				},
				translateVoice: function(e) {
					i("translateVoice", {
						localId: e.localId,
						isShowProgressTips: 0 == e.isShowProgressTips ? 0 : 1
					}, e)
				},
				chooseImage: function(e) {
					i("chooseImage", {
						scene: "1|2",
						count: e.count || 9,
						sizeType: e.sizeType || ["original", "compressed"],
						sourceType: e.sourceType || ["album", "camera"]
					}, (e._complete = function(e) {
						if(M) {
							var n = e.localIds;
							n && (e.localIds = JSON.parse(n))
						}
					}, e))
				},
				getLocation: function(e) {},
				previewImage: function(e) {
					i(h.previewImage, {
						current: e.current,
						urls: e.urls
					}, e)
				},
				uploadImage: function(e) {
					i("uploadImage", {
						localId: e.localId,
						isShowProgressTips: 0 == e.isShowProgressTips ? 0 : 1
					}, e)
				},
				downloadImage: function(e) {
					i("downloadImage", {
						serverId: e.serverId,
						isShowProgressTips: 0 == e.isShowProgressTips ? 0 : 1
					}, e)
				},
				getLocalImgData: function(e) {
					!1 === E ? (E = !0, i("getLocalImgData", {
						localId: e.localId
					}, (e._complete = function(e) {
						if(E = !1, O.length > 0) {
							var n = O.shift();
							wx.getLocalImgData(n)
						}
					}, e))) : O.push(e)
				},
				getNetworkType: function(e) {
					var n = function(e) {
						var n = e.errMsg;
						e.errMsg = "getNetworkType:ok";
						var i = e.subtype;
						if(delete e.subtype, i) e.networkType = i;
						else {
							var t = n.indexOf(":"),
								o = n.substring(t + 1);
							switch(o) {
								case "wifi":
								case "edge":
								case "wwan":
									e.networkType = o;
									break;
								default:
									e.errMsg = "getNetworkType:fail"
							}
						}
						return e
					};
					i("getNetworkType", {}, (e._complete = function(e) {
						e = n(e)
					}, e))
				},
				openLocation: function(e) {
					i("openLocation", {
						latitude: e.latitude,
						longitude: e.longitude,
						name: e.name || "",
						address: e.address || "",
						scale: e.scale || 28,
						infoUrl: e.infoUrl || ""
					}, e)
				},
				getLocation: function(e) {
					e = e || {}, i(h.getLocation, {
						type: e.type || "wgs84"
					}, (e._complete = function(e) {
						delete e.type
					}, e))
				},
				hideOptionMenu: function(e) {
					i("hideOptionMenu", {}, e)
				},
				showOptionMenu: function(e) {
					i("showOptionMenu", {}, e)
				},
				closeWindow: function(e) {
					i("closeWindow", {}, e = e || {})
				},
				hideMenuItems: function(e) {
					i("hideMenuItems", {
						menuList: e.menuList
					}, e)
				},
				showMenuItems: function(e) {
					i("showMenuItems", {
						menuList: e.menuList
					}, e)
				},
				hideAllNonBaseMenuItem: function(e) {
					i("hideAllNonBaseMenuItem", {}, e)
				},
				showAllNonBaseMenuItem: function(e) {
					i("showAllNonBaseMenuItem", {}, e)
				},
				scanQRCode: function(e) {
					i("scanQRCode", {
						needResult: (e = e || {}).needResult || 0,
						scanType: e.scanType || ["qrCode", "barCode"]
					}, (e._complete = function(e) {
						if(P) {
							var n = e.resultStr;
							if(n) {
								var i = JSON.parse(n);
								e.resultStr = i && i.scan_code && i.scan_code.scan_result
							}
						}
					}, e))
				},
				openAddress: function(e) {
					i(h.openAddress, {}, (e._complete = function(e) {
						e = a(e)
					}, e))
				},
				openProductSpecificView: function(e) {
					i(h.openProductSpecificView, {
						pid: e.productId,
						view_type: e.viewType || 0,
						ext_info: e.extInfo
					}, e)
				},
				addCard: function(e) {
					for(var n = e.cardList, t = [], o = 0, r = n.length; o < r; ++o) {
						var a = n[o],
							c = {
								card_id: a.cardId,
								card_ext: a.cardExt
							};
						t.push(c)
					}
					i(h.addCard, {
						card_list: t
					}, (e._complete = function(e) {
						var n = e.card_list;
						if(n) {
							for(var i = 0, t = (n = JSON.parse(n)).length; i < t; ++i) {
								var o = n[i];
								o.cardId = o.card_id, o.cardExt = o.card_ext, o.isSuccess = !!o.is_succ, delete o.card_id, delete o.card_ext, delete o.is_succ
							}
							e.cardList = n, delete e.card_list
						}
					}, e))
				},
				chooseCard: function(e) {
					i("chooseCard", {
						app_id: C.appId,
						location_id: e.shopId || "",
						sign_type: e.signType || "SHA1",
						card_id: e.cardId || "",
						card_type: e.cardType || "",
						card_sign: e.cardSign,
						time_stamp: e.timestamp + "",
						nonce_str: e.nonceStr
					}, (e._complete = function(e) {
						e.cardList = e.choose_card_info, delete e.choose_card_info
					}, e))
				},
				openCard: function(e) {
					for(var n = e.cardList, t = [], o = 0, r = n.length; o < r; ++o) {
						var a = n[o],
							c = {
								card_id: a.cardId,
								code: a.code
							};
						t.push(c)
					}
					i(h.openCard, {
						card_list: t
					}, e)
				},
				consumeAndShareCard: function(e) {
					i(h.consumeAndShareCard, {
						consumedCardId: e.cardId,
						consumedCode: e.code
					}, e)
				},
				chooseWXPay: function(e) {
					i(h.chooseWXPay, r(e), e)
				},
				openEnterpriseRedPacket: function(e) {
					i(h.openEnterpriseRedPacket, r(e), e)
				},
				startSearchBeacons: function(e) {
					i(h.startSearchBeacons, {
						ticket: e.ticket
					}, e)
				},
				stopSearchBeacons: function(e) {
					i(h.stopSearchBeacons, {}, e)
				},
				onSearchBeacons: function(e) {
					t(h.onSearchBeacons, e)
				},
				openEnterpriseChat: function(e) {
					i("openEnterpriseChat", {
						useridlist: e.userIds,
						chatname: e.groupName
					}, e)
				},
				launchMiniProgram: function(e) {
					i("launchMiniProgram", {
						targetAppId: e.targetAppId,
						path: g(e.path),
						envVersion: e.envVersion
					}, e)
				},
				miniProgram: {
					navigateBack: function(e) {
						e = e || {}, f(function() {
							i("invokeMiniProgramAPI", {
								name: "navigateBack",
								arg: {
									delta: e.delta || 1
								}
							}, e)
						})
					},
					navigateTo: function(e) {
						f(function() {
							i("invokeMiniProgramAPI", {
								name: "navigateTo",
								arg: {
									url: e.url
								}
							}, e)
						})
					},
					redirectTo: function(e) {
						f(function() {
							i("invokeMiniProgramAPI", {
								name: "redirectTo",
								arg: {
									url: e.url
								}
							}, e)
						})
					},
					switchTab: function(e) {
						f(function() {
							i("invokeMiniProgramAPI", {
								name: "switchTab",
								arg: {
									url: e.url
								}
							}, e)
						})
					},
					reLaunch: function(e) {
						f(function() {
							i("invokeMiniProgramAPI", {
								name: "reLaunch",
								arg: {
									url: e.url
								}
							}, e)
						})
					},
					postMessage: function(e) {
						f(function() {
							i("invokeMiniProgramAPI", {
								name: "postMessage",
								arg: e.data || {}
							}, e)
						})
					},
					getEnv: function(n) {
						f(function() {
							n({
								miniprogram: "miniprogram" === e.__wxjs_environment
							})
						})
					}
				}
			},
			b = 1,
			R = {};
		return I.addEventListener("error", function(e) {
			if(!M) {
				var n = e.target,
					i = n.tagName,
					t = n.src;
				if(("IMG" == i || "VIDEO" == i || "AUDIO" == i || "SOURCE" == i) && -1 != t.indexOf("wxlocalresource://")) {
					e.preventDefault(), e.stopPropagation();
					var o = n["wx-id"];
					if(o || (o = b++, n["wx-id"] = o), R[o]) return;
					R[o] = !0, wx.ready(function() {
						wx.getLocalImgData({
							localId: t,
							success: function(e) {
								n.src = e.localData
							}
						})
					})
				}
			}
		}, !0), I.addEventListener("load", function(e) {
			if(!M) {
				var n = e.target,
					i = n.tagName;
				n.src;
				if("IMG" == i || "VIDEO" == i || "AUDIO" == i || "SOURCE" == i) {
					var t = n["wx-id"];
					t && (R[t] = !1)
				}
			}
		}, !0), n && (e.wx = e.jWeixin = N), N
	}
});
//微信jsdk 1.3.2结束

var isLoginRefresh = false; //通过检测ajax有1001弹出登录，登录完成后是否刷新页面，可在需要刷新的页面将其改为true
//接口的域名
//泉哥本机地址
//	var	apiDomain = '//192.168.1.10:10085';
//本地服务器地址
//	var	apiDomain = '//192.168.1.249:9081';
//测试地址
//  var	apiDomain = '//api.51app.cn/test';
//真实地址
var apiDomain = '//api.51app.cn';
var devicePlatform; //设备判断 ios或android

//渠道推广 先从url上面取，没有再去cookie去取，防止在支付后后台返回的链接里面没有带channel
//如果取到的channel和cookie里的不一样也再去判断
var channel = GetQueryString('channel') || getCookie('channel') || 'etime';
var themeColor = getCookie('themeColor');
if(!themeColor || channel !== getCookie('channel')) {
	if(channel == 'i4') {
		themeColor = '#007aff'
	} else {
		themeColor = '#ff4f4f'
	}
}
setCookie('channel', channel)
setCookie('themeColor', themeColor)
$('.themeColor').css('background-color', themeColor);

function layerHint(text, time) {
	layer.open({
		content: text,
		skin: 'msg',
		time: time || 2 //2秒后自动关闭 
	});

}

//错误提示,截取所有ajax请求,对结果做判断  这个只有jq才有用
//但像验证码的接口，本身会返回300等来判断验证码是否正确，这个时候也弹出这个就不好了；
//那就需要单独处理，根据接口名来做区别对待
function errorTips() {
	! function(t) {
		function r(i) {
			if(n[i]) return n[i].exports;
			var o = n[i] = {
				exports: {},
				id: i,
				loaded: !1
			};
			return t[i].call(o.exports, o, o.exports, r), o.loaded = !0, o.exports
		}
		var n = {};
		return r.m = t, r.c = n, r.p = "", r(0)
	}([function(t, r) {
		! function(t) {
			t.hookAjax = function(t) {
				function r(t) {
					return function() {
						return this.hasOwnProperty(t + "_") ? this[t + "_"] : this.xhr[t]
					}
				}

				function n(r) {
					return function(n) {
						var i = this.xhr,
							o = this;
						return 0 != r.indexOf("on") ? void(this[r + "_"] = n) : void(t[r] ? i[r] = function() {
							t[r](o) || n.apply(i, arguments)
						} : i[r] = n)
					}
				}

				function i(r) {
					return function() {
						var n = [].slice.call(arguments);
						if(!t[r] || !t[r].call(this, n, this.xhr)) return this.xhr[r].apply(this.xhr, n)
					}
				}
				return window._ahrealxhr = window._ahrealxhr || XMLHttpRequest, XMLHttpRequest = function() {
					this.xhr = new window._ahrealxhr;
					for(var t in this.xhr) {
						var o = "";
						try {
							o = typeof this.xhr[t]
						} catch(t) {}
						"function" === o ? this[t] = i(t) : Object.defineProperty(this, t, {
							get: r(t),
							set: n(t)
						})
					}
				}, window._ahrealxhr
			}, t.unHookAjax = function() {
				window._ahrealxhr && (XMLHttpRequest = window._ahrealxhr), window._ahrealxhr = void 0
			}
		}(window)
	}]);

	hookAjax({

		onload: function(xhr) {
			var flag = true;
			var speUrlArr = [];
			var speUrl1 = '/login'; //登录接口会返回其他code，因此排除登录相关的两个接口
			speUrlArr.push(speUrl1)

			var speUrl2 = '/order/remind'; //提醒发货接口会返回其他code，因此排除
			speUrlArr.push(speUrl2)

			for(var i in speUrlArr) {
				if(new RegExp(speUrlArr[i]).test(xhr.responseURL)) {
					flag = false;
				}
			}

			function tips() {
				if($('.layui-m-layermain').length > 0) {
					setTimeout(function() {
						layerHint('哎呀，服务器有点问题，请刷新重试')
					}, 2000)
				} else {
					layerHint('哎呀，服务器有点问题，请刷新重试')
				}

			}

			if(xhr.status !== 200) {
				tips()
			} else {
				if(flag) {
					if(xhr.response[0] == "{") {
						//3001是抽奖页面用户没有次数后返回的 这里也排除
						if(JSON.parse(xhr.response).code !== 200 && JSON.parse(xhr.response).code !== 1001 && JSON.parse(xhr.response).code !== 3001) {
							tips()
						}
						//返回1001，表示token已过期，需要重新登录
						if(JSON.parse(xhr.response).code === 1001) {
							layerHint('您的登录已过期，请重新登录')
							loginLayer('body', function() {
								//登录之后判断isLoginRefresh 为true则刷新页面
								if(isLoginRefresh) {
									history.go(0)
								}
							})

						}
					}
				}

			}

		}

	})

}
errorTips();

//初始化fastclick
FastClick.attach(document.body);

//动态改变html的fontsize
(function changeFontSize() {
	var screenWidth = $(window).width();
	var htmlFontSize = screenWidth / 7.5;
	$("html").css("font-size", htmlFontSize);
	$(window).resize(function() {
		screenWidth = $(window).width();
		htmlFontSize = screenWidth / 7.5;
		$("html").css("font-size", htmlFontSize);
	});
})();
/*   js传值ios   为减小改动直接改为纯web跳转
 ==============================*/
var sending = function(id) {
	console.log(id);
	var dataArr = id.split(',')
	//如果传入的里面有http则跳转第二个参数的链接 ;(urlType,url)
	//如果没有则是跳转商品详情，如果有第三位参数且不为0则跳转有合成图的商品详情;(goodsType,goodsId)或者 (goodsType,goodsId,topicItemGoodsId)
	if(id.indexOf('http') > -1) {
		if(dataArr[0].indexOf('http') > -1) {
			location.href = '../' + dataArr[0].split('v1/html/')[1];
		} else {
			location.href = '../' + dataArr[1].split('v1/html/')[1];
		}

	} else {

		if(id.indexOf('searchInput') > -1) {
			//跳转搜索结果页面
			location.href = '../main/searchResult.html?key=' + (dataArr[1] || '');
		} else {
			var goodsType = dataArr[0];
			var goodsId = dataArr[1];
			var topicItemGoodsId = dataArr[2];
			if(topicItemGoodsId && topicItemGoodsId != '0') {
				location.href = '../main/goodsDetail_materialPriority.html?topicItemGoodsId=' + topicItemGoodsId + '&goodsId=' + goodsId;
			} else {
				location.href = '../main/goodsDetail.html?goodsId=' + goodsId + '&diyType=' + goodsType;
			}
		}

	}

};

//获取地址栏参数
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = decodeURI(window.location.search.substr(1)).match(reg);
	if(r !== null) return unescape(r[2]);
	return null;
};
// 转为unicode 编码  
function encodeUnicode(str) {
	var res = [];
	for(var i = 0; i < str.length; i++) {
		res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
	}
	return "\\u" + res.join("\\u");
}

// unicode解码  
function decodeUnicode(str) {
	str = str.replace(/\\/g, "%");
	return unescape(str);
}
//检测设备
(function checkDevice() {
	var u = navigator.userAgent;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
	if(isAndroid) {
		devicePlatform = 'android'
		return('android');
	}
	if(isiOS) {
		devicePlatform = 'ios'
		return('ios');
	}
})()

//加载数据
var loadData = function(url, async, successFunc) {
	$.ajax({
		url: url,
		type: 'GET',
		timeout: 60000,
		async: async,
		dataType: 'json',
		data: {},
		success: successFunc,
		error: function(error, textStatus) {
			console.log('冒的数据 搞毛呀');
			console.log(error);

			if(textStatus == 'timeout') {
				//超时的处理
				layer.open({
					content: '请求数据超时，请刷新页面',
					btn: ['确定'],
					yes: function(index) {
						location.reload()
						layer.close(index);

					}
				})

			}

		}
	});
};

//上传数据 
var uploadData = function(url, async, data, successFun, errorFun) {
	$.ajax({
		url: url,
		type: 'POST',
		timeout: 60000,
		async: async,
		dataType: 'json',
		data: data,
		success: successFun,
		error: function(error) {
			console.log('上传失败');
			console.log(error);
			errorFun(error);
		}

	});

};

//回到顶部
var goTop = function() {
	var $goTop = $('.gotoTop')
	$(window).on("scroll", function() {
		var top = $(window).scrollTop();
		if(top > 300) $goTop.show();
		if(top <= 300) $goTop.hide();
	});

	function scrollTo(who, target) {
		var nowTop = $(who).scrollTop(),
			timer = null,
			speed;
		speed = Math.round(nowTop / 20);
		timer = window.setInterval(function() {
			nowTop = nowTop - speed;
			if(nowTop <= target) {
				$(who).scrollTop(target);
				$goTop.hide();
				window.clearInterval(timer);
				return false;
			}
			$(who).scrollTop(nowTop);
		}, 20);
	}
	$goTop.on("click", function() {
		if(devicePlatform == "ios") {
			scrollTo(window, 1);
		} else {
			$(window).scrollTop(1);
		}
	});
};

//原生判断是否含有某个类名
var js_hasClass = (function() {
	var div = document.createElement("div");
	if("classList" in div && typeof div.classList.contains === "function") {
		return function(elem, className) {
			return elem.classList.contains(className);
		};
	} else {
		return function(elem, className) {
			var classes = elem.className.split(/\s+/);
			for(var i = 0; i < classes.length; i++) {
				if(classes[i] === className) {
					return true;
				}
			}
			return false;
		};
	}
})();

// RGB 转16进制
var rgbToHex = function(rgb) {
	// rgb(x, y, z)
	var color = rgb.toString().match(/\d+/g); // 把 x,y,z 推送到 color 数组里
	// var hex = "#";
	var hex = ""; //后台不需要 # 号

	for(var i = 0; i < 3; i++) {
		// 'Number.toString(16)' 是JS默认能实现转换成16进制数的方法.
		// 'color[i]' 是数组，要转换成字符串.
		// 如果结果是一位数，就在前面补零。例如： A变成0A
		hex += ("0" + Number(color[i]).toString(16)).slice(-2);
	}
	return hex;
};

// 16进制 转 RGB
var hexToRgb = function(hex) {
	var rgb = [];

	hex = hex.substr(1); //去除前缀 # 号

	if(hex.length === 3) { // 处理 "#abc" 成 "#aabbcc"
		hex = hex.replace(/(.)/g, '$1$1');
	}

	hex.replace(/../g, function(color) {
		rgb.push(parseInt(color, 0x10)); //按16进制将字符串转换为数字
	});

	return "rgb(" + rgb.join(",") + ")";
};

//获取原生元素的绝对x坐标（不是相对与浏览器的，是相对是document的那个）
function getElementLeft(element) {
	var actualLeft = element.offsetLeft;
	var current = element.offsetParent;
	while(current !== null) {
		actualLeft += current.offsetLeft;
		current = current.offsetParent;
	}
	return actualLeft;
}
//获取原生元素的绝对y坐标（不是相对与浏览器的，是相对是document的那个）
function getElementTop(element) {
	var actualTop = element.offsetTop;
	var current = element.offsetParent;
	while(current !== null) {
		actualTop += current.offsetTop;
		current = current.offsetParent;
	}
	return actualTop;
}

/**
 * 设置cookie
 * @param {string} name  键名
 * @param {string} value 键值
 * @param {integer} days cookie周期
 */
function setCookie(name, value, days) {
	if(days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	} else {
		var expires = "";
	}
	document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}
// 获取cookie
function getCookie(name) {
	var nameEQ = encodeURIComponent(name) + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while(c.charAt(0) == ' ') c = c.substring(1, c.length);
		if(c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
	}
	return null;
}
// 删除cookie
function deleteCookie(name) {
	setCookie(name, "", -1);
}

//添加图片后缀，改变大小，img是传入图片地址，w是想要的宽度，不传就默认200，最大4000多，最大返回原图大小
//https://help.aliyun.com/document_detail/44688.html?spm=5176.doc44957.6.939.V31dMk
function addImgSuffix(img, w) {
	var w = w || 200;
	return img + '?x-oss-process=image/resize,w_' + w;
}

//微信jsdk,分享 ;参数分别为标题，链接，图标，说明(不传则和标题一样)
function wxShare(title, link, imgUrl, desc) {

	var desc = desc || title;
	var url = '//api.51app.cn/diyapi/account/jssdk/signature?url=' + encodeURIComponent(location.href.split('#')[0]),
		successFunc = function(data) {

			if(data.code == 200) {
				data = data.data;
				wx.config({
					debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
					timestamp: data.timestamp, // 必填，生成签名的时间戳
					nonceStr: data.nonceStr, // 必填，生成签名的随机串
					signature: data.signature, // 必填，签名，见附录1
					jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				});
				wx.ready(function() {

					//分享到朋友圈
					wx.onMenuShareTimeline({
						title: title, // 分享标题
						link: link, // 分享链接，该链接域名必须与当前企业的可信域名一致
						imgUrl: imgUrl, // 分享图标
						success: function() {
							// 用户确认分享后执行的回调函数

						},
						cancel: function() {
							// 用户取消分享后执行的回调函数

						}
					});
					//分享给朋友
					wx.onMenuShareAppMessage({
						title: title, // 分享标题
						desc: desc, // 分享描述
						link: link, // 分享链接
						imgUrl: imgUrl, // 分享图标
						type: '', // 分享类型,music、video或link，不填默认为link
						dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
						success: function() {
							// 用户确认分享后执行的回调函数
						},
						cancel: function() {
							// 用户取消分享后执行的回调函数
						}
					});
					//分享到QQ
					wx.onMenuShareQQ({
						title: title, // 分享标题
						desc: desc, // 分享描述
						link: link, // 分享链接
						imgUrl: imgUrl, // 分享图标
						success: function() {
							// 用户确认分享后执行的回调函数
						},
						cancel: function() {
							// 用户取消分享后执行的回调函数
						}
					});
					//分享到腾讯微博
					wx.onMenuShareWeibo({
						title: title, // 分享标题
						desc: desc, // 分享描述
						link: link, // 分享链接
						imgUrl: imgUrl, // 分享图标
						success: function() {
							// 用户确认分享后执行的回调函数
						},
						cancel: function() {
							// 用户取消分享后执行的回调函数
						}
					});
					//分享到QQ空间
					wx.onMenuShareQZone({
						title: title, // 分享标题
						desc: desc, // 分享描述
						link: link, // 分享链接
						imgUrl: imgUrl, // 分享图标
						success: function() {
							// 用户确认分享后执行的回调函数
						},
						cancel: function() {
							// 用户取消分享后执行的回调函数
						}
					});
				});

			}

		};
	$.ajax({
		url: url,
		type: 'GET',
		timeout: 60000,
		async: true,
		dataType: 'json',
		data: {},
		success: successFunc,
		error: function(error) {
			console.log('冒的数据 搞毛呀');
			console.log(error);
		}
	});
}

wxShare('腾趣商城', location.href, 'https://api.51app.cn/webPage/tq/web/img/logo.png')

//加减计算
function accAdd(arg1, arg2) {
	var r1, r2, m, c;
	try {
		r1 = arg1.toString().split(".")[1].length;
	} catch(e) {
		r1 = 0;
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	} catch(e) {
		r2 = 0;
	}
	c = Math.abs(r1 - r2);
	m = Math.pow(10, Math.max(r1, r2));
	if(c > 0) {
		var cm = Math.pow(10, c);
		if(r1 > r2) {
			arg1 = Number(arg1.toString().replace(".", ""));
			arg2 = Number(arg2.toString().replace(".", "")) * cm;
		} else {
			arg1 = Number(arg1.toString().replace(".", "")) * cm;
			arg2 = Number(arg2.toString().replace(".", ""));
		}
	} else {
		arg1 = Number(arg1.toString().replace(".", ""));
		arg2 = Number(arg2.toString().replace(".", ""));
	}
	return(arg1 + arg2) / m;
}

function accSub(arg1, arg2) {
	var r1, r2, m, n;
	try {
		r1 = arg1.toString().split(".")[1].length;
	} catch(e) {
		r1 = 0;
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	} catch(e) {
		r2 = 0;
	}
	m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
	n = (r1 >= r2) ? r1 : r2;
	return((arg1 * m - arg2 * m) / m).toFixed(n);
}

var ScrollFix = function(elem) {
	var startY, startTopScroll;
	elem = elem || document.querySelector(elem);
	if(!elem) {
		return;
	}
	elem.addEventListener('touchstart', function(event) {
		startY = event.touches[0].pageY;
		startTopScroll = elem.scrollTop;

		if(startTopScroll <= 0)
			elem.scrollTop = 1;

		if(startTopScroll + elem.offsetHeight >= elem.scrollHeight)
			elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
	}, false);
};

//判断是否有表情，有则返回true
function isEmojiCharacter(substring) {

	for(var i = 0; i < substring.length; i++) {
		//		console.log(substring[i].charCodeAt())
		//发现有些表情没有检测到；后来添加的;后面的爱心 国旗等表情的编码是65039
		if(substring[i].charCodeAt() >= 55356 && substring[i].charCodeAt() <= 65039) {
			return true;
		}

		var hs = substring.charCodeAt(i);
		if(0xd800 <= hs && hs <= 0xdbff) {
			if(substring.length > 1) {
				var ls = substring.charCodeAt(i + 1);
				var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
				if(0x1d000 <= uc && uc <= 0x1f77f) {
					return true;
				}
			}
		} else if(substring.length > 1) {
			var ls = substring.charCodeAt(i + 1);
			if(ls == 0x20e3) {
				return true;
			}
		} else {
			if(0x2100 <= hs && hs <= 0x27ff) {
				return true;
			} else if(0x2B05 <= hs && hs <= 0x2b07) {
				return true;
			} else if(0x2934 <= hs && hs <= 0x2935) {
				return true;
			} else if(0x3297 <= hs && hs <= 0x3299) {
				return true;
			} else if(hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030 ||
				hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b ||
				hs == 0x2b50) {
				return true;
			}
		}
	}

}

//判断手机号是否有效
function isPhoneAvailable(phone) {
	var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
	if(!myreg.test(phone)) {
		return false;
	} else {
		return true;
	}
}

//公共商品 传入包含商品的那段json，返回拼接好的数据块，用的时候外层再定义一个dataBox来存放返回出来的数据，再append到dom里，这样的话可以控制每一个地方请求成功或失败后的不同措施
//topicItemGoodsId 商品详情中间层预设图片id，没有或传0则是跳转普通的商品详情，除此之外的话则跳转到有合成图的商品详情，
//diyType前面加了 - 的则是直接跳转到定制页面
//layout 商品布局的样式  如果为1则表示一排一个商品的布局，不传或传0则表示一排两个商品的布局
function loadGoods(goodsList, layout) {
	var dataBox = '',
		sendData = '',
		sendData2 = '',
		tips = '',
		diyType = '',
		activity = '',
		goods = [],
		topicItemGoodsId = 0,
		layout = layout || 0,
		coverImageUrl;

	$.each(goodsList, function(i) {

		//如果是包了一层的goodsList，则取出topicItemGoodsId  商品图片也取外层的
		if(goodsList[i].goods) {
			topicItemGoodsId = goodsList[i].id || 0;
			coverImageUrl = goodsList[i].coverImageUrl;
			goods[i] = goodsList[i].goods;
		} else {
			goods[i] = goodsList[i];
			coverImageUrl = goods[i].coverImageUrl
		}

		//安卓手机去掉所有照片书和台历（商品部分）
		if(devicePlatform == 'android') {
			if((/\照片书/.test(goods[i].name)) || (/\台历/.test(goods[i].name))) {
				return;
			}
		}
		sendData = '\'' + goods[i].diyType + ',' + goods[i].id + ',' + topicItemGoodsId + '\'';
		sendData2 = '\'-' + goods[i].diyType + ',' + goods[i].id + ',' + topicItemGoodsId + '\'';

		//	diyType:1精品,2刻字,3图印,4刻印,5台历,6冲印,7照片书
		//	activityLabel:1零元购,2免费领取,3新品,4满减
		switch(Number(goods[i].diyType)) {

			case 1:
				type = '<img class="hd-type" src="../../img/type/1.png" alt="精品"/>';
				break;
			case 2:
				type = '<img class="hd-type" src="../../img/type/2.png" alt="刻字"/>';
				break;
			case 3:
				type = '<img class="hd-type" src="../../img/type/3.png" alt="图印"/>';
				break;
			case 6:
				type = '<img class="hd-type" src="../../img/type/6.png" alt="冲印"/>';
				break;
			default:
				type = '';
				break;
		}

		tips = goods[i].nameIconImageUrl ? '<img class="hd-tips" src="' + goods[i].nameIconImageUrl + '" />' : '';
		activity = goods[i].activityName ? '<div class="hd-activity">' + goods[i].activityName + '</div>' : '';

		if(layout == 1) {
			dataBox += '<div class="hd-goodsBox" onclick="sending(' + sendData + ')"><div class="hd-img"><img src="' + coverImageUrl + '" alt="' + goods[i].name + '"  /></div><div class="hd-name">' + tips + '<span>' + goods[i].name + '</span></div><div class="hd-info">' + type + activity + '<div class="hd-vieFor">马上抢</div></div><div class="hd-price">￥<i>' + (goods[i].showPrice || 0).toFixed(2) + '</i></div><s class="hd-oldPrice">￥<i>' + (goods[i].originalPrice || 0).toFixed(2) + '</i></s><div class="hd-sale">' + goods[i].soldNum + '人购买</div></div>'
		} else {
			dataBox += '<div class="hd-goodsBox" onclick="sending(' + sendData + ')"><div class="hd-goods"><div class="hd-imgBox"><img src="' + coverImageUrl + '" alt="' + goods[i].name + '" /></div><div class="hd-name">' + tips + '<span>' + goods[i].name + '</span></div><div class="hd-info">' + type + activity + '</div><div class="hd-price">￥<i>' + (goods[i].showPrice || 0).toFixed(2) + '</i></div><div class="hd-sale">' + goods[i].soldNum + '人购买</div></div></div>';
		}

	});

	if(layout == 1) {
		dataBox = '<div class="hd-commonGoodsList2 clearfix">' + dataBox + '</div>';
	} else {
		dataBox = '<div class="hd-commonGoodsList clearfix">' + dataBox + '</div>';
	}

	setTimeout(function() {
		$('.hd-commonGoodsList .hd-goodsBox .hd-imgBox img').css("opacity", "1");
	}, 200);

	return dataBox;

}

//判断是否是iponeX 如果高度是724则是在微信里面，下面没有状态栏，底部栏需要往上顶
function isIphoneX() {
	//	var screenWidth = window.screen.width; 
	//	var screenHeight = window.screen.height;
	if(devicePlatform == 'ios' && $(window).height() == '724') {
		return true;
	} else {
		return false;
	}
}

//try {
//var res = wx.getSystemInfoSync()
//console.log(res.model)
// 	console.log('在')
//} catch (e) {
//console.log('不在')
//}

//var isMiniProgram = false;
wx.miniProgram.getEnv(function(res) {
	var isMiniProgram = res.miniprogram;
	if(isMiniProgram) {
		//		alert('在')
		$('.searchInput').text('在')
		try {
			wx.getNetworkType({
				success: function(res) {
					var networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
					$('.searchInput').text(networkType)
				}
			});

		} catch(e) {
			console.log('不能调用’')
			$('.searchInput').text('不能调用')
			// Do something when catch error
		}

//		wx.requestPayment({
//			'timeStamp': '',
//			'nonceStr': '',
//			'package': '',
//			'signType': 'MD5',
//			'paySign': '',
//			'success': function(res) {
//				console.log("支付成功")
//			},
//			'fail': function(res) {
//				console.log("支付失败")
//			}
//		})

	} else {
		//		alert('不在')
		$('.searchInput').text('不在')
	}
})

$('body').on('click', '#view-1 .top .name', function() {
	console.log('跳转小程序支付页面')
	wx.miniProgram.navigateTo({
		url: '/pages/pay?appid=123456'
	})
})




//wx.miniProgram.getEnv(function(res) {
//	var isMiniProgram = res.miniprogram;
//	if(isMiniProgram) {
//		wx.miniProgram.navigateTo({
//		url: '/pages/pay?appid='
//	})
//	}
//})