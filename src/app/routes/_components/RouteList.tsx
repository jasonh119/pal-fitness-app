'use client';

import { SavedRoute } from '@/types/route';
import RouteCard from './RouteCard';

interface RouteListProps {
  routes: SavedRoute[];
}

export default function RouteList({ routes }: RouteListProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {routes.map((route) => (
          <RouteCard key={route.id} route={route} />
        ))}
      </div>
    </div>
  );
}
