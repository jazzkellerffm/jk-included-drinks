import type { Drink } from "./types";

/**
 * Included-drinks menu. Image paths match exact filenames in public/images/
 * (served as /images/...). Only confirmed paths are used; missing = placeholder.
 */
export const DRINKS: Drink[] = [
  // SIGNATURES
  { id: "basil-bliss", name: "Basil Bliss", category: "Signatures", subtitle: "Gin infused with fresh basil, lime, gentle sweetness, bright herbal aroma", flavorMarker: "green & aromatic", image: "/images/basil-bliss.png", active: true },
  { id: "purple-rain", name: "Purple Rain", category: "Signatures", subtitle: "Vodka, berry notes, citrus freshness, soft sweetness", flavorMarker: "crisp & fresh", image: "/images/purple-rain.png", active: true },
  { id: "basil-gintonic", name: "Basil infused Gin Tonic", category: "Signatures", subtitle: "Gin, basil infusion, tonic water, fresh herbal lift, clean finish", flavorMarker: "green & aromatic", image: "/images/basil-gintonic.png", active: true },
  { id: "ginger-highball", name: "Ginger Highball", category: "Signatures", subtitle: "Whiskey, ginger soda, fresh citrus oils, refreshing spice", flavorMarker: "subtle spice", image: "/images/ginger-highball.png", active: true },
  { id: "imperial-aviation", name: "Imperial Aviation", category: "Signatures", subtitle: "Gin, maraschino, violet liqueur, fresh lemon, elegant floral notes", flavorMarker: "subtle floral notes", image: "/images/imperial-aviation.png", active: true },
  { id: "frankfurt-sour", name: "Frankfurt Sour", category: "Signatures", subtitle: "Whiskey, fresh lemon, sugar, silky foam texture", flavorMarker: "rich and smooth", image: "/images/frankfurt-sour.png", active: true },
  { id: "goldstein-mule", name: "Goldstein Mule", category: "Signatures", subtitle: "Vodka, ginger beer, lime, bright and refreshing", flavorMarker: "crisp & fresh", image: "/images/goldstein-mule.png", active: true },
  { id: "the-artist", name: "The Artist", category: "Signatures", subtitle: "Gin, elderflower, fresh lemon, delicate aromatic profile", flavorMarker: "subtle floral notes", image: "/images/the-artist.png", active: true },
  { id: "the-muse", name: "The Muse", category: "Signatures", subtitle: "Vodka, passion fruit, citrus, light sweetness", flavorMarker: "crisp & fresh", image: "/images/the-muse.png", active: true },
  { id: "purple-negroni", name: "Purple Negroni", category: "Signatures", subtitle: "Gin, bittersweet aperitivo, vermouth, subtle floral character", flavorMarker: "light bitterness", image: "/images/purple-negroni.png", active: true },
  { id: "pina-margarita", name: "Piña Margarita", category: "Signatures", subtitle: "Tequila, pineapple, lime", image: "/images/margarita.png", active: true },
  // CLASSICS
  { id: "caipirinha", name: "OG Caipirinha", category: "Classics", subtitle: "Cachaça, fresh lime, cane sugar, bold citrus character", flavorMarker: "crisp & fresh", image: "/images/caipirinha.png", active: true },
  { id: "coco-colada", name: "Coco Colada", category: "Classics", subtitle: "Rum, coconut, pineapple, creamy tropical balance", flavorMarker: "rich and smooth", image: "/images/coco-colada.png", active: true },
  { id: "espresso-martini", name: "Espresso Martini", category: "Classics", subtitle: "Vodka, fresh espresso, coffee liqueur, smooth sweetness", flavorMarker: "rich and smooth", image: "/images/espresso-martini.png", active: true },
  { id: "margarita", name: "Classic Margarita", category: "Classics", subtitle: "Tequila blanco, lime juice, orange liqueur, agave sweetness", flavorMarker: "crisp & fresh", image: "/images/margarita.png", active: true },
  { id: "negroni", name: "Classic Negroni", category: "Classics", subtitle: "Gin, Campari, sweet vermouth, classic bittersweet balance", flavorMarker: "light bitterness", image: "/images/negroni.png", active: true },
  { id: "pisco-sour", name: "Pisco Sour", category: "Classics", subtitle: "Pisco, fresh lime, sugar, silky foam texture", flavorMarker: "rich and smooth", image: "/images/pisco-sour.png", active: true },
  { id: "whiskey-sour", name: "Whiskey Sour", category: "Classics", subtitle: "Bourbon, fresh lemon, sugar, classic silky foam", flavorMarker: "rich and smooth", image: "/images/whiskey-sour.png", active: true },
  { id: "siberian-sour", name: "Siberian Sour", category: "Classics", subtitle: "Vodka, fresh citrus, soft sweetness, smooth texture", flavorMarker: "crisp & fresh", image: "/images/siberian-sour.png", active: true },
  // MOCKTAILS
  { id: "purple-no-rain", name: "Purple No Rain", category: "Mocktails", subtitle: "Berry notes, citrus freshness, soft sweetness", flavorMarker: "crisp & fresh", image: "/images/purple-no-rain.png", active: true },
  { id: "crafted-lemonade", name: "Crafted Lemonade", category: "Mocktails", subtitle: "Fresh lemon, light sweetness, sparkling finish", flavorMarker: "crisp & fresh", image: "/images/crafted-lemonade.png", active: true },
  { id: "dubai-mule", name: "Dubai Mule", category: "Mocktails", subtitle: "Vodka, ginger beer, lime, fresh spice and citrus lift", flavorMarker: "subtle spice", image: "/images/dubai-mule.png", active: true },
  { id: "the-artist-non-alc", name: "The Artist non-alc", category: "Mocktails", subtitle: "Alcohol-free", image: "/images/the-artist-non.png", active: true },
  { id: "free-jazzy-fizz", name: "Free Jazzy Fizz", category: "Mocktails", subtitle: "Citrus, herbal notes, gentle sparkle, refreshing character", flavorMarker: "crisp & fresh", image: "/images/free-jazzy-fizz.png", active: true },
  // WINE & BEER
  { id: "1884-blanc", name: "1884 Blanc", category: "Wine & Beer", subtitle: "French beer", image: "/images/corona.png", active: true },
  { id: "tegernseer-hell", name: "Tegernseer Hell", category: "Wine & Beer", subtitle: "Helles aus Bayern", image: "/images/tegernseer.png", active: true },
  { id: "lugana", name: "Lugana", category: "Wine & Beer", subtitle: "White wine", image: "/images/lugana-glass.png", active: true },
  { id: "sauvignon-blanc", name: "Sauvignon Blanc", category: "Wine & Beer", subtitle: "White wine", image: "/images/sauvignon-glass.png", active: true },
  { id: "primitivo", name: "Primitivo", category: "Wine & Beer", subtitle: "Red wine", image: "/images/primitivo-glass.png", active: true },
];

export function getDrinkById(id: string): Drink | undefined {
  return DRINKS.find((d) => d.id === id);
}
