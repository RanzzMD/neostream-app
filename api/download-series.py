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
        season = query_components.get("season", ["1"])[0]
        episode = query_components.get("episode", ["1"])[0]
        
        try:
            if query:
                search_results = core.search(query)
                if not search_results:
                     raise ValueError("Series not found")
                
                first_series = search_results[0]
                
                # Sesuaikan logika ini
                download_links = download.get_series_episode_links(first_series['id'], season, episode) 
                
                response_data = {"status": "success", "series": first_series, "links": download_links}
            else:
                response_data = {"status": "error", "message": "Missing 'query' parameter"}
        except Exception as e:
            response_data = {"status": "error", "message": str(e)}

        self.wfile.write(json.dumps(response_data).encode('utf-8'))
      
