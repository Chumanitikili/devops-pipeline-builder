
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Downloads = () => {
  // In a real app, this would be fetched from a database or local storage
  const recentDownloads = [
    {
      id: "1",
      name: "Node.js AWS Pipeline",
      date: "Apr 12, 2025",
      files: ["github-actions.yml", "Dockerfile"],
    },
    {
      id: "2",
      name: "Python GCP Deployment",
      date: "Apr 10, 2025",
      files: ["github-actions.yml", "Dockerfile", "requirements.txt"],
    },
  ];

  return (
    <div>
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Downloads</h1>
        <p className="text-muted-foreground">
          Access your recently generated pipeline configurations
        </p>
      </div>

      {recentDownloads.length > 0 ? (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Recent Downloads</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentDownloads.map((download) => (
              <Card key={download.id}>
                <CardHeader>
                  <CardTitle>{download.name}</CardTitle>
                  <CardDescription>Downloaded on {download.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Files:</h4>
                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                        {download.files.map((file) => (
                          <li key={file}>{file}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <FileDown className="mr-2 h-4 w-4" />
                        Download Again
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/builder?id=${download.id}`}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Edit Pipeline
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No downloads yet</h3>
          <p className="text-muted-foreground mb-6">
            Start by creating a pipeline and downloading the configuration files
          </p>
          <Button asChild>
            <Link to="/builder">Create New Pipeline</Link>
          </Button>
        </div>
      )}

      <div className="mt-12 bg-muted rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">How to Use Downloaded Files</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">GitHub Actions Workflow</h3>
            <p className="text-sm text-muted-foreground">
              Place the <code className="bg-background px-1 rounded">github-actions.yml</code> file in the <code className="bg-background px-1 rounded">.github/workflows</code> directory of your repository.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Jenkinsfile</h3>
            <p className="text-sm text-muted-foreground">
              Place the <code className="bg-background px-1 rounded">Jenkinsfile</code> in the root of your repository and configure your Jenkins instance to use it.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Dockerfile</h3>
            <p className="text-sm text-muted-foreground">
              Place the <code className="bg-background px-1 rounded">Dockerfile</code> in the root of your repository. It can be used by your CI/CD pipeline to build a Docker image.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Downloads;
