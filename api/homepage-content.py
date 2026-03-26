from http.server import BaseHTTPRequestHandler
import json
from moviebox_api import core

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*') 
        self.end_headers()
        
        try:
            # Sesuaikan dengan API yang sebenarnya di dokumentasi moviebox
            results = core.get_homepage_content() 
            response_data = {"status": "success", "data": results}
        except Exception as e:
            response_data = {"status": "error", "message": str(e)}

        self.wfile.write(json.dumps(response_data).encode('utf-8'))
      
