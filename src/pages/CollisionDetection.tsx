import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { AlertTriangle, Plane, ArrowLeft } from 'lucide-react';

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
  const navigate = useNavigate();
  const [aircraft1, setAircraft1] = useState<AircraftData>({
    latitude: 24.774265,
    longitude: 46.738586,
    altitude: 10000,
    speed: 850,
    heading: 90
  });

  const [aircraft2, setAircraft2] = useState<AircraftData>({
    latitude: 24.774265,
    longitude: 46.838586,
    altitude: 9800,
    speed: 830,
    heading: 270
  });

  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Enhanced translation function for Arabic to English
  const translateArabicToEnglish = async (text: string): Promise<string> => {
    if (!text || typeof text !== 'string') return text;
    
    const translations: { [key: string]: string } = {
      // Probability levels
      'منخفض': 'Low',
      'متوسط': 'Medium', 
      'عالي': 'High',
      'عالية': 'High',
      'حرج': 'Critical',
      'حرجة': 'Critical',
      'خطر منخفض': 'Low Risk',
      'خطر متوسط': 'Medium Risk',
      'خطر عالي': 'High Risk',
      'خطر حرج': 'Critical Risk',
      
      // Actions
      'لا يوجد خطر': 'No Risk',
      'لا توجد حاجة لإجراء': 'No Action Required',
      'مراقبة': 'Monitor',
      'مراقبة مستمرة': 'Continuous Monitoring',
      'تغيير المسار': 'Change Course',
      'تعديل المسار': 'Adjust Course',
      'تغيير الارتفاع': 'Change Altitude',
      'هبوط فوري': 'Immediate Landing',
      'إخلاء فوري': 'Immediate Evacuation',
      'اتصال فوري': 'Immediate Contact',
      'تحذير': 'Warning',
      'إنذار': 'Alert',
      
      // Common phrases
      'احتمالية': 'Probability',
      'التصادم': 'Collision',
      'الطائرة': 'Aircraft',
      'مطلوب': 'Required',
      'ضروري': 'Necessary',
      'فوري': 'Immediate'
    };

    let translated = text.trim();
    
    // Apply translations (case-insensitive)
    Object.entries(translations).forEach(([arabic, english]) => {
      const regex = new RegExp(arabic, 'gi');
      translated = translated.replace(regex, english);
    });

    // Clean up extra spaces and return
    return translated.replace(/\s+/g, ' ').trim() || text;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Flatten the payload with top-level keys
      const payload = {
        lat1: aircraft1.latitude,
        lon1: aircraft1.longitude,
        alt1: aircraft1.altitude,
        speed1: aircraft1.speed,
        heading1: aircraft1.heading,
        lat2: aircraft2.latitude,
        lon2: aircraft2.longitude,
        alt2: aircraft2.altitude,
        speed2: aircraft2.speed,
        heading2: aircraft2.heading
      };

      console.log('🔵 Sending payload:', payload);

      const response = await fetch('https://toweriq-1.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('🔴 Status:', response.status);
      const text = await response.text();
      console.log('🟢 Raw response:', text);

      if (!response.ok) {
        throw new Error(text);
      }

      const data: PredictionResponse = JSON.parse(text);
      
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
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <h2 className="text-2xl font-bold">Collision Detection Model</h2>
            <div></div>
          </div>
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
                        type="text"
                        value={aircraft1.latitude.toString()}
                        onChange={(e) => updateAircraft1('latitude', parseFloat(e.target.value) || 0)}
                        placeholder="e.g., 24.774265"
                      />
                    </div>
                    <div>
                      <Label htmlFor="a1-lon">Longitude</Label>
                      <Input
                        id="a1-lon"
                        type="text"
                        value={aircraft1.longitude.toString()}
                        onChange={(e) => updateAircraft1('longitude', parseFloat(e.target.value) || 0)}
                        placeholder="e.g., 46.738586"
                      />
                    </div>
                    <div>
                      <Label htmlFor="a1-alt">Altitude (ft)</Label>
                      <Input
                        id="a1-alt"
                        type="text"
                        value={aircraft1.altitude.toString()}
                        onChange={(e) => updateAircraft1('altitude', parseFloat(e.target.value) || 0)}
                        placeholder="e.g., 10000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="a1-speed">Speed (knots)</Label>
                      <Input
                        id="a1-speed"
                        type="text"
                        value={aircraft1.speed.toString()}
                        onChange={(e) => updateAircraft1('speed', parseFloat(e.target.value) || 0)}
                        placeholder="e.g., 850"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="a1-heading">Heading (degrees)</Label>
                      <Input
                        id="a1-heading"
                        type="text"
                        value={aircraft1.heading.toString()}
                        onChange={(e) => updateAircraft1('heading', parseFloat(e.target.value) || 0)}
                        placeholder="e.g., 90"
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
                        type="text"
                        value={aircraft2.latitude.toString()}
                        onChange={(e) => updateAircraft2('latitude', parseFloat(e.target.value) || 0)}
                        placeholder="e.g., 24.774265"
                      />
                    </div>
                    <div>
                      <Label htmlFor="a2-lon">Longitude</Label>
                      <Input
                        id="a2-lon"
                        type="text"
                        value={aircraft2.longitude.toString()}
                        onChange={(e) => updateAircraft2('longitude', parseFloat(e.target.value) || 0)}
                        placeholder="e.g., 46.838586"
                      />
                    </div>
                    <div>
                      <Label htmlFor="a2-alt">Altitude (ft)</Label>
                      <Input
                        id="a2-alt"
                        type="text"
                        value={aircraft2.altitude.toString()}
                        onChange={(e) => updateAircraft2('altitude', parseFloat(e.target.value) || 0)}
                        placeholder="e.g., 9800"
                      />
                    </div>
                    <div>
                      <Label htmlFor="a2-speed">Speed (knots)</Label>
                      <Input
                        id="a2-speed"
                        type="text"
                        value={aircraft2.speed.toString()}
                        onChange={(e) => updateAircraft2('speed', parseFloat(e.target.value) || 0)}
                        placeholder="e.g., 830"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="a2-heading">Heading (degrees)</Label>
                      <Input
                        id="a2-heading"
                        type="text"
                        value={aircraft2.heading.toString()}
                        onChange={(e) => updateAircraft2('heading', parseFloat(e.target.value) || 0)}
                        placeholder="e.g., 270"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-warning text-warning-foreground hover:bg-warning/90"
                >
                  {loading ? 'Analyzing...' : 'Predict Collision'}
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
                  <p>Enter aircraft data and click "Predict Collision" to get collision prediction</p>
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