'use client';

import { useEffect, useState } from 'react';

type SkyState = 'night' | 'dawn' | 'morning' | 'noon' | 'afternoon' | 'dusk';

const SKY_GRADIENTS: Record<SkyState, string> = {
    night: 'linear-gradient(to bottom, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    dawn: 'linear-gradient(to bottom, #232526 0%, #414345 30%, #ff7e5f 70%, #feb47b 100%)',
    morning: 'linear-gradient(to bottom, #2980B9 0%, #6DD5FA 50%, #FFFFFF 100%)',
    noon: 'linear-gradient(to bottom, #1e90ff 0%, #87CEEB 50%, #f0f8ff 100%)',
    afternoon: 'linear-gradient(to bottom, #56CCF2 0%, #2F80ED 100%)',
    dusk: 'linear-gradient(to bottom, #141E30 0%, #243B55 30%, #ff7e5f 70%, #feb47b 100%)',
};

export default function DynamicSky() {
    const [skyState, setSkyState] = useState<SkyState>('noon');

    useEffect(() => {
        const updateSky = () => {
            // Get current Pune time (IST is GMT+5:30)
            const now = new Date();
            const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
            const puneTime = new Date(utc + (3600000 * 5.5));
            const hours = puneTime.getHours();

            let state: SkyState = 'noon';
            if (hours >= 0 && hours < 5) state = 'night';
            else if (hours >= 5 && hours < 7) state = 'dawn';
            else if (hours >= 7 && hours < 11) state = 'morning';
            else if (hours >= 11 && hours < 14) state = 'noon';
            else if (hours >= 14 && hours < 17) state = 'afternoon';
            else if (hours >= 17 && hours < 19) state = 'dusk';
            else state = 'night';

            setSkyState(state);
        };

        updateSky();
        const interval = setInterval(updateSky, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        document.body.style.background = SKY_GRADIENTS[skyState];
    }, [skyState]);

    return null;
}
