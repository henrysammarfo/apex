import { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export const OverviewIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="6.5" cy="6.5" r="1" fill="currentColor" opacity="0.5" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" opacity="0.5" />
  </svg>
);

export const PortfolioIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 3C12 3 12 12 12 12L18.36 7.64" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M12 12L19.79 14.47" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.3" />
  </svg>
);

export const AgentIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="9" cy="10" r="1.5" fill="currentColor" />
    <circle cx="15" cy="10" r="1.5" fill="currentColor" />
    <path d="M9 15C9 15 10.5 17 12 17C13.5 17 15 15 15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 4V2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M16 4V2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const TransactionIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M4 8H17L14 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 16H7L10 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="4" cy="16" r="1" fill="currentColor" opacity="0.4" />
    <circle cx="20" cy="8" r="1" fill="currentColor" opacity="0.4" />
  </svg>
);

export const SettingsIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 2V4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M12 19.5V22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M4.93 4.93L6.7 6.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M17.3 17.3L19.07 19.07" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M2 12H4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M19.5 12H22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M4.93 19.07L6.7 17.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M17.3 6.7L19.07 4.93" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const ApexLogo = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 3L20 19H4L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M12 9L16 17H8L12 9Z" fill="currentColor" opacity="0.2" />
    <circle cx="12" cy="14" r="1.5" fill="currentColor" />
  </svg>
);

export const NotificationIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M18 8A6 6 0 1 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.73 21A2 2 0 0 1 10.27 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
