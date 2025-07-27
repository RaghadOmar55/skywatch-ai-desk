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
      const base64Data = selectedImage.split(',')[1]; // remove base64 header

      const response = await fetch('https://serverless.roboflow.com/infer/workflows/toweriq/detect-count-and-visualize-2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: 'L8plo2CLs6yb5g3R0dDw', // مفتاحك الفعّال من Roboflow
          inputs: {
            image: {
              type: 'base64',
              value: base64Data
            }
          }
        })
      });

      const result = await response.json();
      console.log('🔍 نتيجة Roboflow:', result);

      const visualization = result?.results?.[0]?.visualizations?.[0]?.image;

      if (visualization) {
        setResultImage(visualization);
        setDetectionResults(result);

        toast({
          title: "✅ تم التحليل",
          description: `تمت معالجة الصورة وعرض النتائج بنجاح.`,
        });
      } else {
        throw new Error('لم يتم العثور على صورة معالجة');
      }
    } catch (error) {
      console.error('❌ خطأ في التحليل:', error);
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
      {/* رفع الصورة */}
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

      {/* عرض النتائج */}
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
              
              {detectionResults && (
                <div className="bg-card/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">تفاصيل إضافية:</h4>
                  <pre className="overflow-auto text-sm bg-muted p-4 rounded-md max-h-64 text-left">
                    {JSON.stringify(detectionResults, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RunwayDetection;
