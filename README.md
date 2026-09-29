
DOCUMENTO DE VISÃO E ESPECIFICAÇÃO DE PROJETO: VALORANT MAYHEM

1. VISÃO GERAL E CONCEITO
O VALORANT Mayhem é um jogo web interativo e educativo para navegadores, focado na comunidade global do Valorant Champions Tour (VCT). Inspirado em títulos virais como LoLdle e Immaculate Grid, o projeto desafia o conhecimento dos fãs sobre histórico de transferências, posições táticas e atributos de jogadores (2022 a 2026).

2. STACK TECNOLÓGICO E INFRAESTRUTURA
- Frontend: React + Vite
- Estilização: Tailwind CSS + Lucide React
- Hospedagem & Deploy: GitHub + Vercel / Netlify
- Monetização: Google AdSense (Display Ads nas margens), Apoio Comunitário (Ko-fi/Patreon)
- Restrição Legal: Acesso 100% gratuito (respeito às diretrizes de IP da Riot Games).

3. MODOS DE JOGO E ARQUITETURA
3.1. Draft de Equipe & Prancheta Tática (Mapa Ascent)
- Sentinela: Ancoragem do Bomb Site B.
- Duelista: Avanço da Boca do Bomb A.
- Iniciador: Suporte do Jardim / Pátio A.
- Flex: Rotação do Meio.
- Controlador: Retaguarda da Base B.

3.2. Grids Cruzados (Times x Times - Exemplos)
- Eixo Global (Colunas: SEN, OpTic, LOUD | Linhas: NRG, C9, LEV) - Ex: Sacy, aspas, Marved
- Pacífico & Europa (Colunas: PRX, DRX, FNC | Linhas: GEN, TL, NAVI) - Ex: Chronicle, cNed
- Américas Shift (Colunas: SEN, C9, NRG | Linhas: G2, 100T, LEV) - Ex: bang, leaf, tex

3.3. Sistema de Traits (RNG Estratégico)
- Final Boss (Lendária - 2% a 3%): +25% ACS, dobra chance em clutch.
- Ice in the Veins (Épica - 6%): +20 em Clutch, imunidade a queda de moral por derrota.
- First Blood King (Rara - 10%): Aumenta taxa de vitória nos rounds de pistola.
- Inigualável Sinergia (Rara - 8%): Duplica bônus de química.
- Choke Artist (Negativa - 3%): -15 em Clutch nos rounds decisivos (11-11 ou 12-12).
- Tiltado (Negativa - 2%): -10% de rating após perder 3 rounds seguidos.

4. DIRETRIZES DE UI/UX (ESTILO ESPORTS)
- Atmosfera: Dark Mode Glassmorphism (Fundo slate-950 com luzes radiais difusas).
- Cartões: Bordas arredondadas (3xl), fundo translúcido (vidro fumê), desfoque e bordas muito finas.
- Tipografia: Títulos industriais condensados (Teko/Barlow), atributos técnicos em fontes monoespaçadas.

5. PROMPT MESTRE PARA AI STUDIO (GERAÇÃO DE CÓDIGO)
[Copie e cole o texto abaixo no seu gerador de código]

Atue como um Engenheiro Sênior de Front-end e UI/UX Designer especializado em aplicações web de e-sports de alta performance (estilo VLR.gg e HUDs modernas do VALORANT). 

Preciso que você reestruture e atualize o componente principal do meu projeto React (Vite + Tailwind CSS) focado no VALORANT Mayhem. Quero que a interface abandone qualquer aspeto genérico de IA e adote um design "Dark Mode Glassmorphism" altamente polido, limpo e profissional, inspirado em conceitos modernos de aplicativos de e-sports.

Diretrizes de design e código que você deve seguir obrigatoriamente:
1. Paleta de Cores: Fundos em tons profundos de ardósia escura (#090d16 / slate-950), combinados com detalhes subtis em vermelho crimson do Valorant (#ff4655) ou verde/dourado para destaques.
2. Cartões e Componentes: Substitua cantos retos por arredondamentos suaves (rounded-3xl), fundos translúcidos com efeito de desfoque (backdrop-blur-xl), bordas finas (border border-white/10) e sombras (shadow-2xl).
3. Iluminação e Profundidade: Adicione gradientes radiais suaves (glows) nos cantos dos cartões para imersão de arena.
4. Tipografia: Hierarquia visual forte, fontes monoespaçadas para estatísticas (Rating, Clutch).
5. Interatividade: Adicione transições suaves no hover (elevação de escala e brilho na borda).
