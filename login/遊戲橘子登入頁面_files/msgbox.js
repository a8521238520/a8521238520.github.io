
/*****************************************
* Custum Lite MsgBox 
* author: darrenwu 2009-10-23
* dependencies: jQuery library
* update note: 2010-09-02 update function
*              2011-03-03 move to locales and let BU update this js.
*****************************************/

// To BU: Add your own language-code and words here.
var MsgBoxAllLangTable = {
    "en-us": { DefaultTitle: "System Message", DefaultContent: "No Message", DefaultOkBtnName: "OK", DefaultCancelBtnName: "Cancel", PleasWait: "Please Wait" },
    "zh-tw": { DefaultTitle: "\u7cfb\u7d71\u8a0a\u606f", DefaultContent: "\u7121\u8a0a\u606f", DefaultOkBtnName: "\u78ba\u5b9a", DefaultCancelBtnName: "\u53d6\u6d88", PleasWait: "\u8acb\u7a0d\u5019" },
    "zh-hk": { DefaultTitle: "\u7cfb\u7d71\u8a0a\u606f", DefaultContent: "\u7121\u8a0a\u606f", DefaultOkBtnName: "\u78ba\u5b9a", DefaultCancelBtnName: "\u53d6\u6d88", PleasWait: "\u8acb\u7a0d\u5019" },
    "zh-cn": { DefaultTitle: "\u7cfb\u7edf\u8baf\u606f", DefaultContent: "\u65e0\u8baf\u606f", DefaultOkBtnName: "\u786e\u5b9a", DefaultCancelBtnName: "\u53d6\u6d88", PleasWait: "\u8bf7\u7a0d\u5019" }
};

var MsgBoxLangTable;

//2018-03-22弱點掃描因$.browser不支援jQuery 1.9(含)以上!故換寫法
var browser = navigator.userAgent;

//// To BU: Set the LangTable
// MsgBoxLangTable = MsgBoxAllLangTable["en-us"];
//// To BU: Or let browser detect the language-code, use the scripts below.
MsgBoxLangTable = MsgBoxAllLangTable[((navigator.language) ? navigator.language : navigator.userLanguage).toLowerCase()];
if (MsgBoxLangTable == null) MsgBoxLangTable = MsgBoxAllLangTable["en-us"];


