
import React, { useState, useEffect, useRef } from 'react';
import { 
  Character, Step, PrimaryKnowledge, SocialSkills, SpecialSkills, SinStats 
} from './types';
import { 
  SOCIAL_SKILLS_LIST, COMBAT_SKILLS, MAGIC_SKILLS, RANGED_SKILLS, SIN_SKILLS, AVATARS, DRIVE_GALLERY_URL 
} from './constants';
import { RadarChartDisplay } from './components/RadarChartDisplay';
import { StatSlider } from './components/StatSlider';
import { 
  Download, Upload, ChevronRight, ChevronLeft, ShieldCheck, 
  Sword, Sparkles, Target, Terminal, RefreshCcw, Skull, User, ExternalLink, CheckCircle2, AlertCircle,
  Image as ImageIcon
} from 'lucide-react';

const INITIAL_CHARACTER: Character = {
  name: '',
  story: '',
  avatar: '',
  isOfficialAvatar: false,
  socialSkills: {
    Carisma: 0,
    Inteligencia: 0,
    Romanticismo: 0,
    Comedia: 0,
    Debate: 0,
    Persuasión: 0
  },
  primaryKnowledge: null,
  specialSkills: {},
  sinStats: {
    Soberbia: 0,
    Gula: 0,
    Avaricia: 0,
    Lujuria: 0,
    Ira: 0,
    Envidia: 0,
    Pereza: 0
  }
};

