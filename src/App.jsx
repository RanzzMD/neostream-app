import React, { useState, useEffect, useRef } from 'react';
import { Play, Info, Search, Bell, User, ChevronDown, Loader2 } from 'lucide-react';

// --- DATA CADANGAN (Digunakan jika API Vercel gagal/belum siap) ---
const FALLBACK_FEATURED = {
  title: "RED HORIZON",
  description: "Ketika faksi biru mencoba mengambil alih jaringan utama, seorang pemberontak dari sektor merah harus menyusup ke inti sistem untuk mencegah kehancuran total.",
  match: "99% Kecocokan",
  year: "2026",
  age: "18+",
  duration: "2j 30m",
  image: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&q=80&w=1925&ixlib=rb-4.0.3" 
};

const FALLBACK_TRENDING = [
  { id: 1, title: "Crimson Protocol", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600" },
  { id: 2, title: "Blue Shift", img: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=600" },
  { id: 3, title: "Neon Blood", img: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=600" },
  { id: 4, title: "The Matrix Hack", img: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&q=80&w=600" },
  { id: 5, title: "Cyber Warfare", img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=600" },
];

const FALLBACK_SCIFI = [
  { id: 6, title: "Deep Space Red", img: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=600" },
  { id: 7, title: "Azure Colony", img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=600" },
  { id: 8, title: "Mars Uprising", img: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&q=80&w=600" },
  { id: 9, title: "Cobalt Core", img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600" },
  { id: 10, title: "Time Paradox", img: "https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?auto=format&fit=crop&q=80&w=600" },
];

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
      { threshold: 0.15 }
    );
    
    if (ref.current) observer.observe(ref.current);
    
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

// --- KOMPONEN NAVIGASI ---
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-black/90 backdrop-blur-md shadow-[0_4px_30px_rgba(220,38,38,0.15)] border-b border-red-900/30' : 'bg-gradient-to-b from-black/90 to-transparent'}`}>
      <div className="flex items-center justify-between px-6 md:px-12 py-4">
        <div className="flex items-center gap-8">
          {/* Logo dengan Gradasi Merah ke Biru */}
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.6)] cursor-pointer hover:from-blue-500 hover:to-red-600 transition-all duration-500">
            NEO<span className="text-white">STREAM</span>
          </h1>
          
          <ul className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
            <li className="text-white cursor-pointer hover:text-red-500 transition-colors">Beranda</li>
            <li className="cursor-pointer hover:text-red-500 transition-colors">Serial TV</li>
            <li className="cursor-pointer hover:text-red-500 transition-colors">Film</li>
            <li className="cursor-pointer hover:text-red-500 transition-colors">Terpopuler</li>
          </ul>
        </div>

        <div className="flex items-center gap-4 md:gap-6 text-white">
          <Search className="w-5 h-5 cursor-pointer hover:text-blue-500 transition-colors" />
          <Bell className="hidden md:block w-5 h-5 cursor-pointer hover:text-blue-500 transition-colors" />
          <div className="flex items-center gap-2 cursor-pointer group">
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

// --- KOMPONEN BANNER UTAMA (HERO) ---
const Hero = ({ movie }) => {
  if (!movie) return <div className="w-full h-[85vh] bg-black animate-pulse" />;

  // Pengecekan properti gambar yang tangguh (menyesuaikan format API moviebox)
  const imageUrl = movie.cover || movie.image || movie.img || movie.thumbnail || FALLBACK_FEATURED.image;

  return (
    <div className="relative w-full h-[85vh] text-white">
      <div className="absolute top-0 left-0 w-full h-full">
        <img 
          src={imageUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent" />
      </div>

      <div className="relative h-full flex flex-col justify-center px-6 md:px-12 lg:w-1/2 pt-20">
        <RevealOnScroll delay={0}>
          <h2 className="text-5xl md:text-8xl font-black mb-4 tracking-tighter text-white drop-shadow-[0_0_15px_rgba(220,38,38,0.4)]">
            {movie.title}
          </h2>
        </RevealOnScroll>
        
        <RevealOnScroll delay={200}>
          <div className="flex items-center gap-4 text-sm md:text-base mb-6 font-semibold flex-wrap">
            <span className="text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]">{movie.match || "98% Kecocokan"}</span>
            <span>{movie.year || new Date().getFullYear()}</span>
            <span className="border border-gray-500 px-2 py-0.5 rounded text-gray-300">{movie.age || "18+"}</span>
            <span className="border border-red-500 text-red-400 px-2 py-0.5 rounded text-xs tracking-widest shadow-[0_0_5px_rgba(220,38,38,0.5)]">HD</span>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={400}>
          <p className="text-gray-300 text-base md:text-xl mb-8 leading-relaxed max-w-2xl font-light line-clamp-3">
            {movie.description || "Pertarungan epik antara faksi merah dan biru di dunia cyberpunk. Saksikan ketegangan yang belum pernah Anda rasakan sebelumnya."}
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={600}>
          <div className="flex items-center gap-4">
            {/* Tombol Play - Tema Merah */}
            <button className="flex items-center gap-2 px-6 py-3 md:px-8 bg-white text-black font-bold rounded hover:bg-red-600 hover:text-white hover:shadow-[0_0_20px_rgba(220,38,38,0.8)] transition-all duration-300 group">
              <Play className="w-5 h-5 md:w-6 md:h-6 fill-black group-hover:fill-white" />
              Putar
            </button>
            {/* Tombol Detail - Tema Biru */}
            <button className="flex items-center gap-2 px-6 py-3 md:px-8 bg-gray-800/50 text-white font-bold rounded backdrop-blur-sm hover:bg-gray-800/80 transition-all border border-transparent hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]">
              <Info className="w-5 h-5 md:w-6 md:h-6" />
              Detail
            </button>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  );
};

// --- KOMPONEN BARIS FILM (CAROUSEL) ---
const MovieRow = ({ title, movies }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="px-6 md:px-12 py-8 group/row">
      <RevealOnScroll>
        <h3 className="text-white text-lg md:text-2xl font-bold mb-4 flex items-center gap-2">
          {/* Aksen Judul Baris - Merah */}
          <span className="w-1.5 h-6 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)]"></span>
          {title}
        </h3>
        
        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x scroll-smooth">
          {movies.map((movie, idx) => {
            const imgUrl = movie.cover || movie.image || movie.img || movie.thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop";
            
            return (
              <div 
                key={movie.id || idx} 
                className="relative min-w-[150px] md:min-w-[280px] h-[225px] md:h-[160px] rounded-md overflow-hidden cursor-pointer snap-start transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] border border-transparent hover:border-blue-500/60 group bg-gray-900"
              >
                <img 
                  src={imgUrl} 
                  alt={movie.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 md:p-4 border-b-4 border-red-600">
                  <h4 className="text-white font-bold text-xs md:text-base drop-shadow-md truncate">{movie.title}</h4>
                  <div className="flex gap-2 mt-2">
                    <button className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center hover:bg-red-600 transition-colors group/btn">
                      <Play className="w-3 h-3 md:w-4 md:h-4 text-black fill-black group-hover/btn:text-white group-hover/btn:fill-white" />
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
  const [featured, setFeatured] = useState(null);
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fungsi untuk mengambil data dari backend API Python (Vercel)
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        
        // Memanggil API konten beranda
        const homeRes = await fetch('/api/homepage-content');
        const homeData = await homeRes.json();
        
        // Memanggil API popular search
        const popRes = await fetch('/api/popular-search');
        const popData = await popRes.json();

        // Validasi dan set data Trending / Hero
        if (homeData.status === 'success' && homeData.data?.length > 0) {
          setTrending(homeData.data);
          setFeatured(homeData.data[0]); 
        } else {
          throw new Error("Data homepage kosong");
        }

        // Validasi dan set data Popular
        if (popData.status === 'success' && popData.data?.length > 0) {
          setPopular(popData.data);
        } else {
           setPopular(FALLBACK_SCIFI);
        }

      } catch (error) {
        console.warn("Koneksi API Gagal. Menggunakan antarmuka Cadangan (Fallback)...", error);
        
        // Menggunakan data dummy merah biru jika serverless API belum berjalan
        setFeatured(FALLBACK_FEATURED);
        setTrending(FALLBACK_TRENDING);
        setPopular(FALLBACK_SCIFI);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, []);

  // Tampilan Loading dengan tema Merah Biru
  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-red-500">
        <Loader2 className="w-12 h-12 animate-spin mb-4 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
        <p className="text-xl font-mono tracking-widest animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">
          MENGHUBUNGKAN KE SERVER...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] font-sans overflow-x-hidden selection:bg-red-600 selection:text-white pb-20">
      <Navbar />
      <Hero movie={featured} />
      
      <div className="-mt-10 relative z-20">
        <MovieRow title="Sedang Tren di Jaringan" movies={trending} />
        <MovieRow title="Pencarian Populer" movies={popular} />
        
        {/* Render baris ekstra jika data cukup */}
        {trending.length > 0 && (
           <MovieRow title="Rekomendasi Sistem (Red-Picks)" movies={[...trending].reverse()} />
        )}
      </div>

      <footer className="mt-20 px-6 md:px-12 py-8 border-t border-red-900/20">
        <RevealOnScroll>
          <div className="flex flex-col items-center justify-center text-gray-500 text-sm gap-4">
            <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-900 to-blue-900 opacity-70">
              NEO<span className="text-gray-700">STREAM</span>
            </h1>
            <p>© 2026 NeoStream Serverless Edition. Node Aktif.</p>
          </div>
        </RevealOnScroll>
      </footer>
    </div>
  );
}


