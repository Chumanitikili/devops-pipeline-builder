
import { Pipeline, PipelinePlatform, PipelineStage } from './types';

// Generate GitHub Actions YAML
export const generateGitHubActionsYAML = (pipeline: Pipeline): string => {
  const stagesMap = new Map<string, PipelineStage>();
  pipeline.stages.forEach(stage => stagesMap.set(stage.id, stage));

  let yaml = `name: ${pipeline.name}\n\n`;
  
  yaml += `on:\n`;
  yaml += `  push:\n`;
  yaml += `    branches: [ main ]\n`;
  yaml += `  pull_request:\n`;
  yaml += `    branches: [ main ]\n\n`;

  yaml += `jobs:\n`;

  // Process stages and create jobs
  const jobsProcessed = new Set<string>();
  const processedStages: string[] = [];

  const processStage = (stageId: string) => {
    if (processedStages.includes(stageId) || jobsProcessed.has(stageId)) return;
    
    const stage = stagesMap.get(stageId);
    if (!stage) return;

    let dependencies: string[] = [];
    if (stage.dependencies && stage.dependencies.length > 0) {
      // Process dependencies first
      stage.dependencies.forEach(depId => {
        if (!processedStages.includes(depId)) {
          processStage(depId);
        }
        dependencies.push(depId);
      });
    }

    yaml += `  ${stageId}:\n`;
    yaml += `    runs-on: ubuntu-latest\n`;
    
    if (dependencies.length > 0) {
      yaml += `    needs: [${dependencies.join(', ')}]\n`;
    }
    
    yaml += `    steps:\n`;
    
    stage.commands.forEach(command => {
      if (command.startsWith('uses:')) {
        yaml += `      - ${command}\n`;
      } else if (command.startsWith('with:')) {
        yaml += `        ${command}\n`;
      } else if (command.startsWith('run:')) {
        yaml += `      - name: ${stage.name}\n`;
        yaml += `        ${command}\n`;
      } else {
        yaml += `        ${command}\n`;
      }
    });

    processedStages.push(stageId);
    jobsProcessed.add(stageId);
  };

  // Process all stages
  pipeline.stages.forEach(stage => {
    if (!processedStages.includes(stage.id)) {
      processStage(stage.id);
    }
  });

  return yaml;
};

// Generate Jenkins Pipeline
export const generateJenkinsPipeline = (pipeline: Pipeline): string => {
  let jenkinsfile = `pipeline {\n`;
  jenkinsfile += `  agent any\n\n`;
  jenkinsfile += `  stages {\n`;

  pipeline.stages.forEach(stage => {
    jenkinsfile += `    stage('${stage.name}') {\n`;
    jenkinsfile += `      steps {\n`;
    
    stage.commands.forEach(command => {
      if (command.startsWith('run:')) {
        const cmd = command.substring(5).trim();
        jenkinsfile += `        sh "${cmd}"\n`;
      } else if (!command.startsWith('uses:') && !command.startsWith('with:')) {
        jenkinsfile += `        sh "${command}"\n`;
      }
    });
    
    jenkinsfile += `      }\n`;
    jenkinsfile += `    }\n`;
  });

  jenkinsfile += `  }\n`;
  jenkinsfile += `}\n`;

  return jenkinsfile;
};

// Generate Dockerfile based on language
export const generateDockerfile = (pipeline: Pipeline): string => {
  switch (pipeline.language) {
    case 'javascript':
    case 'typescript':
      return `FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]`;

    case 'python':
      return `FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "app.py"]`;

    case 'java':
      return `FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]`;

    case 'csharp':
      return `FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app

COPY *.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "YourApp.dll"]`;

    case 'go':
      return `FROM golang:1.18-alpine AS build

WORKDIR /app
COPY go.* ./
RUN go mod download

COPY . .
RUN go build -o /app/main .

FROM alpine:latest
WORKDIR /app
COPY --from=build /app/main .
EXPOSE 8080
CMD ["/app/main"]`;

    default:
      return `# Please specify a programming language to generate a Dockerfile.`;
  }
};

// Generate combined output
export const generatePipelineFiles = (pipeline: Pipeline): Record<string, string> => {
  const files: Record<string, string> = {};
  
  switch (pipeline.platform) {
    case 'github-actions':
      files['github-actions.yml'] = generateGitHubActionsYAML(pipeline);
      break;
    case 'jenkins':
      files['Jenkinsfile'] = generateJenkinsPipeline(pipeline);
      break;
    // Add more platforms as needed
  }
  
  files['Dockerfile'] = generateDockerfile(pipeline);
  
  return files;
};