const STEPS: Step[] = ['IDENTITY', 'AVATAR', 'SOCIAL_STATS', 'PRIMARY_KNOWLEDGE', 'SPECIAL_STATS', 'NECRO_NOTE', 'SUMMARY'];

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('IDENTITY');
  const [char, setChar] = useState<Character>(INITIAL_CHARACTER);
  const [devMode, setDevMode] = useState(false);
  const [uPressCount, setUPressCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'u') {
        setUPressCount(prev => prev + 1);
      } else {
        setUPressCount(0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (uPressCount >= 3) {
      setDevMode(true);
      setUPressCount(0);
      alert("Modo Desarrollador Activado");
    }
  }, [uPressCount]);

  const updateChar = (updates: Partial<Character>) => {
    setChar(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    const idx = STEPS.indexOf(currentStep);
    if (idx < STEPS.length - 1) {
      const nextS = STEPS[idx + 1];
      if (nextS === 'NECRO_NOTE' && char.primaryKnowledge !== 'Conocimiento de la magia') {
        setCurrentStep('SUMMARY');
      } else {
        setCurrentStep(nextS);
      }
    }
  };

  const prevStep = () => {
    const idx = STEPS.indexOf(currentStep);
    if (idx > 0) {
      const prevS = STEPS[idx - 1];
      if (currentStep === 'SUMMARY' && char.primaryKnowledge !== 'Conocimiento de la magia') {
        setCurrentStep('SPECIAL_STATS');
      } else {
        setCurrentStep(prevS);
      }
    }
  };

  const exportCharacter = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(char, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${char.name || 'arcadia_character'}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict verification logic: must match the official filename pattern
    const officialPattern = /^avatar_\d+\.jpg$/i;
    const isOfficial = officialPattern.test(file.name);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      updateChar({ 
        avatar: base64,
        isOfficialAvatar: isOfficial
      });
    };
    reader.readAsDataURL(file);
  };

  const importCharacterJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setChar(json);
        setCurrentStep('SUMMARY');
      } catch (err) {
        alert("Error al importar el archivo.");
      }
    };
    reader.readAsText(file);
  };

  const totalSocialPoints = (Object.values(char.socialSkills) as number[]).reduce((a, b) => a + b, 0);
  const totalSpecialPoints = (Object.values(char.specialSkills) as number[]).reduce((a, b) => a + b, 0);

  const getPointsLimit = () => {
    if (char.primaryKnowledge === 'Conocimiento de la magia') return 45;
    return 40;
  };

  const canContinue = () => {
    if (currentStep === 'IDENTITY') return char.name.length > 2 && char.story.length > 20;
    if (currentStep === 'AVATAR') return !!char.avatar;
    if (currentStep === 'SOCIAL_STATS') return totalSocialPoints === 40;
    if (currentStep === 'PRIMARY_KNOWLEDGE') return !!char.primaryKnowledge;
    if (currentStep === 'SPECIAL_STATS') return totalSpecialPoints === getPointsLimit();
    return true;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'IDENTITY':
        return (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-3xl medieval-font text-[#c9a962] mb-2">Identidad</h2>
            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#2a2a2a]">
              <label className="block text-sm font-semibold mb-2 text-[#b0b0b0]">Nombre del Personaje</label>
              <input
                type="text"
                placeholder="Ej: Sigurd, Elowen, Alaric..."
                value={char.name}
                onChange={(e) => updateChar({ name: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 text-lg focus:border-[#c9a962] outline-none transition-all text-[#e8e8e8]"
              />
              <ul className="mt-3 text-[10px] text-[#b0b0b0] space-y-1 opacity-70">
                <li>• Recomendado: Nombres de resonancia medieval o nórdica.</li>
                <li>• No utilices nombres modernos o jocosos.</li>
              </ul>
            </div>
            <div className="bg-[#1a1a1a] p-6 rounded-xl border border-[#2a2a2a]">
              <label className="block text-sm font-semibold mb-2 text-[#b0b0b0]">Historia Personal</label>
              <textarea
                placeholder="Narra brevemente tu origen..."
                value={char.story}
                onChange={(e) => updateChar({ story: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 h-40 focus:border-[#c9a962] outline-none transition-all resize-none text-[#e8e8e8] text-sm leading-relaxed italic"
              />
              <ul className="mt-3 text-[10px] text-[#b0b0b0] space-y-1 opacity-70">
                <li>• Establece tu lugar en el mundo sin ser el centro de él.</li>
                <li>• Evita poderes mágicos o reliquias en tu trasfondo inicial.</li>
              </ul>
            </div>
          </div>
        );

      case 'AVATAR':
        return (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-2">
              <h2 className="text-3xl medieval-font text-[#c9a962]">Vinculación de Rostro</h2>
              <p className="text-[#b0b0b0] text-sm max-w-lg mx-auto leading-relaxed">
                Project Arcadia requiere un retrato coherente con su mundo. Por favor, selecciona uno de la galería oficial e impórtalo.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* Left Side: External Link & Instructions */}
              <div className="flex flex-col gap-6">
                <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-[#2a2a2a] flex-1 flex flex-col justify-between group">
                  <div>
                    <h3 className="text-lg font-bold text-[#e8e8e8] mb-4 flex items-center gap-2">
                      <ExternalLink size={20} className="text-[#c9a962]" /> 1. Galería de Drive
                    </h3>
                    <p className="text-sm text-[#b0b0b0] mb-6 leading-relaxed">
                      Explora la biblioteca de retratos. Descarga el archivo que desees (ej: <span className="text-[#c9a962] font-mono">avatar_42.jpg</span>).
                    </p>
                  </div>
                  <a 
                    href={DRIVE_GALLERY_URL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full bg-[#c9a962] hover:bg-[#8b6f47] text-[#0a0a0a] font-bold py-5 rounded-2xl transition-all hover:shadow-[0_0_20px_rgba(201,169,98,0.3)] uppercase tracking-wider text-xs"
                  >
                    ABRIR BIBLIOTECA OFICIAL
                  </a>
                </div>

                <div className="bg-[#1a1a1a] p-6 rounded-3xl border border-[#2a2a2a] flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#e8e8e8] mb-4 flex items-center gap-2">
                      <Upload size={20} className="text-[#c9a962]" /> 2. Importar Retrato
                    </h3>
                    <p className="text-sm text-[#b0b0b0] mb-6 leading-relaxed">
                      Sube el archivo descargado. El sistema validará si es un activo oficial de la carpeta de Arcadia.
                    </p>
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-3 w-full border-2 border-dashed border-[#2a2a2a] hover:border-[#c9a962] text-[#b0b0b0] hover:text-[#e8e8e8] py-8 rounded-2xl transition-all group"
                  >
                    <ImageIcon size={40} className="group-hover:scale-110 transition-transform text-[#c9a962]/50" />
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Seleccionar archivo .jpg</span>
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleAvatarUpload} 
                    accept="image/jpeg" 
                    className="hidden" 
                  />
                </div>
              </div>

              {/* Right Side: Preview & Verification */}
              <div className="flex flex-col items-center justify-center bg-[#1a1a1a]/40 p-10 rounded-3xl border border-[#2a2a2a] shadow-inner">
                <div className="w-64 h-64 bg-[#0a0a0a] rounded-3xl border-4 border-[#2a2a2a] flex items-center justify-center overflow-hidden shadow-2xl relative mb-8 group transition-all hover:border-[#c9a962]/30">
                  {char.avatar ? (
                    <img src={char.avatar} alt="Vista previa" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  ) : (
                    <User size={100} className="text-[#1a1a1a]" />
                  )}
                  {char.avatar && char.isOfficialAvatar && (
                    <div className="absolute top-4 right-4 bg-[#4a8b4a] text-white p-2 rounded-full shadow-lg ring-4 ring-[#4a8b4a]/20">
                      <CheckCircle2 size={24} />
                    </div>
                  )}
                </div>

                {char.avatar ? (
                  <div className={`flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${
                    char.isOfficialAvatar ? 'bg-[#4a8b4a]/10 text-[#4a8b4a] border border-[#4a8b4a]/30' : 'bg-[#8b2c2c]/10 text-[#8b2c2c] border border-[#8b2c2c]/30'
                  }`}>
                    {char.isOfficialAvatar ? (
                      <><CheckCircle2 size={16} /> RECONOCIDO COMO OFICIAL</>
                    ) : (
                      <><AlertCircle size={16} /> RETRATO EXTERNO / PERSONAL</>
                    )}
                  </div>
                ) : (
                  <div className="text-[#b0b0b0] text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">A la espera de un retrato</div>
                )}
              </div>
            </div>
          </div>
        );

      case 'SOCIAL_STATS':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-3xl medieval-font text-[#c9a962]">Habilidades Sociales</h2>
              <div className={`text-xl medieval-font font-bold ${totalSocialPoints === 40 ? 'text-[#4a8b4a]' : 'text-[#c9a962]'}`}>
                Puntos: {totalSocialPoints} / 40
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-[#1a1a1a] p-8 rounded-2xl border border-[#2a2a2a]">
              <div>
                {SOCIAL_SKILLS_LIST.map((skill) => (
                  <StatSlider
                    key={skill}
                    label={skill}
                    value={char.socialSkills[skill as keyof SocialSkills]}
                    max={10}
                    onChange={(val) => {
                      const currentVal = char.socialSkills[skill as keyof SocialSkills];
                      const diff = val - currentVal;
                      if (totalSocialPoints + diff <= 40) {
                        updateChar({ socialSkills: { ...char.socialSkills, [skill]: val } });
                      }
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-center">
                <RadarChartDisplay 
                  color="#c9a962"
                  data={SOCIAL_SKILLS_LIST.map(s => ({
                    subject: s,
                    value: char.socialSkills[s as keyof SocialSkills],
                    fullMark: 10
                  }))} 
                />
              </div>
            </div>
          </div>
        );

      case 'PRIMARY_KNOWLEDGE':
        return (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-3xl medieval-font text-[#c9a962] mb-6">Conocimiento Primario</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'Combate cuerpo a cuerpo', icon: <Sword className="w-10 h-10 text-[#8b2c2c]" />, desc: 'Maestría en el filo y la fuerza bruta.' },
                { id: 'Conocimiento de la magia', icon: <Sparkles className="w-10 h-10 text-[#9b4a9b]" />, desc: 'Comprensión de los hilos de lo arcano.' },
                { id: 'Fuego lejano', icon: <Target className="w-10 h-10 text-[#4a8b4a]" />, desc: 'Precisión mortal a gran distancia.' }
              ].map((k) => (
                <button
                  key={k.id}
                  onClick={() => {
                    const skills = k.id === 'Combate cuerpo a cuerpo' ? COMBAT_SKILLS : k.id === 'Conocimiento de la magia' ? MAGIC_SKILLS : RANGED_SKILLS;
                    const initialSpecial: SpecialSkills = {};
                    skills.forEach(s => initialSpecial[s] = 0);
                    updateChar({ 
                      primaryKnowledge: k.id as PrimaryKnowledge,
                      specialSkills: initialSpecial
                    });
                  }}
                  className={`group p-8 rounded-2xl border-2 transition-all text-left flex flex-col h-full ${
                    char.primaryKnowledge === k.id 
                    ? 'border-[#c9a962] bg-[#c9a962]/10 shadow-[0_0_30px_rgba(201,169,98,0.1)]' 
                    : 'border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#c9a962]/50 hover:scale-[1.02]'
                  }`}
                >
                  <div className="mb-6 transition-transform group-hover:scale-110">{k.icon}</div>
                  <h3 className="text-xl medieval-font font-bold mb-3 group-hover:text-[#c9a962] transition-colors">{k.id}</h3>
                  <p className="text-sm text-[#b0b0b0] leading-relaxed italic">"{k.desc}"</p>
                </button>
              ))}
            </div>
          </div>
        );

      case 'SPECIAL_STATS':
        const skillsList = char.primaryKnowledge === 'Combate cuerpo a cuerpo' ? COMBAT_SKILLS : char.primaryKnowledge === 'Conocimiento de la magia' ? MAGIC_SKILLS : RANGED_SKILLS;
        const limit = getPointsLimit();
        const specColorHex = char.primaryKnowledge === 'Combate cuerpo a cuerpo' ? '#8b2c2c' : char.primaryKnowledge === 'Conocimiento de la magia' ? '#9b4a9b' : '#4a8b4a';
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-3xl medieval-font text-[#c9a962]">{char.primaryKnowledge}</h2>
              <div className={`text-xl medieval-font font-bold ${totalSpecialPoints === limit ? 'text-[#4a8b4a]' : 'text-[#c9a962]'}`}>
                Puntos: {totalSpecialPoints} / {limit}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start bg-[#1a1a1a] p-8 rounded-2xl border border-[#2a2a2a]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-x-6">
                {skillsList.map((skill) => (
                  <StatSlider
                    key={skill}
                    label={skill}
                    value={char.specialSkills[skill] || 0}
                    max={15}
                    onChange={(val) => {
                      const currentVal = char.specialSkills[skill] || 0;
                      const diff = val - currentVal;
                      if (totalSpecialPoints + diff <= limit) {
                        updateChar({ specialSkills: { ...char.specialSkills, [skill]: val } });
                      }
                    }}
                  />
                ))}
              </div>
              <div className="sticky top-10 flex flex-col justify-center items-center">
                <RadarChartDisplay 
                  color={specColorHex}
                  data={skillsList.map(s => ({
                    subject: s,
                    value: char.specialSkills[s] || 0,
                    fullMark: 15
                  }))} 
                />
              </div>
            </div>
          </div>
        );

      case 'NECRO_NOTE':
        return (
          <div className="max-w-3xl mx-auto space-y-8 py-8 animate-fadeIn text-center">
            <div className="inline-block p-6 bg-[#9b4a9b]/20 border border-[#9b4a9b] rounded-full mb-4 shadow-[0_0_40px_rgba(155,74,155,0.3)]">
              <Skull className="w-16 h-16 text-[#9b4a9b]" />
            </div>
            <h2 className="text-4xl medieval-font text-[#9b4a9b]">Advertencia de Corrupción</h2>
            <div className="bg-[#1a1a1a] p-10 rounded-3xl border-2 border-[#9b4a9b]/50 text-left space-y-6">
              <p className="text-xl text-[#e8e8e8] leading-relaxed">
                El necropoder es una hoja de doble filo que consume el alma de quien lo empuña.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
                {SIN_SKILLS.map(sin => (
                  <div key={sin} className="bg-[#0a0a0a] p-4 rounded-xl border border-[#2a2a2a] text-center font-bold text-[#9b4a9b] uppercase tracking-widest text-[10px]">{sin}</div>
                ))}
              </div>
              <p className="text-sm text-[#b0b0b0] italic leading-relaxed">
                Tu viaje comienza en pureza (0), pero cada acto de oscuridad te acercará al mutismo o a una existencia no-muerta.
              </p>
            </div>
          </div>
        );

      case 'SUMMARY':
        const specTxtColor = char.primaryKnowledge === 'Combate cuerpo a cuerpo' ? 'text-[#8b2c2c]' : char.primaryKnowledge === 'Conocimiento de la magia' ? 'text-[#9b4a9b]' : 'text-[#4a8b4a]';
        return (
          <div className="space-y-8 animate-fadeIn pb-12">
            <div className="text-center mb-8">
              <h2 className="text-4xl medieval-font text-[#c9a962]">Hoja de Personaje</h2>
              <p className="text-[#b0b0b0] text-sm uppercase tracking-[0.2em] font-bold">Inmortalizado en el Registro de Arcadia</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-3xl p-8 flex flex-col items-center text-center shadow-xl">
                <div className="w-48 h-48 bg-[#0a0a0a] rounded-3xl border-4 border-[#c9a962] flex items-center justify-center mb-6 shadow-2xl overflow-hidden relative group">
                  {char.avatar ? <img src={char.avatar} alt={char.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" /> : <User size={64}/>}
                  {char.isOfficialAvatar && (
                    <div className="absolute top-4 right-4 bg-[#4a8b4a] text-white p-2 rounded-full shadow-lg ring-4 ring-[#4a8b4a]/20">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                </div>
                <h3 className="text-3xl medieval-font text-[#c9a962] mb-2">{char.name}</h3>
                <div className={`px-4 py-1 rounded-full border border-current text-[10px] font-bold uppercase tracking-widest ${specTxtColor}`}>{char.primaryKnowledge}</div>
                <div className="mt-8 text-left w-full">
                  <h4 className="text-[10px] uppercase font-bold text-[#b0b0b0] tracking-widest mb-3 opacity-60">Biografía</h4>
                  <div className="p-4 bg-[#0a0a0a] rounded-2xl border border-[#2a2a2a] max-h-48 overflow-y-auto custom-scroll text-sm text-[#e8e8e8] italic leading-relaxed">"{char.story}"</div>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#1a1a1a] rounded-3xl p-8 border border-[#2a2a2a] shadow-lg">
                  <h4 className="text-lg medieval-font text-[#e8e8e8] mb-6 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-[#c9a962]" /> Aptitudes Sociales</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {Object.entries(char.socialSkills).map(([skill, val]) => (
                      <div key={skill} className="bg-[#0a0a0a] p-4 rounded-2xl border border-[#2a2a2a] flex flex-col transition-all hover:border-[#c9a962]/20">
                        <span className="text-[#b0b0b0] text-[9px] uppercase font-bold tracking-widest mb-1">{skill}</span>
                        <span className="text-[#c9a962] font-bold text-xl">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#1a1a1a] rounded-3xl p-8 border border-[#2a2a2a] shadow-lg">
                  <h4 className="text-lg medieval-font text-[#e8e8e8] mb-6 flex items-center gap-2"><Sparkles className="w-5 h-5 text-[#c9a962]" /> Maestría Especializada</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {Object.entries(char.specialSkills).map(([skill, val]) => (
                      <div key={skill} className="bg-[#0a0a0a] p-4 rounded-2xl border border-[#2a2a2a] flex flex-col transition-all hover:border-[#c9a962]/20">
                        <span className="text-[#b0b0b0] text-[9px] uppercase font-bold tracking-widest mb-1">{skill}</span>
                        <span className={`font-bold text-xl ${specTxtColor}`}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center py-12">
              <button onClick={exportCharacter} className="flex items-center gap-3 bg-[#c9a962] hover:bg-[#8b6f47] text-[#0a0a0a] font-bold py-6 px-16 rounded-full transition-all hover:scale-105 shadow-[0_10px_30px_rgba(201,169,98,0.2)] uppercase tracking-[0.2em] text-xs">
                <Download className="w-5 h-5" /> FORJAR FICHA JSON
              </button>
              <button onClick={() => { if (confirm("¿Deseas resetear tu progreso?")) { setChar(INITIAL_CHARACTER); setCurrentStep('IDENTITY'); } }} className="flex items-center gap-2 text-[#b0b0b0] hover:text-[#e8e8e8] transition-colors py-2 text-[10px] font-bold uppercase tracking-widest">
                <RefreshCcw className="w-4 h-4" /> EMPEZAR DE CERO
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e8e8]">
      {devMode && (
        <div className="fixed top-0 left-0 w-full bg-[#8b2c2c] text-white py-1 px-4 text-xs font-mono flex justify-between items-center z-[100] shadow-lg">
          <span className="flex items-center gap-2 uppercase tracking-widest font-bold"><Terminal size={12}/> Dev Mode</span>
          <div className="flex gap-4">
             <label className="cursor-pointer hover:underline flex items-center gap-1 font-bold">
              <Upload size={12}/> IMPORTAR
              <input type="file" accept=".json" onChange={importCharacterJSON} className="hidden" />
            </label>
            <button onClick={() => setDevMode(false)} className="hover:underline">CERRAR</button>
          </div>
        </div>
      )}
      <header className="py-12 text-center border-b border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-40">
        <h1 className="text-5xl md:text-7xl medieval-font tracking-tighter text-[#c9a962] drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">PROJECT ARCADIA</h1>
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="h-px w-12 bg-[#c9a962]/40"></div>
          <p className="text-[#8b6f47] text-[11px] tracking-[0.5em] uppercase font-bold">Forjador de Almas</p>
          <div className="h-px w-12 bg-[#c9a962]/40"></div>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between relative mb-24 px-8">
          <div className="absolute top-1/2 left-0 w-full h-px bg-[#1a1a1a] -translate-y-1/2 z-0"></div>
          {STEPS.map((step, idx) => {
            if (step === 'NECRO_NOTE' && char.primaryKnowledge !== 'Conocimiento de la magia') return null;
            const isCompleted = STEPS.indexOf(currentStep) > idx;
            const isActive = currentStep === step;
            return (
              <div key={step} className="relative z-10 flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                  isActive ? 'bg-[#c9a962] border-[#c9a962] scale-125 ring-[12px] ring-[#c9a962]/5 shadow-[0_0_20px_rgba(201,169,98,0.4)]' : 
                  isCompleted ? 'bg-[#4a8b4a] border-[#4a8b4a]' : 'bg-[#1a1a1a] border-[#2a2a2a]'
                }`}>
                  {isCompleted ? <ShieldCheck size={24} className="text-[#0a0a0a]" /> : <span className={`text-sm font-bold ${isActive ? 'text-[#0a0a0a]' : 'text-[#b0b0b0]'}`}>{idx + 1}</span>}
                </div>
                <span className={`absolute -bottom-10 text-[9px] font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-500 ${isActive ? 'text-[#c9a962] opacity-100' : 'text-[#b0b0b0] opacity-40'}`}>{step.replace('_', ' ')}</span>
              </div>
            );
          })}
        </div>
        <main className="min-h-[50vh] pb-32">{renderStep()}</main>
        <footer className="fixed bottom-0 left-0 w-full py-8 px-6 bg-[#0a0a0a]/90 backdrop-blur-2xl border-t border-[#1a1a1a] flex justify-center z-50">
          <div className="max-w-6xl w-full flex justify-between items-center">
            <button onClick={prevStep} disabled={currentStep === 'IDENTITY'} className="flex items-center gap-3 px-10 py-4 rounded-2xl border border-[#2a2a2a] text-[#b0b0b0] hover:text-[#e8e8e8] hover:border-[#8b6f47] disabled:opacity-0 transition-all font-bold uppercase text-[10px] tracking-[0.2em]">
              <ChevronLeft size={20} /> Retroceder
            </button>
            {currentStep !== 'SUMMARY' && (
              <button onClick={nextStep} disabled={!canContinue()} className={`flex items-center gap-3 px-14 py-5 rounded-2xl font-bold transition-all shadow-2xl text-[10px] uppercase tracking-[0.3em] ${canContinue() ? 'bg-[#c9a962] text-[#0a0a0a] hover:bg-[#8b6f47] scale-105 shadow-[#c9a962]/40' : 'bg-[#1a1a1a] text-[#b0b0b0] cursor-not-allowed border border-[#2a2a2a]'}`}>
                Progresar <ChevronRight size={20} />
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
