'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Bolt, 
  ArrowRight, 
  RotateCcw, 
  ShoppingCart, 
  X, 
  Bot, 
  CircleCheck, 
  Star, 
  Info,
  Send,
  Zap,
  Gauge,
  Loader,
  MessageSquare,
  Trophy,
  ChevronDown
} from 'lucide-react';
import { useFirestore } from '@/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import type { SpeedRoastTemplate } from '@/lib/definitions';

// Database Paket MyRepublic Fokus 2026
const myRepublicPackages = [
    { 
        id: 'sahabat-75',
        name: "MyRepublic SAHABAT 75 Mbps", 
        price: "Rp 205.000", 
        maxSpeed: 20, 
        speedVal: 75, 
        bonus: "" 
    },
    { 
        id: 'neo-100',
        name: "MyRepublic NEO 100 Mbps", 
        price: "Rp 233.100", 
        maxSpeed: 45, 
        speedVal: 100, 
        bonus: "Bonus Upgrade speed up to 200 Mbps selama 1 tahun" 
    },
    { 
        id: 'velo-150',
        name: "MyRepublic VELO 150 Mbps", 
        price: "Rp 277.500", 
        maxSpeed: 9999, 
        speedVal: 150, 
        bonus: "Bonus Upgrade speed up to 300 Mbps selama 1 tahun" 
    }
];

const CITY_LIST = [
  "Aceh", "Aceh Besar", "Badung", "Bali", "Balikpapan", "Bandung", "Bandung Barat", "Bangli", "Banjar", "Banjarmasin", 
  "Banyuasin", "Banyumas", "Banyuwangi", "Barito Kuala", "Batam", "Batanghari", "Bekasi", "Bengkulu", "Bengkulu Tengah", 
  "Blitar", "Bogor", "Bojonegoro", "Boyolali", "Brebes", "Buleleng", "Ciamis", "Cianjur", "Cibubur", "Cilacap", "Cilegon", 
  "Cirebon", "Deli Serdang", "Demak", "Depok", "Garut", "Gianyar", "Gowa", "Gresik", "Indramayu", "Jakarta Barat", 
  "Jakarta Selatan", "Jambi", "Jember", "Jembrana", "Jepara", "Jombang", "Kampar", "Karanganyar", "Karangasem", "Karawang", 
  "Kebumen", "Kediri", "Kendal", "Klaten", "Klungkung", "Jakarta Pusat", "Jakarta Timur", "Jakarta Utara", "Kota Bandung", 
  "Kota Banjar", "Kota Banjarbaru", "Kota Batu", "Kota Bekasi", "Kota Binjai", "Kota Blitar", "Kota Bogor", "Kota Cimahi", 
  "Kota Cirebon", "Kota Kediri", "Kota Madiun", "Kota Magelang", "Kota Malang", "Kota Metro", "Kota Mojokerto", "Kota Pasuruan", 
  "Kota Pekalongan", "Kota Semarang", "Kota Sukabumi", "Kota Tangerang Selatan", "Kota Tegal", "Kuantan Singingi", "Kudus", 
  "Kuningan", "Lamongan", "Lampung", "Lampung Selatan", "Lampung Tengah", "Lampung Timur", "Lombok Barat", "Lombok Tengah", 
  "Madiun", "Magelang", "Majalengka", "Makassar", "Malang", "Manado", "Maros", "Mataram", "Medan", "Minahasa", "Mojokerto", 
  "Muaro Jambi", "Nganjuk", "Ngawi", "Ogan Ilir", "Padang", "Palangkaraya", "Palembang", "Pasuruan", "Pati", "Pekalongan", 
  "Pekanbaru", "Pemalang", "Pematang Siantar", "Pesawaran", "Ponorogo", "Pontianak", "Prabumulih", "Purbalingga", "Purwakarta", 
  "Purwokerto", "Purworejo", "Salatiga", "Samarinda", "Semarang", "Serang", "Sidoarjo", "Singkawang", "Sleman", "Sragen", 
  "Subang", "Sukabumi", "Sukoharjo", "Sumedang", "Surabaya", "Surakarta", "Tabanan", "Takalar", "Tangerang", "Tasikmalaya", 
  "Tebing Tinggi", "Tegal", "Temanggung", "Tuban", "Tulungagung", "Yogyakarta"
].sort();

