import { ROUTES } from '@/config/Routes';

// Routes à afficher dans la sidebar
export const SIDEBAR_ROUTES = ROUTES.filter((route) => route.showInSidebar);
