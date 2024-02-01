export const initCat = () => {
  // Initialize session
  function skipErrors(str) {
    var regex =
      /Minified|{"cancelled"|\[{}\]|did not complete loading|props cancelled|Script error|Abort fetching|INVALID_NAME/;
    return !regex.test(JSON.stringify(str));
  }
  function removeLongAlphanumericStrings(str) {
    return str.replace(/\b[a-zA-Z0-9]{41,}\b/g, "redacted");
  }

  function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  var sessionId = sessionStorage.getItem("999-sessionId");
  if (!sessionId) {
    sessionId = generateUUID();
    sessionStorage.setItem("999-sessionId", sessionId);
  }
  // Track Event
  function trackEvent(type, eventData) {
    if (!skipErrors(eventData.message)) {
      return;
    }
    var timestamp = +new Date();
    var base = {
      timestamp: 0,
      sessionId: "",
      user_agent: window.navigator.userAgent,
      type: "",
      url: window.location.href,
      message: "",
      filename: "",
      lineno: 0,
      tag: "",
      href: "",
      innerText: "",
      src: "",
      alt: "",
      aria_label: "",
      aria_labelledby: "",
    };
    var data = {
      ...base,
      timestamp: timestamp,
      sessionId: sessionId,
      type: type,
      ...eventData,
    };
    setTimeout(function () {
      try {
        fetch("https://traces.thesamuraico.com/in", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: removeLongAlphanumericStrings(JSON.stringify(data)),
        }).catch(function () {});
      } catch (e) {
        // no-op
      }
    }, 0);
  }
  trackEvent("navigation", {
    url: window.location.href,
  });
  // Override History API pushState method to track it
  var originalPushState = history.pushState;
  history.pushState = function (state, title, url) {
    trackEvent("navigation", {
      url: url,
    });
    return originalPushState.apply(this, arguments);
  };
  // Listen for navigation changes
  window.addEventListener("popstate", function (event) {
    trackEvent("navigation", {
      url: window.location.href,
    });
  });
  // Listen for hash changes
  window.addEventListener("hashchange", function (event) {
    trackEvent("navigation", {
      url: window.location.href,
    });
  });
  // Listen for errors
  window.addEventListener("error", function (event) {
    trackEvent("error", {
      message: JSON.stringify(event.message),
      filename: event.filename,
      lineno: event.lineno,
      url: window.location.href,
    });
  });
  // Listen for unhandled promise rejections
  window.addEventListener("unhandledrejection", function (event) {
    trackEvent("error", {
      message: JSON.stringify(event.reason),
      url: window.location.href,
    });
  });

  // Override console.error
  var originalConsoleError = console.error;
  console.error = function () {
    try {
      var fakeError = new Error("Captured by console.error override");
      var stack = fakeError.stack;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      trackEvent("error", {
        message: JSON.stringify(args),
        filename: stack,
        url: window.location.href,
      });
    } catch (e) {
      // no-op
    }
    originalConsoleError.apply(console, args);
  };
};
