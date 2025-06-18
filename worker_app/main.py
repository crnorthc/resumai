import os
import time

from common.celery_types import TASK_NAME, QUEUE_NAME

from worker_app.celery_app import celery_app
from worker_app.resume_generation_job import ResumeGenerationJob


@celery_app.task(name=TASK_NAME, queue=QUEUE_NAME)
def generate_resume(data):
    generation_job = ResumeGenerationJob(data["applicant_id"])
    generation_job.handle()


@celery_app.task(name="cleanup_old_files")
def cleanup_old_files():
    folder = os.environ.get("COMPLETED_RESUMES_DIR", "/app/common/completed_resumes/")[
        :-1
    ]
    now = time.time()
    deleted = 0
    for fname in os.listdir(folder):
        path = os.path.join(folder, fname)
        if os.path.isfile(path):
            age = now - os.path.getmtime(path)
            if age > 600:  # ten minutes
                try:
                    os.remove(path)
                    deleted += 1
                except Exception as e:
                    print(f"Error deleting {path}: {e}")
    print(f"[Cleanup] Deleted {deleted} file(s).")


celery_app.conf.beat_schedule = {
    "cleanup-every-15-seconds": {
        "task": "worker_app.celery_worker.cleanup_old_files",
        "schedule": 15.0,
    }
}

celery_app.conf.timezone = "America/New_York"
celery_app.conf.enable_utc = False
