import { create } from 'zustand'

export type TrainingStep = {
    id: string;
    instruction: string;
    targetObject: string;
    requiredAction: string;
}

interface TrainingState {
    currentStepIndex: number;
    steps: TrainingStep[];
    score: number;
    mistakes: number;
    isComplete: boolean;
    setSteps: (steps: TrainingStep[]) => void;
    nextStep: () => void;
    recordMistake: () => void;
    completeTraining: () => void;
    reset: () => void;
}

export const useTrainingStore = create<TrainingState>((set, get) => ({
    currentStepIndex: 0,
    steps: [],
    score: 100,
    mistakes: 0,
    isComplete: false,

    setSteps: (steps) => set({ steps }),
    nextStep: () => set((state) => ({ currentStepIndex: state.currentStepIndex + 1 })),
    recordMistake: () => set((state) => ({ mistakes: state.mistakes + 1, score: Math.max(0, state.score - 5) })),
    completeTraining: () => set({ isComplete: true }),
    reset: () => set({ currentStepIndex: 0, score: 100, mistakes: 0, isComplete: false })
}))
