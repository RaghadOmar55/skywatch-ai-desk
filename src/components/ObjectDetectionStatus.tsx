import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Camera, AlertTriangle, CheckCircle, Link } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DetectionData {
  objectCount: number;
  lastUpdated: Date;
  status: 'idle' | 'processing' | 'completed' | 'error';
  hasWarnings: boolean;
}

export const ObjectDetectionStatus = () => {
  const navigate = useNavigate();
  const [detectionData, setDetectionData] = useState<DetectionData>({
    objectCount: 0,
    lastUpdated: new Date(),
    status: 'idle',
    hasWarnings: false
  });

  // Listen for updates from Object Detection page
  useEffect(() => {
    const handleDetectionUpdate = (event: CustomEvent) => {
      const { count, status, hasWarnings } = event.detail;
      setDetectionData({
        objectCount: count || 0,
        lastUpdated: new Date(),
        status: status || 'completed',
        hasWarnings: hasWarnings || false
      });
    };

    window.addEventListener('objectDetectionUpdate', handleDetectionUpdate as EventListener);
    
    // Load saved data from localStorage
    const savedData = localStorage.getItem('objectDetectionData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setDetectionData({
        ...parsed,
        lastUpdated: new Date(parsed.lastUpdated)
      });
    }

    return () => {
      window.removeEventListener('objectDetectionUpdate', handleDetectionUpdate as EventListener);
    };
  }, []);

  const getStatusColor = () => {
    switch (detectionData.status) {
      case 'processing': return 'text-yellow-600';
      case 'completed': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusText = () => {
    switch (detectionData.status) {
      case 'processing': return 'معالجة...';
      case 'completed': return 'مكتملة';
      case 'error': return 'خطأ';
      default: return 'في الانتظار';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Object Detection Status
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/object')}
            className="flex items-center gap-2"
          >
            <Link className="h-4 w-4" />
            إفتح
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Detection Results */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card/50 p-3 rounded-lg border text-center">
            <p className="text-2xl font-bold text-primary">
              {detectionData.objectCount}
            </p>
            <p className="text-sm text-muted-foreground">كائنات مكتشفة</p>
          </div>
          
          <div className="bg-card/50 p-3 rounded-lg border text-center">
            <p className={`text-2xl font-bold ${getStatusColor()}`}>
              {detectionData.status === 'completed' && detectionData.objectCount > 0 ? '✓' : 
               detectionData.status === 'error' ? '✗' : '○'}
            </p>
            <p className="text-sm text-muted-foreground">الحالة</p>
          </div>
        </div>

        {/* Status Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">الحالة:</span>
            <Badge variant={detectionData.status === 'completed' ? 'default' : 'secondary'}>
              {getStatusText()}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">آخر تحديث:</span>
            <span className="text-sm">
              {detectionData.lastUpdated.toLocaleTimeString('ar-SA')}
            </span>
          </div>
        </div>

        {/* Warnings */}
        {detectionData.hasWarnings && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                تحذير: تم اكتشاف كائنات تحتاج إلى مراجعة
              </span>
            </div>
          </div>
        )}

        {/* Success Message */}
        {detectionData.status === 'completed' && detectionData.objectCount > 0 && !detectionData.hasWarnings && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                تم تحليل الصورة بنجاح
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};