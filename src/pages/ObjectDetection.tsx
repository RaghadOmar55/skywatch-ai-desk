import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Camera, Upload } from 'lucide-react';
import RunwayDetection from '@/components/RunwayDetection';

const ObjectDetection = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-[1800px] mx-auto">
        <Header aiAssistantEnabled={true} />
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center mb-8">Object Detection</h2>
        </div>

        {/* Runway Detection Component */}
        <RunwayDetection />

        {/* Analysis Results Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-success" />
              نتائج تحليل الصور - Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-card/30 p-6 rounded-lg border border-border">
              <div className="text-center">
                <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">مركز تحليل الصور</h3>
                <p className="text-muted-foreground mb-4">
                  استخدم أداة تحليل مدرجات الطائرات أعلاه لرفع وتحليل الصور
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-background/50 p-3 rounded border">
                    <div className="font-semibold text-success">✅ الكشف عن المدرجات</div>
                    <div className="text-muted-foreground">تحديد وتحليل مدرجات الطائرات</div>
                  </div>
                  <div className="bg-background/50 p-3 rounded border">
                    <div className="font-semibold text-warning">🔍 عدد الكائنات</div>
                    <div className="text-muted-foreground">إحصاء العناصر المكتشفة</div>
                  </div>
                  <div className="bg-background/50 p-3 rounded border">
                    <div className="font-semibold text-accent">📊 التصور البصري</div>
                    <div className="text-muted-foreground">عرض النتائج مع التأشير</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default ObjectDetection;