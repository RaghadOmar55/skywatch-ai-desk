import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const MetricsPanel = () => {
  const trafficData = [
    { time: '10:00', density: 45, alerts: 2, responseTime: 12 },
    { time: '10:15', density: 52, alerts: 4, responseTime: 15 },
    { time: '10:30', density: 48, alerts: 1, responseTime: 8 },
    { time: '10:45', density: 61, alerts: 6, responseTime: 18 },
    { time: '11:00', density: 58, alerts: 3, responseTime: 11 },
    { time: '11:15', density: 65, alerts: 8, responseTime: 22 },
    { time: '11:30', density: 59, alerts: 2, responseTime: 9 },
  ];

  const currentMetrics = {
    totalFlights: 127,
    activeAlerts: 12,
    avgResponseTime: 14.2,
    systemStatus: 'operational'
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">System Metrics</CardTitle>
          <Badge variant="outline" className="text-xs">
            REAL-TIME
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/30 rounded p-3">
            <div className="text-xs text-muted-foreground">Total Flights</div>
            <div className="text-2xl font-bold text-primary">{currentMetrics.totalFlights}</div>
          </div>
          <div className="bg-muted/30 rounded p-3">
            <div className="text-xs text-muted-foreground">Active Alerts</div>
            <div className="text-2xl font-bold text-destructive">{currentMetrics.activeAlerts}</div>
          </div>
          <div className="bg-muted/30 rounded p-3">
            <div className="text-xs text-muted-foreground">Avg Response</div>
            <div className="text-2xl font-bold text-accent">{currentMetrics.avgResponseTime}s</div>
          </div>
          <div className="bg-muted/30 rounded p-3">
            <div className="text-xs text-muted-foreground">System Status</div>
            <Badge variant="default" className="text-xs mt-1">
              {currentMetrics.systemStatus.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Traffic Density Chart */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Traffic Density</h4>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="densityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #333',
                    borderRadius: '6px',
                    color: '#fff'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="density"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#densityGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alert Count Chart */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Alert Count</h4>
          <div className="h-20">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData}>
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #333',
                    borderRadius: '6px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="alerts" fill="hsl(var(--destructive))" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Response Time Chart */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Response Time (seconds)</h4>
          <div className="h-20">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData}>
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: '1px solid #333',
                    borderRadius: '6px',
                    color: '#fff'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="responseTime"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};