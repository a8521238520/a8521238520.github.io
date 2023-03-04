    var countDown = 10;
    var countdownEl = document.getElementById("countdown");
    var countdownInterval = setInterval(function() {
        if (countDown > 0) {
        countdownEl.innerHTML =  + countDown + " 秒" + " 重新載入";
        countDown--;
        } else {
        clearInterval(countdownInterval);
        countdownEl.innerHTML = "載入中";
        }
    }, 1000);
