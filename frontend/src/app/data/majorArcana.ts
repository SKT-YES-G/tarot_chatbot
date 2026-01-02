export interface TarotCardData {
  id: number;
  name: string;
  nameKo: string;
  upright: string[];
  reversed: string[];
  uprightMeaning: string;
  reversedMeaning: string;
}

export const majorArcana: TarotCardData[] = [
  {
    id: 0,
    name: "The Fool",
    nameKo: "바보",
    upright: ["새로운 시작", "순수함", "자유", "모험"],
    reversed: ["무모함", "경솔함", "위험", "방향성 상실"],
    uprightMeaning: "새로운 시작과 무한한 가능성의 시기입니다. 순수한 마음으로 모험을 시작하세요.",
    reversedMeaning: "너무 경솔하거나 무모한 결정을 내리고 있지 않은지 주의가 필요합니다."
  },
  {
    id: 1,
    name: "The Magician",
    nameKo: "마법사",
    upright: ["창조력", "재능", "집중", "의지"],
    reversed: ["조작", "속임수", "재능 낭비", "집중력 부족"],
    uprightMeaning: "당신은 필요한 모든 도구와 능력을 가지고 있습니다. 자신감을 가지고 목표를 실현하세요.",
    reversedMeaning: "재능을 잘못된 방향으로 사용하거나, 집중력이 흐트러져 있을 수 있습니다."
  },
  {
    id: 2,
    name: "The High Priestess",
    nameKo: "여사제",
    upright: ["직관", "내면의 목소리", "신비", "잠재의식"],
    reversed: ["직관 무시", "비밀", "숨겨진 의도", "내면과의 단절"],
    uprightMeaning: "내면의 목소리에 귀 기울이세요. 직관이 올바른 길을 안내할 것입니다.",
    reversedMeaning: "내면의 목소리를 무시하거나, 중요한 정보를 숨기고 있을 수 있습니다."
  },
  {
    id: 3,
    name: "The Empress",
    nameKo: "여황제",
    upright: ["풍요", "창조성", "양육", "자연"],
    reversed: ["의존성", "질식", "창의력 결핍", "불안정"],
    uprightMeaning: "풍요롭고 창조적인 시기입니다. 사랑과 보살핌으로 무언가를 성장시키세요.",
    reversedMeaning: "과잉 보호나 의존성, 또는 자신을 돌보지 않는 상황에 주의하세요."
  },
  {
    id: 4,
    name: "The Emperor",
    nameKo: "황제",
    upright: ["권위", "구조", "안정", "리더십"],
    reversed: ["독재", "경직성", "통제 상실", "권위 남용"],
    uprightMeaning: "구조와 질서를 통해 안정을 얻을 수 있습니다. 강한 리더십을 발휘하세요.",
    reversedMeaning: "지나친 통제나 권위주의적 태도가 문제를 일으킬 수 있습니다."
  },
  {
    id: 5,
    name: "The Hierophant",
    nameKo: "교황",
    upright: ["전통", "교육", "믿음", "관습"],
    reversed: ["반항", "새로운 접근", "독단적 사고", "관습 탈피"],
    uprightMeaning: "전통적인 방법과 기존의 시스템이 도움이 될 것입니다. 조언을 구하세요.",
    reversedMeaning: "기존의 틀을 벗어나 새로운 방식을 시도할 때입니다."
  },
  {
    id: 6,
    name: "The Lovers",
    nameKo: "연인",
    upright: ["사랑", "조화", "선택", "파트너십"],
    reversed: ["불균형", "갈등", "잘못된 선택", "불화"],
    uprightMeaning: "중요한 선택의 순간입니다. 마음이 이끄는 대로 따르되 신중하게 결정하세요.",
    reversedMeaning: "관계의 불균형이나 잘못된 선택으로 인한 갈등을 주의하세요."
  },
  {
    id: 7,
    name: "The Chariot",
    nameKo: "전차",
    upright: ["의지", "결단", "승리", "방향성"],
    reversed: ["통제력 상실", "방향 상실", "좌절", "공격성"],
    uprightMeaning: "강한 의지와 결단력으로 목표를 향해 나아가세요. 승리가 가까이 있습니다.",
    reversedMeaning: "방향을 잃었거나 감정을 통제하지 못하고 있을 수 있습니다."
  },
  {
    id: 8,
    name: "Strength",
    nameKo: "힘",
    upright: ["용기", "인내", "자제력", "부드러운 힘"],
    reversed: ["자신감 부족", "자제력 상실", "약함", "두려움"],
    uprightMeaning: "내면의 힘과 용기로 어려움을 극복할 수 있습니다. 부드럽지만 강하게 대처하세요.",
    reversedMeaning: "자신감이 부족하거나 감정을 통제하지 못하고 있을 수 있습니다."
  },
  {
    id: 9,
    name: "The Hermit",
    nameKo: "은둔자",
    upright: ["성찰", "내면 탐구", "지혜", "고독"],
    reversed: ["고립", "외로움", "철수", "내면 거부"],
    uprightMeaning: "홀로 시간을 보내며 내면을 탐구하세요. 진정한 지혜를 발견할 것입니다.",
    reversedMeaning: "지나친 고립이나 내면 탐구를 회피하는 경향이 있을 수 있습니다."
  },
  {
    id: 10,
    name: "Wheel of Fortune",
    nameKo: "운명의 수레바퀴",
    upright: ["변화", "운명", "새 국면", "행운"],
    reversed: ["불운", "저항", "정체", "통제 불가"],
    uprightMeaning: "인생의 새로운 국면이 시작됩니다. 변화의 흐름을 받아들이세요.",
    reversedMeaning: "변화에 저항하거나 불운한 시기를 겪고 있을 수 있습니다."
  },
  {
    id: 11,
    name: "Justice",
    nameKo: "정의",
    upright: ["공정함", "진실", "책임", "균형"],
    reversed: ["불공정", "편견", "책임 회피", "불균형"],
    uprightMeaning: "공정하고 균형 잡힌 판단이 필요합니다. 진실이 밝혀질 것입니다.",
    reversedMeaning: "불공정한 대우나 편견, 책임을 회피하는 상황에 주의하세요."
  },
  {
    id: 12,
    name: "The Hanged Man",
    nameKo: "매달린 사람",
    upright: ["희생", "새로운 관점", "기다림", "surrender"],
    reversed: ["저항", "지연", "희생 거부", "고집"],
    uprightMeaning: "잠시 멈추고 다른 관점에서 상황을 바라보세요. 기다림이 필요한 시기입니다.",
    reversedMeaning: "필요한 희생이나 변화를 거부하고 있거나 불필요하게 지연되고 있습니다."
  },
  {
    id: 13,
    name: "Death",
    nameKo: "죽음",
    upright: ["변화", "끝과 시작", "변환", "해방"],
    reversed: ["변화 거부", "정체", "과거 집착", "두려움"],
    uprightMeaning: "끝은 새로운 시작을 의미합니다. 변화를 받아들이고 새롭게 태어나세요.",
    reversedMeaning: "변화를 두려워하거나 과거에 집착하여 앞으로 나아가지 못하고 있습니다."
  },
  {
    id: 14,
    name: "Temperance",
    nameKo: "절제",
    upright: ["균형", "조화", "절제", "인내"],
    reversed: ["불균형", "과잉", "조급함", "극단"],
    uprightMeaning: "균형과 절제가 필요합니다. 중도를 지키며 조화롭게 나아가세요.",
    reversedMeaning: "균형을 잃었거나 극단적인 선택을 하고 있을 수 있습니다."
  },
  {
    id: 15,
    name: "The Devil",
    nameKo: "악마",
    upright: ["속박", "중독", "집착", "물질주의"],
    reversed: ["해방", "깨달음", "탈출", "자유"],
    uprightMeaning: "무언가에 속박되어 있거나 중독되어 있지 않은지 살펴보세요.",
    reversedMeaning: "속박에서 벗어나거나 부정적인 패턴을 깨뜨릴 수 있는 시기입니다."
  },
  {
    id: 16,
    name: "The Tower",
    nameKo: "탑",
    upright: ["급격한 변화", "붕괴", "깨달음", "해체"],
    reversed: ["재난 회피", "두려움", "저항", "지연된 붕괴"],
    uprightMeaning: "급격한 변화와 붕괴가 일어날 수 있지만, 이는 진실을 보여주는 과정입니다.",
    reversedMeaning: "필연적인 변화를 피하려 하거나 붕괴를 지연시키고 있습니다."
  },
  {
    id: 17,
    name: "The Star",
    nameKo: "별",
    upright: ["희망", "영감", "치유", "평화"],
    reversed: ["절망", "신념 상실", "낙담", "불안"],
    uprightMeaning: "희망과 영감의 시기입니다. 믿음을 가지고 꿈을 향해 나아가세요.",
    reversedMeaning: "희망을 잃었거나 자신에 대한 신념이 약해진 상태입니다."
  },
  {
    id: 18,
    name: "The Moon",
    nameKo: "달",
    upright: ["환상", "불안", "직관", "잠재의식"],
    reversed: ["명료함", "진실 발견", "불안 해소", "현실"],
    uprightMeaning: "불확실하고 혼란스러운 시기입니다. 직관을 믿되 환상에 속지 마세요.",
    reversedMeaning: "혼란이 걷히고 진실이 드러나거나, 불안에서 벗어나는 시기입니다."
  },
  {
    id: 19,
    name: "The Sun",
    nameKo: "태양",
    upright: ["기쁨", "성공", "긍정", "활력"],
    reversed: ["일시적 좌절", "과도한 낙관", "지연된 성공"],
    uprightMeaning: "모든 것이 밝고 긍정적입니다. 성공과 기쁨을 누리세요.",
    reversedMeaning: "일시적인 어둠이 있지만 곧 빛이 올 것입니다. 과도한 낙관은 주의하세요."
  },
  {
    id: 20,
    name: "Judgement",
    nameKo: "심판",
    upright: ["부활", "성찰", "각성", "판단"],
    reversed: ["자기 비판", "의심", "후회", "판단 회피"],
    uprightMeaning: "과거를 돌아보고 평가할 시간입니다. 새로운 각성과 부활의 기회가 있습니다.",
    reversedMeaning: "과도한 자기 비판이나 과거에 대한 후회에서 벗어나세요."
  },
  {
    id: 21,
    name: "The World",
    nameKo: "세계",
    upright: ["완성", "성취", "통합", "여행"],
    reversed: ["미완성", "지연", "부족함", "정체"],
    uprightMeaning: "목표를 완성하고 성취하는 시기입니다. 하나의 사이클이 완료됩니다.",
    reversedMeaning: "아직 완성되지 않았거나 무언가 부족함을 느끼고 있습니다."
  }
];
