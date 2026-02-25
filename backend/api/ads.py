from fastapi import APIRouter, HTTPException
from typing import List, Dict
from ..ads_manager import AdsManager, AdCampaign, CreativeIntent

router = APIRouter(prefix="/v1/ads", tags=["ads"])
manager = AdsManager()

@router.post("/campaigns", response_model=AdCampaign)
async def create_campaign(name: str):
    return manager.create_campaign(name)

@router.get("/campaigns", response_model=List[Dict])
async def list_campaigns():
    return manager.list_campaigns()

@router.get("/campaigns/{campaign_id}", response_model=AdCampaign)
async def get_campaign(campaign_id: str):
    campaign = manager.get_campaign(campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign

@router.post("/campaigns/{campaign_id}/intent")
async def update_intent(campaign_id: str, intent: CreativeIntent):
    campaign = manager.update_intent(campaign_id, intent)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign

@router.post("/campaigns/{campaign_id}/generate")
async def generate_variations(campaign_id: str, count: int = 4):
    campaign = manager.generate_variations(campaign_id, count)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found or intent missing")
    return campaign
