(function () {
    if (!window.WebFont) {
        var wf = document.createElement('script');
        wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
            '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
        wf.type = 'text/javascript';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(wf, s);
    }
    
    window.onload = function(){
        WebFont.load({
            google: {
                families: ['Open+Sans:300,400,600:latin,cyrillic-ext']
            }
        });
    }    
})();