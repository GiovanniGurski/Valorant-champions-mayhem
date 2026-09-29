import React, { useState } from 'react';
import { Crosshair, Cloud, Eye, Shield, Sparkles } from 'lucide-react';
import { Role } from '../types';
import { ROLE_DISPLAY_ICONS, ROLE_COLORS } from '../data/roleIcons';

interface RoleEmblemProps {
  role: Role;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showBackground?: boolean;
  glow?: boolean;
  className?: string;
}

const FALLBACK_ICONS: Record<Role, React.ReactNode> = {
  Duelist: <Crosshair className="w-full h-full" />,
  Controller: <Cloud className="w-full h-full" />,
  Initiator: <Eye className="w-full h-full" />,
  Sentinel: <Shield className="w-full h-full" />,
  Flex: <Sparkles className="w-full h-full" />,
};

const SIZE_MAP = {
  xs: { box: 'w-5 h-5 p-0.5', icon: 'w-3.5 h-3.5' },
  sm: { box: 'w-7 h-7 p-1', icon: 'w-4 h-4' },
  md: { box: 'w-10 h-10 p-2', icon: 'w-6 h-6' },
  lg: { box: 'w-12 h-12 p-2.5', icon: 'w-7 h-7' },
  xl: { box: 'w-16 h-16 p-3.5', icon: 'w-9 h-9' },
};

export const RoleEmblem: React.FC<RoleEmblemProps> = ({
  role,
  size = 'md',
  showBackground = true,
  glow = false,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const roleColor = ROLE_COLORS[role] || '#ff4655';
  const roleIconUrl = ROLE_DISPLAY_ICONS[role];
  const sizeConfig = SIZE_MAP[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-xl transition-all duration-200 shrink-0 ${sizeConfig.box} ${className}`}
      style={{
        backgroundColor: showBackground ? `${roleColor}18` : 'transparent',
        border: showBackground ? `1px solid ${roleColor}40` : 'none',
        boxShadow: glow ? `0 0 16px ${roleColor}40` : undefined,
      }}
      title={role}
    >
      {roleIconUrl && !imgError ? (
        <img
          src={roleIconUrl}
          alt={role}
          className={`${sizeConfig.icon} object-contain filter drop-shadow`}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          style={{
            filter: `drop-shadow(0 0 4px ${roleColor}80)`,
          }}
        />
      ) : (
        <div
          className={`${sizeConfig.icon} flex items-center justify-center`}
          style={{ color: roleColor }}
        >
          {FALLBACK_ICONS[role]}
        </div>
      )}
    </div>
  );
};
