import http.server
import socketserver
import os

os.chdir('/Users/kamiya/Desktop/SANGLIER')
PORT = 3456

Handler = http.server.SimpleHTTPRequestHandler
Handler.extensions_map.update({'.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript'})

with socketserver.TCPServer(('', PORT), Handler) as httpd:
    httpd.serve_forever()
