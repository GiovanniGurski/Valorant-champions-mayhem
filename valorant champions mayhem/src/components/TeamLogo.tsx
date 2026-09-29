import React, { useState } from 'react';
import { getTeamLogoData, TeamLogoData } from '../data/teamLogos';

interface TeamLogoProps {
  teamName: string;
  shortName?: string;
  logoUrl?: string;
  primaryColor?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  showGlow?: boolean;
}

export const TeamLogo: React.FC<TeamLogoProps> = ({
  teamName,
  shortName = '',
  logoUrl,
  primaryColor,
  size = 'md',
  className = '',
  showGlow = false,
}) => {
  const [imgError, setImgError] = useState(false);

  const logoData = getTeamLogoData(teamName) || (shortName ? getTeamLogoData(shortName) : null);
  const effectiveUrl = logoUrl || logoData?.logoUrl;
  const color = primaryColor || logoData?.primaryColor || '#00ff88';

  // Dimension classes
  const sizeMap = {
    xs: 'w-4 h-4 text-[9px]',
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-base',
  };

  const dimClass = typeof size === 'number' ? '' : sizeMap[size];
  const customStyle = typeof size === 'number' ? { width: size, height: size } : undefined;

  // Normalized key for SVG rendering
  const key = (teamName || shortName || '').toLowerCase().replace(/[\s-]/g, '');

  const renderSvgCrest = () => {
    // 1. LOUD
    if (key.includes('loud')) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
          <path
            d="M20 18H38V66H78V82H20V18Z"
            fill="#00ff88"
          />
          <path
            d="M38 34H62V66H38V34Z"
            fill="#00ff88"
            opacity="0.25"
          />
          <circle cx="70" cy="28" r="8" fill="#00ff88" />
        </svg>
      );
    }

    // 2. SENTINELS
    if (key.includes('sentinel') || key === 'sen') {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
          <path
            d="M50 10L18 26V58C18 78 32 90 50 94C68 90 82 78 82 58V26L50 10Z"
            fill="#12080a"
            stroke="#ce0037"
            strokeWidth="5"
          />
          <path
            d="M34 40H66V48H44V56H66V68H34V60H56V52H34V40Z"
            fill="#ce0037"
          />
        </svg>
      );
    }

    // 3. FNATIC
    if (key.includes('fnatic') || key === 'fnc') {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
          <path
            d="M50 14L24 34L34 40L50 28L66 40L76 34L50 14Z"
            fill="#ff5900"
          />
          <path
            d="M36 46L50 56L64 46L72 52L50 68L28 52L36 46Z"
            fill="#ff5900"
          />
          <path
            d="M44 72L50 78L56 72L62 76L50 86L38 76L44 72Z"
            fill="#ff5900"
          />
        </svg>
      );
    }

    // 4. KRÜ ESPORTS (Stylized brush signature matching user uploaded image)
    if (key.includes('kru') || key.includes('krü')) {
      return (
        <svg viewBox="0 0 120 100" className="w-full h-full p-0.5" fill="none">
          <path
            d="M24 18C26 26 27 60 25 80M27 50C38 38 48 26 58 20M35 52C44 60 54 70 66 82"
            stroke="#ffffff"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M68 22C74 20 86 18 94 26C100 32 98 42 90 46C82 50 74 48 70 48M76 48C82 56 90 68 98 82"
            stroke="#ffffff"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <circle cx="82" cy="12" r="4" fill="#ff007f" />
          <circle cx="94" cy="12" r="4" fill="#ff007f" />
        </svg>
      );
    }

    // 5. PAPER REX
    if (key.includes('paperrex') || key === 'prx') {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
          <polygon points="50,14 86,50 50,86 14,50" stroke="#d63384" strokeWidth="6" fill="#140816" />
          <path d="M36 34H64V50H46V66H36V34Z" fill="#00d2ff" />
          <path d="M50 48L66 66H54L42 52H50Z" fill="#d63384" />
        </svg>
      );
    }

    // 6. G2 ESPORTS
    if (key.includes('g2')) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
          <circle cx="50" cy="50" r="40" fill="#15171c" stroke="#333a42" strokeWidth="4" />
          <path d="M32 30H68L60 48H44L40 60H64V68H32V30Z" fill="#ffffff" />
          <circle cx="64" cy="40" r="5" fill="#ee1515" />
        </svg>
      );
    }

    // 7. TEAM LIQUID
    if (key.includes('liquid') || key === 'tl') {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
          <circle cx="50" cy="50" r="42" fill="#0c223f" stroke="#2b7fff" strokeWidth="4" />
          {/* Stallion mane silhouette */}
          <path
            d="M32 68C30 50 36 36 50 26C58 32 60 42 54 48C62 48 70 52 74 62C66 62 60 58 54 58C48 66 40 68 32 68Z"
            fill="#ffffff"
          />
          <circle cx="52" cy="38" r="3" fill="#2b7fff" />
        </svg>
      );
    }

    // 8. EDWARD GAMING (EDG)
    if (key.includes('edward') || key.includes('edg')) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
          <circle cx="50" cy="50" r="42" fill="#111111" stroke="#c51d24" strokeWidth="5" />
          <text
            x="50"
            y="58"
            textAnchor="middle"
            fontFamily="sans-serif"
            fontWeight="900"
            fontSize="26"
            fill="#c51d24"
            letterSpacing="-1"
          >
            EDG
          </text>
        </svg>
      );
    }

    // 9. TEAM HERETICS
    if (key.includes('heretics') || key === 'th') {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
          <polygon points="50,14 84,32 76,78 50,92 24,78 16,32" fill="#121212" stroke="#d6a13d" strokeWidth="5" />
          {/* Spartan visor */}
          <path d="M34 46H66M50 46V74" stroke="#d6a13d" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );
    }

    // 10. GEN.G
    if (key.includes('geng') || key === 'gen') {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
          <polygon points="50,14 86,30 80,76 50,90 20,76 14,30" fill="#000000" stroke="#aa8a00" strokeWidth="5" />
          <path d="M30 42H70V54H44V62H70V70H30V42Z" fill="#aa8a00" />
        </svg>
      );
    }

    // 11. LEVIATÁN
    if (key.includes('leviatan') || key.includes('leviatán') || key === 'lev') {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
          <path
            d="M50 16C30 16 18 32 18 52C18 72 32 86 50 86C68 86 82 72 82 52C82 32 70 16 50 16Z"
            fill="#051c2c"
            stroke="#1ab1ec"
            strokeWidth="4"
          />
          {/* Sea serpent dragon crest */}
          <path
            d="M34 56C34 42 44 32 50 26C56 32 66 42 66 56C60 52 56 46 50 46C44 46 40 52 34 56Z"
            fill="#1ab1ec"
          />
          <circle cx="50" cy="66" r="5" fill="#1ab1ec" />
        </svg>
      );
    }

    // 12. DRX
    if (key.includes('drx')) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
          <circle cx="50" cy="50" r="42" fill="#081830" stroke="#0b50d0" strokeWidth="5" />
          <path
            d="M26 34H44C54 34 60 42 60 50C60 58 54 66 44 66H26V34ZM36 42V58H44C48 58 50 54 50 50C50 46 48 42 44 42H36Z"
            fill="#5ce1e6"
          />
          <path d="M58 48L74 66H64L50 50L58 48Z" fill="#0b50d0" />
        </svg>
      );
    }

    // 13. TEAM VITALITY
    if (key.includes('vitality') || key === 'vit') {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
          <polygon points="50,14 86,40 70,86 30,86 14,40" fill="#111111" stroke="#f5c518" strokeWidth="5" />
          <path d="M34 36L50 70L66 36H56L50 52L44 36H34Z" fill="#f5c518" />
        </svg>
      );
    }

    // 14. OPTIC
    if (key.includes('optic')) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
          <circle cx="44" cy="50" r="28" stroke="#93c023" strokeWidth="8" fill="none" />
          <circle cx="56" cy="50" r="28" stroke="#ffffff" strokeWidth="8" fill="none" />
        </svg>
      );
    }

    // 15. FPX (FunPlus Phoenix)
    if (key.includes('funplus') || key === 'fpx') {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
          <circle cx="50" cy="50" r="42" fill="#1c0709" stroke="#ff4655" strokeWidth="5" />
          <path d="M50 20L64 46L54 48L68 76L44 54L52 52L38 34L50 20Z" fill="#ff9900" />
        </svg>
      );
    }

    // 16. EVIL GENIUSES (EG)
    if (key.includes('evil') || key === 'eg') {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
          <circle cx="50" cy="50" r="42" fill="#053e6b" stroke="#ffffff" strokeWidth="4" />
          <text
            x="50"
            y="60"
            textAnchor="middle"
            fontFamily="sans-serif"
            fontWeight="900"
            fontSize="32"
            fill="#ffffff"
          >
            EG
          </text>
        </svg>
      );
    }

    // 17. FUT ESPORTS
    if (key.includes('fut')) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
          <polygon points="50,14 86,28 78,82 50,92 22,82 14,28" fill="#140809" stroke="#d92534" strokeWidth="5" />
          <text
            x="50"
            y="62"
            textAnchor="middle"
            fontFamily="sans-serif"
            fontWeight="900"
            fontSize="24"
            fill="#ffffff"
          >
            FUT
          </text>
        </svg>
      );
    }

    // 18. TALON ESPORTS
    if (key.includes('talon') || key === 'tln') {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
          <circle cx="50" cy="50" r="42" fill="#1f0709" stroke="#ea1d2d" strokeWidth="5" />
          <path d="M30 68L50 24L70 68L50 54L30 68Z" fill="#ea1d2d" />
        </svg>
      );
    }

    // 19. TRACE ESPORTS
    if (key.includes('trace') || key === 'te') {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
          <rect x="14" y="14" width="72" height="72" rx="16" fill="#111822" stroke="#00adb5" strokeWidth="5" />
          <path d="M28 36H56M42 36V70M56 46H72V56H56V66H72" stroke="#00adb5" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );
    }

    // 20. NRG ESPORTS
    if (key.includes('nrg')) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
          <circle cx="50" cy="50" r="42" fill="#1a1a1a" stroke="#ff1a1a" strokeWidth="5" />
          <text
            x="50"
            y="60"
            textAnchor="middle"
            fontFamily="sans-serif"
            fontWeight="900"
            fontSize="26"
            fill="#ff1a1a"
          >
            NRG
          </text>
        </svg>
      );
    }

    // 21. XI LAI GAMING / XI'AN (XLG)
    if (key.includes('xilai') || key.includes('xlg') || key.includes('xian')) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
          <polygon points="50,14 84,32 76,80 50,92 24,80 16,32" fill="#0d2433" stroke="#38b2ac" strokeWidth="4" />
          <path d="M28 36L44 64L32 64L24 50L28 36Z" fill="#38b2ac" />
          <path d="M72 36L56 64L68 64L76 50L72 36Z" fill="#38b2ac" />
          <path d="M42 40L50 56L58 40H66L54 64H46L34 40H42Z" fill="#ffffff" />
          <text x="50" y="78" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="13" fill="#38b2ac" letterSpacing="1">XLG</text>
        </svg>
      );
    }

    // 22. JD GAMING (JDG)
    if (key.includes('jdg') || key.includes('jdgaming')) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
          <polygon points="50,12 86,28 78,84 50,94 22,84 14,28" fill="#1a0c12" stroke="#d81e28" strokeWidth="4" />
          <path d="M30 38L42 22L46 36H54L58 22L70 38L62 46H38L30 38Z" fill="#d81e28" />
          <text x="50" y="68" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="20" fill="#ffffff" letterSpacing="-0.5">JDG</text>
        </svg>
      );
    }

    // 23. 100 THIEVES (100T)
    if (key.includes('100t') || key.includes('thieves') || key.includes('100thieves')) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
          <path d="M26 28L34 22V78H24V34L18 38V30L26 28Z" fill="#de1f26" />
          <circle cx="50" cy="52" r="18" fill="none" stroke="#ffffff" strokeWidth="7" />
          <circle cx="76" cy="52" r="18" fill="none" stroke="#de1f26" strokeWidth="7" />
          <line x1="28" y1="84" x2="78" y2="20" stroke="#de1f26" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    }

    // 24. MIBR (Made in Brazil)
    if (key.includes('mibr')) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
          <rect x="14" y="26" width="72" height="48" rx="8" fill="#0c1830" stroke="#009c3b" strokeWidth="4" />
          <text x="50" y="58" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="22" fill="#ffffff" letterSpacing="-0.5">mibr</text>
          <circle cx="50" cy="67" r="3" fill="#ffdf00" />
        </svg>
      );
    }

    // 25. KARMINE CORP (KC)
    if (key.includes('karmine') || key.includes('kc')) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
          <polygon points="50,12 88,34 76,84 50,94 24,84 12,34" fill="#081b40" stroke="#00c8ff" strokeWidth="4" />
          <path d="M32 32V68M32 50L48 32M32 50L48 68" stroke="#00c8ff" strokeWidth="6" strokeLinecap="round" />
          <path d="M68 34C58 34 52 42 52 50C52 58 58 66 68 66" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" fill="none" />
        </svg>
      );
    }

    // 26. BILIBILI GAMING (BLG)
    if (key.includes('bilibili') || key.includes('blg')) {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
          <rect x="18" y="24" width="64" height="48" rx="10" fill="#08283d" stroke="#00a6e3" strokeWidth="4" />
          <line x1="36" y1="14" x2="44" y2="24" stroke="#00a6e3" strokeWidth="4" strokeLinecap="round" />
          <line x1="64" y1="14" x2="56" y2="24" stroke="#00a6e3" strokeWidth="4" strokeLinecap="round" />
          <text x="50" y="56" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="20" fill="#00a6e3" letterSpacing="-0.5">BLG</text>
          <circle cx="70" cy="36" r="3" fill="#f25d8e" />
        </svg>
      );
    }

    // 27. NONGSHIM REDFORCE (NS)
    if (key.includes('nongshim') || key.includes('redforce') || key === 'ns') {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
          <polygon points="50,14 86,30 78,82 50,92 22,82 14,30" fill="#1f0a0d" stroke="#de2027" strokeWidth="4" />
          <path d="M32 38L42 38L58 64V38H68V72H58L42 46V72H32V38Z" fill="#de2027" />
        </svg>
      );
    }

    // Generic fallback shield
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
        <polygon
          points="50,14 84,30 76,78 50,90 24,78 16,30"
          fill="#141e2e"
          stroke={color}
          strokeWidth="5"
        />
        <text
          x="50"
          y="62"
          textAnchor="middle"
          fontFamily="sans-serif"
          fontWeight="900"
          fontSize="28"
          fill="#ffffff"
        >
          {(shortName || teamName).slice(0, 3).toUpperCase()}
        </text>
      </svg>
    );
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-lg overflow-hidden ${dimClass} ${className}`}
      style={{
        ...customStyle,
        boxShadow: showGlow ? `0 0 16px ${color}40` : undefined,
      }}
      title={teamName}
    >
      {effectiveUrl && !imgError ? (
        <img
          src={effectiveUrl}
          alt={`${teamName} logo`}
          className="w-full h-full object-contain p-0.5 select-none transition-transform duration-200 hover:scale-105"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      ) : (
        renderSvgCrest()
      )}
    </div>
  );
};
