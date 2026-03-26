import React, { useState, useEffect, useRef } from 'react';
import { Play, Info, Search, Bell, User, ChevronDown, Loader2, X, AlertTriangle } from 'lucide-react';

// --- KOMPONEN POPUP MESSAGE (Ganti Alert Bawaan) ---
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
            onClick={() => showMessage("Koneksi API: Aktif. Anda berada di Beranda.")}
            className="text-2xl md:text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.6)] cursor-pointer hover:from-blue-500 hover:to-red-600 transition-all duration-500"
          >
            NEO<span className="text-white">STREAM</span>
          </h1>
          
          <ul className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
            <li onClick={() => showMessage("Menu Beranda diklik")} className="cursor-pointer hover:text-red-500 transition-colors">Beranda</li>
            <li onClick={() => showMessage("Menu Serial TV diklik")} className="cursor-pointer hover:text-red-500 transition-colors">Serial TV</li>
            <li onClick={() => showMessage("Menu Film diklik")} className="cursor-pointer hover:text-red-500 transition-colors">Film</li>
          </ul>
        </div>

        <div className="flex items-center gap-4 md:gap-6 text-white">
          <Search onClick={() => showMessage("Fitur Pencarian API akan segera hadir")} className="w-5 h-5 cursor-pointer hover:text-blue-500 transition-colors" />
          <Bell onClick={() => showMessage("Sistem berjalan optimal")} className="hidden md:block w-5 h-5 cursor-pointer hover:text-blue-500 transition-colors" />
          <div onClick={() => showMessage("Mengakses node profil")} className="flex items-center gap-2 cursor-pointer group">
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
        
        {/* Container Scroll Horizontal */}
        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x scroll-smooth relative">
          {movies.map((movie, idx) => {
            // Mengekstrak URL gambar dari respons API Moviebox secara dinamis
            const imgUrl = movie.cover || movie.poster || movie.image || movie.thumbnail || movie.img || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop";
            
            return (
              <div 
                key={movie.id || idx} 
                onClick={() => showMessage(`Membuka detail API untuk: ${movie.title || movie.name}`)}
                className="relative min-w-[160px] md:min-w-[260px] h-[240px] md:h-[150px] rounded-md overflow-hidden cursor-pointer snap-start transition-all duration-300 hover:scale-105 hover:z-20 hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] border border-transparent hover:border-blue-500/60 group bg-gray-900 flex-shrink-0"
              >
                <img 
                  src={imgUrl} 
                  alt={movie.title || movie.name || "Movie Poster"} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay Interaktif */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 border-b-4 border-red-600 pointer-events-none">
                  <h4 className="text-white font-bold text-sm md:text-base drop-shadow-md truncate">
                    {movie.title || movie.name || "Tanpa Judul"}
                  </h4>
                  <div className="flex gap-2 mt-2 pointer-events-auto">
                    {/* Tombol Play */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); 
                        showMessage(`▶ Memutar stream untuk ID: ${movie.id || 'N/A'}`);
                      }}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center hover:bg-red-600 transition-colors group/btn shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                    >
                      <Play className="w-4 h-4 md:w-5 md:h-5 text-black fill-black group-hover/btn:text-white group-hover/btn:fill-white ml-1" />
                    </button>
                    
                    {/* Tombol Info */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); 
                        showMessage(`ℹ Info: Mengambil /api/item-details?id=${movie.id || 'N/A'}`);
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
  const [homeContent, setHomeContent] = useState([]);
  const [popularContent, setPopularContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  
  // State untuk Custom Alert
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    // Fungsi Fetching Murni dari Vercel API (Tanpa Dummy Data)
    const fetchApiData = async () => {
      try {
        setLoading(true);
        setApiError(null);
        
        // 1. Fetch Beranda
        const homeRes = await fetch('/api/homepage-content');
        if (!homeRes.ok) throw new Error(`HTTP Error: ${homeRes.status}`);
        const homeData = await homeRes.json();
        
        // 2. Fetch Popular
        const popRes = await fetch('/api/popular-search');
        if (!popRes.ok) throw new Error(`HTTP Error: ${popRes.status}`);
        const popData = await popRes.json();

        // Validasi struktur JSON (sesuaikan dengan format output moviebox-api Anda)
        if (homeData.status === 'success' && Array.isArray(homeData.data)) {
          setHomeContent(homeData.data);
        } else { 
          throw new Error(homeData.message || "Gagal memuat struktur Beranda dari API"); 
        }

        if (popData.status === 'success' && Array.isArray(popData.data)) {
          setPopularContent(popData.data);
        } else { 
          // Jika popular search kosong, kita biarkan saja array kosong
          setPopularContent([]); 
        }

      } catch (error) {
        console.error("API Fetch Error:", error);
        setApiError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApiData();
  }, []);

  // --- RENDER LOADING ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-red-500">
        <Loader2 className="w-12 h-12 animate-spin mb-4 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
        <p className="text-xl font-mono tracking-widest animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">
          MENGHUBUNGKAN KE VERCEL API...
        </p>
      </div>
    );
  }

  // --- RENDER ERROR API (Jika API gagal diakses) ---
  if (apiError) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="w-16 h-16 text-red-600 mb-6 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)] animate-bounce" />
        <h1 className="text-3xl font-black text-white mb-2">KONEKSI API TERPUTUS</h1>
        <p className="text-gray-400 mb-8 max-w-md">
          Sistem gagal mengambil data dari <span className="text-blue-400 font-mono">/api/homepage-content</span>. 
          <br/><br/>
          Detail Error: <span className="text-red-400">{apiError}</span>
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-gradient-to-r from-red-600 to-blue-600 rounded font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105 transition-transform"
        >
          COBA HUBUNGKAN ULANG
        </button>
      </div>
    );
  }

  // --- RENDER BERHASIL (Menampilkan Data API) ---
  return (
    <div className="min-h-screen bg-[#09090b] font-sans overflow-x-hidden selection:bg-red-600 selection:text-white pb-20">
      <MessageBox message={alertMessage} onClose={() => setAlertMessage(null)} />
      
      <Navbar showMessage={setAlertMessage} />
      
      {/* Kontainer Utama */}
      <div className="pt-24 relative z-20">
        
        {/* Row 1: Menampilkan separuh pertama dari homepage-content */}
        <MovieRow 
          title="Konten Beranda (API)" 
          movies={homeContent.slice(0, Math.ceil(homeContent.length / 2))} 
          showMessage={setAlertMessage} 
        />

        {/* Row 2: Menampilkan Pencarian Populer dari API */}
        {popularContent.length > 0 && (
          <MovieRow 
            title="Pencarian Populer" 
            movies={popularContent} 
            showMessage={setAlertMessage} 
          />
        )}
        
        {/* Row 3: Menampilkan sisa dari homepage-content agar UI terlihat padat */}
        {homeContent.length > 5 && (
          <MovieRow 
            title="Eksplorasi Lanjutan" 
            movies={homeContent.slice(Math.ceil(homeContent.length / 2))} 
            showMessage={setAlertMessage} 
          />
        )}

      </div>

      <footer className="mt-12 px-6 md:px-12 py-8 border-t border-red-900/20">
        <RevealOnScroll>
          <div className="flex flex-col items-center justify-center text-gray-500 text-sm gap-4">
            <h1 className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-900 to-blue-900 opacity-70">
              NEO<span className="text-gray-700">STREAM</span>
            </h1>
            <p>© 2026 NeoStream Serverless. Connected to Vercel API Nodes.</p>
          </div>
        </RevealOnScroll>
      </footer>
    </div>
  );
}


