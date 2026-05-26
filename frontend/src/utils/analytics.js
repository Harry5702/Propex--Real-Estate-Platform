// Analytics utility functions for tracking user interactions
class AnalyticsTracker {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.visitorId = this.getVisitorId();
    this.deviceInfo = this.getDeviceInfo();
    this.locationInfo = null;
    this.initializeLocationTracking();
  }

  // Generate unique session ID
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Get or create visitor ID (stored in localStorage for returning visitors)
  getVisitorId() {
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('visitor_id', visitorId);
    }
    return visitorId;
  }

  // Get device and browser information
  getDeviceInfo() {
    const userAgent = navigator.userAgent;
    let deviceType = 'desktop';
    let browser = 'unknown';
    let os = 'unknown';

    // Detect device type
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      deviceType = 'tablet';
    } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      deviceType = 'mobile';
    }

    // Detect browser
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    else if (userAgent.includes('Opera')) browser = 'Opera';

    // Detect OS
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';

    // Use guarded access to window.screen to satisfy ESLint no-restricted-globals
    const screenResolution =
      typeof window !== 'undefined' && window.screen
        ? `${window.screen.width}x${window.screen.height}`
        : 'unknown';

    return {
      deviceType,
      browser,
      operatingSystem: os,
      screenResolution,
      userAgent: userAgent.substring(0, 200) // Truncate for storage
    };
  }

  // Initialize location tracking (using a free IP geolocation service)
  async initializeLocationTracking() {
    try {
      // In production, you might want to use a more reliable service
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        this.locationInfo = {
          country: data.country_name || 'Unknown',
          city: data.city || 'Unknown',
          region: data.region || 'Unknown',
          ip: data.ip || 'Unknown'
        };
      }
    } catch (error) {
      console.log('Location tracking unavailable:', error);
      this.locationInfo = {
        country: 'Unknown',
        city: 'Unknown',
        region: 'Unknown',
        ip: 'Unknown'
      };
    }
  }

  // Track property view
  async trackPropertyView(propertyId, propertyTitle) {
    const viewData = {
      propertyId,
      propertyTitle,
      sessionId: this.sessionId,
      visitorId: this.visitorId,
      timestamp: new Date().toISOString(),
      pageUrl: window.location.href,
      referrer: document.referrer || 'direct',
      deviceInfo: this.deviceInfo,
      locationInfo: this.locationInfo || {}
    };

    // Store in localStorage for demo purposes
    // In production, send to your analytics API
    this.storeAnalyticsData('property_views', viewData);

    // Also track in session storage for real-time analytics
    this.updateSessionAnalytics(viewData);

    console.log('Property view tracked:', viewData);
    return viewData;
  }

  // Track page visit
  async trackPageVisit(pageTitle, pageUrl) {
    const visitData = {
      pageTitle: pageTitle || document.title,
      pageUrl: pageUrl || window.location.href,
      sessionId: this.sessionId,
      visitorId: this.visitorId,
      timestamp: new Date().toISOString(),
      referrer: document.referrer || 'direct',
      deviceInfo: this.deviceInfo,
      locationInfo: this.locationInfo || {},
      visitDuration: 0, // Will be updated when user leaves
      isNewVisitor: !localStorage.getItem('returning_visitor')
    };

    // Mark as returning visitor
    localStorage.setItem('returning_visitor', 'true');

    this.storeAnalyticsData('page_visits', visitData);
    this.currentPageVisit = visitData;

    console.log('Page visit tracked:', visitData);
    return visitData;
  }

  // Track user interaction (clicks, form submissions, etc.)
  trackInteraction(action, element, additionalData = {}) {
    const interactionData = {
      action,
      element,
      sessionId: this.sessionId,
      visitorId: this.visitorId,
      timestamp: new Date().toISOString(),
      pageUrl: window.location.href,
      additionalData,
      deviceInfo: this.deviceInfo
    };

    this.storeAnalyticsData('interactions', interactionData);
    console.log('Interaction tracked:', interactionData);
    return interactionData;
  }

  // Store analytics data (localStorage for demo, API in production)
  storeAnalyticsData(type, data) {
    try {
      const key = `analytics_${type}`;
      let existingData = JSON.parse(localStorage.getItem(key) || '[]');
      
      // Keep only last 100 entries to prevent localStorage overflow
      if (existingData.length >= 100) {
        existingData = existingData.slice(-50);
      }
      
      existingData.push(data);
      localStorage.setItem(key, JSON.stringify(existingData));
    } catch (error) {
      console.warn('Failed to store analytics data:', error);
    }
  }

  // Update session analytics for real-time dashboard
  updateSessionAnalytics(data) {
    try {
      const sessionKey = 'current_session_analytics';
      let sessionData = JSON.parse(sessionStorage.getItem(sessionKey) || '{}');
      
      sessionData.sessionId = this.sessionId;
      sessionData.startTime = sessionData.startTime || new Date().toISOString();
      sessionData.lastActivity = new Date().toISOString();
      sessionData.pageViews = (sessionData.pageViews || 0) + 1;
      sessionData.deviceInfo = this.deviceInfo;
      sessionData.locationInfo = this.locationInfo;
      
      if (data.propertyId) {
        sessionData.propertiesViewed = sessionData.propertiesViewed || [];
        if (!sessionData.propertiesViewed.includes(data.propertyId)) {
          sessionData.propertiesViewed.push(data.propertyId);
        }
      }
      
      sessionStorage.setItem(sessionKey, JSON.stringify(sessionData));
    } catch (error) {
      console.warn('Failed to update session analytics:', error);
    }
  }

  // Basic analytics data retrieval
  getBasicStats() {
    try {
      const propertyViews = JSON.parse(localStorage.getItem('analytics_property_views') || '[]');
      const pageVisits = JSON.parse(localStorage.getItem('analytics_page_visits') || '[]');

      return {
        totalPropertyViews: propertyViews.length,
        totalPageVisits: pageVisits.length,
        uniqueVisitors: new Set(pageVisits.map(v => v.visitorId)).size
      };
    } catch (error) {
      console.warn('Failed to get basic stats:', error);
      return {
        totalPropertyViews: 0,
        totalPageVisits: 0,
        uniqueVisitors: 0
      };
    }
  }

  // Track visit duration when user leaves
  trackVisitDuration() {
    if (this.currentPageVisit) {
      const duration = Date.now() - new Date(this.currentPageVisit.timestamp).getTime();
      this.currentPageVisit.visitDuration = Math.round(duration / 1000); // in seconds
      
      // Update the stored data
      this.storeAnalyticsData('page_visits', this.currentPageVisit);
    }
  }

  // Clean up old analytics data (call periodically)
  cleanupOldData(daysToKeep = 30) {
    const cutoffTime = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000);
    
    ['property_views', 'page_visits', 'interactions'].forEach(type => {
      try {
        const key = `analytics_${type}`;
        let data = JSON.parse(localStorage.getItem(key) || '[]');
        data = data.filter(item => new Date(item.timestamp).getTime() > cutoffTime);
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.warn(`Failed to cleanup ${type} data:`, error);
      }
    });
  }
}

// Create singleton instance
const analyticsTracker = new AnalyticsTracker();

// Track visit duration on page unload
window.addEventListener('beforeunload', () => {
  analyticsTracker.trackVisitDuration();
});

// Clean up old data on app start (once per day)
const lastCleanup = localStorage.getItem('last_analytics_cleanup');
if (!lastCleanup || Date.now() - parseInt(lastCleanup) > 24 * 60 * 60 * 1000) {
  analyticsTracker.cleanupOldData();
  localStorage.setItem('last_analytics_cleanup', Date.now().toString());
}

export default analyticsTracker;