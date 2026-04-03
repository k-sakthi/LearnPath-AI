/**
 * Normalizes a resource URL for opening in a new tab.
 * - For YouTube URLs: extracts the video ID and constructs a clean watch URL.
 * - For non-YouTube URLs: returns them as-is.
 * - Returns null if the URL is invalid.
 */
export const getCleanResourceUrl = (url: string): string | null => {
  if (!url || typeof url !== "string") return null;

  try {
    // Try to extract a YouTube video ID
    const videoId = extractYouTubeVideoId(url);
    if (videoId) {
      return `https://www.youtube.com/watch?v=${videoId}`;
    }

    // Non-YouTube URL — validate it's a proper URL
    new URL(url);
    return url;
  } catch {
    return null;
  }
};

/**
 * Extracts a YouTube video ID from various YouTube URL formats.
 * Returns null if the URL is not a YouTube URL.
 */
export const extractYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;

  const patterns = [
    // Standard watch URLs: youtube.com/watch?v=ID
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    // Short URLs: youtu.be/ID
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    // Embed URLs: youtube.com/embed/ID
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    // Playlist with video: youtube.com/watch?v=ID&list=...
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})(?:&|$)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

/**
 * Opens a resource URL in a new tab, with proper error handling.
 */
export const openResource = (url: string): void => {
  const cleanUrl = getCleanResourceUrl(url);
  if (cleanUrl) {
    window.open(cleanUrl, "_blank", "noopener,noreferrer");
  } else {
    // Fallback: just try to open the raw URL
    window.open(url, "_blank", "noopener,noreferrer");
  }
};
