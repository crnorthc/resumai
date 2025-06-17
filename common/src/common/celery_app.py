import os

from celery import Celery
from dotenv import load_dotenv

load_dotenv()

celery_app = Celery(
    "resume_generator_worker",
    broker=f"amqp://{os.environ.get('RABBIT_MQ_USERNAME')}:{os.environ.get('RABBIT_MQ_PASSWORD')}@{os.environ.get('RABBIT_MQ_HOST')}:{os.environ.get('RABBIT_MQ_PORT')}//",
)

TASK_NAME = "generate_resume"
QUEUE_NAME = "resumes"
