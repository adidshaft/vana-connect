"use client";

import React, { useState, useEffect } from "react";
import {
  useVibeCardMappers,
  RawVanaData,
  ServiceType,
  VibeCardTraits,
} from "./useVibeCardMappers";
import { useVanaData } from "@opendatalabs/connect/react";

const services: {
  id: ServiceType;
  label: string;
  author: string;
  desc: string;
}[] = [
  {
    id: "spotify",
    label: "Sonic Landscape Analysis",
    author: "Spotify Protocol",
    desc: "Analyzes recent listening history, genre overlap, and tempo preferences to determine your foundational sonic frequency and emotional polarity.",
  },
  {
    id: "chatgpt",
    label: "Neural Construct Diagnostics",
    author: "OpenAI Interface",
    desc: "Processes interaction logs and prompt structures to map your cognitive architecture, curiosity vectors, and generalized mind palace.",
  },
  {
    id: "linkedin",
    label: "Professional Graph Optimization",
    author: "LinkedIn Protocol",
    desc: "Evaluates network topology, endorsement density, and career velocity to synthesize your current operational grind and corporate synergy.",
  },
  {
    id: "instagram",
    label: "Visual Aesthetic Indexing",
    author: "Meta Scraper",
    desc: "Ingests photographic metadata, color palettes, and engagement ratios to compute a definitive visual aesthetic and curation index.",
  },
];

function formatDate(date: Date) {
  const mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(date);
  const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
  const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  return `${mo}.${da}.${ye}`;
}