var MsgBox = {
    SetLanguage: function(LanguageCode) {
        LanguageCode = LanguageCode.toLowerCase();
        MsgBoxLangTable = MsgBoxAllLangTable[LanguageCode];
        if (MsgBoxLangTable == null) {
            MsgBoxLangTable = MsgBoxAllLangTable["en-us"];
        }
    },
    TimeoutID: -1,
    PageWidth: function() {
        return window.innerWidth != null ? window.innerWidth : document.documentElement && document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body != null ? document.body.clientWidth : null;
    },
    PageHeight: function() {
        return window.innerHeight != null ? window.innerHeight : document.documentElement && document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body != null ? document.body.clientHeight : null;
    },
    PosLeft: function() {
        return typeof window.pageXOffset != 'undefined' ? window.pageXOffset : document.documentElement && document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft ? document.body.scrollLeft : 0;
    },
    PosTop: function() {
        return typeof window.pageYOffset != 'undefined' ? window.pageYOffset : document.documentElement && document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop ? document.body.scrollTop : 0;
    },
    CreateMsgBox: function() {
        // create elements and set styles
        $("<div id='DivMsgBoxBack'></div>").appendTo(document.body);
        $("<div id='DivMsgBoxContainer'></div>").appendTo(document.body);
        $("<div id='DivMsgBoxTitle'></div>").appendTo($("#DivMsgBoxContainer"));
        $("<div id='DivMsgBoxContent'></div>").appendTo($("#DivMsgBoxContainer"));
        $("<div id='DivMsgBoxBtn'></div>").appendTo($("#DivMsgBoxContainer"));
        $("#DivMsgBoxBtn").append("<input id='MsgBoxOkBtn' type='button' value='OK' />&nbsp;<input id='MsgBoxCancelBtn' type='button' value='Cancel' />");
    },
    ChangeTagsVisible: function (vType) {
        //2018-03-22弱點掃描因$.browser不支援jQuery 1.9(含)以上!故換寫法
        //if (jQuery.browser.msie && jQuery.browser.version == "6.0") {
        if (browser.search('MSIE 6') != -1) {
            $("select").css("visibility", vType);
            $("object").css("visibility", vType);
        }
    },
    Show: function(msg, headerTitle, buttonCloseName, callback) {

        if (!document.getElementById("DivMsgBoxContainer")) {
            MsgBox.CreateMsgBox();
        };

        $("#MsgBoxCancelBtn").hide();

        $("#DivMsgBoxTitle").text((headerTitle) ? headerTitle : MsgBoxLangTable.DefaultTitle)
        $("#MsgBoxOkBtn").val((buttonCloseName) ? buttonCloseName : MsgBoxLangTable.DefaultOkBtnName)
        $("#DivMsgBoxBtn").show();

        MsgBox._setPosition();

        $("#DivMsgBoxContent").html(msg);

        document.getElementById("MsgBoxOkBtn").onclick = function() {
            MsgBox.Hide();
            if (callback) {
                if (typeof callback === "string") {
                    eval(callback);
                }
                else if (typeof callback === "function") {
                    callback();
                }
            }
        }

        $("#DivMsgBoxContainer").show();
        $("#DivMsgBoxBack").show();
        MsgBox.ChangeTagsVisible("hidden");

    },
    ShowConfirm: function(msg, headerTitle, buttonConfirmName, buttonCancelName, callback) {
        if (!document.getElementById("DivMsgBoxContainer")) {
            MsgBox.CreateMsgBox();
        };

        $("#MsgBoxOkBtn").show();
        $("#MsgBoxCancelBtn").show();

        $("#DivMsgBoxTitle").text((headerTitle) ? headerTitle : MsgBoxLangTable.DefaultTitle)
        $("#MsgBoxOkBtn").val((buttonConfirmName) ? buttonConfirmName : MsgBoxLangTable.DefaultOkBtnName)
        $("#MsgBoxCancelBtn").val((buttonCancelName) ? buttonCancelName : MsgBoxLangTable.DefaultCancelBtnName)
        $("#DivMsgBoxBtn").show();

        MsgBox._setPosition();

        $("#DivMsgBoxContent").html(msg);

        document.getElementById("MsgBoxOkBtn").onclick = function() {
            MsgBox.Hide();
            if (callback) {
                if (typeof callback === "string") {
                    eval(callback);
                }
                else if (typeof callback === "function") {
                    callback(true);
                }
            }
        }

        document.getElementById("MsgBoxCancelBtn").onclick = function() {
            MsgBox.Hide();
            if (callback) {
                if (typeof callback === "string") {
                    //if string only for clicking OK
                    //eval(callback);
                }
                else if (typeof callback === "function") {
                    callback(false);
                }
            }
        }

        $("#DivMsgBoxContainer").show();
        $("#DivMsgBoxBack").show();
        MsgBox.ChangeTagsVisible("hidden");

    },
    ShowWaiting: function(secondsToDisplay, secondsToDelay) {
        if (secondsToDelay) {
            window.setTimeout("MsgBox.ShowWaiting(" + secondsToDisplay + ")", secondsToDelay * 1000);
            return;
        }
        else {
            MsgBox.Show("<img src='../images/loading16x16.gif' align='absmiddle' /> " + MsgBoxLangTable.PleasWait + "..");
            $("#DivMsgBoxBtn").hide();
            MsgBox.TimeoutID = window.setTimeout("MsgBox.Hide();", secondsToDisplay * 1000);
        }
    },
    Hide: function() {
        //clear auto close function
        window.clearTimeout(MsgBox.TimeoutID);

        MsgBox.ChangeTagsVisible("visible");
        $("#DivMsgBoxBtn").show(); //for waiting msgbox
        $("#DivMsgBoxContainer").hide();
        $("#DivMsgBoxBack").hide();

        $("#DivMsgBoxTitle").text(MsgBoxLangTable.DefaultTitle);
        $("#MsgBoxOkBtn").val(MsgBoxLangTable.DefaultOkBtnName);
        $("#DivMsgBoxContent").html(MsgBoxLangTable.DefaultContent);

    },
    EnterEvent: function(ev) {
        if (ev == null) ev = window.event; //IE
        var keyCode = ev.keyCode ? ev.keyCode : ev.charCode;
        if ($("#DivMsgBoxContainer").css("display") == "block" && $("#DivMsgBoxBtn").css("display") == "block") {
            if (keyCode == 13) {
                $("#MsgBoxOkBtn").trigger("click");
            }
            else if (keyCode == 27) {
                if ($("#MsgBoxCancelBtn").css("display") == "none")
                    $("#MsgBoxOkBtn").trigger("click");
                else
                    $("#MsgBoxCancelBtn").trigger("click");
            }

            if (keyCode == 13 || keyCode == 27) {
                //stop event
                if (ev.stopPropagation) { ev.stopPropagation() }
                if (ev.preventDefault) { ev.preventDefault() }
                try { ev.cancelBubble = true } catch (e) { }
                try { ev.returnValue = false } catch (e) { }
            }
        }
    },

    _setPosition: function() {
        var pageWidth = MsgBox.PageWidth();
        var pageHeight = MsgBox.PageHeight();
        var bodyWidth = document.documentElement.scrollWidth;
        var bodyHeight = document.documentElement.scrollHeight;
        $("#DivMsgBoxBack").css({ "width": "100%", "height": (bodyHeight >= pageHeight ? bodyHeight : pageHeight) + "px" });

        //set position
        //2018-03-22弱點掃描因$.browser不支援jQuery 1.9(含)以上!故換寫法
        //if (($.browser.msie && parseInt($.browser.version) <= 6)) {
        if(browser.search('MSIE 6') != -1){
            //$("#DivMsgBoxContainer").css({ "position": "absolute", "left": ((pageWidth - 250) / 2 + MsgBox.PosLeft()) + "px", "top": ((pageHeight - 50) / 2 + MsgBox.PosTop()) + "px" });
        }
        else {
            //$("#DivMsgBoxContainer").css({ "position": "fixed", "left": ((pageWidth - 250) / 2) + "px", "top": ((pageHeight - 50) / 2) + "px" });
        }
    }
};

// when user press enter, close msgbox
if (document.attachEvent) { document.attachEvent("onkeypress", MsgBox.EnterEvent); } else { document.addEventListener("keypress", MsgBox.EnterEvent, false); }