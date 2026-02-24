export type ServiceType =
  | "spotify"
  | "chatgpt"
  | "linkedin"
  | "instagram"
  | "github";
export type RawVanaData = Record<string, unknown>;

export interface VibeCardTraits {
  "Current Mood": string;
  "Current Obsession": string;
  Aesthetic: string;
  "Grind Level": string;
  "Code Vibe": string;
}

export function useVibeCardMappers() {
  const mapVibeData = (data: RawVanaData): VibeCardTraits => {
    // Dynamic LinkedIn Grind Mapping
    let linkedinGrind = "No Signal";
    if (data.linkedin) {
      const raw = JSON.stringify(data.linkedin).toLowerCase();
      if (raw.includes("build") || raw.includes("founder")) {
        linkedinGrind = "RELENTLESS ARCHITECT";
      } else if (raw.includes("engineer") || raw.includes("developer")) {
        linkedinGrind = "PROTOCOL ENGINE";
      } else if (raw.includes("data")) {
        linkedinGrind = "DATA MAXIMALIST";
      } else {
        linkedinGrind = "TERMINAL VELOCITY";
      }
    }

    // Dynamic GitHub Code Vibe
    let githubVibe = "No Signal";
    if (data.github) {
      const raw = JSON.stringify(data.github).toLowerCase();
      if (
        raw.includes("vana") ||
        raw.includes("crypto") ||
        raw.includes("web3")
      ) {
        githubVibe = "ON-CHAIN DEGEN";
      } else if (
        raw.includes("rust") ||
        raw.includes("go") ||
        raw.includes("c++")
      ) {
        githubVibe = "BARE METAL GOD";
      } else if (raw.includes("react") || raw.includes("next")) {
        githubVibe = "FRONTEND SCHOLAR";
      } else {
        githubVibe = "OPEN SOURCE COMMITTER";
      }
    }

    return {
      "Current Mood": data.spotify ? "ETHEREAL" : "WAITING...",
      "Current Obsession": data.chatgpt ? "RECURSIVE ALGORITHMS" : "WAITING...",
      Aesthetic: data.instagram ? "BRUTALIST MONOCHROME" : "WAITING...",
      "Grind Level": linkedinGrind,
      "Code Vibe": githubVibe,
    };
  };

  return { mapVibeData };
}