type Screen = 'start' | 'game' | 'loading' | 'result';

export default function SpeedChallengePage() {
    const [screen, setScreen] = useState<Screen>('start');
    const [tapCount, setTapCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(5000);
    const [realSpeed, setRealSpeed] = useState(0.0);
    const [selectedCity, setSelectedCity] = useState('Jakarta Selatan');
    const [selectedConn, setSelectedConn] = useState('WiFi Provider Lain');
    const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [aiResult, setAiResult] = useState<{ roast: string; diagnosis: string; recommendedAction: string } | null>(null);
    const [loadingLogs, setLoadingLogs] = useState<string[]>([]);
    const [selectedPromos, setSelectedPromos] = useState<string[]>([]);
    const [roastTemplates, setRoastTemplates] = useState<SpeedRoastTemplate[]>([]);
    
    const speedRef = useRef(0.0);
    const tapCountRef = useRef(0);
    const cityRef = useRef('Jakarta Selatan');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<any[]>([]);
    const audioCtx = useRef<AudioContext | null>(null);
    const gameInterval = useRef<NodeJS.Timeout | null>(null);
    const speedTestInterval = useRef<NodeJS.Timeout | null>(null);
    const firestore = useFirestore();

    // Fetch roasting templates from Firestore
    useEffect(() => {
        async function fetchTemplates() {
            if (!firestore) return;
            try {
                const snapshot = await getDocs(collection(firestore, 'speedRoastTemplates'));
                const templates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SpeedRoastTemplate));
                setRoastTemplates(templates);
            } catch (e) {
                console.error("Failed to fetch roast templates:", e);
            }
        }
        fetchTemplates();
    }, [firestore]);

    // Particle System logic
    class Particle {
        x: number; y: number; size: number; speedX: number; speedY: number; color: string; alpha: number;
        constructor(x: number, y: number) {
            this.x = x; this.y = y; this.size = Math.random() * 6 + 2;
            this.speedX = Math.random() * 6 - 3; this.speedY = Math.random() * -6 - 1;
            this.color = Math.random() > 0.5 ? '#622599' : '#e21a83'; this.alpha = 1;
        }
        update() { this.x += this.speedX; this.y += this.speedY; this.alpha -= 0.02; }
        draw(ctx: CanvasRenderingContext2D) {
            ctx.save(); ctx.globalAlpha = this.alpha; ctx.fillStyle = this.color;
            ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        }
    }

    const handleParticles = useCallback(() => {
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext('2d'); if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = particles.current.length - 1; i >= 0; i--) {
            particles.current[i].update();
            particles.current[i].draw(ctx);
            if (particles.current[i].alpha <= 0) particles.current.splice(i, 1);
        }
        if (particles.current.length > 0) requestAnimationFrame(handleParticles);
    }, []);

    const playSound = (freq: number, duration: number, type: OscillatorType = "sine") => {
        try {
            if (!audioCtx.current) audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = audioCtx.current.createOscillator();
            const gain = audioCtx.current.createGain();
            osc.type = type; osc.frequency.setValueAtTime(freq, audioCtx.current.currentTime);
            gain.gain.setValueAtTime(0.1, audioCtx.current.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + duration);
            osc.connect(gain); gain.connect(audioCtx.current.destination);
            osc.start(); osc.stop(audioCtx.current.currentTime + duration);
        } catch(e) {}
    };

    const finishGame = useCallback(() => {
        setScreen('loading');
        setLoadingLogs(["> Memfinalisasi data latency..."]);
        
        const finalSpeed = speedRef.current;
        const currentCity = cityRef.current;
        const finalTaps = tapCountRef.current;

        setTimeout(() => setLoadingLogs(prev => [...prev, `> Menganalisis kecepatan ${finalSpeed} Mbps...`]), 600);
        setTimeout(() => setLoadingLogs(prev => [...prev, `> Menghitung rasio kompresi jaringan ${currentCity}...`]), 1200);
        setTimeout(() => {
            setLoadingLogs(prev => [...prev, "> Konsultasi dengan AI Engine (Firestore Mode)..."]);
            
            let category: 'siput' | 'kurakura' | 'kelinci' = 'siput';
            if (finalSpeed >= 15 && finalSpeed < 40) category = 'kurakura';
            else if (finalSpeed >= 40) category = 'kelinci';

            // Filter templates from Firestore state
            const pool = roastTemplates.filter(t => t.category === category);
            const selected = pool.length > 0 
                ? pool[Math.floor(Math.random() * pool.length)]
                : { roast: `Waduh! Internetmu di [CITY] cuma [SPEED] Mbps? Pantesan tadi [TAPS] tap roketmu sia-sia! Ganti ke MyRepublic sekarang!`, diagnosis: "Jaringan tidak stabil.", action: "Pindah ke MyRepublic." };

            const personalizedRoast = selected.roast
                .replace(/\[CITY\]/g, currentCity)
                .replace(/\[SPEED\]/g, finalSpeed.toString())
                .replace(/\[TAPS\]/g, finalTaps.toString());

            setAiResult({ roast: personalizedRoast, diagnosis: selected.diagnosis, recommendedAction: selected.action });
            setScreen('result');
        }, 1800);
    }, [roastTemplates]);

    const initiateGame = () => {
        setTapCount(0); tapCountRef.current = 0; setTimeLeft(5000); setRealSpeed(0.0); speedRef.current = 0.0;
        cityRef.current = selectedCity; setAiResult(null); setLoadingLogs([]); setSelectedPromos([]);
        particles.current = []; setScreen('game');

        const targetSpeed = Math.floor(Math.random() * 45) + 8;
        let currentSpeed = 0.0;
        
        setTimeout(() => {
            speedTestInterval.current = setInterval(() => {
                currentSpeed += (targetSpeed - currentSpeed) * 0.15 + (Math.random() * 2 - 1);
                if (currentSpeed < 0) currentSpeed = 0.1;
                const rounded = parseFloat(currentSpeed.toFixed(1));
                setRealSpeed(rounded); speedRef.current = rounded;
            }, 100);
        }, 1000);

        const intervalTime = 100;
        gameInterval.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= intervalTime) {
                    if (gameInterval.current) clearInterval(gameInterval.current);
                    if (speedTestInterval.current) clearInterval(speedTestInterval.current);
                    playSound(150, 0.4, "sawtooth");
                    finishGame();
                    return 0;
                }
                return prev - intervalTime;
            });
        }, intervalTime);
    };

    const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
        if (timeLeft <= 0) return;
        const newCount = tapCountRef.current + 1;
        setTapCount(newCount); tapCountRef.current = newCount;
        
        const canvas = canvasRef.current;
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            let x, y;
            if ('touches' in e && e.touches.length > 0) {
                x = e.touches[0].clientX - rect.left; y = e.touches[0].clientY - rect.top;
            } else {
                const mouseEvt = e as React.MouseEvent;
                x = mouseEvt.clientX - rect.left; y = mouseEvt.clientY - rect.top;
            }
            for (let i = 0; i < 8; i++) particles.current.push(new Particle(x, y));
        }
        playSound(300 + (newCount * 8), 0.1, "square");
        requestAnimationFrame(handleParticles);
    };

    useEffect(() => {
        if (screen === 'game') {
            const canvas = canvasRef.current;
            if (canvas) {
                canvas.width = canvas.parentElement?.clientWidth || 400;
                canvas.height = canvas.parentElement?.clientHeight || 200;
            }
        }
    }, [screen]);

    const recommendedPackage = myRepublicPackages.find(pkg => speedRef.current <= pkg.maxSpeed) || myRepublicPackages[myRepublicPackages.length - 1];
    const multiplier = (recommendedPackage.speedVal / (realSpeed || 1)).toFixed(1);

    const togglePromo = (promo: string) => {
        setSelectedPromos(prev => prev.includes(promo) ? prev.filter(p => p !== promo) : [...prev, promo]);
    };

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#080312] p-0 sm:p-4 transition-all duration-500 overflow-hidden font-body">
            {/* Desktop Frame Container */}
            <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#0e081b] border-x-0 border-y-0 sm:h-[95vh] sm:max-w-md sm:rounded-[3rem] sm:border-8 sm:border-slate-900 sm:shadow-[0_0_80px_rgba(98,37,153,0.3)] shadow-2xl">
                
                {/* Visual Accent - Top Bar Gradient */}
                <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-[#622599] via-[#e21a83] to-[#622599] z-50"></div>
                
                {/* Main Content Area */}
                <div className="flex h-full w-full flex-col p-6 sm:p-8 overflow-y-auto custom-scrollbar">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8 mt-2">
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#622599] to-[#e21a83] shadow-lg shadow-purple-500/20">
                                <Bolt className="h-5 w-5 text-white" />
                            </div>
                            <div className="leading-none">
                                <h3 className="text-sm font-black tracking-widest text-white">MYREPUBLIC</h3>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Speed Challenge</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[10px] font-bold text-[#e21a83]">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-ping"></span>
                            <span>AI LIVE DIAGNOSE</span>
                        </div>
                    </div>

                    {/* SCREEN: START */}
                    {screen === 'start' && (
                        <div className="flex flex-1 flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h1 className="text-center text-3xl font-black leading-tight tracking-tight text-white mb-2">
                                WiFi Rumah Sering <br />
                                <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">Lemot Kayak Siput? 🐌</span>
                            </h1>
                            <p className="mb-8 text-center text-xs font-medium text-gray-400">
                                Bantu Roket MyRepublic meluncur sembari AI memindai kecepatan internet Anda!
                            </p>

                            <div className="mb-8 space-y-4 rounded-3xl bg-white/5 border border-white/10 p-5 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <Zap className="h-3 w-3 text-[#e21a83]" />
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Pengaturan Penyelidikan</h4>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase text-gray-500 ml-1">KOTA ANDA</label>
                                        <select 
                                            value={selectedCity} 
                                            onChange={(e) => setSelectedCity(e.target.value)}
                                            className="w-full rounded-xl bg-slate-900 border border-white/10 p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#e21a83] transition-all"
                                        >
                                            {CITY_LIST.map(city => <option key={city} value={city}>{city}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase text-gray-500 ml-1">KONEKSI SAAT INI</label>
                                        <select 
                                            value={selectedConn} 
                                            onChange={(e) => setSelectedConn(e.target.value)}
                                            className="w-full rounded-xl bg-slate-900 border border-white/10 p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#e21a83] transition-all"
                                        >
                                            <option value="WiFi Provider Lain">WiFi Provider Lain</option>
                                            <option value="Paket Data Seluler">Paket Data Seluler</option>
                                            <option value="RT RW Net">RT RW Net</option>
                                            <option value="Internet Tetangga">Internet Tetangga 🤫</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="relative mb-10 flex h-48 items-center justify-center rounded-3xl bg-gradient-to-b from-purple-500/10 to-transparent border border-white/5 overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(226,26,131,0.15)_0%,transparent_70%)] animate-pulse"></div>
                                <div className="text-8xl animate-bounce drop-shadow-[0_20px_25px_rgba(226,26,131,0.4)]">🚀</div>
                            </div>

                            <button 
                                onClick={initiateGame}
                                className="group relative mt-auto flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-[#622599] to-[#e21a83] p-5 text-sm font-black text-white shadow-[0_15px_30px_rgba(226,26,131,0.3)] transition-all hover:scale-[1.02] active:scale-95"
                            >
                                MULAI TANTANGAN
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    )}

                    {/* SCREEN: GAME */}
                    {screen === 'game' && (
                        <div className="flex flex-1 flex-col animate-in fade-in duration-300">
                            <div className="text-center mb-6">
                                <h2 className="flex items-center justify-center gap-2 text-xl font-black text-white uppercase tracking-tighter">
                                    <Zap className="h-5 w-5 text-yellow-400 animate-pulse" /> KETUK SECEPAT NYA!
                                </h2>
                                <p className="text-[10px] text-gray-400 mt-1">Pompa roket sembari AI mendeteksi WiFi Anda...</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                                    <span className="text-[9px] font-black uppercase tracking-wider text-gray-500 mb-1">Energi Roket</span>
                                    <div className="text-4xl font-black text-yellow-400">{tapCount}</div>
                                </div>
                                <div className="relative flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md overflow-hidden">
                                    <div className="absolute top-1 right-2 rounded bg-red-500/20 px-1.5 py-0.5 text-[8px] font-black uppercase text-red-400 animate-pulse">Scanning</div>
                                    <span className="text-[9px] font-black uppercase tracking-wider text-gray-500 mb-1">Speed Internet</span>
                                    <div className="flex items-baseline gap-0.5 text-4xl font-black text-[#e21a83]">
                                        {realSpeed.toFixed(1)}<span className="text-xs font-medium text-gray-400 ml-1">Mbps</span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative flex-1 mb-6">
                                <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none rounded-3xl h-full w-full"></canvas>
                                <div 
                                    onMouseDown={handleTap}
                                    onTouchStart={(e) => { e.preventDefault(); handleTap(e); }}
                                    className="relative flex h-full min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-[2.5rem] border-4 border-dashed border-[#e21a83]/30 bg-gradient-to-b from-purple-900/20 to-slate-950/40 p-10 transition-all active:scale-[0.98] select-none group"
                                >
                                    <div className="mb-4 text-8xl transition-transform duration-75 group-active:scale-110 group-active:-translate-y-4">🚀</div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 animate-pulse">TAP DISINI!</h3>
                                    <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-widest">Multi-finger Power!</p>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 mb-2">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase mb-1.5 tracking-wider">
                                    <span className="text-gray-400">Waktu Tersisa</span>
                                    <span className="text-[#e21a83]">{(timeLeft / 1000).toFixed(1)} Detik</span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                                    <div className="h-full bg-gradient-to-r from-[#622599] to-[#e21a83] transition-all duration-100" style={{ width: `${(timeLeft / 5000) * 100}%` }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SCREEN: LOADING */}
                    {screen === 'loading' && (
                        <div className="flex flex-1 flex-col items-center justify-center animate-in fade-in duration-300 py-10">
                            <div className="relative mb-8 h-32 w-32">
                                <div className="absolute inset-0 rounded-full border-8 border-[#622599]/20"></div>
                                <div className="absolute inset-0 rounded-full border-8 border-t-[#e21a83] animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Bot className="h-12 w-12 text-[#e21a83] animate-bounce" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-black text-white mb-2">Konsultasi AI...</h2>
                            <p className="text-center text-xs text-gray-400 max-w-[200px] mb-8">Gemini AI sedang mendiagnosis jaringan internet rumah Anda.</p>
                            
                            <div className="w-full max-w-[280px] rounded-2xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-md">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-500 mb-3 tracking-widest">
                                    <Zap className="h-3 w-3 text-yellow-400" /> PROSES KOMPUTASI
                                </div>
                                <div className="space-y-1.5 font-mono text-[10px] text-gray-500">
                                    {loadingLogs.map((log, i) => <div key={i}>{log}</div>)}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SCREEN: RESULT */}
                    {screen === 'result' && aiResult && (
                        <div className="flex flex-1 flex-col animate-in zoom-in-95 duration-500">
                            <div className="text-center mb-8">
                                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 border border-green-500/30 text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                                    <CircleCheck className="h-8 w-8" />
                                </div>
                                <h1 className="text-3xl font-black text-white tracking-tight">Analisis AI Selesai!</h1>
                                <p className="text-[11px] text-gray-400 mt-1 uppercase font-bold tracking-wider">Laporan Diagnosis MyRepublic</p>
                            </div>

                            {/* Stat Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex flex-col items-center rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-md text-center">
                                    <span className="text-[9px] font-black uppercase text-gray-500 mb-2 tracking-widest">KECEPATAN ANDA</span>
                                    <div className="text-3xl font-black text-[#e21a83] flex items-baseline gap-1">
                                        {speedRef.current}<span className="text-xs font-normal text-gray-400">Mbps</span>
                                    </div>
                                    <div className={`mt-3 rounded-lg px-2 py-1 text-[8px] font-black uppercase tracking-wider ${speedRef.current < 15 ? 'bg-red-500/10 text-red-400' : speedRef.current < 40 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'}`}>
                                        {speedRef.current < 15 ? 'KATEGORI SIPUT 🐌' : speedRef.current < 40 ? 'KATEGORI KURA-KURA 🐢' : 'KATEGORI KELINCI 🐰'}
                                    </div>
                                </div>
                                <div className="flex flex-col items-center rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-md text-center">
                                    <span className="text-[9px] font-black uppercase text-gray-500 mb-2 tracking-widest">KETUKAN JARI</span>
                                    <div className="text-3xl font-black text-yellow-400 flex items-baseline gap-1">
                                        {tapCountRef.current}<span className="text-xs font-normal text-gray-400">Taps</span>
                                    </div>
                                    <div className="mt-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 text-[8px] font-black uppercase tracking-wider text-yellow-400">
                                        {tapCountRef.current < 40 ? 'PEMULA' : tapCountRef.current < 80 ? 'JARI KILAT' : 'REFLEKS DEWA 👑'}
                                    </div>
                                </div>
                            </div>

                            {/* AI Roast Box */}
                            <div className="relative mb-6 rounded-3xl bg-gradient-to-br from-[#622599]/40 via-[#e21a83]/5 to-transparent border border-red-500/20 p-6 shadow-xl">
                                <div className="absolute -top-3 left-6 flex items-center gap-1.5 rounded-full bg-[#e21a83] px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white shadow-lg">
                                    <Bot className="h-2.5 w-2.5" /> AI ROAST & DIAGNOSIS
                                </div>
                                <p className="mt-2 text-sm italic leading-relaxed text-gray-100 font-medium">
                                    &quot;{aiResult.roast}&quot;
                                </p>
                            </div>

                            {/* Plan Card */}
                            <div className="relative mb-8 rounded-[2rem] bg-gradient-to-br from-slate-900 via-[#622599]/30 to-[#e21a83]/10 border-2 border-[#e21a83]/40 p-6 overflow-hidden">
                                <div className="absolute top-0 right-0 rounded-bl-2xl bg-yellow-400 px-3 py-1.5 text-[8px] font-black uppercase tracking-widest text-slate-900">REKOMENDASI</div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#e21a83] mb-1">Paket Ultra-Fast Pilihan AI</h3>
                                <h2 className="text-2xl font-black text-white mb-2">{recommendedPackage.name}</h2>
                                <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-3 py-1 rounded-full w-fit">
                                    <Zap className="h-3 w-3 animate-pulse" /> HINGGA {multiplier}X LEBIH KENCANG DARI WIFI SEKARANG!
                                </div>

                                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black uppercase text-gray-500">HARGA SPESIAL</span>
                                        <div className="flex items-baseline gap-0.5">
                                            <span className="text-xl font-black text-green-400">{recommendedPackage.price}</span>
                                            <span className="text-[9px] font-bold text-gray-400">/bln</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1.5 text-[10px] font-black text-green-400 uppercase tracking-widest">
                                            <CircleCheck className="h-3 w-3" /> GRATIS INSTALASI
                                        </div>
                                        <div className="mt-1">
                                            <span className="text-[8px] font-black uppercase text-gray-500 block">KEUNGGULAN UTAMA</span>
                                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Simetris 1:1 & No FUP</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Promo Multi Select */}
                            <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Star className="h-4 w-4 text-yellow-400" />
                                    <h4 className="text-xs font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-[#e21a83]">PILIH PROMO BONUS (BISA &gt; 1)</h4>
                                </div>
                                <button 
                                    onClick={() => togglePromo("Jaminan Harga Tetap 2/3 Tahun")}
                                    className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${selectedPromos.includes("Jaminan Harga Tetap 2/3 Tahun") ? 'border-[#e21a83] bg-[#e21a83]/20 shadow-[0_0_20px_rgba(226,26,131,0.2)]' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                                >
                                    <div className={`flex h-6 w-6 items-center justify-center rounded-lg border transition-colors ${selectedPromos.includes("Jaminan Harga Tetap 2/3 Tahun") ? 'bg-[#e21a83] border-[#e21a83]' : 'border-gray-600 bg-black/40'}`}>
                                        {selectedPromos.includes("Jaminan Harga Tetap 2/3 Tahun") && <CircleCheck className="h-4 w-4 text-white" />}
                                    </div>
                                    <span className="text-xs font-bold text-white leading-tight">Jaminan Harga Tetap Selama 2 atau 3 Tahun</span>
                                </button>
                            </div>

                            <div className="mt-auto grid grid-cols-1 gap-4 mb-4">
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#622599] to-[#e21a83] p-5 text-sm font-black text-white shadow-[0_15px_40px_rgba(226,26,131,0.4)] transition-all hover:scale-[1.02] active:scale-95"
                                >
                                    <ShoppingCart className="h-5 w-5" /> KLAIM PROMO SEKARANG
                                </button>
                                <button 
                                    onClick={() => setScreen('start')}
                                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-4 text-xs font-black text-white transition-all hover:bg-white/10 active:scale-95"
                                >
                                    <RotateCcw className="h-4 w-4" /> ULANGI TANTANGAN
                                </button>
                            </div>

                            <button 
                                onClick={() => {
                                    const msg = `Halo Sales MyRepublic! Saya ingin konsultasi gratis mengenai pemasangan wifi baru. Tadi saya coba Speed Challenge dan hasilnya ${speedRef.current} Mbps dengan ${tapCountRef.current} taps. Mohon dibantu pengecekan area ya! Terima kasih.`;
                                    window.open(`https://wa.me/6285184000800?text=${encodeURIComponent(msg)}`, '_blank');
                                }}
                                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-green-500/30 bg-green-500/5 p-4 text-xs font-black text-green-400 transition-all hover:bg-green-500/10 mb-2"
                            >
                                <MessageSquare className="h-4 w-4" /> KONSULTASI GRATIS (WHATSAPP)
                            </button>
                        </div>
                    )}

                </div>

                {/* Leaderboard - Bottom Drawer Component Style */}
                <div className="mt-auto border-t border-white/5 bg-black/20 p-6 transition-all duration-300">
                    <button 
                        onClick={() => setIsLeaderboardOpen(!isLeaderboardOpen)}
                        className="flex w-full items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white"
                    >
                        <span className="flex items-center gap-2">
                            <Trophy className="h-3 w-3 text-yellow-500" /> SKOR TANTANGAN TERKINI (NASIONAL)
                        </span>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isLeaderboardOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isLeaderboardOpen && (
                        <div className="mt-4 space-y-3 animate-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-center justify-between rounded-xl bg-white/5 p-3 text-[10px]">
                                <div className="flex items-center gap-3">
                                    <span className="font-black text-yellow-500">1</span>
                                    <div className="leading-tight">
                                        <div className="font-black text-white uppercase">Andi W.</div>
                                        <div className="text-[8px] font-bold text-gray-500">JAKARTA • WIFI PROVIDER LAIN</div>
                                    </div>
                                </div>
                                <div className="text-right leading-tight">
                                    <div className="font-black text-yellow-400">154 TAPS</div>
                                    <div className="text-[8px] font-bold text-gray-500 uppercase">SPEED: 4.2 MBPS</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between rounded-xl bg-white/5 p-3 text-[10px]">
                                <div className="flex items-center gap-3">
                                    <span className="font-black text-gray-500">2</span>
                                    <div className="leading-tight">
                                        <div className="font-black text-white uppercase">Siti Rahma</div>
                                        <div className="text-[8px] font-bold text-gray-500">SURABAYA • WIFI RUMAH</div>
                                    </div>
                                </div>
                                <div className="text-right leading-tight">
                                    <div className="font-black text-yellow-400">148 TAPS</div>
                                    <div className="text-[8px] font-bold text-gray-500 uppercase">SPEED: 12.8 MBPS</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Registration Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="w-full max-sm rounded-[2.5rem] overflow-hidden bg-[#0e081b] border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between bg-gradient-to-r from-[#622599]/30 to-[#e21a83]/30 p-6 pb-4 border-b border-white/5">
                            <div>
                                <h3 className="text-lg font-black text-white">KLAIM PROMO</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amankan kuota diskon Anda</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10">
                                <X className="h-4 w-4 text-gray-400" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase text-gray-500 ml-1">NAMA LENGKAP</label>
                                <input type="text" id="lead-name" placeholder="Contoh: Budi Santoso" className="w-full rounded-xl bg-slate-900 border border-white/10 p-3.5 text-xs text-white focus:outline-none focus:border-[#e21a83]" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase text-gray-500 ml-1">NOMOR WHATSAPP</label>
                                <input type="tel" id="lead-phone" placeholder="Contoh: 081234567890" className="w-full rounded-xl bg-slate-900 border border-white/10 p-3.5 text-xs text-white focus:outline-none focus:border-[#e21a83]" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black uppercase text-gray-500 ml-1">ALAMAT / AREA</label>
                                <input type="text" id="lead-address" placeholder="Contoh: Jl. Ijen No. 12" className="w-full rounded-xl bg-slate-900 border border-white/10 p-3.5 text-xs text-white focus:outline-none focus:border-[#e21a83]" />
                            </div>
                            <div className="flex gap-3 items-start rounded-xl bg-white/5 p-3 text-[10px] text-gray-400 border border-white/5 leading-tight">
                                <Info className="h-4 w-4 text-[#e21a83] shrink-0" />
                                <span>Data akan diteruskan ke tim Sales MyRepublic untuk pengecekan tiang jaringan terdekat di lokasi Anda.</span>
                            </div>
                        </div>
                        <div className="p-6 pt-0">
                            <button 
                                onClick={() => {
                                    const name = (document.getElementById('lead-name') as HTMLInputElement).value;
                                    const phone = (document.getElementById('lead-phone') as HTMLInputElement).value;
                                    const addr = (document.getElementById('lead-address') as HTMLInputElement).value;
                                    if(!name || !phone || !addr) return alert("Harap isi semua kolom!");
                                    
                                    const promoText = selectedPromos.length > 0 ? `\n\n*Promo yang dipilih:* \n${selectedPromos.map(p => `- ${p}`).join('\n')}` : '';
                                    const msg = `Halo Sales MyRepublic! Saya telah mencoba tantangan "Speed Challenge".\n\nNama: ${name}\nNo. WhatsApp: ${phone}\nAlamat Pemasangan: ${addr}\nKota: ${selectedCity}\n\nSaya ingin berkonsultasi mengenai paket: *${recommendedPackage.name}* (Asli: *${speedRef.current} Mbps*, *${tapCountRef.current} Taps*).${promoText}\n\nMohon dibantu pengecekan jaringannya ya! Terima kasih.`;
                                    window.open(`https://wa.me/6285184000800?text=${encodeURIComponent(msg)}`, '_blank');
                                    setIsModalOpen(false);
                                }}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#622599] to-[#e21a83] p-4 text-sm font-black text-white shadow-lg active:scale-95"
                            >
                                <Send className="h-4 w-4" /> KIRIM & KONSULTASI
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 3px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(226, 26, 131, 0.2); border-radius: 10px; }
            `}</style>
        </div>
    );
}