function ServiceItem({
  service,
  onDataFetched,
  dateString,
}: {
  service: { id: ServiceType; label: string; author: string; desc: string };
  onDataFetched: (id: ServiceType, data: Record<string, unknown>) => void;
  dateString: string;
}) {
  const { status, data, connectUrl, initConnect, isLoading, isConnected } =
    useVanaData({
      connectUrl: `/api/connect?service=${service.id}`,
      autoFetch: true,
    });

  useEffect(() => {
    if (data) {
      onDataFetched(service.id, (data as Record<string, unknown>) || {});
    }
  }, [data, service.id, onDataFetched]);

  // Connected State
  if (isConnected || status === "approved") {
    return (
      <div className="flex gap-6 py-8 border-b border-border group">
        <div className="hidden sm:block w-48 h-32 bg-gray-50 border border-border flex-shrink-0 relative overflow-hidden flex flex-col justify-end p-4 grayscale bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiMwMDAiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')]">
          <div className="absolute top-0 right-0 w-8 h-8 bg-paradigm-green text-white flex items-center justify-center font-mono text-xs">
            ✓
          </div>
          <div className="text-xl font-serif text-muted font-bold opacity-30">
            {service.id.toUpperCase()}
          </div>
        </div>
        <div className="flex flex-col flex-grow">
          <h3 className="text-2xl font-serif tracking-tight text-foreground mb-2 group-hover:text-muted transition-colors">
            {service.label}
          </h3>
          <p className="text-sm text-foreground/80 mb-4 max-w-2xl font-serif leading-relaxed">
            Data payload successfully retrieved and securely stored locally.
            Identity nodes aligned for synthesis.
          </p>
          <div className="flex gap-4 items-center text-xs font-mono font-bold text-muted uppercase tracking-wider mt-auto">
            <span>{dateString}</span>
            <span className="text-border">|</span>
            <span>By {service.author}</span>
            <span className="ml-auto text-paradigm-green bg-green-50 px-2 py-1">
              Linked
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Waiting to authorize (link generated)
  if (connectUrl && status === "waiting") {
    return (
      <div
        className="flex gap-6 py-8 border-b border-border group cursor-pointer"
        onClick={() => window.open(connectUrl, "_blank")}
      >
        <div className="hidden sm:block w-48 h-32 bg-gray-50 border border-border flex-shrink-0 flex items-center justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiMwMDAiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')]"></div>
        <div className="flex flex-col flex-grow">
          <h3 className="text-2xl font-serif tracking-tight text-foreground mb-2 group-hover:text-muted transition-colors">
            {service.label}
          </h3>
          <p className="text-sm text-foreground/80 mb-4 max-w-2xl font-serif leading-relaxed">
            Connection requested. Please authorize the secure gateway to grant
            access to your data nodes.
          </p>
          <div className="flex gap-4 items-center text-xs font-mono font-bold text-muted uppercase tracking-wider mt-auto">
            <span>{dateString}</span>
            <span className="text-border">|</span>
            <span>By {service.author}</span>
            <button className="ml-auto hover:text-paradigm-green transition-colors text-foreground group-hover:underline">
              Proceed to Gateway →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default state / Loading
  return (
    <div
      className={`flex gap-6 py-8 border-b border-border group ${isLoading || status === "connecting" ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
      onClick={() => {
        if (!isLoading && status !== "connecting") void initConnect();
      }}
    >
      <div className="hidden sm:block w-48 h-32 bg-white border border-border flex-shrink-0 flex items-center justify-center transition-colors group-hover:bg-gray-50 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiMwMDAiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')]"></div>
      <div className="flex flex-col flex-grow">
        <h3 className="text-2xl font-serif tracking-tight text-foreground mb-2 group-hover:text-muted transition-colors delay-75">
          {service.label}
        </h3>
        <p className="text-sm text-foreground/80 mb-4 max-w-2xl font-serif leading-relaxed">
          {service.desc}
        </p>
        <div className="flex gap-4 items-center text-xs font-mono font-bold text-muted uppercase tracking-wider mt-auto">
          <span>{dateString}</span>
          <span className="text-border">|</span>
          <span>By {service.author}</span>
          <span className="ml-auto font-mono text-foreground hover:text-paradigm-green transition-colors font-bold group-hover:underline">
            {isLoading || status === "connecting"
              ? "Connecting..."
              : "Initialize"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function VibeCardPage() {
  const [aggregatedData, setAggregatedData] = useState<RawVanaData>({});
  const [vibeCard, setVibeCard] = useState<VibeCardTraits | null>(null);
  const { mapVibeData } = useVibeCardMappers();

  const currentDate = formatDate(new Date());

  const handleDataFetched = (
    serviceId: ServiceType,
    data: Record<string, unknown>,
  ) => {
    console.log(`[Vana live payload for ${serviceId}]:`, data);
    setAggregatedData((prev) => ({
      ...prev,
      [serviceId]: data[serviceId] || data,
    }));
  };

  const handleGenerate = () => {
    setVibeCard(mapVibeData(aggregatedData));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const linkedCount = Object.keys(aggregatedData).length;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      {/* Top Header Navigation */}
      <header className="w-full max-w-[1200px] px-6 py-8 flex flex-col md:flex-row md:items-center justify-between border-b border-border">
        <div className="flex items-center gap-3 mb-6 md:mb-0">
          <div className="w-8 h-8 relative">
            <div className="absolute inset-0 border-2 border-foreground rotate-45 transform transition-transform hover:rotate-90 duration-500"></div>
            <div className="absolute inset-2 bg-paradigm-green"></div>
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight">
            Vibe Protocol
          </span>
        </div>

        <nav className="flex gap-6 sm:gap-8 font-mono text-xs font-bold uppercase tracking-wider text-muted">
          <span className="cursor-pointer hover:text-foreground">
            Manifesto
          </span>
          <span className="cursor-pointer hover:text-foreground">
            Architecture
          </span>
          <span className="cursor-pointer hover:text-foreground">Network</span>
          <span className="text-paradigm-green">Synthesis</span>
          <span className="cursor-pointer hover:text-foreground">SDK</span>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-[1200px] px-6 py-12 flex flex-col lg:flex-row gap-16 lg:gap-24 relative">
        {/* Left Sidebar (Sticky) */}
        <aside className="w-full lg:w-48 flex-shrink-0 font-mono text-xs font-bold uppercase tracking-wider space-y-4 text-muted hidden lg:block sticky top-12 self-start">
          <div className="mb-8 text-foreground pb-2 border-b border-border">
            DATA SOURCES
          </div>
          <div className="hover:text-foreground cursor-pointer transition-colors text-paradigm-green">
            Active Oracles
          </div>
          <div className="hover:text-foreground cursor-pointer transition-colors">
            Archived Vaults
          </div>
          <div className="hover:text-foreground cursor-pointer transition-colors">
            Permissions
          </div>
          <div className="hover:text-foreground cursor-pointer transition-colors">
            Export Logs
          </div>
        </aside>

        {/* Right Content */}
        <div className="flex-grow w-full max-w-3xl">
          <div className="mb-16 font-serif">
            <h1 className="text-5xl font-normal tracking-tight mb-6 leading-tight">
              Cryptographic Identity Synthesis via Multi-Oracle Ingestion
            </h1>
            <p className="text-lg text-foreground/80 leading-relaxed max-w-2xl">
              Connect disparate Web2 data silos to generate a sovereign, unified
              digital personality receipt. The Vibe Protocol computes emotional
              polarity, cognitive structure, and visual aesthetics from raw
              authorized payloads.
            </p>
          </div>

          {/* Identity Receipt Top Block (If Generated) */}
          {vibeCard && (
            <div className="mb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider mb-6 pb-2 border-b border-border text-foreground">
                GENERATED IDENTIFIER (VIBE CARD)
              </h2>

              <div className="border border-border p-8 sm:p-12 mb-8 bg-gray-50 font-serif">
                <h1 className="text-4xl sm:text-5xl font-normal tracking-tight mb-8 font-serif leading-tight">
                  Definitive Resonance Profile
                </h1>
                <p className="text-sm font-mono text-muted uppercase tracking-wider border-b border-border pb-8 mb-8">
                  {currentDate} <span className="text-border mx-2">|</span> ID:{" "}
                  {Math.random().toString(36).substring(2, 10).toUpperCase()}
                </p>

                <div className="space-y-6">
                  {Object.entries(vibeCard).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex flex-col sm:flex-row sm:items-baseline border-b border-border border-dashed pb-3"
                    >
                      <span className="font-mono text-xs font-bold uppercase tracking-widest text-muted w-48 mb-1 sm:mb-0">
                        {key.replace(/([A-Z])/g, "-$1").trim()}
                      </span>
                      <span className="font-sans text-xl text-foreground font-medium flex-grow">
                        {value || "Insufficient Data Correlation"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section Heading */}
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider mb-2 pb-2 border-b border-border text-foreground">
            {vibeCard ? "AVAILABLE CONNECTIONS" : "ORACLE ENDPOINTS"}
          </h2>

          {/* List of Services */}
          <div className="flex flex-col mb-12">
            {services.map((service) => (
              <ServiceItem
                key={service.id}
                service={service}
                onDataFetched={handleDataFetched}
                dateString={currentDate}
              />
            ))}
          </div>

          {/* Generate Button Area Styled like "All Writing" Search Box */}
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider mb-6 mt-16 text-foreground border-t border-border pt-12">
            RECEIPT GENERATION
          </h2>

          <div className="flex w-full mb-24">
            {linkedCount >= 2 ? (
              <button
                onClick={handleGenerate}
                className="w-full text-center py-5 px-6 border border-paradigm-green bg-paradigm-green text-white font-sans font-medium text-lg tracking-wide hover:bg-paradigm-green/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-paradigm-green rounded-sm"
              >
                Synthesize Vibe Card
              </button>
            ) : (
              <div className="w-full text-center py-5 px-6 border border-border bg-gray-50 text-muted font-sans font-medium text-lg tracking-wide opacity-60 rounded-sm">
                Awaiting minimum protocol synchronization (2 Data Sources)
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
