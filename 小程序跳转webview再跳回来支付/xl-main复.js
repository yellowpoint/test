//定义全部变量 	
//商品Id
var goodsId = GetQueryString('goodsId'),
	//tradeOrderId 
	tradeOrderId = GetQueryString('tradeOrderId'),
	//商品属性组合id
	goodsStyleId,
	//商品该属性下的第几面的id
	goodsSideId,
	//商品名字
	goodsName,
	//用于有第二个ajax请求时，判断前一个是否完成的变量，未完成则终止它
	uploadImgXhr,
	//用户图片文件
	userImgFile,
	//用户再次添加图片会替换图片的提示，提示一次以后就不再提示
	layerReplaceImg1 = true,
	layerReplaceImg2 = true,
	token = getCookie('token') || '',
	temporaryToken = getCookie('temporaryToken'),
	//最多添加的元素个数
	maxAdditive = 10;
//渠道推广 先从url上面取，没有再去cookie去取，防止在支付后后台返回的链接里面没有带channel
var channel = GetQueryString('channel') || getCookie('channel') || 'etime';
setCookie('channel', channel)
	//主题色是否需要存在cookie里面，存的话可以节省一个获取主题色的请求，但如果不退出浏览器直接修改url上的channel主题色不会变

$('.themeColor-text').css('color', themeColor); //更换主题色  底部工具栏的字体颜色

$('body').on('touchstart', '._js-historyback,.ALLhistoryback', function() {
	window.history.back();
});

$('body').on('touchstart','.mainBack,.back',function(){
	mainView.router.back();
})


//首页
var indexPage = function() {
	goTop(); //回到顶部
	//刷新为你推荐中的四个小标签
	$('body').on('click', '.refreshLabel', function() {
		var url, dataBox, successFun;
		url = apiDomain + '/diyapi/home/label/random';
		successFun = function(data) {
			if (data.code == 200) {
				var labelList = data.data;
				dataBox = '';
				$.each(labelList, function(i) {
					sendData = '\'' + 'searchInput' + ',' + labelList[i].name + '\'';
					dataBox += '<li data-id="' + labelList[i].id + '" onClick="sending(' + sendData + ')">' + labelList[i].name + '</li>'
				});
				$('.labelLine ul').empty().append(dataBox);
			}
		}
		loadData(url, true, successFun);
	})

	//屏幕滚动，修改顶部搜索框背景
	$('body .page-content').on("scroll", function() {
		$('#view-1 .top').addClass('themeColor').addClass('topImg');
		$('.themeColor').css('background-color', themeColor);
		var top = $('.page-content').scrollTop();
		if (top <= 10) {
			$('#view-1 .top').removeClass('themeColor')
		};
	});

}

//购物车页面	
var shopCarPage = function() {
	//单选
	var priceArr = [];
	var numArr = [];

	//选择商家
	$('#view-2 .page').on('click', '.car-title .check-box', function() {
		var scrolltop = $('#view-2 #page-content').scrollTop();
		localStorage.setItem('scrolltop', scrolltop); //存储滚动条位置

		var length = $(this).parents('.car-title').siblings('.list-elem').length;
		if ($(this).find('._fm-check-1').hasClass('active-choose')) {
			$(this).parents('.car-title').siblings('.list-elem').find('._fm-check-1').removeClass('active-choose');
			$(this).find('._fm-check-1').removeClass('active-choose');
			priceMount();
			for (var i = 0; i < length; i++) {
				var elem = $(this).parents('.car-title').siblings('.list-elem')[i];
				elem.setAttribute("data-select", false);
				var isSelect = elem.getAttribute("data-select");
				var id = elem.getAttribute("data-id");
				var data = {
					"isSelected": isSelect,
					"id": id
				};
				sendNoRefresh(data);
			}
		} else {
			$(this).parents('.car-title').siblings('.list-elem').find('._fm-check-1').addClass('active-choose');
			$(this).find('._fm-check-1').addClass('active-choose');
			priceMount();
			for (var i = 0; i < length; i++) {
				var elem = $(this).parents('.car-title').siblings('.list-elem')[i];
				elem.setAttribute("data-select", true);
				var isSelect = elem.getAttribute("data-select");
				var id = elem.getAttribute("data-id");
				var data = {
					"isSelected": isSelect,
					"id": id
				};
				sendNoRefresh(data);
			}
		}

		var active = $(this).parents('.cus-page-inner').find('.car-list').length;
		var activeChoose = $(this).parents('.cus-page-inner').find('.car-title').find('.active-choose').length;
		if (activeChoose == active) {
			$('#view-2 .chooseAll ._fm-check-1').addClass('active-choose');
		} else {
			$('#view-2 .chooseAll ._fm-check-1').removeClass('active-choose');
		};

	});

	//选择商品
	$('#view-2 .page').on('click', '.list-elem .check-box', function() {
		var scrolltop = $('#view-2 #page-content').scrollTop();
		localStorage.setItem('scrolltop', scrolltop); //存储滚动条位置

		if ($(this).find('._fm-check-1').hasClass('active-choose')) {
			$(this).find('._fm-check-1').removeClass('active-choose');
			var elem = $(this).parents('.list-elem');
			elem.attr("data-select", "false");
		} else {
			$(this).find('._fm-check-1').addClass('active-choose');
			var elem = $(this).parents('.list-elem');
			elem.attr("data-select", "true");
		}
		priceMount();
		var active = $(this).parents('.car-list').find('.list-elem').length;
		var activeChoose = $(this).parents('.car-list').find('.list-elem').find('.active-choose').length;
		var allActive = $(this).parents('.page').find('.list-elem').length;
		var allActiveChoose = $(this).parents('.page').find('.list-elem').find('.active-choose').length;
		if (activeChoose == active) {
			$(this).parents('.car-list').find('.car-title').find('._fm-check-1').addClass('active-choose');
		} else {
			$(this).parents('.car-list').find('.car-title').find('._fm-check-1').removeClass('active-choose');
		};
		if (allActiveChoose == allActive) {
			$('.chooseAll ._fm-check-1').addClass('active-choose');
		} else {
			$('.chooseAll ._fm-check-1').removeClass('active-choose');
		};
		var isSelect = $(this).parents('.list-elem').attr("data-select");
		var id = $(this).parents('.list-elem').attr("data-id");
		var data = {
			"isSelected": isSelect,
			"id": id
		};
		sendNoRefresh(data);
	});

	//全选
	$('#view-2').on('click', '.addCar .chooseAll', function() {
		var scrolltop = $('#view-2 #page-content').scrollTop();
		localStorage.setItem('scrolltop', scrolltop); //存储滚动条位置

		var length = $('#view-2 .list-elem').length;
		var isChoose = $(this).find('i');
		if (isChoose.hasClass('active-choose')) {
			$('#view-2 ._fm-check-1').removeClass('active-choose');
			for (var i = 0; i < length; i++) {
				var elem = $('.list-elem')[i];
				elem.setAttribute("data-select", false);
				var isSelect = elem.getAttribute("data-select");
				var id = elem.getAttribute("data-id");
				var data = {
					"isSelected": isSelect,
					"id": id
				};
				sendNoRefresh(data);
			}
		} else {
			$('#view-2 ._fm-check-1').addClass('active-choose');
			for (var i = 0; i < length; i++) {
				var elem = $('.list-elem')[i];
				elem.setAttribute("data-select", true);
				var isSelect = elem.getAttribute("data-select");
				var id = elem.getAttribute("data-id");
				var data = {
					"isSelected": isSelect,
					"id": id
				};
				sendNoRefresh(data);
			}
		};
		priceMount(); //计算价格
	});

	//数量加
	$('#view-2 .page').off('click', '.op-r').on('click', '.op-r', function() {
		isShowSubtract();
		var scrolltop = $('#view-2 #page-content').scrollTop();
		localStorage.setItem('scrolltop', scrolltop); //存储滚动条位置

		var id = $(this).parents('.list-elem').attr("data-id");
		var val = $(this).siblings('.num').val()
		var newVal = Number(val) + 1;
		val = newVal;
		$(this).siblings('.num').val(val);
		var data = {
			"num": val,
			"id": id
		};
		isShowSubtract();
		sendNoRefresh(data);
		priceMount(); //计算价格
	})

	//数量减
	$('#view-2 .page').off('click', '.op-l').on('click', '.op-l', function() {
		isShowSubtract();
		var scrolltop = $('#view-2 #page-content').scrollTop();
		localStorage.setItem('scrolltop', scrolltop); //存储滚动条位置

		var id = $(this).parents('.list-elem').attr("data-id");
		var val = $(this).siblings('.num').val();
		if (val == '1') {

		} else {
			var newVal = Number(val) - 1;
			val = newVal;
			$(this).siblings('.num').val(val);
		};
		var data = {
			"num": val,
			"id": id
		};
		isShowSubtract();
		sendNoRefresh(data);
		priceMount(); //计算价格
	})

	//计算价格
	function priceMount() {
		var totalPrice = 0,
			totalNum = 0;
		var allChoose = $('.list-elem').length;
		var allMoney = [],
			numArr = [];
		for (var i = 0; i < allChoose; i++) {
			var choose = $('.list-elem').eq(i).find('._fm-check-1');
			var isChoose = $('.list-elem').eq(i).find('._fm-check-1').hasClass('active-choose');
			if (isChoose) {
				var priceHtml = $('.list-elem').eq(i).find('.count-num').text();
				var price = Number(priceHtml.split('￥')[1]);
				var numHtml = $('.list-elem').eq(i).find('.num').val();
				var num = Number(numHtml);
				var all = price * num;
				allMoney.push(all);
				numArr.push(num);
			}
		}
		for (var i in allMoney) {
			totalPrice += allMoney[i];
		}
		for (var i in numArr) {
			totalNum += numArr[i];
		}
		$('.count-all i').text(Number(totalNum));
		var Total = toDecimal2(totalPrice);
		var Total1 = Total.split('.')[0];
		var Total2 = Total.split('.')[1];
		$('.count-num i i').html(Total1 + '.<i class="iSmall">' + Total2 + '</i>');

	}

	//购物车滑动删除
	$('body .page').on('click', '.swipeout-delete', function() {
		var scrolltop = $('#view-2 #page-content').scrollTop();
		localStorage.setItem('scrolltop', scrolltop); //存储滚动条位置
		var id = $(this).parents('.list-elem').attr('data-id'); //获取当前商品购物车id
		var data = {
			'id': id,
		};
		deleteCar(data);
	})

	//购物车为空的时候点击去定制按钮跳转
	$('#view-2 .page').on('click', '.goToShop', function() {
		window.location.href = "index.html?channel=" + channel;
	})

	//结算
	$('#view-2').on('click', '.toPayMent', function() {
		window.localStorage.setItem('isComfirm', 1);
		var scrolltop = $('#view-2 #page-content').scrollTop();
		localStorage.setItem('scrolltop', scrolltop); //存储滚动条位置

		var toPayLength = $('.list-elem .active-choose').length;
		var arr = [];
		if (toPayLength) {
			for (var i = 0; i < toPayLength; i++) {
				var id = $('.list-elem .active-choose').eq(i).parents('.list-elem').attr('data-id');
				arr.push(id);
			}
			var data = {
				'cartIds': String(arr),
				'channel': channel,
				'token': token
			}
			loadPage();
			var url = apiDomain + "/diyapi/trade/preorder";
			$.ajax({
				url: url,
				type: 'POST',
				timeout: 0,
				async: true,
				data: data,
				dataType: 'json',
				success: function(data) {
					var tradeOrderId = data.data.tradeOrder.id;
					window.location.href = '../main/orderConfirm.html?channel=' + channel + '&tradeOrderId=' + tradeOrderId;

				},
				error: function(data) {
					console.log("修改失败")
				}
			})
		} else {
			myApp.alert('您什么都没有选中哦！', '购物车');
			$('#view-2 .toPayMent').css("opacity", .5)
			setTimeout(function() {
				$('#view-2 .toPayMent').css("opacity", 1)
			}, 1000)
		}
	})

	//购物车预览图 弹窗+轮播
	$('#view-2 .page').on('click', '.img-inner', function() {
		var length = $(this).parents('.goods-content').siblings('.showImgBox').find('img').length;
		var layerContent;
		layerContent = '<div class="swiper-container swiper-init layer-container" data-space-between="0" data-pagination=".swiper-pagination">';
		layerContent += '<div class="swiper-wrapper">';
		for (var i = 0; i < length; i++) {
			var imgUrl = $(this).parents('.goods-content').siblings('.showImgBox').find('img').eq(i).attr('src');
			layerContent += '<div class="swiper-slide"><a href="#"><img src="' + imgUrl + '" alt="banner" class="layerImg" style="display:block;padding:0"></a></div>';
		}
		layerContent += '</div><div class="swiper-pagination"></div></div>';
		layer.open({
			type: 1,
			skin: '', //样式类名
			closeBtn: 0, //不显示关闭按钮
			anim: 2,
			shadeClose: true, //开启遮罩关闭
			content: layerContent
		})
		var sWidth = $(window).width();
		$('.layui-m-layercont').css({
			'width': sWidth + 'px'
		});
		$('.layerImg').css({
			'width': sWidth + 'px'
		});
		$('.swiper-slide').css({
			'width': sWidth + 'px'
		});
		var mySwiper = myApp.swiper('.swiper-container', {
			pagination: '.swiper-pagination'
		});
	})

	//点击刷新空购物车推荐商品
	$('#view-2 .page').on('click', '.change', function() {
		var url, successFun, dataBox, dataBox1;
		dataBox = "";
		dataBox1 = "";
		url = apiDomain + '/diyapi/goods/recommend?token=' + token;
		successFun = function(data) {
			if (data.code == 200) {
				dataBox1 = "";
				$.each(data.data, function(i) {
					dataBox1 += '<div class="recomendGood"><a class="external recomendGoodLink" href="goodsDetail.html?goodsId=' + data.data[i].id + '&channel=' + channel + '"><img src="' + data.data[i].coverImageUrl + '"><div class="recomend-text"><div><h1>' + data.data[i].name + '</h1><p>' + (data.data[i].tagline || "定制方显品味") + '</p></div></div></a></div>'
				});
			}

			dataBox = '<div class="page-content emptyCar-page"><div class="content-block tablet-inset emptyCar"><div class="content-block-inner"><img src="../../img/emptyCar.png" alt="空购物车" /><div class="goToShopDiv"><a href="#" class="goToShop">去定制</a></div></div></div><div class="content-block-title recomend-title"><span class="recomend-noColor">为您推荐</span><a class="change">换一批<img src="../../img/refresh.png" /></a></div><div class="" style="width: 7.3rem;box-shadow: inherit;"><div class="" style="background-color: #EDEDED;"><div class="Recommend"><div class="RecommendList">' + dataBox1 + '</div></div></div></div></div>';
			$('#view-2 .page').empty().append(dataBox);
		}
		loadData(url, true, successFun);
	})

	//购物车页面编辑按钮
	$('.styleEdit').hide();
	$('.page').off('click', '.edit').on('click', '.edit', function() {
			if ($(this).text() == "完成") {
				$(this).text('编辑')
				for (var i = 0; i < $(this).parent('li').siblings('li').length; i++) {
					$(this).parents('li').siblings('li').eq(i).children('div').find('.style').eq(0).show();
					$(this).parents('li').siblings('li').eq(i).children('div').find('.style').eq(1).hide();

				}
			} else if ($(this).text() == "编辑") {
				$(this).text('完成')
				for (var i = 0; i < $(this).parent('li').siblings('li').length; i++) {
					$(this).parents('li').siblings('li').eq(i).children('div').find('.style').eq(1).show();
					$(this).parents('li').siblings('li').eq(i).children('div').find('.style').eq(0).hide();
				}
			}
		})
		//购物车选择材质
	$('.page').on('click', '.styleEdit', function() {
		var oldNum = $(this).parents('.goods-content').find('.total-num').find('input').val(); //获取当前商品数量
		var id = $(this).parents('.list-elem').attr('data-id'); //获取当前商品购物车id
		var GoodsStyleId = $(this).attr('data-goodsStyleId'); //获取当前商品的材质id
		var url, data, successFun, errorFun;
		url = apiDomain + '/diyapi/trade/cart/goods/style?cartId=' + id;
		successFun = function(data) {
			chooseAttribute('body', data, confirmAttribute); //调用黄典页面函数 
		};
		errorFun = function(data) {
			console.log('错误')
		}
		uploadData(url, true, data, successFun, errorFun);
		var confirmAttribute = function(data) {
			$('.attributePopupBox').hide();
			var scrolltop = $('#view-2 #page-content').scrollTop();
			localStorage.setItem('scrolltop', scrolltop); //存储滚动条位置 

			var goodsStyleId = data.id;
			var num = $('.attributePopupBox .count input').val();
			var data = {
				'id': id,
				'goodsStyleId': goodsStyleId,
				'num': num
			};
			if (GoodsStyleId == goodsStyleId && oldNum == num) {
				sendNoRefresh(data);
			} else {
				sendRefresh(data);
			}

		}
	})

	$('body').on('click', '.moreGoods', function() {
		window.location.href = "https://api.51app.cn/diyapi/channel/todownload?channel=" + channel + '&token=' + token;
	})

}

//"我的" 页面
var myPage = function() {
	$('.dom-noLoad').hide();
	//联系客服
	$('#view-3 .serviceList ul').on('click', '.service', function() {
			$('.themeColor').css('background-color', themeColor);
			mainView.router.loadPage('../other/cusService.html');
		})
		//常见问题
	$('#view-3 .serviceList ul').on('click', '.question', function() {
			mainView.router.loadPage('../other/questions.html');
		})
		//代理收益
	$('body .squareBox').on('click', '.agentProfit', function() {
			mainView.router.loadPage('../subject/agentAccount.html');
		})
		//收货地址
	$('body .squareBox').on('click', '.reciveAddress', function() {
			if ($(this).hasClass('noAddress')) {
				mainView.router.loadPage('../subject/editAddress.html');
			} else{
				mainView.router.loadPage('../subject/address.html');
			}
			
		})
		//管理收货地址
	$('#view-3 .page').on('click', '.myReciveAdress', function() {
		if ($('.myPage .page-content .content-block').eq(2).hasClass('no-address')) {
			$('#view-3 .bindNav').addClass('newAdd');
			mainView.router.loadPage('../subject/editAddress.html');
		} else {
			$('#view-3 .bindNav').removeClass('newAdd');
			mainView.router.loadPage('../subject/address.html');
			ADDress();
		}
		loadPage();
	})

	//编辑收货地址
	$('#view-3').on('click', '#address .add-address', function() {
		mainView.router.loadPage('../subject/editAddress.html')
	})

	//待付款
	$('#view-3').on('click', '.orderBar .toBePay', function() {
		window.location.href = 'myOrder.html?channel=' + channel + '&status=0'
	})

	//待收货
	$('#view-3').on('click', '.orderBar .toBeReceive', function() {
		window.location.href = 'myOrder.html?channel=' + channel + '&status=2'
	})

	//待发货
	$('#view-3').on('click', '.orderBar .toBeShip', function() {
		window.location.href = 'myOrder.html?channel=' + channel + '&status=1'
	})

	//全部订单
	$('#view-3').on('click', '.orderBar .allOrder', function() {
		window.location.href = 'myOrder.html?channel=' + channel + '&status='
	})
}

