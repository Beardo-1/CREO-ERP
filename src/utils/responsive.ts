// Responsive Design System for Cross-Platform Usage

export const breakpoints = {
  xs: '320px',   // Small phones
  sm: '640px',   // Large phones
  md: '768px',   // Tablets
  lg: '1024px',  // Small laptops
  xl: '1280px',  // Large laptops
  '2xl': '1536px', // Desktops
  '3xl': '1920px', // Large desktops
} as const;

export const containerSizes = {
  xs: 'max-w-full px-4',
  sm: 'max-w-full px-6', 
  md: 'max-w-full px-8',
  lg: 'max-w-7xl px-8 mx-auto',
  xl: 'max-w-7xl px-12 mx-auto',
  '2xl': 'max-w-8xl px-16 mx-auto',
} as const;

export const gridResponsive = {
  // Card grids for different content types
  cards: {
    stats: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6',
    properties: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
    contacts: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4',
    deals: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
    features: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    analytics: 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3',
  },
  
  // Layout grids
  layout: {
    sidebar: 'grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr]',
    dashboard: 'grid-cols-1 lg:grid-cols-[320px_1fr_280px] xl:grid-cols-[360px_1fr_320px]',
    twoColumn: 'grid-cols-1 lg:grid-cols-2',
    threeColumn: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    fourColumn: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }
} as const;

export const spacingResponsive = {
  container: 'p-4 sm:p-6 lg:p-8 xl:p-12',
  card: 'p-4 sm:p-6 lg:p-8',
  section: 'mb-6 sm:mb-8 lg:mb-12',
  gap: 'gap-4 sm:gap-6 lg:gap-8',
  gapSmall: 'gap-2 sm:gap-3 lg:gap-4',
} as const;

export const textResponsive = {
  heading: {
    h1: 'text-2xl sm:text-3xl lg:text-4xl xl:text-5xl',
    h2: 'text-xl sm:text-2xl lg:text-3xl xl:text-4xl',
    h3: 'text-lg sm:text-xl lg:text-2xl xl:text-3xl',
    h4: 'text-base sm:text-lg lg:text-xl xl:text-2xl',
  },
  body: {
    large: 'text-base sm:text-lg lg:text-xl',
    normal: 'text-sm sm:text-base lg:text-lg',
    small: 'text-xs sm:text-sm lg:text-base',
  }
} as const;

export const componentSizes = {
  button: {
    small: 'px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base',
    medium: 'px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base lg:px-8 lg:py-4',
    large: 'px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg lg:px-10 lg:py-5',
  },
  input: {
    small: 'px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base',
    medium: 'px-4 py-3 text-sm sm:px-6 sm:py-3 sm:text-base',
    large: 'px-6 py-4 text-base sm:px-8 sm:py-4 sm:text-lg',
  },
  card: {
    small: 'p-4 sm:p-6',
    medium: 'p-4 sm:p-6 lg:p-8',
    large: 'p-6 sm:p-8 lg:p-10 xl:p-12',
  },
  badge: {
    small: 'px-2 py-1 text-xs font-medium rounded-full',
    medium: 'px-3 py-1 text-sm font-medium rounded-full',
    large: 'px-4 py-2 text-sm font-semibold rounded-full',
  }
} as const;

// Utility functions
export const getResponsiveClasses = (
  type: keyof typeof gridResponsive,
  variant: string
): string => {
  return gridResponsive[type]?.[variant as keyof typeof gridResponsive[typeof type]] || '';
};

export const getContainerClasses = (size: keyof typeof containerSizes): string => {
  return containerSizes[size];
};

export const getTextClasses = (
  type: 'heading' | 'body',
  variant: string
): string => {
  return textResponsive[type]?.[variant as keyof typeof textResponsive[typeof type]] || '';
};

export const getComponentClasses = (
  component: keyof typeof componentSizes,
  size: string
): string => {
  return componentSizes[component]?.[size as keyof typeof componentSizes[typeof component]] || '';
};

// Device detection utilities
export const useDeviceType = () => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width < 640) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// Responsive visibility utilities
export const visibility = {
  mobileOnly: 'block sm:hidden',
  tabletOnly: 'hidden sm:block lg:hidden',
  desktopOnly: 'hidden lg:block',
  mobileAndTablet: 'block lg:hidden',
  tabletAndDesktop: 'hidden sm:block',
} as const;

export default {
  breakpoints,
  containerSizes,
  gridResponsive,
  spacingResponsive,
  textResponsive,
  componentSizes,
  visibility,
  getResponsiveClasses,
  getContainerClasses,
  getTextClasses,
  getComponentClasses,
  useDeviceType,
}; 