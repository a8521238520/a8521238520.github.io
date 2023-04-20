var interval;
var norecordcount = 0;

function pollRequest(PostUrl, LoginToken, RedUrl) {
    MsgBox.Show("此帳號需手機授權登入，請開啟beanfun! 確認[遊戲小幫手]推播訊息，並點選允許即可登入<a href=\"https://tw.beanfun.com/beanfuncommon/EventAD_Mobile/EventAD.aspx?EventADID=6127\" target=\"_blank\"><br/><div align='center'>※手機授權登入圖文教學※</div></a>", "安全防護中");
    //console.log(RedUrl);
    //var write_iframe = '<iframe src="' + RedUrl + '"  width="0" height="0" style="width:0;height:0;border:0;border:none;"/>';
    //document.write(write_iframe);
    //window.location = RedUrl;
    interval = window.setInterval(function () { CheckIsRegisteDevice(PostUrl, LoginToken); }, 2000);
    $("#checkbox_remember_account").addClass("ui-checkbox");
    $("#btn_login").addClass("lbtn");
    $("#trCaptchaTextBox").hide();
    $("#divCaptchaImage").hide();
}

function CheckIsRegisteDevice(Url, LoginToken) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var resultobj = JSON.parse(xmlhttp.responseText);
            switch (resultobj.IntResult) {
                case -3:
                    if (window.console) {
                        console.log("登入請求被拒絕");
                    }
                    MsgBox.Show("您的登入要求已被beanfun! 拒絕。");
                    window.clearInterval(interval);
                    break;
                case -2:
                    if (window.console) {
                        console.log("登入請求已逾時");
                    }
                    window.clearInterval(interval);
                    break;
                case -1:
                    MsgBox.Show(resultobj.StrReslut);
                    window.clearInterval(interval);
                    break;
                case 0:
                    norecordcount++;
                    if (norecordcount > 3) {
                        MsgBox.Show("此帳號需透過遊戲橘子授權登入。請<a href=\"https://tw.beanfun.com/beanfunCommon/Redirect/Redirect.aspx?ID=B64\" target=\"_blank\">點此下載</a>安裝檔案，即可使用遊戲橘子授權登入功能。", "安全防護中");
                        window.clearInterval(interval);
                    }
                    break;
                case 1:
                    if (window.console) {
                        console.log("尚未授權本次登入");
                    }
                    break;
                case 2:
                    window.location = resultobj.StrReslut;
                    window.clearInterval(interval);
                    break;
            }
        }
    }
    xmlhttp.open("Post", Url, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("LT=" + LoginToken);
}

function RedirectPage(SendbfAPUrl, RedirectUrl) {
    if (SendbfAPUrl !== "") {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            window.location = RedirectUrl;
        } else {
            //window.location = SendbfAPUrl;
            //var write_iframe = '<iframe src="' + SendbfAPUrl + '"  width="0" height="0" style="width:0;height:0;border:0; border:none;"/>';
            //document.write(write_iframe);
            setTimeout(function () {
                window.location = RedirectUrl;
            }, 3000);
        }
    } else {
        window.location = RedirectUrl;
    }
}
