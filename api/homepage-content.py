from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*') 
        self.end_headers()
        
        try:
            # Import module Search/SearchSync dari moviebox_api
            try:
                from moviebox_api.core import SearchSync as Search
            except ImportError:
                from moviebox_api.core import Search
            
            # Melakukan pencarian keyword "2024" untuk mensimulasikan konten Trending/Terbaru
            search_query = Search("2024")
            
            # Jika menggunakan method .get_results(), kita panggil. Jika iterable biasa, langsung di-loop
            raw_results = search_query.get_results() if hasattr(search_query, 'get_results') else search_query
            
            results = []
            for item in raw_results:
                # Cek apakah item sudah berupa dictionary
                if isinstance(item, dict):
                    results.append(item)
                else:
                    # Jika berupa Object, kita konversi (ekstrak) ke dictionary agar bisa dikirim sebagai JSON
                    results.append({
                        "id": getattr(item, 'id', None),
                        "title": getattr(item, 'title', getattr(item, 'name', 'Tanpa Judul')),
                        "cover": getattr(item, 'cover', getattr(item, 'poster', getattr(item, 'image', None))),
                        "year": getattr(item, 'year', None),
                        "match": getattr(item, 'rating', '90% Kecocokan')
                    })
                    
            response_data = {"status": "success", "data": results}
            
        except Exception as e:
            response_data = {"status": "error", "message": f"Moviebox Error: {str(e)}"}

        self.wfile.write(json.dumps(response_data).encode('utf-8'))
