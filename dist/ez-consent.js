const ez_consent = (() => {
  const mergeCssClassNames = (...classNames) => classNames.join(" ");
  const defaultOptions = {
    is_always_visible: false,
    privacy_url: "/privacy",
    enable_google_consent_mode: false,
    consent_duration: "P10Y",
    more_button: {
      target_attribute: "_blank",
      is_consenting: true
    },
    texts: {
      main: "This website uses cookies & similar.",
      buttons: {
        ok: "ok",
        more: "more"
      }
    },
    css_classes: {
      container: "cookie-consent",
      message_text: "cookie-consent__text",
      buttons: {
        wrapper: "cookie-consent__buttons",
        more: mergeCssClassNames(
          "cookie-consent__button",
          "cookie-consent__button--more",
          "cookie-consent__buttons-button",
          // Legacy (for backwards compatibility with ≤ 1.2.X)
          "cookie-consent__buttons__read-more"
          // Legacy (for backwards compatibility with ≤ 1.2.X)
        ),
        ok: mergeCssClassNames(
          "cookie-consent__button",
          "cookie-consent__button--ok",
          "cookie-consent__buttons-button",
          // Legacy (for backwards compatibility with ≤ 1.2.X)
          "cookie-consent__buttons__close"
          // Legacy (for backwards compatibility with ≤ 1.2.X)
        )
      }
    }
  };
  const ui = (() => {
    const baseCssClassNames = {
      container: "cookie-consent",
      hidden: mergeCssClassNames(
        "cookie-consent--hidden",
        "cookie-consent__hide"
        // Legacy (for backwards compatibility with ≤ 1.2.X)
      )
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
        if (elements.length === 0) {
          throw new Error(`No elements found for query: ${classNames}`);
        }
        if (elements.length > 1) {
          throw new Error(`Multiple elements found for query: ${classNames}`);
        }
        return elements[0];
      };
      return {
        container: selectElementByClassNames(options.css_classes.container),
        buttons: {
          more: selectElementByClassNames(options.css_classes.buttons.more),
          ok: selectElementByClassNames(options.css_classes.buttons.ok)
        }
      };
    }
    function registerClickHandler(element, handler) {
      element.addEventListener("click", () => {
        handler();
      });
    }
    return {
      injectHtmlAsync: (options) => new Promise((resolve) => {
        const html = initializeHtml(options);
        document.addEventListener(
          "DOMContentLoaded",
          // Wait until "document.body" is ready to ensure this is the first element inserted
          () => {
            document.body.insertAdjacentHTML("afterbegin", html);
            resolve();
          }
        );
      }),
      injectCss: () => {
        const style = document.createElement("style");
        style.textContent = baseCss;
        document.head.append(style);
      },
      showElement: (options) => {
        getElements(options).container.classList.remove(...baseCssClassNames.hidden.split(" "));
      },
      delete: (options) => {
        getElements(options).container.remove();
      },
      onOkButtonClick: (options, handler) => registerClickHandler(getElements(options).buttons.ok, handler),
      onReadMoreButtonClick: (options, handler) => registerClickHandler(getElements(options).buttons.more, handler)
    };
  })();
  const consentCookies = /* @__PURE__ */ (() => {
    const consentCookieName = "cookie-consent";
    function parseISO8601DurationToDate(duration) {
      if (!duration || typeof duration !== "string") {
        throw new Error(`Expected ISO-8601 duration string, got ${typeof duration}: ${duration}`);
      }
      if (!duration.startsWith("P")) {
        throw new Error(`Invalid ISO-8601 duration: Missing 'P' at start: ${duration}`);
      }
      if (duration.toUpperCase() !== duration) {
        throw new Error(`Invalid ISO-8601 duration: Must use uppercase letters only: ${duration}`);
      }
      duration = duration.substring(1);
      let hasSeenT = false;
      let currentNumberText = "";
      let isDateExtracted = false;
      const date = /* @__PURE__ */ new Date();
      const unitHandlers = {
        Y: (value) => date.setFullYear(date.getFullYear() + value),
        M: (value) => {
          if (hasSeenT) {
            date.setMinutes(date.getMinutes() + value);
            return;
          }
          date.setMonth(date.getMonth() + value);
        },
        W: (value) => date.setDate(date.getDate() + value * 7),
        D: (value) => date.setDate(date.getDate() + value),
        H: (value) => date.setHours(date.getHours() + value),
        S: (value) => date.setSeconds(date.getSeconds() + value)
      };
      for (const char of duration) {
        if (char === "T") {
          hasSeenT = true;
          if (currentNumberText) {
            throw Error(`Number ${currentNumberText} without unit before T in duration text: ${duration}`);
          }
          continue;
        } else if (char === "," || char === ".") {
          throw new Error(`Decimal values are not supported in ISO-8601 durations: "${char}" in "${duration}"`);
        } else if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(char)) {
          currentNumberText += char;
          continue;
        } else if (currentNumberText) {
          const value = parseFloat(currentNumberText);
          const handler = unitHandlers[char];
          if (handler) {
            unitHandlers[char](value);
            isDateExtracted = true;
            currentNumberText = "";
            continue;
          }
        }
        throw new Error(`Invalid character '${char}' in ISO-8601 duration. Expected Y, M, W, D, H, or S designators: ${duration}`);
      }
      if (!isDateExtracted) {
        throw new Error(`Invalid ISO-8601 duration: No valid duration components (Y, M, W, D, H, S) found in: ${duration}`);
      }
      return date;
    }
    const getCookie = () => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${consentCookieName}=`);
      if (parts.length === 2) {
        return parts.pop().split(";").shift();
      }
      return void 0;
    };
    const setCookie = (options) => {
      const cookieParts = [];
      cookieParts.push(`${consentCookieName}=dismissed`);
      const date = parseISO8601DurationToDate(options.consent_duration);
      cookieParts.push(`expires=${date.toUTCString()}`);
      cookieParts.push("path=/");
      cookieParts.push(`domain=${location.hostname.replace(/^www\./i, "")}`);
      const cookie = `${cookieParts.join("; ")};`;
      document.cookie = cookie;
    };
    return {
      getCookie,
      setCookie
    };
  })();
  const googleConsent = /* @__PURE__ */ (() => {
    const pingGoogle = (consent_arg) => {
      function gtag() {
        window.dataLayer.push(arguments);
      }
      gtag("consent", consent_arg, {
        // Parameters: https://web.archive.org/web/20250228172407/https://support.google.com/tagmanager/answer/13802165?hl=en
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
        analytics_storage: "granted",
        functionality_storage: "granted",
        personalization_storage: "granted",
        security_storage: "granted"
      });
    };
    return {
      // Guidance:
      initialize: (options) => {
        if (!options.enable_google_consent_mode) {
          return;
        }
        window.dataLayer = window.dataLayer || [];
        if (isConsentGranted()) {
          pingGoogle("update");
        } else {
          pingGoogle("default");
        }
      },
      notifyConsentGranted: (options) => {
        if (!options.enable_google_consent_mode) {
          return;
        }
        pingGoogle("update");
      }
    };
  })();
  function onUserConsentGranted(options) {
    consentCookies.setCookie(options);
    ui.delete(options);
    googleConsent.notifyConsentGranted(options);
  }
  async function onInitialization(options) {
    googleConsent.initialize(options);
    if (shouldShowBanner(options)) {
      await initializeUi(options);
    }
  }
  async function initializeUi(options) {
    await ui.injectHtmlAsync(options);
    ui.injectCss();
    ui.showElement(options);
    ui.onOkButtonClick(options, () => {
      onUserConsentGranted(options);
    });
    if (options.more_button.is_consenting) {
      ui.onReadMoreButtonClick(options, () => {
        onUserConsentGranted(options);
      });
    }
  }
  function shouldShowBanner(options) {
    if (options.is_always_visible || options.always_show) {
      return true;
    }
    const queryParamToShow = "force-consent";
    if (new RegExp(`[?&]${queryParamToShow}`).test(location.search)) {
      return true;
    }
    return !isConsentGranted();
  }
  function isConsentGranted() {
    const cookie = consentCookies.getCookie();
    return cookie !== void 0;
  }
  function fillDefaults(options) {
    return objectAssignRecursively(defaultOptions, options || {});
    function objectAssignRecursively(target, ...sources) {
      sources.forEach((source) => {
        Object.keys(source).forEach((key) => {
          const sourceValue = source[key];
          const targetValue = target[key];
          target[key] = targetValue && sourceValue && typeof targetValue === "object" && typeof sourceValue === "object" ? objectAssignRecursively(targetValue, sourceValue) : sourceValue;
        });
      });
      return target;
    }
  }
  async function initializeAsync(options) {
    const completeOptions = fillDefaults(options);
    await onInitialization(completeOptions);
  }
  return {
    init: (options) => initializeAsync(options)
  };
})();
