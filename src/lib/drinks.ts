import type { Drink } from "./types";

/**
 * Included-drinks menu. Image paths match exact filenames in public/images/
 * (served as /images/...). Only confirmed paths are used; missing = placeholder.
 */
export const DRINKS: Drink[] = [
  // SIGNATURES
  { id: "basil-bliss", name: "Basil Bliss", category: "Signatures", subtitle: "Gin, fresh basil, lime, gentle sweetness", flavorMarker: "green & aromatic", image: "/images/basil-bliss.png", active: true },
  { id: "purple-rain", name: "Purple Rain", category: "Signatures", subtitle: "Purple gin, tonka, vanilla, citrus", flavorMarker: "subtle floral notes", image: "/images/purple-rain.png", active: true },
  { id: "basil-gintonic", name: "Basil infused Gin Tonic", category: "Signatures", subtitle: "Gin, basil infusion, tonic, clean finish", flavorMarker: "green & aromatic", image: "/images/basil-gintonic.png", active: true },
  { id: "ginger-highball", name: "Ginger Highball", category: "Signatures", subtitle: "Whiskey, ginger soda, citrus oils, light spice", flavorMarker: "subtle spice", image: "/images/ginger-highball.png", active: true },
  { id: "imperial-aviation", name: "Imperial Aviation", category: "Signatures", subtitle: "Purple gin, maraschino, violet bitters, citrus", flavorMarker: "subtle floral notes", image: "/images/imperial-aviation.png", active: true },
  { id: "frankfurt-sour", name: "Frankfurt Sour", category: "Signatures", subtitle: "Whiskey, fresh lemon, sugar, silky foam", flavorMarker: "rich and smooth", image: "/images/frankfurt-sour.png", active: true },
  { id: "goldstein-mule", name: "Goldstein Mule", category: "Signatures", subtitle: "Vodka, ginger beer, lime, bright and fresh", flavorMarker: "crisp & fresh", image: "/images/goldstein-mule.png", active: true },
  { id: "the-artist", name: "The Artist", category: "Signatures", subtitle: "Purple gin, vanilla, tonka, lemon foam", flavorMarker: "subtle floral notes", image: "/images/the-artist.png", active: true },
  { id: "the-muse", name: "The Muse", category: "Signatures", subtitle: "Berry-infused vodka, citrus, lemon foam", flavorMarker: "crisp & fresh", image: "/images/the-muse.png", active: true },
  { id: "purple-negroni", name: "Purple Negroni", category: "Signatures", subtitle: "Gin, aperitivo, vermouth, floral bitterness", flavorMarker: "light bitterness", image: "/images/purple-negroni.png", active: true },
  { id: "pina-margarita", name: "Piña Margarita", category: "Signatures", subtitle: "Tequila, pineapple, lime, tropical freshness", flavorMarker: "crisp & fresh", image: "/images/margarita.png", active: true },

  // CLASSICS
  { id: "caipirinha", name: "OG Caipirinha", category: "Classics", subtitle: "Cachaça, fresh lime, cane sugar", flavorMarker: "crisp & fresh", image: "/images/caipirinha.png", active: true },
  { id: "coco-colada", name: "Coco Colada", category: "Classics", subtitle: "Rum, coconut, pineapple, creamy texture", flavorMarker: "rich and smooth", image: "/images/coco-colada.png", active: true },
  { id: "espresso-martini", name: "Espresso Martini", category: "Classics", subtitle: "Vodka, espresso, coffee liqueur, smooth sweetness", flavorMarker: "rich and smooth", image: "/images/espresso-martini.png", active: true },
  { id: "margarita", name: "Classic Margarita", category: "Classics", subtitle: "Tequila blanco, lime, orange liqueur, agave", flavorMarker: "crisp & fresh", image: "/images/margarita.png", active: true },
  { id: "negroni", name: "Classic Negroni", category: "Classics", subtitle: "Gin, Campari, sweet vermouth", flavorMarker: "light bitterness", image: "/images/negroni.png", active: true },
  { id: "pisco-sour", name: "Pisco Sour", category: "Classics", subtitle: "Pisco, fresh lime, sugar, silky foam", flavorMarker: "rich and smooth", image: "/images/pisco-sour.png", active: true },
  { id: "whiskey-sour", name: "Whiskey Sour", category: "Classics", subtitle: "Bourbon, fresh lemon, sugar, silky foam", flavorMarker: "rich and smooth", image: "/images/whiskey-sour.png", active: true },
  { id: "siberian-sour", name: "Siberian Sour", category: "Classics", subtitle: "Vodka, lemon, grapefruit bitters, silky foam", flavorMarker: "crisp & fresh", image: "/images/siberian-sour.png", active: true },

  // MOCKTAILS
  { id: "purple-no-rain", name: "Purple No Rain", category: "Mocktails", subtitle: "Non-alc purple gin, tonka, vanilla", flavorMarker: "subtle floral notes", image: "/images/purple-no-rain.png", active: true },
  { id: "crafted-lemonade", name: "Crafted Lemonade", category: "Mocktails", subtitle: "Fresh lemon, light sweetness, sparkling finish", flavorMarker: "crisp & fresh", image: "/images/crafted-lemonade.png", active: true },
  { id: "dubai-mule", name: "Dubai Mule", category: "Mocktails", subtitle: "Ginger beer, lime, fresh spice", flavorMarker: "subtle spice", image: "/images/dubai-mule.png", active: true },
  { id: "the-artist-non-alc", name: "The Artist non-alc", category: "Mocktails", subtitle: "Non-alc purple gin, tonka, vanilla, lemon foam", flavorMarker: "subtle floral notes", image: "/images/the-artist-non.png", active: true },
  { id: "free-jazzy-fizz", name: "Free Jazzy Fizz", category: "Mocktails", subtitle: "Citrus, herbal notes, gentle sparkle", flavorMarker: "crisp & fresh", image: "/images/free-jazzy-fizz.png", active: true },

  // WINE & BEER
  { id: "1664-blanc", name: "1664 Blanc", category: "Wine & Beer", subtitle: "French wheat beer", image: "/images/1664-beer.png", active: true },
  { id: "birra-moretti", name: "Birra Moretti", category: "Wine & Beer", subtitle: "Premium italian Lager", image: "/images/birra-moretti.png", active: true },
  { id: "tegernseer-hell", name: "Tegernseer Hell", category: "Wine & Beer", subtitle: "Traditional Bavarian lager", image: "/images/tegernseer.png", active: true },
  { id: "lugana", name: "Lugana", category: "Wine & Beer", subtitle: "White wine", image: "/images/lugana-glass.png", active: true },
  { id: "sauvignon-blanc", name: "Sauvignon Blanc", category: "Wine & Beer", subtitle: "White wine", image: "/images/sauvignon-glass.png", active: true },
  { id: "primitivo", name: "Primitivo", category: "Wine & Beer", subtitle: "Red wine", image: "/images/primitivo-glass.png", active: true },
];

export function getDrinkById(id: string): Drink | undefined {
  return DRINKS.find((d) => d.id === id);
}