//商品详情页面
var goodsDetailPage = function() {
	//定制商品

	//精品
	//点击左下角购物车按钮 判断是否登录，如果登录了就跳转到购物车页面，如果没有登录，弹出登录页面
	$('#goodDetail .toCustumised').on('click', '.goShopCar', function() {
		token = getCookie('token')
		if (!token) {
			loginLayer('body')
			return;
		} else {
			window.location.href = 'shopCar.html?channel=' + channel;
		}
	})

	//点击加入购物车，判断是否登录			
	$('#goodDetail .toolbar').on('click', '.addCarNow', function() {
		$('#goodDetail .toolbar').addClass('Shopcar').removeClass('Shopbuy');
		var goodsId = $('body .detail-goodsOuter').attr('data-goodsId');
		var url, successFun;
		url = apiDomain + '/diyapi/goods/overview?goodsId=' + goodsId;
		successFun = function(data) {
			var operate = '';
			operate = 'addCarNow'; //记录下是点击了加入购物车
			chooseAttribute('body', data, confirmAttribute, operate); //加载选材质内容 
		};
		loadData(url, true, successFun);
		var confirmAttribute = function(data) {}
	})

	//点击立即购买
	$('#goodDetail .toolbar').on('click', '.bugNow', function() {
		$('#goodDetail .toolbar').addClass('Shopbuy').removeClass('Shopcar');
		var goodsId = $('body .detail-goodsOuter').attr('data-goodsId');
		var url, successFun;
		url = apiDomain + '/diyapi/goods/overview?goodsId=' + goodsId;
		successFun = function(data) {
			var operate = ''
			var operate = 'bugNow'; //记录下是点击了立即购买
			chooseAttribute('body', data, confirmAttribute, operate); //加载选材质内容 
		};
		loadData(url, true, successFun);
		var confirmAttribute = function(data) {}
	})

	$('body').on('click', '.startPlay', function() {
		$('video').show();
		CKobject.getObjectById('ckplayer_video').videoPlay();
		$('.detail-video').removeClass("startPlay")
	})

	function loadedHandler() {
		CKobject.getObjectById('ckplayer_video').addListener('pause', playHandler); //html5下的添加视频是否暂停监听
	}

	function playHandler() {
		$('video').hide();
		$('.detail-video').addClass("startPlay");
	}

	//在安卓系统上，显示返回按钮，对视频做处理，iOS不做处理
	$('body ._js-historyback').show();

	if (devicePlatform == 'android') {
		//监听屏幕滚动
		var firstTop = $('.page-content').scrollTop()
		$('.page-content').on('touchmove', function() {
			var startTop = $('.page-content').scrollTop()
			var t = startTop - firstTop;
			if (t !== 0) {
				CKobject.getObjectById('ckplayer_video').videoPause()
				$('video').hide();
				$('.detail-video').addClass("startPlay")
			}

		})

		$('body').on('click', '.startPlay', function() {
			$('video').show();
			CKobject.getObjectById('ckplayer_video').videoPlay();
			$('.detail-video').removeClass("startPlay")
		})
	}

	$('body').on('click', '.attributePopupBox .ap-confirm', function() {
		if (!$(this).hasClass('act')) {
			layerHint('请将材质选择完整')
		}

	})

	//点击材质确定按钮
	$('body').on('click', '.attributePopup .ap-confirm.act', function() {
		token = getCookie('token');
		var selectedStyleList = JSON.parse(localStorage.getItem('selectedStyleList'));
		var goodsId = selectedStyleList.goodsId;
		var goodsName = selectedStyleList.name;
		var previewList = selectedStyleList.previewList;
		var goodsStyleId = selectedStyleList.id;
		var num = Number($(".attributePopup .ap-numBox .count input").val())

		if ($(this).hasClass('addCarNow')) {
				//加入购物车
			if (!token) {
				layerHint('请先登录')
				setTimeout(function() {
					loginLayer('body', loadShopCarNum)
				}, 1000)

				return;
			}
			//loading层
			layer.open({
				content: '',
				type: 2,
				shadeClose: false
			});
			var url, successFun, data, errorFun;
			url = apiDomain + '/diyapi/trade/cart/add';
			data = {
				data: JSON.stringify({
					"token": token,
					"channel": channel,
					"goodsId": goodsId,
					"name": goodsName,
					"num": num,
					"goodsStyleId": goodsStyleId,
					"styleSideArray": []
				})
			}
			successFun = function(data) {

				$('.layui-m-layer').remove()
				if (data.code == 200) {
					layerHint('加入购物车成功')

					//点击加入购物车成功后调用talkingData
					var TDH5SDKItem = {
						"goodsId": goodsId,
						"name": goodsName,
						"unitPrice": Number($(".ap-price").text().slice(1)),
						"count": Number($(".attributePopup .ap-numBox .count input").val())
					}

//						TDH5SDK.iap.addItem(TDH5SDKItem);
					$('.attributePopup .ap-confirm').removeClass('act');

				} else {
					layerHint('加入购物车失败')
				}

				loadShopCarNum()

			}
			uploadData(url, true, data, successFun, errorFun)
			errorFun = function() {
				//提示
				$('.layui-m-layer').remove()
				layerHint('加入购物车失败，请重试')

			}
		} else {
			token = getCookie('token');
			temporaryToken = getCookie('temporaryToken');
			if (!token && !temporaryToken) {
				var url = apiDomain + '/diyapi/user/login/temp',
					successFun = function(data) {
						if (data.code == 200) {
							temporaryToken = data.data.token;
							setCookie('temporaryToken', temporaryToken, 10)
							sendUserData()
						}
					};
				uploadData(url, true, data, successFun);
				return;
			}

			function sendUserData() {
				//loading层
				layer.open({
					content: '',
					type: 2,
					shadeClose: false
				});
				var url, successFun, data, errorFun;
				url = apiDomain + '/diyapi/trade/preorder';
				data = {
					data: JSON.stringify({
						"token": getCookie('temporaryToken') || token,
						"channel": channel,
						"goodsId": goodsId,
						"name": goodsName,
						"num": num,
						"goodsStyleId": goodsStyleId,
						"styleSideArray": []
					})
				}
				successFun = function(data) {

					$('.layui-m-layer').remove()
					if (data.code == 200) {
						window.localStorage.setItem('isComfirm', 1);
						window.location.href = 'orderConfirm.html?channel=' + channel + '&tradeOrderId=' + data.data.id;
					} else {
						layerHint('购买失败，请重试')
					}

				}
				uploadData(url, true, data, successFun);

			}
			sendUserData()
		}
		$('.attributePopupBox').hide();
	});

	//详情页中选择材质弹窗 加减数量  ，写在外面，防止点击多次
	$('body').on('click', '.attributePopup .ap-numBox .count .add', function() {
		var num = $('.attributePopup .ap-numBox .count input').val();
		num++;
		if (num < 10000) {
			$('.attributePopup .ap-numBox .count input').val(num);
		}
		isShowSubtract1()
	});

	$('body').on('click', '.attributePopup .ap-numBox .count .subtract', function() {
		var num = $('.attributePopup .ap-numBox .count input').val();
		num--;
		if (num > 0) {
			$('.attributePopup .ap-numBox .count input').val(num);
		}
		isShowSubtract1()
	});

}

