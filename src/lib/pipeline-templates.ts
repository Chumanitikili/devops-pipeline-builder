
import { PipelineTemplate } from './types';

export const pipelineTemplates: PipelineTemplate[] = [
  {
    id: 'nodejs-aws',
    name: 'Node.js on AWS',
    description: 'A pipeline for deploying Node.js applications to AWS.',
    platform: 'github-actions',
    deploymentTarget: 'aws',
    language: 'javascript',
    image: '/placeholder.svg',
    stages: [
      {
        id: 'checkout',
        name: 'Checkout',
        type: 'build',
        commands: ['uses: actions/checkout@v3'],
      },
      {
        id: 'setup-node',
        name: 'Setup Node.js',
        type: 'build',
        commands: [
          'uses: actions/setup-node@v3',
          'with:',
          '  node-version: 16',
          '  cache: npm',
        ],
      },
      {
        id: 'install',
        name: 'Install Dependencies',
        type: 'build',
        commands: ['run: npm ci'],
      },
      {
        id: 'test',
        name: 'Run Tests',
        type: 'test',
        commands: ['run: npm test'],
      },
      {
        id: 'build',
        name: 'Build Application',
        type: 'build',
        commands: ['run: npm run build'],
      },
      {
        id: 'docker-build',
        name: 'Build Docker Image',
        type: 'build',
        commands: ['run: docker build -t my-app:${{ github.sha }} .'],
      },
      {
        id: 'deploy',
        name: 'Deploy to AWS',
        type: 'deploy',
        commands: [
          'run: |',
          '  aws ecr get-login-password --region ${{ secrets.AWS_REGION }} | docker login --username AWS --password-stdin ${{ secrets.AWS_ECR_REPOSITORY }}',
          '  docker tag my-app:${{ github.sha }} ${{ secrets.AWS_ECR_REPOSITORY }}:${{ github.sha }}',
          '  docker push ${{ secrets.AWS_ECR_REPOSITORY }}:${{ github.sha }}',
          '  aws ecs update-service --cluster ${{ secrets.AWS_ECS_CLUSTER }} --service ${{ secrets.AWS_ECS_SERVICE }} --force-new-deployment',
        ],
      },
    ],
    dockerfile: `FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]`,
  },
  {
    id: 'python-gcp',
    name: 'Python on GCP',
    description: 'A pipeline for deploying Python applications to Google Cloud Platform.',
    platform: 'github-actions',
    deploymentTarget: 'gcp',
    language: 'python',
    image: '/placeholder.svg',
    stages: [
      {
        id: 'checkout',
        name: 'Checkout',
        type: 'build',
        commands: ['uses: actions/checkout@v3'],
      },
      {
        id: 'setup-python',
        name: 'Setup Python',
        type: 'build',
        commands: [
          'uses: actions/setup-python@v4',
          'with:',
          '  python-version: "3.9"',
          '  cache: pip',
        ],
      },
      {
        id: 'install',
        name: 'Install Dependencies',
        type: 'build',
        commands: [
          'run: |',
          '  python -m pip install --upgrade pip',
          '  pip install -r requirements.txt',
        ],
      },
      {
        id: 'test',
        name: 'Run Tests',
        type: 'test',
        commands: ['run: pytest'],
      },
      {
        id: 'build',
        name: 'Build Docker Image',
        type: 'build',
        commands: [
          'run: |',
          '  docker build -t gcr.io/${{ secrets.GCP_PROJECT_ID }}/my-app:${{ github.sha }} .',
        ],
      },
      {
        id: 'deploy',
        name: 'Deploy to GCP',
        type: 'deploy',
        commands: [
          'uses: google-github-actions/auth@v1',
          'with:',
          '  credentials_json: ${{ secrets.GCP_SA_KEY }}',
          'run: |',
          '  gcloud auth configure-docker',
          '  docker push gcr.io/${{ secrets.GCP_PROJECT_ID }}/my-app:${{ github.sha }}',
          '  gcloud run deploy my-app --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/my-app:${{ github.sha }} --platform managed --region us-central1',
        ],
      },
    ],
    dockerfile: `FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "app.py"]`,
  },
  {
    id: 'java-azure',
    name: 'Java on Azure',
    description: 'A pipeline for deploying Java applications to Microsoft Azure.',
    platform: 'github-actions',
    deploymentTarget: 'azure',
    language: 'java',
    image: '/placeholder.svg',
    stages: [
      {
        id: 'checkout',
        name: 'Checkout',
        type: 'build',
        commands: ['uses: actions/checkout@v3'],
      },
      {
        id: 'setup-java',
        name: 'Setup Java',
        type: 'build',
        commands: [
          'uses: actions/setup-java@v3',
          'with:',
          '  distribution: "temurin"',
          '  java-version: "17"',
          '  cache: maven',
        ],
      },
      {
        id: 'build',
        name: 'Build with Maven',
        type: 'build',
        commands: ['run: mvn -B package --file pom.xml'],
      },
      {
        id: 'test',
        name: 'Run Tests',
        type: 'test',
        commands: ['run: mvn test'],
      },
      {
        id: 'build-docker',
        name: 'Build Docker Image',
        type: 'build',
        commands: ['run: docker build -t myapp:${{ github.sha }} .'],
      },
      {
        id: 'login-azure',
        name: 'Login to Azure',
        type: 'deploy',
        commands: [
          'uses: azure/login@v1',
          'with:',
          '  creds: ${{ secrets.AZURE_CREDENTIALS }}',
        ],
      },
      {
        id: 'deploy',
        name: 'Deploy to Azure App Service',
        type: 'deploy',
        commands: [
          'uses: azure/webapps-deploy@v2',
          'with:',
          '  app-name: "my-java-app"',
          '  images: "myapp:${{ github.sha }}"',
        ],
      },
    ],
    dockerfile: `FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]`,
  },
  {
    id: 'microservices-kubernetes',
    name: 'Microservices on Kubernetes',
    description: 'A pipeline for deploying microservices to Kubernetes.',
    platform: 'github-actions',
    deploymentTarget: 'custom',
    language: 'typescript',
    image: '/placeholder.svg',
    stages: [
      {
        id: 'checkout',
        name: 'Checkout',
        type: 'build',
        commands: ['uses: actions/checkout@v3'],
      },
      {
        id: 'setup-node',
        name: 'Setup Node.js',
        type: 'build',
        commands: [
          'uses: actions/setup-node@v3',
          'with:',
          '  node-version: 16',
          '  cache: npm',
        ],
      },
      {
        id: 'install',
        name: 'Install Dependencies',
        type: 'build',
        commands: ['run: npm ci'],
      },
      {
        id: 'build',
        name: 'Build Services',
        type: 'build',
        commands: ['run: npm run build'],
      },
      {
        id: 'test',
        name: 'Run Tests',
        type: 'test',
        commands: ['run: npm test'],
      },
      {
        id: 'docker-build',
        name: 'Build Docker Images',
        type: 'build',
        commands: [
          'run: |',
          '  for service in ./services/*; do',
          '    if [ -d "$service" ]; then',
          '      service_name=$(basename $service)',
          '      docker build -t ${{ secrets.DOCKER_REGISTRY }}/$service_name:${{ github.sha }} $service',
          '      docker push ${{ secrets.DOCKER_REGISTRY }}/$service_name:${{ github.sha }}',
          '    fi',
          '  done',
        ],
      },
      {
        id: 'deploy',
        name: 'Deploy to Kubernetes',
        type: 'deploy',
        commands: [
          'uses: azure/k8s-set-context@v3',
          'with:',
          '  kubeconfig: ${{ secrets.KUBE_CONFIG }}',
          'run: |',
          '  for service in ./services/*; do',
          '    if [ -d "$service" ]; then',
          '      service_name=$(basename $service)',
          '      envsubst < $service/k8s/deployment.yaml | kubectl apply -f -',
          '      kubectl rollout status deployment/$service_name',
          '    fi',
          '  done',
        ],
      },
    ],
    dockerfile: `FROM node:16-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 3000
CMD ["npm", "start"]`,
  },
];
