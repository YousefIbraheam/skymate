import { Bell, Compass, Home, Languages, Layers, Map, Plane, User, UserCircle, Users, UtensilsCrossed, Image } from "lucide-react";
import type { Messages } from "../../i18n/en";

export const navItems: { to: string; key: keyof Messages["nav"]; icon: typeof Home }[] = [
  { to: "/", key: "home", icon: Home },
  { to: "/explore", key: "explore", icon: Compass },
  { to: "/states", key: "regions", icon: Layers },
  { to: "/community", key: "community", icon: Users },
  { to: "/trips", key: "trips", icon: Plane },
  { to: "/map", key: "map", icon: Map },
  { to: "/travels", key: "travels", icon: Image },
  { to: "/translator", key: "translator", icon: Languages },
  { to: "/food", key: "food", icon: UtensilsCrossed },
  { to: "/notifications", key: "notifications", icon: Bell },
  { to: "/profile", key: "profile", icon: User },
  { to: "/auth", key: "account", icon: UserCircle },
];

/** Items shown in the mobile bottom bar. */
export const bottomNavPaths = ["/", "/explore", "/trips", "/map", "/profile"];

export const isActive = (pathname: string, to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));
