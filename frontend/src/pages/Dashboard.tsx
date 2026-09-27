import { Link } from 'react-router-dom';
import { PlayCircle, Settings, Award, Clock } from 'lucide-react';

export default function Dashboard() {
  const modules = [
    { id: 'fire_safety_01', title: 'Fire Safety Training', progress: 75, status: 'In Progress', duration: '15m' },
    { id: 'machine_op_01', title: 'Machine Operation', progress: 0, status: 'Not Started', duration: '30m' },
    { id: 'electrical_01', title: 'Electrical Safety', progress: 100, status: 'Completed', duration: '20m' }
  ];

  return (
    <div className="min-h-screen p-8 bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Virtual Reality Training System</h1>
            <p className="text-slate-400">Welcome back, Learner. Ready to continue your training?</p>
          </div>
          <Link to="/admin" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors">
            <Settings size={20} />
            <span>Admin Builder</span>
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center gap-4 mb-2">
              <Award className="text-blue-400" size={32} />
              <h3 className="text-xl font-semibold">Average Score</h3>
            </div>
            <p className="text-4xl font-bold">87%</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center gap-4 mb-2">
              <PlayCircle className="text-green-400" size={32} />
              <h3 className="text-xl font-semibold">Completed</h3>
            </div>
            <p className="text-4xl font-bold">4 Modules</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center gap-4 mb-2">
              <Clock className="text-purple-400" size={32} />
              <h3 className="text-xl font-semibold">Training Time</h3>
            </div>
            <p className="text-4xl font-bold">4h 15m</p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-6">Available Training Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod) => (
            <div key={mod.id} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500 transition-colors flex flex-col">
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{mod.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    mod.progress === 100 ? 'bg-green-500/20 text-green-400' :
                    mod.progress > 0 ? 'bg-blue-500/20 text-blue-400' :
                    'bg-slate-700 text-slate-300'
                  }`}>
                    {mod.status}
                  </span>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-slate-400 mb-1">
                    <span>Progress</span>
                    <span>{mod.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all" 
                      style={{ width: `${mod.progress}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/50 p-4 border-t border-slate-700">
                <Link 
                  to={`/training/${mod.id}`}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors font-medium"
                >
                  <PlayCircle size={20} />
                  {mod.progress > 0 && mod.progress < 100 ? 'Continue Training' : 'Start Demo Training'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
