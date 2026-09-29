import React, { useState } from 'react';
import { Player } from '../types';
import { AGENT_ICONS } from '../data/agentIcons';

interface PlayerAvatarProps {
  player: Player;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showAgentBadge?: boolean;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  player,
  size = 'md',
  showAgentBadge = false,
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-7 h-7 sm:w-8 sm:h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
  };

  const agentIconUrl = player.signatureAgent ? AGENT_ICONS[player.signatureAgent] : null;

  return (
    <div className="relative inline-block shrink-0">
      <div
        className={`${sizeClasses[size]} rounded-xl overflow-hidden bg-gradient-to-br from-[#1b2636] to-[#0c131d] border border-[#2b3d56] flex items-center justify-center font-vct font-bold text-[#e2b714] shadow-md relative group`}
      >
        {agentIconUrl && !imgError ? (
          <img
            src={agentIconUrl}
            alt={player.signatureAgent}
            className="w-full h-full object-cover p-0.5 filter drop-shadow hover:scale-105 transition-transform"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="tracking-tighter">
            {player.ign.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {showAgentBadge && player.signatureAgent && (
        <span
          title={player.signatureAgent}
          className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-black/90 border border-white/20 text-[8px] font-mono-vct text-slate-300 shadow"
        >
          {player.signatureAgent.slice(0, 3)}
        </span>
      )}
    </div>
  );
};
