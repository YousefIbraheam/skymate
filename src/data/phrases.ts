export interface PhraseLanguage {
  code: string;
  name: string;
  country: string; // ISO code, used for the flag
  phrases: { en: string; text: string }[];
}

/** Small offline phrasebook. Live translation goes through api/client.ts. */
export const phraseLanguages: PhraseLanguage[] = [
  {
    code: "hi", name: "Hindi", country: "IN",
    phrases: [
      { en: "Hello", text: "नमस्ते" }, { en: "Thank you", text: "धन्यवाद" }, { en: "How much is this?", text: "यह कितने का है?" },
      { en: "Where is the toilet?", text: "शौचालय कहाँ है?" }, { en: "No spice, please", text: "कृपया मसाला नहीं" },
    ],
  },
  {
    code: "ja", name: "Japanese", country: "JP",
    phrases: [
      { en: "Hello", text: "こんにちは" }, { en: "Thank you", text: "ありがとうございます" }, { en: "How much is this?", text: "これはいくらですか？" },
      { en: "Where is the toilet?", text: "トイレはどこですか？" }, { en: "No spice, please", text: "辛くしないでください" },
    ],
  },
  {
    code: "id", name: "Indonesian", country: "ID",
    phrases: [
      { en: "Hello", text: "Halo" }, { en: "Thank you", text: "Terima kasih" }, { en: "How much is this?", text: "Berapa harganya?" },
      { en: "Where is the toilet?", text: "Di mana toilet?" }, { en: "No spice, please", text: "Tidak pedas, tolong" },
    ],
  },
  {
    code: "ar", name: "Arabic", country: "EG",
    phrases: [
      { en: "Hello", text: "مرحبا" }, { en: "Thank you", text: "شكرا" }, { en: "How much is this?", text: "بكام ده؟" },
      { en: "Where is the toilet?", text: "فين الحمام؟" }, { en: "No spice, please", text: "من غير حار لو سمحت" },
    ],
  },
  {
    code: "de", name: "German", country: "DE",
    phrases: [
      { en: "Hello", text: "Hallo" }, { en: "Thank you", text: "Danke" }, { en: "How much is this?", text: "Wie viel kostet das?" },
      { en: "Where is the toilet?", text: "Wo ist die Toilette?" }, { en: "No spice, please", text: "Bitte nicht scharf" },
    ],
  },
];
