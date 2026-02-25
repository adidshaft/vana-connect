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
  { id: "github", label: "GITHUB" },
];

function ServiceButton({
  service,
  onDataFetched,
}: {
  service: { id: ServiceType; label: string };
  onDataFetched: (id: ServiceType, data: Record<string, unknown>) => void;
}) {
  const { error, status, data, connectUrl, initConnect, isLoading, isConnected } =
    useVanaData({
      connectUrl: `/api/connect?service=${service.id}`,
      dataUrl: `/api/data`,
      autoFetch: true,
    });

  useEffect(() => {
    if (data) {
      onDataFetched(service.id, (data as Record<string, unknown>) || {});
    }
  }, [data, service.id, onDataFetched]);

  const baseClasses =
    "flex flex-col border-pureblack border-b sm:border-b-0 sm:border-r last:border-0 p-6 justify-between min-h-[200px] text-left relative";

  if (isConnected || status === "approved") {
    return (
      <div className={`${baseClasses} bg-pureblack text-offwhite`}>
        <div className="text-sm tracking-widest uppercase">
          STATUS: CONNECTED
        </div>
        <div>
          <h2 className="text-3xl sm:text-4xl uppercase mb-2 font-mono">
            {service.label}
          </h2>
          <div className="text-sm border-offwhite border px-3 py-1 inline-block uppercase font-bold">
            {error ? "ERROR" : "LINKED [X]"}
          </div>
          {error && (
            <div className="text-xs text-red-500 mt-2 font-bold font-mono">
              [FETCH_ERR]: {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (connectUrl && status === "waiting") {
    return (
      <a
        href={connectUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} bg-offwhite text-pureblack hover:bg-pureblack hover:text-offwhite cursor-pointer`}
      >
        <div className="text-sm tracking-widest uppercase text-red-600 font-bold mb-2">
          ACTION REQUIRED
        </div>
        <div>
          <h2 className="text-3xl sm:text-4xl uppercase mb-2 font-mono">
            {service.label}
          </h2>
          <div className="text-sm border-current border px-3 py-1 inline-block uppercase font-bold">
            AUTHORIZE {">"}
          </div>
          <div className="text-xs text-pureblack/50 mt-2 font-mono">(Check Vana Dev UI)</div>
        </div>
      </a>
    );
  }

  return (
    <button
      onClick={() => void initConnect()}
      disabled={isLoading || status === "connecting"}
      className={`${baseClasses} bg-offwhite text-pureblack hover:bg-pureblack hover:text-offwhite cursor-pointer disabled:opacity-50`}
    >
      <div className="text-sm tracking-widest uppercase opacity-50">DISCONNECTED</div>
      <div>
        <h2 className="text-3xl sm:text-4xl uppercase mb-2 font-mono">
          {service.label}
        </h2>
        <div className="text-sm border-current border px-3 py-1 inline-block uppercase font-bold">
          {isLoading || status === "connecting"
            ? "INITIALIZING..."
            : "CONNECT [+]"}
        </div>
        {error && (
          <div className="text-xs text-red-500 mt-2 font-bold font-mono text-left">
            [INIT_ERR]: {error}
          </div>
        )}
      </div>
    </button>
  );
}

export default function VibeCardPage() {
  const [aggregatedData, setAggregatedData] = useState<RawVanaData>({});
  const [vibeCard, setVibeCard] = useState<VibeCardTraits | null>(null);
  const { mapVibeData } = useVibeCardMappers();

  const handleDataFetched = React.useCallback((
    serviceId: ServiceType,
    data: Record<string, unknown>,
  ) => {
    console.log(`[Vana live payload for ${serviceId}]:`, data);
    setAggregatedData((prev) => {
      if (prev[serviceId]) return prev;
      return {
        ...prev,
        [serviceId]: data.data ? (data.data as Record<string, unknown>)[`${serviceId}.profile`] || data.data : data,
      };
    });
  }, []);

  const handleGenerate = () => {
    setVibeCard(mapVibeData(aggregatedData));
  };

  const linkedCount = Object.keys(aggregatedData).length;

  return (
    <div className="min-h-screen bg-offwhite text-pureblack font-mono flex flex-col items-center p-4 sm:p-8">
      {/* Container wrapper for border grid */}
      <div className="w-full max-w-6xl border-pureblack border-2 flex flex-col bg-offwhite">
        {/* Header */}
        <header className="border-pureblack border-b-2 p-6 sm:p-12">
          <h1 className="text-5xl sm:text-7xl lg:text-9xl tracking-tighter uppercase mb-6 leading-none font-black font-mono">
            THE ULTIMATE
            <br />
            VIBE CARD
          </h1>
          <p className="text-lg sm:text-2xl uppercase border-pureblack border-l-4 pl-4 font-bold max-w-2xl bg-offwhite pb-2 pt-1 border-t-0 border-r-0 border-b-0">
            CURRENT ERA DIGITAL SNAPSHOT INGESTION.
          </p>
        </header>

        {/* System Status Banner */}
        <div className="border-pureblack border-b-2 bg-pureblack text-offwhite p-4 uppercase text-sm font-bold tracking-widest flex justify-between">
          <span>SYSTEM // ONLINE</span>
          <span>{linkedCount} / 5 ORACLES LINKED</span>
        </div>

        {/* Grid of Connections */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border-pureblack border-b-2">
          {services.map((service) => (
            <ServiceButton
              key={service.id}
              service={service}
              onDataFetched={handleDataFetched}
            />
          ))}
        </section>

        {/* Generate Button Action */}
        <section className="p-8 sm:p-16 flex justify-center items-center border-pureblack border-b-2 bg-offwhite">
          {linkedCount >= 2 ? (
            <button
              onClick={handleGenerate}
              className="text-3xl sm:text-5xl border-pureblack border-4 px-12 py-6 uppercase font-black hover:bg-pureblack hover:text-offwhite cursor-pointer bg-offwhite text-pureblack transition-none"
            >
              GENERATE RECEIPT
            </button>
          ) : (
            <div className="text-2xl sm:text-4xl uppercase font-bold opacity-30 cursor-not-allowed">
              AWAITING CONNECTIONS...
            </div>
          )}
        </section>

        {/* Output Area (The Digital Trading Card / Receipt) */}
        {vibeCard && (
          <section className="p-8 sm:p-16 flex justify-center bg-offwhite">
            <div className="w-full max-w-3xl border-pureblack border-4 p-8 sm:p-12 bg-offwhite relative">
              <div className="absolute top-4 right-6 text-xs font-bold opacity-50 uppercase tracking-widest">
                ID: {Math.random().toString(36).substring(2, 12).toUpperCase()}
              </div>

              <div className="border-pureblack border-b-4 pb-6 mb-8 flex flex-col justify-end">
                <h2 className="text-5xl sm:text-7xl tracking-tighter uppercase mb-2 font-black">
                  RECEIPT
                </h2>
                <span className="text-sm font-bold uppercase tracking-widest border-pureblack border inline-block px-2 py-1 max-w-max">
                  TIMESTAMP: {new Date().toISOString().split("T")[0]} // SECURED
                </span>
              </div>

              <div className="flex flex-col space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-end border-pureblack border-b-2 border-dashed pb-2">
                  <span className="text-sm uppercase tracking-widest font-bold mb-1 sm:mb-0">
                    CURRENT MOOD:
                  </span>
                  <span className="text-2xl sm:text-4xl uppercase font-black text-right sm:text-left">
                    {vibeCard["Current Mood"]}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-end border-pureblack border-b-2 border-dashed pb-2">
                  <span className="text-sm uppercase tracking-widest font-bold mb-1 sm:mb-0">
                    CURRENT OBSESSION:
                  </span>
                  <span className="text-2xl sm:text-4xl uppercase font-black text-right sm:text-left">
                    {vibeCard["Current Obsession"]}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-end border-pureblack border-b-2 border-dashed pb-2">
                  <span className="text-sm uppercase tracking-widest font-bold mb-1 sm:mb-0">
                    AESTHETIC:
                  </span>
                  <span className="text-2xl sm:text-4xl uppercase font-black text-right sm:text-left">
                    {vibeCard["Aesthetic"]}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-end border-pureblack border-b-2 border-dashed pb-2">
                  <span className="text-sm uppercase tracking-widest font-bold mb-1 sm:mb-0">
                    GRIND LEVEL:
                  </span>
                  <span className="text-2xl sm:text-4xl uppercase font-black text-right sm:text-left">
                    {vibeCard["Grind Level"]}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-end border-pureblack border-b-2 border-dashed pb-2">
                  <span className="text-sm uppercase tracking-widest font-bold mb-1 sm:mb-0">
                    CODE VIBE:
                  </span>
                  <span className="text-2xl sm:text-4xl uppercase font-black text-right sm:text-left">
                    {vibeCard["Code Vibe"]}
                  </span>
                </div>
              </div>

              <div className="mt-12 pt-4 border-pureblack border-t-4 text-center text-xs uppercase tracking-widest font-bold flex justify-between">
                <span>END OF RECEIPT //</span>
                <span>VANA CONNECT V1</span>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
