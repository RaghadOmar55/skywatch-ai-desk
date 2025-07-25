import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X, Clock, MapPin } from 'lucide-react';

export const AlertsPanel = () => {
  const alerts = [
    {
      id: 1,
      type: 'collision',
      severity: 'critical',
      title: 'Collision Risk',
      description: 'AA123 and UA456 convergence detected',
      time: '2 min ago',
      location: 'Sector 7',
      action: 'Vector AA123 heading 270°'
    },
    {
      id: 2,
      type: 'route',
      severity: 'warning',
      title: 'Route Conflict',
      description: 'SW101 deviation from assigned route',
      time: '5 min ago',
      location: 'Sector 3',
      action: 'Contact pilot for confirmation'
    },
    {
      id: 3,
      type: 'weather',
      severity: 'warning',
      title: 'Weather Alert',
      description: 'Turbulence reported in approach zone',
      time: '7 min ago',
      location: 'JFK Approach',
      action: 'Advise all inbound traffic'
    },
    {
      id: 4,
      type: 'separation',
      severity: 'medium',
      title: 'Separation Minimum',
      description: 'DL789 and JB234 below standard separation',
      time: '12 min ago',
      location: 'Sector 12',
      action: 'Maintain visual separation'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-destructive';
      case 'warning': return 'text-warning';
      case 'medium': return 'text-accent';
      default: return 'text-foreground';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive/10 border-destructive/20';
      case 'warning': return 'bg-warning/10 border-warning/20';
      case 'medium': return 'bg-accent/10 border-accent/20';
      default: return 'bg-muted/10 border-muted/20';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'collision': return <AlertTriangle className="h-4 w-4" />;
      case 'route': return <MapPin className="h-4 w-4" />;
      case 'weather': return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Alert Center
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="text-xs animate-pulse">
              {alerts.filter(a => a.severity === 'critical').length} CRITICAL
            </Badge>
            <Badge variant="outline" className="text-xs">
              {alerts.length} TOTAL
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 p-4 max-h-[400px] overflow-auto">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-lg border ${getSeverityBg(alert.severity)} relative`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={getSeverityColor(alert.severity)}>
                  {getIcon(alert.type)}
                </div>
                <h4 className={`font-medium text-sm ${getSeverityColor(alert.severity)}`}>
                  {alert.title}
                </h4>
              </div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <X className="h-3 w-3" />
              </Button>
            </div>
            
            <p className="text-sm text-foreground mb-2">{alert.description}</p>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {alert.time}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {alert.location}
              </div>
            </div>
            
            <div className="bg-card/50 rounded p-2 border border-border/50">
              <p className="text-xs font-medium text-accent">Recommended Action:</p>
              <p className="text-xs text-foreground mt-1">{alert.action}</p>
            </div>

            {alert.severity === 'critical' && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse"></div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};