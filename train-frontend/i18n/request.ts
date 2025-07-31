import { getRequestConfig, type GetRequestConfigParams } from "next-intl/server";
import { Locale, routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }: GetRequestConfigParams) => {
  const locale = await requestLocale;

  const resolvedLocale = !locale || !routing.locales.includes(locale as Locale)
    ? routing.defaultLocale
    : locale;


  return {
    locale: resolvedLocale,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default
  };
});
