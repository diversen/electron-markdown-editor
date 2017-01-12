Uncaught Exception:

Error: Attempting to call a function in a renderer window that has been closed or released. Function provided here: undefined.
https://github.com/electron/electron/issues/3778

Check if file exists before trying to open it

~~~js
var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();


$(document).ready(function () {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    $('.markdown').keyup(function () {
        delay(function () {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        }, 2000);
    });
});
~~~

