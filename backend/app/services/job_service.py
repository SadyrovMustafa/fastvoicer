from uuid import uuid4

from sqlalchemy.orm import Session

from app.models.db_models import Job, UsageEvent

class JobService:
    def create_job(self, db: Session, workspace_id: int, user_id: int, text: str, voice: str, speed: float) -> dict:
        job_id = str(uuid4())
        job = Job(
            job_id=job_id,
            workspace_id=workspace_id,
            user_id=user_id,
            status="queued",
            text=text,
            voice=voice,
            speed=speed,
        )
        db.add(job)
        db.commit()
        db.refresh(job)
        return self._to_dict(job)

    def update_job(self, db: Session, job_id: str, **fields: object) -> None:
        job = db.query(Job).filter(Job.job_id == job_id).first()
        if not job:
            return
        for key, value in fields.items():
            setattr(job, key, value)
        db.commit()
        db.refresh(job)
        if fields.get("status") == "completed":
            usage = UsageEvent(
                workspace_id=job.workspace_id,
                user_id=job.user_id,
                job_id=job.id,
                characters=len(job.text),
            )
            db.add(usage)
            db.commit()

    def get_job(self, db: Session, job_id: str) -> dict | None:
        job = db.query(Job).filter(Job.job_id == job_id).first()
        return self._to_dict(job) if job else None

    def list_jobs(self, db: Session, workspace_id: int) -> list[dict]:
        jobs = db.query(Job).filter(Job.workspace_id == workspace_id).order_by(Job.created_at.desc()).all()
        return [self._to_dict(job) for job in jobs]

    def total_characters(self, db: Session, workspace_id: int) -> int:
        usage = db.query(UsageEvent).filter(UsageEvent.workspace_id == workspace_id).all()
        return sum(item.characters for item in usage)

    def _to_dict(self, job: Job) -> dict:
        return {
            "job_id": job.job_id,
            "workspace_id": job.workspace_id,
            "status": job.status,
            "text": job.text,
            "voice": job.voice,
            "speed": job.speed,
            "created_at": job.created_at,
            "audio_url": job.audio_url,
        }
