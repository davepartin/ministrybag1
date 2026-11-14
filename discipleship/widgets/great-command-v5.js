(function () {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var VERSION = String(window.GREAT_COMMAND_VERSION || '201');
  if (VERSION !== '201' && VERSION !== '202' && VERSION !== '203') {
    VERSION = '201';
  }

  // Version 5: Editorial Studio Print & Luminous Wash (201, 202, 203)
  var COLORS = {
    ink: '#2C2416',
    muted: '#6E6559',
    paper: '#FFFFFF',
    tray: '#F6F4EE',
    gold: '#A8760A',
    goldDark: '#7D5604',
    goldWash: '#FCF2D6',
    goldSweep: '#C48F10',
    green: '#1F684A',
    greenDark: '#164E37',
    greenWash: '#E1F1E9',
    greenSweep: '#2E7D5B',
    church: '#2A5B7C',
    churchDark: '#1E435C',
    churchWash: '#E2EEF6',
    churchSweep: '#3B6F91',
    lost: '#5F4684',
    lostDark: '#473366',
    lostWash: '#EDE7F6',
    lostSweep: '#705598',
    deepRed: '#8B1A2B',
    deepRedDark: '#6D1422'
  };

  var GEO = {
    W: 440,
    H: 278,
    cx: 220,
    upXLeft: 196,
    upXRight: 244,
    halfW: 24,
    upTop: 18,
    upBot: 262,
    upH: 244,
    armLeftX: 104,
    armRightX: 336,
    armLen: 92,
    armTop: 76,
    armBot: 120,
    armH: 44,
    armMidY: 98,
    pad: 8
  };

  var VERSIONS = {
    '201': {
      title: 'The Greatest Commandment',
      courseTag: 'Course 201',
      regionLabel: 'Interactive cross drawing for 201 Loving God (Version 5)',
      svgTitle: 'The Greatest Commandment Cross (Growing Deep - Studio Wash)',
      steps: [
        {
          id: 'start',
          pillLabel: 'Start: The Greatest Commandment',
          heading: 'The Greatest Commandment',
          verse: '"Which commandment is the most important of all?"',
          ref: 'Mark 12:28',
          note: 'Jesus was asked which commandment matters most. Watch His answer take shape.',
          accent: COLORS.ink,
          accentDark: COLORS.ink,
          draw: {},
          desc: 'Clean white stage ready for the cross to take shape step by step.'
        },
        {
          id: 'down',
          pillLabel: "Step 1: God's Love Comes Down",
          heading: "God's Love Comes Down",
          verse: '"We love because he first loved us."',
          ref: '1 John 4:19',
          note: 'Everything starts with God. His love comes to you before you do anything.',
          accent: COLORS.gold,
          accentDark: COLORS.goldDark,
          draw: { upLeft: true, lblGod: true },
          desc: 'A sunlit gold wash sweeps down the left half of the upright beam, labeled God loves us.'
        },
        {
          id: 'up',
          pillLabel: 'Step 2: Love God With All You Are',
          heading: 'Love God With All You Are',
          verse: '"And you shall love the Lord your God with all your heart and with all your soul and with all your mind and with all your strength."',
          ref: 'Mark 12:30',
          note: 'Your love goes back up to Him, not to earn His love, but because you already have it.',
          accent: COLORS.green,
          accentDark: COLORS.greenDark,
          draw: { upLeft: true, lblGod: true, upRight: true, lblWe: true },
          desc: 'A deep sage green wash sweeps up the right half of the upright beam, labeled We love God.'
        },
        {
          id: 'church',
          pillLabel: 'Step 3: Love the Church',
          heading: 'Love the Church',
          verse: '"The second is this: \'You shall love your neighbor as yourself.\' There is no other commandment greater than these."',
          ref: 'Mark 12:31',
          note: "Loving your neighbor starts close to home, with your family and God's family in the church.",
          accent: COLORS.church,
          accentDark: COLORS.churchDark,
          draw: { upLeft: true, lblGod: true, upRight: true, lblWe: true, armLeft: true, lblChurch: true },
          desc: 'A harbour blue wash sweeps left from the center, labeled Love the Church.'
        },
        {
          id: 'lost',
          pillLabel: 'Step 4: Love the Lost',
          heading: 'Love the Lost',
          verse: '"As the Father has sent me, even so I am sending you."',
          ref: 'John 20:21',
          note: 'The same love overflows outward to people who do not yet know Jesus.',
          accent: COLORS.lost,
          accentDark: COLORS.lostDark,
          draw: {
            upLeft: true, lblGod: true,
            upRight: true, lblWe: true,
            armLeft: true, lblChurch: true,
            armRight: true, lblLost: true
          },
          desc: 'A muted plum wash sweeps right from the center, labeled Love the Lost.'
        },
        {
          id: 'final',
          pillLabel: 'Step 5: The Cross Holds It All',
          heading: 'The Cross Holds It All',
          verse: '"And walk in love, as Christ loved us and gave himself up for us, a fragrant offering and sacrifice to God."',
          ref: 'Ephesians 5:2',
          note: "Christ's cross is the power that makes all this possible. Love comes down, goes up, and reaches out.",
          accent: COLORS.deepRed,
          accentDark: COLORS.deepRedDark,
          draw: {
            upLeft: true, lblGod: true,
            upRight: true, lblWe: true,
            armLeft: true, lblChurch: true,
            armRight: true, lblLost: true,
            crossContour: true
          },
          desc: 'A refined crimson double contour slowly traces around the entire cross, uniting all four loves.'
        }
      ]
    },
    '202': {
      title: 'Love Reaches Out',
      courseTag: 'Course 202',
      regionLabel: 'Interactive cross drawing for 202 Loving Your Neighbors (Version 5)',
      svgTitle: 'Love Reaches Out Cross (Growing Up - Studio Wash)',
      steps: [
        {
          id: 'start',
          pillLabel: 'Start: Love Begins With God',
          heading: 'Love Begins With God',
          verse: '"Beloved, let us love one another, for love is from God, and whoever loves has been born of God and knows God."',
          ref: '1 John 4:7',
          note: 'Growing Deep rooted you in God. Now Growing Up carries that love to the people beside you.',
          accent: COLORS.ink,
          accentDark: COLORS.ink,
          draw: {},
          desc: 'Clean white stage ready to connect vertical love with loving your neighbors.'
        },
        {
          id: 'vertical',
          pillLabel: 'Step 1: Loved First',
          heading: 'Loved First',
          verse: '"We love because he first loved us."',
          ref: '1 John 4:19',
          note: 'You do not love neighbors out of an empty tank. His love comes down, and yours rises back to Him.',
          accent: COLORS.green,
          accentDark: COLORS.greenDark,
          draw: { upLeft: true, lblGod: true, upRight: true, lblWe: true },
          desc: 'Gold down and green up washes sweep the vertical beam in parallel.'
        },
        {
          id: 'neighbors',
          pillLabel: 'Step 2: Love Your Neighbor as Yourself',
          heading: 'Love Your Neighbor as Yourself',
          verse: '"And a second is like it: You shall love your neighbor as yourself."',
          ref: 'Matthew 22:39',
          note: 'The second command flows straight out of the first, reaching across both arms of the cross.',
          accent: COLORS.church,
          accentDark: COLORS.churchDark,
          draw: {
            upLeft: true, lblGod: true, upRight: true, lblWe: true,
            armLeft: true, lblChurch: true, armRight: true, lblLost: true
          },
          desc: 'Harbour blue and royal plum washes sweep outward left and right across the horizontal crossbar.'
        },
        {
          id: 'cross',
          pillLabel: 'Step 3: Christ Crossed Over First',
          heading: 'Christ Crossed Over First',
          verse: '"And walk in love, as Christ loved us and gave himself up for us, a fragrant offering and sacrifice to God."',
          ref: 'Ephesians 5:2',
          note: 'At the cross, Jesus crossed the widest distance for you. Now His love flows through you.',
          accent: COLORS.deepRed,
          accentDark: COLORS.deepRedDark,
          draw: {
            upLeft: true, lblGod: true, upRight: true, lblWe: true,
            armLeft: true, lblChurch: true, armRight: true, lblLost: true,
            crossContour: true
          },
          desc: 'The crimson double hairline unites the entire cross.'
        },
        {
          id: 'focus202',
          pillLabel: 'Step 4: Love in Everyday Life',
          heading: 'Love in Everyday Life',
          verse: '"So then, as we have opportunity, let us do good to everyone, and especially to those who are of the household of faith."',
          ref: 'Galatians 6:10',
          note: "Growing Up helps you put God's love into practice at home, in your church family, and among your neighbors, through generosity, faithful relationships, and care in hard seasons.",
          accent: COLORS.church,
          accentDark: COLORS.churchDark,
          draw: {
            upLeft: true, lblGod: true, upRight: true, lblWe: true,
            armLeft: true, lblChurch: true, armRight: true, lblLost: true,
            crossContour: true,
            ghostVertical: true,
            ghostCross: true,
            focus202: true
          },
          desc: 'The upright beam fades to a quiet watermark while gentle blue and purple lines connect the horizontal arms to a single house for family and the family of God on the left and a neighborhood of houses labeled BLESS your neighborhood on the right.'
        }
      ]
    },
    '203': {
      title: 'Love Goes Out',
      courseTag: 'Course 203',
      regionLabel: 'Interactive cross drawing for 203 Personal Ministry (Version 5)',
      svgTitle: 'Love Goes Out Cross (Growing Out - Studio Wash)',
      steps: [
        {
          id: 'start',
          pillLabel: 'Start: Welcome to Growing Out',
          heading: 'Welcome to Growing Out',
          verse: '"Go therefore and make disciples of all nations..."',
          ref: 'Matthew 28:19',
          note: 'Growing Deep and Growing Up anchored your life with God and His family. Now love moves outward.',
          accent: COLORS.ink,
          accentDark: COLORS.ink,
          draw: {},
          desc: 'Clean white stage ready to connect courses 201 and 202 to 203.'
        },
        {
          id: 'foundation',
          pillLabel: 'Step 1: What You Already Carry',
          heading: 'Rooted in God and His Church',
          verse: '"We love because he first loved us."',
          ref: '1 John 4:19',
          note: 'You never go on empty. Loved by God and held in the church family, you are ready to be sent.',
          accent: COLORS.church,
          accentDark: COLORS.churchDark,
          draw: {
            upLeft: true, lblGod: true, upRight: true, lblWe: true,
            armLeft: true, lblChurch: true
          },
          desc: 'Gold, green, and harbour blue beams establish the 201 and 202 foundation.'
        },
        {
          id: 'go',
          pillLabel: 'Step 2: Sent to People Who Do Not Know Jesus',
          heading: 'Love the Lost',
          verse: '"As the Father has sent me, even so I am sending you."',
          ref: 'John 20:21',
          note: 'Love now stretches outward to people who do not yet know Jesus.',
          accent: COLORS.lost,
          accentDark: COLORS.lostDark,
          draw: {
            upLeft: true, lblGod: true, upRight: true, lblWe: true,
            armLeft: true, lblChurch: true, armRight: true, lblLost: true
          },
          desc: 'The royal plum wash sweeps rightward across the horizontal arm toward Love the Lost.'
        },
        {
          id: 'cross',
          pillLabel: 'Step 3: The Cross Sends Us',
          heading: 'The Cross Holds It All',
          verse: '"And walk in love, as Christ loved us and gave himself up for us, a fragrant offering and sacrifice to God."',
          ref: 'Ephesians 5:2',
          note: 'The finished cross carries this love out through ordinary believers like you.',
          accent: COLORS.deepRed,
          accentDark: COLORS.deepRedDark,
          draw: {
            upLeft: true, lblGod: true, upRight: true, lblWe: true,
            armLeft: true, lblChurch: true, armRight: true, lblLost: true,
            crossContour: true
          },
          desc: 'The crimson double hairline unites the entire cross.'
        },
        {
          id: 'focus203',
          pillLabel: 'Step 4: Make Disciples Where You Are',
          heading: 'Make Disciples Where You Are',
          verse: '"Go therefore and make disciples of all nations"',
          ref: 'Matthew 28:19',
          note: 'Pray, listen, eat, serve, and share Jesus with the people around you. Go out and make disciples who will make disciples.',
          accent: COLORS.lost,
          accentDark: COLORS.lostDark,
          draw: {
            upLeft: true, lblGod: true, upRight: true, lblWe: true,
            armLeft: true, lblChurch: true, armRight: true, lblLost: true,
            crossContour: true,
            ghostVertical: true,
            ghostLeftArm: true,
            ghostCross: true,
            focus203: true
          },
          desc: 'The vertical and left beams soften into a quiet watermark, spotlighting Go above a 1 to 2 to 4 table multiplication pyramid below.'
        }
      ]
    }
  };
  var CONFIG = VERSIONS[VERSION];

  var STYLES = [
    ':root {',
    '  --ink: #2C2416;',
    '  --muted: #6E6559;',
    '  --tray: #F6F4EE;',
    '  --border: #EBE5D9;',
    '  --step-color: #2C2416;',
    '  --step-dark: #2C2416;',
    '  --card-h: 112px;',
    '}',
    '*, *::before, *::after { box-sizing: border-box; }',
    'body {',
    '  padding: 0;',
    '  margin: 0;',
    '  font-family: Georgia, Cambria, serif;',
    '  background: #F8F6F1;',
    '  color: var(--ink);',
    '  -webkit-font-smoothing: antialiased;',
    '}',
    '.widget-outer {',
    '  background: #FFFFFF;',
    '  border-radius: 0;',
    '  overflow: hidden;',
    '  box-shadow: none;',
    '  border: none;',
    '  max-width: 100%;',
    '  width: 100%;',
    '  margin: 0;',
    '  position: relative;',
    '}',
    '@media (min-width: 560px) {',
    '  body { padding: 16px; background: #F8F6F1; }',
    '  .widget-outer {',
    '    border-radius: 12px;',
    '    box-shadow: 0 6px 20px rgba(44, 36, 22, 0.08);',
    '    border: 1px solid #EBE5D9;',
    '    max-width: 460px;',
    '    margin: 0 auto;',
    '  }',
    '}',
    '.title-bar {',
    '  background: #2C2416;',
    '  padding: 8px 14px;',
    '  display: flex;',
    '  align-items: center;',
    '  justify-content: space-between;',
    '  gap: 8px;',
    '}',
    '.title-bar h1 {',
    '  font: 600 17px/1.15 system-ui, -apple-system, sans-serif;',
    '  color: #FAF8F3;',
    '  letter-spacing: 0.2px;',
    '  margin: 0;',
    '}',
    '.course-tag {',
    '  font: 600 11px/1 system-ui, -apple-system, sans-serif;',
    '  letter-spacing: 0.9px;',
    '  text-transform: uppercase;',
    '  color: #E5DEC9;',
    '  white-space: nowrap;',
    '}',
    '.stage {',
    '  background: #FFFFFF;',
    '  padding: 6px 8px 4px;',
    '  border-bottom: 1px solid var(--border);',
    '}',
    '.cross-svg { display: block; width: 100%; height: auto; }',
    '.beam-label {',
    '  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;',
    '  font-size: 14.5px;',
    '  font-weight: 700;',
    '  letter-spacing: 0.15px;',
    '  opacity: 0;',
    '  pointer-events: none;',
    '}',
    '.beam-label.is-visible { opacity: 1; }',
    '.beam-label.is-visible.is-ghost { opacity: 0.14; }',
    '.ghostable { opacity: 1; }',
    '.ghostable.is-ghost { opacity: 0.13; }',
    '.cross-contour { fill: none; stroke-linecap: round; stroke-linejoin: round; }',
    '.cross-contour-group { opacity: 1; }',
    '.cross-contour-group.is-ghost { opacity: 0.13; }',
    '.center-bridge { opacity: 0; pointer-events: none; }',
    '.center-bridge.is-visible { opacity: 1; }',
    '.v5-overlay { opacity: 0; pointer-events: none; }',
    '.v5-overlay.is-visible { opacity: 1; }',
    '.v5-stage-item { opacity: 0; pointer-events: none; }',
    '.v5-stage-item.is-visible { opacity: 1; }',
    '.mission-arc { fill: none; stroke-linecap: round; stroke-linejoin: round; }',
    '.overlay-head { font: 700 13.5px/1.15 system-ui, -apple-system, sans-serif; }',
    '.overlay-sub { font: 600 11.5px/1.15 system-ui, -apple-system, sans-serif; fill: #5B5347; }',
    '.arm-go-word { font: 700 15px/1 system-ui, -apple-system, sans-serif; fill: #5F4684; letter-spacing: 0.2px; }',
    '.center-seam { opacity: 0; }',
    '.center-seam.is-visible { opacity: 0.5; }',
    '.center-seam.is-visible.is-ghost { opacity: 0.08; }',
    '.sweep-arrow { opacity: 0; pointer-events: none; }',
    '.sweep-arrow.is-active { opacity: 0.9; }',
    '@media (prefers-reduced-motion: no-preference) {',
    '  .widget-outer:not(.is-instant) .beam-label,',
    '  .widget-outer:not(.is-instant) .center-seam,',
    '  .widget-outer:not(.is-instant) .ghostable,',
    '  .widget-outer:not(.is-instant) .cross-contour-group,',
    '  .widget-outer:not(.is-instant) .center-bridge,',
    '  .widget-outer:not(.is-instant) .v5-overlay,',
    '  .widget-outer:not(.is-instant) .v5-stage-item {',
    '    transition: opacity 0.48s ease var(--fade-delay, 0ms);',
    '  }',
    '  .widget-outer .step-dot-fill {',
    '    transition: background-color 0.22s ease, border-color 0.22s ease, transform 0.22s ease;',
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
    '  align-items: center;',
    '  gap: 8px;',
    '  padding: 6px 12px 5px;',
    '  background: var(--tray);',
    '  border-bottom: 1px solid var(--border);',
    '}',
    '.step-dot {',
    '  appearance: none;',
    '  min-width: 28px;',
    '  min-height: 28px;',
    '  padding: 4px;',
    '  border: none;',
    '  background: transparent;',
    '  display: inline-flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  cursor: pointer;',
    '  border-radius: 50%;',
    '}',
    '.step-dot-fill {',
    '  width: 16px;',
    '  height: 16px;',
    '  border-radius: 50%;',
    '  border: 2.5px solid var(--dot-color, var(--ink));',
    '  background: #FFFFFF;',
    '  display: block;',
    '}',
    '.step-dot.passed .step-dot-fill {',
    '  background: color-mix(in srgb, var(--dot-color, var(--ink)) 22%, #FFFFFF);',
    '}',
    '.step-dot.active .step-dot-fill {',
    '  background: var(--dot-color, var(--ink));',
    '  transform: scale(1.12);',
    '}',
    '.card-area { background: var(--tray); padding: 7px 12px 10px; }',
    '.verse-card {',
    '  background: #FFFFFF;',
    '  border-radius: 10px;',
    '  overflow: hidden;',
    '  border: 1px solid #EBE5D9;',
    '  box-shadow: 0 2px 10px rgba(44, 36, 22, 0.05);',
    '}',
    '.verse-card-bar { height: 4px; background: var(--step-color); }',
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
    '.card-verse { font: 13.5px/1.36 Georgia, Cambria, serif; color: #3D3426; margin: 0; }',
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
    '.nav-btn.primary { background: var(--step-color); border-color: var(--step-color); color: #FFFFFF; }',
    '.nav-btn:disabled { opacity: 0.36; cursor: default; }',
    '.step-count { font: 600 12px system-ui, -apple-system, sans-serif; color: var(--muted); }',
    'button:focus-visible { outline: 3px solid #E0A526; outline-offset: 2px; }',
    '@media (max-width: 395px) {',
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
        if (attrs[k] !== null && attrs[k] !== undefined) node.setAttribute(k, String(attrs[k]));
      });
    }
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function svgEl(tag, attrs, text) {
    var node = document.createElementNS(SVG_NS, tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (attrs[k] !== null && attrs[k] !== undefined) node.setAttribute(k, String(attrs[k]));
      });
    }
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function injectStyles() {
    if (document.getElementById('gc-v5-styles')) return;
    var style = document.createElement('style');
    style.id = 'gc-v5-styles';
    style.textContent = STYLES;
    document.head.appendChild(style);
  }

  function crossContourPath(pad) {
    var xl = GEO.upXLeft - pad;
    var xr = GEO.upXRight + pad;
    var al = GEO.armLeftX - pad;
    var ar = GEO.armRightX + pad;
    var top = GEO.upTop - pad;
    var bot = GEO.upBot + pad;
    var at = GEO.armTop - pad;
    var ab = GEO.armBot + pad;
    return [
      'M', GEO.cx, top,
      'L', xr, top,
      'L', xr, at,
      'L', ar, at,
      'L', ar, ab,
      'L', xr, ab,
      'L', xr, bot,
      'L', xl, bot,
      'L', xl, ab,
      'L', al, ab,
      'L', al, at,
      'L', xl, at,
      'L', xl, top,
      'Z'
    ].join(' ');
  }

  function buildCrossSvg() {
    var svg = svgEl('svg', {
      'class': 'cross-svg',
      viewBox: '0 0 ' + GEO.W + ' ' + GEO.H,
      width: '100%',
      role: 'img',
      'aria-labelledby': 'gc5-svg-title gc5-svg-desc'
    });

    svg.appendChild(svgEl('title', { id: 'gc5-svg-title' }, CONFIG.svgTitle));
    var svgDesc = svgEl('desc', { id: 'gc5-svg-desc' }, CONFIG.steps[0].desc);
    svg.appendChild(svgDesc);

    var defs = svgEl('defs');

    function addClip(id, x, y, w, h) {
      var cp = svgEl('clipPath', { id: id });
      var rect = svgEl('rect', { x: x, y: y, width: w, height: h });
      cp.appendChild(rect);
      defs.appendChild(cp);
      return rect;
    }

    var clipUpLeft = addClip('v5-clip-up-left', GEO.upXLeft - 2, GEO.upTop - 2, GEO.halfW + 3, 0);
    var clipUpRight = addClip('v5-clip-up-right', GEO.cx - 1, GEO.upBot + 2, GEO.halfW + 3, 0);
    var clipArmLeft = addClip('v5-clip-arm-left', GEO.upXLeft, GEO.armTop - 2, 0, GEO.armH + 4);
    var clipArmRight = addClip('v5-clip-arm-right', GEO.upXRight, GEO.armTop - 2, 0, GEO.armH + 4);

    var bridgeGrad = svgEl('linearGradient', { id: 'v5-bridge-grad', x1: '0%', y1: '0%', x2: '100%', y2: '0%' });
    bridgeGrad.appendChild(svgEl('stop', { offset: '0%', 'stop-color': COLORS.churchWash }));
    bridgeGrad.appendChild(svgEl('stop', { offset: '100%', 'stop-color': COLORS.lostWash }));
    defs.appendChild(bridgeGrad);
    svg.appendChild(defs);

    // Subtle geometric axis guide marks (faint studio blueprint ticks, barely visible)
    var axis = svgEl('g', { 'aria-hidden': 'true', opacity: '0.18' });
    axis.appendChild(svgEl('line', {
      x1: GEO.cx, y1: GEO.upTop - 12, x2: GEO.cx, y2: GEO.upBot + 12,
      stroke: '#D8D1C5', 'stroke-width': '1', 'stroke-dasharray': '3 4'
    }));
    axis.appendChild(svgEl('line', {
      x1: GEO.armLeftX - 18, y1: GEO.armMidY, x2: GEO.armRightX + 18, y2: GEO.armMidY,
      stroke: '#D8D1C5', 'stroke-width': '1', 'stroke-dasharray': '3 4'
    }));
    svg.appendChild(axis);

    // 1. Horizontal arms drawn first so the vertical upright sits cleanly on top at the intersection
    var armLeftGroup = svgEl('g', { 'class': 'ghostable', 'clip-path': 'url(#v5-clip-arm-left)' });
    armLeftGroup.appendChild(svgEl('rect', {
      x: GEO.armLeftX, y: GEO.armTop, width: GEO.armLen + 2, height: GEO.armH,
      fill: COLORS.churchWash, stroke: COLORS.church, 'stroke-width': '1.6', 'stroke-opacity': '0.55'
    }));
    // Double chevron watermark pointing left
    armLeftGroup.appendChild(svgEl('path', {
      d: 'M 124 88 L 114 98 L 124 108',
      fill: 'none', stroke: COLORS.church, 'stroke-width': '3',
      'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: '0.55'
    }));
    armLeftGroup.appendChild(svgEl('path', {
      d: 'M 134 90 L 126 98 L 134 106',
      fill: 'none', stroke: COLORS.church, 'stroke-width': '2.4',
      'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: '0.26'
    }));
    svg.appendChild(armLeftGroup);

    var armRightGroup = svgEl('g', { 'class': 'ghostable', 'clip-path': 'url(#v5-clip-arm-right)' });
    armRightGroup.appendChild(svgEl('rect', {
      x: GEO.upXRight - 2, y: GEO.armTop, width: GEO.armLen + 2, height: GEO.armH,
      fill: COLORS.lostWash, stroke: COLORS.lost, 'stroke-width': '1.6', 'stroke-opacity': '0.55'
    }));
    armRightGroup.appendChild(svgEl('path', {
      d: 'M 316 88 L 326 98 L 316 108',
      fill: 'none', stroke: COLORS.lost, 'stroke-width': '3',
      'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: '0.55'
    }));
    armRightGroup.appendChild(svgEl('path', {
      d: 'M 306 90 L 314 98 L 306 106',
      fill: 'none', stroke: COLORS.lost, 'stroke-width': '2.4',
      'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: '0.26'
    }));
    svg.appendChild(armRightGroup);

    // 2. Upright two-lane beam (left: God loves us down, right: We love God up)
    var upLeftGroup = svgEl('g', { 'class': 'ghostable', 'clip-path': 'url(#v5-clip-up-left)' });
    upLeftGroup.appendChild(svgEl('rect', {
      x: GEO.upXLeft, y: GEO.upTop, width: GEO.halfW, height: GEO.upH,
      fill: COLORS.goldWash, stroke: COLORS.gold, 'stroke-width': '1.6', 'stroke-opacity': '0.55'
    }));
    upLeftGroup.appendChild(svgEl('path', {
      d: 'M 201 241 L 208 250 L 215 241',
      fill: 'none', stroke: COLORS.gold, 'stroke-width': '2.8',
      'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: '0.62'
    }));
    upLeftGroup.appendChild(svgEl('path', {
      d: 'M 202.5 232 L 208 239 L 213.5 232',
      fill: 'none', stroke: COLORS.gold, 'stroke-width': '2.2',
      'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: '0.28'
    }));
    svg.appendChild(upLeftGroup);

    var upRightGroup = svgEl('g', { 'class': 'ghostable', 'clip-path': 'url(#v5-clip-up-right)' });
    upRightGroup.appendChild(svgEl('rect', {
      x: GEO.cx, y: GEO.upTop, width: GEO.halfW, height: GEO.upH,
      fill: COLORS.greenWash, stroke: COLORS.green, 'stroke-width': '1.6', 'stroke-opacity': '0.55'
    }));
    upRightGroup.appendChild(svgEl('path', {
      d: 'M 225 39 L 232 30 L 239 39',
      fill: 'none', stroke: COLORS.green, 'stroke-width': '2.8',
      'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: '0.62'
    }));
    upRightGroup.appendChild(svgEl('path', {
      d: 'M 226.5 48 L 232 41 L 237.5 48',
      fill: 'none', stroke: COLORS.green, 'stroke-width': '2.2',
      'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: '0.28'
    }));
    svg.appendChild(upRightGroup);

    // Subtle crisp vertical divider down spine center once both lanes exist
    var centerSeam = svgEl('line', {
      'class': 'center-seam',
      x1: GEO.cx, y1: GEO.upTop + 2, x2: GEO.cx, y2: GEO.upBot - 2,
      stroke: '#8F8677', 'stroke-width': '1'
    });
    svg.appendChild(centerSeam);

    // 202 horizontal center bridge (connects left & right arms smoothly when vertical beam ghosts)
    var centerBridge = svgEl('g', { 'class': 'center-bridge', 'aria-hidden': 'true' });
    centerBridge.appendChild(svgEl('rect', {
      x: GEO.upXLeft, y: GEO.armTop, width: GEO.upW, height: GEO.armH,
      fill: 'url(#v5-bridge-grad)'
    }));
    centerBridge.appendChild(svgEl('line', {
      x1: GEO.upXLeft, y1: GEO.armTop, x2: GEO.upXRight, y2: GEO.armTop,
      stroke: '#46517A', 'stroke-width': '1.6', 'stroke-opacity': '0.55'
    }));
    centerBridge.appendChild(svgEl('line', {
      x1: GEO.upXLeft, y1: GEO.armBot, x2: GEO.upXRight, y2: GEO.armBot,
      stroke: '#46517A', 'stroke-width': '1.6', 'stroke-opacity': '0.55'
    }));
    centerBridge.appendChild(svgEl('circle', {
      cx: GEO.cx, cy: GEO.armMidY, r: '3.5',
      fill: '#46517A', opacity: '0.45'
    }));
    svg.appendChild(centerBridge);

    // 3. Sweeping leading arrows (glide along each direction and vanish cleanly off edge)
    var sweepDown = svgEl('g', { 'class': 'sweep-arrow', 'aria-hidden': 'true' });
    sweepDown.appendChild(svgEl('polygon', {
      points: '196,-28 220,-28 220,0 208,16 196,0',
      fill: COLORS.goldSweep
    }));
    svg.appendChild(sweepDown);

    var sweepUp = svgEl('g', { 'class': 'sweep-arrow', 'aria-hidden': 'true' });
    sweepUp.appendChild(svgEl('polygon', {
      points: '220,28 244,28 244,0 232,-16 220,0',
      fill: COLORS.greenSweep
    }));
    svg.appendChild(sweepUp);

    var sweepLeftGroup = svgEl('g', { 'class': 'sweep-arrow', 'aria-hidden': 'true' });
    sweepLeftGroup.appendChild(svgEl('polygon', {
      points: '28,76 28,120 0,120 -18,98 0,76',
      fill: COLORS.churchSweep
    }));
    svg.appendChild(sweepLeftGroup);

    var sweepRightGroup = svgEl('g', { 'class': 'sweep-arrow', 'aria-hidden': 'true' });
    sweepRightGroup.appendChild(svgEl('polygon', {
      points: '-28,76 -28,120 0,120 18,98 0,76',
      fill: COLORS.lostSweep
    }));
    svg.appendChild(sweepRightGroup);

    // 4. Refined double-contour Crimson Cross (outer main stroke + delicate inner hairline)
    var crossGroup = svgEl('g', { 'class': 'cross-contour-group' });
    var crossOuter = svgEl('path', {
      'class': 'cross-contour',
      d: crossContourPath(GEO.pad),
      stroke: COLORS.deepRed,
      'stroke-width': '3.5'
    });
    var crossInner = svgEl('path', {
      'class': 'cross-contour',
      d: crossContourPath(GEO.pad - 4),
      stroke: COLORS.deepRed,
      'stroke-width': '1.1',
      opacity: '0.45'
    });
    crossGroup.appendChild(crossInner);
    crossGroup.appendChild(crossOuter);
    svg.appendChild(crossGroup);

    // 5. Symmetrical labels hugging each direction
    var lblGod = svgEl('text', {
      'class': 'beam-label',
      x: '171', y: '195',
      'text-anchor': 'middle',
      transform: 'rotate(90 171 195)',
      fill: COLORS.gold
    }, 'God loves us');

    var lblWe = svgEl('text', {
      'class': 'beam-label',
      x: '269', y: '195',
      'text-anchor': 'middle',
      transform: 'rotate(-90 269 195)',
      fill: COLORS.green
    }, 'We love God');

    var lblChurch = svgEl('text', {
      'class': 'beam-label',
      x: '181', y: '55',
      'text-anchor': 'end',
      fill: COLORS.church
    }, 'Love the Church');

    var lblLost = svgEl('text', {
      'class': 'beam-label',
      x: '259', y: '55',
      'text-anchor': 'start',
      fill: COLORS.lost
    }, 'Love the Lost');

    svg.appendChild(lblGod);
    svg.appendChild(lblWe);
    svg.appendChild(lblChurch);
    svg.appendChild(lblLost);

    // 6. Course 202 Dissolve Spotlight Overlay (House for Family/Church + Neighborhood of Houses)
    var overlay202 = svgEl('g', { 'class': 'v5-overlay', 'aria-hidden': 'true' });

    // One gentle dual reach reveal flowing from the horizontal arms down to both home and neighborhood scenes
    var reachPaths202 = [
      { d: 'M 176 123 Q 128 127 101 142', stroke: COLORS.church },
      { d: 'M 264 123 Q 312 127 339 144', stroke: COLORS.lost }
    ].map(function (spec) {
      var p = svgEl('path', {
        'class': 'mission-arc',
        d: spec.d,
        stroke: spec.stroke,
        'stroke-width': '2',
        opacity: '0.84'
      });
      overlay202.appendChild(p);
      return p;
    });

    var reachDots202 = svgEl('g', { 'class': 'v5-stage-item' });
    reachDots202.appendChild(svgEl('circle', { cx: '101', cy: '142', r: '2.6', fill: COLORS.church }));
    reachDots202.appendChild(svgEl('circle', { cx: '339', cy: '144', r: '2.6', fill: COLORS.lost }));
    overlay202.appendChild(reachDots202);

    function addHouseMark(parent, cx, baseY, w, bodyH, roofH, opts) {
      var half = w / 2;
      var eaves = opts.eaves || 3;
      var eaveY = baseY - bodyH;
      var peakY = eaveY - roofH;
      var sw = opts.strokeWidth || '1.75';
      if (opts.chimney) {
        parent.appendChild(svgEl('rect', {
          x: String((cx + half * 0.34).toFixed(1)),
          y: String((peakY + roofH * 0.2).toFixed(1)),
          width: '5.5',
          height: String((roofH * 0.65).toFixed(1)),
          rx: '1',
          fill: opts.fill,
          stroke: opts.stroke,
          'stroke-width': '1.5'
        }));
      }
      parent.appendChild(svgEl('path', {
        d: 'M ' + (cx - half).toFixed(1) + ' ' + baseY +
          ' L ' + (cx - half).toFixed(1) + ' ' + eaveY +
          ' L ' + cx + ' ' + peakY +
          ' L ' + (cx + half).toFixed(1) + ' ' + eaveY +
          ' L ' + (cx + half).toFixed(1) + ' ' + baseY + ' Z',
        fill: opts.fill,
        stroke: opts.stroke,
        'stroke-width': sw,
        'stroke-linejoin': 'round'
      }));
      parent.appendChild(svgEl('path', {
        d: 'M ' + (cx - half - eaves).toFixed(1) + ' ' + (eaveY + roofH * 0.16).toFixed(1) +
          ' L ' + cx + ' ' + peakY +
          ' L ' + (cx + half + eaves).toFixed(1) + ' ' + (eaveY + roofH * 0.16).toFixed(1),
        fill: 'none',
        stroke: opts.stroke,
        'stroke-width': sw,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      }));
      var doorW = opts.doorW || Math.max(6, Math.round(w * 0.28));
      var doorH = opts.doorH || Math.max(10, Math.round(bodyH * 0.62));
      parent.appendChild(svgEl('rect', {
        x: String((cx - doorW / 2).toFixed(1)),
        y: String(baseY - doorH),
        width: String(doorW),
        height: String(doorH),
        rx: '1.3',
        fill: opts.doorFill || '#FFFFFF',
        stroke: opts.stroke,
        'stroke-width': '1.5'
      }));
    }

    // Left: Single welcoming house for family & the family of God
    overlay202.appendChild(svgEl('line', {
      x1: '72', y1: '190', x2: '130', y2: '190',
      stroke: COLORS.church, 'stroke-width': '1.5', opacity: '0.45', 'stroke-linecap': 'round'
    }));
    addHouseMark(overlay202, 101, 190, 38, 23, 17, {
      stroke: COLORS.church, fill: COLORS.churchWash, doorFill: '#FFFFFF',
      doorW: 11, doorH: 15, eaves: 3.5, chimney: true, strokeWidth: '1.85'
    });
    overlay202.appendChild(svgEl('text', {
      'class': 'overlay-head', x: '101', y: '208', 'text-anchor': 'middle', fill: COLORS.church
    }, 'Belong'));
    overlay202.appendChild(svgEl('text', {
      'class': 'overlay-sub', x: '101', y: '223', 'text-anchor': 'middle'
    }, "Family & God's family"));

    // Right: Neighborhood of multiple houses (BLESS your neighborhood)
    overlay202.appendChild(svgEl('line', {
      x1: '291', y1: '190', x2: '387', y2: '190',
      stroke: COLORS.lost, 'stroke-width': '1.5', opacity: '0.45', 'stroke-linecap': 'round'
    }));
    addHouseMark(overlay202, 310, 190, 22, 19, 12, {
      stroke: COLORS.lost, fill: COLORS.lostWash, doorFill: '#FFFFFF',
      doorW: 6, doorH: 10, eaves: 2.5, strokeWidth: '1.65'
    });
    addHouseMark(overlay202, 368, 190, 22, 18, 12, {
      stroke: COLORS.lost, fill: COLORS.lostWash, doorFill: '#FFFFFF',
      doorW: 6, doorH: 10, eaves: 2.5, strokeWidth: '1.65'
    });
    addHouseMark(overlay202, 339, 190, 27, 23, 14, {
      stroke: COLORS.lost, fill: '#FFFFFF', doorFill: COLORS.lostWash,
      doorW: 8, doorH: 13, eaves: 3, chimney: true, strokeWidth: '1.8'
    });
    overlay202.appendChild(svgEl('text', {
      'class': 'overlay-head', x: '339', y: '208', 'text-anchor': 'middle', fill: COLORS.lost
    }, 'BLESS'));
    overlay202.appendChild(svgEl('text', {
      'class': 'overlay-sub', x: '339', y: '223', 'text-anchor': 'middle'
    }, 'your neighborhood'));
    svg.appendChild(overlay202);

    // 7. Course 203 Dissolve Spotlight Overlay (1 -> 2 -> 4 table pyramid under Go)
    var overlay203 = svgEl('g', { 'class': 'v5-overlay', 'aria-hidden': 'true' });
    overlay203.appendChild(svgEl('text', {
      'class': 'arm-go-word', x: '274', y: '103', 'text-anchor': 'middle'
    }, 'Go'));

    function drawTableMark(parent, cx, cy, scale, showBook) {
      var g = svgEl('g', {
        transform: 'translate(' + cx + ',' + cy + ') scale(' + scale + ')'
      });
      var swMain = (1.35 / scale).toFixed(2);
      var swSub = (1.15 / scale).toFixed(2);

      // Left and right chairs (203-08 spaces-tables geometry)
      [-1, 1].forEach(function (s) {
        g.appendChild(svgEl('path', {
          d: 'M' + (s * 110) + ',-32 L' + (s * 110) + ',56 M' + (s * 110) + ',18 L' + (s * 72) + ',18 M' + (s * 75) + ',18 L' + (s * 75) + ',56',
          fill: 'none', stroke: COLORS.ink, 'stroke-width': swSub,
          'stroke-linecap': 'round', 'stroke-linejoin': 'round'
        }));
      });

      // Pedestal leg + base + round tabletop
      g.appendChild(svgEl('path', {
        d: 'M0,12 L0,55',
        fill: 'none', stroke: COLORS.ink, 'stroke-width': swSub, 'stroke-linecap': 'round'
      }));
      g.appendChild(svgEl('ellipse', {
        cx: '0', cy: '56', rx: '25', ry: '5',
        fill: '#FFFFFF', stroke: COLORS.ink, 'stroke-width': swSub
      }));
      g.appendChild(svgEl('ellipse', {
        cx: '0', cy: '0', rx: '58', ry: '13',
        fill: '#FFFFFF', stroke: COLORS.ink, 'stroke-width': swMain
      }));

      if (showBook) {
        g.appendChild(svgEl('path', {
          d: 'M-14,-4 Q-7,-9 0,-4 Q7,-9 14,-4 L14,-11 Q7,-16 0,-11 Q-7,-16 -14,-11 Z M0,-11 L0,-4',
          fill: '#FFFFFF', stroke: COLORS.ink, 'stroke-width': swSub,
          'stroke-linecap': 'round', 'stroke-linejoin': 'round'
        }));
      }

      // Seated person at a table: left side is purple multiplier, right side sits across
      function addSeatedPerson(sideSign, strokeCol, fillCol) {
        var pg = svgEl('g', {
          transform: 'translate(' + (sideSign * 86) + ',16) scale(' + (-sideSign) + ',1)'
        });
        pg.appendChild(svgEl('path', {
          d: 'M-12,0 L-12,-42 Q-12,-57 3,-57 Q17,-57 16,-42 L14,0 Z',
          fill: fillCol, stroke: strokeCol, 'stroke-width': swMain, 'stroke-linejoin': 'round'
        }));
        pg.appendChild(svgEl('path', {
          d: 'M2,0 L28,0 L28,36 L35,36',
          fill: 'none', stroke: strokeCol, 'stroke-width': swMain,
          'stroke-linecap': 'round', 'stroke-linejoin': 'round'
        }));
        pg.appendChild(svgEl('path', {
          d: 'M6,-46 Q22,-32 40,-18',
          fill: 'none', stroke: strokeCol, 'stroke-width': swMain, 'stroke-linecap': 'round'
        }));
        pg.appendChild(svgEl('circle', {
          cx: '4', cy: '-73', r: '14',
          fill: fillCol, stroke: strokeCol, 'stroke-width': swMain
        }));
        g.appendChild(pg);
      }

      addSeatedPerson(-1, COLORS.lost, COLORS.lostWash);
      addSeatedPerson(1, COLORS.ink, '#FFFFFF');
      parent.appendChild(g);
    }

    var row1Group203 = svgEl('g', { 'class': 'v5-stage-item' });
    drawTableMark(row1Group203, 358, 151, 0.21, true);
    overlay203.appendChild(row1Group203);

    var row2Group203 = svgEl('g', { 'class': 'v5-stage-item' });
    drawTableMark(row2Group203, 320, 202, 0.175, true);
    drawTableMark(row2Group203, 396, 202, 0.175, true);
    overlay203.appendChild(row2Group203);

    var row3Group203 = svgEl('g', { 'class': 'v5-stage-item' });
    [300, 338, 376, 414].forEach(function (tx) {
      drawTableMark(row3Group203, tx, 251, 0.14, false);
    });
    overlay203.appendChild(row3Group203);

    function arrowHeadPath(x1, y1, x2, y2, size) {
      var angle = Math.atan2(y2 - y1, x2 - x1);
      var a1 = angle - Math.PI * 0.78;
      var a2 = angle + Math.PI * 0.78;
      return 'M ' + (x2 + size * Math.cos(a1)).toFixed(1) + ' ' + (y2 + size * Math.sin(a1)).toFixed(1) +
        ' L ' + x2.toFixed(1) + ' ' + y2.toFixed(1) +
        ' L ' + (x2 + size * Math.cos(a2)).toFixed(1) + ' ' + (y2 + size * Math.sin(a2)).toFixed(1);
    }

    var arrowSpecs203 = [
      // Row 1 -> Row 2 (2 angled lines)
      { x1: 344, y1: 167, x2: 325, y2: 186, row: 1 },
      { x1: 372, y1: 167, x2: 391, y2: 186, row: 1 },
      // Row 2 -> Row 3 (4 angled lines)
      { x1: 313, y1: 217, x2: 302, y2: 237, row: 2 },
      { x1: 328, y1: 217, x2: 337, y2: 237, row: 2 },
      { x1: 388, y1: 217, x2: 379, y2: 237, row: 2 },
      { x1: 403, y1: 217, x2: 413, y2: 237, row: 2 }
    ];

    var reachPaths203 = arrowSpecs203.map(function (sp) {
      var p = svgEl('path', {
        'class': 'mission-arc',
        d: 'M ' + sp.x1 + ' ' + sp.y1 + ' L ' + sp.x2 + ' ' + sp.y2,
        stroke: COLORS.lost,
        'stroke-width': sp.row === 1 ? '1.85' : '1.6',
        opacity: '0.84'
      });
      p.dataset.row = String(sp.row);
      overlay203.appendChild(p);
      return p;
    });

    var arrowHeadsR1 = svgEl('g', { 'class': 'v5-stage-item' });
    var arrowHeadsR2 = svgEl('g', { 'class': 'v5-stage-item' });
    arrowSpecs203.forEach(function (sp) {
      var head = svgEl('path', {
        d: arrowHeadPath(sp.x1, sp.y1, sp.x2, sp.y2, sp.row === 1 ? 5.2 : 4.5),
        fill: 'none', stroke: COLORS.lost,
        'stroke-width': sp.row === 1 ? '1.85' : '1.6',
        'stroke-linecap': 'round', 'stroke-linejoin': 'round',
        opacity: '0.86'
      });
      if (sp.row === 1) arrowHeadsR1.appendChild(head);
      else arrowHeadsR2.appendChild(head);
    });
    overlay203.appendChild(arrowHeadsR1);
    overlay203.appendChild(arrowHeadsR2);
    svg.appendChild(overlay203);

    return {
      svg: svg,
      svgDesc: svgDesc,
      clips: { upLeft: clipUpLeft, upRight: clipUpRight, armLeft: clipArmLeft, armRight: clipArmRight },
      groups: {
        upLeft: upLeftGroup,
        upRight: upRightGroup,
        armLeft: armLeftGroup,
        armRight: armRightGroup,
        cross: crossGroup
      },
      centerBridge: centerBridge,
      overlays: { v202: overlay202, v203: overlay203 },
      reachPaths202: reachPaths202,
      reachDots202: reachDots202,
      reachPaths203: reachPaths203,
      peopleStages203: [row1Group203, arrowHeadsR1, row2Group203, arrowHeadsR2, row3Group203],
      sweeps: { down: sweepDown, up: sweepUp, left: sweepLeftGroup, right: sweepRightGroup },
      strokes: [crossOuter, crossInner],
      centerSeam: centerSeam,
      labels: { lblGod: lblGod, lblWe: lblWe, lblChurch: lblChurch, lblLost: lblLost }
    };
  }

  function measureStrokes(nodes) {
    nodes.forEach(function (node) {
      var len = Math.ceil(node.getTotalLength()) + 4;
      node.dataset.len = String(len);
      node.style.strokeDasharray = String(len);
      node.style.strokeDashoffset = String(len);
    });
  }

  function init() {
    injectStyles();
    document.title = CONFIG.title + ' (v5)';

    var host = document.getElementById('widget') || document.body;
    host.className = 'widget-outer';
    host.setAttribute('aria-label', CONFIG.regionLabel);
    host.innerHTML = '';

    var header = el('header', { 'class': 'title-bar' });
    header.appendChild(el('h1', null, CONFIG.title));
    header.appendChild(el('span', { 'class': 'course-tag' }, CONFIG.courseTag));
    host.appendChild(header);

    var stage = el('div', { 'class': 'stage', id: 'stage' });
    var bundle = buildCrossSvg();
    stage.appendChild(bundle.svg);
    host.appendChild(stage);

    var strip = el('div', { 'class': 'step-strip', id: 'step-strip', role: 'group', 'aria-label': 'Lesson steps' });
    var dotButtons = CONFIG.steps.map(function (st, idx) {
      var btn = el('button', {
        'class': 'step-dot',
        type: 'button',
        'data-step': String(idx),
        'aria-label': st.pillLabel,
        'aria-pressed': 'false'
      });
      btn.style.setProperty('--dot-color', st.accent);
      btn.appendChild(el('span', { 'class': 'step-dot-fill', 'aria-hidden': 'true' }));
      btn.addEventListener('click', function () { goTo(idx); });
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

    measureStrokes(bundle.strokes.concat(bundle.reachPaths202, bundle.reachPaths203));

    var reducedMotionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
    var currentStep = 0;
    var activeRaf = null;
    var SWEEP_PX_PER_SEC = 95;
    var CONTOUR_PX_PER_SEC = 185;

    function clearSweeps() {
      bundle.sweeps.down.classList.remove('is-active');
      bundle.sweeps.up.classList.remove('is-active');
      bundle.sweeps.left.classList.remove('is-active');
      bundle.sweeps.right.classList.remove('is-active');
    }

    function stopActiveAnim() {
      if (activeRaf) {
        cancelAnimationFrame(activeRaf);
        activeRaf = null;
      }
      clearSweeps();
    }

    function setClipImmediate(key, isOn) {
      var r = bundle.clips[key];
      if (!r) return;
      if (key === 'upLeft') {
        r.setAttribute('y', String(GEO.upTop - 2));
        r.setAttribute('height', isOn ? String(GEO.upH + 4) : '0');
      } else if (key === 'upRight') {
        r.setAttribute('y', isOn ? String(GEO.upTop - 2) : String(GEO.upBot + 2));
        r.setAttribute('height', isOn ? String(GEO.upH + 4) : '0');
      } else if (key === 'armLeft') {
        r.setAttribute('x', isOn ? String(GEO.armLeftX - 2) : String(GEO.upXLeft));
        r.setAttribute('width', isOn ? String(GEO.armLen + 2) : '0');
      } else if (key === 'armRight') {
        r.setAttribute('x', String(GEO.upXRight));
        r.setAttribute('width', isOn ? String(GEO.armLen + 2) : '0');
      }
    }

    function updateLabels(draw, animate) {
      var map = [
        ['lblGod', !!draw.lblGod, !!draw.ghostVertical],
        ['lblWe', !!draw.lblWe, !!draw.ghostVertical],
        ['lblChurch', !!draw.lblChurch, !!draw.ghostLeftArm],
        ['lblLost', !!draw.lblLost, false]
      ];
      map.forEach(function (pair) {
        var node = bundle.labels[pair[0]];
        node.style.setProperty('--fade-delay', animate ? '320ms' : '0ms');
        node.classList.toggle('is-visible', pair[1]);
        node.classList.toggle('is-ghost', pair[2]);
      });
      bundle.centerSeam.style.setProperty('--fade-delay', animate ? '420ms' : '0ms');
      bundle.centerSeam.classList.toggle('is-visible', !!(draw.upLeft && draw.upRight));
      bundle.centerSeam.classList.toggle('is-ghost', !!draw.ghostVertical);

      bundle.groups.upLeft.classList.toggle('is-ghost', !!draw.ghostVertical);
      bundle.groups.upRight.classList.toggle('is-ghost', !!draw.ghostVertical);
      bundle.groups.armLeft.classList.toggle('is-ghost', !!draw.ghostLeftArm);
      bundle.groups.cross.classList.toggle('is-ghost', !!draw.ghostCross);

      bundle.centerBridge.style.setProperty('--fade-delay', animate ? '160ms' : '0ms');
      bundle.centerBridge.classList.toggle('is-visible', !!draw.focus202);

      bundle.overlays.v202.style.setProperty('--fade-delay', animate ? '160ms' : '0ms');
      bundle.overlays.v202.classList.toggle('is-visible', !!draw.focus202);
      bundle.reachDots202.style.setProperty('--fade-delay', animate ? '640ms' : '0ms');
      bundle.reachDots202.classList.toggle('is-visible', !!draw.focus202);

      bundle.overlays.v203.style.setProperty('--fade-delay', animate ? '160ms' : '0ms');
      bundle.overlays.v203.classList.toggle('is-visible', !!draw.focus203);
      var stageDelays203 = ['140ms', '600ms', '520ms', '1040ms', '960ms'];
      bundle.peopleStages203.forEach(function (grp, idx) {
        grp.style.setProperty('--fade-delay', animate ? stageDelays203[idx] : '0ms');
        grp.classList.toggle('is-visible', !!draw.focus203);
      });
    }

    function applyStateInstant(draw) {
      setClipImmediate('upLeft', !!draw.upLeft);
      setClipImmediate('upRight', !!draw.upRight);
      setClipImmediate('armLeft', !!draw.armLeft);
      setClipImmediate('armRight', !!draw.armRight);
      bundle.strokes.forEach(function (n) {
        n.style.strokeDashoffset = draw.crossContour ? '0' : n.dataset.len;
      });
      bundle.reachPaths202.forEach(function (n) {
        n.style.strokeDashoffset = draw.focus202 ? '0' : n.dataset.len;
      });
      bundle.reachPaths203.forEach(function (n) {
        n.style.strokeDashoffset = draw.focus203 ? '0' : n.dataset.len;
      });
      updateLabels(draw, false);
    }

    function goTo(nextIdx) {
      stopActiveAnim();
      var prevDraw = CONFIG.steps[currentStep].draw || {};
      var nextStep = CONFIG.steps[nextIdx];
      var nextDraw = nextStep.draw || {};
      var goingForward = nextIdx > currentStep;
      var instant = reducedMotionQuery.matches || !goingForward || nextIdx === 0;

      if (instant) {
        host.dataset.stepDur = '0';
        host.classList.add('is-instant');
        applyStateInstant(nextDraw);
      } else {
        host.classList.remove('is-instant');
        applyStateInstant(prevDraw);
        updateLabels(nextDraw, true);

        var sweepJobs = [];
        var strokeJobs = [];

        if (!prevDraw.upLeft && nextDraw.upLeft) {
          var startY = -12;
          var endY = GEO.H + 34;
          sweepJobs.push({
            key: 'upLeft',
            dist: endY - startY,
            dur: ((endY - startY) / SWEEP_PX_PER_SEC) * 1000,
            update: function (p) {
              var y = startY + (endY - startY) * p;
              var revealEnd = Math.max(GEO.upTop - 2, Math.min(GEO.upBot + 2, y));
              bundle.clips.upLeft.setAttribute('y', String(GEO.upTop - 2));
              bundle.clips.upLeft.setAttribute('height', String(Math.max(0, revealEnd - (GEO.upTop - 2))));
              bundle.sweeps.down.setAttribute('transform', 'translate(0,' + y.toFixed(1) + ')');
              bundle.sweeps.down.classList.toggle('is-active', p < 0.99);
            }
          });
        }

        if (!prevDraw.upRight && nextDraw.upRight) {
          var startYUp = GEO.H + 12;
          var endYUp = -34;
          sweepJobs.push({
            key: 'upRight',
            dist: startYUp - endYUp,
            dur: ((startYUp - endYUp) / SWEEP_PX_PER_SEC) * 1000,
            update: function (p) {
              var y = startYUp + (endYUp - startYUp) * p;
              var revealTop = Math.max(GEO.upTop - 2, Math.min(GEO.upBot + 2, y));
              bundle.clips.upRight.setAttribute('y', String(revealTop));
              bundle.clips.upRight.setAttribute('height', String(Math.max(0, (GEO.upBot + 2) - revealTop)));
              bundle.sweeps.up.setAttribute('transform', 'translate(0,' + y.toFixed(1) + ')');
              bundle.sweeps.up.classList.toggle('is-active', p < 0.99);
            }
          });
        }

        if (!prevDraw.armLeft && nextDraw.armLeft) {
          var startXL = GEO.upXLeft;
          var endXL = -28;
          sweepJobs.push({
            key: 'armLeft',
            dist: startXL - endXL,
            dur: ((startXL - endXL) / SWEEP_PX_PER_SEC) * 1000,
            update: function (p) {
              var x = startXL + (endXL - startXL) * p;
              var revealStart = Math.max(GEO.armLeftX - 2, Math.min(GEO.upXLeft, x));
              bundle.clips.armLeft.setAttribute('x', String(revealStart));
              bundle.clips.armLeft.setAttribute('width', String(Math.max(0, GEO.upXLeft - revealStart)));
              bundle.sweeps.left.setAttribute('transform', 'translate(' + x.toFixed(1) + ',0)');
              bundle.sweeps.left.classList.toggle('is-active', p < 0.99);
            }
          });
        }

        if (!prevDraw.armRight && nextDraw.armRight) {
          var startXR = GEO.upXRight;
          var endXR = GEO.W + 28;
          sweepJobs.push({
            key: 'armRight',
            dist: endXR - startXR,
            dur: ((endXR - startXR) / SWEEP_PX_PER_SEC) * 1000,
            update: function (p) {
              var x = startXR + (endXR - startXR) * p;
              var revealEnd = Math.min(GEO.armRightX + 2, Math.max(GEO.upXRight, x));
              bundle.clips.armRight.setAttribute('x', String(GEO.upXRight));
              bundle.clips.armRight.setAttribute('width', String(Math.max(0, revealEnd - GEO.upXRight)));
              bundle.sweeps.right.setAttribute('transform', 'translate(' + x.toFixed(1) + ',0)');
              bundle.sweeps.right.classList.toggle('is-active', p < 0.99);
            }
          });
        }

        if (!prevDraw.crossContour && nextDraw.crossContour) {
          bundle.strokes.forEach(function (node) {
            var len = Number(node.dataset.len);
            strokeJobs.push({
              node: node,
              len: len,
              delay: 0,
              dur: (len / CONTOUR_PX_PER_SEC) * 1000
            });
          });
        }

        if (!prevDraw.focus202 && nextDraw.focus202) {
          bundle.reachPaths202.forEach(function (node) {
            var len = Number(node.dataset.len);
            node.style.strokeDashoffset = String(len);
            strokeJobs.push({
              node: node,
              len: len,
              delay: 240,
              dur: 560
            });
          });
        }

        if (!prevDraw.focus203 && nextDraw.focus203) {
          bundle.reachPaths203.forEach(function (node) {
            var len = Number(node.dataset.len);
            node.style.strokeDashoffset = String(len);
            strokeJobs.push({
              node: node,
              len: len,
              delay: node.dataset.row === '2' ? 760 : 320,
              dur: 380
            });
          });
        }

        var totalDur = 0;
        sweepJobs.forEach(function (j) { totalDur = Math.max(totalDur, j.dur); });
        strokeJobs.forEach(function (j) { totalDur = Math.max(totalDur, (j.delay || 0) + j.dur); });
        host.dataset.stepDur = String(Math.round(totalDur));

        if (totalDur > 0) {
          var t0 = performance.now();
          var frame = function (now) {
            var elapsed = now - t0;
            sweepJobs.forEach(function (j) {
              var p = Math.min(1, elapsed / j.dur);
              j.update(p);
            });
            strokeJobs.forEach(function (j) {
              var localElapsed = Math.max(0, elapsed - (j.delay || 0));
              var p = Math.min(1, localElapsed / j.dur);
              j.node.style.strokeDashoffset = String(j.len * (1 - p));
            });
            if (elapsed < totalDur) {
              activeRaf = requestAnimationFrame(frame);
            } else {
              applyStateInstant(nextDraw);
              clearSweeps();
              activeRaf = null;
            }
          };
          activeRaf = requestAnimationFrame(frame);
        }
      }

      currentStep = nextIdx;
      document.documentElement.style.setProperty('--step-color', nextStep.accent);
      document.documentElement.style.setProperty('--step-dark', nextStep.accentDark);
      bundle.svgDesc.textContent = nextStep.desc;

      dotButtons.forEach(function (btn, idx) {
        btn.classList.toggle('active', idx === currentStep);
        btn.classList.toggle('passed', idx > 0 && idx < currentStep);
        btn.setAttribute('aria-pressed', idx === currentStep ? 'true' : 'false');
      });

      headingEl.textContent = nextStep.heading;
      verseTextNode.textContent = nextStep.verse;
      refEl.textContent = nextStep.ref;
      noteEl.textContent = nextStep.note;
      countEl.textContent = currentStep === 0 ? 'Ready' : ('Step ' + currentStep + ' of ' + (CONFIG.steps.length - 1));
      prevBtn.disabled = currentStep === 0;
      nextBtn.textContent = currentStep === 0 ? 'Begin \u2192' : (currentStep === CONFIG.steps.length - 1 ? '\u21BB Start Over' : 'Next \u2192');
    }

    prevBtn.addEventListener('click', function () {
      if (currentStep > 0) goTo(currentStep - 1);
    });
    nextBtn.addEventListener('click', function () {
      goTo(currentStep === CONFIG.steps.length - 1 ? 0 : currentStep + 1);
    });

    var lastWidth = window.innerWidth;
    var measuredWidth = 0;
    function fitCardHeight() {
      if (!contentEl || contentEl.clientWidth === measuredWidth) return;
      measuredWidth = contentEl.clientWidth;
      var keepH = headingEl.textContent;
      var keepV = verseTextNode.textContent;
      var keepR = refEl.textContent;
      var keepN = noteEl.textContent;
      var tallest = 0;
      document.documentElement.style.setProperty('--card-h', '0px');
      CONFIG.steps.forEach(function (st) {
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