//确认订单页面
var orderConfirmPage = function() {
	var source;
	if (localStorage.getItem('source')) {
		source = localStorage.getItem('source')
	} else {
		source = '';
	}
	var appId = '952A04D6EAC24FAAB4E45623C75EDBBB';
	document.write("<s" + "cript id='td_tracking_sdk' type='text/javascript' src='https://h5.talkingdata.com/adt/h5sdk?ak=" + appId + "'></s" + "cript>");
	var tradeOrderId = GetQueryString("tradeOrderId"); //订单Id
	var deliveryAddressId = window.localStorage.getItem('chooseAddressId');

	//修改确认订单页面商品数量
	var modifyOrderNum = function() {
		var chooseAddressId = localStorage.getItem('chooseAddressId');
		var url, successFun, dataBox, dataBox1, dataBox2, dataBox3; //将data传给后端成功后，再向后端请求订单详情接口的数据
		successFun = function(data) {
			//优惠金额
			var exemptAmount = toDecimal2(data.data.exemptAmount);
			var exemptAmount1 = exemptAmount.split(".")[0];
			var exemptAmount2 = exemptAmount.split(".")[1];
			var tradeOrder = data.data.tradeOrder;
			//总金额
			var totalAmount = toDecimal2(tradeOrder.amount);
			var totalAmount1 = totalAmount.split(".")[0];
			var totalAmount2 = totalAmount.split(".")[1];
			//实际支付金额
			var payAmount = toDecimal2(tradeOrder.payAmount);
			var payAmount1 = payAmount.split(".")[0];
			var payAmount2 = payAmount.split(".")[1];
			//邮费
			var expressFee = toDecimal2(tradeOrder.expressFee);
			var expressFee1 = expressFee.split(".")[0];
			var expressFee2 = expressFee.split(".")[1];
			//总数量
			var totalNum = tradeOrder.num;
			//立减优惠
			var exemptAmount = toDecimal2(data.data.exemptAmount);
			var goodsList = data.data.tradeOrder.goodsList;
			var amount = toDecimal2(data.data.tradeOrder.amount); //将拿到的金额强制转换成带两位小数的浮点型
			var amount1 = amount.split(".")[0];
			var amount2 = amount.split(".")[1];
			if (data.code == 200) {
				dataBox = "";
				dataBox1 = "";
				dataBox2 = "";
				dataBox3 = "";
				$.each(goodsList, function(i) {
					var price = toDecimal2(goodsList[i].price); //将拿到的金额强制转换成带两位小数的浮点型
					var goodPrice1 = price.split(".")[0];
					var goodPrice2 = price.split(".")[1];
					if (goodsList.length == 1) {
						dataBox = '<div class="goods-content _fm-clearfix onegoods" data-goodsId="' + goodsList[i].goodsId + '" data-num="' + goodsList[i].num + '"  data-tradeOrderGoodsId="' + goodsList[i].id + '"><div class="_fm-img _fm-rel _fm-left"><div class="img-inner"><img class="lazy-loaded" alt="" src="' + goodsList[i].previewImageList[0].imageUrl + '"></div></div><div class="goods-msg _fm-rel"><h2 class="_fm-f-14 _fm-ellipsis">' + goodsList[i].name + '</h2><div class="price-count _fm-abs _fm-bz _fm-lz"><span class="count-num _fm-left _js-formatGoodsPrice haveDone" data-size="16px">￥<span style="font-size: 16px">' + goodPrice1 + '.</span>' + goodPrice2 + '</span><div class="count total-num"><div class="subtract op-l"><img src="../../img/ap-subtract.png"></div>	<input disabled="" type="text" value="' + goodsList[i].num + '" name="number" pattern="[0-9]*" maxlength="4" class="num"><div class="add op-r"><img src="../../img/ap-add.png"></div></div></div><p class="style _fm-overhide">' + goodsList[i].goodsStyleDesc + '</p></div></div>'
					} else {
						dataBox1 += '<div class="area-elem _fm-inline" data-goodsId="' + goodsList[i].goodsId + '"  data-num="' + goodsList[i].num + '"><div class="_fm-img"><div class="img-inner"><img src="' + goodsList[i].previewImageList[0].imageUrl + '" alt=""></div></div></div>';
						dataBox = '<a class="one-item img-show _fm-block" href="#goodsList"><div class="right-ico _fm-right"><span class="_fm-back-right">&nbsp;</span></div><div class="img-show-area"><div class="img-show-areaScroll">' + dataBox1 + '</div></div><div class="oneGood"><p class="one-item _fm-f-13 onePrice">￥' + amount1 + '.' + amount2 + '</p><p class="one-item _fm-f-13 oneNun">共' + totalNum + '件</p></div></a>';
						dataBox2 += '<section class="goods-content _fm-clearfix"><input name="isBoutique" class="isBoutique" value="1" type="hidden"><div class="_fm-img _fm-rel _fm-left"><div class="img-inner"><img class="lazy-loaded" alt="" src="' + goodsList[i].previewImageList[0].imageUrl + '"></div></div><div class="goods-msg _fm-rel"><h2 class="_fm-f-14 _fm-ellipsis">' + goodsList[i].name + '</h2><div class="price-count _fm-abs _fm-bz _fm-lz"><span class="count-num _fm-left _js-formatGoodsPrice haveDone" data-size="16px">￥<span style="font-size: 16px">' + goodPrice1 + '.</span>' + goodPrice2 + '</span><div class="total-num _fm-right">x<span class="num">' + goodsList[i].num + '</span></div></div><p class="style _fm-overhide">' + goodsList[i].goodsStyleDesc + '</p></div></section>';
					}
				});

				$('.goodsList .goods-detail').empty().append(dataBox2);
				$('.shoppingcar-confirm .goods-detailList').empty().append(dataBox);
				$('.shoppingcar-confirm .totalNum').text("共"+ data.data.tradeOrder.num +"件")
				//平安活动商品 在优惠券的地方单独处理
				dataBox = '';
//				var count;
				if (goodsList.length == 1) {
					dataBox = '';
//					count = 0;
//					var s1 = $('.onegoods').attr('data-goodsId');
//					var s2 = $('.onegoods').attr('data-num');
//					if (s1 == 130 || s1 == 131 || s1 == 132 || s1 == 133 || s1 == 134 || s1 == 135 || s1 == 136 || s1 == 138 || s1 == 42 || s1 == 144) {
//						count = s2;
//						dataBox = '<a href="../subject/coupon.html" style="color:#575757"><span class="_fm-left">选择优惠券：</span><div class="msg _fm-overhide"><span class="_fm-right _fm-ellipsis">活动已默认优惠' + 30 * count + '元</span></div></a>'
//					} else {
						dataBox = '<a href="../subject/coupon.html" style="color:#575757"><span class="_fm-left">选择优惠券：</span><div class="right-ico _fm-right" style="margin-top: -3px;"><span class="_fm-back-right">&nbsp;</span></div><div class="msg _fm-overhide"><span class="_fm-right _fm-ellipsis">无可用优惠券</span></div></a>'
//					}
				} else {
//					count = 0;
					dataBox = '';
//					for (var i = 0; i < goodsList.length; i++) {
//						var s1 = $('.area-elem').eq(i).attr('data-goodsId');
//						var s2 = $('.area-elem').eq(i).attr('data-num');
//						if (s1 == 130 || s1 == 131 || s1 == 132 || s1 == 133 || s1 == 134 || s1 == 135 || s1 == 136 || s1 == 138 || s1 == 42 || s1 == 144) {
//							count += Number(s2)
//						}
//					}
//					if (count > 0) {
//						dataBox = '<a href="../subject/coupon.html" style="color:#575757"><span class="_fm-left">选择优惠券：</span><div class="msg _fm-overhide"><span class="_fm-right _fm-ellipsis">活动已默认优惠' + 30 * count + '元</span></div></a>'
//					} else {
						dataBox = '<a href="../subject/coupon.html" style="color:#575757"><span class="_fm-left">选择优惠券：</span><div class="right-ico _fm-right" style="margin-top: -3px;"><span class="_fm-back-right">&nbsp;</span></div><div class="msg _fm-overhide"><span class="_fm-right _fm-ellipsis">无可用优惠券</span></div></a>'
//					}
				}
				$('.shoppingcar-confirm .coupon').empty().append(dataBox);

				//立减优惠
				dataBox = '<span class="discountNow">立减优惠：</span><span class="_fm-right" style="color: #ff5252;">- ￥<i class="discountNowPrice">' + exemptAmount + '</i></span>'
				$('.shoppingcar-confirm .DiscountNow').empty().append(dataBox);
				//运费
				dataBox = '<span>运费:</span><span class="_fm-right" style="color: #ff5252;">+ ￥<i class="postPrice" data-expressFee="' + expressFee + '">' + expressFee1 + '.' + expressFee2 + '</i><i class="postFeeIcon"></i></span>';
				$('.shoppingcar-confirm .postFee').empty().append(dataBox);
				//总金额
				dataBox2 = '<div class="toolbar-inner _fm-block _fm-rel _fm-overhide"><span class="total _fm-f-18" data-payAmount="' + payAmount + '" data-totalNum="' + totalNum + '">合计:<span class="count-num _fm-f-14" data-size="18px">￥<span style="font-size: 18px">' + payAmount1 + '.</span>' + payAmount2 + '</span></span><span class="submit do _fm-right _fm-txtcenter _fm-f-18">提交订单</span></div>';
				$('.shoppingcar-confirm .toolbar').empty().append(dataBox2);

			}
		}
		if (chooseAddressId && chooseAddressId !== 'undefined') {
			loadData(apiDomain + '/diyapi/trade/preorder/detail?tradeOrderId=' + tradeOrderId + '&deliveryAddressId=' + chooseAddressId, true, successFun);
		} else {
			loadData(apiDomain + '/diyapi/trade/preorder/detail?tradeOrderId=' + tradeOrderId, true, successFun);
		}
	}

	//邮费详情
	$('body').on('click', '.postFee', function() {
		var postPrice = $('.shoppingcar-confirm .postPrice').attr('data-expressfee');
		if (postPrice != 0) {
			var layerExpreFee = "";
			var data = {
				'tradeOrderId': tradeOrderId,
				'deliveryAddressId': deliveryAddressId
			};
			var arr = []; //每个商家下面的商品数量
			$.ajax({
				url: apiDomain + '/diyapi/trade/expressfee/detail',
				type: 'POST',
				timeout: 0,
				async: true,
				data: data,
				dataType: 'json',
				beforeSend: function() {},
				success: function(data) {
					layerExpreFee = '<div class="expressFeeDetail"><h1>邮费详情</h1>';
					$.each(data.data, function(i) {
						if (data.data[i].expressFee !== 0) {
							layerExpreFee += '<section class="../subject/expressFeeList"><div class="ExpreHeader"><span class="shopNameExpress">' + data.data[i].name + '</span><span class="exprePrice">共' + data.data[i].expressFee + '元<i>(EMS发送)</i></span></div><div class="ExpreGoodsList"><div class="ExpreGoodsImg">'
							$.each(data.data[i].goodsImageList, function(j) {
								layerExpreFee += '<img src="' + data.data[i].goodsImageList[j] + '"/>'
							})
							layerExpreFee += '</div></div></section>'
						}
						var length = data.data[i].goodsImageList.length;
						arr.push(length)
					})
					layerExpreFee += '<div class="expressFeeDec"><a href="../subject/expressFeeRule.html" class="expressFeeRule"><span>注：<i>为保证快递安全到达，部分省份选择EMS发送。</i></span><br/><span>如有疑问，可点此查看运费详细规则</span></a><div class="IKnow">我知道了</div></div></div>'
						//页面层
					var expresslayer = layer.open({
						type: 1,
						content: layerExpreFee,
						anim: 'up',
						shadeClose: true, //开启遮罩关闭
						style: 'position:absolute; bottom:0; left:0;top:0; width: 90%; height: 400px; padding:10px 0; border:none;right: 0;margin: auto;border-radius: 10px;'
					});
					//邮费弹窗中 每个商家下面商品图片
					for (var i = 0; i < arr.length; i++) {
						var width = 55 * arr[i] + "px";
						$('.expressFeeList').eq(i).find('.ExpreGoodsImg').css('width', width)
					}
					//点击邮费规则,关闭邮费弹窗
					$('body').on('click', '.expressFeeRule', function() {
							layer.close(expresslayer);
						})
						//点击“我知道了”，关闭邮费弹窗页面
					$('body').on('click', '.IKnow', function() {
						layer.close(expresslayer);
					})
				},
				error: function(data) {
					console.log('加载邮费失败')
				}
			})
		} else {}
	})

	//确认订单页面返回按钮
	var myApp = new Framework7({
		modalButtonOk: "去意已决",
		modalButtonCancel: "我再想想"
	});
	$('.backToCar').on("click", ".left", function() {
		myApp.confirm('便宜不等人，请三思而行~', '', function() {
			window.localStorage.setItem('isComfirm', 1);
			window.history.back();
			loadPage();
		});
		window.localStorage.removeItem('orderMsg'); //删除备注的缓存
		window.localStorage.removeItem('chooseAddressId'); //删除选择收货地址Id的缓存
	});
	//数量加
	$('.shoppingcar-confirm').off('click', '.op-r').on('click', '.op-r', function() {
			isShowSubtract();
			var tradeOrderGoodsId = $(this).parents('.goods-content').attr("data-tradeOrderGoodsId");
			var val = $(this).siblings(".num").val()
			var newVal = Number(val) + 1;
			val = newVal;
			var data = {
				"num": val,
				"tradeOrderGoodsId": tradeOrderGoodsId
			};
			$.ajax({
				url: apiDomain+"/diyapi/trade/preorder/modify",
				type: 'POST',
				timeout: 0,
				async: true,
				data: data,
				dataType: 'json',
				success: function(data) {
					//							loadOrderComfirm();
					if (data.code == 200) {
						modifyOrderNum();
					} else if (data.code == 1) {
						layerHint('免费商品不可更改数量哦！');
						return;
					}
				}
			})
		})
		//数量减
	$('.shoppingcar-confirm').off('click', '.op-l').on('click', '.op-l', function() {
			isShowSubtract();
			var tradeOrderGoodsId = $(this).parents('.goods-content').attr("data-tradeOrderGoodsId");
			var val = $(this).siblings(".num").val();
			if (val == '1') {} else {
				var newVal = Number(val) - 1;
				val = newVal;
			};
			var data = {
				"num": val,
				"tradeOrderGoodsId": tradeOrderGoodsId
			};
			$.ajax({
				url: "//api.51app.cn/diyapi/trade/preorder/modify",
				type: 'POST',
				timeout: 0,
				async: true,
				data: data,
				dataType: 'json',
				success: function(data) {
					//						loadOrderComfirm();
					if (data.code == 200) {
						modifyOrderNum();
					} else if (data.code == 1) {
						layerHint('免费商品不可更改数量哦！');
						return;
					}

				}
			})
		})
		//点击收货地址
	$('body .page').on('click', '.orderComfirm-address', function() {
		if ($('body .page .orderComfirm-address div').hasClass('noAddress')) {
			if (!getCookie('token')) {
				if (getCookie('temporaryToken')) {
					mainView.router.loadPage('../subject/eiditAddressLogin.html')
				} else {
					mainView.router.loadPage('../subject/editAddress.html')
				}
			} else {
				mainView.router.loadPage('../subject/editAddress.html')
			}
		} else {
			var id = $(this).find('.msg').find('.name').attr('data-deliveryaddress')
			window.localStorage.setItem("chooseAddressId", id);
			mainView.router.loadPage('../subject/chooseAddress.html')
			chooseAddress();
		}
	})
	$('body .pages').on('click', '#address .add-address', function() {
		if (!getCookie('token')) {
			if (getCookie('temporaryToken')) {
				mainView.router.loadPage('../subject/eiditAddressLogin.html')
			} else {
				mainView.router.loadPage('../subject/editAddress1.html')
			}
		} else {
			mainView.router.loadPage('../subject/editAddress1.html')
		}

	})
	$('body .pages').on('click', '.editAddress .save-useMask', function() {
			if (!getCookie('token')) {
				if (getCookie('temporaryToken')) {
					mainView.router.loadPage('../subject/eiditAddressLogin.html')
				} else {
					mainView.router.loadPage('../subject/editAddress.html')
				}
			} else {
				mainView.router.loadPage('../subject/editAddress.html')
			}
		})
		//选择付款方式
	$('.pay-method').on('click', '.method-elem', function() {
			$(this).find('.payMethod').addClass('active').parents('.method-elem').siblings('.method-elem').find('.payMethod').removeClass('active')
		})
		//备注
	$('body .pages').on("input propertychange", ".remarkTextarea", function() {
		var orderMsg = $('.remarkTextarea').val();

		//判断是否有表情，有则返回true
		if (isEmojiCharacter(orderMsg)) {
			layer.open({
				content: '请输入汉字或英文',
				skin: 'msg',
				time: 2 //2秒后自动关闭
			});
			$('.remarkTextarea').val('');
			return false;
		} else {
			window.localStorage.setItem('orderMsg', orderMsg);
		}
	});

	//点击提交订单
	$('body').on('click', '.submit', function() {
		var that = $(this);
		that.addClass('submitOver').removeClass('submit');
		window.localStorage.removeItem('chooseAddressId'); //删除选择收货地址Id的缓存
		window.localStorage.removeItem('orderMsg'); //删除备注的缓存
		var amount = Number($('.confirm-toolBar .total').attr('data-payamount')) * 100;
		var orderId = tradeOrderId;
		var itemCount = $('.confirm-toolBar .total').attr('data-totalnum');
		//删除选择收货地址页面的localStorage
		window.localStorage.removeItem('chooseAddressId');
		window.localStorage.removeItem('chooseAddressname');
		window.localStorage.removeItem('chooseAddressphone');
		window.localStorage.removeItem('chooseAddressprovince');
		window.localStorage.removeItem('chooseAddresscity');
		window.localStorage.removeItem('chooseAddresscounty');
		window.localStorage.removeItem('chooseAddressaddress');
		window.localStorage.removeItem('chooseAddressprovinceCode');
		window.localStorage.removeItem('chooseAddresscityCode');
		window.localStorage.removeItem('chooseAddresscountyCode');
		var deliveryAddress = $('.msg .name').attr('data-deliveryAddress'); //订单地址Id
		var message = $('.remarkTextarea').val();
		var payChannel = '';
		var len = $('.pay-method .method-elem').length;
		for (var i = 0; i < len; i++) {
			if ($('.method-elem').eq(i).find('.payMethod').hasClass('active')) {
				payChannel = $('.method-elem').eq(i).attr('data-method')
			}
		}
		var flag;
		if(GetQueryString('fromgroup')){
			var flag = 'group';
		}else{
			var flag = 'tq';
		}
		var data = {
			'tradeOrderId': tradeOrderId,
			'deliveryAddressId': deliveryAddress,
			'payChannel': payChannel,
			'message': message,
			'token': token,
			'channel': channel,
			'flag': flag
		}
		window.localStorage.setItem('payChannel', payChannel);
		if (payChannel == 'wx_pub') {
			var message = $('.remarkTextarea').val();
			var source = localStorage.getItem('source');
			//在微信中判断 是在微信公众号里面推广的/各个浏览器之间转发的	
			if (source && source != 'null' && source != 'undefined') {
				if (source == 'mp') { //在小优来了公众号里面
					var data = {
						'tradeOrderId': tradeOrderId,
						'deliveryAddressId': deliveryAddress,
						'payChannel': "wx_pub",
						'message': message,
						'channel': channel,
						'flag': flag
					}
					try{
						wx.miniProgram.getEnv(function(res) {
							var isMiniProgram = res.miniprogram;
							if(isMiniProgram) {
								data = {
									'tradeOrderId': tradeOrderId,
									'deliveryAddressId': deliveryAddress,
									'payChannel': 'wx_lite',
									'message': message,
									'token': token,
									'topay': false,
									'channel': channel,
									'flag': flag,
									'appId':'wxdffb4105c627a6db'
						
								}
							}
						})
					}catch(e){
						console.log('跳转小程序失败')
					}
					
					$.ajax({
						url: apiDomain+"/diyapi/trade/preorder/confirm",
						type: 'POST',
						timeout: 0,
						async: true,
						data: data,
						dataType: 'json',
						success: function(data) {
							//	if(localStorage.getItem('owner')){
							if (data.code == 200) {
								that.addClass('submit').removeClass('submitOver');
								//控制返回
								window.localStorage.setItem("isComfirm", 2);
								var appId = data.data.appid;
								var timeStamp = data.data.timestamp;
								var nonceStr = data.data.nonceStr;
								var packages = 'prepay_id=' + data.data.prepayId;
								var paySign = data.data.sign;
								//talkingData统计
								TDH5SDK.iap.placeOrder(orderId, amount, 'CNY', loadTalkingData(tradeOrderId)); //talkingData统计下订单的数量
								function onBridgeReady() {
									WeixinJSBridge.invoke(
										'getBrandWCPayRequest', {
											"appId": appId, //公众号名称，由商户传入     
											"timeStamp": timeStamp, //时间戳，自1970年以来的秒数     
											"nonceStr": nonceStr, //随机串     
											"package": packages,
											"signType": "MD5", //微信签名方式：     
											"paySign": paySign //微信签名 
										},
										function(res) {
											if (res.err_msg == "get_brand_wcpay_request:ok") {
												window.location.href = 'paySucced.html&tradeOrderId=' + tradeOrderId;
											} // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
											if (res.err_msg == "get_brand_wcpay_request:cancel") {
												window.location.href = 'paySucced.html&tradeOrderId=' + tradeOrderId;
											}
											if (res.err_msg == "get_brand_wcpay_request:fail") {
												window.location.href = 'paySucced.html&tradeOrderId=' + tradeOrderId;
											}
										}
									);
								}
								if (typeof WeixinJSBridge == "undefined") {
									if (document.addEventListener) {
										document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
									} else if (document.attachEvent) {
										document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
										document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
									}
								} else {
									onBridgeReady();
								}
							} else if (data.code == 3001) {
								layer.open({
									content: '订单已生成，请在前往--我的订单--查看',
									btn: '我知道了',
									shadeClose: false,
									yes: function() {
										window.location.href = "myOrder.html?channel=" + channel;
									}
								});
							} else if (data.code == 3002) {
								layer.open({
									content: '您还没有设置收货地址，请填写~',
									btn: '好的',
									shadeClose: false,
									yes: function(index) {
										layer.close(index);
										that.addClass('submit').removeClass('submitOver');
									}
								});
							}
						},
						error: function(data) {
							console.log("订单提交失败")
						}
					})
				}
			} else {
				var data = {
					'tradeOrderId': tradeOrderId,
					'deliveryAddressId': deliveryAddress,
					'payChannel': "wx_pub",
					'message': message,
					'topay': false,
					'channel': channel,
					'flag': flag
				}
				try{
					wx.miniProgram.getEnv(function(res) {
						var isMiniProgram = res.miniprogram;
						if(isMiniProgram) {
							data = {
								'tradeOrderId': tradeOrderId,
								'deliveryAddressId': deliveryAddress,
								'payChannel': 'wx_lite',
								'message': message,
								'token': token,
								'topay': false,
								'channel': channel,
								'flag': flag,
								'appId':'wxdffb4105c627a6db'
					
							}
						}
					})
				}catch(e){
					console.log('跳转小程序失败')
				}


				$.ajax({
					url: apiDomain+"/diyapi/trade/preorder/confirm",
					type: 'POST',
					timeout: 0,
					async: true,
					data: data,
					dataType: 'json',
					success: function(data) {
						if (data.code == 200) {
							that.addClass('submit').removeClass('submitOver');
							//talkingData统计
							TDH5SDK.iap.placeOrder(orderId, amount, 'CNY', loadTalkingData(tradeOrderId)); //talkingData统计下订单的数量
							//控制返回
							window.localStorage.setItem("isComfirm", 2);
							window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx204459d3f9148e3b&redirect_uri=https%3A%2F%2Fapi.51app.cn%2Fdiyapi%2Ftrade%2Forder%2Ftopay%2Fwxpub&response_type=code&scope=snsapi_base&state=' + tradeOrderId + '_'+ flag +'#wechat_redirect';
							
						} else if (data.code == 3001) {
							layer.open({
								content: '订单已生成，请在前往--我的订单--查看',
								btn: '我知道了',
								shadeClose: false,
								yes: function() {
									window.location.href = "myOrder.html?channel=" + channel;
								}
							});
						} else if (data.code == 3002) {
							layer.open({
								content: '您还没有设置收货地址，请填写~',
								btn: '好的',
								shadeClose: false,
								yes: function(index) {
									layer.close(index);
									that.addClass('submit').removeClass('submitOver');
								}
							});
						}
					},
					error: function(data) {
						console.log("订单提交失败")
					}
				})
			}
		} else if (payChannel == 'wx_wap') {
			var data = {
				'tradeOrderId': tradeOrderId,
				'deliveryAddressId': deliveryAddress,
				'payChannel': payChannel,
				'message': message,
				'token': token,
				'topay': false,
				'channel': channel,
				'flag': flag
			}
			try{
				wx.miniProgram.getEnv(function(res) {
					var isMiniProgram = res.miniprogram;
					if(isMiniProgram) {
						data = {
							'tradeOrderId': tradeOrderId,
							'deliveryAddressId': deliveryAddress,
							'payChannel': 'wx_lite',
							'message': message,
							'token': token,
							'topay': false,
							'channel': channel,
							'flag': flag,
							'appId':'wxdffb4105c627a6db'
				
						}
					}
				})
			}catch(e){
				console.log('跳转小程序失败')
			}
			
			
			$.ajax({
					url: apiDomain+"/diyapi/trade/preorder/confirm",
					type: 'POST',
					timeout: 0,
					async: true,
					data: data,
					dataType: 'json',
					success: function(data) {
						if (data.code == 200) {
							that.addClass('submit').removeClass('submitOver');
							//talkingData统计
							TDH5SDK.iap.placeOrder(orderId, amount, 'CNY', loadTalkingData(tradeOrderId)); //talkingData统计下订单的数量
							//控制返回
							window.localStorage.setItem("isComfirm", 2);
							$.ajax({
								url: apiDomain+'/diyapi/trade/order/topay/h5?flag='+ flag +'&tradeOrderId=' + tradeOrderId,
								type: 'GET',
								timeout: 0,
								async: true,
								data: {},
								dataType: 'json',
								beforeSend: function() {
									//可加入loading的效果
								},
								success: function(data) {
									window.location.href = data.data;
								},
								error: function(data) {
									console.log("接口调用失败")
								}
							})
						} else if (data.code == 3001) {
							layer.open({
								content: '订单已生成，请在前往--我的订单--查看',
								btn: '我知道了',
								shadeClose: false,
								yes: function() {
									window.location.href = "myOrder.html?channel=" + channel;
								}
							});
						} else if (data.code == 3002) {
							layer.open({
								content: '您还没有设置收货地址，请填写~',
								btn: '好的',
								shadeClose: false,
								yes: function(index) {
									layer.close(index);
									that.addClass('submit').removeClass('submitOver');
								}
							});
						} else {
							return
						}
					},
					error: function(data) {
						console.log("订单提交失败")
					}
				})
				//					}

		} else {
			$.ajax({
				url: apiDomain+"/diyapi/trade/preorder/confirm",
				type: 'POST',
				timeout: 0,
				async: true,
				data: data,
				dataType: 'json',
				success: function(data) {
					var charge = data.data;
					if (data.code == 200) {
						that.addClass('submit').removeClass('submitOver');
						//talkingData统计
						TDH5SDK.iap.placeOrder(orderId, amount, 'CNY', loadTalkingData(tradeOrderId)); //talkingData统计下订单的数量
						//控制返回
						window.localStorage.setItem("isComfirm", 2);
						pingpp.createPayment(charge, function(result, err) {
							pingpp.setAPURL('https://api.51app.cn/webPage/tq/web/html/main/orderConfirm.html');
							if (result == "success") {
								// 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
							} else if (result == "fail") {
								// charge 不正确或者微信公众账号支付失败时会在此处返回
							} else if (result == "cancel") {
								// 微信公众账号支付取消支付
							}
						});
					} else if (data.code == 3001) {
						layer.open({
							content: '订单已生成，请在前往--我的订单--查看',
							btn: '我知道了',
							shadeClose: false,
							yes: function() {
								window.location.href = "myOrder.html?channel=" + channel;
							}
						});
					} else if (data.code == 3002) {
						layer.open({
							content: '您还没有设置收货地址，请填写~',
							btn: '好的',
							shadeClose: false,
							yes: function(index) {
								layer.close(index);
								that.addClass('submit').removeClass('submitOver');
							}
						});
					}
				},
				error: function(data) {
					console.log("订单提交失败")
				}
			})
		}
		//				}
	});

}

