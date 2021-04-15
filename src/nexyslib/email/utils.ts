import HTTP from "@nexys/http";

export const parseRecipients = (to: string | string[]): string[] => {
  if (to instanceof Array) {
    return to;
  }

  if (typeof to === "string") {
    if (to.includes(", ")) {
      return to.split(", ");
    } else {
      return [to];
    }
  }

  throw new HTTP.Error("Please provide (a) valid recipient(s)!");
};
