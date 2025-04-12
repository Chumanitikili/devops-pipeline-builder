
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PipelineProvider, usePipeline } from "@/contexts/PipelineContext";
import { pipelineTemplates } from "@/lib/pipeline-templates";
import { generatePipelineFiles } from "@/lib/pipeline-generator";
import {
  PipelinePlatform,
  DeploymentTarget,
  ProgrammingLanguage,
  PipelineStage,
} from "@/lib/types";
import { Plus, Download, ArrowRight, Save, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const PipelineBuilderContent = () => {
  const [searchParams] = useSearchParams();
  const { 
    currentPipeline, 
    createPipeline, 
    setCurrentPipeline, 
    addStage, 
    updateStage, 
    removeStage,
    resetPipeline
  } = usePipeline();
  
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState<PipelinePlatform>("github-actions");
  const [deploymentTarget, setDeploymentTarget] = useState<DeploymentTarget>("aws");
  const [language, setLanguage] = useState<ProgrammingLanguage>("javascript");
  
  const [newStageName, setNewStageName] = useState("");
  const [newStageType, setNewStageType] = useState<PipelineStage["type"]>("build");
  const [newStageCommands, setNewStageCommands] = useState("");
  
  const [pipelineFiles, setPipelineFiles] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("editor");

  // Load template if specified in URL
  useEffect(() => {
    const templateId = searchParams.get("template");
    if (templateId) {
      const template = pipelineTemplates.find((t) => t.id === templateId);
      if (template) {
        setName(template.name);
        setPlatform(template.platform);
        setDeploymentTarget(template.deploymentTarget);
        setLanguage(template.language);
        
        // Create a new pipeline from the template
        const now = new Date();
        setCurrentPipeline({
          id: crypto.randomUUID(),
          name: template.name,
          description: template.description,
          stages: template.stages,
          platform: template.platform,
          deploymentTarget: template.deploymentTarget,
          language: template.language,
          created: now,
          modified: now,
        });
        
        toast.success(`Loaded template: ${template.name}`);
      }
    }
  }, [searchParams, setCurrentPipeline]);

  // Generate pipeline files when the current pipeline changes
  useEffect(() => {
    if (currentPipeline) {
      setPipelineFiles(generatePipelineFiles(currentPipeline));
    }
  }, [currentPipeline]);

  const handleCreatePipeline = () => {
    if (!name) {
      toast.error("Please enter a pipeline name");
      return;
    }
    
    createPipeline(name, platform, deploymentTarget, language);
    setActiveTab("stages");
  };

  const handleAddStage = () => {
    if (!newStageName) {
      toast.error("Please enter a stage name");
      return;
    }
    
    if (!newStageCommands) {
      toast.error("Please enter commands for the stage");
      return;
    }
    
    addStage({
      name: newStageName,
      type: newStageType,
      commands: newStageCommands.split("\n").filter(cmd => cmd.trim() !== ""),
    });
    
    // Clear the form
    setNewStageName("");
    setNewStageCommands("");
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Downloaded ${filename}`);
  };

  const handleDownloadAll = () => {
    // In a real app, we would create a zip file with all files
    // For this demo, we'll just download them one by one
    Object.entries(pipelineFiles).forEach(([filename, content]) => {
      handleDownloadFile(filename, content);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Pipeline Builder</h1>
        <p className="text-muted-foreground">
          Create and customize your CI/CD pipeline
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="editor">Pipeline Setup</TabsTrigger>
          <TabsTrigger value="stages" disabled={!currentPipeline}>
            Pipeline Stages
          </TabsTrigger>
          <TabsTrigger value="preview" disabled={!currentPipeline}>
            Preview & Download
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configure Your Pipeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Pipeline Name</Label>
                <Input
                  id="name"
                  placeholder="My CI/CD Pipeline"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="platform">CI/CD Platform</Label>
                  <Select
                    value={platform}
                    onValueChange={(value) => setPlatform(value as PipelinePlatform)}
                  >
                    <SelectTrigger id="platform">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="github-actions">GitHub Actions</SelectItem>
                      <SelectItem value="jenkins">Jenkins</SelectItem>
                      <SelectItem value="gitlab-ci">GitLab CI</SelectItem>
                      <SelectItem value="azure-devops">Azure DevOps</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target">Deployment Target</Label>
                  <Select
                    value={deploymentTarget}
                    onValueChange={(value) => setDeploymentTarget(value as DeploymentTarget)}
                  >
                    <SelectTrigger id="target">
                      <SelectValue placeholder="Select target" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aws">AWS</SelectItem>
                      <SelectItem value="azure">Azure</SelectItem>
                      <SelectItem value="gcp">GCP</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Programming Language</Label>
                  <Select
                    value={language}
                    onValueChange={(value) => setLanguage(value as ProgrammingLanguage)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="csharp">C#</SelectItem>
                      <SelectItem value="go">Go</SelectItem>
                      <SelectItem value="ruby">Ruby</SelectItem>
                      <SelectItem value="php">PHP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleCreatePipeline}>
                  Create Pipeline
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stages" className="mt-6">
          {currentPipeline && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pipeline Stages</CardTitle>
                </CardHeader>
                <CardContent>
                  {currentPipeline.stages.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        No stages defined yet. Add some stages to your pipeline.
                      </p>
                      <Button variant="outline" onClick={() => setActiveTab("preview")}>
                        Skip to Preview
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {currentPipeline.stages.map((stage, index) => (
                        <div
                          key={stage.id}
                          className="pipeline-stage group"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs mr-2">
                                {index + 1}
                              </div>
                              <h4 className="font-medium">{stage.name}</h4>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeStage(stage.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-sm">
                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-2">
                              {stage.type}
                            </span>
                            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                              {stage.commands.join("\n")}
                            </pre>
                          </div>
                        </div>
                      ))}
                      <div className="pt-2">
                        <Button variant="outline" onClick={() => setActiveTab("preview")}>
                          Continue to Preview
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Add Stage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="stageName">Stage Name</Label>
                      <Input
                        id="stageName"
                        placeholder="e.g., Build, Test, Deploy"
                        value={newStageName}
                        onChange={(e) => setNewStageName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stageType">Stage Type</Label>
                      <Select
                        value={newStageType}
                        onValueChange={(value) => setNewStageType(value as PipelineStage["type"])}
                      >
                        <SelectTrigger id="stageType">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="build">Build</SelectItem>
                          <SelectItem value="test">Test</SelectItem>
                          <SelectItem value="deploy">Deploy</SelectItem>
                          <SelectItem value="notify">Notify</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="commands">Commands</Label>
                      <Textarea
                        id="commands"
                        placeholder={`Enter commands, one per line\ne.g., npm install\nnpm test`}
                        rows={5}
                        value={newStageCommands}
                        onChange={(e) => setNewStageCommands(e.target.value)}
                      />
                    </div>

                    <Button
                      onClick={handleAddStage}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Stage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          {currentPipeline && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {currentPipeline.name} Preview
                </h2>
                <div className="space-x-2">
                  <Button variant="outline" onClick={resetPipeline}>
                    <Trash className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                  <Button onClick={handleDownloadAll}>
                    <Download className="mr-2 h-4 w-4" />
                    Download All
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(pipelineFiles).map(([filename, content]) => (
                  <Card key={filename}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{filename}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadFile(filename, content)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <pre className="code-block text-xs whitespace-pre-wrap max-h-96 overflow-y-auto">
                        {content}
                      </pre>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-muted rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Next Steps</h3>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Download the generated files</li>
                  <li>Add them to your project repository</li>
                  <li>Commit and push to trigger the CI/CD pipeline</li>
                  <li>Monitor the pipeline execution in your CI/CD platform</li>
                </ol>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Wrapper component to provide the PipelineContext
const PipelineBuilder = () => (
  <PipelineProvider>
    <PipelineBuilderContent />
  </PipelineProvider>
);

export default PipelineBuilder;
