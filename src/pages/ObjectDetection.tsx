import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Camera, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ObjectDetection = () => {
  const navigate = useNavigate();
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

      if (result && result.outputs && result.outputs[0]) {
        const output = result.outputs[0];
        setDetectionResults(output);
        
        // استخراج الصورة المعالجة
        if (output.output_image && output.output_image.value) {
          setResultImage(`data:image/jpeg;base64,${output.output_image.value}`);
        }

        toast({
          title: 'تم التحليل بنجاح',
          description: `تم اكتشاف ${output.count_objects || 0} عنصر في الصورة.`
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
              العودة للصفحة الرئيسية
            </Button>
            <h2 className="text-2xl font-bold">Object Detection Model</h2>
            <div></div>
          </div>
        </div>

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
                <div className="space-y-6">
                  {/* مقارنة الصور */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-center">الصورة الأصلية</h4>
                      <div className="border-2 border-border rounded-lg p-2">
                        <img 
                          src={selectedImage} 
                          alt="Original" 
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-center">الصورة بعد التحليل</h4>
                      <div className="border-2 border-primary rounded-lg p-2">
                        <img 
                          src={resultImage} 
                          alt="Detection Result" 
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                      <p className="text-xs text-center text-muted-foreground">
                        الصورة مع العلامات والكشوفات
                      </p>
                    </div>
                  </div>
                  
                  {/* تفاصيل النتائج */}
                  {detectionResults && (
                    <div className="bg-card/50 p-4 rounded-lg border">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        ملخص التحليل
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-background p-3 rounded border text-center">
                          <p className="text-2xl font-bold text-primary">
                            {detectionResults.count_objects || 0}
                          </p>
                          <p className="text-sm text-muted-foreground">عنصر مكتشف</p>
                        </div>
                        
                        <div className="bg-background p-3 rounded border text-center">
                          <p className="text-2xl font-bold text-success">
                            {detectionResults.count_objects > 0 ? '✓' : '✗'}
                          </p>
                          <p className="text-sm text-muted-foreground">حالة الكشف</p>
                        </div>
                        
                        <div className="bg-background p-3 rounded border text-center">
                          <p className="text-2xl font-bold text-blue-600">
                            {detectionResults.output_image ? '100%' : '0%'}
                          </p>
                          <p className="text-sm text-muted-foreground">حالة المعالجة</p>
                        </div>
                      </div>
                      
                      {detectionResults.count_objects > 0 && (
                        <div className="space-y-3">
                          <h5 className="font-medium border-b pb-2">معلومات إضافية:</h5>
                          <div className="bg-background p-3 rounded border">
                            <p className="text-sm">
                              تم تحليل الصورة بنجاح وتم اكتشاف <span className="font-bold text-primary">{detectionResults.count_objects}</span> عنصر.
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                              تم وضع العلامات والتعليقات على الصورة المعالجة.
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <details className="mt-4 border-t pt-3">
                        <summary className="cursor-pointer font-medium text-muted-foreground hover:text-foreground">
                          عرض البيانات التقنية الكاملة
                        </summary>
                        <pre className="overflow-auto text-xs bg-muted p-3 rounded-md max-h-48 text-left mt-3 border">
                          {JSON.stringify(detectionResults, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ObjectDetection;
