# ResumAI

Generate tailored, LLM-powered resumes in seconds — no account required.

🔗 **Live Demo**: [https://resumai.calebnorthcott.com](https://resumai.calebnorthcott.com)

---

## 🧠 Overview

**ResumAI** is a web application that helps software engineers and job seekers generate tailored resumes using large language models (LLMs). Users can enter and store personal, educational, and professional background details, then input a job description and select from popular LLMs (OpenAI, Gemini, or Anthropic) to create a resume optimized for the target role — exportable as a PDF or DOCX.

No sign-up is needed — all data remains local to the browser. Users provide their own LLM API keys, which are encrypted to be used securely on the server, and never persisted.

---

## 🧩 Features

- 🔒 No sign-up or user accounts
- 🌐 Secure client-side encryption for API keys
- 📄 Generate resumes in PDF or DOCX format
- 🧠 Choose your preferred LLM model (OpenAI, Gemini, or Anthropic)
- ⚡ Real-time feedback via WebSockets
- 🧰 Built with production-ready Python & React tooling

---

## ⚙️ Tech Stack

ResumAI is built with modern technologies and production-grade infrastructure components:

- **Frontend**: Vite + React + TypeScript SPA
- **Backend**: FastAPI (Python) with REST and WebSocket support
- **Task Queue**: Celery with RabbitMQ
- **Temporary Data Store**: Redis (for job context)
- **Resume Generation**: Custom logic leveraging OpenAI, Gemini, or Claude
- **PDF/DOCX Export**: `python-docx` and `reportlab`
- **Encryption**: Fernet encryption for secure handling of API keys

### 🏗 Deployment

- Frontend: Hosted on **AWS S3 + CloudFront** as a static site
- Backend: **EC2 t4g.micro** instance running Dockerized services (FastAPI app + Celery worker)
- RabbitMQ + Redis also run in containers via Docker Compose

---

## 🚀 Try It Yourself

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)
- API keys for:
  - [OpenAI](https://platform.openai.com/account/api-keys)
  - [Anthropic](https://console.anthropic.com/)
  - [Google Gemini](https://makersuite.google.com/)

### 1️⃣ Backend Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/crnorthc/resumai.git
   cd resumai
   ```

2. **Set the ENV in worker_app and server_app**

   ```bash
   KEY_ENCRYPTION_SEED=[base64-encoded 32-byte key]
   ```

   For more information see [Fernet Docs](https://cryptography.io/en/latest/fernet/)

3. **Run Docker Compose**
   ```bash
   docker compose up --build
   ```

This will expose the frontend on http://localhost:5000

## 📝 License

This project is licensed under the MIT License. See the LICENSE file for details.
