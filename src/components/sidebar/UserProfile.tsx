'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { User, Mail, Calendar, Shield, Loader2 } from 'lucide-react';
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

interface UserProfileData {
  id: string;
  clerkId: string | null;
  name: string | null;
  email: string;
  image: string | null;
  role: 'ADMIN' | 'USER';
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  tokensUsed: number;
  monthlyLimit?: number;
  lastActiveAt?: string;
  createdAt: string;
  statistics: {
    conversations: number;
    totalMessages: number;
    totalTokensFromMessages: number;
  };
}

export function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const { user: clerkUser } = useUser();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!clerkUser || !isOpen) return;
      
      setLoading(true);
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
        } else {
          console.error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [clerkUser, isOpen]);
  
  if (!clerkUser) {
    return null;
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">Loading profile...</span>
          </div>
        ) : (
          <div className="space-y-6">
            {/* User Avatar and Basic Info */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage 
                  src={clerkUser.imageUrl || ''} 
                  alt={clerkUser.firstName || clerkUser.emailAddresses?.[0]?.emailAddress || 'User'} 
                />
                <AvatarFallback className="text-lg">
                  {clerkUser.firstName?.charAt(0)?.toUpperCase() || 
                   clerkUser.emailAddresses?.[0]?.emailAddress?.charAt(0)?.toUpperCase() || 
                   'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-1">
                <h3 className="font-semibold text-lg">
                  {clerkUser.firstName && clerkUser.lastName 
                    ? `${clerkUser.firstName} ${clerkUser.lastName}` 
                    : clerkUser.firstName 
                    ? clerkUser.firstName
                    : 'Unnamed User'
                  }
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {clerkUser.emailAddresses?.[0]?.emailAddress || 'No email'}
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
                  <Badge 
                    variant={profileData?.status === 'ACTIVE' ? 'default' : profileData?.status === 'SUSPENDED' ? 'secondary' : 'destructive'} 
                    className="text-xs"
                  >
                    {profileData?.status || 'Active'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {profileData?.plan || 'Free'} Plan
                  </Badge>
                  {profileData?.role === 'ADMIN' && (
                    <Badge variant="default" className="text-xs bg-purple-600">
                      Admin
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Account Information
                </h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-mono text-xs">
                      {clerkUser.emailAddresses?.[0]?.emailAddress || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">User ID:</span>
                    <span className="font-mono text-xs">
                      {profileData?.id?.slice(-8) || 'N/A'}
                    </span>
                  </div>
                  {profileData?.lastActiveAt && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Active:</span>
                      <span className="text-xs">
                        {formatDistanceToNow(new Date(profileData.lastActiveAt), { addSuffix: true })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Usage Stats */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Usage Statistics
                </h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Conversations:</span>
                    <span>{profileData?.statistics?.conversations || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Messages:</span>
                    <span>{profileData?.statistics?.totalMessages || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tokens Used:</span>
                    <span>
                      {profileData?.tokensUsed?.toLocaleString() || 0}
                      {profileData?.monthlyLimit && (
                        <span className="text-muted-foreground">
                          {' / '}{profileData.monthlyLimit.toLocaleString()}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}