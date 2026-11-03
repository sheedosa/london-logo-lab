// Facts for The London Logo Lab. Anything the client has not confirmed lives in toConfirm and appears on pages
// only as a labelled [PLACEHOLDER]. While preview is true every page carries the concept-preview banner.
export const SITE = {
  name: "The London Logo Lab",
  shortName: "Logo Lab",
  legalName: "[LEGAL ENTITY]",
  area: "Tooting, South London",
  address: "[ADDRESS]",
  phone: "[PHONE]",
  email: "[EMAIL]",
  hours: "[OPENING HOURS]",
  url: "https://sheedosa.github.io/london-logo-lab",
  social: { instagram: "[INSTAGRAM URL]" },
  family: [
    { name: "I&A Schoolwear", url: "https://sheedosa.github.io/iana-schoolwear/" },
    { name: "I&A Fashions", url: "https://sheedosa.github.io/iana-fashions/" },
    { name: "I&A Tailoring", url: "https://sheedosa.github.io/iana-tailoring/" },
  ],
  preview: true, // concept preview: sample garments, sample pricing formula, quote sending switched off
  toConfirm: [
    "legal entity name, company number and VAT number",
    "workshop address, phone, email and opening hours",
    "garment range, brands stocked and colours offered",
    "prices per garment and per decoration (embroidery, print, by position and size)",
    "quantity bands and the discount at each band",
    "minimum order (if any) and setup or digitising charges",
    "standard and express turnaround times",
    "artwork requirements (file types, minimum size, thread colour matching)",
    "delivery charges, collection, and returns on decorated goods",
    "school and club programme terms (parent ordering, named items, sizing days)",
    "client reviews for the testimonial slots",
  ],
};

export const SECTORS = [
  { k: "trades", t: "Trades", d: "Polos, hoodies, hi-vis and softshells with your name on the chest and your number on the back." },
  { k: "schools", t: "Schools & clubs", d: "PE kit, team kits, leavers' hoodies and staff wear, with named items and parent ordering." },
  { k: "hospitality", t: "Hospitality", d: "Aprons, tees and caps that match the room and survive the wash." },
  { k: "corporate", t: "Corporate", d: "Uniform programmes for teams of ten to a thousand, re-ordered from one saved spec." },
] as const;

export const STEPS = [
  { n: "01", t: "Build your quote", d: "Pick a garment, colour, quantity and where the logo goes. The mock-up updates as you choose." },
  { n: "02", t: "Send us your artwork", d: "Upload a logo or tell us what you want. We check it, digitise it for embroidery and send a proof." },
  { n: "03", t: "Approve the proof", d: "A flat mock-up with thread or ink colours, sizes and positions marked. Nothing is stitched until you say so." },
  { n: "04", t: "Made in Tooting", d: "Embroidered and printed in our South London workshop, then collected or delivered in [TURNAROUND]." },
] as const;
