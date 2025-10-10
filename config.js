// config.js - Centralized configuration
// Update this file with your backend URL

const AppConfig = {
    // Backend API URL
    API_BASE_URL: 'http://localhost:3000', // Change this to your production URL
    
    // Cache settings
    CACHE_DURATION: 30 * 60 * 1000, // 30 minutes
    
    // Fallback configuration (used when API is unavailable)
    FALLBACK: {
        eventDate: 'November 19, 2025 00:00:00',
        registrationLink: 'https://lu.ma/aet2w219',
        cosmocaptainLink: 'https://lu.ma/aet2w219',
        communityPartnerLink: 'https://lu.ma/0yjtzbkr'
    },
    
    // Feature flags
    ENABLE_OFFLINE_MODE: true,
    ENABLE_DEBUG_LOGS: false,
    
    // API endpoints
    ENDPOINTS: {
        ALL_DATA: '/api/all-data',
        EVENT_DATE: '/api/event-date',
        REGISTRATION: '/api/registration-link',
        COSMOCAPTAIN: '/api/cosmocaptain-link',
        COMMUNITY_PARTNER: '/api/community-partner-link',
        TIMELINE: '/api/timeline',
        SPONSORS: '/api/sponsors',
        COMMUNITY_PARTNERS: '/api/community-partners',
        COSMOCAPTAINS: '/api/cosmocaptains',
        ORGANIZERS: '/api/organizers',
        TRACKS: '/api/tracks',
        PRIZES: '/api/prizes'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppConfig;
}