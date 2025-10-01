import { create } from 'zustand';
import { SavedRoute, RouteStore } from '@/types/route';
import { ActivitySession } from '@/types/gps';

const STORAGE_KEY = 'savedRoutes';

export const useRouteStore = create<RouteStore>((set, get) => ({
  routes: [],
  selectedRoute: null,
  isLoading: false,
  error: null,

  addRoute: (route: SavedRoute) => {
    const { routes } = get();
    const updatedRoutes = [route, ...routes];
    
    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRoutes));
      set({ routes: updatedRoutes, error: null });
    } catch (error) {
      set({ error: 'Failed to save route' });
      console.error('Error saving route:', error);
    }
  },

  removeRoute: (routeId: string) => {
    const { routes } = get();
    const updatedRoutes = routes.filter(route => route.id !== routeId);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRoutes));
      set({ 
        routes: updatedRoutes, 
        selectedRoute: get().selectedRoute?.id === routeId ? null : get().selectedRoute,
        error: null 
      });
    } catch (error) {
      set({ error: 'Failed to delete route' });
      console.error('Error deleting route:', error);
    }
  },

  selectRoute: (routeId: string | null) => {
    const { routes } = get();
    const route = routeId ? routes.find(r => r.id === routeId) || null : null;
    set({ selectedRoute: route });
  },

  loadRoutes: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      
      if (storedData) {
        const parsedRoutes = JSON.parse(storedData) as SavedRoute[];
        
        // Convert date strings back to Date objects
        const routes: SavedRoute[] = parsedRoutes.map((route) => ({
          ...route,
          startTime: new Date(route.startTime),
          endTime: new Date(route.endTime),
          createdAt: route.createdAt ? new Date(route.createdAt) : new Date(route.endTime),
          points: route.points.map((point) => ({
            ...point,
            timestamp: new Date(point.timestamp),
          })),
        }));
        
        set({ routes, isLoading: false });
      } else {
        // Try to migrate from old ActivitySession format if it exists
        const oldSessions = localStorage.getItem('savedRoutes');
        if (oldSessions) {
          const sessions = JSON.parse(oldSessions) as ActivitySession[];
          const migratedRoutes: SavedRoute[] = sessions.map((session) => ({
            id: session.id,
            name: `${session.activityType} - ${new Date(session.startTime).toLocaleDateString()}`,
            points: session.route.map((point) => ({
              ...point,
              timestamp: new Date(point.timestamp),
            })),
            totalDistance: session.totalDistance,
            duration: session.duration,
            averageSpeed: session.duration > 0 ? session.totalDistance / session.duration : 0,
            startTime: new Date(session.startTime),
            endTime: session.endTime ? new Date(session.endTime) : new Date(session.startTime),
            activityType: session.activityType,
            createdAt: session.endTime ? new Date(session.endTime) : new Date(session.startTime),
          }));
          
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedRoutes));
          set({ routes: migratedRoutes, isLoading: false });
        } else {
          set({ routes: [], isLoading: false });
        }
      }
    } catch (error) {
      set({ error: 'Failed to load routes', isLoading: false });
      console.error('Error loading routes:', error);
    }
  },

  exportRoute: async (routeId: string, format: 'gpx' | 'json') => {
    const { routes } = get();
    const route = routes.find(r => r.id === routeId);
    
    if (!route) {
      throw new Error('Route not found');
    }

    if (format === 'json') {
      return JSON.stringify(route, null, 2);
    }

    if (format === 'gpx') {
      // Generate GPX format
      const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="PAL Fitness App" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${route.name}</name>
    <time>${route.startTime.toISOString()}</time>
  </metadata>
  <trk>
    <name>${route.name}</name>
    <type>${route.activityType}</type>
    <trkseg>
${route.points.map(point => `      <trkpt lat="${point.latitude}" lon="${point.longitude}">
        ${point.altitude !== undefined ? `<ele>${point.altitude}</ele>` : ''}
        <time>${point.timestamp.toISOString()}</time>
      </trkpt>`).join('\n')}
    </trkseg>
  </trk>
</gpx>`;
      
      return gpx;
    }

    throw new Error('Unsupported export format');
  },
}));
