/*
 使用方法
 請在頁面上自行加入stage or production js

 step1:將beanfunTrace_main引用
 step2:呼叫beanfunTraceStart(obj);
       ex:beanfunTraceStart({
            BUID: '',
            property: '',
            sourceProperty: ''
          });
 setp3:設定 TraceParams.InitModel裡的所有資訊
 setp4:頁面的PageView在TraceCodeSetting就叫做PageView不要更改，如果是popup請傳入data-trace的name以便抓取
 setp5:在點擊Html Tag加入data-treace="" & data-traceevent=""
       ex：data-treace="EventToHome" ==>  TraceCodeSetting所設定的key
           data-traceevent="click" ==> 分辨試click還是search
           data-traceevent="linkclick" && data-traceevent="poplinkclick" => 分辨是否轉跳url
 setp6:如有浮動名稱請使用clickinfo-{key}="value" or pageinfo-{key}="value"

 以上如有問題請找 Tony(潘思丞)
 */

var mainInfo = {
    PackageUrl : {
        babelPolyfillUrl : 'https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.12.1/polyfill.min.js?1',
        babelStandaloneUrl : 'https://unpkg.com/@babel/standalone@7.5.5/babel.min.js?1',
        //BGO JS URL
        BGOTraceJSUrl: 'https://beangochat.blob.core.windows.net/beango-static-prod/web-tracing-jssdk/web_tracing_sdk.prod.js',
        TraceUrl : 'min/Prod-beanfunTrace.min.js',
        TraceCodeSettingUrl: 'TraceCodeSetting.js'
    },
    BGOTraceInfo:{
        //Tracking API access token 編碼使用
        BUID: '',
        //SDK使用者回傳資料事業體
        property: '',
        //內容營運商
        sourceProperty: '' 
    },
    IsIE: false
}

//obj : 使用BGOTraceInfo
function beanfunTraceStart(obj){
    mainInfo.BGOTraceInfo = obj;
    GetCurrentPath();
    //1.載入 beanfun Trace SDK JS
    ScriptLoad(mainInfo.PackageUrl.BGOTraceJSUrl);
    //2.判斷是否使用IE瀏覽器
    IsIEBrowser();
    //3..載入Gamania包裝後的Script
    ScriptLoad(mainInfo.PackageUrl.TraceUrl,null,mainInfo.IsIE);
    //4..載入設定檔Script
    ScriptLoad(mainInfo.PackageUrl.TraceCodeSettingUrl,null, false);

    if (mainInfo.IsIE){
        //5.載入相容套件
        ScriptLoad(mainInfo.PackageUrl.babelPolyfillUrl);
        ScriptLoad(mainInfo.PackageUrl.babelStandaloneUrl,function(){
             //相容套件轉譯
            if(typeof(Babel) != 'undefined'){
                Babel.transformScriptTags();
                setTimeout(function(){ Main(); },500);
            }
        });
    }
};

//取得js domain
function GetCurrentPath() {
    var scripts = document.getElementsByTagName("script");
    for (i = 0; i <= scripts.length; i++) {
        var el = scripts[i];
        if(!el) continue;
        var sctiptsrc = el.getAttribute("src");
        if (!sctiptsrc) continue;

        if (sctiptsrc.indexOf('Prod-beanfunTrace_main.js') > -1) {
            var location = sctiptsrc.split('Prod-beanfunTrace_main.js')[0];
            mainInfo.PackageUrl.TraceUrl = '.' + location + mainInfo.PackageUrl.TraceUrl;
            mainInfo.PackageUrl.TraceCodeSettingUrl = '.' +  location + mainInfo.PackageUrl.TraceCodeSettingUrl;
            return;
        };
    }
};

//判斷瀏覽器是否IE
function IsIEBrowser(){
    mainInfo.IsIE = false;
    var browser = navigator.userAgent.toLowerCase();
    if(browser.search('msie') > -1){
        mainInfo.IsIE = true;
    }
    if(browser.search('gecko') > -1 && browser.search('rv') > -1){
        mainInfo.IsIE = true;
    }
};

//script載入
function ScriptLoad(url, callback, isIECompatible){
    var script = document.createElement("script");
    script.setAttribute("src", url);
    script.async = false;
    if(callback){
        script.onload = callback;
    }
    if(isIECompatible){
        script.type = 'text/babel';
        script.setAttribute('data-presets','es2015,es2016,es2017');
    }
    document.head.appendChild(script);
};