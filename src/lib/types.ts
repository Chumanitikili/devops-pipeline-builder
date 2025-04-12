
// Pipeline types
export type PipelineStageType = 'build' | 'test' | 'deploy' | 'notify' | 'custom';

export interface PipelineStage {
  id: string;
  name: string;
  type: PipelineStageType;
  commands: string[];
  dependencies?: string[]; // IDs of stages this depends on
  environment?: Record<string, string>;
  artifacts?: string[];
}

export interface Pipeline {
  id: string;
  name: string;
  description?: string;
  stages: PipelineStage[];
  platform: PipelinePlatform;
  deploymentTarget: DeploymentTarget;
  language: ProgrammingLanguage;
  created: Date;
  modified: Date;
}

export type PipelinePlatform = 'github-actions' | 'jenkins' | 'gitlab-ci' | 'azure-devops';

export type DeploymentTarget = 'aws' | 'azure' | 'gcp' | 'custom';

export type ProgrammingLanguage = 'javascript' | 'typescript' | 'python' | 'java' | 'csharp' | 'go' | 'ruby' | 'php';

// Template types
export interface PipelineTemplate {
  id: string;
  name: string;
  description: string;
  platform: PipelinePlatform;
  deploymentTarget: DeploymentTarget;
  language: ProgrammingLanguage;
  stages: PipelineStage[];
  dockerfile?: string;
  image?: string;
}

// Project types
export interface Project {
  id: string;
  name: string;
  description?: string;
  pipelines: Pipeline[];
  created: Date;
  modified: Date;
}
