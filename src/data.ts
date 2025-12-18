export type DenominationId =
  | 'catholic'
  | 'sbc'
  | 'umc'
  | 'anglican'
  | 'aog'
  | 'elca'
  | 'lcms'
  | 'pcusa'
  | 'pca'
  | 'nondenom';

export interface Denomination {
  id: DenominationId;
  name: string;
  scores: Record<number, number>; // CategoryId -> Score
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  leftLabel: string; // Score 1
  rightLabel: string; // Score 5
  setId: number;
}

export const CATEGORIES: Category[] = [
  // Set 1: Theological Foundations
  { id: 1, name: 'The Trinity', leftLabel: 'Non-Trinitarian', rightLabel: 'Trinitarian', setId: 1 },
  { id: 2, name: 'Authority of Scripture', leftLabel: 'Inspired / Human', rightLabel: 'Inerrant / Infallible', setId: 1 },
  { id: 3, name: 'Source of Truth', leftLabel: 'Scripture + Tradition', rightLabel: 'Sola Scriptura', setId: 1 },
  { id: 4, name: 'Salvation', leftLabel: 'Faith + Sacraments', rightLabel: 'Faith Alone', setId: 1 },
  { id: 5, name: 'Predestination', leftLabel: 'Arminian / Free Will', rightLabel: 'Calvinist / Sovereign', setId: 1 },
  { id: 6, name: 'Original Sin', leftLabel: 'Tabula Rasa', rightLabel: 'Total Depravity', setId: 1 },

  // Set 2: Social & Cultural
  { id: 7, name: 'Homosexuality', leftLabel: 'Affirming', rightLabel: 'Prohibited', setId: 2 },
  { id: 8, name: 'Abortion', leftLabel: 'Pro-Choice', rightLabel: 'Pro-Life', setId: 2 },
  { id: 9, name: 'Women in Leadership', leftLabel: 'Egalitarian', rightLabel: 'Complementarian', setId: 2 },


  // Set 3: Practice & Supernatural
  { id: 11, name: 'The Eucharist', leftLabel: 'Real Presence', rightLabel: 'Symbolic', setId: 3 }, // Note: User prompt says 1=Real Presence, 5=Symbolic. Checked.
  { id: 12, name: 'Baptism', leftLabel: 'Infant Baptism', rightLabel: "Believer's Only", setId: 3 },
  { id: 13, name: 'Spiritual Gifts', leftLabel: 'Continuationist', rightLabel: 'Cessationist', setId: 3 },

  // Set 4: Eschatology
  { id: 14, name: 'Hell', leftLabel: 'Universalism', rightLabel: 'Eternal Torment', setId: 4 },
  { id: 15, name: 'Return of Christ', leftLabel: 'Symbolic / Amillennial', rightLabel: 'Literal / Premillennial', setId: 4 },
];

export const DENOMINATIONS: Denomination[] = [
  {
    id: 'catholic',
    name: 'Catholic Church',
    scores: {
      1: 5, 2: 3, 3: 1, 4: 1, 5: 2, 6: 3, // Theo
      7: 5, 8: 5, 9: 5, // Social
      11: 1, 12: 1, 13: 2, // Practice
      14: 5, 15: 3 // Eschatology
    }
  },
  {
    id: 'sbc',
    name: 'Southern Baptist',
    scores: {
      1: 5, 2: 5, 3: 5, 4: 5, 5: 3, 6: 4,
      7: 5, 8: 5, 9: 5,
      11: 5, 12: 5, 13: 4,
      14: 5, 15: 5
    }
  },
  {
    id: 'umc',
    name: 'United Methodist',
    scores: {
      1: 5, 2: 2, 3: 2, 4: 4, 5: 2, 6: 3,
      7: 2, 8: 2, 9: 1,
      11: 3, 12: 1, 13: 3,
      14: 3, 15: 2
    }
  },
  {
    id: 'anglican',
    name: 'Anglican / Episcopal',
    scores: {
      1: 5, 2: 2, 3: 2, 4: 3, 5: 3, 6: 3,
      7: 2, 8: 2, 9: 1,
      11: 2, 12: 1, 13: 3,
      14: 3, 15: 2
    }
  },
  {
    id: 'aog',
    name: 'Assemblies of God',
    scores: {
      1: 5, 2: 5, 3: 5, 4: 5, 5: 2, 6: 4,
      7: 5, 8: 5, 9: 2,
      11: 5, 12: 5, 13: 1,
      14: 5, 15: 5
    }
  },
  {
    id: 'elca',
    name: 'ELCA Lutheran',
    scores: {
      1: 5, 2: 2, 3: 4, 4: 5, 5: 4, 6: 5,
      7: 2, 8: 2, 9: 1,
      11: 1, 12: 1, 13: 3,
      14: 2, 15: 2
    }
  },
  {
    id: 'lcms',
    name: 'LCMS Lutheran',
    scores: {
      1: 5, 2: 5, 3: 5, 4: 5, 5: 4, 6: 5,
      7: 5, 8: 5, 9: 5,
      11: 1, 12: 1, 13: 5,
      14: 5, 15: 3
    }
  },
  {
    id: 'pcusa',
    name: 'Presbyterian (PCUSA)',
    scores: {
      1: 5, 2: 2, 3: 3, 4: 4, 5: 4, 6: 3,
      7: 2, 8: 2, 9: 1,
      11: 3, 12: 1, 13: 4,
      14: 3, 15: 2
    }
  },
  {
    id: 'pca',
    name: 'Presbyterian (PCA)',
    scores: {
      1: 5, 2: 5, 3: 5, 4: 5, 5: 5, 6: 5,
      7: 5, 8: 5, 9: 5,
      11: 3, 12: 1, 13: 5,
      14: 5, 15: 4
    }
  },
  {
    id: 'nondenom',
    name: 'Non-Denominational',
    scores: {
      1: 5, 2: 5, 3: 5, 4: 5, 5: 3, 6: 3,
      7: 5, 8: 5, 9: 4,
      11: 5, 12: 5, 13: 3,
      14: 4, 15: 5
    }
  }
];

export const CATEGORY_SETS = [
  { id: 1, name: 'Theological Foundations' },
  { id: 2, name: 'Social & Cultural' },
  { id: 3, name: 'Practice & Supernatural' },
  { id: 4, name: 'Eschatology' },
];
