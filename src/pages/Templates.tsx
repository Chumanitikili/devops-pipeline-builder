
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { pipelineTemplates } from "@/lib/pipeline-templates";
import { PipelinePlatform, ProgrammingLanguage, DeploymentTarget } from "@/lib/types";
import { Search, Filter } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Templates = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState<PipelinePlatform | "all">("all");
  const [languageFilter, setLanguageFilter] = useState<ProgrammingLanguage | "all">("all");
  const [targetFilter, setTargetFilter] = useState<DeploymentTarget | "all">("all");

  const filteredTemplates = pipelineTemplates.filter((template) => {
    // Search filter
    if (
      searchQuery &&
      !template.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !template.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Platform filter
    if (platformFilter !== "all" && template.platform !== platformFilter) {
      return false;
    }

    // Language filter
    if (languageFilter !== "all" && template.language !== languageFilter) {
      return false;
    }

    // Target filter
    if (targetFilter !== "all" && template.deploymentTarget !== targetFilter) {
      return false;
    }

    return true;
  });

  return (
    <div>
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Pipeline Templates</h1>
        <p className="text-muted-foreground">
          Choose from pre-built templates to quickly get started with your CI/CD pipeline
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search templates..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap md:flex-nowrap">
          <div className="w-full md:w-auto">
            <Select
              value={platformFilter}
              onValueChange={(value) => setPlatformFilter(value as PipelinePlatform | "all")}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="github-actions">GitHub Actions</SelectItem>
                <SelectItem value="jenkins">Jenkins</SelectItem>
                <SelectItem value="gitlab-ci">GitLab CI</SelectItem>
                <SelectItem value="azure-devops">Azure DevOps</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-auto">
            <Select
              value={languageFilter}
              onValueChange={(value) => setLanguageFilter(value as ProgrammingLanguage | "all")}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="csharp">C#</SelectItem>
                <SelectItem value="go">Go</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-auto">
            <Select
              value={targetFilter}
              onValueChange={(value) => setTargetFilter(value as DeploymentTarget | "all")}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Target" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Targets</SelectItem>
                <SelectItem value="aws">AWS</SelectItem>
                <SelectItem value="azure">Azure</SelectItem>
                <SelectItem value="gcp">GCP</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No templates found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
          <Button onClick={() => {
            setSearchQuery("");
            setPlatformFilter("all");
            setLanguageFilter("all");
            setTargetFilter("all");
          }}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {template.platform}
                  </span>
                  <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    {template.language}
                  </span>
                  <span className="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20">
                    {template.deploymentTarget}
                  </span>
                </div>
                <div className="space-y-2">
                  <Label>Pipeline Stages:</Label>
                  <ul className="text-sm list-disc list-inside text-muted-foreground">
                    {template.stages.slice(0, 3).map((stage) => (
                      <li key={stage.id}>{stage.name}</li>
                    ))}
                    {template.stages.length > 3 && (
                      <li>+{template.stages.length - 3} more stages</li>
                    )}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link to={`/builder?template=${template.id}`}>
                    Use Template
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Templates;
