// Production environment utilities
export const isProd = import.meta.env.PROD;
export const isDev = import.meta.env.DEV;

// Clear demo data in production
export const clearDemoData = () => {
  if (isProd) {
    localStorage.clear();
    sessionStorage.clear();
      }
};

// Initialize fresh production environment
export const initProdEnvironment = () => {
  if (isProd) {
    clearDemoData();
      }
};
