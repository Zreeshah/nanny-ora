export type LocationNavigationLink = {
  href: string;
  label: string;
  children?: LocationNavigationLink[];
};

export const locationNavigation: LocationNavigationLink[] = [
  {
    href: "/nannies/auckland",
    label: "Auckland",
    children: [
      {
        href: "/nannies/auckland/northwest-auckland",
        label: "Northwest Auckland",
        children: [
          { href: "/nannies/auckland/hobsonville", label: "Hobsonville" },
        ],
      },
    ],
  },
  { href: "/nannies/hamilton", label: "Hamilton" },
  { href: "/nannies/christchurch", label: "Christchurch" },
  { href: "/nannies/wellington", label: "Wellington" },
];
