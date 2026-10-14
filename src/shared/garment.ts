// What the app knows about one piece of clothing, and the words it may use.
// Shared: the server makes the model answer in this shape, the app shows it.
//
// The word lists come from wardrowbe (MIT licence, github.com/Anyesh/wardrowbe),
// trimmed to what this app needs. A fixed list beats free text: "navy",
// "Navy Blue" and "dark blue" would otherwise be three colours, and you
// could never ask "how many blue things do I already own?".

export const TYPES = [
  "shirt", "t-shirt", "top", "blouse", "polo", "tank-top", "sweater", "cardigan", "hoodie",
  "pants", "jeans", "shorts", "skirt", "dress", "jumpsuit",
  "jacket", "coat", "blazer", "vest", "suit",
  "shoes", "sneakers", "boots", "sandals", "socks", "tights",
  "hat", "scarf", "belt", "bag", "tie", "accessories",
] as const;

export const COLORS = [
  "black", "white", "gray", "navy", "blue", "light-blue", "red", "burgundy", "pink", "green",
  "olive", "yellow", "orange", "purple", "brown", "tan", "beige", "cream", "gold", "silver",
] as const;

export const PATTERNS = [
  "solid", "striped", "plaid", "checkered", "floral", "graphic", "geometric", "polka-dot",
  "camouflage", "animal-print",
] as const;

// "unknown" is allowed on purpose: from a photo you often cannot tell
// polyester from cotton, and a guess stored as fact is worse than no answer.
export const MATERIALS = [
  "cotton", "denim", "leather", "wool", "polyester", "silk", "linen", "knit", "fleece", "suede",
  "velvet", "nylon", "canvas", "down", "unknown",
] as const;

export const SEASONS = ["spring", "summer", "fall", "winter"] as const;

export type GarmentTags = {
  label: string; // a short name a person would say: "navy wool crewneck"
  type: (typeof TYPES)[number];
  colors: (typeof COLORS)[number][]; // the main colour first
  pattern: (typeof PATTERNS)[number];
  material: (typeof MATERIALS)[number];
  seasons: (typeof SEASONS)[number][];
};

// The same shape as GarmentTags, written as JSON Schema. Ollama uses it to
// force the model's reply into exactly this shape, so the server does not
// have to repair or second-guess what comes back.
export const TAG_SCHEMA = {
  type: "object",
  properties: {
    label: { type: "string" },
    type: { type: "string", enum: TYPES },
    colors: { type: "array", items: { type: "string", enum: COLORS }, minItems: 1, maxItems: 3 },
    pattern: { type: "string", enum: PATTERNS },
    material: { type: "string", enum: MATERIALS },
    seasons: { type: "array", items: { type: "string", enum: SEASONS }, minItems: 1, maxItems: 4 },
  },
  required: ["label", "type", "colors", "pattern", "material", "seasons"],
} as const;

// POST /api/tag
export type TagRequest = { photoBase64: string };
export type TagResponse = { tags: GarmentTags };
