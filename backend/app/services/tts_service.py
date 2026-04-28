import threading
import time
from pathlib import Path
import os
import wave
import struct
import math

from gtts import gTTS

from app.db import SessionLocal
from app.services.job_service import JobService

VOICE_PROFILES = {
    "aria-pro": {"lang": "en", "tld": "us", "slow": False},
    "luca-edge": {"lang": "en", "tld": "co.uk", "slow": False},
    "maya-air": {"lang": "en", "tld": "com", "slow": False},
    "nova-deep": {"lang": "en", "tld": "us", "slow": True},
    "sophia-clear": {"lang": "en", "tld": "us", "slow": False},
    "ethan-studio": {"lang": "en", "tld": "com", "slow": False},
    "amelia-brit": {"lang": "en", "tld": "co.uk", "slow": False},
    "oliver-brit": {"lang": "en", "tld": "co.uk", "slow": True},
    "isla-ocean": {"lang": "en", "tld": "com.au", "slow": False},
    "liam-ocean": {"lang": "en", "tld": "com.au", "slow": True},
    "clara-euro": {"lang": "fr", "tld": "fr", "slow": False},
    "noah-euro": {"lang": "de", "tld": "de", "slow": False},
    "hana-wave": {"lang": "ja", "tld": "co.jp", "slow": False},
    "sofia-iberia": {"lang": "es", "tld": "es", "slow": False},
    "mateo-latino": {"lang": "es", "tld": "com.mx", "slow": False},
    "anika-india": {"lang": "en", "tld": "co.in", "slow": False},
}

class TTSService:
    def __init__(self, job_service: JobService) -> None:
        self.job_service = job_service
        self.media_dir = Path("media")
        self.media_dir.mkdir(exist_ok=True)
        self.backend_public_url = os.getenv("BACKEND_PUBLIC_URL", "http://localhost:8000")

    def enqueue_mock_generation(self, job_id: str) -> None:
        # Queue placeholder: swap this thread with Redis/Celery worker later.
        worker = threading.Thread(target=self._run_mock_generation, args=(job_id,), daemon=True)
        worker.start()

    def _run_mock_generation(self, job_id: str) -> None:
        db = SessionLocal()
        self.job_service.update_job(db, job_id, status="processing")
        time.sleep(1)

        job = self.job_service.get_job(db, job_id)
        if not job:
            db.close()
            return

        target_mp3 = self.media_dir / f"{job_id}.mp3"
        target_wav = self.media_dir / f"{job_id}.wav"
        try:
            # Lightweight online TTS for MVP mock. Replace with XTTS/RunPod later.
            profile = VOICE_PROFILES.get(job["voice"], VOICE_PROFILES["aria-pro"])
            speed_value = float(job.get("speed", 1.0))
            tts = gTTS(
                text=job["text"],
                lang=profile["lang"],
                tld=profile["tld"],
                slow=(speed_value < 0.95) or profile["slow"],
            )
            tts.save(str(target_mp3))
            audio_url = f"{self.backend_public_url}/media/{job_id}.mp3"
        except Exception:
            # Offline fallback if gTTS is unavailable: generate a short tone.
            self._create_fallback_tone(target_wav)
            audio_url = f"{self.backend_public_url}/media/{job_id}.wav"

        # XTTS/RunPod integration point:
        # 1) Send script + voice to external GPU endpoint.
        # 2) Store generated audio in object storage.
        # 3) Save storage URL into audio_url field.
        self.job_service.update_job(db, job_id, status="completed", audio_url=audio_url)
        db.close()

    def _create_fallback_tone(self, target_path: Path) -> None:
        sample_rate = 22050
        duration_seconds = 1.5
        frequency_hz = 440.0
        total_samples = int(sample_rate * duration_seconds)
        amplitude = 10000

        with wave.open(str(target_path), "w") as wav_file:
            wav_file.setnchannels(1)
            wav_file.setsampwidth(2)
            wav_file.setframerate(sample_rate)
            for n in range(total_samples):
                value = int(amplitude * math.sin(2.0 * math.pi * frequency_hz * n / sample_rate))
                wav_file.writeframes(struct.pack("<h", value))
