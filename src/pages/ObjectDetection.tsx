import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Camera, Upload } from 'lucide-react';

const ObjectDetection = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-[1800px] mx-auto">
        <Header aiAssistantEnabled={true} />
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center mb-8">Object Detection</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-warning" />
                Object Detection Input
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    Upload image or video for object detection analysis
                  </p>
                  <Button variant="outline" className="mb-2">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Supported formats: JPG, PNG, MP4, AVI
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Detection Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Confidence Threshold</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        defaultValue="70"
                        className="w-full"
                      />
                      <span className="text-xs text-muted-foreground">70%</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Detection Type</label>
                      <select className="w-full p-2 rounded border border-border bg-background">
                        <option>All Objects</option>
                        <option>Aircraft</option>
                        <option>Vehicles</option>
                        <option>People</option>
                        <option>Debris</option>
                      </select>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full bg-warning text-warning-foreground hover:bg-warning/90"
                  disabled
                >
                  <Search className="h-4 w-4 mr-2" />
                  Analyze Objects
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Detection Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="mb-4">Object detection model integration coming soon</p>
                <div className="text-left space-y-2 max-w-md mx-auto">
                  <h4 className="font-semibold text-foreground">Planned Features:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Real-time aircraft detection</li>
                    <li>• Runway object identification</li>
                    <li>• Foreign object debris (FOD) detection</li>
                    <li>• Vehicle tracking on tarmac</li>
                    <li>• Personnel safety monitoring</li>
                    <li>• Automated alert generation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Future Integration Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Integration Roadmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-card/50 border border-border">
                <h4 className="font-semibold mb-2 text-warning">Phase 1</h4>
                <p className="text-sm text-muted-foreground">
                  Static image analysis with pre-trained models for common airport objects
                </p>
              </div>
              <div className="p-4 rounded-lg bg-card/50 border border-border">
                <h4 className="font-semibold mb-2 text-accent">Phase 2</h4>
                <p className="text-sm text-muted-foreground">
                  Real-time video stream processing with custom aviation-specific model training
                </p>
              </div>
              <div className="p-4 rounded-lg bg-card/50 border border-border">
                <h4 className="font-semibold mb-2 text-primary">Phase 3</h4>
                <p className="text-sm text-muted-foreground">
                  Integration with airport camera systems and automated response protocols
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ObjectDetection;