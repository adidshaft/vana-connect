export type ServiceType = "spotify" | "chatgpt" | "linkedin" | "instagram";

export interface RawVanaData {
  spotify?: {
    topTracks: string[];
    topGenres: string[];
  };
  chatgpt?: {
    commonPrompts: string[];
    topics: string[];
  };
  linkedin?: {
    headline: string;
    recentPosts: string[];
  };
  instagram?: {
    dominantColors: string[];
    frequentCaptions: string[];
  };
}

export interface VibeCardTraits {
  currentMood: string | null;
  mindPalace: string | null;
  currentGrind: string | null;
  aesthetic: string | null;
}

export function useVibeCardMappers() {
  const mapVibeData = (rawData: RawVanaData): VibeCardTraits => {
    // Spotify -> Current Mood
    let currentMood = null;
    if (rawData.spotify) {
      if (rawData.spotify.topGenres.includes("hyperpop")) {
        currentMood = "Hyperpop Chaos";
      } else if (rawData.spotify.topGenres.includes("ambient")) {
        currentMood = "Ethereal Focus";
      } else {
        currentMood = rawData.spotify.topGenres[0]
          ? `Vibing to ${rawData.spotify.topGenres[0]}`
          : "Unknown Vibes";
      }
    }

    // ChatGPT -> Mind Palace
    let mindPalace = null;
    if (rawData.chatgpt) {
      if (rawData.chatgpt.topics.includes("nextjs")) {
        mindPalace = "Obsessing over Next.js and existentialism";
      } else if (rawData.chatgpt.topics.includes("fitness")) {
        mindPalace = "Optimizing macro intake";
      } else {
        mindPalace = rawData.chatgpt.topics[0]
          ? `Deep diving into ${rawData.chatgpt.topics[0]}`
          : "Blank Slate";
      }
    }

    // LinkedIn -> Current Grind
    let currentGrind = null;
    if (rawData.linkedin) {
      if (
        rawData.linkedin.headline.toLowerCase().includes("founder") ||
        rawData.linkedin.headline.toLowerCase().includes("ceo")
      ) {
        currentGrind = "B2B Scaling";
      } else {
        currentGrind = rawData.linkedin.headline || "Corp Life";
      }
    }

    // Instagram -> Aesthetic
    let aesthetic = null;
    if (rawData.instagram) {
      if (rawData.instagram.dominantColors.includes("black")) {
        aesthetic = "High Contrast Noir";
      } else if (rawData.instagram.dominantColors.includes("pink")) {
        aesthetic = "Post-ironic Coquette";
      } else {
        aesthetic = rawData.instagram.dominantColors[0]
          ? `Drenched in ${rawData.instagram.dominantColors[0]}`
          : "Default Core";
      }
    }

    return {
      currentMood,
      mindPalace,
      currentGrind,
      aesthetic,
    };
  };

  return { mapVibeData };
}
