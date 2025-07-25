import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import airspaceImage from '@/assets/airspace-map.jpg';

export const AirspaceMap = () => {
  const activeFlights = [
    { id: 'AA123', x: 25, y: 30, status: 'normal' },
    { id: 'UA456', x: 45, y: 60, status: 'warning' },
    { id: 'DL789', x: 70, y: 40, status: 'normal' },
    { id: 'SW101', x: 60, y: 20, status: 'critical' },
    { id: 'JB234', x: 80, y: 70, status: 'normal' },
    { id: 'NK567', x: 30, y: 80, status: 'warning' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-destructive';
      case 'warning': return 'bg-warning';
      default: return 'bg-success';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Live Airspace</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              6 ACTIVE
            </Badge>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground">LIVE</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-[400px] overflow-hidden rounded-b-lg">
          <img 
            src={airspaceImage} 
            alt="Airspace radar view" 
            className="w-full h-full object-cover"
          />
          
          {/* Flight markers overlay */}
          {activeFlights.map((flight) => (
            <div
              key={flight.id}
              className="absolute group cursor-pointer"
              style={{ 
                left: `${flight.x}%`, 
                top: `${flight.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {/* Flight marker */}
              <div className={`w-3 h-3 rounded-full ${getStatusColor(flight.status)} border-2 border-background animate-pulse`}>
              </div>
              
              {/* Flight ID tooltip */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {flight.id}
              </div>
              
              {/* Direction indicator */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 pointer-events-none">
                <div className="w-full h-0.5 bg-current opacity-60 transform rotate-45"></div>
              </div>
            </div>
          ))}

          {/* Alert zones */}
          <div className="absolute top-[45%] left-[55%] w-20 h-20 border-2 border-warning rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute top-[25%] left-[75%] w-16 h-16 border-2 border-destructive rounded-full opacity-60 animate-pulse"></div>

          {/* Range rings */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 w-32 h-32 border border-muted-foreground/20 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 border border-muted-foreground/20 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>

          {/* Coordinates overlay */}
          <div className="absolute bottom-2 left-2 text-xs text-muted-foreground bg-card/80 px-2 py-1 rounded">
            Lat: 40.7128° N, Lon: 74.0060° W
          </div>
        </div>
      </CardContent>
    </Card>
  );
};