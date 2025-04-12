
import React, { createContext, useContext, useState } from 'react';
import { Pipeline, PipelineStage, PipelinePlatform, DeploymentTarget, ProgrammingLanguage } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface PipelineContextType {
  currentPipeline: Pipeline | null;
  setCurrentPipeline: (pipeline: Pipeline | null) => void;
  createPipeline: (name: string, platform: PipelinePlatform, deploymentTarget: DeploymentTarget, language: ProgrammingLanguage) => void;
  addStage: (stage: Omit<PipelineStage, 'id'>) => void;
  updateStage: (id: string, stage: Partial<PipelineStage>) => void;
  removeStage: (id: string) => void;
  reorderStages: (startIndex: number, endIndex: number) => void;
  resetPipeline: () => void;
}

const PipelineContext = createContext<PipelineContextType | undefined>(undefined);

export const PipelineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPipeline, setCurrentPipeline] = useState<Pipeline | null>(null);

  const createPipeline = (name: string, platform: PipelinePlatform, deploymentTarget: DeploymentTarget, language: ProgrammingLanguage) => {
    const now = new Date();
    setCurrentPipeline({
      id: uuidv4(),
      name,
      stages: [],
      platform,
      deploymentTarget,
      language,
      created: now,
      modified: now,
    });
    toast.success('New pipeline created');
  };

  const addStage = (stage: Omit<PipelineStage, 'id'>) => {
    if (!currentPipeline) return;
    
    const newStage: PipelineStage = {
      ...stage,
      id: uuidv4(),
    };
    
    setCurrentPipeline({
      ...currentPipeline,
      stages: [...currentPipeline.stages, newStage],
      modified: new Date(),
    });
    
    toast.success(`Added stage: ${stage.name}`);
  };

  const updateStage = (id: string, stage: Partial<PipelineStage>) => {
    if (!currentPipeline) return;
    
    setCurrentPipeline({
      ...currentPipeline,
      stages: currentPipeline.stages.map(s => 
        s.id === id ? { ...s, ...stage } : s
      ),
      modified: new Date(),
    });
  };

  const removeStage = (id: string) => {
    if (!currentPipeline) return;
    
    const stageName = currentPipeline.stages.find(s => s.id === id)?.name;
    
    setCurrentPipeline({
      ...currentPipeline,
      stages: currentPipeline.stages.filter(s => s.id !== id),
      modified: new Date(),
    });
    
    toast.success(`Removed stage: ${stageName}`);
  };

  const reorderStages = (startIndex: number, endIndex: number) => {
    if (!currentPipeline) return;
    
    const result = Array.from(currentPipeline.stages);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    
    setCurrentPipeline({
      ...currentPipeline,
      stages: result,
      modified: new Date(),
    });
  };

  const resetPipeline = () => {
    setCurrentPipeline(null);
    toast.info('Pipeline reset');
  };

  return (
    <PipelineContext.Provider
      value={{
        currentPipeline,
        setCurrentPipeline,
        createPipeline,
        addStage,
        updateStage,
        removeStage,
        reorderStages,
        resetPipeline,
      }}
    >
      {children}
    </PipelineContext.Provider>
  );
};

export const usePipeline = (): PipelineContextType => {
  const context = useContext(PipelineContext);
  if (context === undefined) {
    throw new Error('usePipeline must be used within a PipelineProvider');
  }
  return context;
};
