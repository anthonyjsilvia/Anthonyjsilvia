/**
 * Languages the site can show. Each language has two regions.
 * Add a region here, then add a catalog that satisfies `Messages`.
 */
export const languages = [
  {
    id: "en",
    nativeLabel: "English",
    label: "English",
    regions: [
      { id: "en-US", htmlLang: "en-US", nativeLabel: "US" },
      { id: "en-GB", htmlLang: "en-GB", nativeLabel: "UK" },
    ],
  },
  {
    id: "es",
    nativeLabel: "Español",
    label: "Spanish",
    regions: [
      { id: "es-MX", htmlLang: "es-MX", nativeLabel: "México" },
      { id: "es-ES", htmlLang: "es-ES", nativeLabel: "España" },
    ],
  },
  {
    id: "pt",
    nativeLabel: "Português",
    label: "Portuguese",
    regions: [
      { id: "pt-BR", htmlLang: "pt-BR", nativeLabel: "Brasil" },
      { id: "pt-PT", htmlLang: "pt-PT", nativeLabel: "Portugal" },
    ],
  },
] as const;

export type LanguageId = (typeof languages)[number]["id"];
export type Locale = (typeof languages)[number]["regions"][number]["id"];

export const defaultLocale: Locale = "en-US";

const legacyLocales: Record<string, Locale> = {
  en: "en-US",
  es: "es-MX",
  pt: "pt-BR",
};

export function isLocale(value: string | null | undefined): value is Locale {
  return languages.some((language) => language.regions.some((region) => region.id === value));
}

/** Accept the current region ids and the older single-language ids. */
export function migrateLocale(value: string | null | undefined): Locale | null {
  if (!value) return null;
  if (isLocale(value)) return value;
  return legacyLocales[value] ?? null;
}

export function localeMeta(locale: Locale) {
  for (const language of languages) {
    const region = language.regions.find((item) => item.id === locale);
    if (region) {
      return {
        ...region,
        languageId: language.id,
        languageLabel: language.nativeLabel,
      };
    }
  }
  const fallback = languages[0];
  return {
    ...fallback.regions[0],
    languageId: fallback.id,
    languageLabel: fallback.nativeLabel,
  };
}

/** Visitors in the US see American English. Everywhere else sees British English. */
export function englishLocaleForCountry(country: string | null | undefined): Locale {
  if (!country || country.toUpperCase() === "US") return "en-US";
  return "en-GB";
}

/** Flag shown on a language row before that language is selected. */
export function defaultRegion(languageId: LanguageId, country: string | null | undefined): Locale {
  const code = country?.toUpperCase() ?? "";
  if (languageId === "es") return code === "ES" ? "es-ES" : "es-MX";
  if (languageId === "pt") return code === "PT" ? "pt-PT" : "pt-BR";
  return englishLocaleForCountry(country);
}
