export default `(function() {
            document.querySelector('head').innerHTML = document.querySelector('head').innerHTML + '<meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">';
            
            if (document.querySelector('.titre') && document.querySelector('form')) {
                
                var login = 'LOGIN';
                var password = 'PASSWORD';
                
                if (login !== 'LOGIN' && login != '') {
                    document.querySelector('input[name="login"]').value = login;
                    document.querySelector('input[name="password"]').value = password;
                    setTimeout(() => {
                        document.querySelector('form').submit();
                    },  400);

                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        page: 'login_submit_form',
                    }));
                } else {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        page: 'login',
                    }));
                }
            }
           
            
            if (document.querySelector('frame[name="menu"]').contentDocument.querySelector('.erreur') && document.querySelector('frame[name="menu"]').contentDocument.querySelector('.erreur').innerText !== '') {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        error: document.querySelector('frame[name="menu"]').contentDocument.querySelector('.erreur').innerText,
                        page: 'home',
                    }));
            }
            
            if (document.querySelector('frame[name="menu"]') && document.querySelector('frame[name="menu"]').contentDocument.querySelector('a[href="JavaScript:jouer()"]')) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    page: 'home',
                }));
                document.querySelector('frame[name="menu"]').contentDocument.querySelector('a[href="JavaScript:jouer()"]').click();
            }


            if (document.querySelector('*[name="pere"]')) {
                document.querySelector('*[name="pere"]').cols="*";
                document.querySelector('*[name="pere"]').rows="100,100";
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    page: 'jeu',
                    name: getName(),
                    papv: getPAPV(),
                }));
            }

            function getPAPV() {
                return document.querySelector('frameset[name="pere"] frameset#pere3 frame[name="pager"]').contentDocument.querySelector('.pagertext').innerText;
            }
            
            function getName() {
                return document.querySelector('frame[name="menu"]').contentDocument.querySelector('.VNT').innerText;
            }
})();`