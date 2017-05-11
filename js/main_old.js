$(document).ready(function () {
    $.ajaxSetup({ cache: false });
    var imgCount, images, quotes;
    images = ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png", "9.png", "10.png", "11.png", "12.png", "13.png", "14.png", "15.png", "16.png", "17.png", "18.png", "19.png", "20.png", "21.png", "22.png"];
    quotes = [];
    function randItem(arr) {
        return Math.floor(Math.random()*(arr.length - 1) + 1);
    }
    function changeBG(){
        var isMatch = true;
        while (isMatch) {
            var newImgCount = randItem(images);
            if(newImgCount !== imgCount) isMatch = false;
        }
        $("#wrap").css("background", "url(/random-quote-machine/img/" + images[newImgCount] + ") center");
        imgCount = newImgCount;
    }

    function setQuote () {
        //alert("Вызвана функция setQuote. " + "Текст первой цитаты: " + quotes[0][0] + "Автор первой цитаты: " + quotes[0][1]);
        if(quotes[0][0]){
            var quoteText = quotes[0][0];
            $("#quote").text(quoteText);
            if (quotes[0][1]) {
                var quoteAuthor = quotes[0][1];
                $("#author").text(quoteAuthor);
            } else {
                $("#author").text("Unknown author");
            }
            quotes.shift();
        } else {
            getOneQuote();
            setQuote();
        }
        quotesFill();
    }

/* Старый запрос!!!
    function getOneQuote() {
        $.ajax({
            method: "GET",
            // url: 'http://cors.io/?http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en',
            url: 'http://cors.io/?http://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&lang=en&jsonp=parseQuote',
            cache: false,
            //success: alert("success!")
            //url: 'https://crossorigin.me/http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en',
        },parseQuote(data));
    }
*/

    function parseQuote(data){
        //alert("Вызвана функция parseQuote.");
        var t = "" + data['quoteText'];
        //alert("Текст цитаты: " + t);
        var a =  "" + data['quoteAuthor'];
        //alert("Автор цитаты: " + a);
        var q = [];
        q.push(t);
        q.push(a);
        //alert("Массив для пуша: " + q);
        quotes.push(q);
        /*
        alert("Первый элемент массива quotes: " + quotes[0]);
        alert("Текст первого элемента массива quotes: " + quotes[0][0]);
        alert("Автор первого элемента массива quotes: " + quotes[0][1]);
        */
    }

    function getOneQuote() {
        var callback = parseQuote;
        $.ajax(
            {
                url: "http://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&jsonp=?",
                // Tell jQuery we're expecting JSONP
                dataType: "jsonp",
                success: parseQuote
            }
        );
    }

    function quotesFill() {
        getOneQuote();
        if (quotes.length < 5) {
            setTimeout(quotesFill, 2000);
        }
    }

    var twitUrlBase = "https://twitter.com/intent/tweet";

    changeBG();
    getOneQuote();
    setTimeout(setQuote, 5000);
    //quotesFill();

    $("#next-btn").on("click", function(){
        changeBG();
        $("#quote-wrap").fadeOut(800);
        // Setting random quote
        setQuote();
        $("#quote-wrap").slideDown(800);
    });
    $("#twit-btn").on("click",function(){
        var twitUrlHash = "hashtags=quotes";
        var twitUrlText = 'text="' + $("#quote").text() + '" ' + $("#author").text();
        var twitUrl = twitUrlBase + "?" + twitUrlHash + "&" + twitUrlText;
        window.open(twitUrl);
        return false;
    });
});