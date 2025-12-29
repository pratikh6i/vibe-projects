'use client';

import { useEffect, useState } from 'react';

interface Memory {
    url: string;
    type: 'image' | 'video';
}

export default function Memories() {
    const [memories, setMemories] = useState<Memory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/memories')
            .then(res => res.json())
            .then(data => {
                setMemories(data.files || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center opacity-50 my-5">Loading memories...</div>;

    if (memories.length === 0) {
        return (
            <div className="memories-empty">
                <h3>No memories yet!</h3>
                <p>Drop your photos and videos into <code>countdown/public/memories/</code></p>
            </div>
        );
    }

    return (
        <div className="memories-section">
            <h2 className="memories-title">Good Memories</h2>
            <div className="memories-grid">
                {memories.map((memory, index) => (
                    <div key={index} className="memory-item">
                        {memory.type === 'video' ? (
                            <video
                                src={memory.url}
                                controls
                                className="memory-media"
                            />
                        ) : (
                            <img
                                src={memory.url}
                                alt={`Memory ${index + 1}`}
                                className="memory-media"
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