//加载各个主页面
var loadPage = function() {
	var channel = GetQueryString('channel') || getCookie('channel') || 'etime';
	setCookie('channel', channel); //将channel存入cookie
	var url, successFun, dataBox, dataBox1, dataBox2;
	var page = $('.page');
	$.each(page, function(n) {
		var pageName = page.eq(n).attr('data-page');
		if (pageName == "index-1") { //加载首页数据
			var stateObject = {};
			var title = document.title;
			var newUrl = "index.html?channel=" + channel;
			history.pushState(stateObject, title, newUrl);
			url = apiDomain + '/diyapi/home/v1?channel=' + channel;
			successFun = function(data) {
				if (data.code == 200) {
					var bannerList = data.data.bannerList,
						paneList = data.data.paneList,
						fineTopicList = data.data.fineTopicList,
						labelList = data.data.labelList,
						ipTopicList = data.data.ipTopicList,
						goods = data.data.recomGoodsList;

					//banners
					dataBox = "";
					dataBox = '<div class="swiper-wrapper">';
					$.each(bannerList, function(i) {
						//判断banner跳转的是链接还是商品
						if (bannerList[i].isUrl == false) {
							sendData = '\'' + bannerList[i].goods.diyType + ',' + bannerList[i].goods.id + ',' + 0 + '\'';
						} else {
							sendData = '\'' + bannerList[i].urlOpenType + ',' + bannerList[i].url + '\'';
						}
						dataBox += '<div class="swiper-slide" onclick="sending(' + sendData + ')"><div><img src="' + bannerList[i].imageUrl + '"  alt="banner" /></div></div>'
					})
					dataBox += '</div><div class="swiper-pagination"></div>';
					$('.index-swiper1').empty().append(dataBox);
					var mySwiper = new Swiper('.index-swiper1', {
						pagination: '.swiper-pagination',
						loop: true,
						paginationHide: false,
						paginationClickable: true,
						autoplay: 2000,
						autoplayDisableOnInteraction: false,
						observer: true, //修改swiper自己或子元素时，自动初始化swiper
						observeParents: true //修改swiper的父元素时，自动初始化swiper
					});

					//小图标入口
					dataBox = ''
					$.each(paneList, function(i) {
						if (paneList[i].isUrl == false) {
							sendData = '\'' + paneList[i].goods.diyType + ',' + paneList[i].goods.id + ',' + 0 + '\'';
						} else {
							sendData = '\'' + paneList[i].urlOpenType + ',' + paneList[i].url + '\'';
						}

						//ios和android分别的八个图标开始，用字段里的platform区分 all表示全部显示
						if (devicePlatform == 'ios' && paneList[i].platform == 'ios') {
							dataBox += '<a class="nav_item external" onclick="sending(' + sendData + ')"><img src="' + paneList[i].imageUrl + '"/><span class="_fm-f-12">' + paneList[i].name + '</span></a>'
						} else if (devicePlatform == 'android' && paneList[i].platform == 'android') {
							dataBox += '<a class="nav_item external" onclick="sending(' + sendData + ')"><img src="' + paneList[i].imageUrl + '"/><span class="_fm-f-12">' + paneList[i].name + '</span></a>'
						} else if (paneList[i].platform == 'all') {
							dataBox += '<a class="nav_item external" onclick="sending(' + sendData + ')"><img src="' + paneList[i].imageUrl + '"/><span class="_fm-f-12">' + paneList[i].name + '</span></a>'
						}

					});
					$('.navBtn').empty().append(dataBox);

					//下方专题
					//好物专题
					dataBox = '';
					dataBox = '<h1 class="title _fm-f-20"><i></i>好物专题<span class="_fm-f-13">COMMODITY COLUMN</span></h1>'
					$.each(fineTopicList, function(i) {
						var imageUrl = fineTopicList[i].imageUrl,
							id = fineTopicList[i].id,
							goodsList = fineTopicList[i].goodsList;
						sendData = '\'' + 3 + ',' + 'https://api.51app.cn/webPage/tq/app/v1/html/main/subjectRecommend.html?topicId=' + id + '\'';
						dataBox += '<div class="subject"><div onclick="sending(' + sendData + ')"><img data-id="' + id + '" class="subjectImg" src="' + imageUrl + '"/></div><ul class="subjectCon">'
						$.each(goodsList, function(j) {
							if (j < 3) { //控制商品展示数量不超过3个
								var goodsId = goodsList[j].id,
									name = goodsList[j].name,
									coverImageUrl = goodsList[j].coverImageUrl,
									diyType = goodsList[j].diyType;
								sendData = '\'' + diyType + ',' + goodsId + ',' + 0 + '\'';
								dataBox += '<li class="subjectConItem" onclick="sending(' + sendData + ')" data-goodsId="' + goodsId + '" data-diyType="' + diyType + '"><img src="' + coverImageUrl + '"/><span class="_fm-f-12 overflowEllipsis">' + name + '</span></li>'
							}

						});
						dataBox += '</ul></div>'
					});
					$('.specialSubject').empty().append(dataBox);

					//IP推荐
					dataBox = '';
					dataBox += '<div class="swiper-wrapper">';
					$.each(ipTopicList, function(i) {
						sendData = '\'' + 3 + ',' + 'https://api.51app.cn/webPage/tq/app/v1/html/main/ipRecomCon.html?topicId=' + ipTopicList[i].id + '\'';
						dataBox += '<div class="swiper-slide" onclick="sending(' + sendData + ')"><div class="slideBox" data-id="' + ipTopicList[i].id + '"><img src="' + ipTopicList[i].imageUrl + '" /></div></div>'
					});
					dataBox += '</div>'
					$('.IPRecomond .IPCon .index-swiper2').empty().append(dataBox);
					var mySwiper1 = new Swiper('.index-swiper2', {
						effect: 'coverflow',
						slidesPerView: 1,
						centeredSlides: true,
						coverflow: {
							rotate: 0,
							stretch: 5,
							depth: 300,
							modifier: 1,
							slideShadows: false
						},
						observer: true, //修改swiper自己或子元素时，自动初始化swiper
						observeParents: true, //修改swiper的父元素时，自动初始化swiper
						loop: true
					})

					//为你推荐
					dataBox = loadGoods(goods);
					$('.hotRecomend .goodsBox').empty().append(dataBox);

					dataBox = '';
					dataBox += '<div class="labelLine"><ul>'
					$.each(labelList, function(i) {
						sendData = '\'' + 'searchInput' + ',' + labelList[i].name + '\'';
						dataBox += '<li data-id="' + labelList[i].id + '" onClick="sending(' + sendData + ')">' + labelList[i].name + '</li>'
					});
					dataBox += '</ul><i class="refreshLabel"></i></div>'
					$(dataBox).insertAfter($('.hotRecomend .goodsBox .hd-commonGoodsList .hd-goodsBox').eq(3));
					var length = $('.hotRecomend .goodsBox .hd-commonGoodsList .hd-goodsBox').length;
					for (var i = 0; i < length; i++) {
						$('.hotRecomend .goodsBox .hd-commonGoodsList .hd-goodsBox').eq(i).find('.hd-goods').css('margin', 0)
						if (i % 2 == 0) {
							$('.hotRecomend .goodsBox .hd-commonGoodsList .hd-goodsBox').eq(i).find('.hd-goods').css('margin-right', '0.1rem');
						} else {
							$('.hotRecomend .goodsBox .hd-commonGoodsList .hd-goodsBox').eq(i).find('.hd-goods').css('margin-left', '0.1rem');
						}
					}
					$('.dom-noLoad').hide();
					
					if(isIphoneX()){
						$('.toolbar').css('height','74px');
						$('.toolbar-inner').css('padding-bottom','24px');
						$('#view-1 .page-content').css('padding-bottom','68px');
					}
				}
			}
			loadData(url, true, successFun);
		} else if (pageName == "index-2") { //加载购物车数据
			var stateObject = {};
			var title = document.title;
			var newUrl = "shopCar.html?channel=" + channel;
			history.pushState(stateObject, title, newUrl);
			$('.dom-noLoad').show();
			var data = {
				'token': getCookie('token')
			}
			url = apiDomain + '/diyapi/trade/cart/list';
			successFun = function(data) {
				if (data.code == 200) {
					if (data.data.length != 0) {
						$('#view-2 .addCar').show();
						dataBox = "";
						dataBox += '<div class="page-content infinite-scroll _js-limitdrag haveDone" id="page-content" data-ptr-distance="55" style="padding-bottom:2rem"><div class="cus-page" style="min-height:101%"><div class="cus-page-inner">'

						$.each(data.data, function(i) {
							var shopcartBasicList = data.data[i].shopcartList;
							var merchantBasic = data.data[i].merchant;
							dataBox += '<ul class="car-list list-block" style="display: block;">';
							dataBox += '<li class="_fm-f-14 car-title"><span class="check-box _fm-left do selectOne" data-op="selectOne"><i class="_fm-check-1" style="top: 0px;">&nbsp;</i></span><span class="shopName">' + merchantBasic.name + '</span><span class="_fm-right _fm-rel edit do right-txt" data-op="editOne">编辑</span></li>';
							$.each(shopcartBasicList, function(j) {
								var priceWechat = toDecimal2(shopcartBasicList[j].priceWechat); //将拿到的金额强制转换成带两位小数的浮点型
								var goodPrice1 = priceWechat.split(".")[0];
								var goodPrice2 = priceWechat.split(".")[1];
								dataBox += '<li class="list-elem swipeout" data-id="' + shopcartBasicList[j].id + '" data-select="' + shopcartBasicList[j].isSelected + '"><div class="showImgBox" style="display:none">'

								$.each(shopcartBasicList[j].previewImageList, function(n) {
									dataBox += '<img src="' + shopcartBasicList[j].previewImageList[n].imageUrl + '"/>'
								})
								dataBox += '</div><div class="goods-content _fm-clearfix swipeout-content"><div class="check-box _fm-left do" data-op="selectOne"><i class="_fm-check-1">&nbsp;</i></div><div class="_fm-img _fm-rel _fm-left"><div class="img-inner"><img class="lazy-loaded" data-src="' + shopcartBasicList[j].previewImageList[0].imageUrl + '" alt="" src="' + shopcartBasicList[j].previewImageList[0].imageUrl + '"></div></div><div class="goods-msg  _fm-rel"><h2 class="_fm-f-14 _fm-ellipsis">' + shopcartBasicList[j].goodsName + '</h2><div class="price-count _fm-abs _fm-bz _fm-lz"><span class="count-num _fm-left" data-size="16px">￥<span style="font-size: 16px">' + goodPrice1 + '.</span>' + goodPrice2 + '</span><div class="count total-num"><div class="subtract op-l"><img src="../../img/ap-subtract.png"></div>	<input disabled="" type="text" value="' + shopcartBasicList[j].num + '" name="number" pattern="[0-9]*" maxlength="4" class="num">	<div class="add op-r"><img src="../../img/ap-add.png"></div></div></div><p class="style _fm-overhide"><span>' + shopcartBasicList[j].goodsStyleDesc + '</span></p><p class="style _fm-overhide styleEdit" data-goodsStyleId="' + shopcartBasicList[j].goodsStyleId + '"><i><img src="../../img/edit.png" alt=""/></i><span style="width:3.4rem!important">' + shopcartBasicList[j].goodsStyleDesc + '</span></p></div></div><div class="swipeout-actions-right"><a href="#" class="swipeout-delete">删除</a></div></li>'

							});
							dataBox += '</ul>'

						});

						dataBox += '</div></div>';
						$('#view-2 .page').empty().append(dataBox);
						
						if(isIphoneX()){
							$('.toolbar').css('height','74px');
							$('.toolbar-inner').css('padding-bottom','24px');
							$('.tabbar.addCar').css('bottom','71px');
							$('#view-2 .page-content').css('padding-bottom','2.5rem')
						}
						isShowSubtract();
						$('.dom-noLoad').hide();

						var scrolltop = localStorage.getItem('scrolltop');
						if (scrolltop) {
							$('#view-2 #page-content').scrollTop(Number(scrolltop));
						} else {
							$('#view-2 #page-content').scrollTop = 0;
						}

						//如果list-elem属性data-select为true,则默认选中
						var listLength = $('#view-2 .page .car-list .list-elem').length;
						for (var i = 0; i < listLength; i++) {
							if ($('#view-2 .page .car-list .list-elem').eq(i).attr("data-select") == 'true') {
								$('#view-2 .page .car-list .list-elem').eq(i).find('._fm-check-1').addClass('active-choose')
							} else {
								$('#view-2 .page .car-list .list-elem').eq(i).find('._fm-check-1').removeClass('active-choose')
							}

							var active = $('#view-2 .page .car-list .list-elem').eq(i).parents('.car-list').find('.list-elem').length;
							var activeChoose = $('#view-2 .page .car-list .list-elem').eq(i).parents('.car-list').find('.list-elem').find('.active-choose').length;
							var allActive = $('#view-2 .page .car-list .list-elem').eq(i).parents('.page').find('.list-elem').length;
							var allActiveChoose = $('#view-2 .page .car-list .list-elem').eq(i).parents('.page').find('.list-elem').find('.active-choose').length;
							if (activeChoose == active) {
								$('#view-2 .page .car-list .list-elem').eq(i).parents('.car-list').find('.car-title').find('._fm-check-1').addClass('active-choose');
							} else {
								$('#view-2 .page .car-list .list-elem').eq(i).parents('.car-list').find('.car-title').find('._fm-check-1').removeClass('active-choose');
							};
							if (allActiveChoose == allActive) {
								$('#view-2 .chooseAll ._fm-check-1').addClass('active-choose');
							} else {
								$('#view-2 .chooseAll ._fm-check-1').removeClass('active-choose');
							};
						}
						priceMount(); //计算价格
					} else {
						$('#view-2 .addCar').hide();
						dataBox = "";
						dataBox1 = "";
						url = apiDomain + '/diyapi/goods/recommend';
						successFun = function(data) {
							if (data.code == 200) {
								dataBox1 = "";
								$.each(data.data, function(i) {
									dataBox1 += '<div class="recomendGood"><a class="external recomendGoodLink" href="goodsDetail.html?goodsId=' + data.data[i].id + '&channel=' + channel + '"><img src="' + data.data[i].coverImageUrl + '"><div class="recomend-text"><div><h1>' + data.data[i].name + '</h1><p>' + (data.data[i].tagline || "定制方显品味") + '</p></div></div></a></div>'
								});
								dataBox = '<div class="page-content emptyCar-page"><div style="min-height:101%"><div class="tablet-inset emptyCar"><img src="../../img/emptyCar.png" alt="空购物车" /><div class="goToShopDiv"><a href="#" class="goToShop">去定制</a></div></div></div></div>';
//								<div class="recomend-title"><span class="recomend-noColor">为您推荐</span><a class="change">换一批<img src="../../img/refresh.png" /></a></div><div class="" style="width: 7.3rem;box-shadow: inherit;"><div class="" style="background-color: #EDEDED;"><div class="Recommend"><div class="RecommendList">' + dataBox1 + '</div></div></div></div>
								
								$('#view-2 .page').empty().append(dataBox);
								
								if(isIphoneX()){
									$('.toolbar').css('height','74px');
									$('.toolbar-inner').css('padding-bottom','24px');
								}
								$('.dom-noLoad').hide();
							}
						}
						loadData(url, true, successFun);
					}

				} else if (data.code == 1001) {
					loginLayer('body')
					return;
				}
			};
			uploadData(url, true, data, successFun);

		} else if (pageName == 'index-3') { //加载‘我的’页面数据
			
			if(isIphoneX()){
				$('.toolbar').css('height','74px');
				$('.toolbar-inner').css('padding-bottom','24px');
			}
			var stateObject = {};
			var title = document.title;
			var newUrl = "my.html?channel=" + channel;
			history.pushState(stateObject, title, newUrl);
			$('.dom-noLoad').show();
			url = apiDomain + '/diyapi/user/my';
			data = {
				'token': getCookie('token'),
				'channel': channel
			}
			successFun = function(data) {
				if (data.code == 200) {
					var orderCount = data.data.orderCount,
						address = data.data.address,
						couponCount = data.data.couponCount;
					var dataMobile = data.data.mobile;
					if (dataMobile) {
						var mobile = '';
						for (var i = 0; i < dataMobile.length; i++) {
							if (i > 2 && i < 7) {
								mobile += '*'
							} else {
								mobile += dataMobile[i];
							}
						}
					} else{
						var mobile = 'XXXX'
					}
					
					dataBox = '';
					dataBox = '<div class="userHead" style="background:url(' + data.data.head + ');background-size:cover;box-sizing: content-box;"></div><div class="userCon"><p class="_fm-f-14">' +
						data.data.alias + '</p><p class="_fm-f-12" data-mobile="' + data.data.mobile + '">' + mobile + '</p></div>'
					$('.userInfo').empty().append(dataBox)

					dataBox = '';
					dataBox = '<a class="order_item toBePay external"><div class="iconImg"><img src="../../img/toBePay.png" /><i class="_fm-f-12">' + orderCount.unPay + '</i></div><span class="_fm-f-12">待付款</span></a><a class="order_item toBeShip external"><div class="iconImg"><img src="../../img/toBeShip.png" /><i class="_fm-f-12">' + orderCount.unDelive + '</i></div><span class="_fm-f-12">待发货</span></a><a class="order_item toBeReceive external"><div class="iconImg"><img src="../../img/toBeReceive.png" /><i class="_fm-f-12">' +
						orderCount.unReceive + '</i></div><span class="_fm-f-12">待收货</span></a><a class="order_item allOrder"><div class="iconImg"><img src="../../img/allOrder.png" /></div><span class="_fm-f-12">全部</span></a>'
					$('.orderBar').empty().append(dataBox);

					//如果数量小于1，则不显示右上角红色原点，如果大于99，则显示99+
					var length = $('.order_item').length;
					for (var i = 0; i < length; i++) {
						var corner = Number($('.order_item').eq(i).find('i').text());
						if (corner < 1) {
							$('.order_item').eq(i).find('i').css('display', 'none')
						} else if (corner > 99) {
							$('.order_item').eq(i).find('i').text('99+').css('width', '0.4rem')
						}
					}

					//加载格子内容
					dataBox = '';
					//判断是否是代理；如果是代理，则显示代理收益
					if (data.data.isAgency) {
						if(address){
							dataBox = '<li><div class="squareCon"><img src="../../img/myWallet.png" /><div class="squareright"><p class="_fm-ellipsis _fm-f-16">我的钱包</p><p class="_fm-ellipsis _fm-f-13">' + data.data.cash.toFixed(2) + '元</p></div></div></li><li><div class="squareCon"><img src="../../img/myCoupon.png" /><div class="squareright"><p class="_fm-ellipsis _fm-f-16">我的优惠券</p><p class="_fm-ellipsis _fm-f-13">' + data.data.couponCount.valid + '张</p></div></div></li><li class="reciveAddress"><div class="squareCon"><img src="../../img/myAddress.png" /><div class="squareright"><p class="_fm-ellipsis _fm-f-16">我的收货地址</p><p class="_fm-ellipsis _fm-f-13">' + address.provinceName + ' ' + address.cityName + ' ' + address.countyName + ' ' + address.address + ' </p></div></div></li><li><div class="squareCon"><img src="../../img/myGoldBean.png" /><div class="squareright"><p class="_fm-ellipsis _fm-f-16">我的金豆</p><p class="_fm-ellipsis _fm-f-13">' +
							data.data.coin + '个</p></div></div></li><li class="agentProfit"><div class="squareCon"><img src="../../img/myProfit.png" /><div class="squareright"><p class="_fm-ellipsis _fm-f-16">我的收益</p><p class="_fm-ellipsis _fm-f-13">' +
							data.data.cashableBalance.toFixed(2) + '元</p></div></div></li>'
						}else{
							dataBox = '<li><div class="squareCon"><img src="../../img/myWallet.png" /><div class="squareright"><p class="_fm-ellipsis _fm-f-16">我的钱包</p><p class="_fm-ellipsis _fm-f-13">' + data.data.cash.toFixed(2) + '元</p></div></div></li><li><div class="squareCon"><img src="../../img/myCoupon.png" /><div class="squareright"><p class="_fm-ellipsis _fm-f-16">我的优惠券</p><p class="_fm-ellipsis _fm-f-13">' + data.data.couponCount.valid + '张</p></div></div></li><li class="reciveAddress noAddress"><div class="squareCon"><img src="../../img/myAddress.png" /><div class="squareright"><p class="_fm-ellipsis _fm-f-16">我的收货地址</p><p class="_fm-ellipsis _fm-f-13">添加收货地址</p></div></div></li><li><div class="squareCon"><img src="../../img/myGoldBean.png" /><div class="squareright"><p class="_fm-ellipsis _fm-f-16">我的金豆</p><p class="_fm-ellipsis _fm-f-13">' +
							data.data.coin + '个</p></div></div></li><li class="agentProfit"><div class="squareCon"><img src="../../img/myProfit.png" /><div class="squareright"><p class="_fm-ellipsis _fm-f-16">我的收益</p><p class="_fm-ellipsis _fm-f-13">' +
							data.data.cashableBalance.toFixed(2) + '元</p></div></div></li>'
						}
						
					} else {
						if(address){
							dataBox = '<li><div class="squareCon"><img src="../../img/myWallet.png" /><div class="squareright"><p class="_fm-ellipsis _fm-f-16">我的钱包</p><p class="_fm-ellipsis _fm-f-13">' + data.data.cash.toFixed(2) + '</p></div></div></li><li><div class="squareCon"><img src="../../img/myCoupon.png" /><div class="squareright"><p class="_fm-ellipsis _fm-f-16">我的优惠券</p><p class="_fm-ellipsis _fm-f-13">' + data.data.couponCount.valid + '张</p></div></div></li><li class="reciveAddress"><div class="squareCon"><img src="../../img/myAddress.png" /><div class="squareright"><p class="_fm-ellipsis _fm-f-16">我的收货地址</p><p class="_fm-ellipsis _fm-f-13">' + address.provinceName + ' ' + address.cityName + ' ' + address.countyName + ' ' + address.address + ' </p></div></div></li><li><div class="squareCon"><img src="../../img/myGoldBean.png" /><div class="squareright"><p class="_fm-ellipsis _fm-f-16">我的金豆</p><p class="_fm-ellipsis _fm-f-13">' +
							data.data.coin + '个</p></div></div></li>'
						}else{
							dataBox = '<li><div class="squareCon"><img src="../../img/myWallet.png" /><div class="squareright"><p class="_fm-ellipsis _fm-f-16">我的钱包</p><p class="_fm-ellipsis _fm-f-13">' + data.data.cash.toFixed(2) + '</p></div></div></li><li><div class="squareCon"><img src="../../img/myCoupon.png" /><div class="squareright"><p class="_fm-ellipsis _fm-f-16">我的优惠券</p><p class="_fm-ellipsis _fm-f-13">' + data.data.couponCount.valid + '张</p></div></div></li><li class="reciveAddress noAddress"><div class="squareCon"><img src="../../img/myAddress.png" /><div class="squareright"><p class="_fm-ellipsis _fm-f-16">我的收货地址</p><p class="_fm-ellipsis _fm-f-13">新增收货地址</p></div></div></li><li><div class="squareCon"><img src="../../img/myGoldBean.png" /><div class="squareright"><p class="_fm-ellipsis _fm-f-16">我的金豆</p><p class="_fm-ellipsis _fm-f-13">' +
							data.data.coin + '个</p></div></div></li>'
						}
						
					}
					$('.squareBox ul').empty().append(dataBox)
						//去掉最后一栏格子的底部border
					var len = $('.squareBox li').length;
					if (len % 2) {
						$('.squareBox li').eq(len - 1).css('border-bottom', 'transparent');
					} else {
						$('.squareBox li').eq(len - 1).css('border-bottom', 'transparent');
						$('.squareBox li').eq(len - 2).css('border-bottom', 'transparent');
					}
					$('.dom-noLoad').hide();
				} 
			}
			uploadData(url, true, data, successFun);
		} else if (pageName == 'ipRecommend') { //ip推荐列表页
			url = apiDomain + '/diyapi/home/v1?channel=' + channel;
			successFun = function(data) {
				if (data.code == 200) {
					//					var ipTopicList = data.data.ipTopicList;
					//					dataBox = '';
					//					$.each(ipTopicList, function(i) {
					//						dataBox += '<li data-url="https://api.51app.cn/webPage/tq/app/v1/html/main/ipRecomCon.html?topicId='+ ipTopicList[i].id +'"><img src="'+ ipTopicList[i].imageUrl +'"/></li>'
					//					});
					//					$('.ipList ul').empty().append(dataBox)
					//					$('.dom-noLoad').hide();
					var ipTopicList = data.data.ipTopicList;
					dataBox = '';
					$.each(ipTopicList, function(i) {
						sendData = '\'' + ipTopicList[i].id + ',' + 'https://api.51app.cn/webPage/tq/app/v1/html/main/ipRecomCon.html?topicId=' + ipTopicList[i].id + '\'';
						dataBox += '<li onclick="sending(' + sendData + ')"><img src="' + ipTopicList[i].imageUrl + '"/></li>'
					});
					$('.ipList ul').empty().append(dataBox)
					$('.dom-noLoad').hide();
				}
			}
			loadData(url, true, successFun);
		} else if (pageName == 'ipRecomCon') { //ip推荐详情页
			url = apiDomain + '/diyapi/topic/detail';
			var topicId = GetQueryString('topicId');
			data = {
				'topicId': topicId
			}
			successFun = function(data) {
				if (data.code == 200) {
					var topicItemList = data.data.topicItemList;
					dataBox = '';
					$.each(topicItemList, function(i) {
						dataBox += '<div class="item">';
						if (topicItemList[i].imageUrl) {
							dataBox += '<div class="ConbannerImg"><img src="' + topicItemList[i].imageUrl + '"/></div>'
						}
						if (topicItemList[i].content) {
							dataBox += '<div class="ConDesc"><span class="ConDescText">' + topicItemList[i].content + '</span></div>'
						}
						if (topicItemList[i].itemGoodsList.length > 0) {
							dataBox += '<div class="seriesBox">';
							var itemGoodsList = topicItemList[i].itemGoodsList;
							dataBox += loadGoods(itemGoodsList);
							dataBox += '</div>';
						};
						dataBox += '</div>';
					});
					$('#RecomCon .RecomConBox').empty().append(dataBox);

					$('.dom-noLoad').hide();
				}
			}
			uploadData(url, true, data, successFun);
		} else if (pageName == 'brandZone') { //品牌专区
			url = apiDomain + '/diyapi/topic/brand';
			successFun = function(data) {
				if (data.code == 200) {
					var bannerList = data.data.bannerList,
						topicItemList = data.data.topicItemList;
					dataBox = '';
					dataBox += '<div class="swiper-wrapper">'
					$.each(bannerList, function(i) {
						//判断banner跳转的是链接还是商品
						if (bannerList[i].isUrl) {
							sendData = '\'' + bannerList[i].urlOpenType + ',' + bannerList[i].url + '\'';
						} else {
							if (bannerList[i].goods) {
								sendData = '\'' + bannerList[i].goods.diyType + ',' + bannerList[i].goods.id + ',' + 0 + '\'';
							}
						}
						dataBox += '<div class="swiper-slide" onClick="sending(' + sendData + ')"><div><img src="' + bannerList[i].imageUrl + '" /></div></div>'

					});
					dataBox += '</div><div class="swiper-pagination"></div>'
					$('#brandZone .swiper-container').empty().append(dataBox);
					//初始化swiper
					var mySwiper = new Swiper('.swiper-container', {
						pagination: '.swiper-pagination',
						loop: true,
						paginationHide: false,
						paginationClickable: true,
						autoplay: 2000,
						autoplayDisableOnInteraction: false,
						observer: true, //修改swiper自己或子元素时，自动初始化swiper
						observeParents: true //修改swiper的父元素时，自动初始化swiper
					});

					dataBox = '';
					$.each(topicItemList, function(i) {
						var imageUrl = topicItemList[i].imageUrl;
						dataBox += '<div class="brandItem"><div class="brandTtileImg"><img src="' + imageUrl + '"/></div><div class="brandGoodsList">';
						var itemGoodsList = topicItemList[i].itemGoodsList;
						var goods = [];
						$.each(itemGoodsList, function(j) {
							var goodsItem = itemGoodsList[j].goods;
							goods.push(goodsItem);
						});
						dataBox += loadGoods(goods);
						dataBox += '</div></div>'
					});
					$('.brandBox').empty().append(dataBox);
					$('.dom-noLoad').hide();
				}
			}
			loadData(url, true, successFun);
		} else if (pageName == 'subjectRecommend') { //专题推荐
			url = apiDomain + '/diyapi/topic/detail';
			var topicId = GetQueryString('topicId')
			data = {
				'topicId': topicId
			}
			successFun = function(data) {
				if (data.code == 200) {
					var topicItemList = data.data.topicItemList;
					dataBox = '';
					$.each(topicItemList, function(i) {
						dataBox += '<div class="item">';
						if (topicItemList[i].imageUrl) {
							dataBox += '<div class="ConbannerImg"><img src="' + topicItemList[i].imageUrl + '"/></div>'
						}
						if (topicItemList[i].itemGoodsList.length > 0) {
							dataBox += '<div class="seriesBox">';
							var itemGoodsList = topicItemList[i].itemGoodsList;
							var goods = [];
							$.each(itemGoodsList, function(j) {
								var goodsItem = itemGoodsList[j].goods;
								goods.push(goodsItem);
							});
							dataBox += loadGoods(goods);
							dataBox += '</div>';
						};
						dataBox += '</div>';
					});
					$('#subjectRecommend .RecomConBox').empty().append(dataBox);
					$('.dom-noLoad').hide();
				}
			}
			uploadData(url, true, data, successFun);
		} else if (pageName == 'goodDetail') { //商品详情
			var dataBox1, errorFun;
			$('.dom-noLoad').show();
			url = apiDomain + '/diyapi/goods/wechat/detail?channel=' + channel + '&goodsId=' + goodsId + '&token=' + token;
			successFun = function(data) {
				var bannerList = data.data.bannerList,
					detailList = data.data.detailList,
					goods = data.data.goods,
					video = data.data.videoList;
				if (data.code == 200) {
					dataBox = "";
					$.each(detailList, function(i) {
						dataBox += '<img src="' + detailList[i].imageUrl + '" /> '
					})
					$('.detail-Img .detail-Img-inner').empty().append(dataBox);

					dataBox = "";
					$.each(bannerList, function(i) {
						dataBox += '<div class="swiper-slide"><a href="#"><img src="' + bannerList[i].imageUrl + '" alt="banner" /></a></div>'
					});
					$('.detail-swiper-container .swiper-wrapper').empty().append(dataBox);

					var mySwiper2 = myApp.swiper('.detail-swiper-container', {
						pagination: '.swiper-pagination',
						speed: 400,
						loop: true
					});

					dataBox = "";
					dataBox1 = "";

					var priceWechat = toDecimal2(goods.showPrice); //将现价金额强制转换成带两位小数的浮点型
					var goodPrice1 = priceWechat.split(".")[0];
					var goodPrice2 = priceWechat.split(".")[1];

					var originalPrice = toDecimal2(goods.originalPrice); //将原价强制转换成带两位小数的浮点型
					var originalPrice1 = originalPrice.split(".")[0];
					var originalPrice2 = originalPrice.split(".")[1];

					var agencyPrice = goods.agencyPrice;
					if (agencyPrice) {
						//代理
						var agencyPrice1 = toDecimal2(agencyPrice).split(".")[0];
						var agencyPrice2 = toDecimal2(agencyPrice).split(".")[1];
						dataBox += '<div class="detail-goodsOuter" data-diyType="' + goods.diyType + '" data-goodsId="' + goods.id + '"><div class="detail-good-top" data-id="' + goods.id + '"><span class="detail-goodName">' + goods.name + '<i style="opacity: 0;"></i></span></div></div><div><div class="detail-good-middle detail-agentGood-middle">代理价<span class="detail-agentGoodPrice">￥<i>' + agencyPrice1 + '.<i style="font-size:0.32rem!important">' + agencyPrice2 + '</i></i></span><span class="detail-agentOldGoodPrice"><i>￥&nbsp;' + originalPrice1 + '.' + originalPrice2 + '</i></span><span class="detail-agentPeopel"><img src="../../img/giftIcon.png"><b>' + goods.soldNum + '人购买</b></span></div></div>'
					} else {
						//普通用户
						dataBox = '<div class="detail-goodsOuter" data-diyType = "' + goods.diyType + '" data-goodsId="' + goods.id + '"><span class="detail-goodPrice">￥<i>' + goodPrice1 + '.<i style="font-size:0.32rem!important">' + goodPrice2 + '</i></i></span><div class="detail-good-top" data-id="' + goods.id + '"><span class="detail-goodName">' + goods.name + '<i></i></span></div></div><div><div class="detail-good-middle"><span class="detail-oldGoodPrice"><i>￥&nbsp;' + originalPrice1 + '.' + originalPrice2 + '</i></span><span class="detail-peopel"><img src="../../img/giftIcon.png"/><b>' + goods.soldNum + '人购买</b></span></div></div>'
					}
					//有活动时显示，没有活动时不显示活动一栏
					if (goods.activityName) {
						dataBox += '<div class="detail-good-bottom"><span>促销<i>' + goods.activityName + '</i></span></div>'
					}
					$('.detailText').empty().append(dataBox);

					//判断是否为自营商品，有就显示
					if (goods.isOwn == true) {
						$('.detail-goodName i').css("opacity", 1);
					} else {
						$('.detail-goodName i').css("opacity", 0);
					};

					dataBox = "";
					if (video.length !== 0) {
						$.each(video, function(k) {
							if (video[k].videoUrl) {
								dataBox = '<div class="content-block-inner" data-videosrc="' + video[k].videoUrl + '" data-videoimg="' + video[k].imageUrl + '" id="video"></div>'
								$('.detail-video').empty().append(dataBox);
							}
						})
						if (devicePlatform == 'android') {
							//加载视频
							var flashvars = {
								f: '',
								c: 0,
								b: 1,
								i: 'img/poster.jpg',
								loaded: 'loadedHandler'
							};
						} else {
							//加载视频
							var flashvars = {
								f: '',
								c: 0,
								b: 1,
								i: '',
								loaded: 'loadedHandler'
							};
						}

						var video = [video[0].videoUrl + '->video/mp4'];
						var support = ['iPad', 'iPhone', 'ios', 'android+false', 'msie10+false'];
						CKobject.embedHTML5('video', 'ckplayer_video', '100%', '100%', video, flashvars, support);

					} else {
						$('.detail-video').hide();
					}

					//diyType=1 时为精品，可以直接购买和加入购物车
					if (goods.diyType == 1) {
						dataBox = '<span class="goShopCar"></span><i class="shu"></i><span class="tabbar-label addCarNow">加入购物车</span><span class="tabbar-label bugNow">立即购买</span>'
						$('#goodDetail .toolbar').css('background-color', '#fff');
						//						$('#goodDetail .toolbar-inner').css('border-top','1px solid #f7f7f8');
					} else {
						var channel = getCookie('channel');
						var goodsId = GetQueryString('goodsId');
						dataBox = '<a href="diy.html?channel=' + channel + '&goodsId=' + goodsId + '" class="tab-link external"><span class="">开启定制之旅</span></a>'
						$('#goodDetail .toolbar').css('background-color', '#fff');
						$('#goodDetail .toolbar-inner').css({'background-color': '#ff5252','height':'50px'});
					}

					$('.toCustumised .toolbar-inner').empty().append(dataBox)
					
					if(isIphoneX()){
						$('.toolbar').css('height','74px');
						$('#goodDetail .toolbar .toolbar-inner').css('padding-bottom','24px');
					}
					if (token) {
						loadShopCarNum();
					}
					$('.dom-noLoad').hide();
				}
			}

			loadData(url, true, successFun);

		} else if (pageName == 'orderComfirm') { //确认订单
			$('.dom-noLoad').show();
			var deliveryAddress;
			var chooseAddressId = localStorage.getItem('chooseAddressId'); //获取地址ID
			var source;
			if (localStorage.getItem('source')) {
				source = localStorage.getItem('source')
			} else {
				source = '';
			}
			var tradeOrderId = GetQueryString("tradeOrderId"); //订单Id
			var dataBox1, dataBox2, dataBox3;
			successFun = function(data) {
				if (data.code == 200) {
					var tradeOrder = data.data.tradeOrder;
					//优惠金额
					var exemptAmount = toDecimal2(data.data.exemptAmount);
					var exemptAmount1 = exemptAmount.split(".")[0];
					var exemptAmount2 = exemptAmount.split(".")[1];

					//总金额
					var totalAmount = toDecimal2(tradeOrder.amount);
					var totalAmount1 = totalAmount.split(".")[0];
					var totalAmount2 = totalAmount.split(".")[1];

					//实际支付金额
					var payAmount = toDecimal2(tradeOrder.payAmount);
					var payAmount1 = payAmount.split(".")[0];
					var payAmount2 = payAmount.split(".")[1];

					//邮费
					var expressFee = toDecimal2(tradeOrder.expressFee);
					var expressFee1 = expressFee.split(".")[0];
					var expressFee2 = expressFee.split(".")[1];

					//总数量
					var totalNum = tradeOrder.num;

					//立减优惠
					//					var exemptAmount = toDecimal2(data.data.exemptAmount);

					var goodsList = data.data.tradeOrder.goodsList;
					var amount = toDecimal2(data.data.tradeOrder.amount); //将拿到的金额强制转换成带两位小数的浮点型
					var amount1 = amount.split(".")[0];
					var amount2 = amount.split(".")[1];
					dataBox = "";
					dataBox1 = "";
					dataBox2 = "";
					dataBox3 = "";
					$.each(goodsList, function(i) {
						var price = toDecimal2(goodsList[i].price); //将拿到的金额强制转换成带两位小数的浮点型
						var goodPrice1 = price.split(".")[0];
						var goodPrice2 = price.split(".")[1];
						if (goodsList.length == 1) {
							dataBox = '<div class="goods-content _fm-clearfix onegoods" data-goodsId="' + goodsList[i].goodsId + '" data-num="' + goodsList[i].num + '" data-tradeOrderGoodsId="' + goodsList[i].id + '"><div class="_fm-img _fm-rel _fm-left"><div class="img-inner"><img class="lazy-loaded" alt="" src="' + goodsList[i].previewImageList[0].imageUrl + '"></div></div><div class="goods-msg _fm-rel"><h2 class="_fm-f-14 _fm-ellipsis">' + goodsList[i].name + '</h2><div class="price-count _fm-abs _fm-bz _fm-lz"><span class="count-num _fm-left _js-formatGoodsPrice haveDone" data-size="16px">￥<span style="font-size: 16px">' + goodPrice1 + '.</span>' + goodPrice2 + '</span><div class="count total-num"><div class="subtract op-l"><img src="../../img/ap-subtract.png"></div>	<input disabled="" type="text" value="' + goodsList[i].num + '" name="number" pattern="[0-9]*" maxlength="4" class="num"><div class="add op-r"><img src="../../img/ap-add.png"></div></div></div><p class="style _fm-overhide">' + goodsList[i].goodsStyleDesc + '</p></div></div>'
						} else {
							dataBox1 += '<div class="area-elem _fm-inline" data-goodsId="' + goodsList[i].goodsId + '"  data-num="' + goodsList[i].num + '"><div class="_fm-img"><div class="img-inner"><img src="' + goodsList[i].previewImageList[0].imageUrl + '" alt=""></div></div></div>';
							dataBox = '<a class="one-item img-show _fm-block" href="#goodsList"><div class="right-ico _fm-right"><span class="_fm-back-right">&nbsp;</span></div><div class="img-show-area"><div class="img-show-areaScroll">' + dataBox1 + '</div></div><div class="oneGood"><p class="one-item _fm-f-13 onePrice">￥' + amount1 + '.' + amount2 + '</p><p class="one-item _fm-f-13 oneNun">共' + totalNum + '件</p></div></a>';
							dataBox2 += '<section class="goods-content _fm-clearfix"><input name="isBoutique" class="isBoutique" value="1" type="hidden"><div class="_fm-img _fm-rel _fm-left"><div class="img-inner"><img class="lazy-loaded" alt="" src="' + goodsList[i].previewImageList[0].imageUrl + '"></div></div><div class="goods-msg _fm-rel"><h2 class="_fm-f-14 _fm-ellipsis">' + goodsList[i].name + '</h2><div class="price-count _fm-abs _fm-bz _fm-lz"><span class="count-num _fm-left _js-formatGoodsPrice haveDone" data-size="16px">￥<span style="font-size: 16px">' + goodPrice1 + '.</span>' + goodPrice2 + '</span><div class="total-num _fm-right">x<span class="num">' + goodsList[i].num + '</span></div></div><p class="style _fm-overhide">' + goodsList[i].goodsStyleDesc + '</p></div></section>';
						}
					});
					$('.goodsList .goods-detail').empty().append(dataBox2);
					$('.shoppingcar-confirm .goods-detailList').empty().append(dataBox);
					$('.shoppingcar-confirm .totalNum').text("共"+ data.data.tradeOrder.num +"件")

					dataBox2 = '<div class="toolbar-inner _fm-block _fm-rel _fm-overhide"><span class="total _fm-f-18" data-payAmount="' + payAmount + '" data-totalNum="' + totalNum + '">合计:<span class="count-num _fm-f-14" data-size="18px">￥<span style="font-size: 18px">' + payAmount1 + '.</span>' + payAmount2 + '</span></span><span class="submit do _fm-right _fm-txtcenter _fm-f-18">提交订单</span></div>';
					$('.shoppingcar-confirm .toolbar').empty().append(dataBox2);
					
					if(isIphoneX()){
						$('.toolbar').css('height','74px');
						$('.toolbar-inner').css('padding-bottom','24px');
						$('.page-content').css('padding-bottom','70px')
					}
					if (data.data.deliveryAddress) {
						dataBox3 = '<div class="left-ico _fm-left"><i class="_fm-rel _fm-inline _fm-txtcenter">&nbsp;</i></div><div class="msg"><p class="_fm-overhide _fm-f-15"><span class="name _fm-ellipsis" data-deliveryAddress="' + data.data.deliveryAddress.id + '"data-name="' + data.data.deliveryAddress.name + '">收货人: ' + data.data.deliveryAddress.name + '</span><span class="_fm-right userPhone" data-phone="' + data.data.deliveryAddress.phone + '">' + data.data.deliveryAddress.phone + '</span></p><div class="address _fm-overhide" data-Province="' + data.data.deliveryAddress.province + '" data-County="' + (data.data.deliveryAddress.city || "") + '" data-Address="' + (data.data.deliveryAddress.county || "") + '">收货地址：' + data.data.deliveryAddress.provinceName + '&nbsp;' + (data.data.deliveryAddress.cityName || "") + '&nbsp;' + (data.data.deliveryAddress.countyName || "") + '&nbsp;' + data.data.deliveryAddress.address + '</div></div>'
						$('.order-msg .orderComfirm-address').empty().append(dataBox3);
					} else {
						dataBox3 = '<div class="noAddress" style="margin: 0 auto;text-align: center;line-height: 1.8rem;"><a href="../subject/useAddress.html" style="font-size: 0.3rem;display: inline-block;width:100%;height:100%">新增收货地址</a></div>';
						$('.order-msg .orderComfirm-address').empty().append(dataBox3);
					}

					dataBox = '<span class="center">商品详情</span><a href="#" class="left back left-txt _fm-abs _fm-tz _fm-lz _fm-f-14"><i class="_fm-back-left">&nbsp;</i>返回</a><span class="right-txt _fm-abs _fm-tz _fm-rz _fm-f-14">共' + totalNum + '件</span>'
					$('.shoppingcar-confirm .goodsList-nav').empty().append(dataBox);

					dataBox = '<span>运费:</span><span class="_fm-right" style="color: #ff5252;">+ ￥<i class="postPrice" data-expressFee="' + expressFee + '">' + expressFee1 + '.' + expressFee2 + '</i><i class="postFeeIcon"></i></span>';
					$('.shoppingcar-confirm .postFee').empty().append(dataBox);

					dataBox = '<span class="discountNow">立减优惠：</span><span class="_fm-right" style="color: #ff5252;">- ￥<i class="discountNowPrice">' + exemptAmount + '</i></span>'
					$('.shoppingcar-confirm .DiscountNow').empty().append(dataBox);
					var width = $('.goods-detailList .img-show-area .area-elem').eq(0).width();
					var len = $('.goods-detailList .img-show-area .area-elem').length;
					$('.goods-detailList .img-show-area .img-show-areaScroll').css('width', (Number(width)+10) * len + 'px');

					//平安活动商品 在优惠券的地方单独处理
					dataBox = '';
//					var count;
					if (goodsList.length == 1) {
						dataBox = '';
//						count = 0;
//						var s1 = $('.onegoods').attr('data-goodsId');
//						var s2 = $('.onegoods').attr('data-num');
//						if (s1 == 130 || s1 == 131 || s1 == 132 || s1 == 133 || s1 == 134 || s1 == 135 || s1 == 136 || s1 == 138 || s1 == 42 || s1 == 144) {
//							count = s2;
//							dataBox = '<a href="../subject/coupon.html" style="color:#575757"><span class="_fm-left">选择优惠券：</span><div class="msg _fm-overhide"><span class="_fm-right _fm-ellipsis">活动已默认优惠' + 30 * count + '元</span></div></a>'
//						} else {
							dataBox = '<a href="../subject/coupon.html" style="color:#575757"><span class="_fm-left">选择优惠券：</span><div class="right-ico _fm-right" style="margin-top: -3px;"><span class="_fm-back-right">&nbsp;</span></div><div class="msg _fm-overhide"><span class="_fm-right _fm-ellipsis">无可用优惠券</span></div></a>'
//						}
					} else {
//						count = 0;
						dataBox = '';
//						for (var i = 0; i < goodsList.length; i++) {
//							var s1 = $('.area-elem').eq(i).attr('data-goodsId');
//							var s2 = $('.area-elem').eq(i).attr('data-num');
//							if (s1 == 130 || s1 == 131 || s1 == 132 || s1 == 133 || s1 == 134 || s1 == 135 || s1 == 136 || s1 == 138 || s1 == 42 || s1 == 144) {
//								count += Number(s2)
//							}
//						}
//						if (count > 0) {
//							dataBox = '<a href="../subject/coupon.html" style="color:#575757"><span class="_fm-left">选择优惠券：</span><div class="msg _fm-overhide"><span class="_fm-right _fm-ellipsis">活动已默认优惠' + 30 * count + '元</span></div></a>'
//						} else {
							dataBox = '<a href="../subject/coupon.html" style="color:#575757"><span class="_fm-left">选择优惠券：</span><div class="right-ico _fm-right" style="margin-top: -3px;"><span class="_fm-back-right">&nbsp;</span></div><div class="msg _fm-overhide"><span class="_fm-right _fm-ellipsis">无可用优惠券</span></div></a>'
//						}
					}
					$('.shoppingcar-confirm .coupon').empty().append(dataBox);

					dataBox = '';
					//判断用户平台 安卓还是ios
					//					if(devicePlatform == 'android'){
					//						dataBox = '<li class="method-elem _fm-overhide" data-method="alipay_wap"><img class="_fm-left ico" src="img/zhifubao.png" alt="支付宝"><div class="right-ico _fm-right do active payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">支付宝支付</h1></div></li><li class="method-elem1 _fm-overhide" data-method="upacp_wap"><img class="_fm-left ico" src="img/unionPay.png" alt="银联"><div class="right-ico _fm-right do payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">银联支付(账户正在开通中，敬请期待)</h1></div></li>'
					//					}else{
					//判断是否在微信浏览器中打开，如果在微信浏览器中打开，则将微信支付关闭
					if (deviceBrowser) {
						//判断是否是在第三方公众号的链接
						var source = localStorage.getItem('source');
						if (source == 'omp') {
							dataBox = '<li class="method-elem _fm-overhide" data-method="alipay_wap"><img class="_fm-left ico" src="../../img/zhifubao.png" alt="支付宝"><div class="right-ico _fm-right do active payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">支付宝支付</h1></div></li><li class="method-elem _fm-overhide" data-method="upacp_wap"><img class="_fm-left ico" src="../../img/unionPay.png" alt="银联"><div class="right-ico _fm-right do payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">银联支付</h1></div></li>'
						} else {
							dataBox = '<li class="method-elem _fm-overhide" data-method="wx_pub"><img class="_fm-left ico" src="../../img/wechat.png" alt="微信"><div class="right-ico _fm-right do active payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">微信支付</h1></div></li><li class="method-elem _fm-overhide" data-method="upacp_wap"><img class="_fm-left ico" src="../../img/unionPay.png" alt="银联"><div class="right-ico _fm-right do payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">银联支付</h1></div></li><li class="method-elem _fm-overhide" data-method="alipay_wap"><img class="_fm-left ico" src="../../img/zhifubao.png" alt="支付宝"><div class="right-ico _fm-right do payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">支付宝支付</h1></div></li>'
						}
					} else {
						dataBox = '<li class="method-elem _fm-overhide" data-method="wx_wap"><img class="_fm-left ico" src="../../img/wechat.png" alt="微信"><div class="right-ico _fm-right do active payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">微信支付</h1></div></li><li class="method-elem _fm-overhide" data-method="upacp_wap"><img class="_fm-left ico" src="../../img/unionPay.png" alt="银联"><div class="right-ico _fm-right do payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">银联支付</h1></div></li><li class="method-elem _fm-overhide" data-method="alipay_wap"><img class="_fm-left ico" src="../../img/zhifubao.png" alt="支付宝"><div class="right-ico _fm-right do payMethod" data-op="payMethod"><span class="_fm-check-1">&nbsp;</span></div><div class="msg"><h1 class="_fm-f-14">支付宝支付</h1></div></li>'
					}
					//					}
					$('.shoppingcar-confirm .pay-method').empty().append(dataBox);

					//					$('.shoppingcar-confirm .pay-method').find('.method-elem1').hide();//银联暂未开通

					dataBox = '';
					dataBox = '<span>备注：</span><input type="text" class="remarkTextarea" placeholder="对本次交易的说明(建议填写)" maxlength="50">';
					$('.shoppingcar-confirm .remarkInfo').empty().append(dataBox);
					var orderMsg = window.localStorage.getItem('orderMsg');
					$('.shoppingcar-confirm .remarkInfo .remarkTextarea').val(orderMsg);
					isShowSubtract();
					if(GetQueryString('fromgroup')){
						$('.shoppingcar-confirm .price-count .count').hide();
						$('.pay-method .method-elem').eq(2).hide();
						$('.pay-method .method-elem').eq(1).css('border-bottom','none');
					}
					$('.dom-noLoad').hide();

				}
			}

			if (chooseAddressId && chooseAddressId !== 'undefined') {
				loadData(apiDomain + '/diyapi/trade/preorder/detail?tradeOrderId=' + tradeOrderId + '&deliveryAddressId=' + chooseAddressId, true, successFun);
			} else {
				loadData(apiDomain + '/diyapi/trade/preorder/detail?tradeOrderId=' + tradeOrderId, true, successFun);
			}

		}

	})
}

