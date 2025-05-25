// 音素データの型定義
export interface VisemeData {
  viseme: string;
  intensity: number;
  duration: number;
  blendWith?: { viseme: string; ratio: number }[];
}

// 文字の音韻情報
export interface PhonemeInfo {
  char: string;
  romaji?: string;
  type: "vowel" | "consonant" | "special" | "pause";
  visemeData: VisemeData;
}

// 詳細な日本語音素マッピング
export // 詳細な日本語音素マッピング
const getDetailedPhonemeInfo = (char: string): PhonemeInfo => {
  const phonemeMap: Record<string, PhonemeInfo> = {
    // あ行 - 開口音
    あ: {
      char: "あ",
      romaji: "a",
      type: "vowel",
      visemeData: { viseme: "aa", intensity: 0.9, duration: 180 },
    },
    ア: {
      char: "ア",
      romaji: "a",
      type: "vowel",
      visemeData: { viseme: "aa", intensity: 0.9, duration: 180 },
    },

    // い行 - 横広音
    い: {
      char: "い",
      romaji: "i",
      type: "vowel",
      visemeData: { viseme: "ih", intensity: 0.8, duration: 160 },
    },
    イ: {
      char: "イ",
      romaji: "i",
      type: "vowel",
      visemeData: { viseme: "ih", intensity: 0.8, duration: 160 },
    },

    // う行 - 丸口音
    う: {
      char: "う",
      romaji: "u",
      type: "vowel",
      visemeData: { viseme: "ou", intensity: 0.85, duration: 170 },
    },
    ウ: {
      char: "ウ",
      romaji: "u",
      type: "vowel",
      visemeData: { viseme: "ou", intensity: 0.85, duration: 170 },
    },

    // え行 - 中開口音
    え: {
      char: "え",
      romaji: "e",
      type: "vowel",
      visemeData: { viseme: "ee", intensity: 0.75, duration: 165 },
    },
    エ: {
      char: "エ",
      romaji: "e",
      type: "vowel",
      visemeData: { viseme: "ee", intensity: 0.75, duration: 165 },
    },

    // お行 - 丸開口音
    お: {
      char: "お",
      romaji: "o",
      type: "vowel",
      visemeData: { viseme: "oh", intensity: 0.8, duration: 175 },
    },
    オ: {
      char: "オ",
      romaji: "o",
      type: "vowel",
      visemeData: { viseme: "oh", intensity: 0.8, duration: 175 },
    },

    // か行 - 子音+母音の組み合わせ
    か: {
      char: "か",
      romaji: "ka",
      type: "consonant",
      visemeData: {
        viseme: "aa",
        intensity: 0.7,
        duration: 140,
        blendWith: [{ viseme: "oh", ratio: 0.2 }],
      },
    },
    が: {
      char: "が",
      romaji: "ga",
      type: "consonant",
      visemeData: {
        viseme: "aa",
        intensity: 0.75,
        duration: 150,
        blendWith: [{ viseme: "oh", ratio: 0.15 }],
      },
    },
    き: {
      char: "き",
      romaji: "ki",
      type: "consonant",
      visemeData: { viseme: "ih", intensity: 0.7, duration: 135 },
    },
    ぎ: {
      char: "ぎ",
      romaji: "gi",
      type: "consonant",
      visemeData: { viseme: "ih", intensity: 0.75, duration: 145 },
    },
    く: {
      char: "く",
      romaji: "ku",
      type: "consonant",
      visemeData: { viseme: "ou", intensity: 0.65, duration: 130 },
    },
    ぐ: {
      char: "ぐ",
      romaji: "gu",
      type: "consonant",
      visemeData: { viseme: "ou", intensity: 0.7, duration: 140 },
    },
    け: {
      char: "け",
      romaji: "ke",
      type: "consonant",
      visemeData: { viseme: "ee", intensity: 0.65, duration: 135 },
    },
    げ: {
      char: "げ",
      romaji: "ge",
      type: "consonant",
      visemeData: { viseme: "ee", intensity: 0.7, duration: 145 },
    },
    こ: {
      char: "こ",
      romaji: "ko",
      type: "consonant",
      visemeData: { viseme: "oh", intensity: 0.7, duration: 140 },
    },
    ご: {
      char: "ご",
      romaji: "go",
      type: "consonant",
      visemeData: { viseme: "oh", intensity: 0.75, duration: 150 },
    },

    // さ行 - 摩擦音
    さ: {
      char: "さ",
      romaji: "sa",
      type: "consonant",
      visemeData: {
        viseme: "aa",
        intensity: 0.6,
        duration: 120,
        blendWith: [{ viseme: "ih", ratio: 0.3 }],
      },
    },
    ざ: {
      char: "ざ",
      romaji: "za",
      type: "consonant",
      visemeData: {
        viseme: "aa",
        intensity: 0.65,
        duration: 130,
        blendWith: [{ viseme: "ih", ratio: 0.25 }],
      },
    },
    し: {
      char: "し",
      romaji: "shi",
      type: "consonant",
      visemeData: {
        viseme: "ih",
        intensity: 0.6,
        duration: 115,
        blendWith: [{ viseme: "ou", ratio: 0.2 }],
      },
    },
    じ: {
      char: "じ",
      romaji: "ji",
      type: "consonant",
      visemeData: {
        viseme: "ih",
        intensity: 0.65,
        duration: 125,
        blendWith: [{ viseme: "ou", ratio: 0.15 }],
      },
    },
    す: {
      char: "す",
      romaji: "su",
      type: "consonant",
      visemeData: { viseme: "ou", intensity: 0.55, duration: 110 },
    },
    ず: {
      char: "ず",
      romaji: "zu",
      type: "consonant",
      visemeData: { viseme: "ou", intensity: 0.6, duration: 120 },
    },
    せ: {
      char: "せ",
      romaji: "se",
      type: "consonant",
      visemeData: { viseme: "ee", intensity: 0.55, duration: 115 },
    },
    ぜ: {
      char: "ぜ",
      romaji: "ze",
      type: "consonant",
      visemeData: { viseme: "ee", intensity: 0.6, duration: 125 },
    },
    そ: {
      char: "そ",
      romaji: "so",
      type: "consonant",
      visemeData: { viseme: "oh", intensity: 0.6, duration: 120 },
    },
    ぞ: {
      char: "ぞ",
      romaji: "zo",
      type: "consonant",
      visemeData: { viseme: "oh", intensity: 0.65, duration: 130 },
    },

    // た行 - 破裂音
    た: {
      char: "た",
      romaji: "ta",
      type: "consonant",
      visemeData: { viseme: "aa", intensity: 0.65, duration: 125 },
    },
    だ: {
      char: "だ",
      romaji: "da",
      type: "consonant",
      visemeData: { viseme: "aa", intensity: 0.7, duration: 135 },
    },
    ち: {
      char: "ち",
      romaji: "chi",
      type: "consonant",
      visemeData: {
        viseme: "ih",
        intensity: 0.6,
        duration: 120,
        blendWith: [{ viseme: "ou", ratio: 0.25 }],
      },
    },
    ぢ: {
      char: "ぢ",
      romaji: "ji",
      type: "consonant",
      visemeData: {
        viseme: "ih",
        intensity: 0.65,
        duration: 130,
        blendWith: [{ viseme: "ou", ratio: 0.2 }],
      },
    },
    つ: {
      char: "つ",
      romaji: "tsu",
      type: "consonant",
      visemeData: { viseme: "ou", intensity: 0.6, duration: 115 },
    },
    づ: {
      char: "づ",
      romaji: "zu",
      type: "consonant",
      visemeData: { viseme: "ou", intensity: 0.65, duration: 125 },
    },
    て: {
      char: "て",
      romaji: "te",
      type: "consonant",
      visemeData: { viseme: "ee", intensity: 0.6, duration: 120 },
    },
    で: {
      char: "で",
      romaji: "de",
      type: "consonant",
      visemeData: { viseme: "ee", intensity: 0.65, duration: 130 },
    },
    と: {
      char: "と",
      romaji: "to",
      type: "consonant",
      visemeData: { viseme: "oh", intensity: 0.65, duration: 125 },
    },
    ど: {
      char: "ど",
      romaji: "do",
      type: "consonant",
      visemeData: { viseme: "oh", intensity: 0.7, duration: 135 },
    },

    // な行 - 鼻音
    な: {
      char: "な",
      romaji: "na",
      type: "consonant",
      visemeData: {
        viseme: "aa",
        intensity: 0.7,
        duration: 140,
        blendWith: [{ viseme: "oh", ratio: 0.1 }],
      },
    },
    に: {
      char: "に",
      romaji: "ni",
      type: "consonant",
      visemeData: { viseme: "ih", intensity: 0.7, duration: 135 },
    },
    ぬ: {
      char: "ぬ",
      romaji: "nu",
      type: "consonant",
      visemeData: { viseme: "ou", intensity: 0.7, duration: 140 },
    },
    ね: {
      char: "ね",
      romaji: "ne",
      type: "consonant",
      visemeData: { viseme: "ee", intensity: 0.7, duration: 135 },
    },
    の: {
      char: "の",
      romaji: "no",
      type: "consonant",
      visemeData: { viseme: "oh", intensity: 0.7, duration: 140 },
    },

    // は行 - 摩擦音/半母音
    は: {
      char: "は",
      romaji: "ha",
      type: "consonant",
      visemeData: { viseme: "aa", intensity: 0.65, duration: 130 },
    },
    ば: {
      char: "ば",
      romaji: "ba",
      type: "consonant",
      visemeData: {
        viseme: "aa",
        intensity: 0.7,
        duration: 140,
        blendWith: [{ viseme: "oh", ratio: 0.15 }],
      },
    },
    ぱ: {
      char: "ぱ",
      romaji: "pa",
      type: "consonant",
      visemeData: { viseme: "aa", intensity: 0.75, duration: 125 },
    },
    ひ: {
      char: "ひ",
      romaji: "hi",
      type: "consonant",
      visemeData: { viseme: "ih", intensity: 0.65, duration: 125 },
    },
    び: {
      char: "び",
      romaji: "bi",
      type: "consonant",
      visemeData: { viseme: "ih", intensity: 0.7, duration: 135 },
    },
    ぴ: {
      char: "ぴ",
      romaji: "pi",
      type: "consonant",
      visemeData: { viseme: "ih", intensity: 0.75, duration: 120 },
    },
    ふ: {
      char: "ふ",
      romaji: "fu",
      type: "consonant",
      visemeData: {
        viseme: "ou",
        intensity: 0.6,
        duration: 125,
        blendWith: [{ viseme: "aa", ratio: 0.2 }],
      },
    },
    ぶ: {
      char: "ぶ",
      romaji: "bu",
      type: "consonant",
      visemeData: { viseme: "ou", intensity: 0.7, duration: 135 },
    },
    ぷ: {
      char: "ぷ",
      romaji: "pu",
      type: "consonant",
      visemeData: { viseme: "ou", intensity: 0.75, duration: 120 },
    },
    へ: {
      char: "へ",
      romaji: "he",
      type: "consonant",
      visemeData: { viseme: "ee", intensity: 0.65, duration: 125 },
    },
    べ: {
      char: "べ",
      romaji: "be",
      type: "consonant",
      visemeData: { viseme: "ee", intensity: 0.7, duration: 135 },
    },
    ぺ: {
      char: "ぺ",
      romaji: "pe",
      type: "consonant",
      visemeData: { viseme: "ee", intensity: 0.75, duration: 120 },
    },
    ほ: {
      char: "ほ",
      romaji: "ho",
      type: "consonant",
      visemeData: { viseme: "oh", intensity: 0.65, duration: 130 },
    },
    ぼ: {
      char: "ぼ",
      romaji: "bo",
      type: "consonant",
      visemeData: { viseme: "oh", intensity: 0.7, duration: 140 },
    },
    ぽ: {
      char: "ぽ",
      romaji: "po",
      type: "consonant",
      visemeData: { viseme: "oh", intensity: 0.75, duration: 125 },
    },

    // ま行 - 鼻音
    ま: {
      char: "ま",
      romaji: "ma",
      type: "consonant",
      visemeData: {
        viseme: "aa",
        intensity: 0.75,
        duration: 145,
        blendWith: [{ viseme: "oh", ratio: 0.1 }],
      },
    },
    み: {
      char: "み",
      romaji: "mi",
      type: "consonant",
      visemeData: { viseme: "ih", intensity: 0.75, duration: 140 },
    },
    む: {
      char: "む",
      romaji: "mu",
      type: "consonant",
      visemeData: { viseme: "ou", intensity: 0.8, duration: 145 },
    },
    め: {
      char: "め",
      romaji: "me",
      type: "consonant",
      visemeData: { viseme: "ee", intensity: 0.75, duration: 140 },
    },
    も: {
      char: "も",
      romaji: "mo",
      type: "consonant",
      visemeData: { viseme: "oh", intensity: 0.75, duration: 145 },
    },

    // や行
    や: {
      char: "や",
      romaji: "ya",
      type: "vowel",
      visemeData: {
        viseme: "aa",
        intensity: 0.8,
        duration: 160,
        blendWith: [{ viseme: "ih", ratio: 0.2 }],
      },
    },
    ゆ: {
      char: "ゆ",
      romaji: "yu",
      type: "vowel",
      visemeData: {
        viseme: "ou",
        intensity: 0.8,
        duration: 165,
        blendWith: [{ viseme: "ih", ratio: 0.2 }],
      },
    },
    よ: {
      char: "よ",
      romaji: "yo",
      type: "vowel",
      visemeData: {
        viseme: "oh",
        intensity: 0.8,
        duration: 160,
        blendWith: [{ viseme: "ih", ratio: 0.15 }],
      },
    },

    // ら行 - 流音
    ら: {
      char: "ら",
      romaji: "ra",
      type: "consonant",
      visemeData: { viseme: "aa", intensity: 0.7, duration: 130 },
    },
    り: {
      char: "り",
      romaji: "ri",
      type: "consonant",
      visemeData: { viseme: "ih", intensity: 0.7, duration: 125 },
    },
    る: {
      char: "る",
      romaji: "ru",
      type: "consonant",
      visemeData: { viseme: "ou", intensity: 0.7, duration: 130 },
    },
    れ: {
      char: "れ",
      romaji: "re",
      type: "consonant",
      visemeData: { viseme: "ee", intensity: 0.7, duration: 125 },
    },
    ろ: {
      char: "ろ",
      romaji: "ro",
      type: "consonant",
      visemeData: { viseme: "oh", intensity: 0.7, duration: 130 },
    },

    // わ行
    わ: {
      char: "わ",
      romaji: "wa",
      type: "vowel",
      visemeData: {
        viseme: "aa",
        intensity: 0.75,
        duration: 150,
        blendWith: [{ viseme: "ou", ratio: 0.2 }],
      },
    },
    を: {
      char: "を",
      romaji: "wo",
      type: "vowel",
      visemeData: {
        viseme: "oh",
        intensity: 0.75,
        duration: 150,
        blendWith: [{ viseme: "ou", ratio: 0.15 }],
      },
    },
    ん: {
      char: "ん",
      romaji: "n",
      type: "consonant",
      visemeData: {
        viseme: "oh",
        intensity: 0.4,
        duration: 100,
        blendWith: [{ viseme: "aa", ratio: 0.3 }],
      },
    },

    // 特殊文字
    "。": {
      char: "。",
      type: "pause",
      visemeData: { viseme: "", intensity: 0, duration: 300 },
    },
    "、": {
      char: "、",
      type: "pause",
      visemeData: { viseme: "", intensity: 0, duration: 200 },
    },
    "！": {
      char: "！",
      type: "special",
      visemeData: { viseme: "aa", intensity: 0.9, duration: 250 },
    },
    "？": {
      char: "？",
      type: "special",
      visemeData: { viseme: "oh", intensity: 0.7, duration: 200 },
    },
    " ": {
      char: " ",
      type: "pause",
      visemeData: { viseme: "", intensity: 0, duration: 150 },
    },

    // 英語対応
    A: {
      char: "A",
      romaji: "a",
      type: "vowel",
      visemeData: { viseme: "aa", intensity: 0.9, duration: 180 },
    },
    E: {
      char: "E",
      romaji: "e",
      type: "vowel",
      visemeData: { viseme: "ee", intensity: 0.8, duration: 170 },
    },
    I: {
      char: "I",
      romaji: "i",
      type: "vowel",
      visemeData: { viseme: "ih", intensity: 0.8, duration: 160 },
    },
    O: {
      char: "O",
      romaji: "o",
      type: "vowel",
      visemeData: { viseme: "oh", intensity: 0.85, duration: 180 },
    },
    U: {
      char: "U",
      romaji: "u",
      type: "vowel",
      visemeData: { viseme: "ou", intensity: 0.85, duration: 170 },
    },
    a: {
      char: "a",
      romaji: "a",
      type: "vowel",
      visemeData: { viseme: "aa", intensity: 0.8, duration: 150 },
    },
    e: {
      char: "e",
      romaji: "e",
      type: "vowel",
      visemeData: { viseme: "ee", intensity: 0.7, duration: 140 },
    },
    i: {
      char: "i",
      romaji: "i",
      type: "vowel",
      visemeData: { viseme: "ih", intensity: 0.7, duration: 130 },
    },
    o: {
      char: "o",
      romaji: "o",
      type: "vowel",
      visemeData: { viseme: "oh", intensity: 0.75, duration: 150 },
    },
    u: {
      char: "u",
      romaji: "u",
      type: "vowel",
      visemeData: { viseme: "ou", intensity: 0.75, duration: 140 },
    },
  };

  // マッピングされた文字があればそれを返す
  if (phonemeMap[char]) {
    // intensityを+0.2（最大1.0）で返す
    const info = phonemeMap[char];
    const newInfo = {
      ...info,
      visemeData: {
        ...info.visemeData,
        intensity: 1.0,
        blendWith: info.visemeData.blendWith,
      },
    };
    return newInfo;
  }

  // デフォルト（その他の文字）
  return {
    char,
    type: "consonant",
    visemeData: { viseme: "aa", intensity: 0.7, duration: 120 },
  };
};
