/**
 * Created by Artyom Kochetkoff on 17.01.2017.
 */
$(document).ready(function () {
    $.ajaxSetup({ cache: false });
    var imgCount, images, quotes;
    images = [
        "https://raw.githubusercontent.com/kochetkoff/rqm/master/img/1.png",
        "https://raw.githubusercontent.com/kochetkoff/rqm/master/img/2.png",
        "https://raw.githubusercontent.com/kochetkoff/rqm/master/img/3.png",
        "https://raw.githubusercontent.com/kochetkoff/rqm/master/img/4.png",
        "https://raw.githubusercontent.com/kochetkoff/rqm/master/img/5.png",
        "https://raw.githubusercontent.com/kochetkoff/rqm/master/img/6.png",
        "https://raw.githubusercontent.com/kochetkoff/rqm/master/img/7.png",
        "https://raw.githubusercontent.com/kochetkoff/rqm/master/img/8.png",
        "https://raw.githubusercontent.com/kochetkoff/rqm/master/img/9.png",
        "https://raw.githubusercontent.com/kochetkoff/rqm/master/img/10.png",
        "https://raw.githubusercontent.com/kochetkoff/rqm/master/img/11.png",
        "https://raw.githubusercontent.com/kochetkoff/rqm/master/img/12.png",
        "https://raw.githubusercontent.com/kochetkoff/rqm/master/img/13.png",
        "https://raw.githubusercontent.com/kochetkoff/rqm/master/img/14.png",
        "https://raw.githubusercontent.com/kochetkoff/rqm/master/img/15.png",
        "https://raw.githubusercontent.com/kochetkoff/rqm/master/img/16.png",
        "https://raw.githubusercontent.com/kochetkoff/rqm/master/img/17.png",
        "https://raw.githubusercontent.com/kochetkoff/rqm/master/img/18.png",
        "https://raw.githubusercontent.com/kochetkoff/rqm/master/img/19.png",
        "https://raw.githubusercontent.com/kochetkoff/rqm/master/img/20.png",
        "https://raw.githubusercontent.com/kochetkoff/rqm/master/img/21.png",
        "https://raw.githubusercontent.com/kochetkoff/rqm/master/img/22.png"
    ];
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
        $("#wrap").css("background", "url(" + images[newImgCount] + ") center");
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
                url: "https://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&lang=en&jsonp=?",
                // Tell jQuery we're expecting JSONP
                dataType: "jsonp",
                error: console.log('There was an error getting ajax response'),
                success: parseQuote
            }
        );
    }
    function quotesFill() {
        getOneQuote();
        setTimeout(function() {
            if (quotes.length < 5) {
                quotesFill();
            }
        }, 1000);
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