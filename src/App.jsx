import React, { useState, useEffect, useRef } from 'react';
import { Play, Info, Search, Bell, User, ChevronDown, Loader2, X } from 'lucide-react';

// --- DATA CADANGAN ---
const FALLBACK_TRENDING = [
  { id: 1, title: "Crimson Protocol", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600" },
  { id: 2, title: "Blue Shift", img: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=600" },
  { id: 3, title: "Neon Blood", img: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=600" },
  { id: 4, title: "The Matrix Hack", img: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&q=80&w=600" },
  { id: 5, title: "Cyber Warfare", img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=600" },
  { id: 11, title: "Red Horizon", img: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&q=80&w=600" },
];

const FALLBACK_SCIFI = [
  { id: 6, title: "Deep Space Red", img: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=600" },
  { id: 7, title: "Azure Colony", img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=600" },
  { id: 8, title: "Mars Uprising", img: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&q=80&w=600" },
  { id: 9, title: "Cobalt Core", img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600" },
  { id: 10, title: "Time Paradox", img: "https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?auto=format&fit=crop&q=80&w=600" },
];

// --- KOMPONEN POPUP MESSAGE (Ganti Alert) ---
const MessageBox = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-blue-500/50 rounded-lg p-6 max-w-sm w-full shadow-[0_0_30px_rgba(59,130,246,0.3)] animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">Notifikasi</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-300">{message}</p>
        <button 
          onClick={onClose}
          className="mt-6 w-full py-2 bg-gradient-to-r from-red-600 to-blue-600 rounded text-white font-bold hover:from-red-500 hover:to-blue-500 transition-all shadow-lg"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

// --- KOMPONEN ANIMASI MUNCUL SAAT SCROLL ---
const RevealOnScroll = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.disconnect(); };
  }, []);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- KOMPONEN NAVIGASI ---
const Navbar = ({ showMessage }) => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#09090b]/95 backdrop-blur-md shadow-[0_4px_30px_rgba(220,38,38,0.15)] border-b border-red-900/30">
      <div className="flex items-center justify-between px-6 md:px-12 py-4">
        <div className="flex items-center gap-8">
          <h1 
            onClick={() => showMessage("Anda sudah berada di Beranda")}
            className="text-2xl md:text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.6)] cursor-pointer hover:from-blue-500 hover:to-red-600 transition-all duration-500"
          >
            NEO<span className="text-white">STREAM</span>
          </h1>
          
          <ul className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
            <li onClick={() => showMessage("Menu Beranda diklik")} className="cursor-pointer hover:text-red-500 transition-colors">Beranda</li>
            <li onClick={() => showMessage("Menu Serial TV diklik")} className="cursor-pointer hover:text-red-500 transition-colors">Serial TV</li>
            <li onClick={() => showMessage("Menu Film diklik")} className="cursor-pointer hover:text-red-500 transition-colors">Film</li>
            <li onClick={() => showMessage("Menu Terpopuler diklik")} className="cursor-pointer hover:text-red-500 transition-colors">Terpopuler</li>
          </ul>
        </div>

        <div className="flex items-center gap-4 md:gap-6 text-white">
          <Search onClick={() => showMessage("Fitur Pencarian dibuka")} className="w-5 h-5 cursor-pointer hover:text-blue-500 transition-colors" />
          <Bell onClick={() => showMessage("Tidak ada notifikasi baru")} className="hidden md:block w-5 h-5 cursor-pointer hover:text-blue-500 transition-colors" />
          <div onClick={() => showMessage("Menu Profil dibuka")} className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-red-600 to-blue-600 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5)] group-hover:shadow-[0_0_15px_rgba(220,38,38,0.6)] transition-all">
              <User className="w-5 h-5 text-white" />
            </div>
            <ChevronDown className="hidden md:block w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </nav>
  );
};

// --- KOMPONEN BARIS FILM (CAROUSEL) ---
const MovieRow = ({ title, movies, showMessage }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="px-6 md:px-12 py-6 group/row relative z-10">
      <RevealOnScroll>
        <h3 className="text-white text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)]"></span>
          {title}
        </h3>
        
        {/* Container Scroll */}
        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x scroll-smooth relative">
          {movies.map((movie, idx) => {
            const imgUrl = movie.cover || movie.image || movie.img || movie.thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop";
            
            return (
              <div 
                key={movie.id || idx} 
                onClick={() => showMessage(`Membuka detail untuk film: ${movie.title}`)}
                className="relative min-w-[160px] md:min-w-[260px] h-[240px] md:h-[150px] rounded-md overflow-hidden cursor-pointer snap-start transition-all duration-300 hover:scale-105 hover:z-20 hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] border border-transparent hover:border-blue-500/60 group bg-gray-900"
              >
                <img 
                  src={imgUrl} 
                  alt={movie.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay Interaktif */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 border-b-4 border-red-600 pointer-events-none">
                  <h4 className="text-white font-bold text-sm md:text-base drop-shadow-md truncate">{movie.title}</h4>
                  <div className="flex gap-2 mt-2 pointer-events-auto">
                    {/* Tombol Play (event.stopPropagation mencegah klik card parent ikut terpicu) */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); 
                        showMessage(`▶ Memutar film: ${movie.title}`);
                      }}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center hover:bg-red-600 transition-colors group/btn shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                    >
                      <Play className="w-4 h-4 md:w-5 md:h-5 text-black fill-black group-hover/btn:text-white group-hover/btn:fill-white ml-1" />
                    </button>
                    
                    {/* Tombol Info */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); 
                        showMessage(`ℹ Info selengkapnya tentang: ${movie.title}`);
                      }}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-gray-400 bg-black/50 flex items-center justify-center hover:border-blue-500 transition-colors text-white"
                    >
                      <Info className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </RevealOnScroll>
    </div>
  );
};

// --- KOMPONEN UTAMA ---
export default function App() {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Custom Alert/Message Box
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    // Fungsi Fetching Data
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        const homeRes = await fetch('/api/homepage-content');
        const homeData = await homeRes.json();
        
        const popRes = await fetch('/api/popular-search');
        const popData = await popRes.json();

        if (homeData.status === 'success' && homeData.data?.length > 0) {
          setTrending(homeData.data);
        } else { throw new Error("Kosong"); }

        if (popData.status === 'success' && popData.data?.length > 0) {
          setPopular(popData.data);
        } else { throw new Error("Kosong"); }

      } catch (error) {
        // Fallback jika API Vercel belum siap
        setTrending(FALLBACK_TRENDING);
        setPopular(FALLBACK_SCIFI);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-red-500">
        <Loader2 className="w-12 h-12 animate-spin mb-4 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
        <p className="text-xl font-mono tracking-widest animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">
          MEMUAT DATA...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] font-sans overflow-x-hidden selection:bg-red-600 selection:text-white pb-20">
      {/* Modal Popup pengganti Alert */}
      <MessageBox message={alertMessage} onClose={() => setAlertMessage(null)} />
      
      <Navbar showMessage={setAlertMessage} />
      
      {/* Kontainer Utama tanpa Landing Page (Diberi padding atas pt-24 agar tidak tertutup Navbar) */}
      <div className="pt-24 relative z-20">
        <MovieRow 
          title="Sedang Tren Saat Ini" 
          movies={trending} 
          showMessage={setAlertMessage} 
        />
        
        <MovieRow 
          title="Sci-Fi & Cyberpunk" 
          movies={popular} 
          showMessage={setAlertMessage} 
        />
        
        {/* Render baris tambahan agar layar penuh */}
        <MovieRow 
          title="Rekomendasi Teratas" 
          movies={[...trending].reverse()} 
          showMessage={setAlertMessage} 
        />
        
        <MovieRow 
          title="Baru Ditambahkan" 
          movies={[...popular].reverse()} 
          showMessage={setAlertMessage} 
        />
      </div>

      <footer className="mt-12 px-6 md:px-12 py-8 border-t border-red-900/20">
        <RevealOnScroll>
          <div className="flex flex-col items-center justify-center text-gray-500 text-sm gap-4">
            <h1 className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-900 to-blue-900 opacity-70">
              NEO<span className="text-gray-700">STREAM</span>
            </h1>
            <p>© 2026 NeoStream Serverless. Sistem Berjalan Normal.</p>
          </div>
        </RevealOnScroll>
      </footer>
    </div>
  );
}


