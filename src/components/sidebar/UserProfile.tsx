'use client';

// import { useSession } from 'next-auth/react';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfile({ isOpen, onClose }: UserProfileProps) {
  // Demo user data
  const user = {
    name: 'Demo User',
    email: 'demo@proxllm.com',
    id: 'demo-123',
    image: null
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* User Avatar and Basic Info */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image || ''} alt={user.name || 'User'} />
              <AvatarFallback className="text-lg">
                {user.name?.charAt(0)?.toUpperCase() || 
                 user.email?.charAt(0)?.toUpperCase() || 
                 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-1">
              <h3 className="font-semibold text-lg">
                {user.name || 'Unnamed User'}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {user.email}
              </p>
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Account Status
              </h4>
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-xs">
                  Active
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Free Plan
                </Badge>
              </div>
            </div>

            {user.email && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Account Information
                </h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-mono text-xs">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">User ID:</span>
                    <span className="font-mono text-xs">{user.id?.slice(-8) || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Usage Stats */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Usage Statistics
              </h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Conversations:</span>
                  <span>0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Messages:</span>
                  <span>0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tokens Used:</span>
                  <span>0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}