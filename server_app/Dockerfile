FROM python:3.13-bookworm

WORKDIR /app

COPY ./server_app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./server_app /app/server_app
COPY ./common /app/common

ENV PYTHONPATH=.

CMD ["uvicorn", "server_app.main:app", "--host", "0.0.0.0", "--port", "8000"]