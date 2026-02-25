from fastapi import APIRouter, HTTPException
from typing import List, Dict
from ..monitoring_manager import MonitoringManager, MonitoringConfig, MonitoringSession

router = APIRouter(prefix="/v1/monitoring", tags=["monitoring"])
manager = MonitoringManager()

@router.post("/sessions", response_model=MonitoringSession)
async def create_session(config: MonitoringConfig):
    try:
        return manager.create_session(config)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sessions", response_model=List[Dict])
async def list_sessions():
    return manager.list_sessions()

@router.get("/sessions/{session_id}")
async def get_session_data(session_id: str):
    data = manager.get_data(session_id)
    if "error" in data:
        raise HTTPException(status_code=404, detail=data["error"])
    return data

@router.post("/sessions/{session_id}/stop")
async def stop_session(session_id: str):
    session = manager.stop_monitoring(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found or already stopped")
    return {"status": "stopped", "session_id": session_id}

# Mock data endpoint for simulation
@router.post("/sessions/{session_id}/data")
async def add_mock_data(session_id: str, data: Dict):
    manager.add_data_point(session_id, data)
    return {"status": "success"}
