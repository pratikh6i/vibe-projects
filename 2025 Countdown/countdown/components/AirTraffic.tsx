'use client';

import { useEffect, useState } from 'react';

interface Flight {
    icao24: string;
    callsign: string;
    origin: string;
    longitude: number;
    latitude: number;
    altitude: number;
    velocity: number;
    heading: number;
    x: number; // Screen position
    y: number;
}

export default function AirTraffic() {
    const [flights, setFlights] = useState<Flight[]>([]);

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                // Bounding box around Pune region (lat: 18.0-19.5, lon: 73.0-74.5)
                const res = await fetch(
                    'https://opensky-network.org/api/states/all?lamin=18.0&lomin=73.0&lamax=19.5&lomax=74.5'
                );
                const data = await res.json();

                if (data.states && data.states.length > 0) {
                    const parsedFlights: Flight[] = data.states.slice(0, 8).map((state: any[]) => ({
                        icao24: state[0] || 'Unknown',
                        callsign: (state[1] || 'Unknown').trim(),
                        origin: state[2] || 'Unknown',
                        longitude: state[5] || 0,
                        latitude: state[6] || 0,
                        altitude: Math.round((state[7] || 0) * 3.28084),
                        velocity: Math.round((state[9] || 0) * 3.6),
                        heading: state[10] || 0,
                        x: Math.random() * 80 + 10,
                        y: Math.random() * 30 + 5,
                    }));
                    setFlights(parsedFlights);
                }
            } catch (err) {
                console.error('Flight data fetch error:', err);
                setFlights([
                    { icao24: 'SIM001', callsign: 'AI101', origin: 'India', longitude: 0, latitude: 0, altitude: 35000, velocity: 850, heading: 45, x: 20, y: 15 },
                    { icao24: 'SIM002', callsign: '6E202', origin: 'India', longitude: 0, latitude: 0, altitude: 28000, velocity: 780, heading: 120, x: 60, y: 25 },
                ]);
            }
        };

        fetchFlights();
        const interval = setInterval(fetchFlights, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="air-traffic">
            {flights.map((flight, i) => (
                <div
                    key={flight.icao24 + i}
                    className="airplane-container"
                    style={{
                        top: `${flight.y}%`,
                        animationDelay: `${i * 8}s`,
                        animationDuration: `${30 + i * 5}s`,
                    }}
                    title={`${flight.callsign} | From: ${flight.origin} | Alt: ${flight.altitude.toLocaleString()} ft | Speed: ${flight.velocity} km/h`}
                >
                    <div className="contrail"></div>
                    <svg className="airplane-icon" viewBox="0 0 24 24" style={{ transform: `rotate(${flight.heading - 90}deg)` }}>
                        <path fill="currentColor" d="M21,16V14L13,9V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V9L2,14V16L10,13.5V19L8,20.5V22L11.5,21L15,22V20.5L13,19V13.5L21,16Z" />
                    </svg>
                    <div className="flight-info">
                        <strong>{flight.callsign}</strong><br />
                        From: {flight.origin}<br />
                        Alt: {flight.altitude.toLocaleString()} ft<br />
                        Speed: {flight.velocity} km/h
                    </div>
                </div>
            ))}
        </div>
    );
}
