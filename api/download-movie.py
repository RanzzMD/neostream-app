from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json
from moviebox_api import download, core

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        query_components = parse_qs(urlparse(self.path).query)
        query = query_components.get("query", [None])[0]
        
        try:
            if query:
                # 1. Cari filmnya
                search_results = core.search(query)
                if not search_results:
                     raise ValueError("Movie not found")
                
                # Asumsi kita ambil hasil pertama
                first_movie = search_results[0]
                
                # 2. Dapatkan link download
                # Sesuaikan logika ini dengan cara kerja module download di moviebox-api
                download_links = download.get_movie_download_links(first_movie['id']) 
                
                response_data = {"status": "success", "movie": first_movie, "links": download_links}
            else:
                response_data = {"status": "error", "message": "Missing 'query' parameter"}
        except Exception as e:
            response_data = {"status": "error", "message": str(e)}

        self.wfile.write(json.dumps(response_data).encode('utf-8'))
      
