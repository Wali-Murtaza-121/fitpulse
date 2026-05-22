from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import os
import sys

# Add parent dir to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from db import init_db
from routes.workouts import handle_workouts
from routes.stats import handle_stats

ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000")

class FitPulseHandler(BaseHTTPRequestHandler):

    def log_message(self, format, *args):
        print(f"[{self.command}] {self.path} → {args[0] if args else ''}")

    def send_json(self, status: int, data: dict):
        body = json.dumps(data, default=str).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        # CORS headers
        origin = self.headers.get("Origin", "")
        allowed = ALLOWED_ORIGINS.split(",")
        if origin in allowed or "*" in allowed:
            self.send_header("Access-Control-Allow-Origin", origin)
        else:
            self.send_header("Access-Control-Allow-Origin", allowed[0])
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        origin = self.headers.get("Origin", "*")
        self.send_header("Access-Control-Allow-Origin", origin)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def read_body(self):
        length = int(self.headers.get("Content-Length", 0))
        return self.rfile.read(length).decode("utf-8") if length > 0 else None

    def do_GET(self):
        path = self.path.split("?")[0]
        if path == "/api/workouts":
            handle_workouts("GET", path, None, self.send_json)
        elif path == "/api/stats":
            handle_stats("GET", path, None, self.send_json)
        elif path == "/health":
            self.send_json(200, {"status": "ok", "service": "fitpulse-backend"})
        else:
            self.send_json(404, {"error": f"Route {path} not found"})

    def do_POST(self):
        path = self.path.split("?")[0]
        body = self.read_body()
        if path == "/api/workouts":
            handle_workouts("POST", path, body, self.send_json)
        else:
            self.send_json(404, {"error": f"Route {path} not found"})


def run():
    port = int(os.environ.get("PORT", 8000))
    print(f"🚀 FitPulse Backend starting on port {port}")
    init_db()
    server = HTTPServer(("0.0.0.0", port), FitPulseHandler)
    print(f"Server ready at http://0.0.0.0:{port}")
    server.serve_forever()


if __name__ == "__main__":
    run()