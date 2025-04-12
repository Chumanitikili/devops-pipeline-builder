
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [jenkinsUrl, setJenkinsUrl] = useState("");
  const [githubToken, setGithubToken] = useState("");

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div>
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure application preferences and connections
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Application Settings</CardTitle>
            <CardDescription>Configure general application preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Enable dark theme for the application
                </p>
              </div>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications" className="font-medium">Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications for pipeline events
                </p>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-save" className="font-medium">Auto Save</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically save pipeline configurations
                </p>
              </div>
              <Switch
                id="auto-save"
                checked={autoSave}
                onCheckedChange={setAutoSave}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integration Settings</CardTitle>
            <CardDescription>Configure integration with external services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="jenkins-url">Jenkins URL</Label>
              <Input
                id="jenkins-url"
                placeholder="https://jenkins.example.com"
                value={jenkinsUrl}
                onChange={(e) => setJenkinsUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter the URL of your Jenkins instance for pipeline testing
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="github-token">GitHub Access Token</Label>
              <Input
                id="github-token"
                type="password"
                placeholder="ghp_xxxxxxxxxxxx"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                GitHub personal access token for repository operations
              </p>
            </div>
            
            <Button className="w-full mt-4" onClick={handleSaveSettings}>
              Save Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Manage your local data and pipeline configurations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <Button variant="outline" onClick={() => toast.success("Data exported successfully")}>
              Export Data
            </Button>
            <Button variant="outline" onClick={() => toast.success("Data imported successfully")}>
              Import Data
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
                  toast.success("All data cleared successfully");
                }
              }}
            >
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
