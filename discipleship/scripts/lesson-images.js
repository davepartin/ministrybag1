(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./lesson-image-assets.js'));
    } else {
        root.GrowingTogetherLessonImages = factory(root.GrowingTogetherImageAssets || {});
    }
})(typeof window !== 'undefined' ? window : globalThis, function (assets) {
    'use strict';

    function escapeAttr(value) {
        return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    }

    function versioned(src, version) {
        return src + (src.includes('?') ? '&' : '?') + 'v=' + encodeURIComponent(version);
    }

    function attributes(src, version, sizes) {
        var asset = assets[src];
        var variants = asset && asset.variants;
        var delivered = variants ? variants[variants.length - 1].src : src;
        var attrs = 'loading="lazy" decoding="async" data-lesson-src="' + escapeAttr(versioned(delivered, version)) + '"';
        if (asset) {
            attrs += ' width="' + asset.width + '" height="' + asset.height + '"';
            attrs += ' sizes="' + escapeAttr(sizes || '(max-width: 640px) calc(100vw - 40px), 600px') + '"';
            attrs += ' data-lesson-srcset="' + escapeAttr(variants.map(function (variant) {
                return versioned(variant.src, version) + ' ' + variant.width + 'w';
            }).join(', ')) + '"';
        }
        return attrs;
    }

    function activate(session) {
        if (!session) return;
        // No real src on hidden lessons: native lazy-loading alone can still fetch them.
        session.querySelectorAll('img[data-lesson-src]').forEach(function (img) {
            var srcset = img.getAttribute('data-lesson-srcset');
            if (srcset) img.setAttribute('srcset', srcset);
            img.setAttribute('src', img.getAttribute('data-lesson-src'));
            img.removeAttribute('data-lesson-srcset');
            img.removeAttribute('data-lesson-src');
        });
    }

    function preparePrint(session) {
        activate(session);
        if (!session) return Promise.resolve();
        return Promise.all(Array.from(session.querySelectorAll('img')).map(function (img) {
            img.loading = 'eager';
            return new Promise(function (resolve) {
                if (img.complete) return resolve();
                var timeout;
                function finish() {
                    clearTimeout(timeout);
                    img.removeEventListener('load', finish);
                    img.removeEventListener('error', finish);
                    resolve();
                }
                img.addEventListener('load', finish);
                img.addEventListener('error', finish);
                timeout = setTimeout(finish, 10000);
            });
        }));
    }

    return { attributes: attributes, activate: activate, preparePrint: preparePrint };
});
