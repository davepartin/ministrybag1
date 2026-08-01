export type CategoryId =
  | 'authority'
  | 'scripture'
  | 'election'
  | 'baptismRecipients'
  | 'baptismMeaning'
  | 'communion'
  | 'worship'
  | 'governance'
  | 'women'
  | 'gifts'
  | 'marriage'
  | 'endTimes';

export type DenominationId =
  | 'catholic'
  | 'nondenom'
  | 'sbc'
  | 'umc'
  | 'episcopal'
  | 'aog'
  | 'elca'
  | 'lcms'
  | 'pcusa'
  | 'pca'
  | 'orthodox'
  | 'churchesOfChrist';

export interface Denomination {
  id: DenominationId;
  name: string;
  shortName: string;
  abbreviation: string;
  family: string;
  description: string;
  color: string;
  softColor: string;
  sourceUrl: string;
  sourceLabel: string;
  variation?: string;
  scores: Record<CategoryId, number>;
}

export interface Category {
  id: CategoryId;
  name: string;
  question: string;
  leftLabel: string;
  rightLabel: string;
  steps: [string, string, string, string, string];
  setId: number;
}

export const CATEGORIES: Category[] = [
  {
    id: 'authority',
    name: 'Scripture, tradition & authority',
    question: 'How is final doctrinal authority understood?',
    leftLabel: 'Church & tradition',
    rightLabel: 'Scripture alone',
    steps: [
      'Scripture within apostolic tradition and the church’s teaching authority',
      'Scripture read within historic creeds and tradition',
      'Scripture is primary, with tradition and reason as important guides',
      'Scripture is the final norm, interpreted through a confessional tradition',
      'Scripture is the sole final authority for faith and practice',
    ],
    setId: 1,
  },
  {
    id: 'scripture',
    name: 'Doctrine of Scripture',
    question: 'How precisely is biblical inspiration described?',
    leftLabel: 'Inspired & authoritative',
    rightLabel: 'Inerrant',
    steps: [
      'Inspired and authoritative without requiring modern inerrancy language',
      'Inspired and authoritative, with room for historical-critical readings',
      'Fully inspired; official language does not center on inerrancy',
      'Strong view of biblical truthfulness with some internal variety',
      'The written Word of God, true and without error in its original form',
    ],
    setId: 1,
  },
  {
    id: 'election',
    name: 'Grace, freedom & election',
    question: 'Where does the tradition place its theological emphasis?',
    leftLabel: 'Free response',
    rightLabel: 'Reformed election',
    steps: [
      'Prevenient grace enables a genuine human response to the gospel',
      'Emphasizes grace and human response without Reformed predestination',
      'Holds divine initiative and human response together without a defining system',
      'Emphasizes God’s electing grace while rejecting some stricter formulations',
      'Confessionally Reformed emphasis on sovereign election',
    ],
    setId: 1,
  },
  {
    id: 'baptismRecipients',
    name: 'Who is baptized?',
    question: 'Does the church baptize infants as well as professing believers?',
    leftLabel: 'Infants & converts',
    rightLabel: 'Professing believers',
    steps: [
      'Baptizes infants and converts',
      'Normally baptizes infants and converts, with pastoral exceptions',
      'Practices vary or both approaches are common',
      'Normally practices believer’s baptism, with some local variation',
      'Baptizes those who personally profess faith',
    ],
    setId: 2,
  },
  {
    id: 'baptismMeaning',
    name: 'What does baptism do?',
    question: 'Is baptism understood primarily as a sacrament or an ordinance?',
    leftLabel: 'Means of grace',
    rightLabel: 'Public symbol',
    steps: [
      'A sacramental means through which God gives and confirms grace',
      'A sacrament and covenant sign closely joined to God’s promise',
      'A covenantal sign of grace, without teaching baptismal regeneration',
      'An act of obedience that visibly proclaims grace already received',
      'A symbolic ordinance testifying to personal faith',
    ],
    setId: 2,
  },
  {
    id: 'communion',
    name: 'Christ in Communion',
    question: 'How is Christ’s presence in the Lord’s Supper understood?',
    leftLabel: 'Real presence',
    rightLabel: 'Memorial',
    steps: [
      'Christ is truly present in the consecrated elements',
      'A sacramental real presence, described without one required mechanism',
      'Christ is spiritually present and received by faith',
      'A memorial with a strong emphasis on spiritual participation',
      'A symbolic memorial ordinance',
    ],
    setId: 2,
  },
  {
    id: 'worship',
    name: 'Typical worship pattern',
    question: 'What shape does a typical service take?',
    leftLabel: 'Historic liturgy',
    rightLabel: 'Free-form',
    steps: [
      'Historic, sacramental liturgy shapes weekly worship',
      'Usually liturgical, with meaningful local flexibility',
      'Blended or structured worship with wide congregational variation',
      'Usually sermon-and-song centered, with flexible order',
      'Free-form or contemporary worship is common',
    ],
    setId: 2,
  },
  {
    id: 'governance',
    name: 'Church governance',
    question: 'Where does formal governing authority sit?',
    leftLabel: 'Bishops & hierarchy',
    rightLabel: 'Local congregation',
    steps: [
      'Bishops hold formal authority within a connected hierarchy',
      'Episcopal or connectional leadership joins local and wider authority',
      'Councils, presbyteries, or conferences share authority',
      'Congregations govern locally within a voluntary denominational structure',
      'The local congregation is autonomous',
    ],
    setId: 3,
  },
  {
    id: 'women',
    name: 'Women in senior pastoral office',
    question: 'May women serve in the denomination’s senior ordained office?',
    leftLabel: 'All offices open',
    rightLabel: 'Pastorate restricted',
    steps: [
      'Women are ordained and may serve in the senior pastoral or episcopal office',
      'Women are ordained, though local practice may vary',
      'No single binding position across the tradition',
      'Most senior pastoral roles are held by men, with meaningful local variation',
      'The senior pastoral or priestly office is reserved for men',
    ],
    setId: 3,
  },
  {
    id: 'gifts',
    name: 'Charismatic gifts',
    question: 'How actively are miraculous gifts expected in church life?',
    leftLabel: 'Actively expected',
    rightLabel: 'Cautious / ceased',
    steps: [
      'Spirit baptism and miraculous gifts are actively taught and expected',
      'Continuationist practice is common or warmly welcomed',
      'Open but not defining; practice varies widely',
      'Cautious, with limited charismatic practice',
      'Cessationist or strongly non-charismatic in ordinary practice',
    ],
    setId: 4,
  },
  {
    id: 'marriage',
    name: 'Marriage teaching',
    question: 'Does the denomination authorize same-sex marriage rites?',
    leftLabel: 'Rites authorized',
    rightLabel: 'Man & woman only',
    steps: [
      'Same-sex marriage rites and married LGBTQ clergy are authorized',
      'Affirming policy with some protections for dissenting congregations or clergy',
      'Policy or practice is mixed across the tradition',
      'Official teaching is traditional, with some local variation',
      'Marriage is officially defined as the covenant of one man and one woman',
    ],
    setId: 4,
  },
  {
    id: 'endTimes',
    name: 'End-times emphasis',
    question: 'How central is a premillennial timeline?',
    leftLabel: 'Amillennial / open',
    rightLabel: 'Premillennial emphasis',
    steps: [
      'Typically amillennial or focused on the creedal hope without a timeline',
      'Usually amillennial, while allowing some range',
      'No binding millennial position; several views coexist',
      'Premillennialism is common but not always required',
      'Premillennial return of Christ is a defining doctrinal emphasis',
    ],
    setId: 5,
  },
];

