'use client';

import { useEffect, useState } from 'react';

const MAX_RESOLUTIONS = 5;

export default function Resolutions() {
    const [resolutions, setResolutions] = useState<string[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newResolution, setNewResolution] = useState('');
    const [hasDecided, setHasDecided] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('resolutions_2026');
        const decided = localStorage.getItem('resolutions_decided');
        if (stored) setResolutions(JSON.parse(stored));
        if (decided) setHasDecided(true);
    }, []);

    const saveResolutions = (newList: string[]) => {
        setResolutions(newList);
        localStorage.setItem('resolutions_2026', JSON.stringify(newList));
    };

    const addResolution = () => {
        if (newResolution.trim() && resolutions.length < MAX_RESOLUTIONS) {
            saveResolutions([...resolutions, newResolution.trim()]);
            setNewResolution('');
        }
    };

    const removeResolution = (index: number) => {
        saveResolutions(resolutions.filter((_, i) => i !== index));
    };

    const skipResolutions = () => {
        localStorage.setItem('resolutions_decided', 'true');
        setHasDecided(true);
    };

    const finishAdding = () => {
        localStorage.setItem('resolutions_decided', 'true');
        setHasDecided(true);
        setShowModal(false);
    };

    // Initial prompt
    if (!hasDecided && resolutions.length === 0) {
        return (
            <div className="celebration-card resolution-card">
                <div className="card-header">
                    <span>✨ Resolutions</span>
                </div>
                <div className="card-body">
                    <p>Add your 2026 resolutions?</p>
                    <button className="btn-primary" onClick={() => { setShowModal(true); setHasDecided(true); }}>
                        Yes, Add
                    </button>
                    <button className="btn-secondary" onClick={skipResolutions}>
                        Skip
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Sticky notes floating */}
            {resolutions.length > 0 && (
                <div className="sticky-notes">
                    {resolutions.map((res, i) => (
                        <div key={i} className="sticky-note" style={{ transform: `rotate(${(i % 2 ? 3 : -3)}deg)` }}>
                            <strong>#{i + 1}</strong> {res}
                        </div>
                    ))}
                </div>
            )}

            {/* Add button */}
            {hasDecided && resolutions.length < MAX_RESOLUTIONS && (
                <button className="fab-add" onClick={() => setShowModal(true)}>
                    + Resolution
                </button>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <h3>My 2026 Resolutions</h3>
                        <div className="resolution-list">
                            {resolutions.map((res, i) => (
                                <div key={i} className="res-item">
                                    <span>{i + 1}. {res}</span>
                                    <button onClick={() => removeResolution(i)}>×</button>
                                </div>
                            ))}
                        </div>
                        {resolutions.length < MAX_RESOLUTIONS && (
                            <div className="res-input-row">
                                <input
                                    type="text"
                                    placeholder="Enter resolution..."
                                    value={newResolution}
                                    onChange={e => setNewResolution(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && addResolution()}
                                />
                                <button onClick={addResolution}>Add</button>
                            </div>
                        )}
                        <p className="res-count">{resolutions.length}/{MAX_RESOLUTIONS}</p>
                        <button className="btn-primary" onClick={finishAdding}>Done</button>
                    </div>
                </div>
            )}
        </>
    );
}
