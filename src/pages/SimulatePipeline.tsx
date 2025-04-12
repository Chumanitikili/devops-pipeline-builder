
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CircleCheck, CircleX, Clock, Play, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type PipelineStepStatus = "idle" | "running" | "success" | "failure";

interface PipelineStep {
  id: string;
  name: string;
  status: PipelineStepStatus;
  duration?: number;
  log: string[];
}

const SimulatePipeline = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [pipelineSteps, setPipelineSteps] = useState<PipelineStep[]>([
    {
      id: "checkout",
      name: "Checkout Code",
      status: "idle",
      log: [],
    },
    {
      id: "install",
      name: "Install Dependencies",
      status: "idle",
      log: [],
    },
    {
      id: "build",
      name: "Build Application",
      status: "idle",
      log: [],
    },
    {
      id: "test",
      name: "Run Tests",
      status: "idle",
      log: [],
    },
    {
      id: "docker",
      name: "Build Docker Image",
      status: "idle",
      log: [],
    },
    {
      id: "deploy",
      name: "Deploy to Cloud",
      status: "idle",
      log: [],
    },
  ]);

  const getStatusIcon = (status: PipelineStepStatus) => {
    switch (status) {
      case "running":
        return <RefreshCw className="h-5 w-5 animate-spin" />;
      case "success":
        return <CircleCheck className="h-5 w-5 text-green-500" />;
      case "failure":
        return <CircleX className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const executePipelineStep = (stepIndex: number) => {
    return new Promise<void>((resolve) => {
      const step = pipelineSteps[stepIndex];
      
      // Mark step as running
      setPipelineSteps((prev) =>
        prev.map((s, i) =>
          i === stepIndex ? { ...s, status: "running" } : s
        )
      );

      // Simulate pipeline execution logs and timing
      const logs: string[] = [];
      const stepLogs: Record<string, string[]> = {
        checkout: [
          "Cloning repository...",
          "Checking out branch 'main'",
          "Successfully checked out repository",
        ],
        install: [
          "Installing dependencies using npm...",
          "added 1250 packages in 12s",
          "Dependencies successfully installed",
        ],
        build: [
          "Building application...",
          "Compiling JavaScript...",
          "Bundling assets...",
          "Application built successfully",
        ],
        test: [
          "Running unit tests...",
          "PASS src/utils/format.test.js",
          "PASS src/hooks/useApi.test.js",
          "PASS src/components/Button.test.js",
          "Test Suites: 12 passed, 12 total",
          "Tests: 48 passed, 48 total",
        ],
        docker: [
          "Building Docker image...",
          "Step 1/8 : FROM node:16-alpine",
          "Step 2/8 : WORKDIR /app",
          "Step 3/8 : COPY package*.json ./",
          "Step 4/8 : RUN npm ci",
          "Step 5/8 : COPY . .",
          "Step 6/8 : RUN npm run build",
          "Step 7/8 : EXPOSE 3000",
          "Step 8/8 : CMD [\"npm\", \"start\"]",
          "Successfully built image my-app:latest",
        ],
        deploy: [
          "Deploying to cloud...",
          "Pushing Docker image to registry...",
          "Creating deployment...",
          "Waiting for deployment to be ready...",
          "Deployment completed successfully",
        ],
      };

      // Add logs with a delay to simulate real-time execution
      const addLogs = (index: number) => {
        if (index < stepLogs[step.id].length) {
          logs.push(stepLogs[step.id][index]);
          setPipelineSteps((prev) =>
            prev.map((s, i) =>
              i === stepIndex ? { ...s, log: [...logs] } : s
            )
          );
          setTimeout(() => addLogs(index + 1), 500);
        } else {
          // Randomly decide if the step succeeds or fails (with 10% chance of failure)
          // For demo purposes, let's make the test step always succeed
          const success = Math.random() > 0.1 || step.id === "test";
          
          // Update step status
          setPipelineSteps((prev) =>
            prev.map((s, i) =>
              i === stepIndex
                ? {
                    ...s,
                    status: success ? "success" : "failure",
                    duration: Math.floor(Math.random() * 20) + 5, // Random duration between 5-25 seconds
                    log: [...logs],
                  }
                : s
            )
          );

          if (success) {
            resolve();
          } else {
            setIsRunning(false);
            toast.error(`Pipeline failed at step: ${step.name}`);
          }
        }
      };

      setTimeout(() => addLogs(0), 1000);
    });
  };

  const runPipeline = async () => {
    // Reset pipeline state
    setPipelineSteps((prev) =>
      prev.map((step) => ({ ...step, status: "idle", duration: undefined, log: [] }))
    );
    
    setIsRunning(true);
    toast.info("Pipeline simulation started");

    // Run pipeline steps sequentially
    for (let i = 0; i < pipelineSteps.length; i++) {
      try {
        await executePipelineStep(i);
      } catch (error) {
        // If a step fails, stop the pipeline
        break;
      }
    }

    setIsRunning(false);
    toast.success("Pipeline simulation completed");
  };

  return (
    <div>
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Simulate Pipeline</h1>
        <p className="text-muted-foreground">
          Test your pipeline in a simulated environment
        </p>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Pipeline Execution</h2>
          <p className="text-muted-foreground">
            Watch your pipeline run in real-time
          </p>
        </div>
        <Button disabled={isRunning} onClick={runPipeline}>
          <Play className="mr-2 h-4 w-4" />
          Run Simulation
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Steps</CardTitle>
              <CardDescription>Progress of each pipeline stage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pipelineSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                          step.status === "idle" && "bg-muted",
                          step.status === "running" && "bg-blue-100 text-blue-600",
                          step.status === "success" && "bg-green-100 text-green-600",
                          step.status === "failure" && "bg-red-100 text-red-600"
                        )}
                      >
                        {getStatusIcon(step.status)}
                      </div>
                      <div>
                        <div className="font-medium">{step.name}</div>
                        {step.duration && (
                          <div className="text-xs text-muted-foreground">
                            Duration: {step.duration}s
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Execution Logs</CardTitle>
              <CardDescription>Real-time logs from the pipeline execution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] overflow-auto bg-black rounded-md p-4 font-mono text-xs text-green-400 whitespace-pre-wrap">
                {pipelineSteps.map((step, index) => (
                  <div key={step.id}>
                    {step.log.length > 0 && (
                      <>
                        <div className="text-white font-bold mb-2">
                          {`=== ${step.name} ===`}
                        </div>
                        {step.log.map((line, lineIndex) => (
                          <div key={lineIndex} className="mb-1">
                            {line}
                          </div>
                        ))}
                        {step.status === "success" && (
                          <div className="text-green-500 mb-4">✓ Step completed successfully</div>
                        )}
                        {step.status === "failure" && (
                          <div className="text-red-500 mb-4">✗ Step failed</div>
                        )}
                        {index < pipelineSteps.length - 1 && step.status === "success" && (
                          <Separator className="my-4 bg-gray-700" />
                        )}
                      </>
                    )}
                  </div>
                ))}
                {!isRunning && pipelineSteps.every((step) => step.status === "idle") && (
                  <div className="text-gray-500">
                    Click "Run Simulation" to start the pipeline...
                  </div>
                )}
                {isRunning && (
                  <div className="animate-pulse">▌</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SimulatePipeline;
