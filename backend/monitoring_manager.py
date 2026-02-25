import json
import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from pathlib import Path
from pydantic import BaseModel

class MonitoringConfig(BaseModel):
    """Monitoring configuration"""
    event_type: str          # "bitcoin_price", "call_usage", "event_stream"
    duration_minutes: int    # How long to monitor
    update_frequency: int    # Updates per second
    alert_conditions: Dict   # When to alert the model
    data_source: str        # API endpoint or data source

class MonitoringSession(BaseModel):
    """Active monitoring session"""
    id: str
    config: MonitoringConfig
    start_time: datetime
    end_time: Optional[datetime] = None
    status: str              # "running", "paused", "stopped"
    data_points: List[Dict] = []
    alerts_triggered: List[Dict] = []

class MonitoringManager:
    """Manages monitoring sessions"""
    def __init__(self, data_dir: str = "backend/data/monitoring"):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.active_sessions: Dict[str, MonitoringSession] = {}
        self._load_active_sessions_list()

    def _load_active_sessions_list(self):
        active_list_path = self.data_dir / "active-sessions.json"
        if active_list_path.exists():
            try:
                with open(active_list_path, "r") as f:
                    session_ids = json.load(f)
                    for sid in session_ids:
                        session = self.load_session(sid)
                        if session and session.status == "running":
                            self.active_sessions[sid] = session
            except Exception as e:
                print(f"Error loading active sessions list: {e}")

    def _save_active_sessions_list(self):
        active_list_path = self.data_dir / "active-sessions.json"
        session_ids = list(self.active_sessions.keys())
        with open(active_list_path, "w") as f:
            json.dump(session_ids, f, indent=2)

    def create_session(self, config: MonitoringConfig) -> MonitoringSession:
        session_id = str(uuid.uuid4())[:8]
        start_time = datetime.now()
        end_time = start_time + timedelta(minutes=config.duration_minutes)
        
        session = MonitoringSession(
            id=session_id,
            config=config,
            start_time=start_time,
            end_time=end_time,
            status="running"
        )
        
        self.active_sessions[session_id] = session
        self.save_session(session_id)
        self._save_active_sessions_list()
        return session

    def stop_monitoring(self, session_id: str) -> Optional[MonitoringSession]:
        if session_id in self.active_sessions:
            session = self.active_sessions[session_id]
            session.status = "stopped"
            self.save_session(session_id)
            del self.active_sessions[session_id]
            self._save_active_sessions_list()
            return session
        return None

    def get_data(self, session_id: str) -> Dict:
        session = self.active_sessions.get(session_id) or self.load_session(session_id)
        if session:
            return {
                "id": session.id,
                "status": session.status,
                "data_points": session.data_points,
                "alerts": session.alerts_triggered,
                "config": session.config.dict()
            }
        return {"error": "Session not found"}

    def add_data_point(self, session_id: str, data: Dict):
        if session_id in self.active_sessions:
            session = self.active_sessions[session_id]
            session.data_points.append({
                "timestamp": datetime.now().isoformat(),
                "value": data
            })
            # Limit data points in memory
            if len(session.data_points) > 1000:
                session.data_points = session.data_points[-1000:]
            
            self.check_alerts(session_id, data)
            # Periodic save could be added here
            if len(session.data_points) % 10 == 0:
                self.save_session(session_id)

    def check_alerts(self, session_id: str, data: Dict):
        session = self.active_sessions.get(session_id)
        if not session:
            return
            
        alerts = session.config.alert_conditions
        for alert_key, threshold in alerts.items():
            current_value = data.get(alert_key)
            if current_value is not None and current_value > threshold:
                alert = {
                    "timestamp": datetime.now().isoformat(),
                    "condition": f"{alert_key} > {threshold}",
                    "value": current_value
                }
                session.alerts_triggered.append(alert)

    def save_session(self, session_id: str):
        session = self.active_sessions.get(session_id) or self.load_session(session_id)
        if session:
            session_path = self.data_dir / f"session_{session_id}.json"
            with open(session_path, "w") as f:
                f.write(session.json())

    def load_session(self, session_id: str) -> Optional[MonitoringSession]:
        session_path = self.data_dir / f"session_{session_id}.json"
        if session_path.exists():
            with open(session_path, "r") as f:
                data = json.load(f)
                return MonitoringSession(**data)
        return None

    def list_sessions(self) -> List[Dict]:
        sessions = []
        for file in self.data_dir.glob("session_*.json"):
            try:
                with open(file, "r") as f:
                    data = json.load(f)
                    sessions.append({
                        "id": data["id"],
                        "status": data["status"],
                        "event_type": data["config"]["event_type"],
                        "start_time": data["start_time"]
                    })
            except:
                pass
        return sessions
