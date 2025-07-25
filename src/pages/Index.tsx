import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Plane, Settings, Volume2, VolumeX } from 'lucide-react';
import { FlightTable } from '@/components/FlightTable';
import { AlertsPanel } from '@/components/AlertsPanel';
import { MetricsPanel } from '@/components/MetricsPanel';
import { AirspaceMap } from '@/components/AirspaceMap';

const Index = () => {
  const [aiAssistantEnabled, setAiAssistantEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [selectedAirport, setSelectedAirport] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [sensitivity, setSensitivity] = useState('medium');

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Plane className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">ATC Control Center</h1>
            <Badge variant={aiAssistantEnabled ? "default" : "secondary"} className="ml-2">
              AI {aiAssistantEnabled ? "ACTIVE" : "STANDBY"}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Last Update: {new Date().toLocaleTimeString()}
            </div>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-140px)]">
          {/* Control Sidebar */}
          <div className="col-span-3 lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">Control Panel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* AI Assistant Toggle */}
                <div className="space-y-2">
                  <Label htmlFor="ai-assistant">AI Assistant</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ai-assistant"
                      checked={aiAssistantEnabled}
                      onCheckedChange={setAiAssistantEnabled}
                    />
                    <span className="text-sm">{aiAssistantEnabled ? 'ON' : 'OFF'}</span>
                  </div>
                </div>

                {/* Audio Alerts */}
                <div className="space-y-2">
                  <Label htmlFor="audio">Audio Alerts</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAudioEnabled(!audioEnabled)}
                    >
                      {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                    <span className="text-sm">{audioEnabled ? 'ON' : 'OFF'}</span>
                  </div>
                </div>

                {/* Filters */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm">Airport</Label>
                    <Select value={selectedAirport} onValueChange={setSelectedAirport}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Airports</SelectItem>
                        <SelectItem value="jfk">JFK</SelectItem>
                        <SelectItem value="lax">LAX</SelectItem>
                        <SelectItem value="ord">ORD</SelectItem>
                        <SelectItem value="atl">ATL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm">Status</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="enroute">En Route</SelectItem>
                        <SelectItem value="landing">Landing</SelectItem>
                        <SelectItem value="takeoff">Takeoff</SelectItem>
                        <SelectItem value="holding">Holding</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm">Risk Level</Label>
                    <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm">Sensitivity</Label>
                    <Select value={sensitivity} onValueChange={setSensitivity}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="col-span-9 lg:col-span-10">
            <div className="grid grid-cols-12 gap-4 h-full">
              {/* Airspace Map */}
              <div className="col-span-12 lg:col-span-7">
                <AirspaceMap />
              </div>

              {/* Alerts Panel */}
              <div className="col-span-12 lg:col-span-5">
                <AlertsPanel />
              </div>

              {/* Flight Table */}
              <div className="col-span-12 lg:col-span-7">
                <FlightTable 
                  filters={{
                    airport: selectedAirport,
                    status: selectedStatus,
                    risk: selectedRisk
                  }}
                />
              </div>

              {/* Metrics Panel */}
              <div className="col-span-12 lg:col-span-5">
                <MetricsPanel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;