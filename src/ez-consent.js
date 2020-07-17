export const ez_consent = (() => {
    const ui = (() => {
        const cssClassNames = {
            root: "cookie-consent",
            hide: "cookie-consent__hide",
            buttons: {
                shared: "cookie-consent__buttons-button",
                read_more: "cookie-consent__buttons__read-more",
                ok: "cookie-consent__buttons__close",
            }
        }
        const consentHtml = `
            <div class="${cssClassNames.root} ${cssClassNames.hide}">
                <div class="cookie-consent__text">{main}</div>
                <div class="cookie-consent__buttons">
                    <div class="${cssClassNames.button} ${cssClassNames.buttons.read_more}"><a href="{privacy_url}" target="{target_attribute}">{more}</a></div>
                    <div class="${cssClassNames.button} ${cssClassNames.buttons.ok}">{ok}</div>
                </div>
            </div>
        `;
        const consentCss = `.cookie-consent         { z-index: 9999; }
                            .cookie-consent__hide   { display:none !important; }`;
        function initializeHtml(options) {
            return consentHtml
                .replace("{main}", options.texts.main)
                .replace("{more}", options.texts.buttons.more)
                .replace("{ok}", options.texts.buttons.ok)
                .replace("{privacy_url}", options.privacy_url)
                .replace("{target_attribute}", options.target_attribute);
        }
        function getElements() {
            return {
                root: document.querySelector(`.${cssClassNames.root}`),
                buttons: {
                    read_more: document.querySelector(`.${cssClassNames.buttons.read_more}`),
                    ok: document.querySelector(`.${cssClassNames.buttons.ok}`)
                }
            };
        }
        function registerClickHandler(element, handler) {
            element.addEventListener('click', () => {
                handler();
            });
        }
        return {
            injectHtmlAsync: (options) => new Promise((resolve) => {
                const html = initializeHtml(options);
                document.addEventListener("DOMContentLoaded",  // Wait until "document.body" is ready so we make sure we're first element
                    () => {
                        document.body.insertAdjacentHTML('afterbegin', html);
                        resolve();
                    });
            }),
            injectCss: () => {
                const style = document.createElement('style');
                style.textContent = consentCss;
                document.head.append(style);
            },
            showElement: () => {
                getElements().root.classList.remove(cssClassNames.hide);
            },
            delete: () => {
                getElements().root.remove();
            },
            onOkButtonClick: (handler) => registerClickHandler(getElements().buttons.ok, handler),
            onReadMoreButtonClick: (handler) => registerClickHandler(getElements().buttons.read_more, handler),
        }
    })();
    const consentCookies = (() => {
        const consentCookieName = "cookie-consent";
        const getCookie = () => {
            const value = "; " + document.cookie;
            const parts = value.split("; " + consentCookieName + "=");
            if (parts.length === 2) {
                return parts.pop().split(";").shift();
            }
        }
        const setCookie = () => {
            const cookieParts = [];
            cookieParts.push(consentCookieName + "=dismissed");
            const date = new Date();
            date.setFullYear(date.getFullYear() + 10);
            cookieParts.push("expires=" + date.toUTCString());
            cookieParts.push("path=/");
            cookieParts.push("domain=" + location.hostname.replace(/^www\./i, ""));
            const cookie = cookieParts.join('; ') + ';';
            document.cookie = cookie;
        }
        return { 
            getCookie: getCookie,
            setCookie: setCookie
        }
    })();

    async function initializeUiAsync(options) {
        await ui.injectHtmlAsync(options);
        ui.injectCss();
        ui.showElement();
        const setCookieAndDestroy = () => {
            consentCookies.setCookie();
            ui.delete();
        }
        ui.onOkButtonClick(setCookieAndDestroy);
        if(options.more_button_gives_consent) {
            ui.onReadMoreButtonClick(setCookieAndDestroy);
        }
    }

    function shouldShowBanner(options) {
        if(options.always_show) {
            return true;
        }
        const queryParamToShow = "force-consent";
        if(new RegExp('[?&]' + queryParamToShow).test(location.search)) {
            return true;
        }
        return !consentCookies.getCookie();
    }

    function fillDefaults(options) {
        const isBoolean = val => 'boolean' === typeof val;
        options = options || {};
        options.privacy_url = options.privacy_url || "/privacy";
        options.texts = options.texts || {};
        options.texts.main = options.texts.main || "This website uses cookies & similar.";
        options.texts.buttons = options.texts.buttons || {};
        options.texts.buttons.more = options.texts.buttons.more || "More";
        options.texts.buttons.ok = options.texts.buttons.ok || "OK";
        options.target_attribute = options.target_attribute || "_blank";
        options.more_button_gives_consent = isBoolean(options.more_button_gives_consent) ? options.more_button_gives_consent : true;
        return options;
    }

    async function initializeAsync(options) {
        options = fillDefaults(options);
        if (shouldShowBanner(options)) {
            await initializeUiAsync(options);
        }
    }

    return {
        init: (options) => initializeAsync(options)
    }
})();