"use client";

import React, { useState } from "react";
import {
  useVibeCardMappers,
  RawVanaData,
  ServiceType,
  VibeCardTraits,
} from "./useVibeCardMappers";

const MOCK_DATA: RawVanaData = {
  spotify: {
    topTracks: ["Vroom Vroom", "Track 2"],
    topGenres: ["hyperpop", "electronic"],
  },
  chatgpt: {
    commonPrompts: ["How to use App Router", "Why am I here"],
    topics: ["nextjs", "existentialism"],
  },
  linkedin: {
    headline: "Founder & CEO @ Stealth Startup",
    recentPosts: ["Excited to announce...", "Hiring 10x engineers"],
  },
  instagram: {
    dominantColors: ["black", "white"],
    frequentCaptions: ["vibe check", "mood"],
  },
};

export default function VibeCardPage() {
  const [linkedServices, setLinkedServices] = useState<ServiceType[]>([]);
  const [vibeCard, setVibeCard] = useState<VibeCardTraits | null>(null);
  const { mapVibeData } = useVibeCardMappers();

  const handleConnect = (service: ServiceType) => {
    setLinkedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service],
    );
  };

  const handleGenerate = () => {
    // Only pass data for linked services
    const dataToMap: RawVanaData = {};
    if (linkedServices.includes("spotify"))
      dataToMap.spotify = MOCK_DATA.spotify;
    if (linkedServices.includes("chatgpt"))
      dataToMap.chatgpt = MOCK_DATA.chatgpt;
    if (linkedServices.includes("linkedin"))
      dataToMap.linkedin = MOCK_DATA.linkedin;
    if (linkedServices.includes("instagram"))
      dataToMap.instagram = MOCK_DATA.instagram;

    setVibeCard(mapVibeData(dataToMap));
  };

  const services: { id: ServiceType; label: string }[] = [
    { id: "spotify", label: "SPOTIFY" },
    { id: "chatgpt", label: "CHATGPT" },
    { id: "linkedin", label: "LINKEDIN" },
    { id: "instagram", label: "INSTAGRAM" },
  ];

  return (
    <div className="min-h-screen bg-offwhite text-pureblack font-mono p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl border border-pureblack rounded-none">
        {/* Header */}
        <header className="border-b border-pureblack p-6">
          <h1 className="text-3xl font-bold uppercase tracking-tighter">
            The Ultimate Vibe Card
          </h1>
          <p className="mt-2 text-sm uppercase">
            Paradigm.xyz Architectural Alignment
          </p>
        </header>

        {/* Connect State Section */}
        <section className="p-6 grid gap-4">
          <h2 className="text-xl font-bold border-b border-pureblack pb-2 mb-2 uppercase">
            Connect State
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((service) => {
              const isLinked = linkedServices.includes(service.id);
              return (
                <button
                  key={service.id}
                  onClick={() => handleConnect(service.id)}
                  className={`
                    w-full py-4 border border-pureblack rounded-none transition-colors uppercase font-bold
                    ${isLinked ? "bg-pureblack text-offwhite" : "bg-transparent text-pureblack hover:bg-black/5"}
                  `}
                >
                  {isLinked
                    ? `${service.label} LINKED`
                    : `CONNECT ${service.label}`}
                </button>
              );
            })}
          </div>
        </section>

        {/* Action Section */}
        <section className="p-6 border-t border-pureblack flex justify-center">
          {linkedServices.length >= 2 ? (
            <button
              onClick={handleGenerate}
              className="w-full py-4 bg-pureblack text-offwhite border border-pureblack uppercase font-bold hover:bg-black/90 transition-colors"
            >
              GENERATE CARD
            </button>
          ) : (
            <div className="w-full py-4 border border-pureblack uppercase text-center text-black/50 font-bold bg-transparent cursor-not-allowed">
              LINK {">="} 2 ORACLES
            </div>
          )}
        </section>

        {/* Final Output / Receipt Component */}
        {vibeCard && (
          <section className="p-6 border-t border-pureblack grid gap-6 bg-transparent">
            <h2 className="text-xl font-bold border-b border-pureblack pb-2 mb-2 uppercase">
              Identity Receipt
            </h2>

            <div className="grid grid-cols-1 gap-0 border border-pureblack">
              {Object.entries(vibeCard).map(([key, value], index, array) => (
                <div
                  key={key}
                  className={`p-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center ${index !== array.length - 1 ? "border-b border-pureblack" : ""}`}
                >
                  <span className="text-sm uppercase opacity-70 w-1/3 mb-1 sm:mb-0">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span className="text-lg font-bold sm:text-right w-full sm:w-2/3 uppercase tracking-tight">
                    {value || "NO SIGNAL"}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-xs uppercase text-center opacity-50 mt-4">
              {new Date().toISOString()} // TX:{" "}
              {Math.random().toString(36).substring(7).toUpperCase()} // VANA
              CONNECT
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
