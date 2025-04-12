
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { pipelineTemplates } from "@/lib/pipeline-templates";
import { Link } from "react-router-dom";
import { ArrowRight, Code, FileDown, GitBranch, Play } from "lucide-react";

const Dashboard = () => {
  const featuredTemplates = pipelineTemplates.slice(0, 3);

  return (
    <div>
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold mb-2">Welcome to Pipeline Craft</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Create, customize, and deploy CI/CD pipelines for various platforms
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card className="bg-gradient-to-br from-devops-blue to-blue-700 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Build Your Pipeline</CardTitle>
            <CardDescription className="text-blue-100">
              Get started with a custom CI/CD pipeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Create a new pipeline from scratch or use one of our templates.</p>
          </CardContent>
          <CardFooter>
            <Button variant="secondary" className="mt-2 bg-white text-devops-blue hover:bg-blue-50" asChild>
              <Link to="/builder">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/templates">
                  <GitBranch className="mr-2 h-4 w-4" />
                  Browse Templates
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/builder">
                  <Code className="mr-2 h-4 w-4" />
                  Pipeline Builder
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/downloads">
                  <FileDown className="mr-2 h-4 w-4" />
                  My Downloads
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link to="/simulate">
                  <Play className="mr-2 h-4 w-4" />
                  Simulate Pipeline
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Featured Templates</h2>
          <Button variant="ghost" asChild>
            <Link to="/templates">View All Templates</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTemplates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <CardTitle>{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2 mb-2">
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {template.platform}
                  </span>
                  <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    {template.language}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {template.stages.length} pipeline stages
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/builder?template=${template.id}`}>
                    Use Template
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-muted rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-primary w-12 h-12 flex items-center justify-center text-white text-xl font-bold mb-4">1</div>
            <h3 className="font-semibold mb-2">Select a Template</h3>
            <p className="text-sm text-muted-foreground">Choose from a variety of templates based on your deployment scenario and cloud provider.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-primary w-12 h-12 flex items-center justify-center text-white text-xl font-bold mb-4">2</div>
            <h3 className="font-semibold mb-2">Customize Your Pipeline</h3>
            <p className="text-sm text-muted-foreground">Add, remove, or modify pipeline stages to suit your specific requirements.</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-primary w-12 h-12 flex items-center justify-center text-white text-xl font-bold mb-4">3</div>
            <h3 className="font-semibold mb-2">Generate & Download</h3>
            <p className="text-sm text-muted-foreground">Get your pipeline configuration files and Dockerfile ready to use in your project.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
