export async function fetchYouTubePlaylist(playlistId) {
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch playlist data');
      }
      const data = await response.json();
      return data.items.map((item) => ({
        title: item.snippet.title,
        videoUrl: `https://www.youtube.com/embed/${item.snippet.resourceId.videoId}`,
      }));
    } catch (error) {
      console.error('Error fetching YouTube playlist:', error);
      return [];
    }
  }