
import React from 'react';
import { 
  Sword, Shield, Wand2, Flame, Droplets, Mountain, Wind, Sun, Skull, HeartPulse, 
  Target, Zap, Crosshair, Bomb, BookOpen, User, Ghost, Scroll
} from 'lucide-react';

export const SOCIAL_SKILLS_LIST = [
  'Carisma', 'Inteligencia', 'Romanticismo', 'Comedia', 'Debate', 'Persuasión'
];

export const COMBAT_SKILLS = [
  'Fuerza', 'Destreza', 'Esgrima', 'Espadas', 'Dagas', 'Mandobles', 'Katanas'
];

export const MAGIC_SKILLS = [
  'Lectura de libros/lenguas antiguas', 'Uso de bastones y varitas', 'Fuego', 'Agua', 
  'Tierra', 'Viento', 'Luz', 'Necropoder', 'Acresismo', 'Sanación'
];

export const RANGED_SKILLS = [
  'Puntería', 'Agilidad', 'Arcos ligeros', 'Arcos pesados', 
  'Armas de fuego ligeras', 'Armas de fuego pesadas', 'Cañones y armas de fuego poderosas'
];

export const SIN_SKILLS = [
  'Soberbia', 'Gula', 'Avaricia', 'Lujuria', 'Ira', 'Envidia', 'Pereza'
];

// Reference to the official Arcadia drive gallery provided by user
export const DRIVE_GALLERY_URL = "https://drive.google.com/drive/folders/1IymCZY8_lNoCCWgUkZs6EXfvlC7jL4Uv?usp=drive_link"; 

export const OFFICIAL_AVATARS_COUNT = 100; // Increased range for verification

export const AVATARS = Array.from({ length: OFFICIAL_AVATARS_COUNT }, (_, i) => {
  const id = i + 1;
  return {
    id: `avatar_${id}`,
    fileName: `avatar_${id}.jpg`,
    name: `Retrato Oficial ${id}`,
    fallback: id % 3 === 0 ? <Sword size={32} /> : id % 3 === 1 ? <Wand2 size={32} /> : <Target size={32} />
  };
});
