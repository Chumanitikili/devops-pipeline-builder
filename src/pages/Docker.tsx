
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Box } from "lucide-react";
import { toast } from "sonner";

const Docker = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div>
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Docker Integration</h1>
        <p className="text-muted-foreground">
          Containerize your applications with Docker
        </p>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Dockerfile Templates</TabsTrigger>
          <TabsTrigger value="commands">Common Commands</TabsTrigger>
          <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Node.js Application</CardTitle>
                <CardDescription>Dockerfile for Node.js applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="code-block text-xs whitespace-pre-wrap max-h-96 overflow-y-auto">
{`FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]`}
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-background/80"
                    onClick={() => copyToClipboard(`FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]`)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Python Application</CardTitle>
                <CardDescription>Dockerfile for Python applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="code-block text-xs whitespace-pre-wrap max-h-96 overflow-y-auto">
{`FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["python", "app.py"]`}
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-background/80"
                    onClick={() => copyToClipboard(`FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["python", "app.py"]`)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Java Spring Boot</CardTitle>
                <CardDescription>Dockerfile for Java Spring Boot applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="code-block text-xs whitespace-pre-wrap max-h-96 overflow-y-auto">
{`FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]`}
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-background/80"
                    onClick={() => copyToClipboard(`FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]`)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Go Application</CardTitle>
                <CardDescription>Dockerfile for Go applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="code-block text-xs whitespace-pre-wrap max-h-96 overflow-y-auto">
{`FROM golang:1.18-alpine AS build

WORKDIR /app
COPY go.* ./
RUN go mod download

COPY . .
RUN go build -o /app/main .

FROM alpine:latest
WORKDIR /app
COPY --from=build /app/main .
EXPOSE 8080
CMD ["/app/main"]`}
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-background/80"
                    onClick={() => copyToClipboard(`FROM golang:1.18-alpine AS build

WORKDIR /app
COPY go.* ./
RUN go mod download

COPY . .
RUN go build -o /app/main .

FROM alpine:latest
WORKDIR /app
COPY --from=build /app/main .
EXPOSE 8080
CMD ["/app/main"]`)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="commands" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Common Docker Commands</CardTitle>
              <CardDescription>Useful commands for working with Docker</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Building Images</h3>
                  <div className="space-y-2">
                    <div className="bg-muted p-3 rounded flex justify-between items-center">
                      <code className="text-sm">docker build -t myapp:latest .</code>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard("docker build -t myapp:latest .")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Build a Docker image from the Dockerfile in the current directory and tag it as myapp:latest
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Running Containers</h3>
                  <div className="space-y-2">
                    <div className="bg-muted p-3 rounded flex justify-between items-center">
                      <code className="text-sm">docker run -p 3000:3000 myapp:latest</code>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard("docker run -p 3000:3000 myapp:latest")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Run a container from the myapp:latest image, mapping port 3000 from the container to port 3000 on the host
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Managing Containers</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="bg-muted p-3 rounded flex justify-between items-center">
                        <code className="text-sm">docker ps</code>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard("docker ps")}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        List running containers
                      </p>
                    </div>
                    <div>
                      <div className="bg-muted p-3 rounded flex justify-between items-center">
                        <code className="text-sm">docker stop [container_id]</code>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard("docker stop [container_id]")}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Stop a running container
                      </p>
                    </div>
                    <div>
                      <div className="bg-muted p-3 rounded flex justify-between items-center">
                        <code className="text-sm">docker rm [container_id]</code>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard("docker rm [container_id]")}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Remove a container
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Managing Images</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="bg-muted p-3 rounded flex justify-between items-center">
                        <code className="text-sm">docker images</code>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard("docker images")}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        List all Docker images
                      </p>
                    </div>
                    <div>
                      <div className="bg-muted p-3 rounded flex justify-between items-center">
                        <code className="text-sm">docker rmi [image_id]</code>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard("docker rmi [image_id]")}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Remove a Docker image
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="best-practices" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Docker Best Practices</CardTitle>
              <CardDescription>Guidelines for creating efficient Docker images</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Use Multi-stage Builds</h3>
                  <p className="text-muted-foreground">
                    Multi-stage builds allow you to use multiple FROM statements in your Dockerfile. Each FROM instruction can use a different base image, and begins a new stage of the build. This helps create smaller, more efficient Docker images.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Optimize Layer Caching</h3>
                  <p className="text-muted-foreground">
                    Order Docker instructions from least to most likely to change. Docker uses a cache system for building images, and changes to a layer invalidate the cache for all subsequent layers.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Minimize the Number of Layers</h3>
                  <p className="text-muted-foreground">
                    Each instruction in a Dockerfile creates a new layer. Use && to chain commands and use RUN once instead of multiple times to reduce the number of layers.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Use .dockerignore</h3>
                  <p className="text-muted-foreground">
                    Use a .dockerignore file to exclude files and directories from the build context. This can speed up the build process and reduce the size of the image.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Use Specific Tags</h3>
                  <p className="text-muted-foreground">
                    Always use specific tags for base images (e.g., node:16-alpine instead of node:latest) to ensure reproducible builds.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Use Lightweight Base Images</h3>
                  <p className="text-muted-foreground">
                    Use lightweight base images like Alpine Linux where possible. These images are smaller and contain only the essential packages needed to run your application.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Don't Run as Root</h3>
                  <p className="text-muted-foreground">
                    Create a non-root user and use the USER instruction to switch to that user before running your application. This improves security.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Docker;
