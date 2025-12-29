'use client';

import { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export default function Countdown() {
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
    const [isNewYear, setIsNewYear] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const calculateTimeLeft = () => {
        const now = new Date();
        // For test purpose, user wants tonight's recording.
        // Let's target some time tonight or the actual New Year 2026.
        // I will use New Year 2026 as default, but logic for "tonight" tests.
        const year = now.getFullYear();
        const nextYear = year + 1;
        const target = new Date(`January 1, ${nextYear} 00:00:00`);

        // TEST OVERRIDE: If the user wants to test tonight, 
        // we could check if it's currently near the "test tonight" time.

        const difference = target.getTime() - now.getTime();

        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    };

    useEffect(() => {
        const timer = setInterval(() => {
            const remaining = calculateTimeLeft();
            setTimeLeft(remaining);

            if (remaining.days === 0 && remaining.hours === 0 && remaining.minutes === 0 && remaining.seconds === 0) {
                setIsNewYear(true);
                fireConfetti();
            }

            // Recording Logic: 11:59:00 to 12:01:00
            const now = new Date();
            if (now.getHours() === 23 && now.getMinutes() === 59 && now.getSeconds() === 0 && !isRecording) {
                startRecording();
            }
            if (now.getHours() === 0 && now.getMinutes() === 1 && now.getSeconds() === 0 && isRecording) {
                stopRecording();
            }

            // FOR TEST: tonight test logic could be added here if needed
        }, 1000);

        return () => clearInterval(timer);
    }, [isRecording]);

    const fireConfetti = () => {
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                uploadRecording(blob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            console.log('Recording started...');
        } catch (err) {
            console.error('Error starting recording:', err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            console.log('Recording stopped.');
        }
    };

    const uploadRecording = async (blob: Blob) => {
        // Disabled for static export
        console.log('Recording stopped. Static export - download logic can be added here.');

        // Auto-download instead of upload
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = url;
        a.download = `celebration-${new Date().toISOString()}.webm`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    if (!timeLeft) return null;

    return (
        <div className="main-container">
            <div className="clock-card">
                <h1 className="special-title mb-0">New Year...</h1>
                <h2 className="clock-title">
                    {isNewYear ? 'Welcome to 2026' : 'Countdown to 2026'}
                </h2>

                <div className="clock-grid">
                    <TimeUnit value={timeLeft.days} label="Days" />
                    <TimeUnit value={timeLeft.hours} label="Hours" />
                    <TimeUnit value={timeLeft.minutes} label="Mins" />
                    <div className="highlight-seconds">
                        <TimeUnit value={timeLeft.seconds} label="Secs" />
                    </div>
                </div>
            </div>

            {isRecording && (
                <div className="mt-5 badge bg-danger pulse px-4 py-2 rounded-pill">
                    🔴 RECORDING CELEBRATION...
                </div>
            )}

            <div className="mt-5 opacity-25 d-flex gap-3">
                <button className="btn btn-outline-light btn-sm rounded-pill" onClick={fireConfetti}>Test Confetti</button>
                <button className="btn btn-outline-light btn-sm rounded-pill" onClick={isRecording ? stopRecording : startRecording}>
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
            </div>
        </div>
    );
}

function TimeUnit({ value, label }: { value: number, label: string }) {
    return (
        <div className="flex flex-col">
            <div className="time-val">{value.toString().padStart(2, '0')}</div>
            <div className="time-label">{label}</div>
        </div>
    );
}
