/**
 * codebook.js — Code book data array + search() + decode().
 * 18 entries. Honest confidence levels and etymology types.
 * Single source of truth importable by both sender (search) and receiver (decode).
 */

/**
 * @typedef {Object} CodeEntry
 * @property {string} code           - Digit string
 * @property {string} meaning_ko     - Korean meaning
 * @property {string} meaning_en     - English meaning
 * @property {string[]} keywords_ko  - Korean search keywords
 * @property {string[]} keywords_en  - English search keywords
 * @property {'folk'|'direct'|'reference'} etymology_type
 * @property {'high'|'medium'|'low'} confidence
 * @property {string} note_ko        - Origin explanation (Korean)
 * @property {string} note_en        - Origin explanation (English)
 */

/** @type {CodeEntry[]} */
export const CODEBOOK = [
  {
    code: '8282',
    meaning_ko: '빨리빨리',
    meaning_en: 'Hurry up',
    keywords_ko: ['빨리', '빨리빨리', '급해', '빠르게', '서둘러'],
    keywords_en: ['hurry', 'quick', 'fast', 'rush'],
    etymology_type: 'folk',
    confidence: 'high',
    note_ko: '8=팔→빨, 2=이→리. 빨리를 두 번 반복.',
    note_en: '8=pal→ppal, 2=i→ri. "Hurry" repeated twice.',
  },
  {
    code: '1004',
    meaning_ko: '천사',
    meaning_en: 'Angel',
    keywords_ko: ['천사', '천사님', 'angel'],
    keywords_en: ['angel', 'heavenly'],
    etymology_type: 'direct',
    confidence: 'high',
    note_ko: '1004를 한자음으로 읽으면 천사(천=1000, 사=4)로, "angel"과 동음이다.',
    note_en: '1004 reads as cheonsa in Sino-Korean (cheon=1000, sa=4), a direct homonym for "angel".',
  },
  {
    code: '486',
    meaning_ko: '사랑해',
    meaning_en: 'I love you',
    keywords_ko: ['사랑', '사랑해', 'love'],
    keywords_en: ['love', 'i love you'],
    etymology_type: 'folk',
    confidence: 'high',
    note_ko: '4=사, 8=팔→랑, 6=육→해. 느슨한 소리 매핑이지만 대중문화에서 널리 인용됨.',
    note_en: '4=sa, 8=pal→rang, 6=yuk→hae. Loose sound mapping but widely referenced in pop culture.',
  },
  {
    code: '7942',
    meaning_ko: '친구사이',
    meaning_en: 'Between friends',
    keywords_ko: ['친구', '친구사이', '우정', 'friend'],
    keywords_en: ['friend', 'between friends', 'friendship'],
    etymology_type: 'folk',
    confidence: 'high',
    note_ko: '7=칠→친, 9=구, 4=사, 2=이 → 친구사이.',
    note_en: '7=chil→chin, 9=gu, 4=sa, 2=i → chingusai (between friends).',
  },
  {
    code: '0242',
    meaning_ko: '연인사이',
    meaning_en: 'Between lovers',
    keywords_ko: ['연인', '연인사이', '연애', 'lover'],
    keywords_en: ['lover', 'between lovers', 'relationship'],
    etymology_type: 'folk',
    confidence: 'high',
    note_ko: '0=영→연, 2=이, 4=사, 2=이 → 연인사이. 0=영→연 연결은 느슨하지만 널리 인용되는 코드이다.',
    note_en: '0=yeong→yeon, 2=i, 4=sa, 2=i → yeoninsai (between lovers). The 0=yeong→yeon mapping is loose but this code is widely cited.',
  },
  {
    code: '5824',
    meaning_ko: '오빠 빨리 와',
    meaning_en: 'Oppa, come quickly',
    keywords_ko: ['오빠', '빨리와', '빨리 와', 'oppa'],
    keywords_en: ['oppa', 'come quickly', 'come back'],
    etymology_type: 'folk',
    confidence: 'medium',
    note_ko: '5=오, 8=팔→빨, 2=이→리, 4=사→와 → 오빠빨리와.',
    note_en: '5=o, 8=pal→ppal, 2=i→ri, 4=sa→wa → oppappalriwa (oppa, come quickly).',
  },
  {
    code: '112',
    meaning_ko: '급한 일',
    meaning_en: 'Urgent matter',
    keywords_ko: ['급해', '급한', '긴급', 'urgent', '경찰'],
    keywords_en: ['urgent', 'emergency', 'police'],
    etymology_type: 'reference',
    confidence: 'high',
    note_ko: '한국 경찰 긴급 번호 112를 가리킨다. 급한 일이니 즉시 전화하라는 의미.',
    note_en: 'References 112, the Korean police emergency number. Means "urgent, call back immediately".',
  },
  {
    code: '1010235',
    meaning_ko: '열렬히 사모',
    meaning_en: 'Passionately adore',
    keywords_ko: ['열렬히', '사모', '존경', 'adore'],
    keywords_en: ['adore', 'passionate', 'admire'],
    etymology_type: 'folk',
    confidence: 'medium',
    note_ko: '10=열, 10=열, 2=이→히, 3=삼→사, 5=오→모 → 열렬히 사모. 여러 매핑이 느슨함.',
    note_en: '10=yeol, 10=yeol, 2=i→hi, 3=sam→sa, 5=o→mo → yeollyeohi samo. Several mappings are loose.',
  },
  {
    code: '1225',
    meaning_ko: '크리스마스',
    meaning_en: 'Christmas',
    keywords_ko: ['크리스마스', '성탄', 'christmas', '12월'],
    keywords_en: ['christmas', 'december 25', 'holiday'],
    etymology_type: 'reference',
    confidence: 'high',
    note_ko: '날짜 참조: 12월 25일.',
    note_en: 'Date reference: December 25 (12월 25일).',
  },
  {
    code: '119',
    meaning_ko: '응급',
    meaning_en: 'Emergency',
    keywords_ko: ['응급', '화재', '구급', 'emergency', '119'],
    keywords_en: ['emergency', 'fire', 'ambulance'],
    etymology_type: 'reference',
    confidence: 'high',
    note_ko: '한국 화재/구급 번호 119를 가리킨다.',
    note_en: 'References 119, the Korean fire/ambulance emergency number.',
  },
  {
    code: '825',
    meaning_ko: '빨리 와',
    meaning_en: 'Come quickly',
    keywords_ko: ['빨리와', '빨리 와', '와', 'come'],
    keywords_en: ['come', 'come quickly', 'come back'],
    etymology_type: 'folk',
    confidence: 'medium',
    note_ko: '8=팔→빨, 2=이→리, 5=오→와 → 빨리 와.',
    note_en: '8=pal→ppal, 2=i→ri, 5=o→wa → ppalri wa (come quickly).',
  },
  {
    code: '7982',
    meaning_ko: '친구 빨리',
    meaning_en: 'Friend, hurry',
    keywords_ko: ['친구', '빨리', 'friend hurry'],
    keywords_en: ['friend', 'hurry', 'friend hurry'],
    etymology_type: 'folk',
    confidence: 'low',
    note_ko: '7=칠→친, 9=구, 8=팔→빨, 2=이→리 → 친구 빨리. 독립 코드로서의 사용은 확인되지 않음.',
    note_en: '7=chil→chin, 9=gu, 8=pal→ppal, 2=i→ri → chingu ppalri (friend, hurry). Unverified as a standalone code.',
  },
  {
    code: '49',
    meaning_ko: '사귀자',
    meaning_en: "Let's date",
    keywords_ko: ['사귀자', '사귀', '만나자', 'date'],
    keywords_en: ['date', "let's date", 'be friends'],
    etymology_type: 'folk',
    confidence: 'medium',
    note_ko: '4=사, 9=구 → 사구 → 사귀 (사귀다에서). 사귀자의 줄임.',
    note_en: '4=sa, 9=gu → sagu → sagwi (from sagwida, to associate/date). Short for sagwija (let\u2019s date).',
  },
  {
    code: '79',
    meaning_ko: '친구',
    meaning_en: 'Friend',
    keywords_ko: ['친구', 'friend'],
    keywords_en: ['friend'],
    etymology_type: 'folk',
    confidence: 'low',
    note_ko: '7=칠→친, 9=구 → 친구. 7942의 약식이나 독립 사용은 확인되지 않음.',
    note_en: '7=chil→chin, 9=gu → chingu (friend). Short form of 7942; unverified as standalone.',
  },
  {
    code: '214',
    meaning_ko: '발렌타인 데이',
    meaning_en: "Valentine's Day",
    keywords_ko: ['발렌타인', '발렌타인데이', '초콜릿', 'valentine'],
    keywords_en: ['valentine', "valentine's day", 'february 14'],
    etymology_type: 'reference',
    confidence: 'medium',
    note_ko: '날짜 참조: 2월 14일. 한국에서 여성이 남성에게 초콜릿을 주는 날.',
    note_en: 'Date reference: February 14. In Korea, women give chocolate to men on this day.',
  },
  {
    code: '314',
    meaning_ko: '화이트 데이',
    meaning_en: 'White Day',
    keywords_ko: ['화이트데이', '화이트', '사탕', 'white day'],
    keywords_en: ['white day', 'march 14', 'candy'],
    etymology_type: 'reference',
    confidence: 'medium',
    note_ko: '날짜 참조: 3월 14일. 발렌타인데이의 답례로 남성이 여성에게 사탕을 주는 날.',
    note_en: 'Date reference: March 14. Men give candy to women as a response to Valentine\u2019s Day.',
  },
  {
    code: '100',
    meaning_ko: '백일',
    meaning_en: '100-day anniversary',
    keywords_ko: ['백일', '100일', '기념일', 'anniversary'],
    keywords_en: ['100 days', 'anniversary', '100th day'],
    etymology_type: 'reference',
    confidence: 'medium',
    note_ko: '문화 참조: 한국 연애 문화에서 100일을 기념하는 풍습.',
    note_en: 'Cultural reference: 100-day anniversaries are significant in Korean dating culture.',
  },
  {
    code: '1111',
    meaning_ko: '빼빼로 데이',
    meaning_en: 'Pepero Day',
    keywords_ko: ['빼빼로', '빼빼로데이', 'pepero', '1111'],
    keywords_en: ['pepero', 'pepero day', 'november 11'],
    etymology_type: 'reference',
    confidence: 'low',
    note_ko: '날짜 참조: 11월 11일. 1990년대 중반 시작된 한국 기념일. 삐삐는 당시 감소 추세였음.',
    note_en: 'Date reference: November 11. Pepero Day began mid-1990s in Korea. Note: pagers were declining by then.',
  },
];

/**
 * Search the code book by keyword (case-insensitive substring match).
 * @param {string} keyword - Search term. Empty string returns all entries.
 * @returns {CodeEntry[]}
 */
export function search(keyword) {
  const kw = keyword.trim().toLowerCase();
  if (!kw) return [...CODEBOOK];
  return CODEBOOK.filter((entry) => {
    const inKo = entry.keywords_ko.some((k) => k.toLowerCase().includes(kw));
    const inEn = entry.keywords_en.some((k) => k.toLowerCase().includes(kw));
    return inKo || inEn;
  });
}

/**
 * Decode a digit string by exact code match.
 * @param {string} digits
 * @returns {CodeEntry | null}
 */
export function decode(digits) {
  return CODEBOOK.find((entry) => entry.code === digits) ?? null;
}
