export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
  symbol: string;
  language: string;
  blurb: string;
}

export interface Category {
  id: string;
  label: string;
  emoji: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  tagline: string;
  description: string;
  image: string;
  gradient: string;
  lat: number;
  lng: number;
  bestTime: string;
  dailyBudget: number;
  tags: string[];
}

export interface Place {
  id: string;
  destinationId: string;
  name: string;
  category: string;
  description: string;
  image: string;
  lat: number;
  lng: number;
  rating: number;
  hours: number;
  cost: number;
  tip: string;
}

export interface Dish {
  id: string;
  name: string;
  destinationId: string;
  description: string;
  price: number;
  veg: boolean;
  where: string;
  image: string;
  spice: number;
}

export interface DestinationFacts {
  climate: string;
  duration: string;
  activities: string[];
  summary: string;
}
