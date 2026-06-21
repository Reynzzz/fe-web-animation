"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { useSiteContent } from "@/context/SiteContentContext";
import { resolveMediaUrl } from "@/lib/api";

export default function ExpandOnHoverLamp() {
  return (
    <LampContainer>
      <OurTeamGrid />
    </LampContainer>
  );
}

function OurTeamGrid() {
  const { items } = useSiteContent();

  const members = (items.member || [])
    .map((member: any) => ({
      ...member,
      name: member.title || member.name,
      position: member.body || member.position || member.role || member.job,
      imageUrl: resolveMediaUrl(member.image),
    }))
    .filter((member: any) => Boolean(member.imageUrl));

  if (members.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative z-20 w-full max-w-6xl px-4"
    >
      {/* HEADER */}
      <div className="mb-10 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-xs font-medium uppercase tracking-[0.35em] text-white/40"
        >
          Our Team
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-2 text-3xl font-semibold leading-tight text-white md:text-5xl"
        >
          Awesome team
          <br />
          members
        </motion.h2>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((member: any, idx: number) => (
          <TeamMemberCard key={member.id || `member-${idx}`} member={member} idx={idx} />
        ))}
      </div>
    </motion.div>
  );
}

function TeamMemberCard({ member, idx }: { member: any; idx: number }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 35, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.65,
        delay: idx * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative overflow-hidden rounded-[1.4rem] bg-[#111111] shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-900">
        {/* Skeleton Loader / Placeholder yang akan hilang saat gambar selesai dimuat */}
        {!isLoaded && (
          <div className="absolute inset-0 animate-pulse bg-neutral-800/80" />
        )}

        <img
          src={member.imageUrl}
          alt={member.name || `Team member ${idx + 1}`}
          loading="lazy"
          decoding="async"
          draggable={false}
          onLoad={() => setIsLoaded(true)}
          className={cn(
            "h-full w-full select-none object-cover grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Overlay gelap seperti referensi */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

        {/* Glow hover tipis */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute -bottom-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        </div>

        {/* Text */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-base font-semibold leading-tight text-white md:text-lg">
            {member.name || `Member ${idx + 1}`}
          </h3>

          <p className="mt-1 text-xs font-medium text-white/50">
            {member.position ||
              member.role ||
              member.job ||
              "Team Member"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <section
      className={cn(
        "relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-[#0b0b0b]",
        className
      )}
    >
      {/* BACKGROUND EFFECT */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-white/[0.04] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.8))]" />
      </div>

      {/* CONTENT */}
      <div className="relative z-20 flex w-full flex-1 flex-col items-center justify-center px-5 py-24 md:py-32">
        {children}
      </div>
    </section>
  );
};