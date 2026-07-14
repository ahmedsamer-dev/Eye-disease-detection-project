# AI Eye Disease Detection System

An AI-powered healthcare platform designed to assist in the early detection of eye diseases using Machine Learning and Computer Vision technologies integrated with a scalable web application architecture.

---

## Project Overview

AI Eye Disease Detection System is a full-stack healthcare solution that leverages Artificial Intelligence to detect four of the most common eye diseases through medical image analysis.

The platform integrates a modern frontend application, a robust ASP.NET Core backend API, and AI inference services hosted in a production environment to deliver real-time predictions and diagnostic assistance.

The main goal of the project is to provide fast, accessible, and intelligent preliminary disease detection to support healthcare professionals and patients.

---

## Features

- AI-powered eye disease detection.
- Detection of four common eye diseases using trained Machine Learning models.
- Real-time image analysis and prediction results.
- Seamless integration between Frontend, Backend, and AI services.
- Modern and user-friendly interface.
- Production-ready deployment environment.
- Scalable architecture for future improvements.

---

## Supported Diseases

The system currently supports the detection of four common eye diseases:

- Glaucoma
- Diabetic Retinopathy
- Cataract
- Normal

> >>>>

---

## System Architecture

```text
React Frontend
       ↓
ASP.NET Core Web API
       ↓
AI Inference Service (Python)
       ↓
Machine Learning Models
       ↓
Prediction Result
```

---

## Technology Stack

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript

### Backend
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server

### Artificial Intelligence
- Python
- Machine Learning Models
- Model Inference Service

### Infrastructure & Deployment
- Azure Linux Virtual Machine
- Gunicorn Application Server
- MonsterASP Hosting
- REST API Communication

---

## Deployment Architecture

The application was deployed using a distributed architecture:

- The frontend and backend services were deployed to a production environment.
- AI models were hosted on a Linux Virtual Machine running on Microsoft Azure.
- Gunicorn was configured as the application server to ensure that AI services remain available and responsive for prediction requests.
- Communication between all services was handled through REST APIs.

---

## System Workflow

1. The user uploads an eye image through the web application.
2. The frontend sends the image to the ASP.NET Core backend API.
3. The backend forwards the request to the AI inference service hosted on Azure.
4. The machine learning model processes the image and generates a prediction.
5. The prediction result is returned to the backend API.
6. The result is displayed to the user in real time.

---

## Infrastructure Highlights

- Production deployment environment.
- Azure Linux server administration.
- AI model hosting on Azure Virtual Machines.
- Gunicorn process management.
- Full integration between frontend, backend, and AI services.
- Scalable multi-service architecture.

---

## Screenshots

### Home Page

![Home Page](https://github.com/user-attachments/assets/736cc15a-235c-406a-a568-302e17e69356)

---

### Prediction Page

![Prediction Page](https://github.com/user-attachments/assets/5a183622-43a0-41e6-9f84-ecc19bfd7d68)

<img width="1890" height="914" alt="Screenshot_14-7-2026_151243_aieyedetection runasp net" src="https://github.com/user-attachments/assets/47278481-3ff6-4914-b5bd-cce03cc19664" />







---

### Results Page

<img width="1867" height="1333" alt="Screenshot_14-7-2026_151234_aieyedetection runasp net" src="https://github.com/user-attachments/assets/437aad98-436d-4861-baf8-746acfe77644" />

```md

```

---

## Future Improvements

- Support additional eye diseases.
- Improve model accuracy.
- Dockerize the AI services.
- Deploy using Kubernetes.
- Add mobile application support.
- Add patient history and medical records.
- Add multi-language support.

---

## Team Members

- Ahmed Mohamed Samer (Back-End)
\\
- Hassan Hamdy Abdelrahim (Back-End)
\\
- Youssef Osama William (Back-End)
\\
- Gehad Nasr Mohamed (AI)
\\
- Nada Ayman Mahfouz (UIUX)
\\
- Alaa Hamdy Mohamed (AI)




---

## Deployment

The project was successfully deployed and tested in a production environment.

### Hosting:
- Frontend & Backend: MonsterASP
- AI Inference Service: Azure Linux Virtual Machine

### AI Server:
- Gunicorn Application Server
- REST API Communication
- Live AI Model Serving

---

## License

This project was developed as a graduation project for educational and research purposes only.

---

## Live Demo

https://aieyedetection.runasp.net/

```text
https://aieyedetection.runasp.net
```

---

## Repository Structure

```text
Frontend/
Backend/
AI-Service/
Documentation/
```<img width="1867" height="1333" alt="Screenshot_14-7-2026_151234_aieyedetection runasp net" src="https://github.com/user-attachments/assets/909f9815-1100-4652-b321-a0911a561a9c" />
<img width="1890" height="914" alt="Screenshot_14-7-2026_151243_aieyedetection runasp net" src="https://github.com/user-attachments/assets/b0f58b5f-e40b-4234-b690-de9d0fc3e8e9" />
