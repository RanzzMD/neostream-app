import React, { useState, useEffect, useRef } from 'react';
import { Play, Info, Search, Bell, User, ChevronDown, Loader2 } from 'lucide-react';

// --- DATA FALLBACK (Akan digunakan jika API Vercel belum siap/gagal) ---
const FALLBACK_FEATURED = {
  title: "NEO: AWAKENING",
  description: "Di dunia di mana realitas adalah ilusi yang dikendalikan oleh AI raksasa, seorang peretas muda menemukan kunci untuk membebaskan umat manusia. Namun, kebebasan memiliki harga yang sangat mahal.",
  match: "98% Kecocokan",
  year: "2026",
  age: "18+",
  duration: "2j 15m",
  image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1925&ixlib=rb-4.0.3" 
};

const FALLBACK_TRENDING = [
  { id: 1, title: "Cyber Grid", img: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&q=80&w=600" },
  { id: 2, title: "Neon Nights", img: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=600" },
  { id: 3, title: "Synthwave", img: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=600" },
  { id: 4, title: "Hacker's Den", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600" },
  { id: 5, title: "Virtual Reality", img: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&q=80&w=600" },
];

const FALLBACK_SCIFI = [
  { id: 6, title: "Starborne", img: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=600" },
  { id: 7, title: "The Void", img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=600" },
  { id: 8, title: "Mars Colony", img: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&q=80&w=600" },
  { id: 9, title: "Quantum", img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600" },
  { id: 10, title: "Time Loop", img: "https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?auto=format&fit=crop&q=80&w=600" },
];

// --- KOMPONEN ANIMASI SCROLL ---
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
      { threshold: 0.15 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) observer.disconnect();
    };
  }, []);

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-24'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- KOMPONEN NAVBAR ---
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-black/90 backdrop-blur-md shadow-[0_4px_30px_rgba(0,243,255,0.1)] border-b border-cyan-900/30' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="flex items-center justify-between px-6 md:px-12 py-4">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 drop-shadow-[0_0_10px_rgba(0,243,255,0.8)] cursor-pointer">
            NEO<span className="text-white">STREAM</span>
          </h1>
          
          <ul className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
            <li className="text-white cursor-pointer hover:text-cyan-400 transition-colors">Beranda</li>
            <li className="cursor-pointer hover:text-cyan-400 transition-colors">Serial TV</li>
            <li className="cursor-pointer hover:text-cyan-400 transition-colors">Film</li>
            <li className="cursor-pointer hover:text-cyan-400 transition-colors">Terpopuler</li>
          </ul>
        </div>

        <div className="flex items-center gap-4 md:gap-6 text-white">
          <Search className="w-5 h-5 cursor-pointer hover:text-fuchsia-500 transition-colors" />
          <Bell className="hidden md:block w-5 h-5 cursor-pointer hover:text-fuchsia-500 transition-colors" />
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-cyan-500 to-fuchsia-500 flex items-center justify-center shadow-[0_0_10px_rgba(255,0,255,0.5)]">
              <User className="w-5 h-5 text-white" />
            </div>
            <ChevronDown className="hidden md:block w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </nav>
  );
};

// --- KOMPONEN HERO ---
const Hero = ({ movie }) => {
  if (!movie) return <div className="w-full h-[85vh] bg-black animate-pulse" />;

  return (
    <div className="relative w-full h-[85vh] text-white">
      <div className="absolute top-0 left-0 w-full h-full">
        <img 
          src={movie.image || movie.img || movie.cover || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1925&ixlib=rb-4.0.3"} 
          alt={movie.title} 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent" />
      </div>

      <div className="relative h-full flex flex-col justify-center px-6 md:px-12 lg:w-1/2 pt-20">
        <RevealOnScroll delay={0}>
          <h2 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            {movie.title}
          </h2>
        </RevealOnScroll>
        
        <RevealOnScroll delay={200}>
          <div className="flex items-center gap-4 text-sm md:text-base mb-6 font-semibold flex-wrap">
            <span className="text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]">{movie.match || "95% Kecocokan"}</span>
            <span>{movie.year || "2026"}</span>
            <span className="border border-gray-500 px-2 py-0.5 rounded text-gray-300">{movie.age || "18+"}</span>
            <span className="border border-cyan-500 text-cyan-400 px-2 py-0.5 rounded text-xs tracking-widest shadow-[0_0_5px_rgba(0,243,255,0.5)]">HD</span>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={400}>
          <p className="text-gray-300 text-base md:text-xl mb-8 leading-relaxed max-w-2xl font-light line-clamp-3">
            {movie.description || "Sebuah petualangan luar biasa di dunia cybernetic. Siapkan diri Anda untuk pengalaman visual yang belum pernah ada sebelumnya."}
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={600}>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 md:px-8 bg-white text-black font-bold rounded hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(0,243,255,0.8)] transition-all duration-300 group">
              <Play className="w-5 h-5 md:w-6 md:h-6 fill-black group-hover:fill-black" />
              Putar
            </button>
            <button className="flex items-center gap-2 px-6 py-3 md:px-8 bg-gray-500/50 text-white font-bold rounded backdrop-blur-sm hover:bg-gray-500/80 transition-all border border-transparent hover:border-fuchsia-500 hover:shadow-[0_0_20px_rgba(255,0,255,0.4)]">
              <Info className="w-5 h-5 md:w-6 md:h-6" />
              Detail
            </button>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  );
};

// --- KOMPONEN BARIS FILM ---
const MovieRow = ({ title, movies }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="px-6 md:px-12 py-8 group/row">
      <RevealOnScroll>
        <h3 className="text-white text-lg md:text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(0,243,255,0.8)]"></span>
          {title}
        </h3>
        
        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x scroll-smooth">
          {movies.map((movie, idx) => (
            <div 
              key={movie.id || idx} 
              className="relative min-w-[150px] md:min-w-[280px] h-[225px] md:h-[160px] rounded-md overflow-hidden cursor-pointer snap-start transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] border border-transparent hover:border-cyan-500/50 group bg-gray-900"
            >
              <img 
                src={movie.img || movie.image_url || movie.cover || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop"} 
                alt={movie.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 md:p-4">
                <h4 className="text-white font-bold text-xs md:text-base drop-shadow-md truncate">{movie.title}</h4>
                <div className="flex gap-2 mt-2">
                  <button className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center hover:bg-cyan-400 transition-colors">
                    <Play className="w-3 h-3 md:w-4 md:h-4 text-black fill-black" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </RevealOnScroll>
    </div>
  );
};

// --- KOMPONEN UTAMA (APP) ---
export default function App() {
  const [featured, setFeatured] = useState(null);
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fungsi untuk memanggil Vercel API backend Python Anda
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Memanggil API konten beranda (Python Backend Vercel)
        const homeRes = await fetch('/api/homepage-content');
        const homeData = await homeRes.json();
        
        // Memanggil API popular search (Python Backend Vercel)
        const popRes = await fetch('/api/popular-search');
        const popData = await popRes.json();

        if (homeData.status === 'success' && homeData.data?.length > 0) {
          setTrending(homeData.data);
          setFeatured(homeData.data[0]); // Jadikan item pertama sebagai Hero
        } else {
          throw new Error("No homepage data");
        }

        if (popData.status === 'success' && popData.data?.length > 0) {
          setPopular(popData.data);
        } else {
           setPopular(FALLBACK_SCIFI); // Fallback jika kosong
        }

      } catch (error) {
        console.warn("API Gagal/Belum siap. Memuat Fallback UI...", error);
        // Memuat data dummy jika endpoint /api belum di-deploy di Vercel
        setFeatured(FALLBACK_FEATURED);
        setTrending(FALLBACK_TRENDING);
        setPopular(FALLBACK_SCIFI);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-cyan-400">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="text-xl font-mono tracking-widest animate-pulse">CONNECTING TO NEONET...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] font-sans overflow-x-hidden selection:bg-fuchsia-500 selection:text-white pb-20">
      <Navbar />
      <Hero movie={featured} />
      
      <div className="-mt-10 relative z-20">
        <MovieRow title="Sedang Tren di Server" movies={trending} />
        <MovieRow title="Pencarian Populer" movies={popular} />
        
        {/* Opsional: Tampilkan hasil render fallback jika daftar terbatas */}
        {trending.length > 0 && (
           <MovieRow title="Rekomendasi AI (Cyber-picks)" movies={[...trending].reverse()} />
        )}
      </div>

      <footer className="mt-20 px-6 md:px-12 py-8 border-t border-cyan-900/30">
        <RevealOnScroll>
          <div className="flex flex-col items-center justify-center text-gray-500 text-sm gap-4">
            <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-400">
              NEO<span className="text-gray-700">STREAM</span>
            </h1>
            <p>© 2026 NeoStream Serverless Edition. Connected to Vercel Nodes.</p>
          </div>
        </RevealOnScroll>
      </footer>
    </div>
  );
}

            
