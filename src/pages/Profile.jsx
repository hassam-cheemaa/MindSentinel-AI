import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Trash2, MessageSquare, ArrowLeft, Send } from 'lucide-react';

export default function Profile() {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState({});

    const fetchPosts = useCallback(async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/posts/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(res.data);
        } catch (error) {
            console.error('Failed to fetch posts', error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const deletePost = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/posts/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPosts(posts.filter(p => p.id !== id));
        } catch (error) {
            console.error('Failed to delete post', error);
        }
    };

    const handleCommentChange = (postId, text) => {
        setCommentText({ ...commentText, [postId]: text });
    };

    const submitComment = async (postId) => {
        const text = commentText[postId];
        if (!text || !text.trim()) return;

        try {
            await axios.post('http://127.0.0.1:8000/api/comments/', 
                { post: postId, content: text },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCommentText({ ...commentText, [postId]: '' });
            fetchPosts(); // Refresh to get new comment
        } catch (error) {
            console.error('Failed to submit comment', error);
        }
    };

    const deleteComment = async (commentId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/comments/${commentId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPosts(); // Refresh
        } catch (error) {
            console.error('Failed to delete comment', error);
        }
    };

    return (
        <div className="min-h-screen bg-dark-900 flex flex-col pb-10">
            <header className="glass-panel rounded-none border-t-0 border-x-0 border-b border-dark-700/50 sticky top-0 z-50 px-6 py-4 flex items-center">
                <button onClick={() => navigate('/dashboard')} className="text-dark-300 hover:text-white transition-colors mr-4">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <span className="text-xl font-bold text-white tracking-wide">My Profile</span>
            </header>

            <main className="flex-1 max-w-4xl w-full mx-auto p-6 mt-6 relative">
                <div className="absolute top-1/4 -left-32 w-72 h-72 bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-1/4 -right-32 w-72 h-72 bg-primary-900/20 rounded-full blur-[120px] pointer-events-none" />

                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent relative z-10">Analysis History</h2>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20 text-dark-400 glass-panel">
                        No saved analysis yet. Go to Dashboard to make predictions!
                    </div>
                ) : (
                    <div className="space-y-6">
                        {posts.map(post => (
                            <div key={post.id} className="glass-panel p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1 mr-4">
                                        <p className="text-white text-lg leading-relaxed">{post.content}</p>
                                        <p className="text-xs text-dark-400 mt-2">
                                            {new Date(post.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end space-y-3">
                                        <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                            post.sentiment_prediction === 1 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                        }`}>
                                            {post.sentiment_prediction === 1 ? 'Positive' : 'Negative'}
                                        </div>
                                        <button onClick={() => deletePost(post.id)} className="text-dark-500 hover:text-red-400 transition-colors p-1">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Comments Section */}
                                <div className="mt-6 pt-6 border-t border-dark-700/50">
                                    <h4 className="text-sm font-semibold text-dark-300 flex items-center mb-4">
                                        <MessageSquare className="w-4 h-4 mr-2" /> Comments
                                    </h4>
                                    
                                    {post.comments && post.comments.length > 0 && (
                                        <div className="space-y-3 mb-4">
                                            {post.comments.map(c => (
                                                <div key={c.id} className="bg-dark-900/50 rounded-lg p-3 flex justify-between items-center group">
                                                    <div>
                                                        <p className="text-sm text-dark-200">{c.content}</p>
                                                        <span className="text-[10px] text-dark-500">{new Date(c.created_at).toLocaleString()}</span>
                                                    </div>
                                                    <button onClick={() => deleteComment(c.id)} className="text-dark-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex space-x-2">
                                        <input 
                                            type="text" 
                                            className="flex-1 bg-dark-900/50 border border-dark-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors"
                                            placeholder="Add a note or comment..."
                                            value={commentText[post.id] || ''}
                                            onChange={(e) => handleCommentChange(post.id, e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && submitComment(post.id)}
                                        />
                                        <button 
                                            onClick={() => submitComment(post.id)}
                                            className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 shadow-lg shadow-primary-500/20 text-white px-3 py-2 rounded-lg transition-all flex items-center justify-center"
                                        >
                                            <Send className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
