/**
 * Created by Artyom Kochetkoff on 17.01.2017.
 */
$(document).ready(function () {
    $.ajaxSetup({ cache: false });
    var imgCount, images, quotes;
    images = ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png", "9.png", "10.png", "11.png", "12.png", "13.png", "14.png", "15.png", "16.png", "17.png", "18.png", "19.png", "20.png", "21.png", "22.png"];
    quotes = [];
    function randItem(arr) {
        return Math.floor(Math.random()*arr.length);
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
    function parseQuote(data){
        var t = "" + data['quoteText'];
        var a = "" + data['quoteAuthor'];
        var q = [];
        q.push(t, a);
        quotes.push(q);
    }
    function getOneQuote() {
        $.ajax(
            {
                url: "http://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&lang=en&jsonp=?",
                // Tell jQuery we're expecting JSONP
                dataType: "jsonp",
                error: console.log('There was an error getting ajax response'),
                success: parseQuote
            }
        );
    }
    function quotesFill() {
        getOneQuote();
        if (quotes.length < 5) {
            setTimeout(quotesFill, 1000);
        }
    }
    var twitUrlBase = "https://twitter.com/intent/tweet";
    changeBG();
    getOneQuote();
    setTimeout(setQuote, 1000);

    $("#next-btn").on("click", function(){
        $("#next-btn").addClass('disabled').attr("disabled", "disabled");
        changeBG();
        $("#quote-wrap").fadeOut(400).slideDown(1200);
        // Setting random quote
        setTimeout(setQuote, 400);
        setTimeout(function(){
            $("#next-btn").removeClass('disabled').removeAttr("disabled");
        }, 2000);
    });
    $("#twit-btn").on("click",function(){
        var twitUrlHash = "hashtags=quotes";
        var twitUrlText = "text=" + $("#quote").text().trim() + " - " + $("#author").text();
        var twitUrl = twitUrlBase + "?" + twitUrlHash + "&" + twitUrlText;
        window.open(twitUrl);
        return false;
    });
});