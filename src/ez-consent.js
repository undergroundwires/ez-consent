/* eslint-disable import/prefer-default-export, no-restricted-globals */

export const ez_consent = (() => { // eslint-disable-line camelcase
  const defaults = {
    is_always_visible: false,
    privacy_url: '/privacy',
    more_button: {
      target_attribute: '_blank',
      is_consenting: true,
    },
    texts: {
      main: 'This website uses cookies & similar.',
      buttons:
          {
            ok: 'ok',
            more: 'more',
          },
    },
  };
  const ui = (() => {
    const cssClassNames = {
      root: 'cookie-consent',
      hide: 'cookie-consent__hide',
      buttons: {
        shared: 'cookie-consent__buttons-button',
        read_more: 'cookie-consent__buttons__read-more',
        ok: 'cookie-consent__buttons__close',
      },
    };
    const consentHtml = `
            <div class="${cssClassNames.root} ${cssClassNames.hide}">
                <div class="cookie-consent__text">{main}</div>
                <div class="cookie-consent__buttons">
                    <div class="${cssClassNames.buttons.shared} ${cssClassNames.buttons.read_more}"><a href="{privacy_url}" target="{target_attribute}">{more}</a></div>
                    <div class="${cssClassNames.buttons.shared} ${cssClassNames.buttons.ok}">{ok}</div>
                </div>
            </div>
        `;
    const consentCss = `.cookie-consent         { z-index: 9999; }
                            .cookie-consent__hide   { display:none !important; }`;
    function initializeHtml(options) {
      return consentHtml
        .replace('{main}', options.texts.main)
        .replace('{more}', options.texts.buttons.more)
        .replace('{ok}', options.texts.buttons.ok)
        .replace('{privacy_url}', options.privacy_url)
        .replace('{target_attribute}', options.more_button.target_attribute);
    }
    function getElements() {
      return {
        root: document.querySelector(`.${cssClassNames.root}`),
        buttons: {
          read_more: document.querySelector(`.${cssClassNames.buttons.read_more}`),
          ok: document.querySelector(`.${cssClassNames.buttons.ok}`),
        },
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
        document.addEventListener(
          'DOMContentLoaded', // Wait until "document.body" is ready so we make sure we're first element
          () => {
            document.body.insertAdjacentHTML('afterbegin', html);
            resolve();
          },
        );
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
      onOkButtonClick:
        (handler) => registerClickHandler(getElements().buttons.ok, handler),
      onReadMoreButtonClick:
        (handler) => registerClickHandler(getElements().buttons.read_more, handler),
    };
  })();
  const consentCookies = (() => {
    const consentCookieName = 'cookie-consent';
    const getCookie = () => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${consentCookieName}=`);
      if (parts.length === 2) {
        return parts.pop().split(';').shift();
      }
      return undefined;
    };
    const setCookie = () => {
      const cookieParts = [];
      cookieParts.push(`${consentCookieName}=dismissed`);
      const date = new Date();
      date.setFullYear(date.getFullYear() + 10);
      cookieParts.push(`expires=${date.toUTCString()}`);
      cookieParts.push('path=/');
      cookieParts.push(`domain=${location.hostname.replace(/^www\./i, '')}`);
      const cookie = `${cookieParts.join('; ')};`;
      document.cookie = cookie;
    };
    return {
      getCookie,
      setCookie,
    };
  })();
  async function initializeUiAsync(options) {
    await ui.injectHtmlAsync(options);
    ui.injectCss();
    ui.showElement();
    const setCookieAndDestroy = () => {
      consentCookies.setCookie();
      ui.delete();
    };
    ui.onOkButtonClick(setCookieAndDestroy);
    if (options.more_button.is_consenting) {
      ui.onReadMoreButtonClick(setCookieAndDestroy);
    }
  }
  function shouldShowBanner(options) {
    if (options.is_always_visible
            || options.always_show /* for backwards compatibility in 1.X.X */) {
      return true;
    }
    const queryParamToShow = 'force-consent';
    if (new RegExp(`[?&]${queryParamToShow}`).test(location.search)) {
      return true;
    }
    return !consentCookies.getCookie();
  }
  function fillDefaults(options) {
    return objectAssignRecursively(defaults, options || {});
    function objectAssignRecursively(target, ...sources) {
      // Implemented because Object.assign does not assign nested objects
      // options = {...defaults, ...options} works but it's not supported in older JS:
      //  not polyfilled by closure compiler
      //  babel-plugin-proposal-object-rest-spread just runs Object.assign which
      //    does not work with nested objects
      sources.forEach((source) => {
        Object.keys(source).forEach((key) => {
          const sourceValue = source[key];
          const targetValue = target[key];
          // eslint-disable-next-line no-param-reassign
          target[key] = targetValue && sourceValue && typeof targetValue === 'object' && typeof sourceValue === 'object'
            ? objectAssignRecursively(targetValue, sourceValue)
            : sourceValue;
        });
      });
      return target;
    }
  }
  async function initializeAsync(options) {
    const completeOptions = fillDefaults(options);
    if (shouldShowBanner(completeOptions)) {
      await initializeUiAsync(completeOptions);
    }
  }
  return {
    init: (options) => initializeAsync(options),
  };
})();
