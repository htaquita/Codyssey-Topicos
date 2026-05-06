from http.server import BaseHTTPRequestHandler
import json, subprocess, sys

def execute_code(code: str) -> dict:
    try:
        result = subprocess.run(
            [sys.executable, "-c", code],
            capture_output=True,
            text=True,
            timeout=5,
        )
        return {
            "stdout": result.stdout,
            "stderr": result.stderr,
            "success": result.returncode == 0
        }
    except subprocess.TimeoutExpired:
        return {"error": "Tempo limite excedido", "success": False}

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length))
        
        code = body.get("code", "")
        expected = (body.get("expected_output") or "").strip()
        
        result = execute_code(code)
        
        if not result.get("success"):
            response = {
                "passed": False,
                "feedback": result.get("stderr") or result.get("error")
            }
        else:
            actual = result["stdout"].strip()
            passed = actual == expected
            response = {
                "passed": passed,
                "actual_output": actual,
                "expected_output": expected,
                "feedback": "Correto!" if passed else f"Esperado: '{expected}', mas recebeu: '{actual}'"
            }
        
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(json.dumps(response).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()