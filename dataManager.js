// dataManager.js - Centralized data fetching and caching system

const DataManager = (function() {
    // Get API URL from config or use default
    const API_BASE_URL = typeof AppConfig !== 'undefined' ? AppConfig.API_BASE_URL : 'http://localhost:3000';
    const CACHE_KEY = 'cosmohack_data';
    const SESSION_KEY = 'cosmohack_session_id';
    const CACHE_DURATION = typeof AppConfig !== 'undefined' ? AppConfig.CACHE_DURATION : 30 * 60 * 1000;

    // Generate unique session ID
    function generateSessionId() {
        return Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Get or create session ID
    function getSessionId() {
        let sessionId = sessionStorage.getItem(SESSION_KEY);
        if (!sessionId) {
            sessionId = generateSessionId();
            sessionStorage.setItem(SESSION_KEY, sessionId);
        }
        return sessionId;
    }

    // Check if data is still valid
    function isDataValid(cachedData) {
        if (!cachedData || !cachedData.timestamp || !cachedData.sessionId) {
            return false;
        }

        const currentSessionId = getSessionId();
        const isExpired = Date.now() - cachedData.timestamp > CACHE_DURATION;
        const isSameSession = cachedData.sessionId === currentSessionId;

        return isSameSession && !isExpired;
    }

    // Get cached data from localStorage
    function getCachedData() {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (!cached) return null;

            const data = JSON.parse(cached);
            return isDataValid(data) ? data : null;
        } catch (error) {
            console.error('Error reading cached data:', error);
            return null;
        }
    }

    // Save data to localStorage
    function setCachedData(data) {
        try {
            const cacheObject = {
                data: data,
                timestamp: Date.now(),
                sessionId: getSessionId()
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObject));
            return true;
        } catch (error) {
            console.error('Error saving cached data:', error);
            return false;
        }
    }

    // Fetch fresh data from API
    async function fetchFreshData() {
        try {
            console.log('Fetching fresh data from API...');
            const response = await fetch(`${API_BASE_URL}/api/all-data`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Fresh data fetched successfully');
            return data;
        } catch (error) {
            console.error('Error fetching data from API:', error);
            throw error;
        }
    }

    // Main function to get data (either cached or fresh)
    async function getData(forceRefresh = false) {
        // Check online status
        if (!navigator.onLine) {
            console.log('Offline - attempting to use cached data');
            const cached = getCachedData();
            if (cached) {
                return cached.data;
            }
            throw new Error('No internet connection and no cached data available');
        }

        // If force refresh, fetch fresh data
        if (forceRefresh) {
            const freshData = await fetchFreshData();
            setCachedData(freshData);
            return freshData;
        }

        // Try to get cached data first
        const cachedData = getCachedData();
        if (cachedData) {
            console.log('Using cached data');
            return cachedData.data;
        }

        // If no valid cache, fetch fresh data
        console.log('No valid cache found, fetching fresh data');
        const freshData = await fetchFreshData();
        setCachedData(freshData);
        return freshData;
    }

    // Clear cache (useful for testing or force refresh)
    function clearCache() {
        localStorage.removeItem(CACHE_KEY);
        sessionStorage.removeItem(SESSION_KEY);
        console.log('Cache cleared');
    }

    // Get specific data sections
    function getConfig(data) {
        return data?.config || {};
    }

    function getTimeline(data) {
        return data?.timeline || [];
    }

    function getSponsors(data) {
        return data?.sponsors || [];
    }

    function getCommunityPartners(data) {
        return data?.communityPartners || [];
    }

    function getCosmocaptains(data) {
        return data?.cosmocaptains || [];
    }

    function getOrganizers(data) {
        return data?.organizers || [];
    }

    function getTracks(data) {
        return data?.tracks || [];
    }

    function getPrizes(data) {
        return data?.prizes || [];
    }

    // Initialize data loading with loading indicator
    async function initializeData(options = {}) {
        const {
            onLoading = null,
            onSuccess = null,
            onError = null,
            forceRefresh = false
        } = options;

        try {
            if (onLoading) onLoading();

            const data = await getData(forceRefresh);

            if (onSuccess) onSuccess(data);
            return data;
        } catch (error) {
            console.error('Failed to initialize data:', error);
            if (onError) onError(error);
            throw error;
        }
    }

    // Listen for online/offline events
    window.addEventListener('online', () => {
        console.log('Connection restored');
    });

    window.addEventListener('offline', () => {
        console.log('Connection lost - will use cached data');
    });

    // Clear session on page unload (browser close)
    window.addEventListener('beforeunload', () => {
        // Optional: Keep session alive for tab close/refresh
        // Uncomment the line below to clear session on browser close
        // sessionStorage.removeItem(SESSION_KEY);
    });

    // Public API
    return {
        initializeData,
        getData,
        clearCache,
        getConfig,
        getTimeline,
        getSponsors,
        getCommunityPartners,
        getCosmocaptains,
        getOrganizers,
        getTracks,
        getPrizes
    };
})();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}