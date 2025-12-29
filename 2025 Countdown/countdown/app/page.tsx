'use client';

import { useEffect, useState } from 'react';
import Countdown from '@/components/Countdown';
import Memories from '@/components/Memories';
import { generateTheme, Theme } from '@/lib/unique-ui';

import Stars from '@/components/Stars';
import Landscape from '@/components/Landscape';
import CelestialObjects from '@/components/CelestialObjects';
import AirTraffic from '@/components/AirTraffic';
import WeatherEffects from '@/components/WeatherEffects';
import DynamicSky from '@/components/DynamicSky';
import MidnightSelfie from '@/components/MidnightSelfie';
import Resolutions from '@/components/Resolutions';

export default function Home() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    // Generate unique ID for visitor
    let visitorId = localStorage.getItem('vibe_visitor_id');
    if (!visitorId) {
      visitorId = `v_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
      localStorage.setItem('vibe_visitor_id', visitorId);
    }

    const matchedTheme = generateTheme(visitorId);
    setTheme(matchedTheme);

    // Apply theme to document
    if (matchedTheme) {
      document.documentElement.style.setProperty('--primary', matchedTheme.primary);
      document.documentElement.style.setProperty('--secondary', matchedTheme.secondary);
      document.documentElement.style.setProperty('--accent', matchedTheme.accent);
    }
  }, []);

  if (!theme) return null;

  return (
    <>
      <DynamicSky />
      <Stars />
      <CelestialObjects />
      <AirTraffic />
      <WeatherEffects />
      <div className="firework"></div>
      <div className="firework"></div>
      <div className="firework"></div>
      <Landscape />

      {/* Selfie & Resolutions Only */}
      <MidnightSelfie />
      <Resolutions />

      <main className="min-vh-100">
        <div className="container">
          <div className="text-end pt-4 pe-4 opacity-25 small position-fixed top-0 end-0" style={{ right: '320px' }}>
            Profile: <span className="fw-bold">#{localStorage.getItem('vibe_visitor_id')?.split('_')[1]}</span>
          </div>

          <Countdown />

          <footer className="text-center pb-4 opacity-25 small">
            vibe-projects &copy; {new Date().getFullYear()}
          </footer>
        </div>
      </main>
    </>
  );
}
