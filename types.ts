
export type PrimaryKnowledge = 'Combate cuerpo a cuerpo' | 'Conocimiento de la magia' | 'Fuego lejano';

export interface SocialSkills {
  Carisma: number;
  Inteligencia: number;
  Romanticismo: number;
  Comedia: number;
  Debate: number;
  Persuasión: number;
}

export interface SpecialSkills {
  [key: string]: number;
}

export interface SinStats {
  Soberbia: number;
  Gula: number;
  Avaricia: number;
  Lujuria: number;
  Ira: number;
  Envidia: number;
  Pereza: number;
}

export interface Character {
  name: string;
  story: string;
  avatar: string; // Can be an ID like 'avatar_1' or a base64 data URI
  isOfficialAvatar: boolean;
  socialSkills: SocialSkills;
  primaryKnowledge: PrimaryKnowledge | null;
  specialSkills: SpecialSkills;
  sinStats?: SinStats;
}

export type Step = 'IDENTITY' | 'AVATAR' | 'SOCIAL_STATS' | 'PRIMARY_KNOWLEDGE' | 'SPECIAL_STATS' | 'NECRO_NOTE' | 'SUMMARY';
