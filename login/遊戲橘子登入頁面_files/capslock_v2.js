
/***************************************
darren wu 20090508
Achtung: Only one target can be used in one page
***************************************/

var _capslockv2_target = "";
var _capslockv2_floatWarning = "";
var _capslock_timeout_id = null;

var CapsLockV2 = {

  Init : function(targetID, floatWarningID, shiftX, shiftY) {
    //set object to variance
    _capslockv2_target = document.getElementById(targetID);
    _capslockv2_floatWarning = document.getElementById(floatWarningID);

    //set position
    var obj = _capslockv2_target;
    var curleft = curtop = 0;
    if (obj.offsetParent) {
      do {
        curleft += obj.offsetLeft;
        curtop += obj.offsetTop;
      } while (obj = obj.offsetParent);
    }
	_capslockv2_floatWarning.style.left = (curleft + shiftX) + "px";
	_capslockv2_floatWarning.style.top = (curtop + shiftY) + "px";
	_capslockv2_floatWarning.style.display = "none";

	//set event
	_capslockv2_target.onkeypress = this.PressKey;
	
  },
  
  PressKey: function(ev) {
      if (!ev) ev = window.event;
      var targ = ev.target ? ev.target : ev.srcElement;
      // get key pressed
      var which = -1;
      if (ev.which) {
        which = ev.which;
      } else if (ev.keyCode) {
        which = ev.keyCode;
      }
      // get shift status
      var shift_status = false;
      if (ev.shiftKey) {
        shift_status = ev.shiftKey;
      } else if (ev.modifiers) {
        shift_status = !!(ev.modifiers & 4);
      }
      if (((which >= 65 && which <=  90) && !shift_status) ||
          ((which >= 97 && which <= 122) && shift_status)) {
        if (_capslockv2_floatWarning.style.display == "block") return;  
        _capslockv2_floatWarning.style.display = "block"; // uppercase, no shift key
        _capslock_timeout_id = window.setTimeout("_capslockv2_floatWarning.style.display = 'none';", 5000);
      } else {
        if (_capslock_timeout_id) { window.clearTimeout(_capslock_timeout_id); _capslock_timeout_id = null;}
        _capslockv2_floatWarning.style.display = "none";
      }
  }
}