import { useState, useContext, useEffect, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { LogOut, Send, Activity, Save, AlertTriangle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const analyzeSentimentDetails = (emotion) => {
    if (!emotion) return null;
    
    // Pure Dictionary Lookup (No Regex!)
    switch(emotion) {
        case 'SELF_HARM':
            return {
                type: 'SELF_HARM',
                bgClass: 'bg-red-900',
                bannerColor: 'bg-red-600',
                title: 'EMERGENCY HELPLINE',
                message: 'You are not alone. Please call Umang Pakistan for free 24/7 psychological support.',
                ctaText: 'Call Umang Pakistan',
                ctaLink: 'tel:03117786264',
                needsAlarm: true,
                isBanner: true,
            };
        case 'HOSTILE':
            return {
                type: 'HOSTILE',
                bgClass: 'bg-orange-900',
                bannerColor: 'bg-orange-600',
                title: 'HOSTILITY DETECTED',
                message: 'Violence or harm towards others is never the solution. Please take a moment to step back and cool down.',
                ctaText: 'Anger Management Tips',
                ctaLink: 'https://www.apa.org/topics/anger/control',
                needsAlarm: true,
                isBanner: true,
            };
        case 'FRUSTRATED':
            return {
                type: 'FRUSTRATED',
                bgClass: 'bg-orange-800',
                boxColor: 'bg-orange-500/20 border-orange-500/50',
                textColor: 'text-orange-200',
                message: 'Take a deep breath. It is completely okay to feel frustrated, but do not let it consume your day.',
                ctaText: 'Quick stress relief techniques',
                ctaLink: 'https://www.verywellmind.com/tips-to-reduce-stress-3145195',
                needsAlarm: false,
            };
        case 'ANXIOUS':
            return {
                type: 'ANXIOUS',
                bgClass: 'bg-indigo-900',
                boxColor: 'bg-indigo-500/20 border-indigo-500/50',
                textColor: 'text-indigo-200',
                message: '"Anxiety happens when you think you have to figure out everything all at once." Take it one step at a time.',
                ctaText: 'Try a 5-minute breathing exercise',
                ctaLink: 'https://www.youtube.com/watch?v=inpok4MKVLM',
                needsAlarm: false,
            };
        case 'LONELY':
            return {
                type: 'LONELY',
                bgClass: 'bg-purple-900',
                boxColor: 'bg-purple-500/20 border-purple-500/50',
                textColor: 'text-purple-200',
                message: 'Feeling lonely is a universal human experience. It means you have a beautiful capacity for connection.',
                ctaText: 'Find a supportive community',
                ctaLink: 'https://www.7cups.com/',
                needsAlarm: false,
            };
        case 'GRIEF':
            return {
                type: 'GRIEF',
                bgClass: 'bg-teal-900',
                boxColor: 'bg-teal-500/20 border-teal-500/50',
                textColor: 'text-teal-200',
                message: 'Grief is just love with no place to go. Take all the time you need to heal.',
                ctaText: 'Understanding the stages of grief',
                ctaLink: 'https://www.helpguide.org/articles/grief/coping-with-grief-and-loss.htm',
                needsAlarm: false,
            };
        case 'SICK':
            return {
                type: 'SICK',
                bgClass: 'bg-yellow-900',
                boxColor: 'bg-yellow-500/20 border-yellow-500/50',
                textColor: 'text-yellow-200',
                message: 'I\'m sorry to hear you\'re not feeling well. Please make sure to rest and take care of your health.',
                ctaText: 'Listen to relaxing healing music',
                ctaLink: 'https://www.youtube.com/watch?v=lFcSrYw-ARY',
                needsAlarm: false,
            };
        case 'TIRED':
            return {
                type: 'TIRED',
                bgClass: 'bg-stone-800',
                boxColor: 'bg-stone-500/20 border-stone-500/50',
                textColor: 'text-stone-200',
                message: 'It sounds like you really need some rest. Listen to your body and take a break.',
                ctaText: 'Tips for better sleep',
                ctaLink: 'https://www.sleepfoundation.org/sleep-hygiene',
                needsAlarm: false,
            };
        case 'CONFUSED':
            return {
                type: 'CONFUSED',
                bgClass: 'bg-blue-900',
                boxColor: 'bg-blue-500/20 border-blue-500/50',
                textColor: 'text-blue-200',
                message: 'It is okay not to have all the answers right now. Take a step back and clear your mind.',
                ctaText: 'Grounding exercises',
                ctaLink: 'https://www.healthline.com/health/grounding-techniques',
                needsAlarm: false,
            };
        case 'GRATEFUL':
            return {
                type: 'GRATEFUL',
                bgClass: 'bg-emerald-900',
                boxColor: 'bg-emerald-500/20 border-emerald-500/50',
                textColor: 'text-emerald-200',
                message: 'Gratitude turns what we have into enough. Keep counting your blessings! 🙏',
                ctaText: 'Start a gratitude journal',
                ctaLink: 'https://journey.cloud/gratitude-journal',
                needsAlarm: false,
            };
        case 'HAPPY':
            return {
                type: 'HAPPY',
                bgClass: 'bg-green-900',
                boxColor: 'bg-green-500/20 border-green-500/50',
                textColor: 'text-green-200',
                message: 'Keep that positive energy flowing! You\'re doing amazing! 🚀',
                ctaText: 'Listen to a happy playlist',
                ctaLink: 'https://www.youtube.com/watch?v=ZbZSe6N_BXs',
                needsAlarm: false,
            };
        case 'SAD':
        default:
            return {
                type: 'SAD',
                bgClass: 'bg-yellow-900',
                boxColor: 'bg-yellow-500/20 border-yellow-500/50',
                textColor: 'text-yellow-200',
                message: '"Tough times never last, but tough people do." Take a deep breath, things will definitely get better. 🌟',
                ctaText: 'Watch something uplifting',
                ctaLink: 'https://www.youtube.com/watch?v=ZXsQAXx_ao0',
                needsAlarm: false,
            };
    }
};

export default function Dashboard() {
    const { token, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const sentimentInfo = useMemo(() => analyzeSentimentDetails(prediction), [prediction]);

    useEffect(() => {
        if (sentimentInfo && sentimentInfo.needsAlarm) {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.8);
        }
    }, [sentimentInfo]);

    const handlePredict = async () => {
        if (!text.trim()) return;
        setLoading(true);
        setPrediction(null);
        setSaved(false);
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/predict/', { text }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPrediction(res.data.emotion);
        } catch (error) {
            console.error('Prediction failed', error);
            if (error.response && error.response.status === 401) {
                alert('Your session has expired! Please click "Logout" at the top right and log in again to get your fresh 30-day token.');
                logout();
                navigate('/');
            } else {
                alert('Failed to get prediction. Ensure the backend and ML model are running.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/api/posts/', 
                { content: text, sentiment_prediction: prediction },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            setSaved(true);
        } catch (error) {
            console.error('Failed to save post', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const bgClass = sentimentInfo ? sentimentInfo.bgClass : 'bg-dark-900';

    return (
        <div className={`min-h-screen flex flex-col transition-colors duration-700 ${bgClass}`}>
            
            {/* Top Alert Box for Emergencies (Self-Harm or Hostile) */}
            {sentimentInfo && sentimentInfo.isBanner && (
                <div className={`${sentimentInfo.bannerColor} text-white p-4 shadow-2xl flex items-center justify-center space-x-3 z-50 animate-bounce`}>
                    <AlertTriangle className="w-8 h-8 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-lg">{sentimentInfo.title}</h4>
                        <p className="text-sm mr-2 inline">
                            {sentimentInfo.message}
                        </p>
                        <a href={sentimentInfo.ctaLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-bold underline hover:opacity-80 transition-opacity whitespace-nowrap">
                            {sentimentInfo.ctaText} <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="glass-panel rounded-none border-t-0 border-x-0 border-b border-white/10 sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <Activity className="text-white w-8 h-8" />
                    <span className="text-xl font-bold text-white tracking-wide">MindSentinel</span>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('/profile')} className="text-white/80 hover:text-white transition-colors font-medium">Profile</button>
                    <button onClick={handleLogout} className="text-white/80 hover:text-red-300 transition-colors flex items-center space-x-2">
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-4xl w-full mx-auto p-6 flex flex-col justify-center relative">
                <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary-500/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-primary-900/40 rounded-full blur-[120px]" />

                <div className="text-center mb-10 z-10">
                    <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">Sentiment Analysis Engine</h2>
                    <p className="text-white/70">Enter your text below to predict sentiment using our custom ML model.</p>
                </div>

                <div className="glass-panel p-6 z-10 bg-dark-800/40">
                    <textarea 
                        className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-white/50 resize-none transition-all placeholder:text-white/40"
                        rows="5"
                        placeholder="Type something here... (Shift + Enter to Analyze)"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.shiftKey) {
                                e.preventDefault();
                                handlePredict();
                            }
                        }}
                    ></textarea>

                    <div className="mt-4 flex justify-end">
                        <button 
                            onClick={handlePredict}
                            disabled={loading || !text.trim()}
                            className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 shadow-lg shadow-primary-500/20 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                            <span>Analyze Sentiment</span>
                        </button>
                    </div>
                </div>

                {/* Results Section */}
                {prediction !== null && (
                    <div className="mt-8 glass-panel p-8 bg-dark-800/40 text-center animate-fade-in z-10 flex flex-col items-center">
                        <h3 className="text-xl text-white/80 mb-2">Prediction Result</h3>
                        <div className={`text-4xl font-bold mb-6 text-white tracking-widest`}>
                            {prediction.replace('_', ' ')}
                        </div>
                        
                        <button 
                            onClick={handleSave}
                            disabled={saved}
                            className={`flex items-center space-x-2 px-5 py-2 rounded-lg transition-all ${
                                saved ? 'bg-white/20 text-white cursor-default' : 'bg-black/30 hover:bg-black/50 text-white'
                            }`}
                        >
                            <Save className="w-4 h-4" />
                            <span>{saved ? 'Saved to Profile' : 'Save Result'}</span>
                        </button>

                        {/* Regular Sentiment Box (Non-banner) */}
                        {sentimentInfo && !sentimentInfo.isBanner && (
                            <div className={`mt-6 ${sentimentInfo.boxColor} border rounded-xl p-5 max-w-md w-full text-center flex flex-col items-center shadow-lg`}>
                                <p className={`${sentimentInfo.textColor} font-medium mb-4 text-lg`}>{sentimentInfo.message}</p>
                                <a 
                                    href={sentimentInfo.ctaLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold bg-white/10 hover:bg-white/20 transition-colors ${sentimentInfo.textColor}`}
                                >
                                    <span>{sentimentInfo.ctaText}</span>
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
