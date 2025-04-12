
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Server } from "lucide-react";
import { toast } from "sonner";

const Jenkins = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div>
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Jenkins Integration</h1>
        <p className="text-muted-foreground">
          Set up and configure Jenkins pipelines for CI/CD
        </p>
      </div>

      <Tabs defaultValue="jenkinsfile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="jenkinsfile">Jenkinsfile Templates</TabsTrigger>
          <TabsTrigger value="setup">Jenkins Setup</TabsTrigger>
          <TabsTrigger value="plugins">Recommended Plugins</TabsTrigger>
        </TabsList>

        <TabsContent value="jenkinsfile" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Pipeline</CardTitle>
                <CardDescription>A simple Jenkins pipeline with build, test, and deploy stages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="code-block text-xs whitespace-pre-wrap max-h-96 overflow-y-auto">
{`pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                echo 'Building application...'
                sh 'npm install'
                sh 'npm run build'
            }
        }
        stage('Test') {
            steps {
                echo 'Running tests...'
                sh 'npm test'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying application...'
                sh 'npm run deploy'
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}`}
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-background/80"
                    onClick={() => copyToClipboard(`pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                echo 'Building application...'
                sh 'npm install'
                sh 'npm run build'
            }
        }
        stage('Test') {
            steps {
                echo 'Running tests...'
                sh 'npm test'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying application...'
                sh 'npm run deploy'
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}`)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Docker Build & Push</CardTitle>
                <CardDescription>Jenkins pipeline for building and pushing Docker images</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="code-block text-xs whitespace-pre-wrap max-h-96 overflow-y-auto">
{`pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_REGISTRY_CREDENTIALS = 'docker-credentials'
        IMAGE_NAME = 'myapp'
        IMAGE_TAG = "v\${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh "docker build -t \${DOCKER_REGISTRY}/\${IMAGE_NAME}:\${IMAGE_TAG} ."
            }
        }
        
        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: DOCKER_REGISTRY_CREDENTIALS, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh "echo \${DOCKER_PASSWORD} | docker login \${DOCKER_REGISTRY} -u \${DOCKER_USERNAME} --password-stdin"
                    sh "docker push \${DOCKER_REGISTRY}/\${IMAGE_NAME}:\${IMAGE_TAG}"
                }
            }
        }
        
        stage('Deploy') {
            steps {
                echo "Deploying image \${DOCKER_REGISTRY}/\${IMAGE_NAME}:\${IMAGE_TAG}"
                // Add deployment steps here
            }
        }
    }
    
    post {
        always {
            sh 'docker logout'
        }
    }
}`}
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-background/80"
                    onClick={() => copyToClipboard(`pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_REGISTRY_CREDENTIALS = 'docker-credentials'
        IMAGE_NAME = 'myapp'
        IMAGE_TAG = "v\${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh "docker build -t \${DOCKER_REGISTRY}/\${IMAGE_NAME}:\${IMAGE_TAG} ."
            }
        }
        
        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: DOCKER_REGISTRY_CREDENTIALS, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh "echo \${DOCKER_PASSWORD} | docker login \${DOCKER_REGISTRY} -u \${DOCKER_USERNAME} --password-stdin"
                    sh "docker push \${DOCKER_REGISTRY}/\${IMAGE_NAME}:\${IMAGE_TAG}"
                }
            }
        }
        
        stage('Deploy') {
            steps {
                echo "Deploying image \${DOCKER_REGISTRY}/\${IMAGE_NAME}:\${IMAGE_TAG}"
                // Add deployment steps here
            }
        }
    }
    
    post {
        always {
            sh 'docker logout'
        }
    }
}`)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AWS Deployment</CardTitle>
                <CardDescription>Jenkins pipeline for deploying to AWS</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="code-block text-xs whitespace-pre-wrap max-h-96 overflow-y-auto">
{`pipeline {
    agent any
    
    environment {
        AWS_REGION = 'us-east-1'
        AWS_CREDENTIALS = 'aws-credentials'
        ECR_REPOSITORY = '123456789012.dkr.ecr.us-east-1.amazonaws.com/myapp'
        ECS_CLUSTER = 'my-cluster'
        ECS_SERVICE = 'my-service'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh "docker build -t \${ECR_REPOSITORY}:\${BUILD_NUMBER} ."
            }
        }
        
        stage('Push to ECR') {
            steps {
                withAWS(credentials: AWS_CREDENTIALS, region: AWS_REGION) {
                    sh "aws ecr get-login-password --region \${AWS_REGION} | docker login --username AWS --password-stdin \${ECR_REPOSITORY}"
                    sh "docker push \${ECR_REPOSITORY}:\${BUILD_NUMBER}"
                }
            }
        }
        
        stage('Deploy to ECS') {
            steps {
                withAWS(credentials: AWS_CREDENTIALS, region: AWS_REGION) {
                    sh "aws ecs update-service --cluster \${ECS_CLUSTER} --service \${ECS_SERVICE} --force-new-deployment"
                }
            }
        }
    }
}`}
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-background/80"
                    onClick={() => copyToClipboard(`pipeline {
    agent any
    
    environment {
        AWS_REGION = 'us-east-1'
        AWS_CREDENTIALS = 'aws-credentials'
        ECR_REPOSITORY = '123456789012.dkr.ecr.us-east-1.amazonaws.com/myapp'
        ECS_CLUSTER = 'my-cluster'
        ECS_SERVICE = 'my-service'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                sh "docker build -t \${ECR_REPOSITORY}:\${BUILD_NUMBER} ."
            }
        }
        
        stage('Push to ECR') {
            steps {
                withAWS(credentials: AWS_CREDENTIALS, region: AWS_REGION) {
                    sh "aws ecr get-login-password --region \${AWS_REGION} | docker login --username AWS --password-stdin \${ECR_REPOSITORY}"
                    sh "docker push \${ECR_REPOSITORY}:\${BUILD_NUMBER}"
                }
            }
        }
        
        stage('Deploy to ECS') {
            steps {
                withAWS(credentials: AWS_CREDENTIALS, region: AWS_REGION) {
                    sh "aws ecs update-service --cluster \${ECS_CLUSTER} --service \${ECS_SERVICE} --force-new-deployment"
                }
            }
        }
    }
}`)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Parallel Execution</CardTitle>
                <CardDescription>Jenkins pipeline with parallel execution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="code-block text-xs whitespace-pre-wrap max-h-96 overflow-y-auto">
{`pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
        
        stage('Parallel Tests') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        sh 'npm run test:unit'
                    }
                }
                stage('Integration Tests') {
                    steps {
                        sh 'npm run test:integration'
                    }
                }
                stage('E2E Tests') {
                    steps {
                        sh 'npm run test:e2e'
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'npm run deploy'
            }
        }
    }
}`}
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-background/80"
                    onClick={() => copyToClipboard(`pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
        
        stage('Parallel Tests') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        sh 'npm run test:unit'
                    }
                }
                stage('Integration Tests') {
                    steps {
                        sh 'npm run test:integration'
                    }
                }
                stage('E2E Tests') {
                    steps {
                        sh 'npm run test:e2e'
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'npm run deploy'
            }
        }
    }
}`)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="setup" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Setting Up Jenkins</CardTitle>
              <CardDescription>Steps to set up Jenkins on different platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Docker Installation</h3>
                  <p className="text-muted-foreground mb-4">
                    The quickest way to get started with Jenkins is to run it as a Docker container.
                  </p>
                  <div className="bg-muted p-3 rounded flex justify-between items-center">
                    <code className="text-sm">docker run -p 8080:8080 -p 50000:50000 jenkins/jenkins:lts</code>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard("docker run -p 8080:8080 -p 50000:50000 jenkins/jenkins:lts")}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    This will start Jenkins on port 8080. You can access it at http://localhost:8080.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Initial Setup</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Access Jenkins at http://localhost:8080</li>
                    <li>Retrieve the initial admin password from the Docker logs:
                      <div className="bg-muted p-2 rounded my-1 flex justify-between items-center">
                        <code className="text-sm">docker logs jenkins</code>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard("docker logs jenkins")}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                    <li>Install suggested plugins</li>
                    <li>Create an admin user</li>
                    <li>Configure Jenkins URL</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Creating a Pipeline</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Click "New Item" from the Jenkins dashboard</li>
                    <li>Enter a name for your pipeline</li>
                    <li>Select "Pipeline" and click "OK"</li>
                    <li>In the configuration page, scroll down to the "Pipeline" section</li>
                    <li>You can define your pipeline in two ways:
                      <ul className="list-disc list-inside ml-4 mt-1">
                        <li>Directly in the Jenkins UI using the "Pipeline Script" option</li>
                        <li>From a Jenkinsfile in your SCM repository using the "Pipeline Script from SCM" option</li>
                      </ul>
                    </li>
                    <li>Click "Save" to create your pipeline</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Setting Up Pipeline Triggers</h3>
                  <p className="text-muted-foreground mb-3">
                    Jenkins can automatically trigger pipeline runs based on various events.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium">Poll SCM</h4>
                      <p className="text-sm text-muted-foreground">
                        Jenkins periodically checks the repository for changes and triggers a build if changes are detected.
                      </p>
                      <div className="bg-muted p-2 rounded my-1">
                        <code className="text-sm">H/15 * * * *</code> <span className="text-sm text-muted-foreground">(checks every 15 minutes)</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium">Webhooks</h4>
                      <p className="text-sm text-muted-foreground">
                        Set up webhooks in your repository service (GitHub, GitLab, etc.) to notify Jenkins of code changes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plugins" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Jenkins Plugins</CardTitle>
              <CardDescription>Essential plugins to enhance your Jenkins CI/CD workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">Pipeline</h3>
                    <p className="text-sm text-muted-foreground">
                      Enables the creation of pipelines with the Pipeline DSL, allowing you to define your build process as code.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">Git</h3>
                    <p className="text-sm text-muted-foreground">
                      Integrates Jenkins with Git repositories, enabling it to check out code.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">Docker Pipeline</h3>
                    <p className="text-sm text-muted-foreground">
                      Allows you to use Docker containers as build agents and build Docker images from your pipeline.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">Blue Ocean</h3>
                    <p className="text-sm text-muted-foreground">
                      Provides a modern, visual interface for Jenkins pipelines, making it easier to understand and debug your builds.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">Credentials Binding</h3>
                    <p className="text-sm text-muted-foreground">
                      Allows you to securely use credentials in your Jenkins pipelines.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">Pipeline AWS Steps</h3>
                    <p className="text-sm text-muted-foreground">
                      Provides steps for interacting with AWS services in your Jenkins pipelines.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">JUnit</h3>
                    <p className="text-sm text-muted-foreground">
                      Allows Jenkins to display test results and trends from JUnit-format XML files.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">NodeJS</h3>
                    <p className="text-sm text-muted-foreground">
                      Provides NodeJS installations for your builds, enabling you to run npm tasks.
                    </p>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Installing Plugins</h3>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Go to "Manage Jenkins" &gt; "Manage Plugins"</li>
                    <li>Click on the "Available" tab</li>
                    <li>Use the search box to find the plugin you want to install</li>
                    <li>Check the checkbox next to the plugin</li>
                    <li>Click "Install without restart" or "Download now and install after restart"</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Jenkins;
