export type ServiceType = "spotify" | "chatgpt" | "linkedin" | "instagram";
export type RawVanaData = Record<string, unknown>;

export interface VibeCardTraits {
  "Current Mood": string;
  "Current Obsession": string;
  Aesthetic: string;
  "Grind Level": string;
}

export function useVibeCardMappers() {
  const mapVibeData = (data: RawVanaData): VibeCardTraits => {
    // Placeholder mappings. To be replaced with actual live data parsing logic.
    return {
      "Current Mood": data.spotify ? "Ethereal" : "No Signal",
      "Current Obsession": data.chatgpt ? "Recursive Algorithms" : "No Signal",
      Aesthetic: data.instagram ? "Brutalist Monochrome" : "No Signal",
      "Grind Level": data.linkedin ? "Terminal Velocity" : "No Signal",
    };
  };

  return { mapVibeData };
}
