import os
import urllib.request
import urllib.parse
import json
import logging
from typing import List, Optional

logger = logging.getLogger(__name__)

# MRAM SMS Gateway Configuration
MRAM_API_URL = "https://sms.mram.com.bd/smsapi"
DEFAULT_API_KEY = "C30008286abe511b7f1b15.45367813"

def get_sms_config():
    api_key = os.getenv("SMS_API_KEY", DEFAULT_API_KEY)
    sender_id = os.getenv("SMS_SENDER_ID", "Radiation")
    enabled = os.getenv("SMS_ENABLED", "true").lower() in ("true", "1", "yes")
    return api_key, sender_id, enabled

def format_bd_phone(phone: str) -> Optional[str]:
    """Clean and validate Bangladeshi phone number."""
    if not phone:
        return None
    # Remove any non-digit characters except leading +
    cleaned = "".join(c for c in phone if c.isdigit())
    if cleaned.startswith("880") and len(cleaned) == 13:
        return cleaned
    if cleaned.startswith("01") and len(cleaned) == 11:
        return f"88{cleaned}"
    if len(cleaned) == 10 and cleaned.startswith("1"):
        return f"880{cleaned}"
    return cleaned if len(cleaned) >= 11 else None

def send_sms_mram(contacts: List[str], message: str) -> dict:
    """
    Send SMS via MRAM SMS Gateway API.
    Supports single or multiple contacts (comma separated).
    """
    api_key, sender_id, enabled = get_sms_config()
    
    if not enabled:
        logger.info(f"[SMS Disabled] Would have sent to {contacts}: {message}")
        return {"status": "disabled", "message": "SMS sending is disabled via config"}

    valid_contacts = []
    for c in contacts:
        f = format_bd_phone(c)
        if f:
            valid_contacts.append(f)

    if not valid_contacts:
        return {"status": "error", "message": "No valid phone numbers found"}

    contacts_str = ",".join(valid_contacts)
    
    # Check if message contains unicode (e.g. Bangla)
    is_unicode = any(ord(char) > 127 for char in message)
    msg_type = "unicode" if is_unicode else "text"

    params = {
        "api_key": api_key,
        "type": msg_type,
        "contacts": contacts_str,
        "senderid": sender_id,
        "msg": message
    }

    url = f"{MRAM_API_URL}?{urllib.parse.urlencode(params)}"

    try:
        req = urllib.request.Request(url, headers={"User-Agent": "RadiationCoachingApp/1.0"})
        with urllib.request.urlopen(req, timeout=10) as response:
            res_body = response.read().decode('utf-8')
            logger.info(f"[SMS Sent] To: {contacts_str} | Res: {res_body}")
            return {"status": "success", "response": res_body, "recipients": len(valid_contacts)}
    except Exception as e:
        logger.error(f"[SMS Error] Failed to send to {contacts_str}: {e}")
        return {"status": "error", "error": str(e)}

def send_absent_sms_notification(student_name: str, student_uid: str, date_str: str, phone: str, class_level: str = ""):
    """Helper to send a formatted absence SMS in Bangla to student/guardian."""
    if not phone:
        return
    
    # Format message in clear Bengali
    msg = f"সম্মানিত অভিভাবক, আপনার সন্তান {student_name} ({student_uid}) আজ {date_str} তারিখে রেডিয়েশন কোচিং-এ অনুপস্থিত ছিল। - রেডিয়েশন কোচিং"
    
    return send_sms_mram([phone], msg)
