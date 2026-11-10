import { SITE } from "../data/site";

// A fact in SITE is "known" once the client has replaced its [PLACEHOLDER]. The header menu, the footer and the
// quote form only print contact facts that are known; until then they show one plain line. The bracketed
// placeholders themselves are listed once, in the ledger on the About page.
export const known = (v: string) => !/\[[^\]]*\]/.test(v);
const or = (v: string) => (known(v) ? v : null);

export const CONTACT = { address: or(SITE.address), hours: or(SITE.hours), phone: or(SITE.phone), email: or(SITE.email), legalName: or(SITE.legalName) };
export const allKnown = Boolean(CONTACT.address && CONTACT.hours && CONTACT.phone && CONTACT.email);
export const CONTACT_TO_COME = "Address, opening hours, phone and email to come.";
