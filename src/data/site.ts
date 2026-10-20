export const site = {
  name: "Al Kenisa",
  fullName: "Al Kenisa Caffè Letterario",
  address: "Via Roma 481",
  city: "94100 Enna (EN)",
  phone: { label: "+39 329 941 1843", href: "tel:+393299411843" },
  landline: { label: "0935 182 4154", href: "tel:+3909351824154" },
  email: "alkenisa@gmail.com",
  maps: "https://www.google.com/maps/dir/?api=1&destination=Al+Kenisa+Caff%C3%A8+Letterario+Via+Roma+481+Enna",
  facebook: "https://www.facebook.com/alkenisaenna/",
  tripadvisor:
    "https://www.tripadvisor.it/Restaurant_Review-g315896-d2661966-Reviews-Al_Kenisa_Literary_Cafe-Enna_Province_of_Enna_Sicily.html",
  rating: { tripadvisor: "4,3", reviews: 83, atmosphere: "4,6", facebook: "94%" },
}

/** 0 = domenica ... 6 = sabato. Orario 15:00 - 01:00, lunedì chiuso. */
export const hours = [
  { day: "Lunedì", time: "Chiuso", closed: true },
  { day: "Martedì", time: "15:00 - 01:00" },
  { day: "Mercoledì", time: "15:00 - 01:00" },
  { day: "Giovedì", time: "15:00 - 01:00" },
  { day: "Venerdì", time: "15:00 - 01:00" },
  { day: "Sabato", time: "15:00 - 01:00" },
  { day: "Domenica", time: "15:00 - 01:00" },
]

export const quotes = {
  miller: { text: "Quasi quasi da andare a Enna solo per Al Kenisa.", author: "millerCaserta", where: "TripAdvisor, ottobre 2023" },
  salotti: { text: "Mi ricorda i salotti francesi dell'Ottocento.", author: "Alessio A.", where: "TripAdvisor" },
  cripta: { text: "Non dimenticate di chiedere di vedere la cripta.", author: "Denis K., Berlino", where: "TripAdvisor" },
  serate: { text: "Bellissime le serate musicali.", author: "antoninotacci", where: "TripAdvisor" },
}

export type MenuItem = { name: string; note?: string; price: string }
export type MenuSection = {
  id: string
  title: string
  kicker: string
  photo: string
  photoAlt: string
  items: MenuItem[]
}

export const menu: MenuSection[] = [
  {
    id: "caffetteria",
    title: "Caffetteria",
    kicker: "Dalle 15:00",
    photo: "/photos/bancone.jpg",
    photoAlt: "Il bancone di Al Kenisa con la macchina del caffè",
    items: [
      { name: "Espresso", price: "1,20" },
      { name: "Macchiato", price: "1,30" },
      { name: "Cappuccino", price: "2,00" },
      { name: "Caffè corretto", note: "grappa, sambuca o amaro", price: "2,00" },
      { name: "Marocchino", note: "espresso, cacao, schiuma di latte", price: "2,20" },
      { name: "Caffè freddo shakerato", price: "3,00" },
    ],
  },
  {
    id: "te",
    title: "Tè e tisane",
    kicker: "Da leggere piano",
    photo: "/photos/lampada-libri.jpg",
    photoAlt: "Una lampada da lettura accesa sopra un tavolo con i libri",
    items: [
      { name: "Tè nero", note: "Darjeeling o Earl Grey", price: "3,00" },
      { name: "Tè verde", note: "sencha o alla menta", price: "3,00" },
      { name: "Tisana ai frutti rossi", price: "3,00" },
      { name: "Camomilla e miele di zagara", price: "3,00" },
      { name: "Infuso zenzero e limone", price: "3,50" },
    ],
  },
  {
    id: "cioccolate",
    title: "Cioccolate",
    kicker: "Per l'inverno di Enna",
    photo: "/photos/tavolo-libri.jpg",
    photoAlt: "Tavolo con libri esposti e un drink",
    items: [
      { name: "Cioccolata calda", price: "3,50" },
      { name: "Cioccolata con panna", price: "4,00" },
      { name: "Cioccolata al peperoncino", price: "4,00" },
      { name: "Cioccolata bianca e cannella", price: "4,00" },
    ],
  },
  {
    id: "aperitivo",
    title: "Aperitivo",
    kicker: "Con noccioline e patatine",
    photo: "/photos/aperitivo.jpg",
    photoAlt: "Aperitivo con noccioline, patatine e cocktail",
    items: [
      { name: "Spritz Aperol", price: "6,00" },
      { name: "Spritz Campari", price: "6,00" },
      { name: "Hugo", note: "prosecco, sambuco, menta", price: "6,50" },
      { name: "Americano", price: "7,00" },
      { name: "Negroni", price: "8,00" },
      { name: "Gin tonic", note: "chiedi i gin del giorno", price: "8,00" },
    ],
  },
  {
    id: "vini",
    title: "Vini",
    kicker: "Etichette siciliane",
    photo: "/photos/navata-scultura.jpg",
    photoAlt: "La navata con la scultura di carta sospesa",
    items: [
      { name: "Nero d'Avola", note: "calice", price: "5,00" },
      { name: "Grillo", note: "calice", price: "5,00" },
      { name: "Etna Rosso", note: "calice", price: "6,00" },
      { name: "Bollicine siciliane", note: "calice", price: "6,00" },
      { name: "Bottiglia della casa", price: "18,00" },
    ],
  },
  {
    id: "birre",
    title: "Birre",
    kicker: "Artigianali e del territorio",
    photo: "/photos/sala-sera.jpg",
    photoAlt: "La sala di sera con le lampade accese",
    items: [
      { name: "Birra artigianale siciliana", note: "33 cl, etichette a rotazione", price: "5,50" },
      { name: "Birra artigianale", note: "75 cl, da dividere", price: "12,00" },
      { name: "Lager in bottiglia", note: "33 cl", price: "4,00" },
    ],
  },
  {
    id: "bibite",
    title: "Bibite",
    kicker: "Lurisia e succhi",
    photo: "/photos/lurisia.jpg",
    photoAlt: "Bottiglie di chinotto, gazzosa, acqua tonica e aranciata Lurisia",
    items: [
      { name: "Chinotto Lurisia", price: "3,00" },
      { name: "Gazzosa Lurisia", price: "3,00" },
      { name: "Aranciata Lurisia", price: "3,00" },
      { name: "Acqua tonica Lurisia", price: "3,00" },
      { name: "Succhi di frutta", price: "2,50" },
      { name: "Acqua", note: "50 cl", price: "1,00" },
    ],
  },
  {
    id: "cucina",
    title: "Da mangiare",
    kicker: "Fino a tarda sera",
    photo: "/photos/cortile-sera.jpg",
    photoAlt: "Tavolino nel cortile al tramonto",
    items: [
      { name: "Focaccia farcita", note: "chiedi le farciture del giorno", price: "6,00" },
      { name: "Bruschette", note: "pomodoro, origano, olio di Enna", price: "5,00" },
      { name: "Piatto di antipasti", note: "per una persona", price: "9,00" },
      { name: "Tagliere di salumi e formaggi siciliani", note: "per due", price: "14,00" },
      { name: "Piacentinu ennese e miele", price: "7,00" },
    ],
  },
]
