/* global document, location */

export const ez_consent = (() => {
  const mergeCssClassNames = (...classNames) => classNames.join(' ');
  const defaultOptions = {
    is_always_visible: false,
    privacy_url: '/privacy',
    more_button: {
      target_attribute: '_blank',
      is_consenting: true,
    },
    texts: {
      main: 'This website uses cookies & similar.',
      buttons: {
        ok: 'ok',
        more: 'more',
      },
    },
    css_classes: {
      container: 'cookie-consent',
      message_text: 'cookie-consent__text',
      buttons: {
        wrapper: 'cookie-consent__buttons',
        more: mergeCssClassNames(
          'cookie-consent__button',
          'cookie-consent__button--more',
          'cookie-consent__buttons-button', // Legacy (for backwards compatibility with ≤ 1.2.X)
          'cookie-consent__buttons__read-more', // Legacy (for backwards compatibility with ≤ 1.2.X)
        ),
        ok: mergeCssClassNames(
          'cookie-consent__button',
          'cookie-consent__button--ok',
          'cookie-consent__buttons-button', // Legacy (for backwards compatibility with ≤ 1.2.X)
          'cookie-consent__buttons__close', // Legacy (for backwards compatibility with ≤ 1.2.X)
        ),
      },
    },
  };
  const ui = (() => {
    const baseCssClassNames = {
      container: 'cookie-consent',
      hidden: mergeCssClassNames(
        'cookie-consent--hidden',
        'cookie-consent__hide', // Legacy (for backwards compatibility with ≤ 1.2.X)
      ),
    };
    const baseCss = `
      .${baseCssClassNames.container}   { z-index: 9999; }
      .${baseCssClassNames.hidden}      { display:none !important; }
    `;
    function initializeHtml(options) {
      return `
        <div class="${options.css_classes.container} ${baseCssClassNames.container} ${baseCssClassNames.hidden}">
          <div class="${options.css_classes.message_text}">${options.texts.main}</div>
          <div class="${options.css_classes.buttons.wrapper}">
            <div class="${options.css_classes.buttons.more}">
              <a href="${options.privacy_url}" target="${options.more_button.target_attribute}">${options.texts.buttons.more}</a>
            </div>
            <div class="${options.css_classes.buttons.ok}">${options.texts.buttons.ok}</div>
          </div>
        </div>
      `;
    }
    function getElements(options) {
      const selectElementByClassNames = (classNames) => {
        const elements = document.getElementsByClassName(classNames);
        if (!elements.length === 0) {
          throw new Error(`No elements found for query: ${classNames}`);
        }
        if (!elements.length > 1) {
          throw new Error(`Multiple elements found for query: ${classNames}`);
        }
        return elements[0];
      };
      return {
        container: selectElementByClassNames(options.css_classes.container),
        buttons: {
          more: selectElementByClassNames(options.css_classes.buttons.more),
          ok: selectElementByClassNames(options.css_classes.buttons.ok),
        },
      };
    }
    function registerClickHandler(element, handler) {
      element.addEventListener('click', () => {
        handler();
      });
    }
    return {
      injectHtmlAsync: (options) =>
        new Promise((resolve) => {
          const html = initializeHtml(options);
          document.addEventListener(
            'DOMContentLoaded', // Wait until "document.body" is ready to ensure this is the first element inserted
            () => {
              document.body.insertAdjacentHTML('afterbegin', html);
              resolve();
            },
          );
        }),
      injectCss: () => {
        const style = document.createElement('style');
        style.textContent = baseCss;
        document.head.append(style);
      },
      showElement: (options) => {
        getElements(options).container.classList.remove(...baseCssClassNames.hidden.split(' '));
      },
      delete: (options) => {
        getElements(options).container.remove();
      },
      onOkButtonClick: (options, handler) =>
        registerClickHandler(getElements(options).buttons.ok, handler),
      onReadMoreButtonClick: (options, handler) =>
        registerClickHandler(getElements(options).buttons.more, handler),
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
    ui.showElement(options);
    const setCookieAndDestroy = () => {
      consentCookies.setCookie();
      ui.delete(options);
    };
    ui.onOkButtonClick(options, setCookieAndDestroy);
    if (options.more_button.is_consenting) {
      ui.onReadMoreButtonClick(options, setCookieAndDestroy);
    }
  }
  function shouldShowBanner(options) {
    if (
      options.is_always_visible ||
      options.always_show /* for backwards compatibility in 1.X.X */
    ) {
      return true;
    }
    const queryParamToShow = 'force-consent';
    if (new RegExp(`[?&]${queryParamToShow}`).test(location.search)) {
      return true;
    }
    return !consentCookies.getCookie();
  }
  function fillDefaults(options) {
    return objectAssignRecursively(defaultOptions, options || {});
    function objectAssignRecursively(target, ...sources) {
      // This is implemented because `Object.assign does` not assign nested objects
      // `options = {...defaults, ...options}` works, but it is not supported in
      // older JavaScript versions:
      //  not polyfilled by closure compiler
      //  `babel-plugin-proposal-object-rest-spread` just runs `Object.assign` which
      //    does not work with nested objects
      sources.forEach((source) => {
        Object.keys(source).forEach((key) => {
          const sourceValue = source[key];
          const targetValue = target[key];
          target[key] =
            targetValue &&
            sourceValue &&
            typeof targetValue === 'object' &&
            typeof sourceValue === 'object'
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
