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
    { name: "I&A Formal", url: "https://sheedosa.github.io/iana-tailoring/" },
  ],
  preview: true, // concept preview: sample garments, sample pricing formula, quote sending switched off
  // Confirmed by the client
  services: ["Embroidery", "Screen printing", "DTF printing", "Vinyl", "Workwear supply", "Uniforms"],
  customers: ["Trades", "Schools", "Sports clubs"],
  minimumOrder: "1 item",
  turnaround: "within 7 days",
  pricing: "Priced per item, or by quote",
  toConfirm: [
    "legal entity name, company number and VAT number",
    "workshop address, phone, email and opening hours",
    "garment range, brands stocked and colours offered",
    "prices per garment and per decoration (embroidery, screen, DTF, vinyl; by position and size)",
    "quantity bands and the price at each band",
    "setup charges: embroidery digitising, screens per colour",
    "whether an express service is offered",
    "artwork requirements (file types, minimum size, thread colour matching)",
    "delivery charges, collection, and returns on decorated goods",
    "school and club terms (parent ordering, named items, numbering, sizing days)",
    "client reviews for the testimonial slot",
    "workshop photographs for the photo slots",
  ],
};

export const SECTORS = [
  { k: "trades", t: "Trades", d: "Polos, softshells and hi-vis with your name on the chest and the back. One van's worth or one jacket.", to: "/quote" },
  { k: "schools", t: "Schools", d: "PE kit, staff wear and leavers' hoodies, with names on if you want them.", to: "/schools-and-clubs" },
  { k: "clubs", t: "Sports clubs", d: "Team kits with names and numbers, club hoodies, coaches' jackets.", to: "/schools-and-clubs" },
] as const;

export const STEPS = [
  { n: "01", t: "Build your quote", d: "Pick a garment, a colour and where the logo goes. The mock-up changes as you choose." },
  { n: "02", t: "Send us your logo", d: "Any file is fine to start. We check it and get it ready to stitch or print." },
  { n: "03", t: "Say yes to the proof", d: "You see a flat proof with colours and sizes marked. Nothing is made until you say so." },
  { n: "04", t: "Ready within 7 days", d: "Made in our Tooting workshop. Collection or delivery: [DELIVERY OPTIONS]." },
] as const;
