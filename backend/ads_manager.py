import json
import uuid
from datetime import datetime
from typing import List, Dict, Optional
from pathlib import Path
from pydantic import BaseModel

class CreativeIntent(BaseModel):
    non_negotiables: Dict[str, str] = {
        "core_message": "",
        "promise": "",
        "proof": ""
    }
    flexible_dimensions: Dict[str, Dict] = {
        "hook": {"value": "", "locked": False},
        "actor": {"value": "", "locked": False},
        "environment": {"value": "", "locked": False},
        "format": {"value": "", "locked": False},
        "pacing": {"value": "", "locked": False},
        "script": {"value": "", "locked": False},
        "voiceover": {"value": "", "locked": False},
        "on_screen_text": {"value": "", "locked": False}
    }

class AdVariation(BaseModel):
    id: str
    status: str = "pending" # "pending", "approved", "rejected"
    dimensions: Dict[str, str]
    preview_url: Optional[str] = None

class AdCampaign(BaseModel):
    id: str
    name: str
    current_step: int = 1
    intent: Optional[CreativeIntent] = None
    variations: List[AdVariation] = []
    created_at: datetime = datetime.now()

class AdsManager:
    """Manages AI Ad Creation workflows"""
    def __init__(self, data_dir: str = "backend/data/ads"):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(parents=True, exist_ok=True)

    def create_campaign(self, name: str) -> AdCampaign:
        campaign_id = str(uuid.uuid4())[:8]
        campaign = AdCampaign(id=campaign_id, name=name)
        self.save_campaign(campaign)
        return campaign

    def get_campaign(self, campaign_id: str) -> Optional[AdCampaign]:
        path = self.data_dir / f"{campaign_id}.json"
        if path.exists():
            with open(path, "r") as f:
                return AdCampaign(**json.load(f))
        return None

    def save_campaign(self, campaign: AdCampaign):
        path = self.data_dir / f"{campaign.id}.json"
        with open(path, "w") as f:
            f.write(campaign.json())

    def update_intent(self, campaign_id: str, intent: CreativeIntent) -> Optional[AdCampaign]:
        campaign = self.get_campaign(campaign_id)
        if campaign:
            campaign.intent = intent
            campaign.current_step = 4 # Move to Reality Check
            self.save_campaign(campaign)
            return campaign
        return None

    def generate_variations(self, campaign_id: str, count: int = 4) -> Optional[AdCampaign]:
        campaign = self.get_campaign(campaign_id)
        if campaign and campaign.intent:
            # Mock generation logic
            for _ in range(count):
                var_id = str(uuid.uuid4())[:6]
                dimensions = {k: v["value"] for k, v in campaign.intent.flexible_dimensions.items()}
                # Randomize unlocked dimensions if needed
                campaign.variations.append(AdVariation(id=var_id, dimensions=dimensions))
            
            campaign.current_step = 6 # Move to Review
            self.save_campaign(campaign)
            return campaign
        return None

    def list_campaigns(self) -> List[Dict]:
        campaigns = []
        for file in self.data_dir.glob("*.json"):
            try:
                with open(file, "r") as f:
                    data = json.load(f)
                    campaigns.append({
                        "id": data["id"],
                        "name": data["name"],
                        "step": data["current_step"],
                        "created_at": data["created_at"]
                    })
            except:
                pass
        return campaigns
