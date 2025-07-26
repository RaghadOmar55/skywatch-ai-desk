import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Camera, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RunwayDetection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [detectionResults, setDetectionResults] = useState<any>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setResultImage(null);
        setDetectionResults(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      toast({
        title: "خطأ",
        description: "يرجى تحديد صورة أولاً",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Convert base64 to blob for API
      const base64Data = selectedImage.split(',')[1];
      
      const response = await fetch('https://detect.roboflow.com/detect-count-and-visualize-2/2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `api_key=rf_YOUR_API_KEY&image=${encodeURIComponent(base64Data)}`
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.visualization) {
        setResultImage(`data:image/jpeg;base64,${result.visualization}`);
        setDetectionResults(result);
        
        toast({
          title: "تم التحليل بنجاح",
          description: `تم اكتشاف ${result.predictions?.length || 0} عنصر في الصورة`,
        });
      }
      
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: "خطأ في التحليل",
        description: "حدث خطأ أثناء تحليل الصورة. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            تحليل مدرجات الطائرات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                اختر صورة مدرج الطائرة للتحليل
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <Button 
                variant="outline" 
                className="cursor-pointer"
                onClick={() => document.getElementById('image-upload')?.click()}
                type="button"
              >
                <Upload className="h-4 w-4 mr-2" />
                اختيار صورة
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                الصيغ المدعومة: JPG, PNG, JPEG
              </p>
            </div>

            {selectedImage && (
              <div className="space-y-4">
                <div className="text-center">
                  <img 
                    src={selectedImage} 
                    alt="Selected" 
                    className="max-w-full h-auto max-h-64 mx-auto rounded-lg border"
                  />
                </div>
                
                <Button 
                  onClick={analyzeImage} 
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      جاري التحليل...
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      تحليل الصورة
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {resultImage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-success" />
              نتائج التحليل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <img 
                  src={resultImage} 
                  alt="Detection Results" 
                  className="max-w-full h-auto mx-auto rounded-lg border"
                />
              </div>
              
              {detectionResults?.predictions && (
                <div className="bg-card/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">تفاصيل الكشف:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">العناصر المكتشفة:</span>
                      <p className="font-medium">{detectionResults.predictions.length}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">دقة النموذج:</span>
                      <p className="font-medium">
                        {detectionResults.predictions.length > 0 
                          ? `${(detectionResults.predictions.reduce((acc: number, pred: any) => acc + pred.confidence, 0) / detectionResults.predictions.length * 100).toFixed(1)}%`
                          : 'غير متوفر'
                        }
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">وقت المعالجة:</span>
                      <p className="font-medium">{detectionResults.time || 'غير متوفر'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Key Notice */}
      <Card className="border-warning/50 bg-warning/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <h4 className="font-semibold text-warning mb-1">ملاحظة مهمة</h4>
              <p className="text-sm text-muted-foreground">
                يتطلب هذا المكون مفتاح API صالح من Roboflow. يرجى استبدال "rf_YOUR_API_KEY" بمفتاحك الحقيقي في الكود.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RunwayDetection;