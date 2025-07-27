import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Camera, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RunwayDetection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [detectionResults, setDetectionResults] = useState<any>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = (e.target?.result as string)?.split(',')[1];
        setSelectedImage(e.target?.result as string);
        setBase64Image(base64);
        setResultImage(null);
        setDetectionResults(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!base64Image) {
      toast({
        title: 'خطأ',
        description: 'يرجى رفع صورة أولاً',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://serverless.roboflow.com/infer/workflows/toweriq/detect-count-and-visualize-2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          api_key: 'L8plo2CLs6yb5g3R0dDw',
          inputs: {
            image: {
              type: 'base64',
              value: base64Image
            }
          }
        })
      });

      const result = await response.json();

      if (result && result.results && result.results[0]?.predictions) {
        setDetectionResults(result.results[0]);
        if (result.results[0].visualizations?.length > 0) {
          setResultImage(result.results[0].visualizations[0]);
        }

        toast({
          title: 'تم التحليل بنجاح',
          description: `تم اكتشاف ${result.results[0].predictions.length} عنصر في الصورة.`
        });
      } else {
        toast({
          title: 'لم يتم العثور على نتائج',
          description: 'لم يتم الكشف عن عناصر في الصورة.'
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'خطأ في التحليل',
        description: 'حدث خطأ أثناء الاتصال بـ Roboflow API',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            تحليل مدرج الطائرات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">اختر صورة مدرج للتحليل</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <Button variant="outline" onClick={() => document.getElementById('image-upload')?.click()}>
                <Upload className="h-4 w-4 mr-2" />اختيار صورة
              </Button>
            </div>

            {selectedImage && (
              <div className="space-y-4">
                <img src={selectedImage} alt="Selected" className="w-full max-w-xl mx-auto rounded-lg border" />
                <Button onClick={analyzeImage} disabled={loading} className="w-full">
                  {loading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />جاري التحليل...</>
                  ) : (
                    <><Camera className="h-4 w-4 mr-2" />تحليل الصورة</>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {resultImage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-success" />
              نتائج التحليل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <img src={resultImage} alt="Result" className="w-full max-w-xl mx-auto rounded-lg border" />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RunwayDetection;
