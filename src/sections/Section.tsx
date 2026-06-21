import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect } from 'react';
import RefractionCursor from './RefractionCursor';



export default function BackgroundHeroSection() {
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const support = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      setIsWebGLSupported(support);
    } catch (e) {
      setIsWebGLSupported(false);
    }
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white font-sans">
      


      {/* LAYER DOM (UI) */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-8">
        
        {/* HEADER */}
        <header className="flex justify-between items-start text-xs tracking-widest uppercase pointer-events-auto">
          <div className="font-bold">monopo <span className="text-gray-400 font-normal">london</span></div>
          <nav className="flex space-x-16">
            <ul className="space-y-1">
              <li>&gt; Home</li>
              <li>Work</li>
              <li>Services</li>
            </ul>
            <ul className="space-y-1">
              <li>Team</li>
              <li>Contact</li>
              <li>Press & News</li>
            </ul>
          </nav>
          <div className="text-right">
            <p>&gt; 04:18 PM</p>
            <p>12:18 AM</p>
            <p>11:18 AM</p>
          </div>
        </header>

        {/* MAIN TYPOGRAPHY */}
        <main className="flex justify-center items-center flex-1">
          <h1 className="text-7xl md:text-8xl font-medium text-center leading-tight tracking-tight mix-blend-difference pointer-events-auto select-none">
            We are a brand <br />
            of collective <br />
            creativity
          </h1>
        </main>

        {/* FOOTER */}
        <footer className="flex justify-between items-end text-xs pointer-events-auto">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-full border border-white flex items-center justify-center">O</span>
          </div>
          <div>
            <p className="font-bold">Based in London</p>
            <p className="text-gray-400">Born in Tokyo</p>
          </div>
          <div>
            <p className="font-bold">Design-driven</p>
            <p className="text-gray-400">creative agency</p>
          </div>
          <div className="text-right">
            <p className="font-bold">Branding, digital</p>
            <p className="text-gray-400">and communications</p>
          </div>
        </footer>
      </div>
      
    </div>
  );
}