'use client';

import { useEffect, useRef, useState } from 'react';

const FRAMES = [
    { id: 'gold', name: 'Golden', color: '#fbbf24' },
    { id: 'neon', name: 'Neon', color: '#ec4899' },
    { id: 'classic', name: 'Classic', color: '#334155' },
    { id: 'fireworks', name: 'Fire', color: '#ef4444' },
    { id: 'minimal', name: 'White', color: '#f8fafc' },
];

export default function MidnightSelfie() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [selectedFrame, setSelectedFrame] = useState(FRAMES[0]);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        const permissionGranted = localStorage.getItem('camera_permission');
        if (permissionGranted === 'granted') {
            setHasPermission(true);
        }
    }, []);

    const startCamera = async () => {
        try {
            // Stop any existing stream first
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                },
                audio: false
            });

            streamRef.current = stream;
            localStorage.setItem('camera_permission', 'granted');
            setHasPermission(true);

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // Wait for video to be ready
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play().catch(console.error);
                };
            }
            setIsCameraActive(true);
        } catch (err) {
            console.error('Camera error:', err);
            alert('Could not access camera. Please check your browser permissions.');
            setHasPermission(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsCameraActive(false);
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        // Draw video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Draw frame border
        ctx.strokeStyle = selectedFrame.color;
        ctx.lineWidth = 20;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

        // Add text at bottom
        ctx.fillStyle = 'white';
        ctx.font = 'bold 32px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText('🎉 Happy New Year 2026! 🎉', canvas.width / 2, canvas.height - 40);

        // Convert to JPEG
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageData);
        stopCamera();
    };

    const downloadImage = () => {
        if (!capturedImage) return;

        const link = document.createElement('a');
        link.href = capturedImage;
        link.download = 'new-year-2026-selfie.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const retake = () => {
        setCapturedImage(null);
        startCamera();
    };

    // Show captured image
    if (capturedImage) {
        return (
            <div className="celebration-card selfie-card">
                <div className="card-header">
                    <span>🎉 Your Selfie!</span>
                </div>
                <div className="card-body">
                    <img src={capturedImage} alt="Your New Year Selfie" className="captured-preview" />
                    <div className="btn-row">
                        <button className="btn-primary" onClick={downloadImage}>📥 Download</button>
                        <button className="btn-secondary" onClick={retake}>🔄 Retake</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="celebration-card selfie-card">
            <div className="card-header">
                <span>📸 Selfie</span>
                <button className="minimize-btn" onClick={() => setIsMinimized(!isMinimized)}>
                    {isMinimized ? '+' : '−'}
                </button>
            </div>

            {!isMinimized && (
                <div className="card-body">
                    <div className="frame-pills">
                        {FRAMES.map(frame => (
                            <button
                                key={frame.id}
                                className={`frame-pill ${selectedFrame.id === frame.id ? 'active' : ''}`}
                                style={{
                                    backgroundColor: frame.color,
                                    color: frame.id === 'minimal' || frame.id === 'gold' ? '#333' : '#fff'
                                }}
                                onClick={() => setSelectedFrame(frame)}
                            >
                                {frame.name}
                            </button>
                        ))}
                    </div>

                    <div className="camera-box" style={{ borderColor: selectedFrame.color }}>
                        {isCameraActive ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                            />
                        ) : (
                            <div className="camera-off">
                                <p>📷</p>
                                <button className="btn-primary" onClick={startCamera}>
                                    Start Camera
                                </button>
                            </div>
                        )}
                    </div>

                    <canvas ref={canvasRef} style={{ display: 'none' }} />

                    {isCameraActive && (
                        <button className="btn-capture" onClick={capturePhoto}>
                            📸 Capture Now
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
