const symbolMap: Record<string, string> = {
  "🎯": "[Target]",
  "🤖": "[AI]",
  "➕": "+",
  "🗑️": "[Delete]",
  "💡": "[Tip]",
  "✨": "[Spark]",
  "🔥": "[Strength]",
  "⚠️": "[Warning]",
  "✓": "Check",
  "✔": "Check",
  "✗": "X",
  "✘": "X",
  "⇒": "->",
  "→": "->",
  "←": "<-",
  "↔": "<->",
  "•": "*",
};

const win1252AllowedSet = new Set([
  0x20AC, 0x201A, 0x0192, 0x201E, 0x2026, 0x2020, 0x2021, 0x02C6, 0x2030, 0x0160, 0x2039, 0x0152, 0x017D,
  0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2013, 0x2014, 0x02DC, 0x2122, 0x0161, 0x203A, 0x0153, 0x017E, 0x0178
]);

/**
 * Strips out any characters not representable in the Windows-1252 encoding.
 * Replaces common emojis with text fallbacks first.
 */
export function cleanStringForDb(str: string): string {
  if (!str) return str;

  // 1. Replace mapped high-plane symbols/emojis
  let cleaned = str;
  for (const [symbol, replacement] of Object.entries(symbolMap)) {
    cleaned = cleaned.replaceAll(symbol, replacement);
  }

  // 2. Filter out any remaining characters not representable in Win1252
  let result = "";
  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    const code = cleaned.codePointAt(i);
    if (code === undefined) continue;

    // Handle surrogate pairs (code point > 0xFFFF)
    if (code > 0xFFFF) {
      i++; // Skip the next index for surrogate pair
      continue;
    }

    if (
      (code >= 0x00 && code <= 0x7F) || // ASCII
      (code >= 0xA0 && code <= 0xFF) || // Latin-1 Supplement
      win1252AllowedSet.has(code)
    ) {
      result += char;
    }
  }

  return result;
}

/**
 * Recursively cleans any strings inside objects, arrays, or primitive values.
 */
export function cleanDataForDb<T>(data: T): T {
  if (typeof data === "string") {
    return cleanStringForDb(data) as unknown as T;
  }
  if (Array.isArray(data)) {
    return data.map((item) => cleanDataForDb(item)) as unknown as T;
  }
  if (data !== null && typeof data === "object") {
    const cleanedObj: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      cleanedObj[key] = cleanDataForDb(value);
    }
    return cleanedObj as unknown as T;
  }
  return data;
}
