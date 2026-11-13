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
    deepRed: '#8B1A2B',
    quietGrey: '#C2BCB0'
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
          pillLabel: "Step 1: God's Love Comes Down",
          heading: CARDS.DOWN.heading,
          verse: CARDS.DOWN.verse,
          ref: CARDS.DOWN.ref,
          note: CARDS.DOWN.note,
          accent: COLORS.gold,
          accentDark: '#8B6508',
          draw: {
            uprightLeft: 'gold',
            downTip: 'gold',
            labelGodLoves: true
          },
          desc: 'A gold line starts at the top right, goes left, and moves down with an arrowhead staying on the bottom-left tip labeled God loves us.'
        },
        {
          id: 'up',
          pillLabel: 'Step 2: Love God With All You Are',
          heading: CARDS.UP.heading,
          verse: CARDS.UP.verse,
          ref: CARDS.UP.ref,
          note: CARDS.UP.note,
          accent: COLORS.green,
          accentDark: '#236146',
          draw: {
            uprightLeft: 'gold',
            downTip: 'gold',
            labelGodLoves: true,
            uprightRight: 'green',
            upTip: 'green',
            labelWeLove: true,
            uprightWash: 'goldGreen'
          },
          desc: 'A green line starts at the bottom left, crosses right, and moves up with an arrowhead staying on the top-right tip labeled We love God, forming the vertical beam.'
        },
        {
          id: 'neighbor',
          pillLabel: 'Step 3: Love Your Neighbor as Yourself',
          heading: CARDS.NEIGHBOR.heading,
          verse: CARDS.NEIGHBOR.verse,
          ref: CARDS.NEIGHBOR.ref,
          note: CARDS.NEIGHBOR.note,
          accent: COLORS.belong,
          accentDark: '#36556B',
          draw: {
            uprightLeft: 'gold',
            downTip: 'gold',
            labelGodLoves: true,
            uprightRight: 'green',
            upTip: 'green',
            labelWeLove: true,
            uprightWash: 'goldGreen',
            armLeftMode: 'belong',
            armRightMode: 'go',
            armLeftWash: 'belong',
            armRightWash: 'go',
            labelLoveChurch: 'bold',
            labelLoveLost: 'bold'
          },
          desc: 'One-third down from the top, top and bottom outward arrows draw and connect at their tips to form the left arm labeled Love the Church and the right arm labeled Love the Lost.'
        },
        {
          id: 'final',
          pillLabel: 'Step 4: The Cross Holds It All',
          heading: 'The Cross Holds It All',
          verse: '"And walk in love, as Christ loved us and gave himself up for us, a fragrant offering and sacrifice to God."',
          ref: 'Ephesians 5:2',
          note: "Christ's cross is the power that makes all this possible. Love comes down, goes up, and reaches out.",
          accent: COLORS.deepRed,
          accentDark: '#6D1422',
          draw: {
            uprightLeft: 'gold',
            downTip: 'gold',
            labelGodLoves: true,
            uprightRight: 'green',
            upTip: 'green',
            labelWeLove: true,
            uprightWash: 'goldGreen',
            armLeftMode: 'belong',
            armRightMode: 'go',
            armLeftWash: 'belong',
            armRightWash: 'go',
            labelLoveChurch: 'bold',
            labelLoveLost: 'bold',
            finishedCross: 'full',
            redTip: true
          },
          desc: 'A pronounced deep red line led by a red arrowhead draws around the whole cross, showing Christ holds Love God, Love the Church, and Love the Lost together.'
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
          pillLabel: 'Step 1: Loved First',
          heading: 'Loved First',
          verse: CARDS.DOWN.verse,
          ref: CARDS.DOWN.ref,
          note: "God's love came down to you, and your love goes back up to Him.",
          accent: COLORS.green,
          accentDark: '#236146',
          quickReview: true,
          draw: {
            uprightLeft: 'gold',
            downTip: 'gold',
            labelGodLoves: true,
            uprightRight: 'green',
            upTip: 'green',
            labelWeLove: true,
            uprightWash: 'goldGreen'
          },
          desc: 'The gold downward arrow God loves us and green upward arrow We love God form the vertical beam.'
        },
        {
          id: 'neighbor',
          pillLabel: 'Step 2: Love Your Neighbor as Yourself',
          heading: CARDS.NEIGHBOR.heading,
          verse: CARDS.NEIGHBOR.verse,
          ref: CARDS.NEIGHBOR.ref,
          note: 'Like the Samaritan, love does not ask who qualifies. It reaches out in both directions.',
          accent: COLORS.neighbor,
          accentDark: '#415260',
          draw: {
            uprightLeft: 'gold',
            downTip: 'gold',
            labelGodLoves: true,
            uprightRight: 'green',
            upTip: 'green',
            labelWeLove: true,
            uprightWash: 'goldGreen',
            armLeftMode: 'blueGrey',
            armRightMode: 'blueGrey',
            armLeftWash: 'blueGrey',
            armRightWash: 'blueGrey',
            labelLoveChurch: 'soft',
            labelLoveLost: 'soft'
          },
          desc: 'Both horizontal arms draw outward with top and bottom arrows connected at the tips.'
        },
        {
          id: 'belong',
          pillLabel: 'Step 3: Belong, Love Your Family in Christ',
          heading: CARDS.BELONG.heading,
          verse: CARDS.BELONG.verse,
          ref: CARDS.BELONG.ref,
          note: CARDS.BELONG.note,
          accent: COLORS.belong,
          accentDark: '#36556B',
          redrawLeftArm: true,
          draw: {
            uprightLeft: 'gold',
            downTip: 'gold',
            labelGodLoves: true,
            uprightRight: 'green',
            upTip: 'green',
            labelWeLove: true,
            uprightWash: 'goldGreen',
            armLeftMode: 'belong',
            armLeftWash: 'belong',
            armRightMode: 'quietSolid',
            labelLoveChurch: 'bold',
            labelBelongInside: 'bold',
            belongIcons: 'bold',
            goPreviewCaption: true
          },
          desc: 'The left arm redraws in bold Belong blue labeled Love the Church with house and table icons underneath, while the right arm dims quietly.'
        },
        {
          id: 'final',
          pillLabel: 'Step 4: Especially the Household of Faith',
          heading: 'Especially the Household of Faith',
          verse: '"So then, as we have opportunity, let us do good to everyone, and especially to those who are of the household of faith."',
          ref: 'Galatians 6:10',
          note: 'Love comes down, goes up, and reaches out, starting with your home and your church family.',
          accent: COLORS.deepRed,
          accentDark: '#6D1422',
          draw: {
            uprightLeft: 'gold',
            downTip: 'gold',
            labelGodLoves: true,
            uprightRight: 'green',
            upTip: 'green',
            labelWeLove: true,
            uprightWash: 'goldGreen',
            armLeftMode: 'belong',
            armLeftWash: 'belong',
            armRightMode: 'quietSolid',
            labelLoveChurch: 'bold',
            labelBelongInside: 'bold',
            belongIcons: 'bold',
            goPreviewCaption: true,
            finishedCross: 'belongFocus',
            redTip: true
          },
          desc: 'A pronounced deep red outline encompasses the vertical beam and Belong arm with house and table icons.'
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
          pillLabel: 'Step 1: Loved and Belonging',
          heading: 'Loved and Belonging',
          verse: '"Beloved, if God so loved us, we also ought to love one another."',
          ref: '1 John 4:11',
          note: 'God loved you first, and He placed you in His family.',
          accent: COLORS.belong,
          accentDark: '#36556B',
          quickReview: true,
          draw: {
            uprightLeft: 'gold',
            downTip: 'gold',
            labelGodLoves: true,
            uprightRight: 'green',
            upTip: 'green',
            labelWeLove: true,
            uprightWash: 'goldGreen',
            armLeftMode: 'belong',
            armLeftWash: 'belongSoft',
            labelLoveChurch: 'soft',
            labelBelongInside: 'soft',
            belongIcons: 'soft'
          },
          desc: 'The vertical beam and the Love the Church Belong arm draw together with house and fellowship table icons.'
        },
        {
          id: 'go',
          pillLabel: 'Step 2: Go, Love Those Not Yet in the Family',
          heading: CARDS.GO.heading,
          verse: CARDS.GO.verse,
          ref: CARDS.GO.ref,
          note: CARDS.GO.note,
          accent: COLORS.go,
          accentDark: '#8E411E',
          draw: {
            uprightLeft: 'gold',
            downTip: 'gold',
            labelGodLoves: true,
            uprightRight: 'green',
            upTip: 'green',
            labelWeLove: true,
            uprightWash: 'goldGreen',
            armLeftMode: 'belong',
            armLeftWash: 'belongSoft',
            labelLoveChurch: 'soft',
            labelBelongInside: 'soft',
            belongIcons: 'soft',
            armRightMode: 'go',
            armRightWash: 'go',
            labelLoveLost: 'bold',
            labelGoInside: true,
            goRings: true
          },
          desc: 'The right arm draws outward with rust top and bottom arrows connected at the tips labeled Love the Lost and Go, widening into rings for home, work and school, neighborhood, and nations.'
        },
        {
          id: 'final',
          pillLabel: 'Step 3: You Are Sent',
          heading: 'You Are Sent',
          verse: '"Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit."',
          ref: 'Matthew 28:19',
          note: 'Love comes down, goes up, and reaches out, starting with the people already around you.',
          accent: COLORS.deepRed,
          accentDark: '#6D1422',
          draw: {
            uprightLeft: 'gold',
            downTip: 'gold',
            labelGodLoves: true,
            uprightRight: 'green',
            upTip: 'green',
            labelWeLove: true,
            uprightWash: 'goldGreen',
            armLeftMode: 'belong',
            armLeftWash: 'belongSoft',
            labelLoveChurch: 'soft',
            labelBelongInside: 'soft',
            belongIcons: 'soft',
            armRightMode: 'go',
            armRightWash: 'go',
            labelLoveLost: 'bold',
            labelGoInside: true,
            goRings: true,
            finishedCross: 'full',
            redTip: true
          },
          desc: 'A pronounced deep red outer line led by a red arrowhead draws around the whole cross, uniting God loves us, We love God, Love the Church, and Love the Lost.'
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
    '  padding: 2px 2px 0;',
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
    // 440 x 268 canvas: larger cross filling stage white space cleanly.
    // Upright: x=[192..248] (56w), y=[14..254] (240h).
    // Crossbar 1/3 from top: y=[72..116] (center y=94 -> (94-14)/240 = 33.3% down!).
    // Left arm x=[68..192] (124w), Right arm x=[248..372] (124w).
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
    uprightGrad.appendChild(svgEl('stop', { offset: '0%', 'stop-color': COLORS.gold, 'stop-opacity': '0.15' }));
    uprightGrad.appendChild(svgEl('stop', { offset: '48%', 'stop-color': COLORS.gold, 'stop-opacity': '0.08' }));
    uprightGrad.appendChild(svgEl('stop', { offset: '52%', 'stop-color': COLORS.green, 'stop-opacity': '0.08' }));
    uprightGrad.appendChild(svgEl('stop', { offset: '100%', 'stop-color': COLORS.green, 'stop-opacity': '0.15' }));
    defs.appendChild(uprightGrad);
    svg.appendChild(defs);

    var paperG = svgEl('g', { 'aria-hidden': 'true' });
    paperG.appendChild(svgEl('rect', { x: 0, y: 0, width: 440, height: 268, fill: '#FFFFFF' }));
    svg.appendChild(paperG);

    // Subtle interior beam washes
    var washG = svgEl('g', { id: 'wash-layer', 'aria-hidden': 'true' });
    var uprightWash = svgEl('path', {
      id: 'wash-upright',
      'class': 'svg-fade',
      d: 'M 192 14 Q 190 134 192 254 Q 220 256 248 254 Q 250 134 248 14 Q 220 12 192 14 Z',
      fill: 'url(#upright-wash-grad)'
    });
    var armLeftWash = svgEl('path', {
      id: 'wash-arm-left',
      'class': 'svg-fade',
      d: 'M 192 72 Q 130 70 68 72 L 68 116 Q 130 118 192 116 Z',
      fill: COLORS.belong,
      'fill-opacity': '0.13'
    });
    var armRightWash = svgEl('path', {
      id: 'wash-arm-right',
      'class': 'svg-fade',
      d: 'M 248 72 Q 310 70 372 72 L 372 116 Q 310 118 248 116 Z',
      fill: COLORS.go,
      'fill-opacity': '0.13'
    });
    var finishedGlow = svgEl('path', {
      id: 'wash-finished',
      'class': 'svg-fade',
      d: 'M 183 6 L 257 6 L 257 63 L 381 63 L 381 124 L 257 124 L 257 262 L 183 262 L 183 124 L 59 124 L 59 63 L 183 63 Z',
      fill: COLORS.deepRed,
      'fill-opacity': '0.05'
    });
    washG.appendChild(uprightWash);
    washG.appendChild(armLeftWash);
    washG.appendChild(armRightWash);
    washG.appendChild(finishedGlow);
    svg.appendChild(washG);

    var strokes = [];
    function addStrokePair(id, dMain, dTex, strokeColor, widthMain, widthTex) {
      var mainPath = svgEl('path', {
        id: id,
        'class': 'svg-stroke',
        d: dMain,
        fill: 'none',
        stroke: strokeColor,
        'stroke-width': String(widthMain || 3.2),
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

    // 1. Gold upright LEFT path: top-right (248, 14) -> top-left (192, 14) -> down to bottom-left (192, 250)
    addStrokePair(
      'stroke-upright-left',
      'M 248 14 Q 220 12 192 14 Q 190 80 191 140 Q 193 196 192 250',
      'M 246.8 15.3 Q 220 13.3 193.3 15.3 Q 191.3 81 192.3 140 Q 194 196 193.2 249',
      COLORS.gold,
      3.3,
      1.3
    );

    // 2. Green upright RIGHT path: bottom-left (192, 254) -> bottom-right (248, 254) -> up to top-right (248, 18)
    addStrokePair(
      'stroke-upright-right',
      'M 192 254 Q 220 256 248 254 Q 250 196 249 136 Q 247 76 248 18',
      'M 193.2 252.7 Q 220 254.7 246.8 252.7 Q 248.8 196 247.8 136 Q 246 76 246.8 19',
      COLORS.green,
      3.3,
      1.3
    );

    // 3. Left arm: top arrow -> bottom arrow -> connect tips vertically
    addStrokePair(
      'stroke-arm-left-top',
      'M 192 72 Q 130 70 72 72',
      'M 191 73.2 Q 130 71.2 73 73.2',
      COLORS.belong,
      3.1,
      1.2
    );
    addStrokePair(
      'stroke-arm-left-bottom',
      'M 192 116 Q 130 118 72 116',
      'M 191 114.8 Q 130 116.8 73 114.8',
      COLORS.belong,
      3.1,
      1.2
    );
    addStrokePair(
      'stroke-arm-left-cap',
      'M 68 72 Q 66 94 68 116',
      'M 69.2 73 Q 67.3 94 69.2 115',
      COLORS.belong,
      3.1,
      1.2
    );

    // 4. Right arm: top arrow -> bottom arrow -> connect tips vertically
    addStrokePair(
      'stroke-arm-right-top',
      'M 248 72 Q 310 70 368 72',
      'M 249 73.2 Q 310 71.2 367 73.2',
      COLORS.go,
      3.1,
      1.2
    );
    addStrokePair(
      'stroke-arm-right-bottom',
      'M 248 116 Q 310 118 368 116',
      'M 249 114.8 Q 310 116.8 367 114.8',
      COLORS.go,
      3.1,
      1.2
    );
    addStrokePair(
      'stroke-arm-right-cap',
      'M 372 72 Q 374 94 372 116',
      'M 370.8 73 Q 372.7 94 370.8 115',
      COLORS.go,
      3.1,
      1.2
    );

    // 5. Pronounced outer encompassing deep-red contour around whole cross (or Belong focus for 202)
    addStrokePair(
      'stroke-finish-full',
      'M 220 5 Q 242 4 257 6 Q 259 35 258 63 Q 320 62 380 64 Q 383 94 380 123 Q 320 125 258 123 Q 259 194 257 262 Q 220 264 183 262 Q 181 194 182 123 Q 120 125 60 123 Q 57 94 60 64 Q 120 62 182 63 Q 181 35 183 6 Q 202 5 216 5',
      'M 220 6.8 Q 241 5.6 255.4 7.6 Q 257.4 35 256.5 64.5 Q 320 63.5 378.4 65.5 Q 381 94 378.4 121.5 Q 320 123.5 256.5 121.5 Q 257.4 194 255.4 260.4 Q 220 262.2 184.6 260.4 Q 182.6 194 183.5 121.5 Q 120 123.5 61.6 121.5 Q 59 94 61.6 65.5 Q 120 63.5 183.5 64.5 Q 182.6 35 184.6 7.6 Q 202 6.6 216 6.8',
      COLORS.deepRed,
      3.6,
      1.5
    );

    addStrokePair(
      'stroke-finish-belong',
      'M 220 5 Q 242 4 257 6 Q 259 134 257 262 Q 220 264 183 262 Q 181 194 182 123 Q 120 125 60 123 Q 57 94 60 64 Q 120 62 182 63 Q 181 35 183 6 Q 202 5 216 5',
      'M 220 6.8 Q 241 5.6 255.4 7.6 Q 257.4 134 255.4 260.4 Q 220 262.2 184.6 260.4 Q 182.6 194 183.5 121.5 Q 120 123.5 61.6 121.5 Q 59 94 61.6 65.5 Q 120 63.5 183.5 64.5 Q 182.6 35 184.6 7.6 Q 202 6.6 216 6.8',
      COLORS.deepRed,
      3.6,
      1.5
    );

    // Permanent arrowheads locked on the image at the end of every drawn line
    function addTipHead(id, d, fillColor) {
      var head = svgEl('path', {
        id: id,
        'class': 'svg-fade',
        d: d,
        fill: fillColor,
        stroke: fillColor,
        'stroke-width': '1',
        'stroke-linejoin': 'round'
      });
      svg.appendChild(head);
      return head;
    }

    var tipHeads = {
      downTip: addTipHead('tip-head-down', 'M 186.5 243 L 192 254.5 L 197.5 243 L 192 246 Z', COLORS.gold),
      upTip: addTipHead('tip-head-up', 'M 242.5 24.5 L 248 13 L 253.5 24.5 L 248 21.5 Z', COLORS.green),
      leftTopTip: addTipHead('tip-head-left-top', 'M 79 67 L 67 72 L 79 77 L 75.5 72 Z', COLORS.belong),
      leftBotTip: addTipHead('tip-head-left-bot', 'M 79 111 L 67 116 L 79 121 L 75.5 116 Z', COLORS.belong),
      rightTopTip: addTipHead('tip-head-right-top', 'M 361 67 L 373 72 L 361 77 L 364.5 72 Z', COLORS.go),
      rightBotTip: addTipHead('tip-head-right-bot', 'M 361 111 L 373 116 L 361 121 L 364.5 116 Z', COLORS.go),
      redTip: addTipHead('tip-head-red', 'M 210 0.5 L 222 5 L 210 9.5 L 213 5 Z', COLORS.deepRed)
    };

    // Words inside upright beam & above left/right horizontal bars (using white space on top of bars!)
    var lblGodLoves = svgEl('text', {
      id: 'lbl-god-loves',
      'class': 'svg-fade hand-label',
      x: 207,
      y: 186,
      transform: 'rotate(90 207 186)',
      'text-anchor': 'middle',
      fill: '#8E6707',
      'font-size': '13'
    }, 'God loves us');
    svg.appendChild(lblGodLoves);

    var lblWeLove = svgEl('text', {
      id: 'lbl-we-love',
      'class': 'svg-fade hand-label',
      x: 233,
      y: 186,
      transform: 'rotate(-90 233 186)',
      'text-anchor': 'middle',
      fill: '#236146',
      'font-size': '13'
    }, 'We love God');
    svg.appendChild(lblWeLove);

    var lblLoveChurch = svgEl('text', {
      id: 'lbl-love-church',
      'class': 'svg-fade hand-label',
      x: 125,
      y: 55,
      'text-anchor': 'middle',
      fill: COLORS.belong,
      'font-size': '13.5'
    }, 'Love the Church');
    svg.appendChild(lblLoveChurch);

    var lblLoveLost = svgEl('text', {
      id: 'lbl-love-lost',
      'class': 'svg-fade hand-label',
      x: 315,
      y: 55,
      'text-anchor': 'middle',
      fill: COLORS.go,
      'font-size': '13.5'
    }, 'Love the Lost');
    svg.appendChild(lblLoveLost);

    var lblBelongInside = svgEl('text', {
      id: 'lbl-belong-inside',
      'class': 'svg-fade hand-label',
      x: 129,
      y: 99,
      'text-anchor': 'middle',
      fill: COLORS.belong,
      'font-size': '17'
    }, 'Belong');
    svg.appendChild(lblBelongInside);

    var lblGoInside = svgEl('text', {
      id: 'lbl-go-inside',
      'class': 'svg-fade hand-label',
      x: 311,
      y: 99,
      'text-anchor': 'middle',
      fill: COLORS.go,
      'font-size': '17'
    }, 'Go');
    svg.appendChild(lblGoInside);

    // 202 quiet Go arm caption below dimmed right arm
    var lbl202GoCaption = svgEl('text', {
      id: 'lbl-202-go-preview',
      'class': 'svg-fade clean-label',
      x: 315,
      y: 135,
      'text-anchor': 'middle',
      fill: '#7A7165',
      'font-size': '10.5',
      'font-weight': '600'
    }, 'Go: Growing Out');
    svg.appendChild(lbl202GoCaption);

    // 202 / 203 Belong house & table icons neatly in lower-left white space under Belong arm (x=66..164, y=136..248)
    var belongIconsG = svgEl('g', { id: 'belong-icons', 'class': 'svg-fade', 'aria-hidden': 'true' });
    belongIconsG.appendChild(svgEl('polygon', {
      points: '76,162 96,144 116,162',
      fill: COLORS.belong,
      'fill-opacity': '0.16'
    }));
    belongIconsG.appendChild(svgEl('rect', {
      x: 118, y: 170, width: 38, height: 10, rx: 3.5,
      fill: COLORS.belong,
      'fill-opacity': '0.18'
    }));
    belongIconsG.appendChild(svgEl('path', {
      d: 'M 74 163 L 96 143 L 118 163 M 80 160 L 80 185 L 112 185 L 112 160',
      fill: 'none',
      stroke: COLORS.ink,
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }));
    belongIconsG.appendChild(svgEl('path', {
      d: 'M 91 185 L 91 171 Q 96 169 101 171 L 101 185',
      fill: 'none',
      stroke: COLORS.belong,
      'stroke-width': '1.8',
      'stroke-linecap': 'round'
    }));
    belongIconsG.appendChild(svgEl('circle', {
      cx: 125, cy: 160, r: 3.8, fill: '#FFFFFF', stroke: COLORS.ink, 'stroke-width': '1.7'
    }));
    belongIconsG.appendChild(svgEl('circle', {
      cx: 137, cy: 158, r: 4, fill: '#FFFFFF', stroke: COLORS.belong, 'stroke-width': '1.8'
    }));
    belongIconsG.appendChild(svgEl('circle', {
      cx: 149, cy: 160, r: 3.8, fill: '#FFFFFF', stroke: COLORS.ink, 'stroke-width': '1.7'
    }));
    belongIconsG.appendChild(svgEl('path', {
      d: 'M 119 169 Q 125 164 131 169 M 132 168 Q 137 163 142 168 M 143 169 Q 149 164 155 169',
      fill: 'none',
      stroke: COLORS.ink,
      'stroke-width': '1.6',
      'stroke-linecap': 'round'
    }));
    belongIconsG.appendChild(svgEl('path', {
      d: 'M 117 171 Q 137 168 157 171 L 155 181 Q 137 183 119 181 Z M 122 181 L 122 191 M 152 181 L 152 191',
      fill: 'none',
      stroke: COLORS.ink,
      'stroke-width': '1.9',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }));
    belongIconsG.appendChild(svgEl('text', {
      x: 115,
      y: 205,
      'text-anchor': 'middle',
      fill: COLORS.inkSoft,
      'font-size': '9.5',
      'class': 'clean-label'
    }, 'home & table'));
    svg.appendChild(belongIconsG);

    // 203 Go widening rings neatly in lower-right white space radiating below/outward from Go arm (x=276..395, y=134..245)
    var goRingsG = svgEl('g', { id: 'go-rings', 'aria-hidden': 'true' });
    var ringPaths = [
      { id: 'go-ring-1', d: 'M 387 74 Q 396 94 387 114', w: 2.2 },
      { id: 'go-ring-2', d: 'M 397 61 Q 412 94 397 127', w: 2.0 },
      { id: 'go-ring-3', d: 'M 407 48 Q 426 94 407 140', w: 1.8 },
      { id: 'go-ring-4', d: 'M 417 36 Q 436 94 417 152', w: 1.6 }
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
      x: 386, y: 55, 'text-anchor': 'end', fill: COLORS.go, 'font-size': '9.2', 'font-weight': '700', 'class': 'clean-label'
    }, 'home'));
    var workTxt = svgEl('text', {
      x: 388, y: 141, 'text-anchor': 'end', fill: COLORS.ink, 'font-size': '9', 'font-weight': '600', 'class': 'clean-label'
    });
    workTxt.appendChild(svgEl('tspan', { x: 388, dy: '0' }, 'work and'));
    workTxt.appendChild(svgEl('tspan', { x: 388, dy: '10' }, 'school'));
    goRingLabels.appendChild(workTxt);
    goRingLabels.appendChild(svgEl('text', {
      x: 405, y: 27, 'text-anchor': 'middle', fill: COLORS.ink, 'font-size': '9', 'font-weight': '600', 'class': 'clean-label'
    }, 'neighborhood'));
    goRingLabels.appendChild(svgEl('text', {
      x: 416, y: 168, 'text-anchor': 'middle', fill: COLORS.go, 'font-size': '9.8', 'font-weight': '700', 'class': 'clean-label'
    }, 'nations'));
    goRingsG.appendChild(goRingLabels);
    svg.appendChild(goRingsG);

    // Live leading pen-tip arrowheads during stroke draw
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
      'stroke-arm-left-top': buildPenTip('pen-tip-ltop', COLORS.belong),
      'stroke-arm-left-bottom': buildPenTip('pen-tip-lbot', COLORS.belong),
      'stroke-arm-left-cap': buildPenTip('pen-tip-lcap', COLORS.belong),
      'stroke-arm-right-top': buildPenTip('pen-tip-rtop', COLORS.go),
      'stroke-arm-right-bottom': buildPenTip('pen-tip-rbot', COLORS.go),
      'stroke-arm-right-cap': buildPenTip('pen-tip-rcap', COLORS.go),
      'stroke-finish-full': buildPenTip('pen-tip-red-full', COLORS.deepRed),
      'stroke-finish-belong': buildPenTip('pen-tip-red-belong', COLORS.deepRed)
    };

    return {
      svg: svg,
      svgTitle: svgTitle,
      svgDesc: svgDesc,
      strokes: strokes,
      penTips: penTips,
      tipHeads: tipHeads,
      parts: {
        uprightWash: uprightWash,
        armLeftWash: armLeftWash,
        armRightWash: armRightWash,
        finishedGlow: finishedGlow,
        lblGodLoves: lblGodLoves,
        lblWeLove: lblWeLove,
        lblLoveChurch: lblLoveChurch,
        lblLoveLost: lblLoveLost,
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

  function getArmColor(mode) {
    if (mode === 'belong') return COLORS.belong;
    if (mode === 'go') return COLORS.go;
    if (mode === 'blueGrey') return COLORS.neighbor;
    if (mode === 'quietSolid') return COLORS.quietGrey;
    return COLORS.ink;
  }

  function buildStrokeTargetMap(stepObj) {
    var d = stepObj.draw || {};
    var map = {};
    map['stroke-upright-left'] = { on: !!d.uprightLeft, color: COLORS.gold, w: 3.3 };
    map['stroke-upright-right'] = { on: !!d.uprightRight, color: COLORS.green, w: 3.3 };

    var lMode = d.armLeftMode;
    var rMode = d.armRightMode;
    var lColor = getArmColor(lMode);
    var rColor = getArmColor(rMode);

    map['stroke-arm-left-top'] = { on: !!lMode, color: lColor, w: 3.1, quiet: lMode === 'quietSolid' };
    map['stroke-arm-left-bottom'] = { on: !!lMode, color: lColor, w: 3.1, quiet: lMode === 'quietSolid' };
    map['stroke-arm-left-cap'] = { on: !!lMode, color: lColor, w: 3.1, quiet: lMode === 'quietSolid' };

    map['stroke-arm-right-top'] = { on: !!rMode, color: rColor, w: 3.1, quiet: rMode === 'quietSolid' };
    map['stroke-arm-right-bottom'] = { on: !!rMode, color: rColor, w: 3.1, quiet: rMode === 'quietSolid' };
    map['stroke-arm-right-cap'] = { on: !!rMode, color: rColor, w: 3.1, quiet: rMode === 'quietSolid' };

    map['stroke-finish-full'] = { on: d.finishedCross === 'full', color: COLORS.deepRed, w: 3.6 };
    map['stroke-finish-belong'] = { on: d.finishedCross === 'belongFocus', color: COLORS.deepRed, w: 3.6 };

    for (var i = 1; i <= 4; i++) {
      map['go-ring-' + i] = { on: !!d.goRings, color: COLORS.go, w: 2.3 - i * 0.16 };
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

    // Clean color-only step circles (no words on buttons)
    var strip = el('div', { 'class': 'step-strip', id: 'step-strip', role: 'group', 'aria-label': 'Lesson steps' });
    var dotButtons = cfg.steps.map(function (st, idx) {
      var btn = el('button', {
        'class': 'step-dot',
        type: 'button',
        'data-step': String(idx),
        'aria-label': st.pillLabel,
        'aria-pressed': 'false'
      });
      btn.style.setProperty('--dot-color', st.accent);
      btn.appendChild(el('span', { 'class': 'step-dot-fill', 'aria-hidden': 'true' }));
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
      var t = svgBundle.tipHeads;
      var washDelay = animate ? (stepObj.quickReview ? '280ms' : '640ms') : '0ms';
      var arrowLabelDelay = animate ? (stepObj.quickReview ? '180ms' : '360ms') : '0ms';

      p.uprightWash.style.setProperty('--fade-delay', washDelay);
      p.uprightWash.classList.toggle('is-visible', !!d.uprightWash);

      p.armLeftWash.style.setProperty('--fade-delay', washDelay);
      p.armLeftWash.setAttribute('fill', d.armLeftWash === 'blueGrey' ? COLORS.neighbor : COLORS.belong);
      p.armLeftWash.setAttribute('fill-opacity', d.armLeftWash === 'belongSoft' ? '0.09' : '0.13');
      p.armLeftWash.classList.toggle('is-visible', !!d.armLeftWash);

      p.armRightWash.style.setProperty('--fade-delay', washDelay);
      p.armRightWash.setAttribute('fill', d.armRightWash === 'blueGrey' ? COLORS.neighbor : COLORS.go);
      p.armRightWash.setAttribute('fill-opacity', '0.13');
      p.armRightWash.classList.toggle('is-visible', !!d.armRightWash);

      p.finishedGlow.setAttribute(
        'd',
        d.finishedCross === 'belongFocus'
          ? 'M 183 6 L 257 6 L 257 262 L 183 262 L 183 124 L 59 124 L 59 63 L 183 63 Z'
          : 'M 183 6 L 257 6 L 257 63 L 381 63 L 381 124 L 257 124 L 257 262 L 183 262 L 183 124 L 59 124 L 59 63 L 183 63 Z'
      );
      p.finishedGlow.style.setProperty('--fade-delay', animate ? '520ms' : '0ms');
      p.finishedGlow.classList.toggle('is-visible', !!d.finishedCross);

      // Permanent arrowheads stay cleanly on finished lines
      t.downTip.style.setProperty('--fade-delay', animate ? '820ms' : '0ms');
      t.downTip.classList.toggle('is-visible', !!d.downTip);

      t.upTip.style.setProperty('--fade-delay', animate ? '820ms' : '0ms');
      t.upTip.classList.toggle('is-visible', !!d.upTip);

      var lCol = getArmColor(d.armLeftMode);
      var rCol = getArmColor(d.armRightMode);
      t.leftTopTip.setAttribute('fill', lCol);
      t.leftTopTip.setAttribute('stroke', lCol);
      t.leftBotTip.setAttribute('fill', lCol);
      t.leftBotTip.setAttribute('stroke', lCol);
      t.rightTopTip.setAttribute('fill', rCol);
      t.rightTopTip.setAttribute('stroke', rCol);
      t.rightBotTip.setAttribute('fill', rCol);
      t.rightBotTip.setAttribute('stroke', rCol);

      t.leftTopTip.style.setProperty('--fade-delay', animate ? '320ms' : '0ms');
      t.leftBotTip.style.setProperty('--fade-delay', animate ? '560ms' : '0ms');
      t.leftTopTip.classList.toggle('is-visible', !!d.armLeftMode && d.armLeftMode !== 'quietSolid');
      t.leftBotTip.classList.toggle('is-visible', !!d.armLeftMode && d.armLeftMode !== 'quietSolid');
      t.leftTopTip.classList.toggle('is-soft', d.armLeftMode === 'quietSolid');
      t.leftBotTip.classList.toggle('is-soft', d.armLeftMode === 'quietSolid');

      t.rightTopTip.style.setProperty('--fade-delay', animate ? '780ms' : '0ms');
      t.rightBotTip.style.setProperty('--fade-delay', animate ? '1020ms' : '0ms');
      t.rightTopTip.classList.toggle('is-visible', !!d.armRightMode && d.armRightMode !== 'quietSolid');
      t.rightBotTip.classList.toggle('is-visible', !!d.armRightMode && d.armRightMode !== 'quietSolid');

      t.redTip.style.setProperty('--fade-delay', animate ? '940ms' : '0ms');
      t.redTip.classList.toggle('is-visible', !!d.redTip);

      // Words
      p.lblGodLoves.style.setProperty('--fade-delay', arrowLabelDelay);
      p.lblGodLoves.classList.toggle('is-visible', !!d.labelGodLoves);

      p.lblWeLove.style.setProperty('--fade-delay', arrowLabelDelay);
      p.lblWeLove.classList.toggle('is-visible', !!d.labelWeLove);

      p.lblLoveChurch.style.setProperty('--fade-delay', animate ? '520ms' : '0ms');
      p.lblLoveChurch.classList.toggle('is-visible', d.labelLoveChurch === 'bold');
      p.lblLoveChurch.classList.toggle('is-soft', d.labelLoveChurch === 'soft');

      p.lblLoveLost.style.setProperty('--fade-delay', animate ? '960ms' : '0ms');
      p.lblLoveLost.classList.toggle('is-visible', d.labelLoveLost === 'bold');
      p.lblLoveLost.classList.toggle('is-soft', d.labelLoveLost === 'soft');

      p.lblBelongInside.style.setProperty('--fade-delay', washDelay);
      p.lblBelongInside.classList.toggle('is-visible', d.labelBelongInside === 'bold');
      p.lblBelongInside.classList.toggle('is-soft', d.labelBelongInside === 'soft');

      p.lblGoInside.style.setProperty('--fade-delay', washDelay);
      p.lblGoInside.classList.toggle('is-visible', !!d.labelGoInside);

      p.belongIconsG.style.setProperty('--fade-delay', washDelay);
      p.belongIconsG.classList.toggle('is-visible', d.belongIcons === 'bold');
      p.belongIconsG.classList.toggle('is-soft', d.belongIcons === 'soft');

      p.goRingLabels.style.setProperty('--fade-delay', animate ? '640ms' : '0ms');
      p.goRingLabels.classList.toggle('is-visible', !!d.goRings);

      p.lbl202GoCaption.style.setProperty('--fade-delay', animate ? '260ms' : '0ms');
      p.lbl202GoCaption.classList.toggle('is-visible', !!d.goPreviewCaption);
    }

    // Sequenced sub-windows [startFrac, endFrac] so arm strokes draw:
    // Left top -> Left bottom -> Left connect -> Right top -> Right bottom -> Right connect
    function getSegmentWindow(id, hasLeftNew, hasRightNew) {
      if (id === 'stroke-arm-left-top') return [0.0, hasRightNew ? 0.17 : 0.36];
      if (id === 'stroke-arm-left-bottom') return [hasRightNew ? 0.17 : 0.36, hasRightNew ? 0.34 : 0.72];
      if (id === 'stroke-arm-left-cap') return [hasRightNew ? 0.34 : 0.72, hasRightNew ? 0.48 : 1.0];
      if (id === 'stroke-arm-right-top') return [hasLeftNew ? 0.52 : 0.0, hasLeftNew ? 0.69 : 0.36];
      if (id === 'stroke-arm-right-bottom') return [hasLeftNew ? 0.69 : 0.36, hasLeftNew ? 0.86 : 0.72];
      if (id === 'stroke-arm-right-cap') return [hasLeftNew ? 0.86 : 0.72, 1.0];
      return [0.0, 1.0];
    }

    function applyStrokePair(mainId, target, treatAsOn, animate, animItems, win) {
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
            var tip = (!isTex && svgBundle.penTips[mainId]) ? svgBundle.penTips[mainId] : null;
            if (tip) {
              var tipPaths = tip.querySelectorAll('path');
              for (var k = 0; k < tipPaths.length; k++) {
                tipPaths[k].setAttribute('fill', target.color);
                tipPaths[k].setAttribute('stroke', target.color);
              }
            }
            animItems.push({
              node: node,
              len: len,
              tip: tip,
              w0: win[0],
              w1: win[1]
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
        animItems.forEach(function (item) {
          var localRaw = (raw - item.w0) / Math.max(0.01, item.w1 - item.w0);
          localRaw = Math.max(0, Math.min(1, localRaw));
          var eased = 1 - Math.pow(1 - localRaw, 2.0);
          var drawn = item.len * eased;
          item.node.style.strokeDashoffset = (item.len - drawn).toFixed(1);
          if (item.tip) {
            if (localRaw > 0 && localRaw < 0.99) {
              positionPenTip(item, drawn);
            } else {
              item.tip.classList.remove('is-active');
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

      var hasLeftArmNew = !!(st.draw && st.draw.armLeftMode && (!prevStrokeMap['stroke-arm-left-top'].on || st.redrawLeftArm));
      var hasRightArmNew = !!(st.draw && st.draw.armRightMode && !prevStrokeMap['stroke-arm-right-top'].on);
      var strokeDur = st.quickReview ? 680 : ((hasLeftArmNew && hasRightArmNew) ? 1480 : 1020);

      host.classList.add('is-instant');

      var animItems = [];
      Object.keys(nextStrokeMap).forEach(function (id) {
        var nextT = nextStrokeMap[id];
        var wasT = prevStrokeMap[id] || { on: false };
        var forceRedraw = !!(st.redrawLeftArm && id.indexOf('stroke-arm-left-') === 0);
        var treatAsOn = !forceRedraw && wasT.on;
        var singleNode = document.getElementById(id);
        var hasTex = !!document.getElementById(id + '-tex');
        var win = getSegmentWindow(id, hasLeftArmNew, hasRightArmNew);

        if (hasTex) {
          applyStrokePair(id, nextT, treatAsOn, animate, animItems, win);
        } else if (singleNode) {
          var len = parseFloat(singleNode.dataset.len || '300');
          if (nextT.color) singleNode.setAttribute('stroke', nextT.color);
          if (nextT.on) {
            if (animate && !treatAsOn) {
              singleNode.style.strokeDashoffset = String(len);
              singleNode.classList.add('is-visible');
              animItems.push({ node: singleNode, len: len, tip: null, w0: 0, w1: 1 });
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

      dotButtons.forEach(function (btn, idx) {
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
