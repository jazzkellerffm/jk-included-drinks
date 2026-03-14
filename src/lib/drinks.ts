import type { Drink } from "./types";

/**
 * Included-drinks menu. Image paths match exact filenames in public/images/
 * (served as /images/...). Only confirmed paths are used; missing = placeholder.
 */
export const DRINKS: Drink[] = [
  // SIGNATURES
  { id: "basil-bliss", name: "Basil Bliss", category: "Signatures", subtitle: "House signature", image: "/images/basil-bliss.png", active: true },
  { id: "purple-rain", name: "Purple Rain", category: "Signatures", subtitle: "House signature", image: "/images/purple-rain.png", active: true },
  { id: "basil-gintonic", name: "Basil infused Gin Tonic", category: "Signatures", subtitle: "Gin, basil, tonic", image: "/images/basil-gintonic.png", active: true },
  { id: "ginger-highball", name: "Ginger Highball", category: "Signatures", subtitle: "Whiskey, ginger", image: "/images/ginger-highball.png", active: true },
  { id: "imperial-aviation", name: "Imperial Aviation", category: "Signatures", subtitle: "Gin, crème de violette", image: "/images/imperial-aviation.png", active: true },
  { id: "frankfurt-sour", name: "Frankfurt Sour", category: "Signatures", subtitle: "Apple brandy, lemon", image: "/images/frankfurt-sour.png", active: true },
  { id: "goldstein-mule", name: "Goldstein Mule", category: "Signatures", subtitle: "Vodka, ginger beer", image: "/images/goldstein-mule.png", active: true },
  { id: "the-artist", name: "The Artist", category: "Signatures", subtitle: "House signature", image: "/images/the-artist.png", active: true },
  { id: "the-muse", name: "The Muse", category: "Signatures", subtitle: "House signature", image: "/images/the-muse.png", active: true },
  { id: "purple-negroni", name: "Purple Negroni", category: "Signatures", subtitle: "Gin, Campari, vermouth", image: "/images/purple-negroni.png", active: true },
  { id: "pina-margarita", name: "Piña Margarita", category: "Signatures", subtitle: "Tequila, pineapple, lime", image: "/images/margarita.png", active: true },
  // CLASSICS
  { id: "caipirinha", name: "OG Caipirinha", category: "Classics", subtitle: "Cachaça, lime", image: "/images/caipirinha.png", active: true },
  { id: "coco-colada", name: "Coco Colada", category: "Classics", subtitle: "Rum, coconut, pineapple", image: "/images/coco-colada.png", active: true },
  { id: "espresso-martini", name: "Espresso Martini", category: "Classics", subtitle: "Vodka, espresso", image: "/images/espresso-martini.png", active: true },
  { id: "margarita", name: "Classic Margarita", category: "Classics", subtitle: "Tequila, lime", image: "/images/margarita.png", active: true },
  { id: "negroni", name: "Classic Negroni", category: "Classics", subtitle: "Gin, Campari, vermouth", image: "/images/negroni.png", active: true },
  { id: "pisco-sour", name: "Pisco Sour", category: "Classics", subtitle: "Pisco, lemon", image: "/images/pisco-sour.png", active: true },
  { id: "whiskey-sour", name: "Whiskey Sour", category: "Classics", subtitle: "Whiskey, lemon", image: "/images/whiskey-sour.png", active: true },
  { id: "siberian-sour", name: "Siberian Sour", category: "Classics", subtitle: "Vodka, lemon", image: "/images/siberian-sour.png", active: true },
  // MOCKTAILS
  { id: "purple-no-rain", name: "Purple No Rain", category: "Mocktails", subtitle: "Alcohol-free", image: "/images/purple-no-rain.png", active: true },
  { id: "crafted-lemonade", name: "Crafted Lemonade", category: "Mocktails", subtitle: "House lemonade", image: "/images/crafted-lemonade.png", active: true },
  { id: "dubai-mule", name: "Dubai Mule", category: "Mocktails", subtitle: "Alcohol-free", image: "/images/dubai-mule.png", active: true },
  { id: "the-artist-non-alc", name: "The Artist non-alc", category: "Mocktails", subtitle: "Alcohol-free", image: "/images/the-artist-non.png", active: true },
  { id: "free-jazzy-fizz", name: "Free Jazzy Fizz", category: "Mocktails", subtitle: "Alcohol-free", image: "/images/free-jazzy-fizz.png", active: true },
  // WINE & BEER
  { id: "1884-blanc", name: "1884 Blanc", category: "Wine & Beer", subtitle: "White wine", image: "/images/corona.png", active: true },
  { id: "tegernseer-hell", name: "Tegernseer Hell", category: "Wine & Beer", subtitle: "Lager", image: "/images/tegernseer.png", active: true },
  { id: "lugana", name: "Lugana", category: "Wine & Beer", subtitle: "White wine", image: "/images/lugana-glass.png", active: true },
  { id: "sauvignon-blanc", name: "Sauvignon Blanc", category: "Wine & Beer", subtitle: "White wine", image: "/images/sauvignon-glass.png", active: true },
  { id: "primitivo", name: "Primitivo", category: "Wine & Beer", subtitle: "Red wine", image: "/images/primitivo-glass.png", active: true },
];

export function getDrinkById(id: string): Drink | undefined {
  return DRINKS.find((d) => d.id === id);
}
