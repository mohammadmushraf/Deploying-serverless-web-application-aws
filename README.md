
# Deploying-serverless-web-application-aws
Serverless Web Application on AWS built using Amazon S3 for frontend hosting, API Gateway for REST APIs, AWS Lambda for backend logic, and DynamoDB for scalable data storage. The application is cost-efficient, scalable, and requires no server management.
=======
# Serverless Todo Application

A full-stack **serverless Todo application** built using **React**, **AWS Lambda**, **DynamoDB**, **S3**, and **Cloudflare**.  
This project demonstrates a modern cloud-native architecture with a fully managed backend and a scalable frontend deployed to production.

 **Live Website:** https://mushrafmohd.in

---

## Features

- Create new todos
- View existing todos
- Soft delete todos (data preserved in DynamoDB)
- Fully serverless backend (no servers or EC2)
- React frontend hosted on AWS S3
- Global delivery via Cloudflare CDN
- REST API with CORS support
- Custom domain with HTTPS

---

## Architecture

React Frontend (S3 + Cloudflare)
|
| HTTPS (Fetch API)
v
AWS Lambda (Node.js 20)
|
v
Amazon DynamoDB



---

## Technology Stack

### Frontend
- React (Create React App)
- JavaScript (ES6)
- HTML / CSS
- Fetch API

### Backend (Production)
- AWS Lambda (Node.js 20.x)
- AWS SDK v3
- Lambda Function URL

### Backend (Local Development)
- Node.js
- Express.js
- Used only for local testing and development

### Database
- Amazon DynamoDB
- Soft delete pattern using a `deleted` flag

### Cloud & DevOps
- AWS S3 (Static Website Hosting)
- AWS IAM
- Cloudflare (DNS, CDN, HTTPS)

---

## Project Structure

aws-serverless-todo/
├── README.md
├── frontend/
│ ├── package.json
│ ├── package-lock.json
│ ├── public/
│ └── src/
│ ├── App.js
│ ├── App.css
│ └── index.js
└── backend/
├── index.mjs # AWS Lambda backend (production)
├── index.js # Express backend (local development)
├── package.json
└── package-lock.json



---

## API Endpoints (Production)

### Get Todos
GET /todos


### Add Todo

POST /todos
Content-Type: application/json

{
"text": "My new task"
}


### Delete Todo (Soft Delete)


DELETE /todos/{id}


---

## DynamoDB Schema

**Table Name:** `Todos`

| Attribute   | Type    | Description                  |
|------------|---------|------------------------------|
| id         | String  | Primary key                  |
| text       | String  | Todo content                 |
| completed  | Boolean | Completion status            |
| deleted    | Boolean | Soft delete flag             |
| createdAt | String  | Creation timestamp (ISO)     |
| deletedAt | String  | Deletion timestamp (ISO)     |

---

## CORS & Security

- Lambda Function URL configured with CORS
- `Access-Control-Allow-Origin: *`
- IAM role with permissions to access DynamoDB
- No secrets stored in frontend code

---

## Deployment Overview

### Backend (AWS Lambda)
1. Create DynamoDB table
2. Create Lambda function (Node.js 20)
3. Attach IAM role with DynamoDB permissions
4. Enable Lambda Function URL
5. Configure CORS

### Frontend (React)
1. Build the app using `npm run build`
2. Upload build files to AWS S3
3. Enable static website hosting
4. Configure Cloudflare DNS
5. Enable HTTPS and caching

---

## Key Learnings

- Designing and deploying serverless applications on AWS
- Handling CORS between frontend and backend
- DynamoDB data modeling with soft deletes
- Cloudflare integration with AWS services
- Debugging and deploying production applications

---

## Author

**Mohammad Mushraf**  
 https://mushrafmohd.in  
 Aspiring AWS Devops Engineer

---

If you find this project useful, consider giving it a star on GitHub.
