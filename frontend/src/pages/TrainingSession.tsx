import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { VRButton, XR } from '@react-three/xr';
import { FireSafetyScene } from '../vr/FireSafetyScene';
import { useTrainingStore } from '../store/trainingStore';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

export default function TrainingSession() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { score, currentStepIndex, steps, isComplete, mistakes, reset } = useTrainingStore();

  useEffect(() => {
    // Reset state when entering training
    reset();
  }, [reset]);

  const endSession = () => {
    navigate('/');
  };

  return (
    <div className="w-screen h-screen relative bg-black">
      {/* 2D HUD Overlay */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none w-full max-w-md">
        <div className="bg-slate-900/80 backdrop-blur-sm p-6 rounded-xl border border-slate-700 pointer-events-auto">
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Fire Safety Training</h2>
            <button onClick={endSession} className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={24} />
            </button>
          </div>

          {isComplete ? (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 text-green-400 mb-4">
                <CheckCircle size={32} />
                <h3 className="text-2xl font-bold">Training Complete!</h3>
              </div>
              <div className="bg-slate-800 rounded p-4 mb-4">
                <p className="text-slate-300 flex justify-between mb-2">
                  <span>Final Score:</span> 
                  <span className="font-bold text-white">{score}/100</span>
                </p>
                <p className="text-slate-300 flex justify-between mb-2">
                  <span>Mistakes made:</span> 
                  <span className="font-bold text-red-400">{mistakes}</span>
                </p>
                <p className="text-slate-300 flex justify-between">
                  <span>Performance:</span> 
                  <span className="font-bold text-blue-400">
                    {score >= 90 ? 'Excellent' : score >= 75 ? 'Good' : 'Needs Improvement'}
                  </span>
                </p>
              </div>
              <button 
                onClick={endSession}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-sm text-slate-400 uppercase tracking-wider font-semibold mb-1">
                    Step {currentStepIndex + 1} of {steps.length}
                  </p>
                  <p className="text-lg font-medium text-blue-300">
                    {steps[currentStepIndex]?.instruction || 'Initializing environment...'}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 p-3 rounded flex flex-col">
                  <span className="text-xs text-slate-400 uppercase">Current Score</span>
                  <span className={`text-2xl font-bold ${score < 80 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {score}
                  </span>
                </div>
                <div className="bg-slate-800 p-3 rounded flex flex-col">
                  <span className="text-xs text-slate-400 uppercase">Mistakes</span>
                  <span className={`text-2xl font-bold ${mistakes > 0 ? 'text-red-400' : 'text-white'}`}>
                    {mistakes}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* WebXR Enter VR Button */}
      <div className="absolute bottom-8 right-8 z-10">
        <VRButton className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold shadow-lg transition-all" />
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 1.2, 3], fov: 60 }}>
        <XR>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
          <FireSafetyScene />
        </XR>
      </Canvas>
    </div>
  );
}