//我的订单 页面
var loadMyOrder = function(data) {
	var url, successFun, dataBox, dataBox1, dataBox2;
	var pageName = $('.page').attr('data-page');
	if (pageName == "myOrder") {
		$('.dom-noLoad').show();
		url = apiDomain + '/diyapi/trade/order/list';
		successFun = function(data) {
			if (data.code == 200) {
				dataBox = "";
				dataBox1 = "";
				dataBox2 = "";
				if (data.data != '' && data.data != null) {
					$.each(data.data, function(i) {
						var goodsList = data.data[i].goodsList;
						var merchant = data.data[i].merchant;
						var expressFee = toDecimal2(data.data[i].expressFee);
						var expressNo = data.data[i].expressNo;
						var totalAmount = toDecimal2(data.data[i].payAmount);
						dataBox += '<section class="order-elem do"><div class="title _fm-overhide _fm-f-14"><span class="_fm-left">' + merchant.name + '</span><span class="_fm-right"></span>';
						dataBox += '<span class="_fm-right order-status">' + ({
							"0": "待付款",
							"1": "待发货",
							"2": "待收货",
							"8": "订单已完成",
							"-3": "订单已取消",
							"-2": "订单已过期",
							"3": "订单已完成",
							"-4": "已退款"
						}[data.data[i].status] || '') + '</span></div><p class="division1 _fm-rel"></p><div class="goods-detail">';
						if (goodsList) {
							$.each(goodsList, function(j) {
								var imageUrl;
								if (goodsList[j].previewImageList.length > 0) {
									imageUrl = goodsList[j].previewImageList[0].imageUrl;
								} else {
									imageUrl = ''
								}
								var goodPrice = toDecimal2(goodsList[j].price); //将拿到的金额强制转换成带两位小数的浮点型
								var goodPrice1 = goodPrice.split(".")[0];
								var goodPrice2 = goodPrice.split(".")[1];
								dataBox += '<div class="goods-content _fm-clearfix" data-id="' + goodsList[j].id + '" data-tradeOrderId="' + data.data[i].id + '"><a class="external" href="orderDetail.html?tradeOrderId=' + goodsList[j].tradeOrderId + '&channel=' + channel + '"><div class="_fm-img _fm-rel _fm-left"><div class="img-inner"><img class="lazy" data-src="" alt="" src="' + imageUrl + '"></div></div><div class="goods-msg _fm-rel"><h2 class="_fm-f-14 _fm-ellipsis">' + goodsList[j].name + '</h2><div class="price-count _fm-abs _fm-bz _fm-lz" data-price="' + goodPrice + '"><span class="count-num _fm-left _js-formatGoodsPrice haveDone">￥<span style="font-size: 16px">' + goodPrice1 + '.</span>' + goodPrice2 + '</span><div class="total-num _fm-right">x<span class="num">' + goodsList[j].num + '</span></div></div><p class="style _fm-overhide">' + goodsList[j].goodsStyleDesc + '</p></div></a></div>'
							});
						}

						if (data.data[i].status == 0) {
							dataBox += '</div><p class="division1 _fm-rel"></p><div class="OrderTotal"><span class="qualityTotal">共<i>' + data.data[i].num + '</i>件商品</span><span class="priceTotal">合计:￥<i class="totalAmount">' + totalAmount + '</i>(含运费:￥<i>' + expressFee + '</i>)</span></div><p class="division1 _fm-rel"></p><div class="elem-footer _fm-overhide"><span class="or do or payfor">立即付款</span><span class="do cancelOrder">取消订单</span><span class="do addShoppingCar">加入购物车</span></div></section>'
						} else if (data.data[i].status == 1) {
							dataBox += '</div><p class="division1 _fm-rel"></p><div class="OrderTotal"><span class="qualityTotal">共<i>' + data.data[i].num + '</i>件商品</span><span class="priceTotal">合计:￥<i class="totalAmount">' + totalAmount + '</i>(含运费:￥<i>' + expressFee + '</i>)</span></div><p class="division1 _fm-rel"></p><div class="elem-footer _fm-overhide"><span class="do remindShip">提醒发货</span></div></section>'
						} else if (data.data[i].status == 2) {
							dataBox += '</div><p class="division1 _fm-rel"></p><div class="OrderTotal"><span class="qualityTotal">共<i>' + data.data[i].num + '</i>件商品</span><span class="priceTotal">合计:￥<i class="totalAmount">' + totalAmount + '</i>(含运费:￥<i>' + expressFee + '</i>)</span></div><p class="division1 _fm-rel"></p><div class="elem-footer _fm-overhide"><span class="do viewLogistics" data-expressNo="' + expressNo + '">查看物流</span><span class="do confirmReceipt">确认收货</span></div></section>'
						} else if (data.data[i].status == 8 || data.data[i].status == 3) {
							dataBox += '</div><p class="division1 _fm-rel"></p><div class="OrderTotal"><span class="qualityTotal">共<i>' + data.data[i].num + '</i>件商品</span><span class="priceTotal">合计:￥<i class="totalAmount">' + totalAmount + '</i>(含运费:￥<i>' + expressFee + '</i>)</span></div><p class="division1 _fm-rel"></p><div class="elem-footer _fm-overhide"><span class="do viewLogistics" data-expressNo="' + expressNo + '">查看物流</span><span class="do deleteOrder">删除订单</span></div></section>'
						} else if (data.data[i].status == -3) {
							dataBox += '</div><p class="division1 _fm-rel"></p><div class="OrderTotal"><span class="qualityTotal">共<i>' + data.data[i].num + '</i>件商品</span><span class="priceTotal">合计:￥<i class="totalAmount">' + totalAmount + '</i>(含运费:￥<i>' + expressFee + '</i>)</span></div><p class="division1 _fm-rel"></p><div class="elem-footer _fm-overhide"><span class="do addShoppingCar">加入购物车</span><span class="do deleteOrder">删除订单</span></div></section>'
						} else if (data.data[i].status == -2) {
							dataBox += '</div><p class="division1 _fm-rel"></p><div class="OrderTotal"><span class="qualityTotal">共<i>' + data.data[i].num + '</i>件商品</span><span class="priceTotal">合计:￥<i class="totalAmount">' + totalAmount + '</i>(含运费:￥<i>' + expressFee + '</i>)</span></div><p class="division1 _fm-rel"></p><div class="elem-footer _fm-overhide"><span class="do addShoppingCar">加入购物车</span><span class="do deleteOrder">删除订单</span></div></section>'
						} else if (data.data[i].status == -4) {
							dataBox += '</div><p class="division1 _fm-rel"></p><div class="OrderTotal"><span class="qualityTotal">共<i>' + data.data[i].num + '</i>件商品</span><span class="priceTotal">合计:￥<i class="totalAmount">' + totalAmount + '</i>(含运费:￥<i>' + expressFee + '</i>)</span></div><p class="division1 _fm-rel"></p><div class="elem-footer _fm-overhide"><span class="do deleteOrder">删除订单</span></div></section>'
						}

					});
				} else {
					dataBox = '<div style="text-align: center;margin-top: 2.5rem;"><div><img src="../../img/noOrder.png"/ style="width:3.49rem;margin: 0 auto;padding-bottom:0.5rem"></div><div class="no-order">您还没有订单哦，<a style="color:#007aff!important" href="index.html?channel=' + channel + '" class="external">赶紧去下单吧</a></div></div>'
				}
				$('.mian-content').empty().append(dataBox);
				$('.dom-noLoad').hide();
			} else {
				dataBox = '<div style="text-align: center;margin-top: 2.5rem;"><div><img src="../../img/noOrder.png"/ style="width:3.49rem;margin:0 auto;padding-bottom:0.5rem"></div><div class="no-order">您还没有订单哦，<a style="color:#007aff!important" href="index.html?channel=' + channel + '" class="external">赶紧去下单吧</a></div></div>'
				$('.mian-content').empty().append(dataBox);
				$('.dom-noLoad').hide();
			}

		}
		uploadData(url, true, data, successFun);

	}
}

