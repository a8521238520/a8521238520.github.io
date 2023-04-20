// version 2.1, 2010-10-25


// Set these values in the page who calls this javascripts.
var _WK_StringTable = {
    "WK_CLEAR": "清除全部",
    "WK_BACKSPACE": "倒退",
    "WK_CAPSLOCK": "大/小寫"
};


var intCharCase = 0;
var intPreviousShiftSize;
var arrLowercaseChars = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');
var arrUppercaseChars = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
var arrKeys = new Array(36);
var arrShifted = new Array(36);
var intCaretPos = null;
var blnOpened = false, currentElement = null;
var intInsertionS = 0;  // Insertion Start Position (= Selection Start Position).
var intInsertionE = 0;  // Insertion End Position (= Selection End Position).
var strUserAgent = navigator.userAgent.toLowerCase();
var blnGecko = (strUserAgent.indexOf('gecko') != -1) && (strUserAgent.indexOf('applewebkit') == -1);
var tWebKeyboard = null;
var intCHAR_DISPLAY_DURATION = 400;

var iCounter = 0;       // for debugging purpose


document.write('<div id="divWebKeyboardBase"></div>');


var WebKeyboard = {

    wkArray: [],
    FocusInit: function (elm) {
        currentElement = elm;
        if (document.attachEvent)
            currentElement.attachEvent("onblur", WebKeyboard.BackFocus);
    },


    Show: function () {
        WebKeyboard.Construct("divWebKeyboard",     // container's id
	                         WebKeyboard.Callback,  // reference to the callback function
	                         "arial",               // font name ("" == system default)
	                         "12px",                // font size in px
	                         "#FFFFFF",             // font color
	                         "#FF8300",             // keyboard base background color
	                         "#FFFFFF",             // keys' background color
	                         "#808080",             // border color
	                         false);                // embed WebKeyboard into the page?

        WebKeyboard.RandomizeChars();
        WebKeyboard.ShowChars();
        document.getElementById("divWebKeyboard").style.display = "block";
    },

    Hide: function () {
        document.getElementById("divWebKeyboard").style.display = "none";
    },

    Callback: function (ch) {
        WebKeyboard.InsertAtCaret(currentElement, ch);
        WebKeyboard.RandomizeChars();
    },

    BackFocus: function () {
        if (blnOpened) {
            WebKeyboard.SetRange(currentElement, intInsertionS, intInsertionE);

            currentElement.focus();
        }
    },

    GetCaretPositions: function (elm) {
        var CaretPosS = -1, CaretPosE = 0;

        // Mozilla way:
        if (elm.selectionStart || (elm.selectionStart == '0')) {
            CaretPosS = elm.selectionStart;
            CaretPosE = elm.selectionEnd;

            intInsertionS = CaretPosS == -1 ? CaretPosE : CaretPosS;
            intInsertionE = CaretPosE;
        }
            // IE way:
        else if (document.selection && elm.createTextRange) {
            var start = end = 0;
            try {
                start = Math.abs(document.selection.createRange().moveStart("character", -10000000)); // start

                if (start > 0) {
                    try {
                        var endReal = Math.abs(elm.createTextRange().moveEnd("character", -10000000));

                        var r = document.body.createTextRange();
                        r.moveToElementText(elm);
                        var sTest = Math.abs(r.moveStart("character", -10000000));
                        var eTest = Math.abs(r.moveEnd("character", -10000000));

                        if ((elm.tagName.toLowerCase() != 'input') && (eTest - endReal == sTest))
                            start -= sTest;
                    }
                    catch (err) { }
                }
            }
            catch (e) { }

            try {
                end = Math.abs(document.selection.createRange().moveEnd("character", -10000000)); // end
                if (end > 0) {
                    try {
                        var endReal = Math.abs(elm.createTextRange().moveEnd("character", -10000000));

                        var r = document.body.createTextRange();
                        r.moveToElementText(elm);
                        var sTest = Math.abs(r.moveStart("character", -10000000));
                        var eTest = Math.abs(r.moveEnd("character", -10000000));

                        if ((elm.tagName.toLowerCase() != 'input') && (eTest - endReal == sTest))
                            end -= sTest;
                    }
                    catch (err) { }
                }
            }
            catch (e) { }

            intInsertionS = start;
            intInsertionE = end;
        }
    },

    SetRange: function (elm, start, end) {
        if (!elm)
            return;

        if (elm.setSelectionRange) // Standard way (Mozilla, Opera, ...)
        {
            elm.setSelectionRange(start, end);
        }
        else // MS IE
        {
            var range;

            try {
                range = elm.createTextRange();
            }
            catch (e) {
                try {
                    range = document.body.createTextRange();
                    range.moveToElementText(elm);
                }
                catch (e) {
                    range = null;
                }
            }

            if (!range) return;

            range.collapse(true);
            range.moveStart("character", start);
            range.moveEnd("character", end - start);
            range.select();
        }

        intInsertionS = start;
        intInsertionE = end;
    },

    DeleteSelection: function (elm) {
        if (intInsertionS == intInsertionE) return;

        var tmp = (document.selection && !window.opera) ? elm.value.replace(/\r/g, "") : elm.value;
        elm.value = tmp.substring(0, intInsertionS) + tmp.substring(intInsertionE, tmp.length);

        WebKeyboard.SetRange(elm, intInsertionS, intInsertionS);
    },

    DeleteAtCaret: function (elm) {
        if (intInsertionS != intInsertionE) {
            WebKeyboard.DeleteSelection(elm);
            return;
        }

        if (intInsertionS == intInsertionE)
            intInsertionS = intInsertionS - 1;

        var tmp = (document.selection && !window.opera) ? elm.value.replace(/\r/g, "") : elm.value;
        elm.value = tmp.substring(0, intInsertionS) + tmp.substring(intInsertionE, tmp.length);

        WebKeyboard.SetRange(elm, intInsertionS, intInsertionS);
    },

    InsertAtCaret: function (elm, val) {

        if (intInsertionS != intInsertionE) WebKeyboard.DeleteSelection(elm);
        // Make sure the input length is within the max allowed length of the target element.
        if (elm.value.length >= elm.getAttribute("maxlength") && elm.getAttribute("maxlength") != null)    // add '&& elm.getAttribute("maxlength") != null' for FireFox compatibility purpose
        {
            WebKeyboard.SetRange(elm, intInsertionS, intInsertionS);
            return;
        }

        if (blnGecko && document.createEvent && !window.opera) {
            // 2012-06-29
            var nAgt = navigator.userAgent;
            var verOffset, fullVersion, majorVersion;
            if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
                fullVersion = nAgt.substring(verOffset + 8);
                majorVersion = parseInt('' + fullVersion, 10);
                if (isNaN(majorVersion)) {
                    fullVersion = '' + parseFloat(navigator.appVersion);
                    majorVersion = parseInt(navigator.appVersion, 10);
                }
            }
            if (majorVersion >= 13) {
                var tmp = (document.selection && !window.opera) ? elm.value.replace(/\r/g, "") : elm.value;
                elm.value = tmp.substring(0, intInsertionS) + val + tmp.substring(intInsertionS, tmp.length);
            }
            else {
                var e = document.createEvent("KeyboardEvent");

                if (e.initKeyEvent && elm != null && elm.dispatchEvent) {
                    e.initKeyEvent("keypress",        // in DOMString typeArg,
                            false,             // in boolean canBubbleArg,
                            true,              // in boolean cancelableArg,
                            null,              // in nsIDOMAbstractView viewArg, specifies UIEvent.view. This value may be null;
                            false,             // in boolean ctrlKeyArg,
                            false,             // in boolean altKeyArg,
                            false,             // in boolean shiftKeyArg,
                            false,             // in boolean metaKeyArg,
                            null,              // key code;
                            val.charCodeAt(0)); // char code.
                    //if( elm != null )
                    elm.dispatchEvent(e);
                }
                var tmp = (document.selection && !window.opera) ? elm.value.replace(/\r/g, "") : elm.value;
                elm.value = tmp.substring(0, intInsertionS) + val + tmp.substring(intInsertionS, tmp.length);
            }
        }
        else {
            var tmp = (document.selection && !window.opera) ? elm.value.replace(/\r/g, "") : elm.value;
            elm.value = tmp.substring(0, intInsertionS) + val + tmp.substring(intInsertionS, tmp.length);
        }
        WebKeyboard.SetRange(elm, intInsertionS + val.length, intInsertionS + val.length);
    },

    ShiftObjects: function (o, intShiftSize) {
        if (!intShiftSize) {
            intPreviousShiftSize = intShiftSize = parseInt(Math.random() * (o.length - 1));
        }

        for (var i = 0, j = intShiftSize; j < o.length; ++i, ++j) {
            arrShifted[i] = o[j];
        }

        for (var i = o.length - intShiftSize, j = 0; j < intShiftSize; ++i, ++j) {
            arrShifted[i] = o[j];
        }
    },


    RandomizeChars: function () {
        var strNumber = "0123456789";
        if (intCharCase == 0) {
            WebKeyboard.ShiftObjects(arrLowercaseChars);
        }
        else {
            WebKeyboard.ShiftObjects(arrUppercaseChars);
        }
        for (var i = 0; i < arrShifted.length; ++i) {
            arrKeys[i].innerHTML = arrShifted[i];
            //			if ( strNumber.indexOf(arrShifted[i]) >= 0 )
            //			    arrKeys[i].style.color = "#FF0000";
            //			else
            //			    arrKeys[i].style.color = "#000000";
        }
    },


    SetEvent: function (elem, eventType, handler) {
        return (elem.attachEvent ? elem.attachEvent("on" + eventType, handler) : ((elem.addEventListener) ? elem.addEventListener(eventType, handler, false) : null));
    },

    ShowChars: function () {
        clearTimeout(tWebKeyboard);
        document.getElementById("divWebKeyboard").style.color = "#000000";
        var strNumber = "0123456789";
        for (var i = 0; i < arrShifted.length; ++i) {
            if (strNumber.indexOf(arrShifted[i]) >= 0)
                arrKeys[i].style.color = "#FF0000";
            else
                arrKeys[i].style.color = "#000000";
        }
    },

    SetStyle: function (obj, top, left, width, height, position, border_color, bg_color, line_height, font_size, font_color) {
        var os = obj.style;

        if (top) os.top = top;
        if (left) os.left = left;
        if (width) os.width = width;
        if (height) os.height = height;

        if (position) os.position = position;

        if (border_color) os.border = "1px solid " + border_color;
        if (bg_color) os.backgroundColor = bg_color;

        os.textAlign = "center";

        if (line_height) os.lineHeight = line_height;
        if (font_size) os.fontSize = font_size;

        os.fontWeight = "bold";

        if (font_color) os.color = font_color;

        os.cursor = "pointer";
    },


    SetKey: function (parent, id, top, left, width, height, border_color, bg_color, line_height, font_size) {
        //iCounter++;
        var _id = this.Cntr.id + id;
        var exists = document.getElementById(_id);
        //    if (!exists)      // for debugging purpose.
        //    {
        //        if( iCounter < 10 )
        //        {
        //            //alert("!exists " + _id);
        //            //alert("key: " + id + " " + top + " " + left + " " + width + " " + height);
        //            iCounter++;
        //        }
        //    }



        var key = exists ? exists.parentNode : document.createElement("div");
        this.SetStyle(key, top, left, width, height, "absolute");

        var key_sub = exists || document.createElement("div");
        key.appendChild(key_sub);
        parent.appendChild(key);

        key_sub.id = _id;

        if (id != "___close" && id != "___clear" && id != "___backspace" && id != "___capslock") {
            //iCounter++;
            this.SetStyle(key_sub, "", "", "", line_height, "relative", border_color, bg_color, line_height, font_size);
            //    	    if ( iCounter < 10 )    // for debugging purpose
            //            {
            //                iCounter++;
            //                alert("key: " + id + " " + border_color + " " + bg_color + " " + line_height);
            //            }
            if (!exists) this.SetEvent(key_sub, 'mouseup', this.HandleMouseUp);
        }
        else {
            this.SetStyle(key_sub, "", "", "", line_height, "relative", border_color, bg_color, line_height, font_size, "#000000");

            switch (id) {
                case "___close":
                    //if(!exists) this.SetEvent(key_sub, 'mouseup', this.Close);
                    break;
                case "___clear":
                    if (!exists) this.SetEvent(key_sub, 'mouseup', this.Clear);
                    break;
                case "___backspace":
                    if (!exists) this.SetEvent(key_sub, 'mouseup', this.Backspace);
                    break;
                case "___capslock":
                    if (!exists) this.SetEvent(key_sub, 'mouseup', this.CapsLock);
                    break;
                default:
                    break;
            }
        }

        return key_sub;
    },


    FindX: function (obj)
    { return (obj && obj.parentNode) ? parseFloat(obj.parentNode.offsetLeft) : 0; },


    FindY: function (obj)
    { return (obj && obj.parentNode) ? parseFloat(obj.parentNode.offsetTop) : 0; },


    FindW: function (obj)
    { return (obj && obj.parentNode) ? parseFloat(obj.parentNode.offsetWidth) : 0; },


    FindH: function (obj)
    { return (obj && obj.parentNode) ? parseFloat(obj.parentNode.offsetHeight) : 0; },


    Construct: function (container_id, callback_ref, font_name, font_size, font_color, bg_color, key_color,
                       border_color, do_embed) {
        var exists = (this.Cntr != undefined), ct = exists ? this.Cntr : document.getElementById(container_id);

        var changed = (font_size && (font_size != this.fontsize));

        this._Callback = ((typeof (callback_ref) == "function") && ((callback_ref.length == 1) || (callback_ref.length == 2))) ? callback_ref : (this._Callback || null);

        var ff = font_name || this.fontname || "";
        var fs = font_size || this.fontsize || "14px";

        var fc = font_color || this.fontcolor || "#FFFFFF";
        var bg = bg_color || this.bgcolor || "#FFFFFF";
        var kc = key_color || this.keycolor || "#FFFFFF";
        var bc = border_color || this.bordercolor || "#000000";

        this.fontname = ff, this.fontsize = fs, this.fontcolor = fc;
        this.bgcolor = bg, this.keycolor = kc, this.bordercolor = bc;

        if (!exists) {
            this.Cntr = ct;

            WebKeyboard.wkArray[container_id] = this;
        }

        var wk = exists ? ct.childNodes[0] : document.createElement("div");

        if (!exists) {
            ct.appendChild(wk);
            ct.style.display = "block";
            ct.style.zIndex = 999;

            if (do_embed)
                ct.style.position = "relative";
            else {
                ct.style.position = "absolute";

                var initX = 0, ct_ = ct;
                if (ct_.offsetParent) {
                    while (ct_.offsetParent) {
                        initX += ct_.offsetLeft;
                        ct_ = ct_.offsetParent;
                    }
                }
                else if (ct_.x)
                    initX += ct_.x;

                var initY = 0; ct_ = ct;
                if (ct_.offsetParent) {
                    while (ct_.offsetParent) {
                        initY += ct_.offsetTop;
                        ct_ = ct_.offsetParent;
                    }
                }
                else if (ct_.y)
                    initY += ct_.y;

                //ct.style.top = initY + "px", ct.style.left = initX +"px";
            }

            wk.style.position = "relative";
            //wk.style.top      = "0px", wk.style.left = "0px";
        }

        wk.style.border = "1px solid " + bc;

        var wk_main = exists ? wk.childNodes[0] : document.createElement("div"), ks = wk_main.style;
        if (!exists) {
            wk.appendChild(wk_main);

            ks.position = "relative";
            ks.width = "1px";
            ks.cursor = "";
        }

        // Disable content selection:
        this.SetEvent(wk_main, "selectstart", function (event) { return false; });
        this.SetEvent(wk_main, "mousedown", function (event) { if (event.preventDefault) event.preventDefault(); return false; });



        ks.fontFamily = ff, ks.backgroundColor = bg;

        if (!exists || changed) {
            this.CreateHeader(wk_main);
            yx = this.CreateKeys(container_id, wk_main);

            ks.width = yx.split(",")[1];
            ks.height = yx.split(",")[0];
        }

        return this;
    },

    CreateHeader: function (parent) {
        var strHeaderTextHeight = String(parseFloat(this.fontsize) / 2) + "px";
        var divHeaderText = document.createElement("div");

        divHeaderText.id = "divWebKeyboardHeaderText";
        divHeaderText.style.position = "absolute";
        divHeaderText.style.left = "2px";
        divHeaderText.style.top = strHeaderTextHeight;
        divHeaderText.style.width = "270px";    //document.getElementById("divWebKeyboard").style.width;
        divHeaderText.style.height = "50px";
        divHeaderText.style.fontSize = this.fontsize;
        divHeaderText.style.fontName = this.fontname;
        divHeaderText.style.color = "#ffffff";
        divHeaderText.style.fontWeight = "bold";
        divHeaderText.innerHTML = "";

        var funcOldWebKeyboardMouseDown = divHeaderText.onmousedown;
        // add drag-drop feature to the divWebKeyboard, only if drag manager JS class is provided
        if (typeof DragManager != "undefined") {
            divHeaderText.onmousedown = function (event) {
                if (typeof funcOldWebKeyboardMouseDown == "function")
                    funcOldWebKeyboardMouseDown();
                DragManager.Start(event, "divWebKeyboard");
                //alert("width " + document.getElementById("divWebKeyboard").style.width);
            }
        }


        var divHeaderClose = document.createElement("div");
        divHeaderClose.style.position = "relative";
        divHeaderClose.innerHTML = "<img src='http://tw.hicdn.beanfun.com/INTRA/beanfun/beanfun/common_assets/common-login/images/WebKeyboardCloseButton.png' onclick='WebKeyboard.Close();' width='18' height='18' style='cursor:pointer' />";
        divHeaderClose.style.left = "-2px";
        divHeaderClose.style.top = "2px";
        divHeaderClose.style.color = "#ffffff";
        divHeaderClose.align = 'right';
        //        divHeaderClose.onclick = function (event) {
        //                                                WebKeyboard.Close();
        //                                            }
        parent.appendChild(divHeaderClose);
        parent.appendChild(divHeaderText);
    },


    CreateKeys: function (container_id, parent) {
        var fs = this.fontsize, kc = this.keycolor, bc = this.bordercolor;
        var fCellSize = parseFloat(fs) * 2;
        var cp = String(fCellSize) + "px", lh = String(Math.floor(fCellSize - 2.0)) + "px";

        var x = "1px";
        var y = String(fCellSize + 1) + "px";
        var i = 0;
        var c = 1;

        // Create character keys.
        for (i = 0; i < arrLowercaseChars.length; ++i) {

            arrKeys[i] = this.SetKey(parent, "___" + arrLowercaseChars[i], y, x, cp, cp, bc, kc, lh, fs);
            x = (i % 9 == 8) ? "1px" : String(this.FindX(arrKeys[i % 9]) + this.FindW(arrKeys[i % 9]) + 1) + "px";
            if (i % 9 == 8) {
                y = ++c * String(fCellSize + 1) + "px";
            }
        }

        // Create command keys.
        strCommandKeyX = 9 * String(fCellSize + 1) + 1 + "px";

        strCommandKeyY = 1 * String(fCellSize + 1) + "px";
        var wk_clear = this.SetKey(parent, "___clear", strCommandKeyY, strCommandKeyX, String(2.5 * fCellSize + 1) + "px", cp, bc, kc, lh, fs);
        wk_clear.innerHTML = _WK_StringTable["WK_CLEAR"];

        strCommandKeyY = 2 * String(fCellSize + 1) + "px";
        var wk_backspace = this.SetKey(parent, "___backspace", strCommandKeyY, strCommandKeyX, String(2.5 * fCellSize + 1) + "px", cp, bc, kc, lh, fs);
        wk_backspace.innerHTML = _WK_StringTable["WK_BACKSPACE"];

        strCommandKeyY = 3 * String(fCellSize + 1) + "px";
        var wk_capslock = this.SetKey(parent, "___capslock", strCommandKeyY, strCommandKeyX, String(2.5 * fCellSize + 1) + "px", cp, bc, kc, lh, fs);
        wk_capslock.innerHTML = _WK_StringTable["WK_CAPSLOCK"];

        strCommandKeyY = 4 * String(fCellSize + 1) + "px";
        var wk_close = this.SetKey(parent, "___close", strCommandKeyY, strCommandKeyX, String(2.5 * fCellSize + 1) + "px", cp, bc, kc, lh, fs);
        wk_close.innerHTML = "";

        height = 5 * String(fCellSize + 1) + "px";
        width = 11.5 * String(fCellSize + 1) + 1 + "px";

        return height + "," + width;
    },

    HandleMouseUp: function (event) {
        var e = event || window.event;
        var in_el = e.srcElement || e.target;
        var container_id = in_el.id.substring(0, in_el.id.indexOf("___"));

        var wk = WebKeyboard.wkArray[container_id];
        if (wk._Callback) {
            wk._Callback(in_el.innerHTML, wk.Cntr.id);
            ++intCaretPos;
        }
    },

    Close: function (event) {
        document.getElementById("cbWebKeyboard").checked = false;
        //SwitchWebKeyboard();
        WebKeyboard.Hide();
    },

    Clear: function (event) {
        currentElement.value = "";
        WebKeyboard.SetRange(currentElement, 0, 0);
    },

    Backspace: function (event) {
        if (!currentElement.value.length) {
            WebKeyboard.SetRange(currentElement, 0, 0);
        }
        else {
            var span = null;

            if (document.selection)
                span = document.selection.createRange().duplicate();

            if (span && span.text.length > 0) {
                span.text = "";
                WebKeyboard.GetCaretPositions(currentElement);
            }
            else
                WebKeyboard.DeleteAtCaret(currentElement);
        }
    },

    CapsLock: function (event) {
        intCharCase = !intCharCase;

        if (intCharCase == 0) {
            WebKeyboard.ShiftObjects(arrLowercaseChars, intPreviousShiftSize);
        }
        else {
            WebKeyboard.ShiftObjects(arrUppercaseChars, intPreviousShiftSize);
        }
        for (var i = 0; i < arrShifted.length; ++i) {
            arrKeys[i].innerHTML = arrShifted[i];
        }

        WebKeyboard.SetRange(currentElement, intInsertionS, intInsertionE);
    },

    RegisterElement: function (elmID) {
        if (document.getElementById(elmID) == null)
            return;
        var element = document.getElementById(elmID);
        var funcOldEvent = element.onkeyup;
        element.onkeyup = function () {
            WebKeyboard.GetCaretPositions(element);
            if (typeof funcOldEvent == "function")
                funcOldEvent();
        };
        var funcOldEvent1 = element.onmouseup;
        element.onmouseup = function () {
            WebKeyboard.GetCaretPositions(element);
            if (typeof funcOldEvent1 == "function")
                funcOldEvent1();
        };
        var funcOldEvent2 = element.onfocus;
        element.onfocus = function () {
            WebKeyboard.FocusInit(element);
            if (typeof funcOldEvent2 == "function")
                funcOldEvent2();
        };

    },

    SetKeyboardPosition: function (p_intX, p_intY) {
        document.getElementById("divWebKeyboard").style.left = p_intX + "px";
        document.getElementById("divWebKeyboard").style.top = p_intY + "px";
    },

    SetKeyboardStyle: function (p_strStyle) {
        document.getElementById("divWebKeyboard").setAttribute("style", p_strStyle)
        document.getElementById("divWebKeyboard").style.cssText = p_strStyle;
    },

    // p_strElementIDs: the textbox controls to be set assocated with WebKeyboard
    // p_intX: the starting left (x-axis)
    // p_intY: the starting top (y-axis)
    Init: function (p_strElementIDs, p_intX, p_intY) {

        if (typeof _WK_StringTable != "object") { alert("String Table is null for WebKeyboard.js!"); return; }
        // make sure the WebKeyboard layer exists.  If not, then create one!
        if (document.getElementById("divWebKeyboard") == null) {
            document.getElementById("divWebKeyboardBase").innerHTML = '<div id="divWebKeyboard" style="color:White; display:none;"></div>';
        }

        if (document.getElementById("cbWebKeyboard") == null)
            return;

        if (document.getElementById("cbWebKeyboard") != null) {
            if (typeof readCookie == "function" && readCookie("cbWebKeyboard") == "checked") {
                document.getElementById("cbWebKeyboard").checked = true;
                document.getElementById("divWebKeyboard").style.display = "block";
                //alert("block display");
            }
            else {
                document.getElementById("cbWebKeyboard").checked = false;
            }
            SwitchWebKeyboard();        // check cbWebKeyboard checkbox is checked.  If checked, SwitchWebKeyboard() will show up divWebKeyboard
        }

        // set the keyboard location on the screen
        WebKeyboard.SetKeyboardPosition(p_intX, p_intY);

        var iSetFocus = 0;
        var strElements = p_strElementIDs.split(",");
        var strElement = "";
        if (strElements.length > 0) {
            var iIndex = 0;
            for (var i = 0; i < strElements.length; i++) {
                strElement = strElements[i].replace(/^\s+|\s+$/g, "");   // use replace to trim out the left and right trailing space
                WebKeyboard.RegisterElement(strElement);

                // set the text input to focus when the page is loaded up.
                if (document.getElementById(strElement).value == "" && iSetFocus == 0) {
                    iIndex = i;
                    iSetFocus = 1;
                }
            }
            document.getElementById(strElements[iIndex]).focus();
        }
    }
};

function SwitchWebKeyboard() {
    // make sure the WebKeyboard layer and the WebKeyboard checkbox are there!!
    if (document.getElementById("divWebKeyboard") == null || document.getElementById("cbWebKeyboard") == null)
        return;

    if (document.getElementById("cbWebKeyboard").checked) {
        // make sure that the cookies-related functions are there!
        if (typeof createCookie == "function")
            createCookie("cbWebKeyboard", "checked", 365);
        WebKeyboard.Show();
    }
    else {
        // make sure that the cookies-related functions are there!
        if (typeof eraseCookie == "function")
            eraseCookie("cbWebKeyboard");
            document.getElementById("cbWebKeyboard").checked = false;
        WebKeyboard.Hide();
    }
}

eraseCookie("cbWebKeyboard");



