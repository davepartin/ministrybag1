(function () {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var VERSION = String(window.GREAT_COMMAND_VERSION || '201');
  if (VERSION !== '201' && VERSION !== '202' && VERSION !== '203') {
    VERSION = '201';
  }

  var COLORS = {
    ink: '#2C2416',
    inkSoft: '#5B5347',
    guide: '#C8C2B6',
    paper: '#FFFFFF',
    tray: '#F6F4EE',
    gold: '#B8860B',
    green: '#2E7D5B',
    belong: '#4A708B',
    neighbor: '#5E7282',
    go: '#B5562B',
    deepRed: '#8B1A2B'
  };

  var CARDS = {
    DOWN: {
      heading: "God's Love Comes Down",
      verse: '"We love because he first loved us."',
      ref: '1 John 4:19',
      note: 'Everything starts with God. His love comes to you before you do anything.'
    },
    UP: {
      heading: 'Love God With All You Are',
      verse: '"And you shall love the Lord your God with all your heart and with all your soul and with all your mind and with all your strength."',
      ref: 'Mark 12:30',
      note: 'Your love goes back up to Him, not to earn His love, but because you already have it.'
    },
    NEIGHBOR: {
      heading: 'Love Your Neighbor as Yourself',
      verse: '"The second is this: \'You shall love your neighbor as yourself.\' There is no other commandment greater than these."',
      ref: 'Mark 12:31',
      note: 'The second command is the overflow of the first. It reaches out in both directions.'
    },
    BELONG: {
      heading: 'Belong: Love Your Family in Christ',
      verse: '"A new commandment I give to you, that you love one another: just as I have loved you, you also are to love one another."',
      ref: 'John 13:34',
      note: 'Love reaches first to the people closest to you: your home and the family of God.'
    },
    GO: {
      heading: 'Go: Love Those Not Yet in the Family',
      verse: '"As the Father has sent me, even so I am sending you."',
      ref: 'John 20:21',
      note: 'The same love keeps reaching, to people who do not yet know Jesus.'
    }
  };

  var VERSIONS = {
    '201': {
      title: 'The Greatest Commandment',
      regionLabel: 'Interactive cross drawing for 201 Loving God',
      svgTitle: 'The Greatest Commandment Cross (Growing Deep)',
      steps: [
        {
          id: 'start',
          pill: 'Start',
          pillLabel: 'Start: The Greatest Commandment',
          heading: 'The Greatest Commandment',
          verse: '"Which commandment is the most important of all?"',
          ref: 'Mark 12:28',
          note: 'Jesus was asked which commandment matters most. Watch His answer take shape.',
          accent: COLORS.ink,
          accentDark: COLORS.ink,
          draw: {},
          desc: 'A faint dashed outline of the full cross on white paper, ready to be drawn step by step.'
        },
        {
          id: 'down',
          pill: '1. Down',
          pillLabel: "Step 1: God's Love Comes Down",
          heading: CARDS.DOWN.heading,
          verse: CARDS.DOWN.verse,
          ref: CARDS.DOWN.ref,
          note: CARDS.DOWN.note,
          accent: COLORS.gold,
          accentDark: '#8B6508',
          draw: {
            uprightLeft: 'ink',
            downArrow: 'gold'
          },
          desc: "The left edge of the upright beam is drawn from top to bottom with a gold downward arrow for God's love coming down first. The remaining beams stay in faint dashed grey."
        },
        {
          id: 'up',
          pill: '2. Up',
          pillLabel: 'Step 2: Love God With All You Are',
          heading: CARDS.UP.heading,
          verse: CARDS.UP.verse,
          ref: CARDS.UP.ref,
          note: CARDS.UP.note,
          accent: COLORS.green,
          accentDark: '#236146',
          draw: {
            uprightLeft: 'ink',
            uprightRight: 'ink',
            downArrow: 'gold',
            upArrow: 'green',
            uprightWash: 'goldGreen'
          },
          desc: 'The right edge of the upright beam draws from bottom to top with a green upward arrow, closing the upright beam with a light gold and green wash. Both side arms remain faint dashed grey.'
        },
        {
          id: 'neighbor',
          pill: '3. Out',
          pillLabel: 'Step 3: Love Your Neighbor as Yourself',
          heading: CARDS.NEIGHBOR.heading,
          verse: CARDS.NEIGHBOR.verse,
          ref: CARDS.NEIGHBOR.ref,
          note: CARDS.NEIGHBOR.note,
          accent: '#54626D',
          accentDark: '#3E4952',
          draw: {
            uprightLeft: 'ink',
            uprightRight: 'ink',
            downArrow: 'gold',
            upArrow: 'green',
            uprightWash: 'goldGreen',
            armLeft: 'lightInk',
            armRight: 'lightInk',
            armLeftWash: 'stone',
            armRightWash: 'stone',
            labelOthers: true
          },
          desc: 'Both horizontal arms draw outward from the center in lighter ink with a soft wash and the word others on each arm, showing love to neighbor flowing out from the upright beam.'
        },
        {
          id: 'final',
          pill: 'Cross',
          pillLabel: 'Step 4: The Cross Holds It All',
          heading: 'The Cross Holds It All',
          verse: '"And walk in love, as Christ loved us and gave himself up for us, a fragrant offering and sacrifice to God."',
          ref: 'Ephesians 5:2',
          note: 'Receive and respond. Love comes down, goes up, and reaches out.',
          accent: COLORS.deepRed,
          accentDark: '#6D1422',
          draw: {
            uprightLeft: 'ink',
            uprightRight: 'ink',
            downArrow: 'gold',
            upArrow: 'green',
            uprightWash: 'goldGreen',
            armLeft: 'lightInk',
            armRight: 'lightInk',
            armLeftWash: 'stone',
            armRightWash: 'stone',
            labelOthers: true,
            finishedCross: 'full',
            previewCaptions: true
          },
          desc: 'The finished cross carries a deep red highlight around the completed shape with three quiet grey captions: Growing Deep on the upright, Growing Up under the left arm, and Growing Out under the right arm.'
        }
      ]
    },
    '202': {
      title: 'Love Reaches Out',
      regionLabel: 'Interactive cross drawing for 202 Loving Your Neighbors',
      svgTitle: 'Love Reaches Out Cross (Belong - Growing Up)',
      steps: [
        {
          id: 'start',
          pill: 'Start',
          pillLabel: 'Start: Love Begins With God',
          heading: 'Love Begins With God',
          verse: '"Beloved, let us love one another, for love is from God, and whoever loves has been born of God and knows God."',
          ref: '1 John 4:7',
          note: 'Before you learn to love others, remember where love starts.',
          accent: COLORS.ink,
          accentDark: COLORS.ink,
          draw: {},
          desc: 'A faint dashed outline of the full cross on white paper.'
        },
        {
          id: 'review',
          pill: '1. Loved',
          pillLabel: 'Step 1: Loved First',
          heading: 'Loved First',
          verse: CARDS.DOWN.verse,
          ref: CARDS.DOWN.ref,
          note: "God's love came down to you, and your love goes back up to Him.",
          accent: COLORS.green,
          accentDark: '#236146',
          quickUpright: true,
          draw: {
            uprightLeft: 'ink',
            uprightRight: 'ink',
            downArrow: 'gold',
            upArrow: 'green',
            uprightWash: 'goldGreen'
          },
          desc: 'The full upright beam redraws quickly in black marker with its downward gold arrow, upward green arrow, and soft wash, while both arms wait in faint dashed grey.'
        },
        {
          id: 'neighbor',
          pill: '2. Neighbor',
          pillLabel: 'Step 2: Love Your Neighbor as Yourself',
          heading: CARDS.NEIGHBOR.heading,
          verse: CARDS.NEIGHBOR.verse,
          ref: CARDS.NEIGHBOR.ref,
          note: 'Like the Samaritan, love does not ask who qualifies. It reaches out in both directions.',
          accent: COLORS.neighbor,
          accentDark: '#415260',
          draw: {
            uprightLeft: 'ink',
            uprightRight: 'ink',
            downArrow: 'gold',
            upArrow: 'green',
            uprightWash: 'goldGreen',
            armLeft: 'blueGrey',
            armRight: 'blueGrey',
            armLeftWash: 'blueGrey',
            armRightWash: 'blueGrey'
          },
          desc: 'Both horizontal arms draw outward from the center in blue-grey ink with a light blue-grey wash, stretching out in both directions.'
        },
        {
          id: 'belong',
          pill: '3. Belong',
          pillLabel: 'Step 3: Belong, Love Your Family in Christ',
          heading: CARDS.BELONG.heading,
          verse: CARDS.BELONG.verse,
          ref: CARDS.BELONG.ref,
          note: CARDS.BELONG.note,
          accent: COLORS.belong,
          accentDark: '#36556B',
          redrawLeftArm: true,
          draw: {
            uprightLeft: 'ink',
            uprightRight: 'ink',
            downArrow: 'gold',
            upArrow: 'green',
            uprightWash: 'goldGreen',
            armLeft: 'belongBold',
            armLeftWash: 'belong',
            labelBelong: 'bold',
            belongIcons: 'bold',
            goPreviewCaption: true
          },
          desc: 'The left arm redraws in bold Belong blue with a house and table of people at its end, while the right arm fades to faint dashed grey with the quiet caption Go: Growing Out.'
        },
        {
          id: 'final',
          pill: 'Household',
          pillLabel: 'Step 4: Especially the Household of Faith',
          heading: 'Especially the Household of Faith',
          verse: '"So then, as we have opportunity, let us do good to everyone, and especially to those who are of the household of faith."',
          ref: 'Galatians 6:10',
          note: 'Love comes down, goes up, and reaches out, starting with your home and your church family.',
          accent: COLORS.deepRed,
          accentDark: '#6D1422',
          draw: {
            uprightLeft: 'ink',
            uprightRight: 'ink',
            downArrow: 'gold',
            upArrow: 'green',
            uprightWash: 'goldGreen',
            armLeft: 'belongBold',
            armLeftWash: 'belong',
            labelBelong: 'bold',
            belongIcons: 'bold',
            goPreviewCaption: true,
            finishedCross: 'belongFocus'
          },
          desc: 'A deep red finished highlight binds the upright beam and bold Belong arm with its house and table icons, while the right arm remains faint dashed grey labeled Go: Growing Out.'
        }
      ]
    },
    '203': {
      title: 'Love Goes Out',
      regionLabel: 'Interactive cross drawing for 203 The Great Commission',
      svgTitle: 'Love Goes Out Cross (Go - Growing Out)',
      steps: [
        {
          id: 'start',
          pill: 'Start',
          pillLabel: 'Start: The Love You Received',
          heading: 'The Love You Received',
          verse: '"We love because he first loved us."',
          ref: '1 John 4:19',
          note: 'Remember the shape of the love you have received.',
          accent: COLORS.ink,
          accentDark: COLORS.ink,
          draw: {},
          desc: 'A faint dashed outline of the full cross on white paper.'
        },
        {
          id: 'review',
          pill: '1. Family',
          pillLabel: 'Step 1: Loved and Belonging',
          heading: 'Loved and Belonging',
          verse: '"Beloved, if God so loved us, we also ought to love one another."',
          ref: '1 John 4:11',
          note: 'God loved you first, and He placed you in His family.',
          accent: COLORS.belong,
          accentDark: '#36556B',
          quickReview203: true,
          draw: {
            uprightLeft: 'ink',
            uprightRight: 'ink',
            downArrow: 'gold',
            upArrow: 'green',
            uprightWash: 'goldGreen',
            armLeft: 'belongQuiet',
            armLeftWash: 'belongSoft',
            labelBelong: 'soft',
            belongIcons: 'soft'
          },
          desc: 'The upright beam and the Belong arm with its house and table icons redraw quickly together, leaving the right arm in faint dashed grey.'
        },
        {
          id: 'go',
          pill: '2. Go',
          pillLabel: 'Step 2: Go, Love Those Not Yet in the Family',
          heading: CARDS.GO.heading,
          verse: CARDS.GO.verse,
          ref: CARDS.GO.ref,
          note: CARDS.GO.note,
          accent: COLORS.go,
          accentDark: '#8E411E',
          draw: {
            uprightLeft: 'ink',
            uprightRight: 'ink',
            downArrow: 'gold',
            upArrow: 'green',
            uprightWash: 'goldGreen',
            armLeft: 'belongQuiet',
            armLeftWash: 'belongSoft',
            labelBelong: 'soft',
            belongIcons: 'soft',
            armRight: 'goBold',
            armRightWash: 'go',
            labelGo: true,
            goRings: true
          },
          desc: 'The right arm draws outward in bold rust labeled Go, ending in four widening rings labeled home, work and school, neighborhood, and nations.'
        },
        {
          id: 'final',
          pill: 'Sent',
          pillLabel: 'Step 3: You Are Sent',
          heading: 'You Are Sent',
          verse: '"Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit."',
          ref: 'Matthew 28:19',
          note: 'Love comes down, goes up, and reaches out, starting with the people already around you.',
          accent: COLORS.deepRed,
          accentDark: '#6D1422',
          draw: {
            uprightLeft: 'ink',
            uprightRight: 'ink',
            downArrow: 'gold',
            upArrow: 'green',
            uprightWash: 'goldGreen',
            armLeft: 'belongQuiet',
            armLeftWash: 'belongSoft',
            labelBelong: 'soft',
            belongIcons: 'soft',
            armRight: 'goBold',
            armRightWash: 'go',
            labelGo: true,
            goRings: true,
            finishedCross: 'full'
          },
          desc: 'The finished cross shines with a deep red accent uniting the upright beam, Belong on the left, and the bold Go arm with widening rings to the nations on the right.'
        }
      ]
    }
  };

  var CSS = [
    ':root {',
    '  --ink: #2C2416;',
    '  --paper: #FFFFFF;',
    '  --tray: #F6F4EE;',
    '  --muted: #6E6559;',
    '  --border: #E8E2D5;',
    '  --step-color: #2C2416;',
    '  --step-dark: #2C2416;',
    '  --card-h: 112px;',
    '}',
    '* { box-sizing: border-box; }',
    'html, body { margin: 0; padding: 0; background: var(--paper); }',
    'body {',
    '  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;',
    '  color: var(--ink);',
    '  -webkit-font-smoothing: antialiased;',
    '}',
    '@media (min-width: 560px) {',
    '  body { padding: 14px 16px; background: #F5F3EE; }',
    '}',
    '.widget-outer {',
    '  width: 100%;',
    '  max-width: 100%;',
    '  margin: 0 auto;',
    '  background: var(--paper);',
    '  overflow: hidden;',
    '}',
    '@media (min-width: 560px) {',
    '  .widget-outer {',
    '    max-width: 460px;',
    '    border-radius: 14px;',
    '    box-shadow: 0 4px 24px rgba(44, 36, 22, 0.10);',
    '    border: 1px solid var(--border);',
    '  }',
    '}',
    '.title-bar {',
    '  background: var(--ink);',
    '  color: #FFFFFF;',
    '  padding: 9px 14px;',
    '  display: flex;',
    '  align-items: center;',
    '  justify-content: space-between;',
    '  gap: 8px;',
    '}',
    '.title-bar h1 {',
    '  margin: 0;',
    '  font: 700 15px/1.25 system-ui, -apple-system, sans-serif;',
    '  letter-spacing: 0.01em;',
    '}',
    '.course-tag {',
    '  font: 600 11px/1 system-ui, -apple-system, sans-serif;',
    '  letter-spacing: 0.06em;',
    '  text-transform: uppercase;',
    '  color: #D7D0C4;',
    '  white-space: nowrap;',
    '}',
    '.stage {',
    '  background: var(--paper);',
    '  border-bottom: 1px solid #ECE7DC;',
    '  padding: 2px 4px 0;',
    '}',
    '.cross-svg {',
    '  display: block;',
    '  width: 100%;',
    '  height: auto;',
    '}',
    '.hand-label {',
    '  font-family: "Bradley Hand", "Chalkboard SE", "Segoe Script", ui-rounded, system-ui, -apple-system, sans-serif;',
    '  font-weight: 700;',
    '}',
    '.clean-label {',
    '  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;',
    '}',
    '.svg-fade {',
    '  opacity: 0;',
    '}',
    '.svg-fade.is-visible {',
    '  opacity: 1;',
    '}',
    '.svg-fade.is-soft {',
    '  opacity: 0.72;',
    '}',
    '.svg-stroke {',
    '  opacity: 0;',
    '}',
    '.svg-stroke.is-visible {',
    '  opacity: 1;',
    '}',
    '.svg-stroke-tex.is-visible {',
    '  opacity: 0.42;',
    '}',
    '@media (prefers-reduced-motion: no-preference) {',
    '  .widget-outer:not(.is-instant) .svg-stroke {',
    '    transition: stroke-dashoffset var(--stroke-dur, 720ms) cubic-bezier(0.22, 0.82, 0.32, 1), opacity 220ms ease, stroke 280ms ease;',
    '  }',
    '  .widget-outer:not(.is-instant) .svg-fade {',
    '    transition: opacity var(--fade-dur, 360ms) ease var(--fade-delay, 0ms);',
    '  }',
    '  .widget-outer .step-pill {',
    '    transition: background-color 0.22s ease, border-color 0.22s ease, color 0.22s ease;',
    '  }',
    '  .widget-outer .nav-btn.primary,',
    '  .widget-outer .verse-card-bar,',
    '  .widget-outer .card-heading {',
    '    transition: background-color 0.24s ease, border-color 0.24s ease, color 0.24s ease;',
    '  }',
    '}',
    '.step-strip {',
    '  display: flex;',
    '  justify-content: center;',
    '  flex-wrap: nowrap;',
    '  gap: 5px;',
    '  padding: 7px 8px 6px;',
    '  background: var(--tray);',
    '  border-bottom: 1px solid var(--border);',
    '}',
    '.step-pill {',
    '  appearance: none;',
    '  min-height: 28px;',
    '  padding: 4px 8px;',
    '  border-radius: 999px;',
    '  border: 1.5px solid #D3CCC0;',
    '  background: #FFFFFF;',
    '  color: var(--muted);',
    '  font: 700 11px/1.1 system-ui, -apple-system, sans-serif;',
    '  cursor: pointer;',
    '  white-space: nowrap;',
    '}',
    '.step-pill.passed {',
    '  border-color: var(--pill-color, var(--ink));',
    '  color: var(--ink);',
    '  background: #FAF8F3;',
    '}',
    '.step-pill.active {',
    '  background: var(--pill-color, var(--ink));',
    '  border-color: var(--pill-color, var(--ink));',
    '  color: #FFFFFF;',
    '}',
    '.card-area {',
    '  background: var(--tray);',
    '  padding: 7px 12px 10px;',
    '}',
    '.verse-card {',
    '  background: #FFFFFF;',
    '  border-radius: 10px;',
    '  overflow: hidden;',
    '  border: 1px solid #EBE5D9;',
    '  box-shadow: 0 2px 10px rgba(44, 36, 22, 0.05);',
    '}',
    '.verse-card-bar {',
    '  height: 4px;',
    '  background: var(--step-color);',
    '}',
    '.verse-card-content {',
    '  padding: 9px 13px;',
    '  min-height: var(--card-h, 112px);',
    '  display: flex;',
    '  flex-direction: column;',
    '  justify-content: center;',
    '}',
    '.card-heading {',
    '  font: 700 15px/1.22 system-ui, -apple-system, sans-serif;',
    '  color: var(--step-dark);',
    '  margin: 0 0 4px;',
    '}',
    '.card-verse {',
    '  font: 13.5px/1.36 Georgia, Cambria, serif;',
    '  color: #3D3426;',
    '  margin: 0;',
    '}',
    '.verse-ref {',
    '  font: 600 11.5px/1.2 system-ui, -apple-system, sans-serif;',
    '  color: var(--muted);',
    '  white-space: nowrap;',
    '  margin-left: 4px;',
    '}',
    '.card-note {',
    '  display: block;',
    '  margin-top: 5px;',
    '  font: 12.5px/1.34 system-ui, -apple-system, sans-serif;',
    '  color: #4A4238;',
    '}',
    '.nav-bar {',
    '  display: flex;',
    '  justify-content: space-between;',
    '  align-items: center;',
    '  gap: 8px;',
    '  margin-top: 7px;',
    '}',
    '.nav-btn {',
    '  min-height: 44px;',
    '  min-width: 96px;',
    '  padding: 10px 14px;',
    '  border-radius: 10px;',
    '  border: 1.5px solid #D4CFC4;',
    '  background: #FFFFFF;',
    '  color: var(--ink);',
    '  font: 700 13.5px/1 system-ui, -apple-system, sans-serif;',
    '  cursor: pointer;',
    '}',
    '.nav-btn.primary {',
    '  background: var(--step-color);',
    '  border-color: var(--step-color);',
    '  color: #FFFFFF;',
    '}',
    '.nav-btn:disabled {',
    '  opacity: 0.36;',
    '  cursor: default;',
    '}',
    '.step-count {',
    '  font: 600 12px system-ui, -apple-system, sans-serif;',
    '  color: var(--muted);',
    '}',
    'button:focus-visible {',
    '  outline: 3px solid #E0A526;',
    '  outline-offset: 2px;',
    '}',
    '@media (max-width: 395px) {',
    '  .step-pill { padding: 4px 6px; font-size: 10.5px; }',
    '  .card-area { padding: 6px 10px 8px; }',
    '  .verse-card-content { padding: 8px 11px; }',
    '  .card-heading { font-size: 14.5px; }',
    '  .card-verse { font-size: 13px; }',
    '}'
  ].join('\n');

  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (attrs[k] !== null && attrs[k] !== undefined) {
          node.setAttribute(k, String(attrs[k]));
        }
      });
    }
    if (text !== undefined) {
      node.textContent = text;
    }
    return node;
  }

  function svgEl(tag, attrs, text) {
    var node = document.createElementNS(SVG_NS, tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (attrs[k] !== null && attrs[k] !== undefined) {
          node.setAttribute(k, String(attrs[k]));
        }
      });
    }
    if (text !== undefined) {
      node.textContent = text;
    }
    return node;
  }

  function injectStyles() {
    if (document.getElementById('great-command-cross-css')) return;
    var style = document.createElement('style');
    style.id = 'great-command-cross-css';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function buildCrossSvg(cfg) {
    var svg = svgEl('svg', {
      'class': 'cross-svg',
      'viewBox': '0 0 440 264',
      'width': '100%',
      'role': 'img',
      'aria-labelledby': 'svg-title svg-desc'
    });

    var svgTitle = svgEl('title', { id: 'svg-title' }, cfg.svgTitle);
    var svgDesc = svgEl('desc', { id: 'svg-desc' }, cfg.steps[0].desc);
    svg.appendChild(svgTitle);
    svg.appendChild(svgDesc);

    var defs = svgEl('defs');
    var uprightGrad = svgEl('linearGradient', {
      id: 'upright-wash-grad',
      x1: '0%',
      y1: '0%',
      x2: '100%',
      y2: '0%'
    });
    uprightGrad.appendChild(svgEl('stop', { offset: '0%', 'stop-color': COLORS.gold, 'stop-opacity': '0.17' }));
    uprightGrad.appendChild(svgEl('stop', { offset: '48%', 'stop-color': COLORS.gold, 'stop-opacity': '0.10' }));
    uprightGrad.appendChild(svgEl('stop', { offset: '52%', 'stop-color': COLORS.green, 'stop-opacity': '0.10' }));
    uprightGrad.appendChild(svgEl('stop', { offset: '100%', 'stop-color': COLORS.green, 'stop-opacity': '0.17' }));
    defs.appendChild(uprightGrad);
    svg.appendChild(defs);

    // Subtle paper grain / corner sketch ticks
    var paperG = svgEl('g', { 'aria-hidden': 'true' });
    paperG.appendChild(svgEl('rect', { x: 0, y: 0, width: 440, height: 264, fill: '#FFFFFF' }));
    svg.appendChild(paperG);

    // Persistent faint dashed silhouette so non-focus beams are never hidden
    var guideStyle = {
      fill: 'none',
      stroke: COLORS.guide,
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-dasharray': '5 5'
    };
    var guideG = svgEl('g', { id: 'guide-cross', 'aria-hidden': 'true' });
    guideG.appendChild(svgEl('path', {
      d: 'M 201 26 Q 199 130 201 238 Q 220 240 239 238 Q 241 130 239 26 Q 220 24 201 26',
      fill: 'none',
      stroke: guideStyle.stroke,
      'stroke-width': guideStyle['stroke-width'],
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-dasharray': guideStyle['stroke-dasharray']
    }));
    guideG.appendChild(svgEl('path', {
      d: 'M 201 102 Q 156 100 112 103 Q 110 118 112 134 Q 157 136 201 134',
      fill: 'none',
      stroke: guideStyle.stroke,
      'stroke-width': guideStyle['stroke-width'],
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-dasharray': guideStyle['stroke-dasharray']
    }));
    guideG.appendChild(svgEl('path', {
      d: 'M 239 102 Q 284 100 328 103 Q 330 118 328 134 Q 283 136 239 134',
      fill: 'none',
      stroke: guideStyle.stroke,
      'stroke-width': guideStyle['stroke-width'],
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-dasharray': guideStyle['stroke-dasharray']
    }));
    svg.appendChild(guideG);

    // Washes layer (under marker ink)
    var washG = svgEl('g', { id: 'wash-layer', 'aria-hidden': 'true' });
    var uprightWash = svgEl('path', {
      id: 'wash-upright',
      'class': 'svg-fade',
      d: 'M 202 27 Q 200 130 202 237 Q 220 239 238 237 Q 240 130 238 27 Q 220 25 202 27 Z',
      fill: 'url(#upright-wash-grad)'
    });
    var armLeftWash = svgEl('path', {
      id: 'wash-arm-left',
      'class': 'svg-fade',
      d: 'M 201 103 Q 156 101 113 104 Q 111 118 113 133 Q 158 135 201 133 Z',
      fill: COLORS.belong,
      'fill-opacity': '0.12'
    });
    var armRightWash = svgEl('path', {
      id: 'wash-arm-right',
      'class': 'svg-fade',
      d: 'M 239 103 Q 284 101 327 104 Q 329 118 327 133 Q 282 135 239 133 Z',
      fill: COLORS.go,
      'fill-opacity': '0.12'
    });
    var finishedGlow = svgEl('path', {
      id: 'wash-finished',
      'class': 'svg-fade',
      d: 'M 202 27 L 238 27 L 239 102 L 328 103 L 328 134 L 239 134 L 238 238 L 202 238 L 201 134 L 112 134 L 112 103 L 201 102 Z',
      fill: COLORS.deepRed,
      'fill-opacity': '0.07'
    });
    washG.appendChild(uprightWash);
    washG.appendChild(armLeftWash);
    washG.appendChild(armRightWash);
    washG.appendChild(finishedGlow);
    svg.appendChild(washG);

    // Marker outline strokes layer
    var strokes = [];
    function addStrokePair(id, dMain, dTex, strokeColor, widthMain, widthTex) {
      var mainPath = svgEl('path', {
        id: id,
        'class': 'svg-stroke',
        d: dMain,
        fill: 'none',
        stroke: strokeColor,
        'stroke-width': String(widthMain || 3.1),
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      });
      var texPath = svgEl('path', {
        id: id + '-tex',
        'class': 'svg-stroke svg-stroke-tex',
        d: dTex,
        fill: 'none',
        stroke: strokeColor,
        'stroke-width': String(widthTex || 1.3),
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      });
      svg.appendChild(mainPath);
      svg.appendChild(texPath);
      strokes.push(mainPath, texPath);
      return { main: mainPath, tex: texPath };
    }

    // Upright LEFT edge: top -> bottom (closes bottom base)
    var uprightLeft = addStrokePair(
      'stroke-upright-left',
      'M 202 26 Q 199 78 201 130 Q 202 184 201 238 Q 220 241 239 238',
      'M 203.2 27.5 Q 200.4 79 202.2 130 Q 203 185 202.1 237.2 Q 220 239.8 238 237',
      COLORS.ink,
      3.2,
      1.25
    );

    // Upright RIGHT edge: bottom -> top (closes top cap)
    var uprightRight = addStrokePair(
      'stroke-upright-right',
      'M 239 238 Q 241 182 238 130 Q 237 76 239 26 Q 220 24 202 26',
      'M 237.8 236.8 Q 239.7 181 236.9 130 Q 236 77 237.8 27 Q 220 25.3 203 27',
      COLORS.ink,
      3.2,
      1.25
    );

    // Down gold arrow along left side of upper upright (top -> bottom)
    var downArrow = {
      shaft: svgEl('path', {
        id: 'arrow-down-shaft',
        'class': 'svg-stroke',
        d: 'M 185 36 Q 183 63 185 90',
        fill: 'none',
        stroke: COLORS.gold,
        'stroke-width': '2.4',
        'stroke-linecap': 'round'
      }),
      head: svgEl('path', {
        id: 'arrow-down-head',
        'class': 'svg-stroke',
        d: 'M 179.5 81 L 185 92 L 191 81',
        fill: 'none',
        stroke: COLORS.gold,
        'stroke-width': '2.5',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      })
    };
    svg.appendChild(downArrow.shaft);
    svg.appendChild(downArrow.head);
    strokes.push(downArrow.shaft, downArrow.head);

    // Up green arrow along right side of upper upright (bottom -> top)
    var upArrow = {
      shaft: svgEl('path', {
        id: 'arrow-up-shaft',
        'class': 'svg-stroke',
        d: 'M 255 92 Q 257 63 255 36',
        fill: 'none',
        stroke: COLORS.green,
        'stroke-width': '2.4',
        'stroke-linecap': 'round'
      }),
      head: svgEl('path', {
        id: 'arrow-up-head',
        'class': 'svg-stroke',
        d: 'M 249.5 46 L 255 35 L 261 46',
        fill: 'none',
        stroke: COLORS.green,
        'stroke-width': '2.5',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      })
    };
    svg.appendChild(upArrow.shaft);
    svg.appendChild(upArrow.head);
    strokes.push(upArrow.shaft, upArrow.head);

    // Left arm outward from center (x: 201 -> 112 -> return)
    var armLeft = addStrokePair(
      'stroke-arm-left',
      'M 201 102 Q 156 100 112 103 Q 110 119 112 134 Q 157 136 201 134',
      'M 200 103.3 Q 156 101.2 113.2 104.2 Q 111.3 119 113.2 132.9 Q 157 134.8 200 132.8',
      COLORS.ink,
      2.8,
      1.2
    );

    // Right arm outward from center (x: 239 -> 328 -> return)
    var armRight = addStrokePair(
      'stroke-arm-right',
      'M 239 102 Q 284 100 328 103 Q 330 119 328 134 Q 283 136 239 134',
      'M 240 103.3 Q 284 101.2 326.8 104.2 Q 328.7 119 326.8 132.9 Q 283 134.8 240 132.8',
      COLORS.ink,
      2.8,
      1.2
    );

    // Deep red finished cross outline accent (two variants: full cross vs upright + Belong)
    var finishFull = svgEl('path', {
      id: 'stroke-finish-full',
      'class': 'svg-stroke',
      d: 'M 204 29 L 236 29 Q 237 66 236 105 L 325 106 L 325 131 L 236 131 Q 237 183 236 235 L 204 235 Q 203 183 204 131 L 115 131 L 115 106 L 204 105 Z',
      fill: 'none',
      stroke: COLORS.deepRed,
      'stroke-width': '1.9',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    });
    var finishBelong = svgEl('path', {
      id: 'stroke-finish-belong',
      'class': 'svg-stroke',
      d: 'M 204 29 L 236 29 Q 237 66 236 105 L 236 131 Q 237 183 236 235 L 204 235 Q 203 183 204 131 L 115 131 L 115 106 L 204 105 Z',
      fill: 'none',
      stroke: COLORS.deepRed,
      'stroke-width': '2.1',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    });
    svg.appendChild(finishFull);
    svg.appendChild(finishBelong);
    strokes.push(finishFull, finishBelong);

    // Marker icon group for BELONG (house + table of people on left side, x: 16..102)
    var belongIconsG = svgEl('g', { id: 'belong-icons', 'class': 'svg-fade', 'aria-hidden': 'true' });
    // Roof tint & table wash
    belongIconsG.appendChild(svgEl('polygon', {
      points: '32,78 55,58 78,78',
      fill: COLORS.belong,
      'fill-opacity': '0.16'
    }));
    belongIconsG.appendChild(svgEl('rect', {
      x: 34, y: 158, width: 42, height: 11, rx: 4,
      fill: COLORS.belong,
      'fill-opacity': '0.18'
    }));
    // House marker strokes
    belongIconsG.appendChild(svgEl('path', {
      d: 'M 30 79 L 55 57 L 80 79 M 36 76 L 36 104 L 74 104 L 74 76',
      fill: 'none',
      stroke: COLORS.ink,
      'stroke-width': '2.1',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }));
    belongIconsG.appendChild(svgEl('path', {
      d: 'M 49 104 L 49 88 Q 55 86 61 88 L 61 104',
      fill: 'none',
      stroke: COLORS.belong,
      'stroke-width': '1.8',
      'stroke-linecap': 'round'
    }));
    // Table + 3 people seated around it
    belongIconsG.appendChild(svgEl('circle', {
      cx: 41, cy: 147, r: 4.2, fill: '#FFFFFF', stroke: COLORS.ink, 'stroke-width': '1.8'
    }));
    belongIconsG.appendChild(svgEl('circle', {
      cx: 55, cy: 145, r: 4.5, fill: '#FFFFFF', stroke: COLORS.belong, 'stroke-width': '1.9'
    }));
    belongIconsG.appendChild(svgEl('circle', {
      cx: 69, cy: 147, r: 4.2, fill: '#FFFFFF', stroke: COLORS.ink, 'stroke-width': '1.8'
    }));
    belongIconsG.appendChild(svgEl('path', {
      d: 'M 35 157 Q 41 152 47 157 M 48 156 Q 55 151 62 156 M 63 157 Q 69 152 75 157',
      fill: 'none',
      stroke: COLORS.ink,
      'stroke-width': '1.7',
      'stroke-linecap': 'round'
    }));
    belongIconsG.appendChild(svgEl('path', {
      d: 'M 32 159 Q 55 156 78 159 L 76 170 Q 55 172 34 170 Z M 38 170 L 38 182 M 72 170 L 72 182',
      fill: 'none',
      stroke: COLORS.ink,
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }));
    belongIconsG.appendChild(svgEl('text', {
      x: 55,
      y: 196,
      'text-anchor': 'middle',
      fill: COLORS.inkSoft,
      'font-size': '9.5',
      'class': 'clean-label'
    }, 'home & table'));
    svg.appendChild(belongIconsG);

    // Go widening rings & Acts 1:8 labels (right side, centered around 328, 118)
    var goRingsG = svgEl('g', { id: 'go-rings', 'aria-hidden': 'true' });
    var ringPaths = [
      { id: 'go-ring-1', d: 'M 339 101 Q 350 118 339 135', w: 2.2 },
      { id: 'go-ring-2', d: 'M 353 87 Q 373 118 353 150', w: 2.0 },
      { id: 'go-ring-3', d: 'M 369 72 Q 400 118 369 166', w: 1.85 },
      { id: 'go-ring-4', d: 'M 386 56 Q 427 118 386 182', w: 1.7 }
    ];
    var ringNodes = [];
    ringPaths.forEach(function (rp) {
      var p = svgEl('path', {
        id: rp.id,
        'class': 'svg-stroke',
        d: rp.d,
        fill: 'none',
        stroke: COLORS.go,
        'stroke-width': String(rp.w),
        'stroke-linecap': 'round'
      });
      goRingsG.appendChild(p);
      ringNodes.push(p);
      strokes.push(p);
    });
    var goRingLabels = svgEl('g', { id: 'go-ring-labels', 'class': 'svg-fade' });
    goRingLabels.appendChild(svgEl('text', {
      x: 340, y: 91, 'text-anchor': 'end', fill: COLORS.go, 'font-size': '10', 'font-weight': '700', 'class': 'clean-label'
    }, 'home'));
    var workTxt = svgEl('text', {
      x: 353, y: 165, 'text-anchor': 'end', fill: COLORS.ink, 'font-size': '9.5', 'font-weight': '600', 'class': 'clean-label'
    });
    workTxt.appendChild(svgEl('tspan', { x: 353, dy: '0' }, 'work and'));
    workTxt.appendChild(svgEl('tspan', { x: 353, dy: '10.5' }, 'school'));
    goRingLabels.appendChild(workTxt);
    goRingLabels.appendChild(svgEl('text', {
      x: 382, y: 42, 'text-anchor': 'middle', fill: COLORS.ink, 'font-size': '9.5', 'font-weight': '600', 'class': 'clean-label'
    }, 'neighborhood'));
    goRingLabels.appendChild(svgEl('text', {
      x: 392, y: 198, 'text-anchor': 'middle', fill: COLORS.go, 'font-size': '10.5', 'font-weight': '700', 'class': 'clean-label'
    }, 'nations'));
    goRingsG.appendChild(goRingLabels);
    svg.appendChild(goRingsG);

    // Labels layer
    var labelsG = svgEl('g', { id: 'labels-layer', 'aria-hidden': 'true' });

    var lblOthers = svgEl('g', { id: 'lbl-others', 'class': 'svg-fade' });
    lblOthers.appendChild(svgEl('text', {
      x: 156, y: 123, 'text-anchor': 'middle', fill: '#4B555D', 'font-size': '14', 'class': 'hand-label'
    }, 'others'));
    lblOthers.appendChild(svgEl('text', {
      x: 284, y: 123, 'text-anchor': 'middle', fill: '#4B555D', 'font-size': '14', 'class': 'hand-label'
    }, 'others'));
    labelsG.appendChild(lblOthers);

    var lblBelong = svgEl('text', {
      id: 'lbl-belong',
      'class': 'svg-fade hand-label',
      x: 156,
      y: 94,
      'text-anchor': 'middle',
      fill: COLORS.belong,
      'font-size': '17'
    }, 'Belong');
    labelsG.appendChild(lblBelong);

    var lblGo = svgEl('text', {
      id: 'lbl-go',
      'class': 'svg-fade hand-label',
      x: 284,
      y: 94,
      'text-anchor': 'middle',
      fill: COLORS.go,
      'font-size': '17'
    }, 'Go');
    labelsG.appendChild(lblGo);

    var lbl201Captions = svgEl('g', { id: 'lbl-201-captions', 'class': 'svg-fade' });
    lbl201Captions.appendChild(svgEl('text', {
      x: 220,
      y: 186,
      transform: 'rotate(-90 220 186)',
      'text-anchor': 'middle',
      fill: COLORS.inkSoft,
      'font-size': '11',
      'font-weight': '600',
      'class': 'clean-label'
    }, 'Growing Deep'));
    lbl201Captions.appendChild(svgEl('text', {
      x: 156, y: 152, 'text-anchor': 'middle', fill: COLORS.muted || '#6E6559', 'font-size': '11', 'font-weight': '600', 'class': 'clean-label'
    }, 'Growing Up'));
    lbl201Captions.appendChild(svgEl('text', {
      x: 284, y: 152, 'text-anchor': 'middle', fill: COLORS.muted || '#6E6559', 'font-size': '11', 'font-weight': '600', 'class': 'clean-label'
    }, 'Growing Out'));
    labelsG.appendChild(lbl201Captions);

    var lbl202GoCaption = svgEl('text', {
      id: 'lbl-202-go-preview',
      'class': 'svg-fade clean-label',
      x: 287,
      y: 152,
      'text-anchor': 'middle',
      fill: '#7A7165',
      'font-size': '10',
      'font-weight': '600'
    }, 'Go: Growing Out');
    labelsG.appendChild(lbl202GoCaption);

    svg.appendChild(labelsG);

    return {
      svg: svg,
      svgTitle: svgTitle,
      svgDesc: svgDesc,
      strokes: strokes,
      parts: {
        uprightLeft: uprightLeft,
        uprightRight: uprightRight,
        downArrow: downArrow,
        upArrow: upArrow,
        armLeft: armLeft,
        armRight: armRight,
        finishFull: finishFull,
        finishBelong: finishBelong,
        uprightWash: uprightWash,
        armLeftWash: armLeftWash,
        armRightWash: armRightWash,
        finishedGlow: finishedGlow,
        belongIconsG: belongIconsG,
        ringNodes: ringNodes,
        goRingLabels: goRingLabels,
        lblOthers: lblOthers,
        lblBelong: lblBelong,
        lblGo: lblGo,
        lbl201Captions: lbl201Captions,
        lbl202GoCaption: lbl202GoCaption
      }
    };
  }

  function measureStrokeLengths(strokes) {
    strokes.forEach(function (path) {
      var len = 420;
      try {
        if (typeof path.getTotalLength === 'function') {
          len = Math.ceil(path.getTotalLength()) + 2;
        }
      } catch (e) {
        len = 420;
      }
      path.dataset.len = String(len);
      path.style.strokeDasharray = String(len);
      path.style.strokeDashoffset = String(len);
    });
  }

  function getStrokeColorForArm(mode) {
    if (mode === 'ink') return COLORS.ink;
    if (mode === 'lightInk') return '#6E665B';
    if (mode === 'blueGrey') return COLORS.neighbor;
    if (mode === 'belongBold') return COLORS.belong;
    if (mode === 'belongQuiet') return COLORS.belong;
    if (mode === 'goBold') return COLORS.go;
    return COLORS.ink;
  }

  function buildStrokeTargetMap(stepObj) {
    var d = stepObj.draw || {};
    var map = {};
    map['stroke-upright-left'] = { on: !!d.uprightLeft, color: COLORS.ink, w: 3.2 };
    map['stroke-upright-right'] = { on: !!d.uprightRight, color: COLORS.ink, w: 3.2 };
    map['arrow-down-shaft'] = { on: !!d.downArrow, color: COLORS.gold, w: 2.4 };
    map['arrow-down-head'] = { on: !!d.downArrow, color: COLORS.gold, w: 2.5 };
    map['arrow-up-shaft'] = { on: !!d.upArrow, color: COLORS.green, w: 2.4 };
    map['arrow-up-head'] = { on: !!d.upArrow, color: COLORS.green, w: 2.5 };
    map['stroke-arm-left'] = {
      on: !!d.armLeft,
      color: getStrokeColorForArm(d.armLeft),
      w: d.armLeft === 'belongBold' ? 3.4 : 2.7
    };
    map['stroke-arm-right'] = {
      on: !!d.armRight,
      color: getStrokeColorForArm(d.armRight),
      w: d.armRight === 'goBold' ? 3.4 : 2.7
    };
    map['stroke-finish-full'] = { on: d.finishedCross === 'full', color: COLORS.deepRed, w: 2.0 };
    map['stroke-finish-belong'] = { on: d.finishedCross === 'belongFocus', color: COLORS.deepRed, w: 2.1 };
    for (var i = 1; i <= 4; i++) {
      map['go-ring-' + i] = { on: !!d.goRings, color: COLORS.go, w: 2.3 - i * 0.15 };
    }
    return map;
  }

  function init() {
    injectStyles();
    var cfg = VERSIONS[VERSION];
    document.title = cfg.title;

    var host = document.getElementById('widget') || document.body;
    host.className = 'widget-outer';
    host.setAttribute('aria-label', cfg.regionLabel);
    host.innerHTML = '';

    var header = el('header', { 'class': 'title-bar' });
    header.appendChild(el('h1', null, cfg.title));
    header.appendChild(el('span', { 'class': 'course-tag' }, 'Course ' + VERSION));
    host.appendChild(header);

    var stage = el('div', { 'class': 'stage', id: 'stage' });
    var svgBundle = buildCrossSvg(cfg);
    stage.appendChild(svgBundle.svg);
    host.appendChild(stage);

    var strip = el('div', { 'class': 'step-strip', id: 'step-strip', role: 'group', 'aria-label': 'Lesson steps' });
    var pillButtons = cfg.steps.map(function (st, idx) {
      var btn = el('button', {
        'class': 'step-pill',
        type: 'button',
        'data-step': String(idx),
        'aria-label': st.pillLabel,
        'aria-pressed': 'false'
      }, st.pill);
      btn.style.setProperty('--pill-color', st.accent);
      btn.addEventListener('click', function () {
        goTo(idx);
      });
      strip.appendChild(btn);
      return btn;
    });
    host.appendChild(strip);

    var cardArea = el('section', { 'class': 'card-area', id: 'card-area', 'aria-live': 'polite' });
    var verseCard = el('div', { 'class': 'verse-card' });
    verseCard.appendChild(el('div', { 'class': 'verse-card-bar', 'aria-hidden': 'true' }));
    var contentEl = el('div', { 'class': 'verse-card-content', id: 'card-content' });
    var headingEl = el('h2', { 'class': 'card-heading', id: 'card-heading' });
    var verseWrap = el('p', { 'class': 'card-verse', id: 'card-verse' });
    var verseTextNode = el('span', { id: 'card-verse-text' });
    var refEl = el('span', { 'class': 'verse-ref', id: 'card-ref' });
    verseWrap.appendChild(verseTextNode);
    verseWrap.appendChild(refEl);
    var noteEl = el('span', { 'class': 'card-note', id: 'card-note' });
    contentEl.appendChild(headingEl);
    contentEl.appendChild(verseWrap);
    contentEl.appendChild(noteEl);
    verseCard.appendChild(contentEl);
    cardArea.appendChild(verseCard);

    var navBar = el('div', { 'class': 'nav-bar' });
    var prevBtn = el('button', { 'class': 'nav-btn', id: 'prev-btn', type: 'button' }, '\u2190 Back');
    var countEl = el('span', { 'class': 'step-count', id: 'step-count' });
    var nextBtn = el('button', { 'class': 'nav-btn primary', id: 'next-btn', type: 'button' }, 'Begin \u2192');
    navBar.appendChild(prevBtn);
    navBar.appendChild(countEl);
    navBar.appendChild(nextBtn);
    cardArea.appendChild(navBar);
    host.appendChild(cardArea);

    measureStrokeLengths(svgBundle.strokes);

    var reducedMotionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
    var currentStep = 0;
    var prevStrokeMap = buildStrokeTargetMap(cfg.steps[0]);

    function applyWashAndLabelState(stepObj, animate) {
      var d = stepObj.draw || {};
      var p = svgBundle.parts;
      var washDelay = animate ? (stepObj.quickUpright || stepObj.quickReview203 ? '240ms' : '420ms') : '0ms';

      p.uprightWash.style.setProperty('--fade-delay', washDelay);
      p.uprightWash.classList.toggle('is-visible', !!d.uprightWash);

      p.armLeftWash.style.setProperty('--fade-delay', washDelay);
      if (d.armLeftWash === 'belong') {
        p.armLeftWash.setAttribute('fill', COLORS.belong);
        p.armLeftWash.setAttribute('fill-opacity', '0.16');
      } else if (d.armLeftWash === 'belongSoft') {
        p.armLeftWash.setAttribute('fill', COLORS.belong);
        p.armLeftWash.setAttribute('fill-opacity', '0.10');
      } else if (d.armLeftWash === 'blueGrey') {
        p.armLeftWash.setAttribute('fill', COLORS.neighbor);
        p.armLeftWash.setAttribute('fill-opacity', '0.11');
      } else {
        p.armLeftWash.setAttribute('fill', '#7A7267');
        p.armLeftWash.setAttribute('fill-opacity', '0.09');
      }
      p.armLeftWash.classList.toggle('is-visible', !!d.armLeftWash);

      p.armRightWash.style.setProperty('--fade-delay', washDelay);
      if (d.armRightWash === 'go') {
        p.armRightWash.setAttribute('fill', COLORS.go);
        p.armRightWash.setAttribute('fill-opacity', '0.16');
      } else if (d.armRightWash === 'blueGrey') {
        p.armRightWash.setAttribute('fill', COLORS.neighbor);
        p.armRightWash.setAttribute('fill-opacity', '0.11');
      } else {
        p.armRightWash.setAttribute('fill', '#7A7267');
        p.armRightWash.setAttribute('fill-opacity', '0.09');
      }
      p.armRightWash.classList.toggle('is-visible', !!d.armRightWash);

      p.finishedGlow.setAttribute(
        'd',
        d.finishedCross === 'belongFocus'
          ? 'M 202 27 L 238 27 L 239 238 L 202 238 L 201 134 L 112 134 L 112 103 L 201 102 Z'
          : 'M 202 27 L 238 27 L 239 102 L 328 103 L 328 134 L 239 134 L 238 238 L 202 238 L 201 134 L 112 134 L 112 103 L 201 102 Z'
      );
      p.finishedGlow.style.setProperty('--fade-delay', animate ? '260ms' : '0ms');
      p.finishedGlow.classList.toggle('is-visible', !!d.finishedCross);

      p.lblOthers.style.setProperty('--fade-delay', washDelay);
      p.lblOthers.classList.toggle('is-visible', !!d.labelOthers);

      p.lblBelong.style.setProperty('--fade-delay', washDelay);
      p.lblBelong.classList.toggle('is-visible', d.labelBelong === 'bold');
      p.lblBelong.classList.toggle('is-soft', d.labelBelong === 'soft');

      p.lblGo.style.setProperty('--fade-delay', washDelay);
      p.lblGo.classList.toggle('is-visible', !!d.labelGo);

      p.belongIconsG.style.setProperty('--fade-delay', washDelay);
      p.belongIconsG.classList.toggle('is-visible', d.belongIcons === 'bold');
      p.belongIconsG.classList.toggle('is-soft', d.belongIcons === 'soft');

      p.goRingLabels.style.setProperty('--fade-delay', animate ? '460ms' : '0ms');
      p.goRingLabels.classList.toggle('is-visible', !!d.goRings);

      p.lbl201Captions.style.setProperty('--fade-delay', animate ? '320ms' : '0ms');
      p.lbl201Captions.classList.toggle('is-visible', !!d.previewCaptions);

      p.lbl202GoCaption.style.setProperty('--fade-delay', animate ? '220ms' : '0ms');
      p.lbl202GoCaption.classList.toggle('is-visible', !!d.goPreviewCaption);
    }

    function applyStrokePair(mainId, target, treatAsAlreadyOn, animate, fadeOutIds, durMs) {
      var pairs = [document.getElementById(mainId), document.getElementById(mainId + '-tex')];
      pairs.forEach(function (node) {
        if (!node) return;
        var len = node.dataset.len || '400';
        var isTex = node.id.indexOf('-tex') !== -1;
        node.style.setProperty('--stroke-dur', durMs + 'ms');
        node.setAttribute('stroke', target.color);
        if (!isTex && target.w) {
          node.setAttribute('stroke-width', String(target.w));
        }
        if (target.on) {
          if (animate && !treatAsAlreadyOn) {
            node.style.strokeDashoffset = len;
            node.classList.add('is-visible');
          } else {
            node.style.strokeDashoffset = '0';
            node.classList.add('is-visible');
          }
        } else if (animate && treatAsAlreadyOn) {
          node.style.strokeDashoffset = '0';
          node.classList.add('is-visible');
          fadeOutIds.push(node.id);
        } else {
          node.classList.remove('is-visible');
          node.style.strokeDashoffset = len;
        }
      });
    }

    function goTo(targetIdx) {
      var nextIdx = Math.max(0, Math.min(cfg.steps.length - 1, targetIdx));
      var st = cfg.steps[nextIdx];
      var isForward = nextIdx === currentStep + 1;
      var animate = isForward && !reducedMotionQuery.matches;
      var nextStrokeMap = buildStrokeTargetMap(st);
      var strokeDur = (st.quickUpright || st.quickReview203) ? 460 : 720;

      // Instant baseline setup (zero transition during reset/Back/jump)
      host.classList.add('is-instant');

      var newlyDrawnIds = [];
      var fadeOutIds = [];
      Object.keys(nextStrokeMap).forEach(function (id) {
        var nextT = nextStrokeMap[id];
        var wasT = prevStrokeMap[id] || { on: false };
        var forceRedraw = !!(st.redrawLeftArm && id === 'stroke-arm-left');
        var treatAsOn = !forceRedraw && wasT.on;
        var singleNode = document.getElementById(id);
        var hasTex = !!document.getElementById(id + '-tex');

        if (animate && nextT.on && !treatAsOn) {
          newlyDrawnIds.push(id);
        }

        if (hasTex) {
          applyStrokePair(id, nextT, treatAsOn, animate, fadeOutIds, strokeDur);
        } else if (singleNode) {
          var len = singleNode.dataset.len || '300';
          singleNode.style.setProperty('--stroke-dur', strokeDur + 'ms');
          if (nextT.color) singleNode.setAttribute('stroke', nextT.color);
          if (nextT.on) {
            if (animate && !treatAsOn) {
              singleNode.style.strokeDashoffset = len;
              singleNode.classList.add('is-visible');
            } else {
              singleNode.style.strokeDashoffset = '0';
              singleNode.classList.add('is-visible');
            }
          } else {
            singleNode.classList.remove('is-visible');
            singleNode.style.strokeDashoffset = len;
          }
        }
      });

      applyWashAndLabelState(st, animate);

      if (animate) {
        void svgBundle.svg.getBoundingClientRect();
        host.classList.remove('is-instant');
        newlyDrawnIds.forEach(function (id) {
          var mainNode = document.getElementById(id);
          var texNode = document.getElementById(id + '-tex');
          if (mainNode) mainNode.style.strokeDashoffset = '0';
          if (texNode) texNode.style.strokeDashoffset = '0';
        });
        fadeOutIds.forEach(function (id) {
          var fadeNode = document.getElementById(id);
          if (fadeNode) fadeNode.classList.remove('is-visible');
        });
      } else {
        void svgBundle.svg.getBoundingClientRect();
        if (!reducedMotionQuery.matches) {
          host.classList.remove('is-instant');
        }
      }

      prevStrokeMap = nextStrokeMap;
      currentStep = nextIdx;

      document.documentElement.style.setProperty('--step-color', st.accent);
      document.documentElement.style.setProperty('--step-dark', st.accentDark);
      svgBundle.svgDesc.textContent = st.desc;

      pillButtons.forEach(function (btn, idx) {
        btn.classList.toggle('active', idx === currentStep);
        btn.classList.toggle('passed', idx > 0 && idx < currentStep);
        btn.setAttribute('aria-pressed', idx === currentStep ? 'true' : 'false');
      });

      headingEl.textContent = st.heading;
      verseTextNode.textContent = st.verse;
      refEl.textContent = st.ref;
      noteEl.textContent = st.note;
      countEl.textContent = currentStep === 0 ? 'Ready' : ('Step ' + currentStep + ' of ' + (cfg.steps.length - 1));

      prevBtn.disabled = currentStep === 0;
      if (currentStep === 0) {
        nextBtn.textContent = 'Begin \u2192';
      } else if (currentStep === cfg.steps.length - 1) {
        nextBtn.textContent = '\u21BB Start Over';
      } else {
        nextBtn.textContent = 'Next \u2192';
      }
    }

    prevBtn.addEventListener('click', function () {
      if (currentStep > 0) goTo(currentStep - 1);
    });

    nextBtn.addEventListener('click', function () {
      if (currentStep === cfg.steps.length - 1) {
        goTo(0);
      } else {
        goTo(currentStep + 1);
      }
    });

    // Measure tallest card once at load and only when width changes (per widget.md)
    var lastWidth = window.innerWidth;
    var measuredAtWidth = 0;

    function fitCardHeight() {
      if (!contentEl || contentEl.clientWidth === measuredAtWidth) return;
      measuredAtWidth = contentEl.clientWidth;
      var keepH = headingEl.textContent;
      var keepV = verseTextNode.textContent;
      var keepR = refEl.textContent;
      var keepN = noteEl.textContent;
      var tallest = 0;
      document.documentElement.style.setProperty('--card-h', '0px');
      cfg.steps.forEach(function (st) {
        headingEl.textContent = st.heading;
        verseTextNode.textContent = st.verse;
        refEl.textContent = st.ref;
        noteEl.textContent = st.note;
        tallest = Math.max(tallest, contentEl.offsetHeight);
      });
      headingEl.textContent = keepH;
      verseTextNode.textContent = keepV;
      refEl.textContent = keepR;
      noteEl.textContent = keepN;
      document.documentElement.style.setProperty('--card-h', Math.max(108, tallest) + 'px');
    }

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(fitCardHeight, 120);
    });

    goTo(0);
    fitCardHeight();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
