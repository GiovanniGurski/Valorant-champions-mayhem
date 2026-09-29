import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { ValorantDraftBoard } from './components/ValorantDraftBoard';
import { PlayerModal } from './components/PlayerModal';
import { TournamentSimulation } from './components/TournamentSimulation';
import { TriviaMode } from './components/TriviaMode';
import { ValorantGridMode } from './components/ValorantGridMode';
import { TrophyRoomModal } from './components/TrophyRoomModal';
import { RulesModal } from './components/RulesModal';
import { OpponentBansModal } from './components/OpponentBansModal';
import { Lineup, Role, Player, Team, Difficulty, CampaignHistory } from './types';
import { TEAMS_DATABASE } from './data/teamsAndPlayers';
import { assignTraitsToTeam } from './data/traits';
import { rollOpponentBans, isPlayerBanned } from './utils/bans';
import { playLockSound, playSelectSound } from './utils/audio';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'draft' | 'grid' | 'trivia' | 'history'>('draft');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [lineup, setLineup] = useState<Lineup>({
    Duelist: null,
    Controller: null,
    Initiator: null,
    Sentinel: null,
    Flex: null,
  });

  const [availableTeams, setAvailableTeams] = useState<Team[]>([]);
  const [rerollsLeft, setRerollsLeft] = useState<number>(3);
  const [isTournamentActive, setIsTournamentActive] = useState<boolean>(false);
  const [inspectedPlayer, setInspectedPlayer] = useState<Player | null>(null);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [campaignHistory, setCampaignHistory] = useState<CampaignHistory[]>([]);

  // Opponent Ban System (Normal: 3 bans, Hard/Master: 6 bans)
  const [bannedPlayers, setBannedPlayers] = useState<Player[]>([]);
  const [showBansModal, setShowBansModal] = useState<boolean>(false);

  // Load campaign history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('vct_mayhem_campaigns');
      if (saved) {
        setCampaignHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load campaigns history', e);
    }
  }, []);

  const drawThreeTeams = useCallback((excludeIds: string[] = []) => {
    const availablePool = TEAMS_DATABASE.filter(t => !excludeIds.includes(t.id));
    const pool = availablePool.length >= 3 ? availablePool : TEAMS_DATABASE;

    // Shuffle pool and roll traits for the rosters
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const withTraits = shuffled.slice(0, 3).map(team => assignTraitsToTeam(team));
    setAvailableTeams(withTraits);
  }, []);

  // Initialize a new draft run with rerolls and opponent bans
  const initializeDraftRun = useCallback((targetDifficulty: Difficulty, openBansNotification: boolean = true) => {
    setLineup({
      Duelist: null,
      Controller: null,
      Initiator: null,
      Sentinel: null,
      Flex: null,
    });
    setIsTournamentActive(false);

    if (targetDifficulty === 'normal') setRerollsLeft(3);
    else if (targetDifficulty === 'hard') setRerollsLeft(2);
    else if (targetDifficulty === 'master') setRerollsLeft(1);

    const bans = rollOpponentBans(targetDifficulty);
    setBannedPlayers(bans);
    if (bans.length > 0 && openBansNotification) {
      setShowBansModal(true);
    }

    drawThreeTeams([]);
  }, [drawThreeTeams]);

  // Initial draw & initial bans on app mount
  useEffect(() => {
    initializeDraftRun('normal', true);
  }, [initializeDraftRun]);

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    initializeDraftRun(newDifficulty, true);
  };

  const handleReroll = () => {
    if (rerollsLeft <= 0) return;
    setRerollsLeft(prev => prev - 1);
    const currentIds = availableTeams.map(t => t.id);
    drawThreeTeams(currentIds);
  };

  // Assign player to a specific role in the lineup
  const handleAssignRole = (player: Player, targetRole: Role) => {
    if (isPlayerBanned(player, bannedPlayers)) {
      setWarningMessage(`🚫 ${player.ign} foi banido pelo adversário nesta campanha!`);
      setTimeout(() => setWarningMessage(null), 3000);
      return;
    }

    // Check if player is already somewhere in lineup
    const existingEntry = Object.entries(lineup).find(([_, p]) => p?.id === player.id);
    const updatedLineup = { ...lineup };

    if (existingEntry) {
      updatedLineup[existingEntry[0] as Role] = null;
    }

    updatedLineup[targetRole] = player;
    setLineup(updatedLineup);
    playLockSound();
    setWarningMessage(null);

    // Rule: Only 1 player can be chosen from the 3 teams.
    // Upon drafting, immediately roll 3 fresh teams for the next pick!
    const currentIds = availableTeams.map(t => t.id);
    drawThreeTeams(currentIds);
  };

  // Smart selection when player chip is clicked from team card
  const handleSelectPlayerFromCard = (player: Player) => {
    if (isPlayerBanned(player, bannedPlayers)) {
      setWarningMessage(`🚫 ${player.ign} foi banido pelo adversário nesta campanha!`);
      setTimeout(() => setWarningMessage(null), 3000);
      return;
    }

    // Check if player is already drafted
    const isAlreadyDrafted = Object.values(lineup).some(p => p?.id === player.id);
    if (isAlreadyDrafted) {
      setWarningMessage(`${player.ign} já foi escalado em sua equipe.`);
      setTimeout(() => setWarningMessage(null), 3000);
      return;
    }

    // 1. Can we place in primary role?
    if (!lineup[player.primaryRole]) {
      handleAssignRole(player, player.primaryRole);
      return;
    }

    // 2. Can we place in Flex?
    if (!lineup.Flex) {
      handleAssignRole(player, 'Flex');
      return;
    }

    // 3. Can we place in secondary roles?
    for (const secRole of player.secondaryRoles) {
      if (!lineup[secRole]) {
        handleAssignRole(player, secRole);
        return;
      }
    }

    // If none are free
    setWarningMessage(
      `A função ${player.primaryRole} e a vaga Flex já estão ocupadas. Remova um jogador para abrir vaga.`
    );
    setTimeout(() => setWarningMessage(null), 3500);
  };

  const handleRemovePlayer = (role: Role) => {
    setLineup(prev => ({ ...prev, [role]: null }));
  };

  const handleClearLineup = () => {
    initializeDraftRun(difficulty, false);
  };

  const handleStartTournament = () => {
    const isComplete = Object.values(lineup).every(p => p !== null);
    if (!isComplete) return;
    setIsTournamentActive(true);
  };

  const handleResetTournament = () => {
    initializeDraftRun(difficulty, true);
  };

  const handleSaveCampaign = (record: CampaignHistory) => {
    try {
      const updated = [record, ...campaignHistory];
      setCampaignHistory(updated);
      localStorage.setItem('vct_mayhem_campaigns', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save campaign', e);
    }
  };

  const handleClearHistory = () => {
    setCampaignHistory([]);
    localStorage.removeItem('vct_mayhem_campaigns');
  };

  const championshipsCount = campaignHistory.filter(c => c.wonChampionship).length;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-[#ff4655] selection:text-white relative overflow-x-hidden vct-ambient-grid">
      {/* Background Ambient Arena Glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="fixed top-1/2 right-10 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={tab => {
          setCurrentTab(tab);
          if (tab !== 'draft') {
            setIsTournamentActive(false);
          }
        }}
        difficulty={difficulty}
        onDifficultyChange={handleDifficultyChange}
        onOpenHelp={() => setShowRulesModal(true)}
        trophiesCount={championshipsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 z-10">
        {currentTab === 'draft' && (
          <>
            {!isTournamentActive ? (
              <ValorantDraftBoard
                availableTeams={availableTeams}
                lineup={lineup}
                rerollsLeft={rerollsLeft}
                bannedPlayers={bannedPlayers}
                onOpenBansModal={() => setShowBansModal(true)}
                onReroll={handleReroll}
                onSelectPlayer={handleSelectPlayerFromCard}
                onInspectPlayer={setInspectedPlayer}
                onRemovePlayer={handleRemovePlayer}
                onClearLineup={handleClearLineup}
                onStartTournament={handleStartTournament}
                warningMessage={warningMessage}
              />
            ) : (
              <TournamentSimulation
                lineup={lineup}
                difficulty={difficulty}
                onResetTournament={handleResetTournament}
                onSaveCampaign={handleSaveCampaign}
              />
            )}
          </>
        )}

        {currentTab === 'grid' && <ValorantGridMode />}

        {currentTab === 'trivia' && <TriviaMode />}

        {currentTab === 'history' && (
          <TrophyRoomModal
            history={campaignHistory}
            onClearHistory={handleClearHistory}
            onClose={() => setCurrentTab('draft')}
          />
        )}
      </main>

      {/* Opponent Bans Modal */}
      {showBansModal && (
        <OpponentBansModal
          bannedPlayers={bannedPlayers}
          difficulty={difficulty}
          onClose={() => setShowBansModal(false)}
        />
      )}

      {/* Player Stats Inspector Modal */}
      <PlayerModal
        player={inspectedPlayer}
        lineup={lineup}
        onClose={() => setInspectedPlayer(null)}
        onAssignToRole={handleAssignRole}
      />

      {/* Rules Guide Modal */}
      {showRulesModal && <RulesModal onClose={() => setShowRulesModal(false)} />}

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#070b12]/80 backdrop-blur-xl py-4 text-center text-xs font-mono-vct text-slate-400 z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff4655]" />
            VALORANT Champions Mayhem • Inspirado no LoLdle Mayhem
          </span>
          <span className="text-slate-500">Elencos oficiais do VCT Champions 2022 a 2026</span>
        </div>
      </footer>
    </div>
  );
}
