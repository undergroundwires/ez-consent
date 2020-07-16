/*
    Usage:
            ez_consent.init();
        OR
            ez_consent.init(
            {
                always_show: false          // Always shows banner on load, default: false
                privacy_url: "/privacy",    // URL that "more" button goes to,  default: "/privacy/"
                target_attribute : "_blank" // Determines what the behavior of the 'more' button is, default: "_blank", opens the privacy page in a new tab
                texts: {
                main: "We use cookies",     // The text that's shown on the banner, default: "This website uses cookies & similar."
                buttons:
                {
                    ok: "ok",               // OK button to hide the text, default: "ok"
                    more: "more"            // More button that shows the privacy policy, default "more"
                }
                }
            });
*/
export const ez_consent = (() => {
    const ui = (() => {
        const cssClassNames = {
            root: "cookie-consent",
            hide: "cookie-consent__hide",
            button: "cookie-consent__buttons-button"
        }
        const consentHtml = `
            <div class="${cssClassNames.root} ${cssClassNames.hide}">
                <div class="cookie-consent__text">{main}</div>
                <div class="cookie-consent__buttons">
                    <div class="${cssClassNames.button} cookie-consent__buttons__read-more"><a href="{privacy_url}" target="{target_attribute}">{more}</a></div>
                    <div class="${cssClassNames.button} cookie-consent__buttons__close">{ok}</div>
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
                buttons: document.querySelectorAll(`.${cssClassNames.button}`)
            };
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
            onClick: (handler) => {
                for(const button of getElements().buttons) {
                    button.addEventListener('click', () => {
                        handler();
                    });
                }
            }
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
        ui.onClick(() => {
            consentCookies.setCookie();
            ui.delete();
        });
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
        options = options || {};
        options.privacy_url = options.privacy_url || "/privacy";
        options.texts = options.texts || {};
        options.texts.main = options.texts.main || "This website uses cookies & similar.";
        options.texts.buttons = options.texts.buttons || {};
        options.texts.buttons.more = options.texts.buttons.more || "More";
        options.texts.buttons.ok = options.texts.buttons.ok || "OK";
        options.target_attribute = options.target_attribute || "_blank";
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