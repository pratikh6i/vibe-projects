'use client';

import { useEffect, useState } from 'react';

interface Participant {
    id: string;
    name: string;
}

export default function GroupPhoto() {
    const [roomId, setRoomId] = useState<string | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [userName, setUserName] = useState('');
    const [isJoined, setIsJoined] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const room = urlParams.get('room');
        if (room) {
            setRoomId(room);
            setShowJoinModal(true);
        }

        const storedRoom = localStorage.getItem('group_room_id');
        const storedName = localStorage.getItem('group_user_name');
        if (storedRoom && storedName) {
            setRoomId(storedRoom);
            setUserName(storedName);
            setIsJoined(true);
            loadParticipants(storedRoom);
        }
    }, []);

    const generateRoomId = () => 'room-' + Math.random().toString(36).substr(2, 8);

    const createRoom = () => {
        const newRoomId = generateRoomId();
        setRoomId(newRoomId);
        localStorage.setItem('group_room_id', newRoomId);
        setShowJoinModal(true);
    };

    const joinRoom = () => {
        if (!roomId || !userName.trim()) return;
        const participant: Participant = {
            id: Math.random().toString(36).substr(2, 9),
            name: userName.trim(),
        };
        const roomKey = `group_${roomId}`;
        const existing = JSON.parse(localStorage.getItem(roomKey) || '[]');
        existing.push(participant);
        localStorage.setItem(roomKey, JSON.stringify(existing));
        localStorage.setItem('group_room_id', roomId);
        localStorage.setItem('group_user_name', userName);
        localStorage.setItem('group_user_id', participant.id);
        setIsJoined(true);
        setShowJoinModal(false);
        loadParticipants(roomId);
    };

    const loadParticipants = (room: string) => {
        const roomKey = `group_${room}`;
        setParticipants(JSON.parse(localStorage.getItem(roomKey) || '[]'));
    };

    const copyLink = () => {
        const link = `${window.location.origin}${window.location.pathname}?room=${roomId}`;
        navigator.clipboard.writeText(link);
        alert('Link copied!');
    };

    const leaveRoom = () => {
        localStorage.removeItem('group_room_id');
        localStorage.removeItem('group_user_name');
        localStorage.removeItem('group_user_id');
        setRoomId(null);
        setIsJoined(false);
        setParticipants([]);
    };

    // Not in room
    if (!roomId && !showJoinModal) {
        return (
            <div className="celebration-card group-card">
                <div className="card-header">
                    <span>👥 Group Photo</span>
                    <button className="minimize-btn" onClick={() => setIsMinimized(!isMinimized)}>
                        {isMinimized ? '+' : '−'}
                    </button>
                </div>
                {!isMinimized && (
                    <div className="card-body">
                        <p>Create a room for group selfie!</p>
                        <button className="btn-primary" onClick={createRoom}>Create Room</button>
                    </div>
                )}
            </div>
        );
    }

    // Join modal
    if (showJoinModal && !isJoined) {
        return (
            <div className="modal-overlay" onClick={() => { setShowJoinModal(false); setRoomId(null); }}>
                <div className="modal-box" onClick={e => e.stopPropagation()}>
                    <h3>Join Group: {roomId}</h3>
                    <input
                        type="text"
                        placeholder="Your name"
                        value={userName}
                        onChange={e => setUserName(e.target.value)}
                    />
                    <button className="btn-primary" onClick={joinRoom}>Join</button>
                    <button className="btn-secondary" onClick={() => { setShowJoinModal(false); setRoomId(null); }}>Cancel</button>
                </div>
            </div>
        );
    }

    // In room
    return (
        <div className="celebration-card group-card">
            <div className="card-header">
                <span>👥 {roomId}</span>
                <button className="minimize-btn" onClick={() => setIsMinimized(!isMinimized)}>
                    {isMinimized ? '+' : '−'}
                </button>
            </div>
            {!isMinimized && (
                <div className="card-body">
                    <div className="participants">
                        {participants.map(p => (
                            <span key={p.id} className="participant-chip">{p.name}</span>
                        ))}
                        {participants.length === 0 && <p>Waiting for friends...</p>}
                    </div>
                    <div className="btn-row">
                        <button className="btn-primary" onClick={copyLink}>📋 Copy Link</button>
                        <button className="btn-danger" onClick={leaveRoom}>Leave</button>
                    </div>
                </div>
            )}
        </div>
    );
}
