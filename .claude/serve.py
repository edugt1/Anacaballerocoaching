import functools
import os
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8789

handler = functools.partial(SimpleHTTPRequestHandler, directory=ROOT)
httpd = HTTPServer(("127.0.0.1", PORT), handler)
print(f"Serving {ROOT} at http://127.0.0.1:{PORT}", flush=True)
httpd.serve_forever()
