from fastapi import APIRouter
from pydantic import BaseModel
from app.services.executor import execute_code

router = APIRouter()

class CodePayload(BaseModel):
    code: str
    expected_output: str | None = None

@router.post("/run-code")
def run_code(payload: CodePayload):
    result = execute_code(payload.code)
    return result

@router.post("/check-exercise")
def check_exercise(payload: CodePayload):
    result = execute_code(payload.code)
    
    if not result.get("success"):
        return {"passed": False, "feedback": result.get("stderr") or result.get("error")}
    
    actual = result["stdout"].strip()
    expected = (payload.expected_output or "").strip()
    passed = actual == expected
    
    return {
        "passed": passed,
        "actual_output": actual,
        "expected_output": expected,
        "feedback": "Correto!" if passed else f"Esperado: '{expected}', mas recebeu: '{actual}'"
    }