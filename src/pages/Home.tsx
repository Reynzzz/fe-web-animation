import React from 'react';
import HeroSection from '@/sections/HeroSection';
import WorksSection from '@/sections/WorksSection';
import PhilosophySection from '@/sections/PhilosophySection';
import GroupSection from '@/sections/GroupSection';
import AchievementSection from '@/sections/AchievementSection';
import AboutOverviewSection from '@/sections/AboutOverviewSection';
import HomeContactSection from '@/sections/HomeContactSection';
import MonopoHero from '@/sections/TeksSection';

export default function Home() {
  return (
    <main className="w-full">
      {/* <HeroSection /> */}
      <MonopoHero />
      <AboutOverviewSection />
      <WorksSection />
      {/* <PhilosophySection /> */}
      {/* <GroupSection /> */}
      {/* <AchievementSection /> */}
   
    </main>
  );
}
