(function(){
	/* dom ready */
	function blockIE8_(fn){
	    if(document.addEventListener){
	        document.addEventListener('DOMContentLoaded',function(){
	           fn();
	        },false);
	    }else{
	        document.onreadystatechange=function(){
	            if(document.readyState=='complete'){
	             fn();
	            }
	        };
	    }
	}
	blockIE8_(function(){
	  blockIE8_checkBrowser();
	});

	/* check browser */
	function blockIE8_checkBrowser() {
		var UA = navigator.userAgent;
		if (UA.match('MSIE 7.0') || UA.match('MSIE 8.0')) {
			blockIE8_coverIt();
		}
	}
	/* 執行 */
	function blockIE8_coverIt(){
		// 補css
		var headTag = parent.document.head || parent.document.documentElement.childNodes[0];
		var newCssObj = parent.document.createElement('link');
		newCssObj.type = 'text/css';
		newCssObj.rel = 'stylesheet';
		newCssObj.href = 'https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/style/IE/blockIE8.css';
		headTag.appendChild(newCssObj);

		// 插入蓋版
		var bodyTag = parent.document.body || parent.document.documentElement.childNodes[1];
		bodyTag.insertAdjacentHTML('beforeend', '<div id="ie_block"></div>');
		var ie_block = parent.document.getElementById('ie_block');
		// 背景
		var ie_block_bg = parent.document.createElement('div');
		ie_block_bg.id = 'ie_block_bg';
		ie_block.appendChild(ie_block_bg);
		// 加入中間區塊
		var ie_block_box = parent.document.createElement('div');
		ie_block_box.id = 'ie_block_box';
		ie_block.appendChild(ie_block_box);
		// 警告圖
		var ie_block_image = parent.document.createElement('div');
		ie_block_image.id = 'ie_block_image';
		ie_block_box.appendChild(ie_block_image);
		var ie_block_image_img = parent.document.createElement('img');
		ie_block_image_img.id = 'ie_block_image_img';
		ie_block_image_img.src = 'https://tw.hicdn.beanfun.com/beanfun/GamaWWW/allProducts/images/IE/ie_block_bf.png';
		// ie_block_image_img.src = 'style/img/ie_block_bf.png';
		ie_block_image.appendChild(ie_block_image_img);
		// 文字
		var ie_block_text = parent.document.createElement('div');
		ie_block_text.id = 'ie_block_text';
		var ie_block_text_bold  = parent.document.createElement('span');
		var ie_block_text_normal_01 = parent.document.createElement('span');
		var ie_block_text_normal_02 = parent.document.createElement('span');
		var br_01 = parent.document.createElement('br');
		var br_02 = parent.document.createElement('br');
		ie_block_text_bold.className = 'ie_block_text';
		ie_block_text_normal_01.className = 'ie_block_text';
		ie_block_text_normal_02.className = 'ie_block_text';
		ie_block_text_bold.id = 'ie_block_text_bold';
		ie_block_text_bold.innerHTML  = '您的IE瀏覽器版本過舊，無法正常瀏覽beanfun!網頁。';
		ie_block_text_normal_01.innerHTML = '請您更新IE版本或使用其他現代化瀏覽器，';
		ie_block_text_normal_02.innerHTML = '以避免您的資料流失或發生錯誤，謝謝。';
		ie_block_box.appendChild(ie_block_text);
		ie_block_text.appendChild(ie_block_text_bold);
		ie_block_text.appendChild(br_01);
		ie_block_text.appendChild(ie_block_text_normal_01);
		ie_block_text.appendChild(br_02);
		ie_block_text.appendChild(ie_block_text_normal_02);
		// 更新按鈕
		var ie_block_btn = parent.document.createElement('a');
		ie_block_btn.id = 'ie_block_btn';
		ie_block_btn.target = '_blank';
		ie_block_btn.href = 'https://support.microsoft.com/zh-tw/help/17621/internet-explorer-downloads';
		ie_block_btn.innerHTML  = '立即更新IE瀏覽器';
		ie_block_box.appendChild(ie_block_btn);
		var ie_block_btn_l = parent.document.createElement('div');
		var ie_block_btn_r = parent.document.createElement('div');
		ie_block_btn_l.id = 'ie_block_btn_l';
		ie_block_btn.appendChild(ie_block_btn_l);
		ie_block_btn_r.id = 'ie_block_btn_r';
		ie_block_btn.appendChild(ie_block_btn_r);
		// 關閉按鈕
		var ie_block_close = parent.document.createElement('div');
		ie_block_close.id = 'ie_block_close';
		ie_block_close.innerHTML  = '我知道了';
		ie_block_box.appendChild(ie_block_close);

		ie_block_close.onclick = function (){
			ie_block.parentNode.removeChild(ie_block);
		}
	}
})();
