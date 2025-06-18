import os

from celery import Celery
from dotenv import load_dotenv

load_dotenv()

username = os.environ.get("RABBIT_MQ_USERNAME", "guest")
password = os.environ.get("RABBIT_MQ_PASSWORD", "guest")
host = os.environ.get("RABBIT_MQ_HOST", "rabbitmq")
port = os.environ.get("RABBIT_MQ_PORT", "5672")

celery_app = Celery(
    "resume_generator_worker",
    broker=f"amqp://{username}:{password}@{host}:{port}//",
)
