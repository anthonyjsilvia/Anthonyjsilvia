import { en, type Messages } from "@/lib/i18n/en";
import { enGB } from "@/lib/i18n/en-GB";
import { es } from "@/lib/i18n/es";
import { esES } from "@/lib/i18n/es-ES";
import { pt } from "@/lib/i18n/pt";
import { ptPT } from "@/lib/i18n/pt-PT";
import { defaultLocale, type Locale } from "@/lib/i18n/languages";

export type { Messages };

export const catalogs: Record<Locale, Messages> = {
  "en-US": en,
  "en-GB": enGB,
  "es-MX": es,
  "es-ES": esES,
  "pt-BR": pt,
  "pt-PT": ptPT,
};

export function getMessages(locale: Locale): Messages {
  return catalogs[locale] ?? catalogs[defaultLocale];
}
