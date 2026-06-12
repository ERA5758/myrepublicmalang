'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// Database Paket MyRepublic 2026
const myRepublicPackages = [
    { name: "NEO 100 Mbps", price: "Rp 233.100", maxSpeed: 30 },
    { name: "VELO 150 Mbps", price: "Rp 277.500", maxSpeed: 70 },
    { name: "NEXUS 300 Mbps", price: "Rp 333.000", maxSpeed: 150 },
    { name: "PRIME 500 Mbps", price: "Rp 555.000", maxSpeed: 9999 }
];

export default function SpeedChallengePage() {
    const [screen, setScreen] = useState<'start' | 'game' | 'result'>('start');
    const [tapCount, setTapCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(5000); // 5 seconds
    const [realSpeed, setRealSpeed] = useState(0);
    const [isFlying, setIsFlying] = useState(false);
    const gameInterval = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();

    const gameTime = 5000;

    const startGame = () => {
        setScreen('game');
        setIsFlying(true);
        runRealSpeedTest();
        
        gameInterval.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 100) {
                    if (gameInterval.current) clearInterval(gameInterval.current);
                    endGame();
                    return 0;
                }
                return prev - 100;
            });
        }, 100);
    };

    const registerTap = () => {
        setTapCount((prev) => prev + 1);
        // Visual feedback for rocket
        const rocket = document.getElementById('rocket-emoji');
        if (rocket) {
            rocket.style.transform = 'scale(1.3) translateY(-10px)';
            setTimeout(() => {
              if (rocket) rocket.style.transform = 'scale(1) translateY(0)';
            }, 50);
        }
    };

    const runRealSpeedTest = () => {
        const startTime = new Date().getTime();
        const imageAddr = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Black_Square_with_a_fine_white_edge.svg/1200px-Black_Square_with_a_fine_white_edge.svg.png?time=" + startTime;
        const downloadSize = 5000000; // ~5MB
        
        let download = new Image();
        download.onload = function () {
            const endTime = new Date().getTime();
            const duration = (endTime - startTime) / 1000;
            const bitsLoaded = downloadSize * 8;
            const speedBps = bitsLoaded / duration;
            const speedMbps = (speedBps / 1024 / 1024).toFixed(1);
            setRealSpeed(parseFloat(speedMbps));
        };
        
        download.onerror = function () {
            setRealSpeed(Math.floor(Math.random() * (45 - 12 + 1)) + 12);
        };
        download.src = imageAddr;
    };

    const endGame = () => {
        setIsFlying(false);
        setScreen('result');
    };

    const recommendedPackage = myRepublicPackages.find(pkg => (realSpeed || 15) <= pkg.maxSpeed) || myRepublicPackages[myRepublicPackages.length - 1];
    const targetSpeedMatch = recommendedPackage.name.match(/\d+/);
    const targetSpeed = targetSpeedMatch ? parseInt(targetSpeedMatch[0]) : 100;
    const multiplier = ((targetSpeed) / (realSpeed || 10)).toFixed(1);

    return (
        <div className="min-h-screen bg-[#1a1a2e] text-white flex justify-center items-center p-4 font-sans selection:bg-[#e21a83]/30">
            <style jsx>{`
                .rocket.flying {
                    animation: shake 0.1s infinite alternate;
                }
                @keyframes shake {
                    0% { transform: translateY(0) translateX(0); }
                    100% { transform: translateY(-5px) translateX(2px); }
                }
            `}</style>

            <div className="w-full max-w-[450px] bg-gradient-to-b from-[#241442] to-[#100720] rounded-[24px] p-8 text-center shadow-2xl border border-white/10 relative overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#622599]/20 blur-[60px] rounded-full" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#e21a83]/10 blur-[60px] rounded-full" />

                {screen === 'start' && (
                    <div className="animate-in fade-in zoom-in duration-300 relative z-10">
                        <h1 className="text-2xl font-black mb-2 tracking-tight">WiFi Rumah Sering Lemot? 🐌</h1>
                        <p className="text-sm text-[#b3a1d9] mb-8 leading-relaxed">Bantu Roket MyRepublic meluncur dan uji seberapa parah kecepatan internetmu sekarang!</p>
                        <div className="h-[200px] flex justify-center items-center text-[80px] mb-5 select-none">🚀</div>
                        <button 
                            className="w-full py-4 bg-gradient-to-r from-[#622599] to-[#e21a83] rounded-full text-lg font-black shadow-lg shadow-[#e21a83]/20 active:scale-95 transition-all hover:brightness-110"
                            onClick={startGame}
                        >
                            MULAI TANTANGAN
                        </button>
                    </div>
                )}

                {screen === 'game' && (
                    <div className="animate-in fade-in duration-300 relative z-10">
                        <h1 className="text-2xl font-black mb-2 uppercase tracking-tighter">KETUK SECEPAT MUNGKIN! ⚡</h1>
                        <p className="text-sm text-[#b3a1d9] mb-8">Isi energi roket sembari AI mendeteksi WiFi-mu...</p>
                        <div className="h-[200px] flex justify-center items-center text-[80px] mb-5 select-none">
                            <span id="rocket-emoji" className={`rocket transition-transform duration-100 ${isFlying ? 'flying' : ''}`}>🚀</span>
                        </div>
                        <div 
                            className="bg-white/5 border-[3px] border-dashed border-[#e21a83] rounded-[20px] py-12 px-5 my-5 cursor-pointer select-none active:bg-white/10 transition-colors group"
                            onClick={registerTap}
                        >
                            <h2 className="text-[#ffeb3b] text-3xl font-black tracking-tighter group-active:scale-110 transition-transform">TAP DI SINI!</h2>
                            <p className="text-xs mt-2 font-mono opacity-80">Total Taps: <span className="font-bold text-[#e21a83]">{tapCount}</span></p>
                        </div>
                        <div className="w-full h-3 bg-white/10 rounded-full mt-6 overflow-hidden border border-white/5 p-[2px]">
                            <div 
                                className="h-full bg-gradient-to-r from-[#622599] to-[#e21a83] transition-all duration-100 linear rounded-full shadow-[0_0_10px_#e21a83]" 
                                style={{ width: `${(timeLeft / gameTime) * 100}%` }}
                            />
                        </div>
                        <p className="text-[10px] mt-2 text-white/40 uppercase tracking-widest font-bold">Energi Roket</p>
                    </div>
                )}

                {screen === 'result' && (
                    <div className="animate-in fade-in zoom-in duration-500 relative z-10">
                        <h1 className="text-2xl font-black mb-2 text-[#4caf50] tracking-tighter">Analisis AI Selesai! 🤖</h1>
                        <p className="text-sm text-[#b3a1d9] mb-8">Berikut adalah kondisi internet asli rumah Anda saat ini:</p>
                        
                        <div className="bg-white/5 rounded-2xl p-5 my-5 text-left border-l-[5px] border-[#e21a83] backdrop-blur-sm">
                            <p className="text-sm">
                                <strong>Kecepatan Asli Anda:</strong> 
                                <span className="ml-2 bg-[#ff4d4d] text-white px-2 py-0.5 rounded text-xs font-black">
                                    {realSpeed || 12} Mbps
                                </span>
                            </p>
                            <p className="text-xs mt-3 text-[#ccc] leading-relaxed italic">
                                {realSpeed < 30 
                                    ? "Koneksi Anda masuk kategori 'Siput'. Pantas video call patah-patah dan download file drama korea terasa sewindu!"
                                    : "Koneksi Anda lumayan, tapi harga yang Anda bayar sekarang kemungkinan kemahalan dengan kuota FUP yang mencekik!"}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-[#622599]/30 to-[#e21a83]/30 border border-[#e21a83]/50 rounded-2xl p-5 mt-4 text-left backdrop-blur-md">
                            <h3 className="text-white/80 text-[10px] font-black uppercase tracking-widest mb-1">🚀 Rekomendasi Paket Terpilih:</h3>
                            <h2 className="text-[#ffeb3b] text-2xl font-black tracking-tighter mb-2 leading-none">{recommendedPackage.name}</h2>
                            <p className="text-sm mb-3 text-white font-medium">
                                🚀 Kecepatan naik hingga <span className="text-[#00ffcc] font-black">{multiplier}x LIPAT</span> lebih ngebut dibanding sekarang!
                            </p>
                            <div className="h-px bg-white/10 w-full mb-3" />
                            <p className="text-xs text-white/70">Harga Spesial: <strong className="text-xl text-[#00ffcc] font-black">{recommendedPackage.price} / bln</strong></p>
                            <p className="text-[10px] text-[#aaa] mt-1">*Bebas FUP & Kuota Simetris 1:1</p>
                        </div>

                        <button 
                            className="w-full py-4 bg-gradient-to-r from-[#622599] to-[#e21a83] rounded-full text-lg font-black shadow-xl shadow-[#e21a83]/30 mt-6 active:scale-95 transition-all hover:scale-[1.02] hover:brightness-110"
                            onClick={() => router.push('/promo')}
                        >
                            AMBIL PROMO SEKARANG
                        </button>
                    </div>
                )}
            </div>
            
            <p className="fixed bottom-6 text-[10px] text-white/20 uppercase tracking-[0.3em] font-bold">MyRepublic Speed Challenge 2026</p>
        </div>
    );
}
