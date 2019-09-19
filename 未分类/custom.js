/* base on Framework7 1.4.2
============================================================*/


var CustomMall = function() {
	var $$ = Framework7.$
	  , fn = {}
	  , areaEmpty = '<div class="nothing _fm-img _fm-link-1">' +
			'<div class="img-inner">' +
				'<img>' +
				'<p class="_fm-f-14"></p>' +
				'<a class="external _fm-txtcenter _fm-inline" href="#"></a>' +
			'</div>' +
		'</div>',

	/* 返回最近查找对象 */
	closest = function(obj, str) {
		var parent = obj.parents(str);
		if (obj.is(str)) {
			return obj;
		}
		if (parent.length > 0) {
			return parent.eq(0);
		}
		return !!0;
	},
	/* zoom弹窗提示 */
	warning = function() {
		var fn = {}, body = $$('body'), handle
		  , bubble = $$('<div class="warn-bubble _fm-fix _fm-txtcenter _fm-lz">' +
					    	'<span class="_fm-inline">您什么都没有选中哦</span>' +
						'</div>');

		fn.say = function(str) {
			bubble.detach().find('span').text(str).parent().appendTo(body);

			clearTimeout(handle);
			handle = setTimeout(function() {
				bubble.detach();
			}, 1700);
		};
		return fn;
	}(),
	/* 序列化表单元素 */
	serialize = function(form) {
		var array = [];
		form.each(function (i, d) {
			var obj = {}, self = $$(d);
			self.find('[name]').filter(function() {
				if ($$(this).attr('type') == 'checkbox') {
					return $$(this).is(':checked')
				} else {
					return true;
				}
			}).each(function (i, d) {
				var self = $$(d);
				obj[self.attr('name')] = self.val();
			});
			array.push(obj);
		});
		return array;
	},
	fix = function(array) {
  		if (array.length == 1) {
  			return $$.serializeObject(array[0]);
  		}
  		var str = '';
  		$$.each(array, function (i, d) {
  			str += $$.serializeObject(d) + '&';
  		});
  		return str.replace(/\&$/, '');
	},
	/*订单界面跳转*/
	orderLink = function() {
		window.location = this.attr('data-addr') + '?orderNo=' + (this.closest('.order-elem').attr('data-id') || $$('.order-num .num').text())
	};

	/* 获取页面ID */
	fn.pageID = ($$('body').attr('class').match(/^[^\ ]+/) || [])[0];

/* 处理页面脚本元素
==================================================*/
	fn.execute = function(i, d) {
		$$.each(d.className.match(/\_js\-[a-zA-Z]+/gi), function (k, v) {
			(fn[v.slice(4)] || function() {
				console.log('未找到对应'+ v +'事件，请检查"_js-"处的命名是否正确');
			}).call($$(d));
			// console.log(v.slice(4));
		});
	};

	/* 下拉刷新事件 */
	fn.dropdownRefresh = function() {
		var handle;
		this.on('refresh', function() {
			clearTimeout(handle);
			handle = setTimeout(function() {
				mainView.router.refreshPage()
			}, 500);
		});
	};

	/* 禁用ios拖拽回弹 */
	fn.limitdrag = function() {
		var point = {
			touchstart: [0, 0],
			touchmove: [0, 0]
		}, that = this,

		eventTouch = function(e) {
			var data = e.changedTouches[0];
			point[e.type] = [data.clientX, data.clientY];
			e.type === 'touchmove' && touchMove(e);
		},
		touchMove = function(e) {
			var a = point.touchmove[1] - point.touchstart[1]
			  , b = that.scrollTop()
			  , c = b >= that[0].scrollHeight - that[0].clientHeight;
			if (a > 0 && b === 0 || a < 0 && c) { 
				e.preventDefault();
			}
		};
		this.on('touchstart touchmove', eventTouch);
	};

	/* 格式化减号 */
	fn.formatminus = function() {
		var obj = this.find('.op-l');
		this.find('.num').text() == '1' ? obj.addClass('min') : obj.removeClass('min');
	};

	/* 浏览器返回 */
	fn.historyback = function() {
		this.click(function() {
			history.go(-1);
		});
	};

	/* 地址选择插件 */
	fn.provincePicker = function() {
		var that = this
		  , toolbar = '<div class="picker-toolbar _fm-overhide _fm-f-18">' +
	            '<a class="_fm-right close-picker" href="#">完成</a>' +
	        '</div>',

        /* 数据转换 */
		changeData = function(data) {
			var back = { province: [], city: {}, area: {} };
			$$.each(data, function (k, v) {
				var now = k; back.city[now] = [];
				back.province.push(k);
				$$.each(v, function (k, v) {
					back.city[now].push(k);
					back.area[k] = v;
				});
			});
			return back
		},

		/* f7插件初始化 */
		init = function(data) {
			data = changeData(data);

			var initData = [
				{
					values: data.province,
					textAlign: 'center',
					width: 94,
					onChange: function(picker, province) {
						(picker.cols[1].replaceValues || noop) (data.city[province]);
						(picker.cols[2].replaceValues || noop) (data.area[data.city[province][0]]);
					}
				},
				{
					values: data.city[data.province[0]],
					textAlign: 'center',
					width: 122,
					onChange: function(picker, city) {
						(picker.cols[2].replaceValues || noop) (data.area[city]);
					}
				},
				{
					values: data.area[data.city[data.province[0]][0]],
					textAlign: 'center',
					width: 142
				}
			], noop = function() {};

			CustomMallAPI.myPicker = myApp.picker({
				input: that[0],
				rotateEffect: true,
				toolbarTemplate: toolbar,
				cols: initData
			});
			$$('.picker-modal').on('touchmove', function(e) { e.preventDefault() });
		};

		$$.getJSON(that.attr('data-addr'), init);
	};

	/* 格式化商品价钱 */
	fn.formatGoodsPrice = function() {
		var obj = this, num = parseFloat(obj.text().match(/[0-9]+\..*/)[0]).toFixed(2);
		// console.log(obj.text().match(/[0-9]+\..*/)[0],"num:",num)
		obj.html('￥<span style="font-size: '+ obj.attr("data-size") +'">'+ num.match(/^.*\./)[0] +'</span>' + num.match(/\..*$/)[0].slice(1));
	};

	/* 微信支付适配 */
	fn.wechatFit = function() {
		// /micromessenger/.test(window.navigator.userAgent.toLowerCase()) && this.find('.method-elem').eq(1).hide();
		if ( /micromessenger/.test(window.navigator.userAgent.toLowerCase()) ) {
			this.find('.method-elem').eq(1).hide();
		} else {
			this.find('.method-elem').eq(0).hide()
				.find('.right-ico').removeClass('active')
				.parent().next().find('.right-ico').addClass('active');
		}
	};

	/* 购物车首页点击事件 */
	fn.shoppingCarList = function() {
		var that = this
		  , url = that.attr('data-addr')
		  , selectAll = that.find('.toolbar-inner .check-box')
		  , totalCount = that.find('.toolbar-inner .count-num')
		  , buy = that.find('.toolbar-inner .count-all')
		  , editAll = that.find('.navbar-inner .right-txt')
		  , emptyCar = $$(areaEmpty).find('img').attr('src', '../images/empty_spCar.png')
		  			  .parents('.nothing').find('p').text('购物车空空如也')
		  			  .parents('.nothing').find('a').text('去逛逛').attr('href', that.find('.car-list').attr('data-addr'))
		  			  .parents('.nothing'),

		/* 购物车 计算总额 */
		countAll = function() {
			var countElem = that.find('.car-list > .list-elem').filter(function() {
				return $$(this).find('.check-box.active').length > 0;
			}), num = 0, size = totalCount.attr('data-size');
			countElem.each(function() {
				var that = $$(this);
				var secondHalfPrice = that.attr('data-secondHalfPrice');
				var goodsNum = parseInt(that.find('.total-num .num').text());
				// if(secondHalfPrice=='2'){goodsNum = 1.5*Math.floor(goodsNum/2) + (goodsNum%2);}
				num += parseFloat(that.find('.count-num').text().slice(1)) * goodsNum;
			});
			num = parseFloat(num).toFixed(2);
			totalCount.html(formatnum(num, size));
		},
		formatnum = function(floNu, size) {
			floNu = floNu + '';
			return '￥<span style="font-size: '+ size +'">'+ floNu.match(/^.*\./)[0] +'</span>' + floNu.match(/\..*$/)[0].slice(1);
		},
		/* 格式化价钱数字 */
		formatSingle = function() {
			that.find('.car-list > .list-elem').each(function() {
				var obj = $$(this).find('.count-num');
				obj.find('*').length == 0 && obj.html(formatnum(parseFloat(obj.text().slice(1)).toFixed(2), obj.attr('data-size')));
			});
		},
		/* 全选标示 */
		isSelectAll = function() {
			var obj = that.find('.car-list .check-box');
			(obj.length == obj.filter(function() {
				return $$(this).is('.active') 
			}).length && obj.length != 0) ? selectAll.addClass('active') : selectAll.removeClass('active');
		},
		/* 界面重置 */
		reset = function () {
			editAll.text('编辑');
			totalCount.parent().show();
			buy.text('结算');
		},
		/* 判断购物车是否为空 */
		isCarEmpty = function() {
			if (that.find('.car-list > .list-elem').length > 0) {
				emptyCar.detach();
				that.find('.car-list').show();
				that.find('.toolbar').show();
				$$('.right-txt').show()
			} else {
				emptyCar.appendTo($$('.cus-page-inner'));
				that.find('.car-list').hide();
				that.find('.toolbar').hide();
				$$('.right-txt').hide();
			}
		},


		/* 页面点击事件 */
		clickEvent = function(e) {
			var target = $$(e.target);
			if (target = closest(target, '.do')) {
				operation[target.attr('data-op')].call(target);
			}
		},
		/* 服务器数据更新 */
		ajaxData = function(operation, num, suburl) {
			var isDone = !!0, area = this
			  , form = area.find('form');

			form.find('[name="operation"]').val(operation);
			num && form.find('[name="total_number"]').val(num);

			$$.ajax({
				url : (suburl || url),
				async: false,
				method : "POST",
				cache : false,
				data : fix(serialize(form)),
				dataType : "json",
				beforeSend: function() {
					myApp.showIndicator();
				},
				success: function() {
					isDone = !0;
				},
				error: function(xhr, msg) {
					warning.say('网络错误: ' + msg);
				},
				complete: function() {
					myApp.hideIndicator();
				}
			});
			return isDone;
		},
		operation = {
			selectOne: function() {
				this.toggleClass('active');
				countAll(); isSelectAll();
				// that.trigger('countAll').trigger('isSelectAll');
			},
			selectAll: function() {
				var elem = that.find('.car-list .check-box');
				this.is('.active') ? elem.removeClass('active') : elem.addClass('active');
				countAll(); isSelectAll();
				// that.trigger('countAll').trigger('isSelectAll');
			},
			editOne: function() {
				this.closest('.list-elem').find('.goods-msg').toggleClass('active').is('.active') ? this.text('完成') : this.text('编辑');
			},
			editAll: function() {
				var msg = that.find('.car-list .goods-msg')
				  , btn = that.find('.car-list .edit')
				  , total = totalCount.parent();

				if (this.text() == '编辑') {
					this.text('完成');
					msg.addClass('active');
					btn.hide();
					total.hide();
					buy.text('删除');
				} else {
					msg.removeClass('active');
					btn.show().text('编辑');
					reset();
					// that.trigger('surfaceReset');
				}
			},
			deleteOne: function() { //ajax
				if (ajaxData.call(this.closest('.list-elem'), 'delete')) {
					this.closest('.list-elem').remove();
					countAll(); isSelectAll(); isCarEmpty();
					// that.trigger('countAll').trigger('isSelectAll').trigger('isCarEmpty');
					$$('img.lazy').trigger('lazy');
				}
			},
			deleteMulti: function() { //ajax
				var elem = that.find('.car-list > .list-elem').filter(function() {
					return $$(this).find('.check-box.active').length > 0;
				});
				if (elem.length == 0 ) {
					warning.say('您什么都没有选中哦')
				} else {
					if (this.text() == '删除') {
						myApp.confirm('确认将这'+ elem.length +'个商品删除？', function() {
							if (ajaxData.call(elem, 'delete')) {
				  				elem.remove();
				  				countAll(); isSelectAll(); isCarEmpty();
				  				// that.trigger('countAll').trigger('isSelectAll').trigger('isCarEmpty');
				  				$$('img.lazy').trigger('lazy');
			  				}
			  			})
					} else {
						// if ( config = ajaxData.call(elem, 'select', 0, this.attr('data-addr'))) {
							window.location = this.attr('data-next') + '?' + fix(serialize(elem.find('form')));
						// }
					}
				}
			},
			editNum: function() { //ajax
				var obj = this.parent().find('.num')
				  , minu = this.parent().find('.op-l')
				  , oldNum = parseInt(obj.text())
				  , num = (oldNum + parseInt(this.text() + 1) || 1);

				if (oldNum != num && ajaxData.call(this.closest('.list-elem'), 'edit', num)) {
					num == 1 ? minu.addClass('min') : minu.removeClass('min');
					obj.text(num);
					countAll();
					// that.trigger('countAll');
				}
			},
		};

		that.click(clickEvent)
			.on('format', formatSingle).on('countAll', countAll).on('isSelectAll', isSelectAll)
			.on('isCarEmpty', isCarEmpty).on('surfaceReset', reset)
			.on('callbackNext', function(a) {
				formatSingle(); countAll(); isSelectAll(); reset(); isCarEmpty();
				// that.trigger('format').trigger('countAll').trigger('isSelectAll')
				// 	.trigger('surfaceReset').trigger('isCarEmpty');
			});
	};

	/* 订单确认页面点击事件 */
	fn.orderConfirm = function() {
		var that = this
		  , goodsCon = that.find('.goods-content')
		  , goodsMsg = that.find('.order-msg')
		  , couponCon = that.find('.coupon-list')
		  , addrCon = $$('.page[data-page="address"] .address-list')
		  , price = that.find('.toolbar-inner p > span')
		  , priviMsg = that.find('._fm-right.yellow')
		  , couponMsg = that.find('.coupon .msg span')
		  , addrArea = that.find('.page[data-page="index"] .order-address')
		  , editPanel = that.find('.edit-address')
		  , noAddressL = $$('<a class="no-address do _fm-block _fm-txtcenter" href="#" data-op="addAddr">您还没有添加任何地址，点击立即添加</a>')
		  , emptyCoupon = $$(areaEmpty).find('img').attr('src', '../images/empty_coupon.png')
	  					  .parents('.nothing').find('p').text('您还没有礼品券').next().hide()
	  					  .parents('.nothing')

		 ,
		/* 计算支付数值 */
		countPayNum = function() {
			var oldNum = 0, newNum = 0
			  , msg = ['立减￥10.00', '尊享个性定制，全场满200减30', '尊享个性定制，全场满300减50']
			  , str = msg[0], active = couponCon.find('.coupon-elem.active'),

			privi = function(num) {
				var temp = num;
				// num >= 300 && (temp -= 50, str = msg[2]);
				// num < 300 && num >=200 && (temp -= 30, str = msg[1]);
				// num < 200 && num >=100 && (temp -= 10);
				// var arr = (active.attr('data-num') || '0-0').split('-');
				// if (temp >= parseInt(arr[0])) {
				// 	return (temp - parseInt(arr[1])).toFixed(2);
				// } else {
				// 	active.removeClass('active');
				// 	return parseFloat(temp).toFixed(2);
				return (temp-10).toFixed(2);
				
			};

			goodsCon.each(function() {
				var self = $$(this);
				var secondHalfPrice = self.find('.isBoutique').val();
				var goodsNum = parseInt(self.find('.total-num .num').text());
				// if(secondHalfPrice=='2'){goodsNum = 1.5*Math.floor(goodsNum/2) + (goodsNum%2);}
				oldNum += parseFloat(self.find('.count-num').text().slice(1)) * goodsNum;
				
			});
			oldNum = parseFloat(oldNum).toFixed(2);
			newNum = privi(oldNum);

			priviMsg.html(str);
			active.is('.active') ? couponMsg.html('已使用' + active.find('.deno').text()) : couponMsg.html('未使用优惠券');

			price.eq(0).html('￥' + newNum);
			fn.formatGoodsPrice.call(price.eq(0));
			price.eq(1).html('￥' + oldNum);
			price.eq(2).html('￥' + ( oldNum - newNum ).toFixed(2));
		},

		/* 调整收货地址编辑界面 */
		adjustSurface = function(id) {
			var checkBox = editPanel.find('.check-box');
			if (id == 'new') {
				$$('.navbar-inner[data-page=editAddress] .right-txt').hide();
				$$('.save-use').addClass('disabled');
				addrCon.find('.order-address').length == 0 ? checkBox.hide() : checkBox.show();

			} else {
				$$('.navbar-inner[data-page=editAddress] .right-txt').show();
				$$('.save-use').removeClass('disabled');
				id == $$('.page[data-page="address"] .order-address').eq(0).attr('data-id') ? (
					checkBox.hide(),
					editPanel.find('[name]').eq(5).attr('checked', true),
					checkBox.find('._fm-right').addClass('active')
				) : checkBox.show();
			}
		},
		
		/* 调整当前地址 */
		adjustCurrentAddr = function() {
			if ((addrArea.attr('data-id') || '') == '' || (addrArea.attr('data-id') == 'undefined')) {
				goodsMsg.prepend(noAddressL);
				addrArea.hide();
			} else {
				noAddressL.detach();
				addrArea.show();
			}
		},

		/* 调整礼品券 */
		adjustCoupon = function() {
			// console.log('hh');
			if (couponCon.find('.coupon-elem').length > 0) {
				emptyCoupon.detach();
				couponCon.show();
			} else {
				emptyCoupon.appendTo($$('[data-page=coupon] .cus-page-inner'));
				couponCon.hide();
			}
		},

		/* 页面点击事件 */
		clickEvent = function(e) {
			var target = $$(e.target);
			if (target = closest(target, '.do')) {
				operation[target.attr('data-op')].call(target);
			}
		},

		/* 服务器数据更新 */
		ajaxData = function(url, form) {
			var isDone = !!0;
			$$.ajax({
				url : url,
				async: false,
				method : "POST",
				cache : false,
				data : serialize(form)[0],
				dataType : "json",
				beforeSend: function() {
					myApp.showIndicator();
				},
				success: function(data) {
					if (form.find('[name=addressId]').val() == 'new') {
						data.data.addressId ? form.find('[name=addressId]').val(data.data.addressId) : form.find('[name=addressId]').val((new Date).getTime());
					}

					// if (data.id) {
					// 	if( form.find('[name=addressId]').val() != 'new' ) {
					// 		delete data.id
					// 	} else {
					// 		data.id == "dfasdwfewfgewe" && (data.id = (new Date).getTime());
					// 	}
					// }
					// data.id && form.find('[name=addressId]').val(data.id);

					// data.id && (
					// 	((data.id == "dfasdwfewfgewe") && (form.find('[name=addressId]').val() == 'new')) ? form.find('[name=addressId]').val(new Date()) : form.find('[name=addressId]').val(data.id)
					// );
					isDone = !0;
				},
				error: function(xhr, msg) {
					warning.say('网络错误: ' + msg);
				},
				complete: function() {
					myApp.hideIndicator();
				}
			});

			return isDone;
		},

		operation = {
			/* 编辑数字 */
			editNum: function() {
				var obj = this.parent().find('.num')
				  , obj2 = goodsCon.find('.total-num .num')
				  , minu = this.parent().find('.op-l')
				  , oldNum = parseInt(obj.text())
				  , num = (oldNum + parseInt(this.text() + 1) || 1);

				num == 1 ? minu.addClass('min') : minu.removeClass('min');
				obj.text(num);
				obj2.text(num);
				countPayNum();
				// that.trigger('countPayNum');
			},
			/* 使用优惠券 */
			useCoupon: function() {
				var num = this.attr('data-num').split('-')
				  , flag = this.is('.active')
				  , active = couponCon.find('.coupon-elem.active');

				couponCon.children().removeClass('active');
				countPayNum();
				// that.trigger('countPayNum');

				if (parseInt(price.eq(0).text().slice(1)) >= parseInt(num[0])) {
					flag ? this.removeClass('active') : this.addClass('active');
					countPayNum();
					// that.trigger('countPayNum');
				} else {
					active.addClass('active');
					countPayNum();
					// that.trigger('countPayNum');
					warning.say('未达到使用该券的要求');
				}
			},
			/* 选择支付方式 */
			payMethod: function() {
				var that = this;
				that.closest('.pay-method').children().find('.right-ico').removeClass('active');
				that.addClass('active');
			},
			/* 选择地址 */
			useAddr: function() {
				addrArea.find('.name').html('收货人: ' + this.find('.name').text())
						.next().html(this.find('.name + span').text());
				addrArea.find('.address').html(this.find('.address').text());
				addrArea.attr('data-id', this.attr('data-id'));

				mainView.router.back({pageName: 'index'});
			},
			/* 编辑地址 */
			editAddr: function() {
				var input = editPanel.find('[name]')
				  , parent = this.closest('.order-address');
				// 赋值
				input.eq(0).val(parent.find('.name').text());
				input.eq(1).val(parent.find('.name + span').text());
				var addr = parent.find('.address').text().replace(/^收货地址.\ */, '')
				  , str = addr.split(' ');

				CustomMallAPI.myPicker.setValue(str.slice(0,3), 0);
				input.eq(3).val(addr.replace(/^[^\ ]+\ +[^\ ]+\ +[^\ ]+\ +/, ''));
				input.eq(4).val(parent.attr('data-id'));

				input.eq(5).removeAttr('checked');
				editPanel.find('._fm-check-3').parent().removeClass('active');

				adjustSurface(input.eq(4).val());
				$$('.navbar-inner[data-page=editAddress] .center').text('编辑收货地址')
				mainView.router.load({pageName: 'editAddress'});
			},
			/* 添加地址 */
			addAddr: function() {
				var input = editPanel.find('[name]');
				input.eq(0).val('');
				input.eq(1).val('');
				input.eq(2).val('');
				input.eq(3).val('');
				input.eq(4).val('new');
				this.is('.no-address') ? (
					input.eq(5).attr('checked', true),
					editPanel.find('._fm-check-3').parent().addClass('active')
				) : (
					input.eq(5).removeAttr('checked'),
					editPanel.find('._fm-check-3').parent().removeClass('active')
				);

				adjustSurface('new');
				$$('.navbar-inner[data-page=editAddress] .center').text('新增收货地址')
				mainView.router.load({pageName: 'editAddress'});
			},
			/* 设置默认 */
			isDefault: function() {
				if( this.is('.active') ) {
					this.removeClass('active');
					editPanel.find('[name]').eq(5).removeAttr('checked');
				} else {
					this.addClass('active');
					editPanel.find('[name]').eq(5).attr('checked', true);
				}
			},
			/* 保存并使用 */
			saveAndUse: function() {
				var input = editPanel.find('[name]');
				var isNew = (input.eq(4).val() == 'new');
				var issDefalut = editPanel.find('._fm-right.do').is('.active');
				var strstr;


				// ajax
				var platform = '<p class="division _fm-rel"></p>' +
				'<section class="order-address do _fm-block _fm-overhide" data-id="" data-op="useAddr">' + 
					'<div class="left-ico _fm-left">' + 
						'<span class="_fm-check-1">&nbsp;</span>' + 
					'</div>' + 
					'<div class="msg">' + 
						'<p class="_fm-overhide _fm-f-15">' + 
							'<span class="name _fm-left _fm-ellipsis"></span>' + 
							'<span class="_fm-right"></span>' + 
						'</p>' + 
						'<div class="right-ico _fm-right do" data-op="editAddr">' + 
							'<span class="_fm-inline _fm-rel _fm-txtcenter">&nbsp;</span>' + 
						'</div>' + 
						'<div class="address _fm-overhide"></div>' + 
					'</div>' + 
				'</section>';
				
				var phoneNum = input.eq(1).val();
				if ( !(/^1(3[0-9]|5[0-35-9]|8[025-9])\\d{8}$/.test(phoneNum)
					|| /^1(34[0-8]|(3[5-9]|5[017-9]|8[278])\\d)\\d{7}$/.test(phoneNum)
					|| /^1(3[0-2]|5[256]|8[56])\\d{8}$/.test(phoneNum)
					|| /^1((33|53|8[09])[0-9]|349)\\d{7}$/.test(phoneNum)
					|| /^1[3|4|5|7|8][0-9]{9}$/.test(phoneNum)) ) {
					myApp.modal({
						title: "提醒",
						text: "请确认手机号码填写是否正确",
						buttons: [{
							text: "知道了",
							onClick: function() {
								myApp.closeModal();
							}
						}]
					});
					return false;
				}
				
				isNew ? input.eq(6).val('add') : input.eq(6).val('edit');
				if (ajaxData(this.attr('data-addr'), editPanel)) {
					addrArea.find('.name').html('收货人: ' + input.eq(0).val())
							.next().html(input.eq(1).val());

					addrArea.find('.address').html('收货地址：' + input.eq(2).val() + ' ' + input.eq(3).val());
					addrArea.attr('data-id', input.eq(4).val());

					if (isNew) {
						var self = $$(platform).appendTo(addrCon);
						strstr = "添加成功"
					} else {
						var self = addrCon.find('[data-id="' + input.eq(4).val() + '"]');
						strstr = "修改成功"
					}
					self.find('.name').html(input.eq(0).val())
						.next().html(input.eq(1).val());

					self.find('.address').html('收货地址：' + input.eq(2).val() + ' ' + input.eq(3).val());
					self.attr('data-id', input.eq(4).val());

					issDefalut && (
						$$('.page[data-page="address"] .order-address').removeClass('active'),
						addrCon.find('[data-id="' + input.eq(4).val() + '"]').addClass('active').prependTo(addrCon)
					);

					mainView.router.back({
						pageName: 'index',
						force: true
					});
					adjustCurrentAddr();
					warning.say(strstr);
				}
			},
			/* 删除 */
			delete: function() {
				editPanel.find('[name]').eq(6).val('delete');
				if (ajaxData(this.attr('data-addr'), editPanel)) {
					var target = addrCon.find('[data-id="' + editPanel.find('[name=addressId]').val() + '"]');
					target.prev().remove();
					target.remove();
					addrCon.find('.active').length > 0 || addrCon.find('.order-address').eq(0).addClass('active');
					if (addrCon.find('[data-id="' + addrArea.attr('data-id') + '"]').length == 0) {
						var obj = addrCon.find('.active');
						addrArea.find('.name').html('收货人: ' + obj.find('.name').text())
								.next().html(obj.find('.name + span').text());
						addrArea.find('.address').html(obj.find('.address').text());
						addrArea.attr('data-id', obj.attr('data-id'));
					}
					mainView.router.back({
						pageName: 'index',
						force: true
					});
					adjustCurrentAddr();
					warning.say('删除成功');
				}
			},
			/* 提交 */
			submit: function() {
				if ((addrArea.attr('data-id') || '') == '' || (addrArea.attr('data-id') == 'undefined')) {
					myApp.modal({
						title: "提醒",
						text: "您还没有添加任何地址",
						buttons: [
							{
								text: "取消",
								onClick: function() {
									myApp.closeModal();
								}
							},
							{
								text: "立即添加",
								onClick: function() {
									myApp.closeModal();
									api.call($$('.no-address'));
								}
							},
						]
					});
					return false;
				}
				var form = $$('.main-form');
				var obj = form.find('[name]');
				obj.eq(0).val(addrArea.attr('data-id'));
				obj.eq(1).val($$('.method-elem .active').closest('.method-elem').attr('data-id'));
				obj.eq(2).val($$('.edit-num .num').text());
				obj.eq(3).val($$('.coupon-elem.active').attr('data-id'));
				obj.eq(4).val($$('.remarkTextarea').val());
				form.submit();
				console.log(obj.eq(4).val())
				// window.location = this.attr('data-addr') + '?' + fix(serialize(form))    //序列化表单
				//ajaxData(this.attr('data-addr'), form);
				
			},
		},
		api = operation.addAddr;

		that.click(clickEvent);
		countPayNum();
		adjustCurrentAddr();
		adjustCoupon();
		editPanel.find('[name]').on('change', function() {
			var flag = !0;
			editPanel.find('[name]').each(function() {
				flag = (flag && ($$(this).val().replace(/[\n\ ]+/, '') != ''))
			});
			flag ? $$('.save-use').removeClass('disabled') : $$('.save-use').addClass('disabled');
		});
		// that.on('countPayNum', countPayNum).trigger('countPayNum');
	};

	/* 订单列表页点击事件 */
	fn.orderList = function() {
		var that = this, handle, onload = !0
		  , pageContent = that.find('.page-content')
		  , tagPanel = that.find('.sub-navi')
		  , mainCon = that.find('.mian-content')
		  , cusPageInner = that.find('.cus-page-inner')
		  , orderPlatform = '<section class="order-elem do" data-op="detail" data-addr="'+mainCon.attr('data-detail')+'">' +
			  	'<div class="title _fm-overhide _fm-f-14">' +
			  		'<span class="_fm-left">DIY商城</span>' +
			  		'<span class="_fm-right"></span>' +
			  	'</div>' +
			  	'<p class="division _fm-rel"></p>' +
			  	'<div class="goods-detail"></div>' +
			  	'<p class="division _fm-rel"></p>' +
			  	'<div class="elem-footer _fm-overhide"></div>' +
		  	'</section>'
		  , goodsPlatform = '<div class="goods-content _fm-clearfix">' +
				'<div class="_fm-img _fm-rel _fm-left">' +
					'<div class="img-inner"><img class="lazy" data-src="" alt=""></div>' +
				'</div>' +
				'<div class="goods-msg _fm-rel">' +
					'<h2 class="_fm-f-14 _fm-ellipsis"></h2>' +
					'<div class="price-count _fm-abs _fm-bz _fm-lz">' +
						'<span class="count-num _fm-left _js-formatGoodsPrice" data-size="16px"></span>' +
						'<div class="total-num _fm-right">x<span class="num"></span></div>' +
					'</div>' +
					'<p class="style _fm-overhide"></p>' +
				'</div>' +
			'</div>'
		  , orderBtn = [
		  	'<span class="or do" data-op="payfor" data-addr="'+mainCon.attr('data-pay')+'">立即付款</span><span class="do" data-op="cancelOrder" data-addr="'+mainCon.attr('data-cancel')+'">取消订单</span><span class="do" data-op="addShoppingCar" data-addr="'+mainCon.attr('data-car')+'">加入购物车</span>',
		  	'<span class="dis do" data-op="noop">确认收货</span><span class="dis do" data-op="noop">查看物流</span>',
		  	'<span class="do" data-op="confirmArrived" data-addr="'+mainCon.attr('data-confirm')+'">确认收货</span><span class="do" data-op="sendFlow" data-addr="'+mainCon.attr('data-flow')+'">查看物流</span>',
		  	'<span class="do" data-op="evaluate" data-addr="'+mainCon.attr('data-evaluate')+'">立即评价</span><span class="do" data-op="deleteOrder" data-addr="'+mainCon.attr('data-delete')+'">删除订单</span><span class="do" data-op="addShoppingCar" data-addr="'+mainCon.attr('data-car')+'">加入购物车</span>',	  	
		  	'<span class="do" data-op="deleteOrder" data-addr="'+mainCon.attr('data-delete')+'">删除订单</span><span class="do" data-op="addShoppingCar" data-addr="'+mainCon.attr('data-car')+'">加入购物车</span>'		  	
	  	] ,
	  	noMoreMsg = $$('<p class="load-msg _fm-txtcenter _fm-f-14">没有更多数据了</p>')
	  	  , emptyList = $$(areaEmpty).find('img').attr('src', '../images/UUMall/empty_order.png')
	  					  .parents('.nothing').find('p').text('没有相关订单').next().attr('href', mainCon.attr('data-addr')).text('去下单')
	  					  .parents('.nothing')
	  	,
	  	adjustEmpty = function() {
	  		if (mainCon.find('.order-elem').length > 0) {
	  			emptyList.detach();
	  			mainCon.show();
	  		} else {
	  			$$('.cus-page-inner').append(emptyList);
	  			mainCon.hide();
	  		}
	  	},

		clickEvent = function(e) {
			var target = $$(e.target);
			if (target = closest(target, '.do')) {
				operation[target.attr('data-op')].call(target);
			}
		},
		operation = {
			/* 筛选 */
			filter: function() {
				if (!this.is('.active')) {
					tagPanel.find('li').removeClass('active');
					this.addClass('active');
					ajaxLoadData(pageContent.attr('data-addr'));
					pageContent.scrollTop(0);
				}
			},
			/* 加入购物车 */
			addShoppingCar: function() {
				ajaxSendData(this.attr('data-addr'), {
					orderNo: this.closest('.order-elem').attr('data-id'),
					operation: 'addShop'
				}, 0, '成功加入购物车');
			},
			/* 确认收货 */
			confirmArrived: function() {
				var that = this;
				myApp.confirm('确认收货？', '亲', function() {
					ajaxSendData(that.attr('data-addr'), {
						orderNo: that.closest('.order-elem').attr('data-id'),
						operation: 'confirm'
					}, 'refresh', '确认收货成功');
				});
			},
			/* 删除订单 */
			deleteOrder: function() {
				ajaxSendData(this.attr('data-addr'), {
					orderNo: this.closest('.order-elem').attr('data-id'),
					operation: 'delete'
				}, 'refresh', '删除订单成功');
			},
			/* 取消订单 */
			cancelOrder: function() {
				ajaxSendData(this.attr('data-addr'), {
					orderNo: this.closest('.order-elem').attr('data-id'),
					operation: 'cancel'
				}, 'refresh', '取消订单成功');
			},
			sendFlow: function(){
				window.location = this.attr('data-addr') + '?type=' + 
									this.closest('.order-elem').attr('data-code') + '&postid=' + 
									this.closest('.order-elem').attr('data-expressno') + '&callbackurl=' + 
									'http://test.diy.51app.cn/diyMall2/UOrder/toOrderList.do';
			},
			payfor: orderLink,
			evaluate: orderLink,
			detail: orderLink,
			noop: function() {}
		},
		ajaxLoadData = function(url, isRefresh) {
			var type = parseInt(tagPanel.find('.active').attr('data-type'))
			  , num = isRefresh ? parseInt(mainCon.find('.order-elem:last-child').attr('data-page') || - 1) + 1 : 0;

			$$.ajax({
				url : url,
				method : "POST",
				cache : false,
				data : {status: type, page: num},
				dataType : "json",
				beforeSend: function() {
					isRefresh || noMoreMsg.detach();
				},
				success: function(data) {
					console.log(1)
					if (data.code == 400) {
						isRefresh ? cusPageInner.append(noMoreMsg) : mainCon.html('');
						return false;
					}
					var html = '';
					var op = function(i, d) {
						var order = $$(orderPlatform);
						order.find('.title ._fm-right').html(d.expressMsg);
						order.find('.elem-footer').html(orderBtn[d.status - 1]);
						if(d.status ==8 ){order.find('.elem-footer').html(orderBtn[1]);}
						order.attr('data-id', d.orderNo).attr('data-page', num).attr('data-code',d.code).attr('data-expressNo',d.expressNo);

						$$.each(d.goodinfo, function (i, d) {
							var goods = $$(goodsPlatform);
							goods.find('.lazy').attr('src', d.imgUrl + ((/^\..+$/.test(d.fileType) && d.fileType) || ''));
							goods.find('h2').html(d.name);
							goods.find('.style').html(d.textureName);
							goods.find('.count-num').html('￥' + d.nowPrice);
							goods.find('.total-num .num').html(d.num);
							goods.attr('data-id', d.goodsId);
							order.find('.goods-detail').append(goods);
						});
						html += order[0].outerHTML;
					};
					$$.each(data.data, op);
					isRefresh ? mainCon.append(html) : mainCon.html(html);
					$$('[class*=_js-]:not(.haveDone)').each(fn.execute).addClass('haveDone');
				},
				error: function(xhr, msg) {
					warning.say('网络错误: ' + msg);
				},
				complete: function() {
					myApp.pullToRefreshDone(pageContent);
					isRefresh && pageContent.scrollTop(pageContent.scrollTop() + 40);
					onload = !0;
					adjustEmpty();
				}
			});
		},
		ajaxSendData = function(url, data, isRefresh, str) {
			$$.ajax({
				url : url,
				method : "POST",
				cache : false,
				data : data,
				dataType : "json",
				success: function(data) {
					warning.say(str);
					isRefresh && (ajaxLoadData(pageContent.attr('data-addr')), pageContent.scrollTop(0));
				},
				error: function(xhr, msg) {
					warning.say('网络错误: ' + msg);
				}
			});
		};

		pageContent.on('refresh', function() {
			clearTimeout(handle);
			handle = setTimeout(function() {
				ajaxLoadData(pageContent.attr('data-addr'));
			}, 500);
		}).trigger('refresh').on('infinite', function() {
			clearTimeout(handle);
			handle = setTimeout(function() {
				if (onload) {
					onload = !!0;
					ajaxLoadData(pageContent.attr('data-addr'), 'append');
				}
			}, 500);
		});

		that.click(clickEvent);
	};

	/* 订单详情页面点击事件 */
	fn.orderDetail = function() {
		this.click(function (e) {
			var target = $$(e.target);
			(target = closest(target, '.do')) && orderLink.call(target);
		});
	};





/* Debug
============================================================*/
	fn.toggleActive = function() {
		this.click(function() {
			$$(this).toggleClass('active');
		});
	};

/* Framework7初始化
==================================================*/
	var myApp = new Framework7({
		cache: false,
		pushState: false,

		/*弹出层文案*/
		modalTitle: '',
		modalButtonOk: '确定',
		modalButtonCancel: '取消',
		modalPreloaderTitle: '加载中...',
		modalUsernamePlaceholder: '请输入您的用户名',
		modalPasswordPlaceholder: '请输入您的密码',

		onPageInit: function(app, page) {
			$$('[class*=_js-]:not(.haveDone)').each(fn.execute).addClass('haveDone');
			fn.pageID == 'shoppingcar-index' && page.name == 'index' && $$('.view-main').trigger('callbackNext');
		}
		
	}), mainView = myApp.addView('.view-main', {
		dynamicNavbar: true,
		domCache: (fn.pageID === 'shoppingcar-index' ? false : true)
	});

/* 创建外部接口
==================================================*/
	CustomMallAPI = {
		myApp: myApp,
		mainView: mainView
	};
	

}, CustomMallAPI = {};

document.addEventListener('DOMContentLoaded', CustomMall);








