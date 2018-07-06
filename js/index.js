loading = {
    step: 0,
    progress: function (a) {
        var b = this,
        c = setInterval(function () {
            b.step >= a ? clearInterval(c) : (b.step++, b.step = 100 < b.step ? 100 : b.step, $("#loadnum").text(b.step ));
            100 <= b.step && (clearInterval(c), $("#loadbtn").fadeIn(0.2))
        },
        3)
    },
    init: function () {
        var a = 0,
        b = 0,
        c = this,
        d = function (a, b) {
            var c = new Image,
            d = a.attr("lazysrc");
            c.src = d;
            c.complete ? (a.prop("src", d), b(a)) : (c.onload = function () {
                a.prop("src", d);
                b(a)
            },
            c.onerror = function () {
                a.prop("src", d);
                b(a)
            })
        },
        f = function () {
            a++;
            b = parseInt(a);
            c.progress(8 * b)
        };
        $("img").each(function () {
            d($(this), f)
        });
        var e = 0;
        $("video").each(function () {
            $(this).one("canplaythrough",
            function () {
                e++;
                5 <= e && c.progress(100)
            })
        });
        window.onload = function () {
            c.progress(100)
        }
    }
};
loading.init();
var vp = document.getElementById('v1');
var bmessage = document.getElementById('b_message')
var aud = document.getElementById('Jaudio')
var bcontimg = document.getElementById('b_cont_img')
var bmessage2 = document.getElementsByClassName('b_message')[0]
var btitle = document.getElementsByClassName('b_title')[0]
var bbtn = document.getElementsByClassName('b_btn')[0]








