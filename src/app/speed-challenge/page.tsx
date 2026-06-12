'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
  MessageSquare
} from 'lucide-react';
import { generateSpeedRoast, type SpeedRoastOutput } from '@/ai/flows/speed-challenge-roast';

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
    const [timeLeft, setTimeLeft] = useState(5000); // 5 seconds
    const [realSpeed, setRealSpeed] = useState(0.0);
    const [selectedCity, setSelectedCity] = useState('Jakarta Selatan');
    const [selectedConn, setSelectedConn] = useState('WiFi Provider Lain');
    const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [aiResult, setAiResult] = useState<SpeedRoastOutput | null>(null);
    const [loadingLogs, setLoadingLogs] = useState<string[]>([]);
    const [selectedPromos, setSelectedPromos] = useState<string[]>([]);
    
    const gameTime = 5000;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<any[]>([]);
    const audioCtx = useRef<AudioContext | null>(null);
    const gameInterval = useRef<NodeJS.Timeout | null>(null);
    const speedTestInterval = useRef<NodeJS.Timeout | null>(null);

    // Particle System
    class Particle {
        x: number;
        y: number;
        size: number;
        speedX: number;
        speedY: number;
        color: string;
        alpha: number;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 6 + 2;
            this.speedX = Math.random() * 6 - 3;
            this.speedY = Math.random() * -6 - 1;
            this.color = Math.random() > 0.5 ? '#622599' : '#e21a83';
            this.alpha = 1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.alpha -= 0.02;
        }
        draw(ctx: CanvasRenderingContext2D) {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    const handleParticles = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = particles.current.length - 1; i >= 0; i--) {
            particles.current[i].update();
            particles.current[i].draw(ctx);
            if (particles.current[i].alpha <= 0) {
                particles.current.splice(i, 1);
            }
        }
        if (timeLeft > 0 || particles.current.length > 0) {
            requestAnimationFrame(handleParticles);
        }
    }, [timeLeft]);

    const playSound = (freq: number, duration: number, type: OscillatorType = "sine") => {
        try {
            if (!audioCtx.current) {
                audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            const osc = audioCtx.current.createOscillator();
            const gain = audioCtx.current.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.current.currentTime);
            gain.gain.setValueAtTime(0.1, audioCtx.current.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + duration);
            osc.connect(gain);
            gain.connect(audioCtx.current.destination);
            osc.start();
            osc.stop(audioCtx.current.currentTime + duration);
        } catch(e) {}
    };

    const initiateGame = () => {
        setTapCount(0);
        setTimeLeft(gameTime);
        setRealSpeed(0.0);
        setAiResult(null);
        setLoadingLogs([]);
        setSelectedPromos([]);
        particles.current = [];
        setScreen('game');

        const targetSpeed = Math.floor(Math.random() * 45) + 8;
        let currentSpeed = 0.0;
        
        setTimeout(() => {
            speedTestInterval.current = setInterval(() => {
                currentSpeed += (targetSpeed - currentSpeed) * 0.15 + (Math.random() * 2 - 1);
                if (currentSpeed < 0) currentSpeed = 0.1;
                setRealSpeed(parseFloat(currentSpeed.toFixed(1)));
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

    const finishGame = () => {
        setScreen('loading');
        setLoadingLogs(["> Memfinalisasi data latency..."]);
        
        setTimeout(() => setLoadingLogs(prev => [...prev, `> Menganalisis kecepatan ${realSpeed} Mbps...`]), 600);
        setTimeout(() => setLoadingLogs(prev => [...prev, `> Menghitung rasio kompresi jaringan ${selectedCity}...`]), 1200);
        setTimeout(async () => {
            setLoadingLogs(prev => [...prev, "> Memanggil Gemini AI Engine..."]);
            try {
                const roast = await generateSpeedRoast({
                    speed: realSpeed,
                    taps: tapCount,
                    city: selectedCity,
                    connectionType: selectedConn
                });
                setAiResult(roast);
                setScreen('result');
            } catch (e) {
                setAiResult({
                    roast: "Waduh! Internetmu lagi mode istirahat ya? Lambat banget kayak siput lagi sakit flu. Ganti ke MyRepublic sekarang biar ga darah tinggi tiap hari!",
                    diagnosis: "Terdeteksi gejala kelebihan beban jaringan dan kurangnya simetri.",
                    recommendedAction: "Beralih ke MyRepublic Velo sekarang."
                });
                setScreen('result');
            }
        }, 1800);
    };

    const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
        if (timeLeft <= 0) return;
        setTapCount(prev => prev + 1);
        
        const canvas = canvasRef.current;
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            let x, y;
            if ('touches' in e && e.touches.length > 0) {
                x = e.touches[0].clientX - rect.left;
                y = e.touches[0].clientY - rect.top;
            } else {
                const mouseEvt = e as React.MouseEvent;
                x = mouseEvt.clientX - rect.left;
                y = mouseEvt.clientY - rect.top;
            }
            for (let i = 0; i < 8; i++) {
                particles.current.push(new Particle(x, y));
            }
        }

        playSound(300 + (tapCount * 8), 0.1, "square");
    };

    useEffect(() => {
        if (screen === 'game') {
            const canvas = canvasRef.current;
            if (canvas) {
                canvas.width = canvas.parentElement?.clientWidth || 400;
                canvas.height = canvas.parentElement?.clientHeight || 200;
                requestAnimationFrame(handleParticles);
            }
        }
    }, [screen, handleParticles]);

    const recommendedPackage = myRepublicPackages.find(pkg => realSpeed <= pkg.maxSpeed) || myRepublicPackages[myRepublicPackages.length - 1];
    const multiplier = (recommendedPackage.speedVal / (realSpeed || 1)).toFixed(1);

    const togglePromo = (promo: string) => {
        setSelectedPromos(prev => 
            prev.includes(promo) ? prev.filter(p => p !== promo) : [...prev, promo]
        );
    };

    return (
        <div className="min-h-screen text-white flex flex-col items-center justify-center p-4 bg-[#080312] selection:bg-[#e21a83]/30">
            <div className="w-full max-w-lg bg-[#0e081b]/85 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#622599] via-[#e21a83] to-[#622599]"></div>
                
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#622599] to-[#e21a83] flex items-center justify-center shadow-lg">
                            <Bolt className="text-white w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-sm tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#622599] to-[#e21a83]">MYREPUBLIC</h3>
                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Speed Challenge</p>
                        </div>
                    </div>
                    <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-[#e21a83] border border-white/5 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                        <span>AI Live Diagnose</span>
                    </div>
                </div>

                {/* Screens */}
                {screen === 'start' && (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-2 text-center">
                            WiFi Rumah Sering <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500">Lemot Kayak Siput? 🐌</span>
                        </h1>
                        <p className="text-sm text-gray-400 text-center mb-6">
                            Bantu Roket MyRepublic meluncur sembari AI memindai, menganalisis, dan membandingkan kecepatan internet Anda saat ini!
                        </p>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Zap className="text-[#e21a83] w-3 h-3" /> Pengaturan Penyelidikan
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Kota Anda</label>
                                    <select 
                                        className="w-full text-xs rounded-lg p-2.5 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#e21a83]"
                                        value={selectedCity}
                                        onChange={(e) => setSelectedCity(e.target.value)}
                                    >
                                        {CITY_LIST.map(city => (
                                            <option key={city} value={city} className="bg-[#0e081b]">{city}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Koneksi Saat Ini</label>
                                    <select 
                                        className="w-full text-xs rounded-lg p-2.5 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#e21a83]"
                                        value={selectedConn}
                                        onChange={(e) => setSelectedConn(e.target.value)}
                                    >
                                        <option value="WiFi Provider Lain" className="bg-[#0e081b]">WiFi Provider Lain</option>
                                        <option value="Paket Data Seluler" className="bg-[#0e081b]">Paket Data Seluler</option>
                                        <option value="RT RW Net" className="bg-[#0e081b]">Pakai RT RW Net</option>
                                        <option value="Internet Tetangga" className="bg-[#0e081b]">Internet Tetangga 🤫</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="relative h-44 flex items-center justify-center mb-6 overflow-hidden rounded-2xl bg-gradient-to-b from-[#622599]/10 to-transparent border border-white/5">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(226,26,131,0.1)_0%,transparent_70%)] animate-pulse"></div>
                            <div className="text-7xl select-none animate-bounce filter drop-shadow-[0_10px_15px_rgba(98,37,153,0.3)]">🚀</div>
                        </div>

                        <button 
                            onClick={initiateGame}
                            className="w-full bg-gradient-to-r from-[#622599] to-[#e21a83] hover:from-[#622599]/90 hover:to-[#e21a83]/90 text-white font-extrabold text-base py-4 px-6 rounded-2xl transition-all shadow-[0_0_20px_rgba(226,26,131,0.5)] flex items-center justify-center gap-3 group"
                        >
                            MULAI TANTANGAN KECEPATAN
                            <ArrowRight className="group-hover:translate-x-1 transition-transform w-5 h-5" />
                        </button>
                    </div>
                )}

                {screen === 'game' && (
                    <div className="animate-in fade-in duration-300">
                        <div className="text-center mb-4">
                            <h2 className="text-xl font-black text-white flex items-center justify-center gap-2 uppercase tracking-tighter">
                                <span className="animate-bounce">⚡</span> KETUK SECEPAT MUNGKIN!
                            </h2>
                            <p className="text-xs text-gray-400 mt-1">Pompa roket & biarkan AI mendeteksi kecepatan asli WiFi Anda...</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center">
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Energi Roket</span>
                                <div className="text-3xl font-black text-yellow-400">{tapCount}</div>
                                <span className="text-[9px] text-yellow-400/80 mt-0.5">Taps Terkumpul</span>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center relative overflow-hidden">
                                <div className="absolute top-1 right-2">
                                    <span className="text-[8px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest animate-pulse">Scanning</span>
                                </div>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Kecepatan Internet</span>
                                <div className="text-3xl font-black text-[#e21a83] flex items-baseline gap-0.5">
                                    <span>{realSpeed.toFixed(1)}</span>
                                    <span className="text-xs font-normal text-gray-400">Mbps</span>
                                </div>
                                <span className="text-[9px] text-[#e21a83]/80 mt-0.5">Mengukur Unduhan...</span>
                            </div>
                        </div>

                        <div className="relative mb-4">
                            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none rounded-2xl z-10"></canvas>
                            <div 
                                id="tap-zone" 
                                onMouseDown={handleTap}
                                onTouchStart={(e) => { e.preventDefault(); handleTap(e); }}
                                className="relative z-0 h-48 bg-gradient-to-b from-[#622599]/20 to-[#0e081b]/40 border-2 border-dashed border-[#e21a83]/60 hover:border-[#e21a83] rounded-2xl flex flex-col items-center justify-center cursor-pointer select-none transition-all p-4 active:scale-[0.98]"
                            >
                                <div className="text-6xl mb-3 transform transition-transform duration-75">🚀</div>
                                <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400 animate-pulse">TAP DISINI!</h3>
                                <p className="text-[10px] text-gray-400 mt-1">Gunakan beberapa jari untuk kecepatan ekstra!</p>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                            <div className="flex justify-between items-center text-xs mb-1">
                                <span className="font-bold text-gray-400 uppercase tracking-widest">Waktu Tersisa</span>
                                <span className="font-extrabold text-[#e21a83]">{(timeLeft / 1000).toFixed(1)} Detik</span>
                            </div>
                            <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-[#622599] to-[#e21a83] transition-all duration-100" style={{ width: `${(timeLeft / gameTime) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                )}

                {screen === 'loading' && (
                    <div className="animate-in fade-in duration-300 text-center py-8">
                        <div className="relative w-24 h-24 mx-auto mb-6">
                            <div className="absolute inset-0 rounded-full border-4 border-[#622599]/20"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-t-[#e21a83] animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Bot className="text-[#e21a83] w-8 h-8 animate-bounce" />
                            </div>
                        </div>
                        <h2 className="text-xl font-black mb-2">Konsultasi dengan AI Engine...</h2>
                        <p className="text-sm text-gray-400 max-w-xs mx-auto mb-6">Gemini AI sedang mendiagnosis jaringan internet rumah Anda serta menganalisis kekuatan ketukan tangan Anda.</p>
                        
                        <div className="max-w-xs mx-auto bg-white/5 border border-white/10 rounded-xl p-3 text-left">
                            <div className="flex items-center gap-2 text-xs text-gray-400 mb-1.5">
                                <Bolt className="text-yellow-400 w-3 h-3" />
                                <span>Proses Komputasi:</span>
                            </div>
                            <div className="text-xs space-y-1 font-mono text-gray-500">
                                {loadingLogs.map((log, i) => <div key={i}>{log}</div>)}
                            </div>
                        </div>
                    </div>
                )}

                {screen === 'result' && aiResult && (
                    <div className="animate-in fade-in zoom-in duration-500 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-2 text-xl shadow-lg">
                                <CircleCheck className="w-6 h-6" />
                            </div>
                            <h1 className="text-2xl font-black">Analisis AI Selesai!</h1>
                            <p className="text-xs text-gray-400">Kondisi riil internet dan solusi paket terbaik untuk Anda</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Kecepatan Anda</span>
                                <div className="text-2xl font-black text-[#e21a83] flex items-center justify-center gap-1">
                                    <span>{realSpeed}</span>
                                    <span className="text-xs font-normal text-gray-400">Mbps</span>
                                </div>
                                <span className={`inline-block mt-1 text-[9px] px-2 py-0.5 rounded font-black uppercase ${realSpeed < 15 ? 'bg-red-500/10 text-red-400' : realSpeed < 40 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-green-500/10 text-green-400'}`}>
                                    {realSpeed < 15 ? 'Kategori Siput 🐌' : realSpeed < 40 ? 'Kategori Kura-kura 🐢' : 'Kategori Kelinci 🐰'}
                                </span>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Ketukan Jari</span>
                                <div className="text-2xl font-black text-yellow-400 flex items-center justify-center gap-1">
                                    <span>{tapCount}</span>
                                    <span className="text-xs font-normal text-gray-400">Taps</span>
                                </div>
                                <span className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded font-black uppercase bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                                    {tapCount < 20 ? 'Tukang Santuy ☕' : tapCount < 40 ? 'Pro Tapper ⚡' : 'Refleks Dewa 👑'}
                                </span>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-red-950/20 to-[#622599]/20 border border-red-500/20 rounded-2xl p-4 mb-4 relative">
                            <div className="absolute -top-2.5 left-4 bg-[#e21a83] text-[9px] text-white font-extrabold px-2 py-0.5 rounded-md tracking-wider uppercase shadow-md flex items-center gap-1">
                                <Bot className="w-2.5 h-2.5" /> AI Roast & Diagnosis
                            </div>
                            <p className="text-sm italic leading-relaxed text-gray-200 mt-2">
                                &quot;{aiResult.roast}&quot;
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-[#622599]/30 to-[#e21a83]/10 border-2 border-[#e21a83]/40 rounded-2xl p-5 mb-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-yellow-400 text-[#0e081b] font-black text-[9px] px-3 py-1 rounded-bl-xl tracking-wider uppercase">
                                Rekomendasi Utama
                            </div>
                            
                            <span className="text-[10px] text-[#e21a83] font-bold uppercase tracking-widest block mb-1">Paket Ultra-Fast Sesuai Kebutuhan</span>
                            <h2 className="text-2xl font-black text-white mb-1" id="rec-package-name">{recommendedPackage.name}</h2>
                            {recommendedPackage.bonus && (
                                <p className="text-[10px] font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded inline-block mb-2 border border-yellow-400/20">
                                    🎁 {recommendedPackage.bonus}
                                </p>
                            )}

                            <div className="flex items-center gap-2 mb-2 text-[10px] text-green-400 font-bold uppercase tracking-wider">
                                <CircleCheck className="w-3.5 h-3.5" /> 
                                <span>GRATIS BIAYA PEMASANGAN (Hemat Rp 500.000)</span>
                            </div>
                            
                            <div className="flex items-center gap-2 mb-4 text-xs text-yellow-300 font-bold">
                                <Zap className="w-4 h-4 animate-bounce" /> 
                                <span>Hingga {multiplier}x Lebih Cepat & Stabil dari WiFi lama Anda!</span>
                            </div>

                            <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                                <div>
                                    <span className="text-[9px] text-gray-400 block uppercase font-bold">Harga Spesial</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-lg font-black text-green-400">{recommendedPackage.price}</span>
                                        <span className="text-[9px] text-gray-400">/bln</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[9px] text-gray-400 block uppercase font-bold">Keunggulan Utama</span>
                                    <span className="text-xs text-white font-bold block"><Gauge className="inline w-3 h-3 text-[#e21a83] mr-1" /> Simetris 1:1 & No FUP</span>
                                </div>
                            </div>
                        </div>

                        {/* Promo Bonus Selection */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
                            <h3 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-[#e21a83] uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-400" />
                                Pilih Promo Bonus (Bisa &gt; 1)
                            </h3>
                            <div className="space-y-3">
                                <PromoOption 
                                    label="Jaminan harga tetap selama 2 atau 3 tahun" 
                                    isSelected={selectedPromos.includes("Jaminan Harga Tetap 2/3 Tahun")} 
                                    onToggle={() => togglePromo("Jaminan Harga Tetap 2/3 Tahun")} 
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="bg-gradient-to-r from-[#622599] to-[#e21a83] hover:from-[#622599]/90 hover:to-[#e21a83]/90 text-white font-black text-sm py-3.5 px-4 rounded-xl shadow-[0_0_20px_rgba(226,26,131,0.5)] transition-all flex items-center justify-center gap-2"
                            >
                                <ShoppingCart className="w-4 h-4" /> Ambil Promo
                            </button>
                            <button 
                                onClick={() => setScreen('start')}
                                className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" /> Ulangi Game
                            </button>
                        </div>

                        <button 
                            onClick={() => {
                                const msg = `Halo Sales MyRepublic! Saya ingin konsultasi gratis mengenai pemasangan wifi baru di rumah saya. Tadi saya coba Speed Challenge dan hasilnya ${realSpeed} Mbps. Mohon dibantu pengecekan area ya! Terima kasih.`;
                                window.open(`https://wa.me/6285184000800?text=${encodeURIComponent(msg)}`, '_blank');
                            }}
                            className="w-full bg-white/5 border border-white/20 hover:bg-white/10 text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 mb-4"
                        >
                            <MessageSquare className="w-4 h-4 text-green-400" /> Konsultasi Gratis via WhatsApp
                        </button>
                    </div>
                )}

                {/* Leaderboard */}
                <div className="mt-6 border-t border-white/5 pt-6">
                    <button 
                        onClick={() => setIsLeaderboardOpen(!isLeaderboardOpen)}
                        className="w-full flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-widest hover:text-white transition-colors focus:outline-none"
                    >
                        <span className="flex items-center gap-2">
                            <Star className="text-yellow-400 w-3 h-3" />
                            Skor Tantangan Terkini (Nasional)
                        </span>
                        <Info className={`transition-transform duration-300 w-4 h-4 ${isLeaderboardOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isLeaderboardOpen && (
                        <div className="mt-3 max-h-40 overflow-y-auto space-y-2 pr-1 animate-in slide-in-from-top-2 duration-300">
                            <LeaderboardItem rank={1} name="Andi W." meta="Jakarta • WiFi Tetangga" taps={54} speed="4.2 Mbps" isHighlight />
                            <LeaderboardItem rank={2} name="Siti Rahma" meta="Surabaya • WiFi Rumah" taps={48} speed="12.8 Mbps" />
                            <LeaderboardItem rank={3} name="Rian K." meta="Bandung • Mobile Data" taps={45} speed="21.0 Mbps" />
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
                    <div className="bg-[#0e081b] border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                        <div className="p-6 pb-4 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-[#622599]/20 to-[#e21a83]/10">
                            <div>
                                <h3 className="text-lg font-black">Formulir Klaim Promo</h3>
                                <p className="text-xs text-gray-400">Isi data singkat untuk klaim diskon khusus</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Nama Lengkap</label>
                                <input type="text" id="lead-name" placeholder="Contoh: Budi Santoso" className="w-full text-sm rounded-xl p-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#e21a83]" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Nomor WhatsApp / HP</label>
                                <input type="tel" id="lead-phone" placeholder="Contoh: 081234567890" className="w-full text-sm rounded-xl p-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#e21a83]" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Alamat / Area Pemasangan</label>
                                <input type="text" id="lead-address" placeholder="Contoh: Jl. Ijen No. 12" className="w-full text-sm rounded-xl p-3 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#e21a83]" />
                            </div>
                            
                            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex gap-2 items-start text-[11px] text-gray-400 leading-normal">
                                <Info className="text-[#e21a83] w-4 h-4 mt-0.5 shrink-0" />
                                <span>Setelah menekan tombol kirim, Anda akan diarahkan ke WhatsApp Sales untuk melakukan pengecekan tiang jaringan terdekat di lokasi Anda.</span>
                            </div>
                        </div>

                        <div className="p-6 pt-0 border-t border-white/5 bg-white/[0.01] flex gap-3">
                            <button 
                                onClick={() => {
                                    const name = (document.getElementById('lead-name') as HTMLInputElement).value;
                                    const phone = (document.getElementById('lead-phone') as HTMLInputElement).value;
                                    const addr = (document.getElementById('lead-address') as HTMLInputElement).value;
                                    if(!name || !phone || !addr) return alert("Harap isi semua kolom!");
                                    
                                    const promoText = selectedPromos.length > 0 
                                        ? `\n\n*Promo yang dipilih:* \n${selectedPromos.map(p => `- ${p}`).join('\n')}`
                                        : '';

                                    const bonusText = recommendedPackage.bonus ? `\n*Bonus:* ${recommendedPackage.bonus}` : '';

                                    const msg = `Halo Sales MyRepublic! Saya telah mencoba tantangan "Speed Challenge".\n\nNama: ${name}\nNo. WhatsApp: ${phone}\nAlamat Pemasangan: ${addr}\nKota: ${selectedCity}\n\nSaya ingin berkonsultasi mengenai paket: *${recommendedPackage.name}* (Speed Asli: *${realSpeed} Mbps*).${bonusText}${promoText}\n\nMohon dibantu pengecekan jaringannya ya! Terima kasih.`;
                                    window.open(`https://wa.me/6285184000800?text=${encodeURIComponent(msg)}`, '_blank');
                                    setIsModalOpen(false);
                                }}
                                className="w-full bg-gradient-to-r from-[#622599] to-[#e21a83] hover:from-[#622599]/90 hover:to-[#e21a83]/90 text-white font-extrabold text-sm py-4 rounded-xl shadow-[0_0_20px_rgba(226,26,131,0.5)] transition-all flex items-center justify-center gap-2"
                            >
                                <Send className="w-4 h-4" /> Kirim & Konsultasi Sekarang
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(226, 26, 131, 0.3);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
}

function PromoOption({ label, isSelected, onToggle }: { label: string, isSelected: boolean, onToggle: () => void }) {
    return (
        <button 
            onClick={onToggle}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${isSelected ? 'bg-[#e21a83]/20 border-[#e21a83] text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}
        >
            <div className={`shrink-0 h-5 w-5 rounded-md flex items-center justify-center transition-colors ${isSelected ? 'bg-[#e21a83]' : 'bg-white/10'}`}>
                {isSelected && <CircleCheck className="h-4 w-4 text-white" />}
            </div>
            <span className="text-xs font-semibold">{label}</span>
        </button>
    );
}

function LeaderboardItem({ rank, name, meta, taps, speed, isHighlight = false }: { rank: number, name: string, meta: string, taps: number, speed: string, isHighlight?: boolean }) {
    return (
        <div className={`flex items-center justify-between border rounded-xl p-2 text-xs ${isHighlight ? 'bg-[#e21a83]/10 border-[#e21a83]/20' : 'bg-white/5 border-white/5'}`}>
            <div className="flex items-center gap-2">
                <span className={`w-5 text-center font-black ${rank === 1 ? 'text-[#e21a83]' : 'text-gray-400'}`}>
                    {rank === 1 ? <Star className="w-3 h-3 text-yellow-400 inline" /> : rank}
                </span>
                <div>
                    <div className={`font-bold ${isHighlight ? 'text-white' : ''}`}>{name}</div>
                    <div className="text-[9px] text-gray-400">{meta}</div>
                </div>
            </div>
            <div className="text-right">
                <div className="font-bold text-yellow-400">{taps} Taps</div>
                <div className="text-[9px] text-gray-400">Speed: {speed}</div>
            </div>
        </div>
    );
}