//加入购物车
$('.order-list').on('click', '.addShoppingCar', function() {
	var length = $(this).parents('.order-elem').find('.goods-detail').find('.goods-content').length;
	var that = $(this);
	var tradeOrderId = $(this).parents('.elem-footer').siblings('.goods-detail').find('.goods-content').attr('data-tradeOrderId');
	var data = {
		'tradeOrderId': tradeOrderId,
		'token': token
	};
	$.ajax({
		url: apiDomain + '/diyapi/trade/order/reorder',
		type: 'POST',
		timeout: 0,
		async: true,
		data: data,
		dataType: 'json',
		beforeSend: function() {},
		success: function(data) {
			layer.open({
				content: '已加入购物车',
				skin: 'msg',
				time: 1 //2秒后自动关闭
			});

			//统计加入购物车的数据
			for (var i = 0; i < length; i++) {
				var goodsId = that.parents('.order-elem').find('.goods-detail').find('.goods-content').eq(i).attr('data-id');
				var name = that.parents('.order-elem').find('.goods-detail').find('.goods-content').eq(i).find('.goods-msg').find('h2').text();
				var unitPrice = Number(that.parents('.order-elem').find('.goods-detail').find('.goods-content').eq(i).find('.goods-msg').find('.price-count').attr('data-price')) * 100;
				var ADDItem = {
					"goodsId": goodsId,
					"name": name,
					"unitPrice": unitPrice,
					"count": 1
				};
				//							TDH5SDK.iap.addItem(ADDItem);
			}
			loadPage();
		},
		error: function(data) {
			console.log("加入购物车失败")
		}
	})
})

