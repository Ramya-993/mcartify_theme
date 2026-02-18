import { RootState } from "@/store/StoreProvider";
import { useSelector } from "react-redux";

interface Social {
  icon: string;
  href: string;
  name: string;
}

interface FooterMenuItem {
  itemName: string;
  path: string;
  icon?: string;
  url?: string;
}

interface FooterSection {
  sectionName: string;
  sectionItems: FooterMenuItem[];
}

export const useFooter = () => {
  const { store } = useSelector((state: RootState) => state.store);
  const year = new Date().getFullYear();

  // Extract social media items from store's footerSections
  const socials: Social[] = [];

  // Find the "Social Media" section in footerSections
  const socialMediaSection =
    store?.footerSections && Array.isArray(store.footerSections)
      ? store.footerSections.find(
          (section: FooterSection) => section.sectionName === "Social Media"
        )
      : undefined;

  // Map the social media items to the Social interface
  if (socialMediaSection?.sectionItems?.length) {
    socialMediaSection.sectionItems.forEach((item: FooterMenuItem) => {
      if (item.icon && (item.path || item.url)) {
        socials.push({
          icon: item.icon,
          href: item.url || item.path || "#",
          name: item.itemName,
        });
      }
    });
  }

  return {
    year,
    store,
    socials,
  };
};
