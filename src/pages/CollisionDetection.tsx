import { useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { AlertTriangle, Plane } from 'lucide-react';

interface AircraftData {
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  heading: number;
}

interface PredictionResponse {
  collision_probability: string;
  action_required: string;
}

const CollisionDetection = () => {
  const [aircraft1, setAircraft1] = useState<AircraftData>({
    latitude: 0,
    longitude: 0,
    altitude: 0,
    speed: 0,
    heading: 0
  });

  const [aircraft2, setAircraft2] = useState<AircraftData>({
    latitude: 0,
    longitude: 0,
    altitude: 0,
    speed: 0,
    heading: 0
  });

  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Simple translation function (would use proper translation service in production)
  const translateArabicToEnglish = async (text: string): Promise<string> => {
    // This is a simplified translation - in production, use a proper translation API
    const translations: { [key: string]: string } = {
      'منخفض': 'Low',
      'متوسط': 'Medium', 
      'عالي': 'High',
      'حرج': 'Critical',
      'لا يوجد خطر': 'No risk',
      'مراقبة': 'Monitor',
      'تغيير المسار': 'Change course',
      'هبوط فوري': 'Immediate landing',
      'إخلاء فوري': 'Immediate evacuation'
    };

    // Simple word replacement - in production use proper translation API
    let translated = text;
    Object.entries(translations).forEach(([arabic, english]) => {
      translated = translated.replace(new RegExp(arabic, 'g'), english);
    });

    return translated || text; // Return original if no translation found
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://toweriq-1.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aircraft1,
          aircraft2
        }),
      });

      if (!response.ok) {
        throw new Error('Prediction API request failed');
      }

      const data: PredictionResponse = await response.json();
      
      // Translate Arabic responses to English
      const translatedProbability = await translateArabicToEnglish(data.collision_probability);
      const translatedAction = await translateArabicToEnglish(data.action_required);

      const translatedPrediction = {
        collision_probability: translatedProbability,
        action_required: translatedAction
      };

      setPrediction(translatedPrediction);

      // Send alert to main page alerts panel
      const alertMessage = `Collision Alert: ${translatedProbability} probability. Action: ${translatedAction}`;
      
      // Use localStorage to communicate with main page (simple approach)
      const existingAlerts = JSON.parse(localStorage.getItem('toweriq-alerts') || '[]');
      const newAlert = {
        id: Date.now(),
        message: alertMessage,
        timestamp: new Date().toISOString(),
        type: 'collision',
        severity: translatedProbability.toLowerCase().includes('high') || translatedProbability.toLowerCase().includes('critical') ? 'critical' : 'warning'
      };
      
      existingAlerts.unshift(newAlert);
      localStorage.setItem('toweriq-alerts', JSON.stringify(existingAlerts.slice(0, 10))); // Keep only last 10 alerts

      // Dispatch custom event for real-time updates
      window.dispatchEvent(new CustomEvent('newAlert', { detail: newAlert }));

      toast.success('Collision prediction completed');
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error('Failed to get collision prediction');
    } finally {
      setLoading(false);
    }
  };

  const updateAircraft1 = (field: keyof AircraftData, value: number) => {
    setAircraft1(prev => ({ ...prev, [field]: value }));
  };

  const updateAircraft2 = (field: keyof AircraftData, value: number) => {
    setAircraft2(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-[1800px] mx-auto">
        <Header aiAssistantEnabled={true} />
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center mb-8">نموذج التنبؤ بالتصادم</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Aircraft Data Input
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Aircraft 1 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Plane className="h-4 w-4" />
                    Aircraft 1
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="a1-lat">Latitude</Label>
                      <Input
                        id="a1-lat"
                        type="number"
                        step="any"
                        value={aircraft1.latitude}
                        onChange={(e) => updateAircraft1('latitude', parseFloat(e.target.value) || 0)}
                        placeholder="e.g., 40.7128"
                      />
                    </div>
                    <div>
                      <Label htmlFor="a1-lon">Longitude</Label>
                      <Input
                        id="a1-lon"
                        type="number"
                        step="any"
                        value={aircraft1.longitude}
                        onChange={(e) => updateAircraft1('longitude', parseFloat(e.target.value) || 0)}
                        placeholder="e.g., -74.0060"
                      />
                    </div>
                    <div>
                      <Label htmlFor="a1-alt">Altitude (ft)</Label>
                      <Input
                        id="a1-alt"
                        type="number"
                        value={aircraft1.altitude}
                        onChange={(e) => updateAircraft1('altitude', parseFloat(e.target.value) || 0)}
                        placeholder="e.g., 35000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="a1-speed">Speed (knots)</Label>
                      <Input
                        id="a1-speed"
                        type="number"
                        value={aircraft1.speed}
                        onChange={(e) => updateAircraft1('speed', parseFloat(e.target.value) || 0)}
                        placeholder="e.g., 450"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="a1-heading">Heading (degrees)</Label>
                      <Input
                        id="a1-heading"
                        type="number"
                        min="0"
                        max="359"
                        value={aircraft1.heading}
                        onChange={(e) => updateAircraft1('heading', parseFloat(e.target.value) || 0)}
                        placeholder="e.g., 270"
                      />
                    </div>
                  </div>
                </div>

                {/* Aircraft 2 */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Plane className="h-4 w-4" />
                    Aircraft 2
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="a2-lat">Latitude</Label>
                      <Input
                        id="a2-lat"
                        type="number"
                        step="any"
                        value={aircraft2.latitude}
                        onChange={(e) => updateAircraft2('latitude', parseFloat(e.target.value) || 0)}
                        placeholder="e.g., 40.7580"
                      />
                    </div>
                    <div>
                      <Label htmlFor="a2-lon">Longitude</Label>
                      <Input
                        id="a2-lon"
                        type="number"
                        step="any"
                        value={aircraft2.longitude}
                        onChange={(e) => updateAircraft2('longitude', parseFloat(e.target.value) || 0)}
                        placeholder="e.g., -73.9855"
                      />
                    </div>
                    <div>
                      <Label htmlFor="a2-alt">Altitude (ft)</Label>
                      <Input
                        id="a2-alt"
                        type="number"
                        value={aircraft2.altitude}
                        onChange={(e) => updateAircraft2('altitude', parseFloat(e.target.value) || 0)}
                        placeholder="e.g., 36000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="a2-speed">Speed (knots)</Label>
                      <Input
                        id="a2-speed"
                        type="number"
                        value={aircraft2.speed}
                        onChange={(e) => updateAircraft2('speed', parseFloat(e.target.value) || 0)}
                        placeholder="e.g., 420"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="a2-heading">Heading (degrees)</Label>
                      <Input
                        id="a2-heading"
                        type="number"
                        min="0"
                        max="359"
                        value={aircraft2.heading}
                        onChange={(e) => updateAircraft2('heading', parseFloat(e.target.value) || 0)}
                        placeholder="e.g., 90"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-warning text-warning-foreground hover:bg-warning/90"
                >
                  {loading ? 'Analyzing...' : 'تنبؤ التصادم'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Prediction Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {prediction ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-card/50 border border-border">
                    <h3 className="font-semibold text-accent mb-2">Collision Probability</h3>
                    <p className="text-lg font-medium">{prediction.collision_probability}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-card/50 border border-border">
                    <h3 className="font-semibold text-accent mb-2">Recommended Action</h3>
                    <p className="text-lg font-medium">{prediction.action_required}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Enter aircraft data and click "تنبؤ التصادم" to get collision prediction</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CollisionDetection;