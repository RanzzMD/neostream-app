from http.server import BaseHTTPRequestHandler
import json
# Asumsi fungsi ini ada di helper atau core
from moviebox_api import helpers 

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        try:
            hosts = helpers.get_mirror_hosts()
            response_data = {"status": "success", "hosts": hosts}
        except Exception as e:
            response_data = {"status": "error", "message": str(e)}

        self.wfile.write(json.dumps(response_data).encode('utf-8'))
      