//取消订单	
$('.order-list').on('click', '.cancelOrder', function() {
	var tradeOrderId = $(this).parents('.elem-footer').siblings('.goods-detail').find('.goods-content').attr('data-tradeOrderId');
	var data = {
		'tradeOrderId': tradeOrderId,
		'token': token
	};
	$.ajax({
		url: apiDomain + '/diyapi/trade/order/cancel',
		type: 'POST',
		timeout: 0,
		async: true,
		data: data,
		dataType: 'json',
		beforeSend: function() {},
		success: function(data) {
			layer.open({
				content: '订单已取消',
				skin: 'msg',
				time: 1 //2秒后自动关闭
			});
			var length = $('body .goods-content').length;
			for (var i = 0; i < length; i++) {
				var tradeOrderId = $('body .goods-content').eq(i).attr('data-tradeOrderId');
				if (tradeOrderId == data.data) {
					$('body .goods-content').eq(i).parents('.goods-detail').siblings('.elem-footer').html('<span class="do addShoppingCar">加入购物车</span><span class="do deleteOrder">删除订单</span>')
					$('body .goods-content').eq(i).parents('.goods-detail').siblings('.title').find('.order-status').text('订单已取消');
				}
			}
		},
		error: function(data) {
			console.log("取消订单失败")
		}
	})
})

//立即付款
$('.order-list').on('click', '.payfor', function() {
	//获取订单数据
	var arr = [];
	var length = $(this).parents('.goods-detail').find('.goods-content').length;
	for (var i = 0; i < length; i++) {
		var id = $(this).parents('.goods-detail').find('.goods-content').eq(i).attr('data-id');
		var name = $(this).parents('.goods-detail').find('.goods-content').eq(i).find('.goods-msg').find('h2').text();
		var price = Number($(this).parents('.goods-detail').find('.goods-content').eq(i).find('.goods-msg').find('.price-count').attr('data-price')) * 100;
		var num = $(this).parents('.goods-detail').find('.goods-content').eq(i).find('.goods-msg').find('.price-count').find('.num').text();
		var strData = {
			"id": id,
			"name": name,
			"category": name,
			"unitPrice": price,
			"count": num
		}
		arr.push(strData)
	}

	var amount = Number($(this).parents('.order-elem').find('.OrderTotal').find('.priceTotal').find('.totalAmount').text()) * 100;
	var orderId = $(this).parents('.elem-footer').siblings('.goods-detail').find('.goods-content').attr('data-tradeOrderId');
	var itemCount = $('.qualityTotal i').text();

	var token = getCookie('token');
	var TradeOrderId = $(this).parents('.elem-footer').siblings('.goods-detail').find('.goods-content').attr('data-tradeOrderId');
	cashier('body', TradeOrderId, orderId, amount, arr, itemCount);

})

