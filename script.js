// 設定倒數計時的目標日期和時間
var countDownDate = new Date("Mar 5, 2023 12:00:00").getTime();

// 更新倒數計時
var x = setInterval(function() {
    // 現在的日期和時間
    var now = new Date().getTime();

    // 距離目標日期和時間的毫秒數
    var distance = countDownDate - now;

    // 計算天、小時、分鐘和秒數
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

// 在網頁
