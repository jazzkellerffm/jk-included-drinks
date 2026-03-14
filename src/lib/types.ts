export type Drink = {
  id: string;
  name: string;
  category: string;
  subtitle?: string;
  /** Optional one-line flavor marker, shown in italics under subtitle */
  flavorMarker?: string;
  image?: string;
  active?: boolean;
};

export type OrderStatus = "open" | "served";

export type Order = {
  id: string;
  tableOrGuest: string;
  guestName?: string;
  accessCode: string;
  items: { drinkId: string; drinkName: string; quantity: number }[];
  status: OrderStatus;
  createdAt: string; // ISO
  completedAt?: string; // ISO, set when bartender marks served
};
