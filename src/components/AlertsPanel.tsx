import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X, Clock, MapPin, Camera, Link } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Alert {
  id: number;
  type: string;
  severity: string;
  title: string;
  description: string;
  time: string;
  location: string;
  action: string;
  message?: string;
  timestamp?: string;
}

export const AlertsPanel = () => {
  const navigate = useNavigate();
  const [objectDetectionData, setObjectDetectionData] = useState({
    objectCount: 0,
    status: 'idle',
    hasWarnings: false,
    lastUpdated: new Date(),
    hasBeenUsed: false // Only show when model has been actively used
  });
  const [alerts, setAlerts] = useState<Alert[]>([
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
  ]);

  // Listen for object detection updates
  useEffect(() => {
    const handleObjectDetectionUpdate = (event: CustomEvent) => {
      const { count, status, hasWarnings } = event.detail;
      const newData = {
        objectCount: count || 0,
        status: status || 'completed',
        hasWarnings: hasWarnings || false,
        lastUpdated: new Date(),
        hasBeenUsed: true // Mark as used when receiving active updates
      };
      setObjectDetectionData(newData);
      
      // Create alert for object detection warnings
      if (hasWarnings && count > 0) {
        const objectAlert = {
          id: Date.now() + 1000,
          type: 'object_detection',
          severity: 'warning',
          title: 'Object Detection Alert',
          description: `${count} objects detected requiring review`,
          time: 'Just now',
          location: 'Camera Analysis',
          action: 'Review detected objects in Object Detection page'
        };
        setAlerts(prev => [objectAlert, ...prev.slice(0, 9)]);
      }
    };

    window.addEventListener('objectDetectionUpdate', handleObjectDetectionUpdate as EventListener);
    
    // Load saved object detection data only if it shows the model was actually used
    const savedObjectData = localStorage.getItem('objectDetectionData');
    if (savedObjectData) {
      const parsed = JSON.parse(savedObjectData);
      // Only restore if the model was previously used (not just default data)
      if (parsed.hasBeenUsed) {
        setObjectDetectionData({
          ...parsed,
          lastUpdated: new Date(parsed.lastUpdated)
        });
      }
    }

    return () => {
      window.removeEventListener('objectDetectionUpdate', handleObjectDetectionUpdate as EventListener);
    };
  }, []);

  // Listen for new alerts from other pages
  useEffect(() => {
    const handleNewAlert = (event: CustomEvent) => {
      const newAlert = event.detail;
      setAlerts(prev => [
        {
          id: newAlert.id,
          type: newAlert.type,
          severity: newAlert.severity,
          title: newAlert.type === 'collision' ? 'Collision Alert' : 'System Alert',
          description: newAlert.message,
          time: 'Just now',
          location: 'AI Prediction',
          action: newAlert.message
        },
        ...prev.slice(0, 9) // Keep only 10 most recent alerts
      ]);
    };

    // Also check localStorage for alerts on mount
    const savedAlerts = localStorage.getItem('toweriq-alerts');
    if (savedAlerts) {
      const parsedAlerts = JSON.parse(savedAlerts);
      if (parsedAlerts.length > 0) {
        const formattedAlerts = parsedAlerts.map((alert: any) => ({
          id: alert.id,
          type: alert.type,
          severity: alert.severity,
          title: alert.type === 'collision' ? 'Collision Alert' : 'System Alert',
          description: alert.message,
          time: new Date(alert.timestamp).toLocaleTimeString(),
          location: 'AI Prediction',
          action: alert.message
        }));
        setAlerts(prev => [...formattedAlerts, ...prev].slice(0, 10));
      }
    }

    window.addEventListener('newAlert', handleNewAlert as EventListener);
    return () => window.removeEventListener('newAlert', handleNewAlert as EventListener);
  }, []);

  const deleteAlert = (alertId: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    
    // Also remove from localStorage if it exists there
    const savedAlerts = localStorage.getItem('toweriq-alerts');
    if (savedAlerts) {
      const parsedAlerts = JSON.parse(savedAlerts);
      const updatedAlerts = parsedAlerts.filter((alert: any) => alert.id !== alertId);
      localStorage.setItem('toweriq-alerts', JSON.stringify(updatedAlerts));
    }
  };

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
      case 'object_detection': return <Camera className="h-4 w-4" />;
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
        {/* Object Detection Status Section - Only show if model has been used */}
        {objectDetectionData.hasBeenUsed && objectDetectionData.objectCount > 0 && (
          <div className="p-3 rounded-lg border bg-primary/5 border-primary/20 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-primary" />
                <h4 className="font-medium text-sm text-primary">Object Detection Status</h4>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/object')}
                className="h-6 text-xs px-2 py-1 flex items-center gap-1"
              >
                <Link className="h-3 w-3" />
                Open
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="text-center">
                <p className="text-lg font-bold text-primary">{objectDetectionData.objectCount}</p>
                <p className="text-xs text-muted-foreground">Objects Detected</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">
                  {objectDetectionData.status === 'completed' ? '✓' : '○'}
                </p>
                <p className="text-xs text-muted-foreground">Status</p>
              </div>
            </div>

            <div className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
              <Clock className="h-3 w-3" />
              Last updated: {objectDetectionData.lastUpdated.toLocaleTimeString()}
            </div>

            {objectDetectionData.hasWarnings && (
              <div className="bg-warning/10 border border-warning/20 rounded p-2">
                <p className="text-xs font-medium text-warning">
                  ⚠️ Objects detected requiring review
                </p>
              </div>
            )}
          </div>
        )}
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
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 hover:bg-destructive/20"
                onClick={() => deleteAlert(alert.id)}
              >
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