import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface FlightTableProps {
  filters: {
    airport: string;
    status: string;
    risk: string;
  };
}

export const FlightTable = ({ filters }: FlightTableProps) => {
  const flights = [
    {
      id: 'AA123',
      callsign: 'American 123',
      altitude: '35,000 ft',
      speed: '485 kts',
      status: 'enroute',
      risk: 'low',
      origin: 'JFK',
      destination: 'LAX',
      eta: '14:25'
    },
    {
      id: 'UA456',
      callsign: 'United 456',
      altitude: '28,500 ft',
      speed: '420 kts',
      status: 'landing',
      risk: 'medium',
      origin: 'ORD',
      destination: 'JFK',
      eta: '11:45'
    },
    {
      id: 'DL789',
      callsign: 'Delta 789',
      altitude: '41,000 ft',
      speed: '510 kts',
      status: 'enroute',
      risk: 'low',
      origin: 'ATL',
      destination: 'LAX',
      eta: '16:30'
    },
    {
      id: 'SW101',
      callsign: 'Southwest 101',
      altitude: '15,000 ft',
      speed: '380 kts',
      status: 'takeoff',
      risk: 'high',
      origin: 'LAX',
      destination: 'JFK',
      eta: '22:15'
    },
    {
      id: 'JB234',
      callsign: 'JetBlue 234',
      altitude: '33,000 ft',
      speed: '465 kts',
      status: 'enroute',
      risk: 'low',
      origin: 'JFK',
      destination: 'ORD',
      eta: '13:50'
    },
    {
      id: 'NK567',
      callsign: 'Spirit 567',
      altitude: '8,500 ft',
      speed: '250 kts',
      status: 'holding',
      risk: 'critical',
      origin: 'ATL',
      destination: 'JFK',
      eta: '12:30'
    }
  ];

  const filteredFlights = flights.filter(flight => {
    if (filters.airport !== 'all' && !flight.origin.toLowerCase().includes(filters.airport) && !flight.destination.toLowerCase().includes(filters.airport)) {
      return false;
    }
    if (filters.status !== 'all' && flight.status !== filters.status) {
      return false;
    }
    if (filters.risk !== 'all' && flight.risk !== filters.risk) {
      return false;
    }
    return true;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'enroute': return 'default';
      case 'landing': return 'secondary';
      case 'takeoff': return 'outline';
      case 'holding': return 'destructive';
      default: return 'default';
    }
  };

  const getRiskVariant = (risk: string) => {
    switch (risk) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      case 'critical': return 'destructive';
      default: return 'default';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-success';
      case 'medium': return 'text-warning';
      case 'high': return 'text-destructive';
      case 'critical': return 'text-destructive font-bold';
      default: return 'text-foreground';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Active Flights</CardTitle>
          <Badge variant="outline" className="text-xs">
            {filteredFlights.length} FLIGHTS
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[320px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Flight ID</TableHead>
                <TableHead>Callsign</TableHead>
                <TableHead>Altitude</TableHead>
                <TableHead>Speed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>ETA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFlights.map((flight) => (
                <TableRow key={flight.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono font-medium">{flight.id}</TableCell>
                  <TableCell className="text-sm">{flight.callsign}</TableCell>
                  <TableCell className="font-mono text-sm">{flight.altitude}</TableCell>
                  <TableCell className="font-mono text-sm">{flight.speed}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(flight.status)} className="text-xs">
                      {flight.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs font-medium ${getRiskColor(flight.risk)}`}>
                      {flight.risk.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {flight.origin} → {flight.destination}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{flight.eta}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};