export const DENOMINATIONS: Denomination[] = [
  {
    id: 'catholic',
    name: 'Roman Catholic Church',
    shortName: 'Roman Catholic',
    abbreviation: 'RC',
    family: 'Catholic',
    description: 'A worldwide sacramental communion led by bishops in union with the pope.',
    color: '#b42318',
    softColor: '#fff1f0',
    sourceUrl: 'https://www.vatican.va/archive/ENG0015/_INDEX.HTM',
    sourceLabel: 'Catechism of the Catholic Church',
    scores: { authority: 1, scripture: 3, election: 2, baptismRecipients: 1, baptismMeaning: 1, communion: 1, worship: 1, governance: 1, women: 5, gifts: 3, marriage: 5, endTimes: 1 },
  },
  {
    id: 'nondenom',
    name: 'Nondenominational Evangelical',
    shortName: 'Nondenominational',
    abbreviation: 'ND',
    family: 'Evangelical',
    description: 'Independent churches, usually evangelical, with no single governing body or confession.',
    color: '#6d28d9',
    softColor: '#f5f3ff',
    sourceUrl: 'https://www.nae.org/statement-of-faith/',
    sourceLabel: 'Representative evangelical statement',
    variation: 'This is a broad family, not one denomination. Local churches may differ substantially.',
    scores: { authority: 5, scripture: 4, election: 3, baptismRecipients: 5, baptismMeaning: 5, communion: 5, worship: 5, governance: 5, women: 3, gifts: 2, marriage: 4, endTimes: 4 },
  },
  {
    id: 'sbc',
    name: 'Southern Baptist Convention',
    shortName: 'Southern Baptist',
    abbreviation: 'SBC',
    family: 'Evangelical Baptist',
    description: 'A cooperative body of autonomous Baptist churches and the largest U.S. Protestant denomination.',
    color: '#155eef',
    softColor: '#eff4ff',
    sourceUrl: 'https://bfm.sbc.net/bfm2000/',
    sourceLabel: 'Baptist Faith and Message 2000',
    scores: { authority: 5, scripture: 5, election: 3, baptismRecipients: 5, baptismMeaning: 5, communion: 5, worship: 4, governance: 5, women: 5, gifts: 4, marriage: 5, endTimes: 3 },
  },
  {
    id: 'umc',
    name: 'United Methodist Church',
    shortName: 'United Methodist',
    abbreviation: 'UMC',
    family: 'Mainline Wesleyan',
    description: 'A global Wesleyan denomination shaped by grace, connectional ministry, and practical holiness.',
    color: '#c11574',
    softColor: '#fdf2fa',
    sourceUrl: 'https://www.umc.org/en/content/what-we-believe-what-it-means-to-be-united-methodist',
    sourceLabel: 'What United Methodists believe',
    scores: { authority: 3, scripture: 2, election: 1, baptismRecipients: 1, baptismMeaning: 2, communion: 3, worship: 2, governance: 2, women: 1, gifts: 3, marriage: 1, endTimes: 2 },
  },
  {
    id: 'episcopal',
    name: 'The Episcopal Church',
    shortName: 'Episcopal',
    abbreviation: 'TEC',
    family: 'Mainline Anglican',
    description: 'The U.S. Anglican province, joining historic liturgy and episcopal governance with broad theological latitude.',
    color: '#175cd3',
    softColor: '#eff8ff',
    sourceUrl: 'https://www.episcopalchurch.org/what-we-believe/',
    sourceLabel: 'The Episcopal Church: What We Believe',
    scores: { authority: 2, scripture: 2, election: 3, baptismRecipients: 1, baptismMeaning: 1, communion: 2, worship: 1, governance: 1, women: 1, gifts: 3, marriage: 1, endTimes: 1 },
  },
  {
    id: 'aog',
    name: 'Assemblies of God (USA)',
    shortName: 'Assemblies of God',
    abbreviation: 'AG',
    family: 'Pentecostal',
    description: 'A Pentecostal fellowship emphasizing salvation, Spirit baptism, divine healing, and Christ’s return.',
    color: '#d92d20',
    softColor: '#fef3f2',
    sourceUrl: 'https://ag.org/en/Beliefs/Statement-of-Fundamental-Truths',
    sourceLabel: 'Statement of Fundamental Truths',
    scores: { authority: 5, scripture: 5, election: 1, baptismRecipients: 5, baptismMeaning: 5, communion: 5, worship: 5, governance: 4, women: 1, gifts: 1, marriage: 5, endTimes: 5 },
  },
  {
    id: 'elca',
    name: 'Evangelical Lutheran Church in America',
    shortName: 'ELCA Lutheran',
    abbreviation: 'ELCA',
    family: 'Mainline Lutheran',
    description: 'The largest U.S. Lutheran body, rooted in the Lutheran confessions and active ecumenical partnership.',
    color: '#7a271a',
    softColor: '#fef6ee',
    sourceUrl: 'https://www.elca.org/about/what-we-believe',
    sourceLabel: 'ELCA: What We Believe',
    scores: { authority: 3, scripture: 2, election: 3, baptismRecipients: 1, baptismMeaning: 1, communion: 1, worship: 1, governance: 2, women: 1, gifts: 3, marriage: 1, endTimes: 1 },
  },
  {
    id: 'lcms',
    name: 'Lutheran Church—Missouri Synod',
    shortName: 'LCMS Lutheran',
    abbreviation: 'LCMS',
    family: 'Confessional Lutheran',
    description: 'A confessional Lutheran synod emphasizing biblical inerrancy, justification, and the means of grace.',
    color: '#c01048',
    softColor: '#fff1f3',
    sourceUrl: 'https://www.lcms.org/about/beliefs',
    sourceLabel: 'LCMS Beliefs and Practice',
    scores: { authority: 5, scripture: 5, election: 4, baptismRecipients: 1, baptismMeaning: 1, communion: 1, worship: 1, governance: 4, women: 5, gifts: 4, marriage: 5, endTimes: 1 },
  },
  {
    id: 'pcusa',
    name: 'Presbyterian Church (U.S.A.)',
    shortName: 'Presbyterian (PCUSA)',
    abbreviation: 'PCUSA',
    family: 'Mainline Reformed',
    description: 'A mainline Reformed denomination governed through sessions, presbyteries, synods, and a general assembly.',
    color: '#087e8b',
    softColor: '#ecfdf3',
    sourceUrl: 'https://www.pcusa.org/about-pcusa/what-we-believe',
    sourceLabel: 'PC(USA): What We Believe',
    scores: { authority: 4, scripture: 2, election: 4, baptismRecipients: 1, baptismMeaning: 2, communion: 3, worship: 2, governance: 3, women: 1, gifts: 3, marriage: 1, endTimes: 2 },
  },
  {
    id: 'pca',
    name: 'Presbyterian Church in America',
    shortName: 'Presbyterian (PCA)',
    abbreviation: 'PCA',
    family: 'Evangelical Reformed',
    description: 'A confessional Reformed denomination governed by elders and committed to the Westminster Standards.',
    color: '#344054',
    softColor: '#f2f4f7',
    sourceUrl: 'https://pcanet.org/about-the-pca-2-3/',
    sourceLabel: 'About the Presbyterian Church in America',
    scores: { authority: 5, scripture: 5, election: 5, baptismRecipients: 1, baptismMeaning: 2, communion: 3, worship: 3, governance: 3, women: 5, gifts: 4, marriage: 5, endTimes: 2 },
  },
  {
    id: 'orthodox',
    name: 'Eastern Orthodox Church',
    shortName: 'Eastern Orthodox',
    abbreviation: 'EO',
    family: 'Orthodox',
    description: 'A communion of self-governing churches sharing ancient liturgy, bishops, councils, and sacramental theology.',
    color: '#b54708',
    softColor: '#fffaeb',
    sourceUrl: 'https://www.oca.org/orthodoxy/the-orthodox-faith',
    sourceLabel: 'Orthodox Church in America: The Orthodox Faith',
    variation: 'Orthodoxy is a communion of churches, not one U.S. denomination. This profile reflects common Eastern Orthodox teaching.',
    scores: { authority: 1, scripture: 2, election: 2, baptismRecipients: 1, baptismMeaning: 1, communion: 1, worship: 1, governance: 1, women: 5, gifts: 3, marriage: 5, endTimes: 1 },
  },
  {
    id: 'churchesOfChrist',
    name: 'Churches of Christ',
    shortName: 'Churches of Christ',
    abbreviation: 'CoC',
    family: 'Restorationist',
    description: 'Autonomous congregations in the Stone-Campbell tradition, centered on restoring New Testament church practice.',
    color: '#027a48',
    softColor: '#ecfdf3',
    sourceUrl: 'https://christianchronicle.org/churches-of-christ-a-quick-introduction/',
    sourceLabel: 'Churches of Christ: an introduction',
    variation: 'There is no headquarters or binding confession. Congregational differences are significant.',
    scores: { authority: 5, scripture: 4, election: 1, baptismRecipients: 5, baptismMeaning: 2, communion: 4, worship: 4, governance: 5, women: 4, gifts: 4, marriage: 5, endTimes: 3 },
  },
];

export const CATEGORY_SETS = [
  { id: 1, name: 'Authority & salvation', description: 'How truth, Scripture, grace, and human response are understood.' },
  { id: 2, name: 'Sacraments & worship', description: 'How baptism, Communion, and gathered worship take shape.' },
  { id: 3, name: 'Church & ministry', description: 'How churches are governed and who may hold senior pastoral office.' },
  { id: 4, name: 'Spiritual life & ethics', description: 'Charismatic practice and official marriage teaching.' },
  { id: 5, name: 'Last things', description: 'How strongly the tradition emphasizes a particular end-times timeline.' },
];
