import * as React from 'react';

export const FociLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 40"
    width="200"
    height="40"
    {...props}
  >
    <style>
      {
        '.logo-text { font-family: "Space Grotesk", sans-serif; font-size: 24px; font-weight: 700; fill: hsl(var(--primary)); }'
      }
      {
        '.logo-subtext { font-family: "Inter", sans-serif; font-size: 8px; fill: hsl(var(--foreground)); letter-spacing: 0.5px; }'
      }
    </style>
    <text x="0" y="20" className="logo-text">
      FOCI GROUP
    </text>
    <text x="0" y="32" className="logo-subtext">
      Engineering | ICT | Smart Automation
    </text>
  </svg>
);