//提醒发货
$('.order-list').on('click', '.remindShip', function() {
	var tradeOrderId = $(this).parents('.elem-footer').siblings('.goods-detail').find('.goods-content').attr('data-tradeOrderId');
	var data = {
		'tradeOrderId': tradeOrderId,
		'token': token
	};
	$.ajax({
		url: apiDomain + '/diyapi/trade/order/remind',
		type: 'POST',
		timeout: 0,
		async: true,
		data: data,
		dataType: 'json',
		beforeSend: function() {},
		success: function(data) {
			if (data.code == 200) {
				layer.open({
					content: '已提醒小优尽快发货，请耐心等待',
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
			} else if (data.code == -1) {
				layer.open({
					content: '操作失败，请重试',
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
			} else {
				layer.open({
					content: '今天已提醒过了，小优已经在加班加点准备您的宝贝了哦',
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
			}
		},
		error: function(data) {
			console.log("提醒发货失败")
		}
	})
})

//查看物流
$('.order-list').on('click', '.viewLogistics', function() {
	//						var tradeOrderId = $(this).parents('.elem-footer').siblings('.goods-detail').find('.goods-content').attr('data-tradeOrderId');
	//						window.location.href = "expressTracking.html?tradeOrderId=" + tradeOrderId;
	var nowUrl = window.location.href;
	var expressNo = $(this).attr('data-expressNo');
	window.location.href = 'https://m.kuaidi100.com/index_all.html?type=shentong&postid=' + expressNo + '&callbackurl=' + nowUrl;
})

//确认收货
$('.order-list').on('click', '.confirmReceipt', function() {
	var tradeOrderId = $(this).parents('.elem-footer').siblings('.goods-detail').find('.goods-content').attr('data-tradeOrderId');
	var data = {
		'tradeOrderId': tradeOrderId,
		'token': token
	};
	myApp.confirm('您确定已经收到货了吗?', '',
		function() {
			$.ajax({
				url: apiDomain + '/diyapi/trade/order/receive',
				type: 'POST',
				timeout: 0,
				async: true,
				data: data,
				dataType: 'json',
				beforeSend: function() {},
				success: function(data) {
					var length = $('body .goods-content').length;
					for (var i = 0; i < length; i++) {
						var tradeOrderId = $('body .goods-content').eq(i).attr('data-tradeOrderId');
						if (tradeOrderId == data.data) {
							$('body .goods-content').eq(i).parents('.goods-detail').siblings('.elem-footer').html('<span class="do addShoppingCar">加入购物车</span><span class="do deleteOrder">删除订单</span>')
							$('body .goods-content').eq(i).parents('.goods-detail').siblings('.title').find('.order-status').text('订单已完成');
						}
					}
					layer.open({
						content: '您已确认收货',
						skin: 'msg',
						time: 1 //1秒后自动关闭
					});
				},
				error: function(data) {
					console.log("确认收货失败")
				}
			})
		},
		function() {
			return;
		}
	);

})

//删除订单
$('.order-list').on('click', '.deleteOrder', function() {
	$(this).parent('.elem-footer').addClass('deleteClick');
	var tradeOrderId = $(this).parents('.elem-footer').siblings('.goods-detail').find('.goods-content').attr('data-tradeOrderId');
	var data1 = {
		'tradeOrderId': tradeOrderId,
		'token': token
	};
	$.ajax({
		url: apiDomain + '/diyapi/trade/order/delete',
		type: 'POST',
		timeout: 0,
		async: true,
		data: data1,
		dataType: 'json',
		beforeSend: function() {},
		success: function(data) {
			layer.open({
				content: '订单已删除',
				skin: 'msg',
				time: 1 //2秒后自动关闭
			});
			var token = getCookie('token');
			var status = GetQueryString('status');
			var data = {
				'status': status,
				'token': token
			};

			var length = $('.order-list .order-elem').length;
			for (var i = 0; i < length; i++) {
				if ($('.order-list .order-elem').eq(i).find('.elem-footer').hasClass('deleteClick')) {
					$('.order-list .order-elem').eq(i).hide();
				}
			}
		},
		error: function(data) {
			console.log("删除订单失败")
		}
	})
})

//点击上方tab栏
$('.order-list .page .sub-navi').on('click', 'li', function() {
	$(this).addClass("active").siblings('li').removeClass("active");
	var type = $(this).attr('data-type');
	if (type == 0) {
		var data = {
			'status': '',
			'token': token
		};
		loadMyOrder(data); //加载全部订单
	} else if (type == 1) {
		var data = {
			'status': 0,
			'token': token
		}; //加载待付款订单
		loadMyOrder(data);
	} else if (type == 2) {
		var data = {
			'status': 1,
			'token': token
		};
		loadMyOrder(data); //加载待发货订单
	} else if (type == 3) {
		var data = {
			'status': 2,
			'token': token
		};
		loadMyOrder(data); //加载待收货订单
	}
})

//我的订单页面结束

//订单详情页面加载
var countDown = null; //定义一个倒计时
var loadOrderDetail = function(data) {
	$('.dom-noLoad').show();
	var url, successFun, dataBox, dataBox1, dataBox2;
	var tradeOrderId = GetQueryString('tradeOrderId');
	var from = GetQueryString('from');
	//如果是从支付过来的订单详情，则直接返回到首页
	if(from){
		$('.order-detail').find('.navbar-inner').addClass('backToIndex');
		$('.order-detail').find('.backToIndex').find('.left').removeClass('ALLhistoryback').addClass('historyback');
	}else{
		$('.order-detail').find('.navbar-inner').removeClass('backToIndex');
		$('.order-detail').find('.navbar-inner').find('.left').removeClass('historyback').addClass('ALLhistoryback');
	}
	var data = {
		'tradeOrderId': tradeOrderId,
		'from': from
	}
	url = apiDomain + '/diyapi/trade/order/detail';
	successFun = function(data) {
		if (data.code == 200) {
			dataBox = "";
			dataBox1 = "";
			dataBox2 = "";
			var logistic = data.data.logistic; //最新物流状态
			var tradeOrder = data.data.tradeOrder; //交易详情
			var goodsList = data.data.tradeOrder.goodsList;
			var merchant = data.data.tradeOrder.merchant;

			if (tradeOrder.status == 0) {
				dataBox = '';
				payExpire = data.data.payExpire;
				var time = payExpire;
				var sec = time % 60; //秒
				time = Math.floor(time / 60); //分钟
				var min = time % 60; //
				time = Math.floor(time / 60); //小时
				var hour = time % 24;
				var day = Math.floor(time / 24); //天数
				dataBox = '<div class="left-ico _fm-left orderToPay"><i class="_fm-rel _fm-inline _fm-txtcenter">&nbsp;</i></div><div class="msg"><p class="_fm-overhide _fm-f-15"><span class="status _fm-left _fm-ellipsis">待付款</span></p><div class="address _fm-overhide"><div><span class="Timerloose">' + day + '天' + hour + '小时' + min + '分' + sec + '秒</span><span style="float:right;margin-right:0.25rem;">订单将关闭</span></div></div>';
				$('.order-detail .page .shipping').empty().append(dataBox);

				clearInterval(countDown);
				countDown = setInterval(function() {
					payExpire--;
					var time = payExpire;
					var sec = time % 60; //秒
					time = Math.floor(time / 60); //分钟
					var min = time % 60; //
					time = Math.floor(time / 60); //小时
					var hour = time % 24;
					var day = Math.floor(time / 24); //天数   
					$('.order-detail .page .shipping .Timerloose').html(day + '天' + hour + '小时' + min + '分' + sec + '秒')

				}, 1000)

				dataBox1 = '<span class="do or payfor">立即付款</span><span class="do cancelOrder">取消订单</span><span class="do addShoppingCar">加入购物车</span>'
			} else if (tradeOrder.status == 1) {
				clearInterval(countDown);
				dataBox = '';
				dataBox = '<div class="left-ico _fm-left orderToShip"><i class="_fm-rel _fm-inline _fm-txtcenter">&nbsp;</i></div><div class="msg"><p class="_fm-overhide _fm-f-15"><span class="status _fm-left _fm-ellipsis">待发货</span></p><div class="address _fm-overhide">订单正在处理中，请耐心等候哦</div>';
				dataBox1 = '<span class="or do remindShip">提醒发货</span><span class="do srevice">联系客服</span>';

			} else if (tradeOrder.status == 2) {
				clearInterval(countDown);
				dataBox = '';
				//						dataBox = '<div class="left-ico _fm-left orderToRecive" data-expressNo="'+ logistic.expressNo +'"><i class="_fm-rel _fm-inline _fm-txtcenter">&nbsp;</i></div><div class="msg"><p class="_fm-overhide _fm-f-15"><span class="status _fm-left _fm-ellipsis">待收货</span></p><div class="address _fm-overhide"><span class="_fm-left">物流信息:</span><span class="_fm-right willget">'
				//								+ logistic.trace.station +'</span></div><div class="time _fm-overhide">'+ logistic.trace.time +'</div></div>';
				//使用快递100查询物流，暂时隐藏中间物流信息
				dataBox = '<div class="left-ico _fm-left orderToRecive" data-expressNo="' + logistic.expressNo + '"><i class="_fm-rel _fm-inline _fm-txtcenter">&nbsp;</i></div><div class="msg"><p class="_fm-overhide _fm-f-15" style="margin-bottom: 0.2rem;"><span class="status _fm-left _fm-ellipsis">待收货</span></p><div class="time _fm-overhide">' + logistic.trace.time + '</div></div>';
				dataBox1 = '<span class="do viewLogistics" data-expressNo="' + logistic.expressNo + '">查看物流</span><span class="do or confirmReceipt">确认收货</span><span class="do srevice">联系客服</span>'

				$('.order-detail .page .shipping').addClass('OrderToRecive')
			} else if (tradeOrder.status == -3) {
				clearInterval(countDown);
				dataBox = '';
				dataBox = '<div class="left-ico _fm-left orderCancel"><i class="_fm-rel _fm-inline _fm-txtcenter">&nbsp;</i></div><div class="msg"><p class="_fm-overhide _fm-f-15"><span class="status _fm-left _fm-ellipsis">订单已取消</span></p><div class="address _fm-overhide">如需再次购买，请重新加入购物车下单</div>';
				dataBox1 = '<span class="do addShoppingCar">加入购物车</span><span class="do deleteOrder">删除订单</span><span class="do srevice">联系客服</span>'

			} else if (tradeOrder.status == 8 || tradeOrder.status == 3) {
				clearInterval(countDown);
				dataBox = '';
				dataBox = '<div class="left-ico _fm-left ordersucced"><i class="_fm-rel _fm-inline _fm-txtcenter">&nbsp;</i></div><div class="msg"><p class="_fm-overhide _fm-f-15"><span class="status _fm-left _fm-ellipsis">订单已完成</span></p><div class="address _fm-overhide">感谢您在乐乐定制商城购物，欢迎再次光临！</div>';
				dataBox1 = '<span class="or do addShoppingCar">加入购物车</span><span class="do deleteOrder">删除订单</span><span class="do srevice">联系客服</span>'

			} else if (tradeOrder.status == -2) {
				clearInterval(countDown);
				dataBox = '';
				dataBox = '<div class="left-ico _fm-left ordersucced"><i class="_fm-rel _fm-inline _fm-txtcenter">&nbsp;</i></div><div class="msg"><p class="_fm-overhide _fm-f-15"><span class="status _fm-left _fm-ellipsis">交易关闭</span></p><div class="address _fm-overhide">订单超时未支付，请重新加入购物车下单</div>';
				dataBox1 = '<span class="or do addShoppingCar">加入购物车</span><span class="do deleteOrder">删除订单</span><span class="do srevice">联系客服</span>'

			} else if (tradeOrder.status == -4) {
				clearInterval(countDown);
				dataBox = '';
				dataBox = '<div class="left-ico _fm-left ordersucced"><i class="_fm-rel _fm-inline _fm-txtcenter">&nbsp;</i></div><div class="msg"><p class="_fm-overhide _fm-f-15"><span class="status _fm-left _fm-ellipsis">交易关闭</span></p><div class="address _fm-overhide">该笔订单已进行退款处理，如有疑问请联系客服</div>';
				dataBox1 = '<span class="do deleteOrder">删除订单</span><span class="do srevice">联系客服</span>'
			}

			$('.order-detail .page .shipping').empty().append(dataBox);
			$('.order-detail .toolbar .toolbar-inner').empty().append(dataBox1);
			
			if(isIphoneX()){
				$('.toolbar').css('height','74px');
				$('.toolbar-inner').css('padding-bottom','24px');
				$('.page-content').css('padding-bottom','70px')
			}

			var dataBox = "";
			dataBox = '<div class="left-ico _fm-left"><i class="_fm-rel _fm-inline _fm-txtcenter">&nbsp;</i></div> <div class="msg" style="border:none"><p class="_fm-overhide _fm-f-15"><span class="name _fm-left _fm-ellipsis">' + tradeOrder.deliveryName + '</span><span class="_fm-right">' + tradeOrder.deliveryPhone + '</span></p><div class="address _fm-overhide">' + tradeOrder.deliveryProvince + '&nbsp;' + tradeOrder.deliveryCity + '&nbsp;' + tradeOrder.deliveryCounty + '&nbsp;' + tradeOrder.deliveryAddress + '</div></div>';
			$('.order-detail .page .order-address').empty().append(dataBox);

			var dataBox = "";
			dataBox = '<span class="_fm-left">' + merchant.name + '</span>';
			$('.order-detail .page .title').empty().append(dataBox);

			var dataBox1 = "";
			$.each(goodsList, function(i) {
				var imageUrl;
				if (goodsList[i].previewImageList.length > 0) {
					imageUrl = goodsList[i].previewImageList[0].imageUrl;
				} else {
					imageUrl = ''
				}
				var price = toDecimal2(goodsList[i].price);
				dataBox1 += ' <section class="goods-detail" data-id="' + goodsList[i].id + '" data-tradeOrderId="' + goodsList[i].tradeOrderId + '"><div class="goods-content _fm-clearfix"><div class="_fm-img _fm-rel _fm-left"><div class="img-inner"><img class="lazy-loaded" data-src="' + imageUrl + '" alt="" src="' + imageUrl + '"></div></div><div class="goods-msg _fm-rel"><h2 class="_fm-f-14 _fm-ellipsis">' + goodsList[i].name + '</h2><div class="price-count _fm-abs _fm-bz _fm-lz"><span class="count-num _fm-left _js-formatGoodsPrice haveDone" data-size="16px">￥<span style="font-size: 16px">' + price + '</span></span><div class="total-num _fm-right">x<span class="singNum">' + goodsList[i].num + '</span></div></div><p class="style _fm-overhide">' + goodsList[i].goodsStyleDesc + '</p></div></div></section>';
			})
			$('.order-detail .page .OrderGoodBox').empty().append(dataBox1);

			//优惠金额
			var exemptAmount = toDecimal2(data.data.exemptAmount);

			var tradeOrder = data.data.tradeOrder;

			//总金额
			var totalAmount = toDecimal2(tradeOrder.amount);

			//实际支付金额
			var payAmount = toDecimal2(tradeOrder.payAmount);

			//邮费
			var expressFee = toDecimal2(tradeOrder.expressFee);

			//支付方式
			var payChannel = tradeOrder.payChannel;

			//总金额
			var dataBox = "";
			dataBox = ' <span class="_fm-left">商品总价：</span><span class="_fm-right _js-formatGoodsPrice haveDone" data-size="14px">￥' + totalAmount + '</span>';
			$('.order-detail .page .amount').empty().append(dataBox);

			//邮费
			var dataBox = "";
			dataBox = ' <span class="_fm-left">运费：</span><span class="_fm-right _js-formatGoodsPrice haveDone" data-size="14px">+￥' + expressFee + '</span>';
			$('.order-detail .page .expressFee').empty().append(dataBox);

			//立减优惠
			var dataBox = "";
			dataBox = ' <span class="_fm-left">立减优惠：</span><span class="_fm-right _js-formatGoodsPrice haveDone" data-size="14px">-￥' + exemptAmount + '</span>';
			$('.order-detail .page .disCount').empty().append(dataBox);

			//实付款
			var dataBox = "";
			dataBox = '<p class="_fm-f-14 _fm-right">实付款：<span class=" _js-formatGoodsPrice haveDone" data-size="16px" data-num="' + tradeOrder.num + '">￥<i>' + payAmount + '</i></span></p>'
			$('.order-detail .page .payAmount').empty().append(dataBox);

			//订单号
			var tradeOrderNo = tradeOrder.tradeOrderNo;
			var dataBox = '';
			var dataBox = '<span class="_fm-left">订单号：</span><span class="_fm-right">' + tradeOrderNo + '</span>'
			$('.order-detail .page .tradeOrderNo').empty().append(dataBox);

			//备注
			var dataBox = '';
			if (tradeOrder.message) {
				dataBox = '<span class="_fm-left">备注：</span><span class="_fm-right">' + (tradeOrder.message || "") + '</span>';
				$('.order-detail .page .order-message').empty().append(dataBox);
			} else {
				$('.order-detail .page .order-message').hide()
			}

			//支付方式
			var dataBox = '';
			if (payChannel) {
				$('.order-detail .page .payType').show();
				if (payChannel == 'alipay_wap') {
					dataBox = '<span class="_fm-left">支付方式：</span><span class="_fm-right">支付宝</span>';
				} else if (payChannel == 'wx_wap' || payChannel == 'wx_pub') {
					dataBox = '<span class="_fm-left">支付方式：</span><span class="_fm-right">微信</span>';
				} else if (payChannel == 'upacp_wap') {
					dataBox = '<span class="_fm-left">支付方式：</span><span class="_fm-right">银联</span>';
				}
				$('.order-detail .page .payType').empty().append(dataBox);
			} else {
				$('.order-detail .page .payType').hide();
			}
			$('.dom-noLoad').hide();
		} else {
			window.location.href = "index.html?channel=" + channel + '&source=' + localStorage.getItem('source');
		}
	}
	uploadData(url, true, data, successFun);

}

//订单详情页面逻辑开始
//再次加入购物车
$('.order-detail').on('click', '.addShoppingCar', function() {
	var that = $(this);

	var tradeOrderId = $(this).parents('.toolbar').siblings('.pages').find('.goods-detail').attr('data-tradeOrderId');
	var data = {
		'tradeOrderId': tradeOrderId,
		'token': token
	};
	$.ajax({
		url: apiDomain + '/diyapi/trade/order/reorder',
		type: 'POST',
		timeout: 0,
		async: true,
		data: data,
		dataType: 'json',
		beforeSend: function() {},
		success: function(data) {
			layer.open({
				content: '已加入购物车',
				skin: 'msg',
				time: 1 //2秒后自动关闭
			});

			//统计加入购物车数据
			//统计数据
			var length = that.parents('.toolbar').siblings('.pages').find('.OrderGoodBox').find('.goods-detail').length;
			var arr = [];
			for (var i = 0; i < length; i++) {
				var ids = that.parents('.toolbar').siblings('.pages').find('.OrderGoodBox').find('.goods-detail').eq(i).attr('data-id');
				var name = that.parents('.toolbar').siblings('.pages').find('.OrderGoodBox').find('.goods-detail').eq(i).find('.goods-msg').find('h2').text();
				var price = Number(that.parents('.toolbar').siblings('.pages').find('.OrderGoodBox').find('.goods-detail').eq(i).find('.goods-msg').find('.count-num').find('span').text()) * 100;
				var ADDItem = {
					"goodsId": ids,
					"name": name,
					"unitPrice": price,
					"count": 1
				};
				//						TDH5SDK.iap.addItem(ADDItem);
			}

			loadPage();
		},
		error: function(data) {
			console.log("加入购物车失败")
		}
	})

})

//取消订单
$('.order-detail').on('click', '.cancelOrder', function() {
	var tradeOrderId = $(this).parents('.toolbar').siblings('.pages').find('.goods-detail').attr('data-tradeOrderId');
	var data1 = {
		'tradeOrderId': tradeOrderId,
		'token': token
	};
	$.ajax({
		url: apiDomain + '/diyapi/trade/order/cancel',
		type: 'POST',
		timeout: 0,
		async: true,
		data: data1,
		dataType: 'json',
		beforeSend: function() {},
		success: function(data) {
			var token = getCookie('token');
			loadOrderDetail(data1);
			loadMyOrder(data1);
			layer.open({
				content: '订单已取消',
				skin: 'msg',
				time: 1 //2秒后自动关闭
			});
		},
		error: function(data) {
			console.log("取消订单失败")
		}
	})
})

//立即付款
$('.order-detail').on('click', '.payfor', function() {
	//统计数据
	var payAmount = Number($(this).parents('.toolbar').siblings('.pages').find('.payAmount').find('._js-formatGoodsPrice').find('i').text()) * 100;
	var Totalnum = $(this).parents('.toolbar').siblings('.pages').find('.payAmount').find('._js-formatGoodsPrice').attr('data-num');
	var tradeOrderId = $(this).parents('.toolbar').siblings('.pages').find('.goods-detail').attr('data-tradeOrderId');
	var length = $(this).parents('.toolbar').siblings('.pages').find('.OrderGoodBox').find('.goods-detail').length;
	var arr = [];
	for (var i = 0; i < length; i++) {
		var ids = $(this).parents('.toolbar').siblings('.pages').find('.OrderGoodBox').find('.goods-detail').eq(i).attr('data-id');
		var name = $(this).parents('.toolbar').siblings('.pages').find('.OrderGoodBox').find('.goods-detail').eq(i).find('.goods-msg').find('h2').text();
		var price = Number($(this).parents('.toolbar').siblings('.pages').find('.OrderGoodBox').find('.goods-detail').eq(i).find('.goods-msg').find('.count-num').find('span').text()) * 100;
		var num = $(this).parents('.toolbar').siblings('.pages').find('.OrderGoodBox').find('.goods-detail').eq(i).find('.goods-msg').find('.price-count').find('.singNum').text();
		var strData = {
			"id": ids,
			"name": name,
			"category": name,
			"unitPrice": price,
			"count": num
		}
		arr.push(strData)
	}

	var payChannel = window.localStorage.getItem('payChannel');
	var token = getCookie('token');
	var TradeOrderId = $(this).parents('.toolbar').siblings('.pages').find('.goods-detail').attr('data-tradeOrderId');
	cashier('body', TradeOrderId);
})

//提醒发货
$('.order-detail').on('click', '.remindShip', function() {
	var tradeOrderId = $(this).parents('.toolbar').siblings('.pages').find('.goods-detail').attr('data-tradeOrderId');
	var data = {
		'tradeOrderId': tradeOrderId,
		'token': token
	};
	$.ajax({
		url: apiDomain + '/diyapi/trade/order/remind',
		type: 'POST',
		timeout: 0,
		async: true,
		data: data,
		dataType: 'json',
		beforeSend: function() {},
		success: function(data) {
			if (data.code == 200) {
				layer.open({
					content: '已提醒小优尽快发货，请耐心等待',
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
			} else if (data.code == -1) {
				layer.open({
					content: '操作失败，请重试',
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
			} else {
				layer.open({
					content: '今天已提醒过了，小优已经在加班加点准备您的宝贝了哦',
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
			}
		},
		error: function(data) {
			console.log("提醒发货失败")
		}
	})
})

//查看物流
$('.order-detail').on('click', '.viewLogistics', function() { //查看物流
	var nowUrl = window.location.href;
	var expressNo = $(this).attr('data-expressNo');
	window.location.href = 'https://m.kuaidi100.com/index_all.html?type=shentong&postid=' + expressNo + '&callbackurl=' + nowUrl;
})

$('body').on('click', '.OrderToRecive', function() { //查看物流
		var nowUrl = window.location.href;
		var expressNo = $(this).find('.orderToRecive').attr('data-expressNo');
		window.location.href = 'https://m.kuaidi100.com/index_all.html?type=shentong&postid=' + expressNo + '&callbackurl=' + nowUrl;
	})
	//确认收货
$('.order-detail').on('click', '.confirmReceipt', function() {
	var tradeOrderId = $(this).parents('.toolbar').siblings('.pages').find('.goods-detail').attr('data-tradeOrderId');
	var data = {
		'tradeOrderId': tradeOrderId,
		'token': token
	};
	myApp.confirm('您确定已经收到货了吗?', '温馨提示',
		function() {
			$.ajax({
				url: apiDomain + '/diyapi/trade/order/receive',
				type: 'POST',
				timeout: 0,
				async: true,
				data: data,
				dataType: 'json',
				beforeSend: function() {},
				success: function(data) {
					var length = $('body .goods-content').length;
					for (var i = 0; i < length; i++) {
						var tradeOrderId = $('body .goods-content').eq(i).attr('data-tradeOrderId');
						if (tradeOrderId == data.data) {
							$('body .goods-content').eq(i).parents('.goods-detail').siblings('.elem-footer').html('<span class="do addShoppingCar">加入购物车</span><span class="do deleteOrder">删除订单</span>')
							$('body .goods-content').eq(i).parents('.goods-detail').siblings('.title').find('.order-status').text('订单已完成');
						}
					}
					layer.open({
						content: '您已确认收货',
						skin: 'msg',
						time: 1 //1秒后自动关闭
					});
					loadOrderDetail();
				},
				error: function(data) {
					console.log("确认收货失败")
				}
			})
		},
		function() {
			return;
		}
	);
})

//删除订单
$('.order-detail').on('click', '.deleteOrder', function() {
	var tradeOrderId = $(this).parents('.toolbar').siblings('.pages').find('.goods-detail').attr('data-tradeOrderId');
	var data1 = {
		'tradeOrderId': tradeOrderId,
		'token': token
	};
	$.ajax({
		url: apiDomain + '/diyapi/trade/order/delete',
		type: 'POST',
		timeout: 0,
		async: true,
		data: data1,
		dataType: 'json',
		beforeSend: function() {},
		success: function(data) {
			$(this).addClass('deleteClick')
			layer.open({
				content: '订单已删除',
				skin: 'msg',
				time: 1 //2秒后自动关闭
			});
			var token = getCookie('token');
			loadMyOrder(data1);
			window.location.href = "myOrder.html?channel=" + channel;
		},
		error: function(data) {
			console.log("删除订单失败")
		}
	})
})

//联系客服
$('.order-detail').on('click', '.srevice', function() {
	mainView.router.loadPage('../other/cusService.html');
})

//控制返回首页
$('.order-detail').on('click', '.backToIndex .historyback', function() {
	window.location.href = "index.html"
})
//订单详情页面逻辑结束

//支付成功页面
var paying = function(data) {
	$('.dom-noLoad').show();
	var url, successFun, dataBox;
	url = apiDomain + '/diyapi/trade/order/pay/detail';
	successFun = function(data) {
		var dataBox = '';
		dataBox = '<span><img src="../../img/paying.png"/>支付中</span>';
		$('.pay .paySucced .payTop').empty().append(dataBox);

		var dataBox = '';
		dataBox = '<p>支付操作确认中...</p>';
		$('.pay .paySucced .payMuch').empty().append(dataBox);

		var dataBox = '';
		dataBox = '<img class="paySuccImg" src="../../img/fullShopCar.png" alt="支付成功购物车图片"/>';
		$('.pay .paySucced .fullShopCar').empty().append(dataBox);

		var dataBox = '';
		dataBox = '<p>货物寄送至：' + data.data.deliveryAddress.provinceName + '&nbsp;' + data.data.deliveryAddress.cityName + '&nbsp;' + data.data.deliveryAddress.countyName + '&nbsp;' + data.data.deliveryAddress.address + '</p>'
		$('.pay .paySucced .postAdd').empty().append(dataBox);

		var dataBox = '';
		dataBox = '<i class="toOrder">查看订单</i><i class="toHome">返回首页</i>';
		$('.pay .paySucced .paylink').empty().append(dataBox);

		var dataBox = '';
		dataBox = '<p>请确认支付是否完成</p><p class="payOk">已完成支付</p><p class="payFail">支付遇到问题，重新支付</p>'
		$('.pay .paying').empty().append(dataBox);

		$('.dom-noLoad').hide();
	}

	uploadData(url, true, data, successFun);
}

var paySucc = function(data) {
	$('.pay .paying').hide();
	$('.pay .payMasking').hide();
	$('.dom-noLoad').show();
	var url, successFun, dataBox;
	url = apiDomain + '/diyapi/trade/order/pay/detail';
	successFun = function(data) {
		var token = data.data.token;
		//获取当前时间 
		var date = new Date();
		var expiresDays = 10;
		//将date设置为10天以后的时间 
		date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000);
		//将token设置为10天后过期 
		document.cookie = 'token=' + token + ';expires=' + date.toGMTString();
		var tradeOrder = data.data.trade;
		var payAmount = toDecimal2(tradeOrder.amount);
		if (tradeOrder.status == 0 || tradeOrder.status == -3) {

			var dataBox = '';
			dataBox = '<span><img src="../../img/payFail.png"/>购买失败</span>';
			$('.pay .paySucced .payTop').empty().append(dataBox);

			var dataBox = '';
			dataBox = '<p>支付遇到问题，请尝试重新支付</p>';
			$('.pay .paySucced .payMuch').empty().append(dataBox);

			var dataBox = '';
			dataBox = '<img class="payFailImg" src="../../img/payFailImg.png" alt="支付失败购物车图片"/>';
			$('.pay .paySucced .fullShopCar').empty().append(dataBox);

			var dataBox = '';
			dataBox = '<i class="keepPay">重新支付</i><i class="toOrder">查看订单</i>';
			$('.pay .paySucced .paylink').empty().append(dataBox);

			$('.pay .paySucced .postAdd').hide();
			$('.dom-noLoad').hide();

		} else {
			var orderId = tradeOrderId;
			var amount = payAmount * 100;
			var itemId = '订单详情';
			TDH5SDK.iap.currencyPurchase(orderId, amount, 'CNY', 'paypal', itemId, 1); //talkingData统计付款成功数据

			var dataBox = '';
			dataBox = '<span><img src="../../img/paySucc.png"/>购买成功</span>';
			$('.pay .paySucced .payTop').empty().append(dataBox);

			var dataBox = '';
			dataBox = '<p>您已成功支付<b>' + payAmount + '</b>元</p>';
			$('.pay .paySucced .payMuch').empty().append(dataBox);

			var dataBox = '';
			dataBox = '<img class="paySuccImg" src="../../img/fullShopCar.png" alt="支付成功购物车图片"/>';
			$('.pay .paySucced .fullShopCar').empty().append(dataBox);

			var dataBox = '';
			dataBox = '<p>货物寄送至：' + data.data.deliveryAddress.provinceName + '&nbsp;' + data.data.deliveryAddress.cityName + '&nbsp;' + data.data.deliveryAddress.countyName + '&nbsp;' + data.data.deliveryAddress.address + '</p>'
			$('.pay .paySucced .postAdd').empty().append(dataBox);

			var dataBox = '';
			dataBox = '<i class="toOrder">查看订单</i><i class="toHome">返回首页</i>';
			$('.pay .paySucced .paylink').empty().append(dataBox);

			$('.dom-noLoad').hide();
		}
	}

	uploadData(url, true, data, successFun);

}

var payMaterial = function(data) {
	$('.pay .paying').hide();
	$('.pay .payMasking').hide();
	$('.dom-noLoad').show();
	var url, successFun, dataBox;
	url = apiDomain + '/diyapi/trade/order/pay/detail';
	successFun = function(data) {
		var token = data.data.token;
		//获取当前时间 
		var date = new Date();
		var expiresDays = 10;
		//将date设置为10天以后的时间 
		date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000);
		//将token设置为10天后过期 
		document.cookie = 'token=' + token + ';expires=' + date.toGMTString();
		var tradeOrder = data.data.trade;
		var payAmount = toDecimal2(tradeOrder.amount);
		if (tradeOrder.status == 0 || tradeOrder.status == -3) {

			cashier('body');
			$('.cashierClose').hide();

			$('.dom-noLoad').hide();

		} else {
			var orderId = tradeOrderId;
			var amount = payAmount * 100;
			var itemId = '订单详情';
			TDH5SDK.iap.currencyPurchase(orderId, amount, 'CNY', 'paypal', itemId, 1); //talkingData统计付款成功数据

			var dataBox = '';
			dataBox = '订单号：<span>' + data.data.tradeOrderNo + '</span>';
			$('.pay .pay-materialTradeNum').empty().append(dataBox);
			$('.pay .pay-materialBg .shareButton').show();
			$('.pay .pay-materialBg .Qr').show();
			$('.pay .page-content').css('background', 'url(../../img/paySuccedBg4.png) no-repeat');
			$('.pay .page-content').css('background-size', '7.5rem');

			$('.dom-noLoad').hide();
		}
	}

	uploadData(url, true, data, successFun);
}

//下载APP
$('body').on('click', '.paySuccDown', function() {
	window.location.href = "https://api.51app.cn/diyapi/channel/todownload?channel=" + channel + '&token=' + token;
})

//去订单
$('body').on('click', '.toOrder', function() {
	window.location.href = "orderDetail.html?channel=" + channel + '&from=cashier&tradeOrderId=' + tradeOrderId;
})

//去首页
$('body').on('click', '.toHome', function() {
		window.location.href = "index.html?channel=" + channel ;
	})
	//支付失败 继续支付
$('body').on('click', '.keepPay', function() {
	cashier('body');
})

$('body').on('click', '.payFail', function() {
	var data = {
		'token': token,
		'tradeOrderId': tradeOrderId,
		'queryPayStatus': true
	}
	if (GetQueryString('tradeOrderId').split('_')[1]) {
		if (GetQueryString('tradeOrderId').split('_')[1] == 'tq') {
			payMaterial(data);
		}
	} else {
		paySucc(data);
	}
})

//支付完成
$('body').on('click', '.payOk', function() {
	var data = {
		'token': token,
		'tradeOrderId': tradeOrderId,
		'queryPayStatus': true
	}
	if (GetQueryString('tradeOrderId').split('_')[1]) {
		if (GetQueryString('tradeOrderId').split('_')[1] == 'tq') {
			payMaterial(data);
		}
	} else {
		paySucc(data);
	}
})

//分享到朋友圈 先跳转到首页
$('body').on('click', '.shareButton img', function() {
	localStorage.setItem('share', '1');
	window.location.href = 'materialIndex.html?channel=' + channel;
})

//支付成功页面结束