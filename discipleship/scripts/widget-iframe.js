/**
 * Growing Together widget iframe host for ENG-003.
 * Guards document readiness, measures content, and disconnects observers.
 * Works in the browser (global GrowingTogetherWidgetIframe) and in Node tests.
 * Keep this file free of credentials and real learner answers.
 */
(function (root, factory) {
    var api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }
    root.GrowingTogetherWidgetIframe = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    var DEFAULT_TITLE = 'Lesson widget';
    var MIN_MEASURED_HEIGHT = 50;
    var KNOWN_TITLES = {
        'apest-rating.html': 'APEST Self-Rating',
        'armor-of-god.html': 'Put on the Armor of God',
        'bible-bookshelf.html': 'Bible Bookshelf Widget',
        'biblical-storyline.html': 'The Biblical Storyline',
        'biblical-timeline.html': 'The Biblical Timeline',
        'cornerstone.html': 'Five Stones of a Life of Faith',
        'deep-roots.html': 'Roots of Discipline',
        'five-gardeners.html': 'Five Farmers, One Field',
        'fruit-of-spirit.html': 'The Fruit of the Spirit',
        'grace-diagram.html': 'The Grace and Mercy Cycle',
        'great-command.html': 'The Great Command',
        'great-exchange3.html': 'The Great Exchange',
        'guide-spirit2.html': 'The GUIDE of the Holy Spirit',
        'learning-circle2.html': 'The Learning Circle',
        'romans-road.html': 'The Romans Road',
        'stewardship-flip.html': 'The Stewardship Flip',
        'three-circles-video.html': 'Watch Someone Draw the 3 Circles',
        'three-circles.html': 'The 3 Circles',
        'two-ordinances.html': 'The Doorway and the Table'
    };

    function escapeAttr(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function widgetFileName(src) {
        if (!src) return '';
        var path = String(src).split('?')[0].replace(/\\/g, '/');
        var parts = path.split('/');
        return parts[parts.length - 1] || '';
    }

    function humanizeFileName(name) {
        var stem = String(name || '').replace(/\.html?$/i, '').replace(/[-_]+/g, ' ').trim();
        if (!stem) return '';
        return stem.replace(/\b[a-z]/g, function (ch) {
            return ch.toUpperCase();
        });
    }

    function titleForWidget(block) {
        if (block && typeof block.title === 'string' && block.title.trim()) {
            return block.title.trim();
        }
        var file = widgetFileName(block && block.src);
        if (KNOWN_TITLES[file]) return KNOWN_TITLES[file];
        return humanizeFileName(file) || DEFAULT_TITLE;
    }

    function isNode(value) {
        return !!(value && typeof value === 'object' && typeof value.nodeType === 'number' && value.nodeType === 1);
    }

    function getIframeDocument(iframe) {
        if (!iframe) return null;
        try {
            if (iframe.contentDocument) return iframe.contentDocument;
            if (iframe.contentWindow && iframe.contentWindow.document) {
                return iframe.contentWindow.document;
            }
        } catch (err) {
            return null;
        }
        return null;
    }

    function getIframeBody(iframe) {
        var doc = getIframeDocument(iframe);
        return doc ? doc.body : null;
    }

    function numericHeight(value) {
        return typeof value === 'number' && isFinite(value) && value > 0 ? value : 0;
    }

    function measureContentHeight(iframe) {
        var doc = getIframeDocument(iframe);
        if (!doc) return 0;
        var el = doc.documentElement;
        var body = doc.body;
        var heights = [];
        if (el) {
            heights.push(el.scrollHeight, el.offsetHeight, el.clientHeight);
        }
        if (body) {
            heights.push(body.scrollHeight, body.offsetHeight, body.clientHeight);
        }
        var max = 0;
        for (var i = 0; i < heights.length; i++) {
            var n = numericHeight(heights[i]);
            if (n > max) max = n;
        }
        return max;
    }

    function applyHeight(iframe) {
        if (!iframe || !iframe.style || !getIframeDocument(iframe)) {
            return measureContentHeight(iframe);
        }
        // Root scroll/client heights include the current viewport. Remove that
        // floor while measuring, otherwise a once-tall widget can never shrink.
        // Restore tiny/hidden measurements; do not collapse an inactive lesson.
        var previousHeight = iframe.style.height;
        var measured;
        iframe.style.height = '0px';
        try {
            measured = measureContentHeight(iframe);
        } finally {
            iframe.style.height = previousHeight;
        }
        if (measured > MIN_MEASURED_HEIGHT) {
            iframe.style.height = Math.ceil(measured) + 'px';
        }
        return measured;
    }

    function titleFromDocument(iframe) {
        var doc = getIframeDocument(iframe);
        if (!doc || typeof doc.title !== 'string') return '';
        return doc.title.trim();
    }

    function bindWidgetIframe(iframe, options) {
        options = options || {};
        var cleaned = false;
        var observer = null;
        var resizeObserver = null;
        var retryTimer = null;
        var retryCount = 0;
        var maxRetries = options.maxRetries == null ? 40 : options.maxRetries;
        var retryMs = options.retryMs == null ? 50 : options.retryMs;
        var win = options.windowObj || (typeof window !== 'undefined' ? window : null);
        var MutationObs = options.MutationObserverCtor ||
            (typeof MutationObserver !== 'undefined' ? MutationObserver : null);
        var ResizeObs = options.ResizeObserverCtor ||
            (typeof ResizeObserver !== 'undefined' ? ResizeObserver : null);

        function clearRetry() {
            if (retryTimer) {
                clearTimeout(retryTimer);
                retryTimer = null;
            }
        }

        function disconnectObservers() {
            if (observer) {
                observer.disconnect();
                observer = null;
            }
            if (resizeObserver) {
                resizeObserver.disconnect();
                resizeObserver = null;
            }
        }

        function refresh() {
            if (cleaned) return 0;
            return applyHeight(iframe);
        }

        function attachObservers() {
            disconnectObservers();
            var body = getIframeBody(iframe);
            if (!isNode(body)) {
                return false;
            }
            if (typeof MutationObs === 'function') {
                observer = new MutationObs(refresh);
                observer.observe(body, { childList: true, subtree: true, attributes: true });
            }
            if (typeof ResizeObs === 'function') {
                resizeObserver = new ResizeObs(refresh);
                resizeObserver.observe(body);
                var doc = getIframeDocument(iframe);
                if (doc && isNode(doc.documentElement) && doc.documentElement !== body) {
                    resizeObserver.observe(doc.documentElement);
                }
            }
            return true;
        }

        function applyDocumentTitle() {
            if (options.keepAssignedTitle) return;
            var docTitle = titleFromDocument(iframe);
            if (docTitle && iframe && iframe.setAttribute) {
                iframe.setAttribute('title', docTitle);
            }
        }

        function tryReady() {
            if (cleaned) return;
            refresh();
            if (attachObservers()) {
                applyDocumentTitle();
                return;
            }
            if (retryCount >= maxRetries) {
                return;
            }
            retryCount += 1;
            retryTimer = setTimeout(tryReady, retryMs);
        }

        function onLoad() {
            if (cleaned) return;
            retryCount = 0;
            clearRetry();
            tryReady();
        }

        if (win && win.addEventListener) {
            win.addEventListener('resize', refresh);
        }
        if (iframe && iframe.addEventListener) {
            iframe.addEventListener('load', onLoad);
        }
        tryReady();

        return {
            refresh: refresh,
            cleanup: function cleanup() {
                if (cleaned) return;
                cleaned = true;
                clearRetry();
                disconnectObservers();
                if (win && win.removeEventListener) {
                    win.removeEventListener('resize', refresh);
                }
                if (iframe && iframe.removeEventListener) {
                    iframe.removeEventListener('load', onLoad);
                }
            }
        };
    }

    function createHost(options) {
        var bindings = [];
        return {
            bind: function (iframe, bindOptions) {
                var binding = bindWidgetIframe(iframe, bindOptions || options || {});
                bindings.push(binding);
                return binding;
            },
            bindAll: function (root) {
                if (!root || !root.querySelectorAll) return;
                var frames = root.querySelectorAll('iframe.gt-widget-frame');
                for (var i = 0; i < frames.length; i++) {
                    this.bind(frames[i], options);
                }
            },
            refresh: function () {
                for (var i = 0; i < bindings.length; i++) {
                    bindings[i].refresh();
                }
            },
            teardown: function () {
                for (var i = 0; i < bindings.length; i++) {
                    bindings[i].cleanup();
                }
                bindings = [];
            }
        };
    }

    return {
        DEFAULT_TITLE: DEFAULT_TITLE,
        KNOWN_TITLES: KNOWN_TITLES,
        escapeAttr: escapeAttr,
        widgetFileName: widgetFileName,
        humanizeFileName: humanizeFileName,
        titleForWidget: titleForWidget,
        isNode: isNode,
        getIframeDocument: getIframeDocument,
        getIframeBody: getIframeBody,
        measureContentHeight: measureContentHeight,
        applyHeight: applyHeight,
        bindWidgetIframe: bindWidgetIframe,
        createHost: createHost
    };
}));
