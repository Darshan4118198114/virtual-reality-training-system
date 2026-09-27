import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';

export default function AdminBuilder() {
  const [steps, setSteps] = useState([
    { id: 1, instruction: 'Identify the fire extinguisher.', targetObject: 'extinguisher', requiredAction: 'click' }
  ]);

  const addStep = () => {
    setSteps([...steps, { id: Date.now(), instruction: '', targetObject: '', requiredAction: 'click' }]);
  };

  const removeStep = (id: number) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const updateStep = (id: number, field: string, value: string) => {
    setSteps(steps.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  return (
    <div className="min-h-screen p-8 bg-slate-900">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-3xl font-bold text-white">Training Module Builder</h1>
          </div>
          <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition-colors font-medium">
            <Save size={20} />
            <span>Save Module</span>
          </button>
        </header>

        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 mb-8">
          <h2 className="text-xl font-semibold mb-6 border-b border-slate-700 pb-2">Module Details</h2>
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Module Title</label>
              <input type="text" defaultValue="New Training Module" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Difficulty</label>
              <select className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white">
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
          <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-2">
            <h2 className="text-xl font-semibold">Training Steps</h2>
            <button onClick={addStep} className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
              <Plus size={20} />
              <span>Add Step</span>
            </button>
          </div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={step.id} className="bg-slate-900 p-6 rounded-lg border border-slate-700 relative group">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => removeStep(step.id)} className="text-red-400 hover:text-red-300">
                    <Trash2 size={20} />
                  </button>
                </div>
                
                <h3 className="text-lg font-medium mb-4">Step {index + 1}</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Instruction (What the user sees)</label>
                    <input 
                      type="text" 
                      value={step.instruction}
                      onChange={(e) => updateStep(step.id, 'instruction', e.target.value)}
                      placeholder="e.g. Pick up the fire extinguisher" 
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Required Object ID</label>
                      <input 
                        type="text"
                        value={step.targetObject}
                        onChange={(e) => updateStep(step.id, 'targetObject', e.target.value)} 
                        placeholder="e.g. fire_extinguisher" 
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Interaction Type</label>
                      <select 
                        value={step.requiredAction}
                        onChange={(e) => updateStep(step.id, 'requiredAction', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                      >
                        <option value="click">Click / Point</option>
                        <option value="grab">Grab / Squeeze</option>
                        <option value="release">Release</option>
                        <option value="inspect">Inspect</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
