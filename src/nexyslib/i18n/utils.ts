import { Language } from "./type";
import * as U from "@nexys/utils";

/**
 *
 * @param languageId numeric id of language (defined internally)
 * @param languages list of languages
 */
export const langIdToOptionSet = (
  languageId: number,
  languages: Language[]
): U.types.OptionSet => {
  const l = languages.find((l) => l.id === languageId);

  if (!l) {
    throw Error(`Language can't be found`);
  }

  return { id: l.id, name: l.iso2 };
};
