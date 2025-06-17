import os

from celery import Celery

celery_app = Celery(
    "resume_generator_worker",
    broker=f"amqp://{os.environ.get('RABBIT_MQ_USERNAME')}:{os.environ.get('RABBIT_MQ_PASSWORD')}@{os.environ.get('RABBIT_MQ_HOST')}:{os.environ.get('RABBIT_MQ_PORT')}//",
)
