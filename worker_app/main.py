from common.celery import celery_app, TASK_NAME, QUEUE_NAME
from dotenv import load_dotenv
from worker_app.resume_generation_job import ResumeGenerationJob

load_dotenv()


@celery_app.task(name=TASK_NAME, queue=QUEUE_NAME)
def generate_resume(data):
    generation_job = ResumeGenerationJob(data["applicant_id"])
    generation_job.handle()
