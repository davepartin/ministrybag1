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
    muted: '#6E6559',
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
          desc: 'Blank white sketch paper ready for the cross to be drawn step by step.'
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
            labelGodLoves: true
          },
          desc: 'A marker line starts at the top right, crosses left, and moves down with a gold downward arrow labeled God loves us.'
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
            labelGodLoves: true,
            labelWeLove: true,
            uprightWash: 'goldGreen'
          },
          desc: 'Starting at the bottom left, the line goes right across the base and upward with a green arrow labeled We love God, closing the vertical beam.'
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
            labelGodLoves: true,
            labelWeLove: true,
            uprightWash: 'goldGreen',
            armLeft: 'belongMuted',
            armRight: 'goMuted',
            armLeftWash: 'stoneBlue',
            armRightWash: 'stoneRust',
            armArrowsOut: true,
            labelHorizontalRoles: true
          },
          desc: 'One-third down from the top, both horizontal arms draw outward with arrows toward Our Family and Family of God on the left and Not Yet in the Family on the right.'
        },
        {
          id: 'final',
          pill: 'Cross',
          pillLabel: 'Step 4: The Cross Holds It All',
          heading: 'The Cross Holds It All',
          verse: '"And walk in love, as Christ loved us and gave himself up for us, a fragrant offering and sacrifice to God."',
          ref: 'Ephesians 5:2',
          note: "Christ's cross is the power that makes all this possible. Love comes down, goes up, and reaches out.",
          accent: COLORS.deepRed,
          accentDark: '#6D1422',
          draw: {
            uprightLeft: 'ink',
            uprightRight: 'ink',
            labelGodLoves: true,
            labelWeLove: true,
            uprightWash: 'goldGreen',
            armLeft: 'belongMuted',
            armRight: 'goMuted',
            armLeftWash: 'stoneBlue',
            armRightWash: 'stoneRust',
            armArrowsOut: true,
            labelHorizontalRoles: true,
            finishedCross: 'full'
          },
          desc: 'A pronounced deep red sketch line draws around the outside of the entire cross, holding God loves us, We love God, and love reaching outward together.'
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
          desc: 'Blank white sketch paper ready to redraw the cross.'
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
          quickReview: true,
          draw: {
            uprightLeft: 'ink',
            uprightRight: 'ink',
            labelGodLoves: true,
            labelWeLove: true,
            uprightWash: 'goldGreen'
          },
          desc: 'The vertical beam draws cleanly with downward gold God loves us and upward green We love God arrows.'
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
            labelGodLoves: true,
            labelWeLove: true,
            uprightWash: 'goldGreen',
            armLeft: 'blueGrey',
            armRight: 'blueGrey',
            armLeftWash: 'blueGrey',
            armRightWash: 'blueGrey',
            armArrowsOut: true,
            labelHorizontalRoles: true
          },
          desc: 'Both horizontal arms draw outward from one-third below the top in blue-grey with outward arrows.'
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
            labelGodLoves: true,
            labelWeLove: true,
            uprightWash: 'goldGreen',
            armLeft: 'belongBold',
            armLeftWash: 'belong',
            armRight: 'quietSolid',
            labelBelongInside: 'bold',
            belongIcons: 'bold',
            goPreviewCaption: true
          },
          desc: 'The left arm redraws in bold Belong blue with house and fellowship table icons at its end, while the right arm dims quietly.'
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
            labelGodLoves: true,
            labelWeLove: true,
            uprightWash: 'goldGreen',
            armLeft: 'belongBold',
            armLeftWash: 'belong',
            armRight: 'quietSolid',
            labelBelongInside: 'bold',
            belongIcons: 'bold',
            goPreviewCaption: true,
            finishedCross: 'belongFocus'
          },
          desc: 'A pronounced deep red outer sketch line encompasses the upright beam and bold Belong arm with house and table icons.'
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
          desc: 'Blank white sketch paper ready to redraw the cross.'
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
          quickReview: true,
          draw: {
            uprightLeft: 'ink',
            uprightRight: 'ink',
            labelGodLoves: true,
            labelWeLove: true,
            uprightWash: 'goldGreen',
            armLeft: 'belongQuiet',
            armLeftWash: 'belongSoft',
            labelBelongInside: 'soft',
            belongIcons: 'soft'
          },
          desc: 'The vertical beam and the Belong arm with its house and fellowship table icons draw together cleanly.'
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
            labelGodLoves: true,
            labelWeLove: true,
            uprightWash: 'goldGreen',
            armLeft: 'belongQuiet',
            armLeftWash: 'belongSoft',
            labelBelongInside: 'soft',
            belongIcons: 'soft',
            armRight: 'goBold',
            armRightWash: 'go',
            labelGoInside: true,
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
            labelGodLoves: true,
            labelWeLove: true,
            uprightWash: 'goldGreen',
            armLeft: 'belongQuiet',
            armLeftWash: 'belongSoft',
            labelBelongInside: 'soft',
            belongIcons: 'soft',
            armRight: 'goBold',
            armRightWash: 'go',
            labelGoInside: true,
            goRings: true,
            finishedCross: 'full'
          },
          desc: 'A pronounced deep red outer line draws around the whole cross, uniting God loves us, We love God, Belong, and Go into all the world.'
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
    '.svg-stroke.is-quiet {',
    '  opacity: 0.28;',
    '}',
    '.svg-stroke-tex.is-visible {',
    '  opacity: 0.42;',
    '}',
    '.svg-stroke-tex.is-quiet {',
    '  opacity: 0.14;',
    '}',
    '.pen-tip {',
    '  opacity: 0;',
    '  pointer-events: none;',
    '}',
    '.pen-tip.is-active {',
    '  opacity: 1;',
    '}',
    '@media (prefers-reduced-motion: no-preference) {',
    '  .widget-outer:not(.is-instant) .svg-stroke {',
    '    transition: opacity 280ms ease, stroke 280ms ease;',
    '  }',
    '  .widget-outer:not(.is-instant) .svg-fade {',
    '    transition: opacity var(--fade-dur, 420ms) ease var(--fade-delay, 0ms);',
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
    // 440 x 268 canvas: Upright x=[190..250] (width 60), y=[12..254] (height 242).
    // Crossbar sits 1/3 down from top: y=[68..112] (center 90, which is 32.2% down).
    // Left arm x=[96..190] (94w), Right arm x=[250..344] (94w).
    var svg = svgEl('svg', {
      'class': 'cross-svg',
      'viewBox': '0 0 440 268',
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
    uprightGrad.appendChild(svgEl('stop', { offset: '0%', 'stop-color': COLORS.gold, 'stop-opacity': '0.16' }));
    uprightGrad.appendChild(svgEl('stop', { offset: '48%', 'stop-color': COLORS.gold, 'stop-opacity': '0.09' }));
    uprightGrad.appendChild(svgEl('stop', { offset: '52%', 'stop-color': COLORS.green, 'stop-opacity': '0.09' }));
    uprightGrad.appendChild(svgEl('stop', { offset: '100%', 'stop-color': COLORS.green, 'stop-opacity': '0.16' }));
    defs.appendChild(uprightGrad);
    svg.appendChild(defs);

    // Clean white sketch paper (zero dotted spoiler lines)
    var paperG = svgEl('g', { 'aria-hidden': 'true' });
    paperG.appendChild(svgEl('rect', { x: 0, y: 0, width: 440, height: 268, fill: '#FFFFFF' }));
    svg.appendChild(paperG);

    // Subtle interior washes
    var washG = svgEl('g', { id: 'wash-layer', 'aria-hidden': 'true' });
    var uprightWash = svgEl('path', {
      id: 'wash-upright',
      'class': 'svg-fade',
      d: 'M 191 13 Q 189 130 191 253 Q 220 255 249 253 Q 251 130 249 13 Q 220 11 191 13 Z',
      fill: 'url(#upright-wash-grad)'
    });
    var armLeftWash = svgEl('path', {
      id: 'wash-arm-left',
      'class': 'svg-fade',
      d: 'M 190 69 Q 143 67 97 70 Q 95 90 97 111 Q 144 113 190 111 Z',
      fill: COLORS.belong,
      'fill-opacity': '0.12'
    });
    var armRightWash = svgEl('path', {
      id: 'wash-arm-right',
      'class': 'svg-fade',
      d: 'M 250 69 Q 297 67 343 70 Q 345 90 343 111 Q 296 113 250 111 Z',
      fill: COLORS.go,
      'fill-opacity': '0.12'
    });
    var finishedGlow = svgEl('path', {
      id: 'wash-finished',
      'class': 'svg-fade',
      d: 'M 183 6 L 257 6 L 257 62 L 351 62 L 351 119 L 257 119 L 257 261 L 183 261 L 183 119 L 89 119 L 89 62 L 183 62 Z',
      fill: COLORS.deepRed,
      'fill-opacity': '0.06'
    });
    washG.appendChild(uprightWash);
    washG.appendChild(armLeftWash);
    washG.appendChild(armRightWash);
    washG.appendChild(finishedGlow);
    svg.appendChild(washG);

    // Hand-drawn double-pass marker strokes
    var strokes = [];
    function addStrokePair(id, dMain, dTex, strokeColor, widthMain, widthTex) {
      var mainPath = svgEl('path', {
        id: id,
        'class': 'svg-stroke',
        d: dMain,
        fill: 'none',
        stroke: strokeColor,
        'stroke-width': String(widthMain || 3.0),
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      });
      var texPath = svgEl('path', {
        id: id + '-tex',
        'class': 'svg-stroke svg-stroke-tex',
        d: dTex,
        fill: 'none',
        stroke: strokeColor,
        'stroke-width': String(widthTex || 1.25),
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round'
      });
      svg.appendChild(mainPath);
      svg.appendChild(texPath);
      strokes.push(mainPath, texPath);
      return { main: mainPath, tex: texPath };
    }

    // Step 1 Upright: Top-Right (249, 13) -> Left to Top-Left (191, 13) -> Down to Bottom-Left (191, 253)
    addStrokePair(
      'stroke-upright-left',
      'M 249 13 Q 220 11 191 13 Q 189 80 190 140 Q 192 198 191 253',
      'M 248 14.3 Q 220 12.2 192.2 14.3 Q 190.2 81 191.2 140 Q 193 198 192.1 252',
      COLORS.ink,
      3.0,
      1.25
    );

    // Step 2 Upright: Bottom-Left (191, 253) -> Right to Bottom-Right (249, 253) -> Up to Top-Right (249, 13)
    addStrokePair(
      'stroke-upright-right',
      'M 191 253 Q 220 255 249 253 Q 251 196 250 135 Q 248 75 249 13',
      'M 192 251.8 Q 220 253.8 248 251.8 Q 249.8 196 248.8 135 Q 247 75 247.9 14.3',
      COLORS.ink,
      3.0,
      1.25
    );

    // Left arm outward from center (x: 190 -> 96 -> return)
    addStrokePair(
      'stroke-arm-left',
      'M 190 69 Q 143 67 96 70 Q 94 90 96 111 Q 144 113 190 111',
      'M 189.2 70.2 Q 143 68.2 97.2 71.1 Q 95.4 90 97.2 109.9 Q 144 111.8 189.2 109.8',
      COLORS.ink,
      2.8,
      1.2
    );

    // Right arm outward from center (x: 250 -> 344 -> return)
    addStrokePair(
      'stroke-arm-right',
      'M 250 69 Q 297 67 344 70 Q 346 90 344 111 Q 296 113 250 111',
      'M 250.8 70.2 Q 297 68.2 342.8 71.1 Q 344.6 90 342.8 109.9 Q 296 111.8 250.8 109.8',
      COLORS.ink,
      2.8,
      1.2
    );

    // Pronounced outer encompassing deep-red sketch contour around the WHOLE cross (full vs 202 Belong focus)
    addStrokePair(
      'stroke-finish-full',
      'M 220 5 Q 240 4 256 6 Q 258 35 257 62 Q 304 61 350 63 Q 353 90 350 118 Q 303 120 257 118 Q 258 190 256 260 Q 220 262 184 260 Q 182 190 183 118 Q 137 120 90 118 Q 87 90 90 63 Q 136 61 183 62 Q 182 35 184 6 Q 202 5 220 5',
      'M 220 6.8 Q 239 5.5 254.5 7.5 Q 256.5 35 255.6 63.5 Q 303 62.6 348.5 64.5 Q 351 90 348.5 116.5 Q 303 118.4 255.6 116.5 Q 256.5 190 254.5 258.5 Q 220 260.4 185.5 258.5 Q 183.6 190 184.5 116.5 Q 137 118.4 91.5 116.5 Q 89 90 91.5 64.5 Q 137 62.6 184.5 63.5 Q 183.6 35 185.5 7.5 Q 202 6.6 220 6.8',
      COLORS.deepRed,
      3.5,
      1.5
    );

    addStrokePair(
      'stroke-finish-belong',
      'M 220 5 Q 240 4 256 6 Q 258 130 256 260 Q 220 262 184 260 Q 182 190 183 118 Q 137 120 90 118 Q 87 90 90 63 Q 136 61 183 62 Q 182 35 184 6 Q 202 5 220 5',
      'M 220 6.8 Q 239 5.5 254.5 7.5 Q 256.5 130 254.5 258.5 Q 220 260.4 185.5 258.5 Q 183.6 190 184.5 116.5 Q 137 118.4 91.5 116.5 Q 89 90 91.5 64.5 Q 137 62.6 184.5 63.5 Q 183.6 35 185.5 7.5 Q 202 6.6 220 6.8',
      COLORS.deepRed,
      3.5,
      1.5
    );

    // Interior upright directional arrows + wording ("God loves us" down on left, "We love God" up on right)
    var lblGodLoves = svgEl('g', { id: 'lbl-god-loves', 'class': 'svg-fade', 'aria-hidden': 'true' });
    lblGodLoves.appendChild(svgEl('path', {
      d: 'M 200 124 Q 199 180 200 236 M 195.5 228 L 200 238 L 204.5 228',
      fill: 'none',
      stroke: COLORS.gold,
      'stroke-width': '2.1',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }));
    lblGodLoves.appendChild(svgEl('text', {
      x: 213,
      y: 180,
      transform: 'rotate(90 213 180)',
      'text-anchor': 'middle',
      fill: '#8E6707',
      'font-size': '11.5',
      'class': 'hand-label'
    }, 'God loves us'));
    svg.appendChild(lblGodLoves);

    var lblWeLove = svgEl('g', { id: 'lbl-we-love', 'class': 'svg-fade', 'aria-hidden': 'true' });
    lblWeLove.appendChild(svgEl('path', {
      d: 'M 240 238 Q 241 180 240 124 M 235.5 132 L 240 122 L 244.5 132',
      fill: 'none',
      stroke: COLORS.green,
      'stroke-width': '2.1',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }));
    lblWeLove.appendChild(svgEl('text', {
      x: 229,
      y: 180,
      transform: 'rotate(-90 229 180)',
      'text-anchor': 'middle',
      fill: '#236146',
      'font-size': '11.5',
      'class': 'hand-label'
    }, 'We love God'));
    svg.appendChild(lblWeLove);

    // Horizontal arm outward arrows & labels INSIDE arms (zero words on outer white space in 201)
    var armArrowsOutG = svgEl('g', { id: 'arm-arrows-out', 'class': 'svg-fade', 'aria-hidden': 'true' });
    // Leftward arrow along bottom of left arm
    armArrowsOutG.appendChild(svgEl('path', {
      d: 'M 183 103 Q 142 104 104 103 M 112 99 L 103 103 L 112 107',
      fill: 'none',
      stroke: COLORS.belong,
      'stroke-width': '1.9',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }));
    // Rightward arrow along bottom of right arm
    armArrowsOutG.appendChild(svgEl('path', {
      d: 'M 257 103 Q 298 104 336 103 M 328 99 L 337 103 L 328 107',
      fill: 'none',
      stroke: COLORS.go,
      'stroke-width': '1.9',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }));
    svg.appendChild(armArrowsOutG);

    var lblHorizontalRoles = svgEl('g', { id: 'lbl-horizontal-roles', 'class': 'svg-fade', 'aria-hidden': 'true' });
    var leftRoleTxt = svgEl('text', {
      x: 144,
      y: 80,
      'text-anchor': 'middle',
      fill: '#334F63',
      'font-size': '9.2',
      'font-weight': '700',
      'class': 'clean-label'
    });
    leftRoleTxt.appendChild(svgEl('tspan', { x: 144, dy: '0' }, 'Our Family &'));
    leftRoleTxt.appendChild(svgEl('tspan', { x: 144, dy: '10.2' }, 'Family of God'));
    lblHorizontalRoles.appendChild(leftRoleTxt);

    var rightRoleTxt = svgEl('text', {
      x: 296,
      y: 80,
      'text-anchor': 'middle',
      fill: '#8E411E',
      'font-size': '9.2',
      'font-weight': '700',
      'class': 'clean-label'
    });
    rightRoleTxt.appendChild(svgEl('tspan', { x: 296, dy: '0' }, 'Those Not Yet'));
    rightRoleTxt.appendChild(svgEl('tspan', { x: 296, dy: '10.2' }, 'in the Family'));
    lblHorizontalRoles.appendChild(rightRoleTxt);
    svg.appendChild(lblHorizontalRoles);

    // 202 / 203 Belong & Go labels positioned neatly INSIDE arms
    var lblBelongInside = svgEl('text', {
      id: 'lbl-belong-inside',
      'class': 'svg-fade hand-label',
      x: 144,
      y: 95,
      'text-anchor': 'middle',
      fill: COLORS.belong,
      'font-size': '17'
    }, 'Belong');
    svg.appendChild(lblBelongInside);

    var lblGoInside = svgEl('text', {
      id: 'lbl-go-inside',
      'class': 'svg-fade hand-label',
      x: 296,
      y: 95,
      'text-anchor': 'middle',
      fill: COLORS.go,
      'font-size': '17'
    }, 'Go');
    svg.appendChild(lblGoInside);

    // 202 quiet Go arm caption below dimmed right arm
    var lbl202GoCaption = svgEl('text', {
      id: 'lbl-202-go-preview',
      'class': 'svg-fade clean-label',
      x: 303,
      y: 129,
      'text-anchor': 'middle',
      fill: '#7A7165',
      'font-size': '10',
      'font-weight': '600'
    }, 'Go: Growing Out');
    svg.appendChild(lbl202GoCaption);

    // 202 / 203 Belong icons (house + fellowship table centered vertically around y=90, left side x=16..82)
    var belongIconsG = svgEl('g', { id: 'belong-icons', 'class': 'svg-fade', 'aria-hidden': 'true' });
    belongIconsG.appendChild(svgEl('polygon', {
      points: '27,54 49,35 71,54',
      fill: COLORS.belong,
      'fill-opacity': '0.16'
    }));
    belongIconsG.appendChild(svgEl('rect', {
      x: 29, y: 122, width: 40, height: 10, rx: 3.5,
      fill: COLORS.belong,
      'fill-opacity': '0.18'
    }));
    belongIconsG.appendChild(svgEl('path', {
      d: 'M 25 55 L 49 34 L 73 55 M 31 52 L 31 78 L 67 78 L 67 52',
      fill: 'none',
      stroke: COLORS.ink,
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }));
    belongIconsG.appendChild(svgEl('path', {
      d: 'M 43 78 L 43 63 Q 49 61 55 63 L 55 78',
      fill: 'none',
      stroke: COLORS.belong,
      'stroke-width': '1.8',
      'stroke-linecap': 'round'
    }));
    belongIconsG.appendChild(svgEl('circle', {
      cx: 36, cy: 112, r: 4, fill: '#FFFFFF', stroke: COLORS.ink, 'stroke-width': '1.7'
    }));
    belongIconsG.appendChild(svgEl('circle', {
      cx: 49, cy: 110, r: 4.2, fill: '#FFFFFF', stroke: COLORS.belong, 'stroke-width': '1.8'
    }));
    belongIconsG.appendChild(svgEl('circle', {
      cx: 62, cy: 112, r: 4, fill: '#FFFFFF', stroke: COLORS.ink, 'stroke-width': '1.7'
    }));
    belongIconsG.appendChild(svgEl('path', {
      d: 'M 30 121 Q 36 116 42 121 M 43 120 Q 49 115 55 120 M 56 121 Q 62 116 68 121',
      fill: 'none',
      stroke: COLORS.ink,
      'stroke-width': '1.6',
      'stroke-linecap': 'round'
    }));
    belongIconsG.appendChild(svgEl('path', {
      d: 'M 27 123 Q 49 120 71 123 L 69 133 Q 49 135 29 133 Z M 33 133 L 33 144 M 65 133 L 65 144',
      fill: 'none',
      stroke: COLORS.ink,
      'stroke-width': '1.9',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }));
    belongIconsG.appendChild(svgEl('text', {
      x: 49,
      y: 157,
      'text-anchor': 'middle',
      fill: COLORS.inkSoft,
      'font-size': '9.5',
      'class': 'clean-label'
    }, 'home & table'));
    svg.appendChild(belongIconsG);

    // 203 Go widening rings centered clearly right of red halo (right border x=350, y=90)
    var goRingsG = svgEl('g', { id: 'go-rings', 'aria-hidden': 'true' });
    var ringPaths = [
      { id: 'go-ring-1', d: 'M 361 74 Q 371 90 361 107', w: 2.2 },
      { id: 'go-ring-2', d: 'M 374 60 Q 391 90 374 121', w: 2.0 },
      { id: 'go-ring-3', d: 'M 388 45 Q 413 90 388 136', w: 1.85 },
      { id: 'go-ring-4', d: 'M 402 31 Q 434 90 402 150', w: 1.7 }
    ];
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
      strokes.push(p);
    });
    var goRingLabels = svgEl('g', { id: 'go-ring-labels', 'class': 'svg-fade' });
    goRingLabels.appendChild(svgEl('text', {
      x: 360, y: 54, 'text-anchor': 'end', fill: COLORS.go, 'font-size': '9.8', 'font-weight': '700', 'class': 'clean-label'
    }, 'home'));
    var workTxt = svgEl('text', {
      x: 372, y: 135, 'text-anchor': 'end', fill: COLORS.ink, 'font-size': '9.3', 'font-weight': '600', 'class': 'clean-label'
    });
    workTxt.appendChild(svgEl('tspan', { x: 372, dy: '0' }, 'work and'));
    workTxt.appendChild(svgEl('tspan', { x: 372, dy: '10' }, 'school'));
    goRingLabels.appendChild(workTxt);
    goRingLabels.appendChild(svgEl('text', {
      x: 396, y: 20, 'text-anchor': 'middle', fill: COLORS.ink, 'font-size': '9.3', 'font-weight': '600', 'class': 'clean-label'
    }, 'neighborhood'));
    goRingLabels.appendChild(svgEl('text', {
      x: 405, y: 165, 'text-anchor': 'middle', fill: COLORS.go, 'font-size': '10.2', 'font-weight': '700', 'class': 'clean-label'
    }, 'nations'));
    goRingsG.appendChild(goRingLabels);
    svg.appendChild(goRingsG);

    // Live travelling arrowhead tips synchronized with forward stroke paths
    function buildPenTip(id, fill) {
      var g = svgEl('g', { id: id, 'class': 'pen-tip', 'aria-hidden': 'true' });
      g.appendChild(svgEl('path', {
        d: 'M -8 -5 L 2 0 L -8 5 L -5.5 0 Z',
        fill: fill,
        stroke: fill,
        'stroke-width': '1',
        'stroke-linejoin': 'round'
      }));
      svg.appendChild(g);
      return g;
    }

    var penTips = {
      'stroke-upright-left': buildPenTip('pen-tip-down', COLORS.gold),
      'stroke-upright-right': buildPenTip('pen-tip-up', COLORS.green),
      'stroke-arm-left': buildPenTip('pen-tip-left', COLORS.belong),
      'stroke-arm-right': buildPenTip('pen-tip-right', COLORS.go),
      'stroke-finish-full': buildPenTip('pen-tip-red-full', COLORS.deepRed),
      'stroke-finish-belong': buildPenTip('pen-tip-red-belong', COLORS.deepRed)
    };

    return {
      svg: svg,
      svgTitle: svgTitle,
      svgDesc: svgDesc,
      strokes: strokes,
      penTips: penTips,
      parts: {
        uprightWash: uprightWash,
        armLeftWash: armLeftWash,
        armRightWash: armRightWash,
        finishedGlow: finishedGlow,
        lblGodLoves: lblGodLoves,
        lblWeLove: lblWeLove,
        armArrowsOutG: armArrowsOutG,
        lblHorizontalRoles: lblHorizontalRoles,
        lblBelongInside: lblBelongInside,
        lblGoInside: lblGoInside,
        lbl202GoCaption: lbl202GoCaption,
        belongIconsG: belongIconsG,
        goRingLabels: goRingLabels
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
    if (mode === 'belongMuted') return '#5B7080';
    if (mode === 'goMuted') return '#8E5A42';
    if (mode === 'blueGrey') return COLORS.neighbor;
    if (mode === 'belongBold' || mode === 'belongQuiet') return COLORS.belong;
    if (mode === 'goBold') return COLORS.go;
    if (mode === 'quietSolid') return '#C4BEB2';
    return COLORS.ink;
  }

  function buildStrokeTargetMap(stepObj) {
    var d = stepObj.draw || {};
    var map = {};
    map['stroke-upright-left'] = { on: !!d.uprightLeft, color: COLORS.ink, w: 3.0 };
    map['stroke-upright-right'] = { on: !!d.uprightRight, color: COLORS.ink, w: 3.0 };
    map['stroke-arm-left'] = {
      on: !!d.armLeft,
      color: getStrokeColorForArm(d.armLeft),
      w: d.armLeft === 'belongBold' ? 3.3 : (d.armLeft === 'quietSolid' ? 2.0 : 2.8),
      quiet: d.armLeft === 'quietSolid'
    };
    map['stroke-arm-right'] = {
      on: !!d.armRight,
      color: getStrokeColorForArm(d.armRight),
      w: d.armRight === 'goBold' ? 3.3 : (d.armRight === 'quietSolid' ? 2.0 : 2.8),
      quiet: d.armRight === 'quietSolid'
    };
    map['stroke-finish-full'] = { on: d.finishedCross === 'full', color: COLORS.deepRed, w: 3.5 };
    map['stroke-finish-belong'] = { on: d.finishedCross === 'belongFocus', color: COLORS.deepRed, w: 3.5 };
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
    var activeRaf = null;

    function clearAllPenTips() {
      Object.keys(svgBundle.penTips).forEach(function (k) {
        svgBundle.penTips[k].classList.remove('is-active');
      });
    }

    function stopActiveStrokeAnimation() {
      if (activeRaf) {
        cancelAnimationFrame(activeRaf);
        activeRaf = null;
      }
      clearAllPenTips();
    }

    function applyWashAndLabelState(stepObj, animate) {
      var d = stepObj.draw || {};
      var p = svgBundle.parts;
      var washDelay = animate ? (stepObj.quickReview ? '280ms' : '540ms') : '0ms';
      var arrowLabelDelay = animate ? (stepObj.quickReview ? '180ms' : '340ms') : '0ms';

      p.uprightWash.style.setProperty('--fade-delay', washDelay);
      p.uprightWash.classList.toggle('is-visible', !!d.uprightWash);

      p.armLeftWash.style.setProperty('--fade-delay', washDelay);
      if (d.armLeftWash === 'belong') {
        p.armLeftWash.setAttribute('fill', COLORS.belong);
        p.armLeftWash.setAttribute('fill-opacity', '0.16');
      } else if (d.armLeftWash === 'belongSoft') {
        p.armLeftWash.setAttribute('fill', COLORS.belong);
        p.armLeftWash.setAttribute('fill-opacity', '0.10');
      } else if (d.armLeftWash === 'stoneBlue') {
        p.armLeftWash.setAttribute('fill', COLORS.belong);
        p.armLeftWash.setAttribute('fill-opacity', '0.10');
      } else {
        p.armLeftWash.setAttribute('fill', COLORS.neighbor);
        p.armLeftWash.setAttribute('fill-opacity', '0.10');
      }
      p.armLeftWash.classList.toggle('is-visible', !!d.armLeftWash);

      p.armRightWash.style.setProperty('--fade-delay', washDelay);
      if (d.armRightWash === 'go') {
        p.armRightWash.setAttribute('fill', COLORS.go);
        p.armRightWash.setAttribute('fill-opacity', '0.16');
      } else if (d.armRightWash === 'stoneRust') {
        p.armRightWash.setAttribute('fill', COLORS.go);
        p.armRightWash.setAttribute('fill-opacity', '0.10');
      } else {
        p.armRightWash.setAttribute('fill', COLORS.neighbor);
        p.armRightWash.setAttribute('fill-opacity', '0.10');
      }
      p.armRightWash.classList.toggle('is-visible', !!d.armRightWash);

      p.finishedGlow.setAttribute(
        'd',
        d.finishedCross === 'belongFocus'
          ? 'M 183 6 L 257 6 L 257 261 L 183 261 L 183 119 L 89 119 L 89 62 L 183 62 Z'
          : 'M 183 6 L 257 6 L 257 62 L 351 62 L 351 119 L 257 119 L 257 261 L 183 261 L 183 119 L 89 119 L 89 62 L 183 62 Z'
      );
      p.finishedGlow.style.setProperty('--fade-delay', animate ? '460ms' : '0ms');
      p.finishedGlow.classList.toggle('is-visible', !!d.finishedCross);

      p.lblGodLoves.style.setProperty('--fade-delay', arrowLabelDelay);
      p.lblGodLoves.classList.toggle('is-visible', !!d.labelGodLoves);

      p.lblWeLove.style.setProperty('--fade-delay', arrowLabelDelay);
      p.lblWeLove.classList.toggle('is-visible', !!d.labelWeLove);

      p.armArrowsOutG.style.setProperty('--fade-delay', washDelay);
      p.armArrowsOutG.classList.toggle('is-visible', !!d.armArrowsOut);

      p.lblHorizontalRoles.style.setProperty('--fade-delay', washDelay);
      p.lblHorizontalRoles.classList.toggle('is-visible', !!d.labelHorizontalRoles);

      p.lblBelongInside.style.setProperty('--fade-delay', washDelay);
      p.lblBelongInside.classList.toggle('is-visible', d.labelBelongInside === 'bold');
      p.lblBelongInside.classList.toggle('is-soft', d.labelBelongInside === 'soft');

      p.lblGoInside.style.setProperty('--fade-delay', washDelay);
      p.lblGoInside.classList.toggle('is-visible', !!d.labelGoInside);

      p.belongIconsG.style.setProperty('--fade-delay', washDelay);
      p.belongIconsG.classList.toggle('is-visible', d.belongIcons === 'bold');
      p.belongIconsG.classList.toggle('is-soft', d.belongIcons === 'soft');

      p.goRingLabels.style.setProperty('--fade-delay', animate ? '560ms' : '0ms');
      p.goRingLabels.classList.toggle('is-visible', !!d.goRings);

      p.lbl202GoCaption.style.setProperty('--fade-delay', animate ? '260ms' : '0ms');
      p.lbl202GoCaption.classList.toggle('is-visible', !!d.goPreviewCaption);
    }

    function applyStrokePair(mainId, target, treatAsOn, animate, animItems) {
      var pairs = [document.getElementById(mainId), document.getElementById(mainId + '-tex')];
      pairs.forEach(function (node) {
        if (!node) return;
        var len = parseFloat(node.dataset.len || '400');
        var isTex = node.id.indexOf('-tex') !== -1;
        node.setAttribute('stroke', target.color);
        if (!isTex && target.w) {
          node.setAttribute('stroke-width', String(target.w));
        }
        node.classList.toggle('is-quiet', !!target.quiet);
        if (target.on) {
          if (animate && !treatAsOn) {
            node.style.strokeDashoffset = String(len);
            node.classList.add('is-visible');
            animItems.push({
              node: node,
              len: len,
              tip: isTex ? null : (svgBundle.penTips[mainId] || null),
              isArm: mainId === 'stroke-arm-left' || mainId === 'stroke-arm-right'
            });
          } else {
            node.style.strokeDashoffset = '0';
            node.classList.add('is-visible');
          }
        } else {
          node.classList.remove('is-visible');
          node.style.strokeDashoffset = String(len);
        }
      });
    }

    function positionPenTip(item, dist) {
      if (!item.tip || typeof item.node.getPointAtLength !== 'function') return;
      var clamped = Math.max(0.5, Math.min(item.len - 2, dist));
      var pt = item.node.getPointAtLength(clamped);
      var ptBack = item.node.getPointAtLength(Math.max(0, clamped - 3));
      var dx = pt.x - ptBack.x;
      var dy = pt.y - ptBack.y;
      if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return;
      var angle = Math.atan2(dy, dx) * (180 / Math.PI);
      item.tip.setAttribute('transform', 'translate(' + pt.x.toFixed(1) + ' ' + pt.y.toFixed(1) + ') rotate(' + angle.toFixed(1) + ')');
      item.tip.classList.add('is-active');
    }

    function runFrameLockedStrokeDraw(animItems, durMs) {
      if (!animItems.length) return;
      var startTs = null;
      function frame(ts) {
        if (!startTs) startTs = ts;
        var raw = Math.min(1, (ts - startTs) / durMs);
        var eased = 1 - Math.pow(1 - raw, 2.2);
        animItems.forEach(function (item) {
          var drawn = item.len * eased;
          item.node.style.strokeDashoffset = (item.len - drawn).toFixed(1);
          // For horizontal arms, show outward arrow only during the outward top half (first ~45% of path)
          if (item.tip) {
            if (item.isArm && eased > 0.45) {
              item.tip.classList.remove('is-active');
            } else {
              positionPenTip(item, drawn);
            }
          }
        });
        if (raw < 1) {
          activeRaf = requestAnimationFrame(frame);
        } else {
          animItems.forEach(function (item) {
            item.node.style.strokeDashoffset = '0';
          });
          clearAllPenTips();
          activeRaf = null;
        }
      }
      activeRaf = requestAnimationFrame(frame);
    }

    function goTo(targetIdx) {
      stopActiveStrokeAnimation();

      var nextIdx = Math.max(0, Math.min(cfg.steps.length - 1, targetIdx));
      var st = cfg.steps[nextIdx];
      var isForward = nextIdx === currentStep + 1;
      var animate = isForward && !reducedMotionQuery.matches;
      var nextStrokeMap = buildStrokeTargetMap(st);
      // 30% slower than 720ms (~980ms for normal steps, 640ms for quick review)
      var strokeDur = st.quickReview ? 640 : 980;

      host.classList.add('is-instant');

      var animItems = [];
      Object.keys(nextStrokeMap).forEach(function (id) {
        var nextT = nextStrokeMap[id];
        var wasT = prevStrokeMap[id] || { on: false };
        var forceRedraw = !!(st.redrawLeftArm && id === 'stroke-arm-left');
        var treatAsOn = !forceRedraw && wasT.on;
        var singleNode = document.getElementById(id);
        var hasTex = !!document.getElementById(id + '-tex');

        if (hasTex) {
          applyStrokePair(id, nextT, treatAsOn, animate, animItems);
        } else if (singleNode) {
          var len = parseFloat(singleNode.dataset.len || '300');
          if (nextT.color) singleNode.setAttribute('stroke', nextT.color);
          if (nextT.on) {
            if (animate && !treatAsOn) {
              singleNode.style.strokeDashoffset = String(len);
              singleNode.classList.add('is-visible');
              animItems.push({ node: singleNode, len: len, tip: null, isArm: false });
            } else {
              singleNode.style.strokeDashoffset = '0';
              singleNode.classList.add('is-visible');
            }
          } else {
            singleNode.classList.remove('is-visible');
            singleNode.style.strokeDashoffset = String(len);
          }
        }
      });

      applyWashAndLabelState(st, animate);
      void svgBundle.svg.getBoundingClientRect();

      if (animate) {
        host.classList.remove('is-instant');
        runFrameLockedStrokeDraw(animItems, strokeDur);
      } else if (!reducedMotionQuery.matches) {
        host.classList.remove('is-instant');
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
