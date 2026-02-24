"use client";

import React, { useState, useEffect } from "react";
import {
  useVibeCardMappers,
  RawVanaData,
  ServiceType,
  VibeCardTraits,
} from "./useVibeCardMappers";
import { useVanaData } from "@opendatalabs/connect/react";

const services: { id: ServiceType; label: string }[] = [
  { id: "spotify", label: "SPOTIFY" },
  { id: "chatgpt", label: "CHATGPT" },
  { id: "linkedin", label: "LINKEDIN" },
  { id: "instagram", label: "INSTAGRAM" },
];

function ServiceButton({
  service,
  onDataFetched,
}: {
  service: { id: ServiceType; label: string };
  onDataFetched: (id: ServiceType, data: Record<string, unknown>) => void;
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

  // If already linked/approved
  if (isConnected || status === "approved") {
    return (
      <button
        disabled
        className="w-full py-4 border border-pureblack rounded-none bg-pureblack text-offwhite uppercase font-bold"
      >
        {service.label} LINKED
      </button>
    );
  }

  // If session is ready, we need the user to click to open the auth window
  if (connectUrl && status === "waiting") {
    return (
      <a
        href={connectUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full py-4 border border-pureblack rounded-none text-pureblack bg-transparent hover:bg-black/5 text-center uppercase font-bold"
      >
        AUTHORIZE {service.label}
      </a>
    );
  }

  // Initial connect button (or connecting state)
  return (
    <button
      onClick={() => {
        void initConnect();
      }}
      disabled={isLoading || status === "connecting"}
      className="w-full py-4 border border-pureblack rounded-none transition-colors uppercase font-bold text-pureblack bg-transparent hover:bg-black/5 disabled:opacity-50"
    >
      {isLoading || status === "connecting"
        ? "CONNECTING..."
        : `CONNECT ${service.label}`}
    </button>
  );
}

export default function VibeCardPage() {
  const [aggregatedData, setAggregatedData] = useState<RawVanaData>({});
  const [vibeCard, setVibeCard] = useState<VibeCardTraits | null>(null);
  const { mapVibeData } = useVibeCardMappers();

  const handleDataFetched = (
    serviceId: ServiceType,
    data: Record<string, unknown>,
  ) => {
    console.log(`[Vana live payload for ${serviceId}]:`, data);
    setAggregatedData((prev) => ({
      ...prev,
      [serviceId]: data[serviceId] || data, // data comes from the specific scope config
    }));
  };

  const handleGenerate = () => {
    setVibeCard(mapVibeData(aggregatedData));
  };

  const linkedCount = Object.keys(aggregatedData).length;

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
            {services.map((service) => (
              <ServiceButton
                key={service.id}
                service={service}
                onDataFetched={handleDataFetched}
              />
            ))}
          </div>
        </section>

        {/* Action Section */}
        <section className="p-6 border-t border-pureblack flex justify-center">
          {linkedCount >= 2 ? (
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
