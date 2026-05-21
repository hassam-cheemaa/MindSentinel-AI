import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';

export default function LoginRegister() {
    const [isLogin, setIsLogin] = useState(true);
    const { login, register } = useContext(AuthContext);
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        let success;
        
        if (isLogin) {
            success = await login(username, password);
        } else {
            success = await register(username, password, email);
        }

        if (success) {
            navigate('/dashboard');
        } else {
            setError('Authentication failed. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-dark-900">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-500/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-primary-900/40 rounded-full blur-[100px]" />

            <div className="glass-panel w-full max-w-md p-8 relative z-10 transition-all duration-500">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-primary-500/10 rounded-2xl mb-4">
                        <BrainCircuit className="w-10 h-10 text-primary-500" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                        MindSentinel AI
                    </h1>
                    <p className="text-dark-300 mt-2 text-sm">Secure your mind. Analyze sentiment instantly.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-400 text-sm text-center bg-red-400/10 p-2 rounded-lg">{error}</p>}
                    
                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-1">Username</label>
                        <input 
                            type="text" 
                            className="w-full bg-dark-900/50 border border-dark-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-white"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-dark-300 mb-1">Email</label>
                            <input 
                                type="email" 
                                className="w-full bg-dark-900/50 border border-dark-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-white"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-dark-300 mb-1">Password</label>
                        <input 
                            type="password" 
                            className="w-full bg-dark-900/50 border border-dark-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-white"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-medium py-3 rounded-xl shadow-lg shadow-primary-500/20 transition-all active:scale-[0.98]"
                    >
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-primary-400 hover:text-primary-300 text-sm transition-colors"
                    >
                        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                </div>
            </div>
        </div>
    );
}
