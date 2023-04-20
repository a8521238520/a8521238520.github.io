$(function(){
	// select標籤包起來
	$('#tdFormArea select').wrap('<div class="sel"></div>');
	$('.sel').append('<div class="gnnText"></div>');
	$('.sel select').each(function(){
		$(this).parent().find('.gnnText').text($('option:selected', this).text());
	});
	$('.sel select').on('change', function(){
		$(this).parent().find('.gnnText').text($('option:selected', this).text());
	});
	$('.sel select').on('DOMSubtreeModified', function(){
		$(this).parent().find('.gnnText').text($('option:first', this).text());
	});

	// 取網址參數display_mode=3、5顯示header
	var modeNum = getParaByName('display_mode');
	if(modeNum == '3' || modeNum == '5'){
		$('#tdFormArea').addClass('show-mobile-header');
	}

	// 直接在body加Class好了…
	if(getParaByName('display_mode') != null){
		$('body').addClass('display-mode-' + getParaByName('display_mode'));
	}
	if(getParaByName('region') != null){
		$('body').addClass('region-' + getParaByName('region'));
	}

	//如果遇到錯誤就把tab藏起來
	/* if($('#ctl00_ContentPlaceHolder1_divTabLocalAreaQR').length == 0){
		$('#ctl00_ContentPlaceHolder1_divTabLocalArea').hide();
	} */

	var serverTime;
	var popupStartTime = new Date('2019/06/12 00:00:00');
	var serviceCloseTime = new Date('2019/06/19 12:00:00');
	var popupEndTime = new Date('2019/07/12 23:59:59');
	var gboxScripExistence = $('script[src*="gbox"]').attr('src');
	$.ajax({
		type: "GET",
		cache: false,
		url: location.href,
		complete: function(req, textStatus) {
			var dateString = req.getResponseHeader("Date");
			if (dateString.indexOf("GMT") === -1) {
				dateString += " GMT";
			}
			serverTime = new Date(dateString);
			if(popupStartTime < serverTime && serverTime < popupEndTime && gboxScripExistence !== undefined){ //已經開始 且在結束時間內 且有載入gbox

				$('#ddlAuthType').on('change', function(){
					if($(this).val() == 9){
						$.gbox.open('<div class="anotherLoginMethod">【其他】登入選項將於2019/06/19 12:00關閉囉！關閉後會員仍可以使用原帳號信箱登入beanfun! 遊戲官網，詳情請參考<a href="https://tw.beanfun.com/news/content.aspx?p=1&news_id=2441&c=1&t=2313&tc=Announcement" target="_blank">帳號升級公告</a>。<br><br>升級為點數帳號，可享有更多遊戲服務喔～歡迎洽詢<a href="https://tw.beanfun.com/customerservice/www/concact1.html?a" target="_blank">客服中心</a>。</div>', {
							titleBar:'帳號升級提醒',
							afterClose: function(){
								if(serviceCloseTime < serverTime){ //服務下架了
									location.reload();
									//$('#ddlAuthType option[value="1"]').attr('selected','selected');
								}
							}
						});
					}
				});
			}
		}
	});



});

function getParaByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function loginFailFN(){
	$('body').addClass('qrLoginFail');
}