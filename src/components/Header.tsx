import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plane, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  aiAssistantEnabled: boolean;
}

export const Header = ({ aiAssistantEnabled }: HeaderProps) => {
  const location = useLocation();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Plane className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">TOWERIQ CONTROL CENTER</h1>
        <div className="flex items-center gap-2 ml-4">
          <Badge variant={aiAssistantEnabled ? "default" : "secondary"}>
            AI {aiAssistantEnabled ? "ACTIVE" : "STANDBY"}
          </Badge>
          <Link to="/collision">
            <Button 
              variant="outline" 
              className="bg-warning text-warning-foreground hover:bg-warning/90 border-warning"
            >
              Collision Detection
            </Button>
          </Link>
          <Link to="/object">
            <Button 
              variant="outline" 
              className="bg-warning text-warning-foreground hover:bg-warning/90 border-warning"
            >
              Object Detection
            </Button>
          </Link>
        </div>
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
  );
};