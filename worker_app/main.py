from dotenv import load_dotenv

load_dotenv()

from common.celery_app import celery_app, TASK_NAME, QUEUE_NAME
from worker_app.resume_generation_job import ResumeGenerationJob


@celery_app.task(name=TASK_NAME, queue=QUEUE_NAME)
def generate_resume(data):
    generation_job = ResumeGenerationJob(data["applicant_id"])
    generation_job.handle()
