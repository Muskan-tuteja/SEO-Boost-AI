import axios from "axios";

export async function rankTracker(keyword, targetDomain) {
  try {
    const cleanTarget = targetDomain
      .replace(/^https?:\/\//, "")
      .replace("www.", "")
      .replace(/\/$/, "")
      .toLowerCase();

    const response = await axios.get(
      "https://serpapi.com/search.json",
      {
        params: {
          engine: "google",
          q: keyword,
          num: 100,
          hl: "en",
          gl: "us",
          api_key: process.env.SERPAPI_KEY,
        },
      }
    );

    const organic = response.data.organic_results || [];

    let found = null;
    const competitors = [];
    const allResults = [];

    organic.forEach((item, index) => {
      let domain = "";

      try {
        domain = new URL(item.link)
          .hostname.replace("www.", "")
          .toLowerCase();
      } catch {
        return;
      }

      const result = {
        position: index + 1,
        url: item.link,
        domain,
        title: item.title || "",
        snippet: item.snippet || "",
      };

      allResults.push(result);

      if (
        !found &&
        (domain.includes(cleanTarget) ||
          cleanTarget.includes(domain))
      ) {
        found = {
          ...result,
          page: Math.ceil((index + 1) / 10),
        };
      } else {
        competitors.push(result);
      }
    });
        return {
      success: true,
      data: {
        keyword,
        targetDomain,
        position: found?.position || null,
        page: found?.page || null,
        title: found?.title || "",
        snippet: found?.snippet || "",
        competitors: competitors.slice(0, 10),
        totalResultsScanned: allResults.length,
      },
    };
  } catch (error) {
    console.error(
      "SerpAPI Rank Tracker Error:",
      error.response?.data || error.message
    );

    return {
      success: false,
      error:
        error.response?.data?.error ||
        error.message ||
        "Rank tracking failed",
    };
  }
}