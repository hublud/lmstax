export default function LogoSVG({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 520 160" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Main Branding Container */}
      <rect x="10" y="10" width="500" height="100" rx="12" fill="#006b3c" />
      
      {/* TAXNG Text */}
      <text 
        x="35" 
        y="92" 
        fontFamily="Arial Black, system-ui, sans-serif" 
        fontSize="88" 
        fontWeight="900" 
        fill="white"
        style={{ letterSpacing: '-0.06em' }}
      >
        TAXNG
      </text>

      {/* Nigeria Map silhouette inside 'A' hole */}
      <path 
        d="M10,5 L14,4 L18,5 L22,4 L26,6 L28,10 L27,14 L24,18 L18,20 L12,19 L9,15 L8,10 Z" 
        fill="#006b3c"
        transform="translate(108, 48) scale(1.6)"
      />

      {/* Red Accent on 'N' */}
      <path 
        d="M265,18 l32,0 l-12,18 l-32,0 z" 
        fill="#d41b1b"
      />

      {/* Tagline */}
      <text 
        x="45" 
        y="150" 
        fontFamily="Arial, sans-serif" 
        fontSize="28" 
        fontStyle="italic" 
        fontWeight="bold"
        fill="#111111"
      >
        ...Bridging the tax knowledge gap
      </text>
    </svg>
  );
}

