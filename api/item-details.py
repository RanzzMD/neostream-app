from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json
from moviebox_api import core

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        query_components = parse_qs(urlparse(self.path).query)
        item_id = query_components.get("id", [None])[0]
        
        try:
            if item_id:
                details = core.get_item_details(item_id)
                response_data = {"status": "success", "data": details}
            else:
                response_data = {"status": "error", "message": "Missing 'id' parameter"}
        except Exception as e:
            response_data = {"status": "error", "message": str(e)}

        self.wfile.write(json.dumps(response_data).encode('utf-8'))
      
