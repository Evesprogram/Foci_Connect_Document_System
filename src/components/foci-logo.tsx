import * as React from 'react';

export const FociLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 40"
    width="200"
    height="40"
    {...props}
  >
    <text
      x="0"
      y="20"
      style={{
        fontFamily: '"Space Grotesk", sans-serif',
        fontSize: '24px',
        fontWeight: 700,
        fill: 'hsl(var(--primary))',
      }}
    >
      FOCI GROUP
    </text>
    <text
      x="0"
      y="32"
      style={{
        fontFamily: '"Inter", sans-serif',
        fontSize: '8px',
        fill: 'hsl(var(--foreground))',
        letterSpacing: '0.5px',
      }}
    >
      Engineering | ICT | Smart Automation
    </text>
  </svg>
);
