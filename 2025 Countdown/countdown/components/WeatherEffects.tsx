'use client';

import { useEffect, useState } from 'react';

export default function WeatherEffects() {
    const [windSpeed, setWindSpeed] = useState(5); // Default 5 km/h

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=18.5204&longitude=73.8567&current=wind_speed_10m');
                const data = await res.json();
                if (data.current) {
                    setWindSpeed(data.current.wind_speed_10m);
                }
            } catch (err) {
                console.error('Weather fetch error:', err);
            }
        };

        fetchWeather();
        const interval = setInterval(fetchWeather, 300000); // Update every 5 mins
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Apply wind speed to global CSS variable for animations
        const normalizedWind = Math.min(Math.max(windSpeed / 5, 0.5), 5); // Normalize to 0.5s - 5s range for speed
        document.documentElement.style.setProperty('--wind-speed', `${normalizedWind}s`);
    }, [windSpeed]);

    return null; // Side-effect component
}
