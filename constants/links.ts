interface Link {
  href: string;
  name: string;
  isPopover?: boolean;
}

export const MENU_LINKS: Link[] = [
  {
    name: "Cakes",
    href: "/menu/cakes",
  },
  {
    name: "Pastries",
    href: "/menu/pastries",
  },
  {
    name: "Loaves",
    href: "/menu/loaves",
  },
  {
    name: "Others",
    href: "/menu/others",
  },
];

export const NAVLINKS: Link[] = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Menu",
    href: "/menu",
    isPopover: true,
  },
  {
    name: "Gallery",
    href: "/gallery",
  },
  {
    name: "About us",
    href: "/about-us",
  },
  {
    name: "Contact us",
    href: "/contact-us",
  },
  {
    name: "Cart",
    href: "/cart",
  },
];
