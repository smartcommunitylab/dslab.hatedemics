import type { RouteLocationRaw } from 'vue-router';

/** Drawer Menu Item Interface */
export default interface DrawerMenuItem {
  /** Item Name */
  title: string | '-';
  /** Item Icon */
  icon?: string;
  /** Router Location */
  to?: RouteLocationRaw;
  /** is active */
  active?: boolean;
  action?: () => void; // Azione opzionale (come il logout)
  /** Sub Items */
  items?: DrawerMenuItem[];
}
