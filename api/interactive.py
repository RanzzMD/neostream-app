from http.server import BaseHTTPRequestHandler
import json
from moviebox_api import core, download

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        # Baca body request (JSON) dari Frontend React
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        payload = json.loads(post_data.decode('utf-8'))
        
        action = payload.get("action")
        
        try:
            if action == "search":
                query = payload.get("query")
                results = core.search(query)
                response_data = {"status": "success", "data": results}
            
            elif action == "get_links":
                item_id = payload.get("id")
                # Simulasi interaksi CLI mendapatkan link
                links = download.get_movie_download_links(item_id)
                response_data = {"status": "success", "links": links}
                
            else:
                response_data = {"status": "error", "message": "Unknown action"}
                
        except Exception as e:
            response_data = {"status": "error", "message": str(e)}

        self.wfile.write(json.dumps(response_data).encode('utf-8'))
      
