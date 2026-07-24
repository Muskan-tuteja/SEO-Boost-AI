//  add a keyword to track

export const addKeywordToTrack = async (keyword: string, url: string, domain: string, token: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/rank/addKeyword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ keyword, url, domain })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding keyword to track:", error);
    throw error;
  }
};
// get all keywords for a user
export const getKeywords = async (token: string) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/rank/getAllKeywords`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching all keywords:", error);
        throw error;
    }
};

// Get single keyword with full history
export const getKeyword = async (keywordId: string, token: string) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/rank/getKeyword/${keywordId}`, {      
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching keyword:", error);
        throw error;
    }   
}

// Manually refresh a keyword's rank
export const refreshKeywordRank = async (keywordId: string, token: string) => {
    try {   
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/rank/refreshKeyword/${keywordId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error refreshing keyword rank:", error);
        throw error;
    }   
}

// Delete a keyword from tracking
export const deleteKeyword = async (keywordId: string, token: string) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/rank/deleteKeyword/${keywordId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error deleting keyword:", error);
        throw error;
    }   
}

// Toggle tracking active/inactive for a keyword
export const toggleKeywordTracking = async (keywordId: string, token: string) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/rank/toggleKeyword/${keywordId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error toggling keyword tracking:", error);
        throw error;
    }   
}