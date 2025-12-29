'use client';

import { useEffect, useState } from 'react';

export default function CelestialObjects() {
    const [position, setPosition] = useState({ x: 50, y: 30 });
    const [isDay, setIsDay] = useState(true);

    useEffect(() => {
        const updatePosition = () => {
            // Get current Pune time (IST is GMT+5:30)
            const now = new Date();
            const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
            const puneTime = new Date(utc + (3600000 * 5.5));

            const hours = puneTime.getHours();
            const minutes = puneTime.getMinutes();
            const totalMinutes = hours * 60 + minutes;

            // 6 AM (360) to 6 PM (1080) is Day
            const dayStart = 360;
            const dayEnd = 1080;

            let dayProgress = 0;
            if (totalMinutes >= dayStart && totalMinutes <= dayEnd) {
                setIsDay(true);
                dayProgress = (totalMinutes - dayStart) / (dayEnd - dayStart);
            } else {
                setIsDay(false);
                // Night progress (6 PM to 6 AM)
                const nightMinutes = totalMinutes < dayStart ? totalMinutes + (1440 - dayEnd) : totalMinutes - dayEnd;
                dayProgress = nightMinutes / (1440 - (dayEnd - dayStart));
            }

            // Parabolic arc for movement
            const x = dayProgress * 100;
            const y = 80 - (Math.sin(dayProgress * Math.PI) * 60); // Arch height

            setPosition({ x, y });
        };

        updatePosition();
        const interval = setInterval(updatePosition, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className={`celestial-body ${isDay ? 'sun' : 'moon'}`}
            style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
            }}
        >
            {!isDay && <div className="crater"></div>}
        </div>
    );
}
