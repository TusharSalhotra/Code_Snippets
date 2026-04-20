'use client';

import { User } from '../types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Building, Calendar, Award, Target, FileText, Edit } from 'lucide-react';

interface UserDetailsDrawerProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditClick?: (user: User) => void;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export function UserDetailsDrawer({ user, open, onOpenChange, onEditClick }: UserDetailsDrawerProps) {
  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>User Details</SheetTitle>
            {onEditClick && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditClick(user)}
                className="mr-8"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6 px-4">
          {/* User Header */}
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name} />
              ) : (
                <AvatarFallback className="text-xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="text-xl text-white">{user.name}</h3>
              <p className="text-[#B0B6C1]">{user.email}</p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="roles">Roles</TabsTrigger>
              <TabsTrigger value="kpis">KPIs</TabsTrigger>
              <TabsTrigger value="assessments">Assessments</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#00F5C6]" />
                    Work Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[#B0B6C1] text-sm">Role</span>
                      <span className="text-white text-sm font-medium">{user.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#B0B6C1] text-sm">Department</span>
                      <span className="text-white text-sm font-medium">{user.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#B0B6C1] text-sm">Status</span>
                      <Badge 
                        variant={user.status === 'active' ? 'default' : 'secondary'}
                        className={
                          user.status === 'active' 
                            ? 'bg-[#00F5C6]/10 text-[#00F5C6] border-[#00F5C6]/30' 
                            : user.status === 'pending'
                            ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30'
                            : 'bg-red-400/10 text-red-400 border-red-400/30'
                        }
                      >
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#00AEEF]" />
                    Contact Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#B0B6C1]" />
                      <span className="text-white text-sm">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#B0B6C1]" />
                      <span className="text-[#B0B6C1] text-sm">Not provided</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-br from-[#00F5C6]/10 to-[#00AEEF]/10 border border-[#00F5C6]/30">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#00F5C6]" />
                    Skill Score
                  </h4>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold text-white">{user.skillScore}</div>
                    <div className="flex-1">
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#00F5C6] to-[#00AEEF]"
                          style={{ width: `${user.skillScore}%` }}
                        />
                      </div>
                      <p className="text-[#B0B6C1] text-xs mt-1">Overall performance</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Roles Tab */}
            <TabsContent value="roles">
              <div className="space-y-4">
                <p className="text-[#B0B6C1]">Role permissions and assignments will appear here.</p>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <h4 className="text-white font-medium mb-2">Current Role</h4>
                  <p className="text-white">{user.role}</p>
                  <p className="text-[#B0B6C1] text-sm mt-1">Department: {user.department}</p>
                </div>
              </div>
            </TabsContent>

            {/* KPIs Tab */}
            <TabsContent value="kpis">
              <div className="space-y-4">
                <p className="text-[#B0B6C1] mb-4">Key performance indicators and metrics.</p>
                <div className="grid gap-3">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-[#00F5C6]" />
                        <span className="text-white text-sm">Skill Score</span>
                      </div>
                      <span className="text-white font-bold">{user.skillScore}%</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#00AEEF]" />
                        <span className="text-white text-sm">Assessments Completed</span>
                      </div>
                      <span className="text-white font-bold">0</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Assessments Tab */}
            <TabsContent value="assessments">
              <div className="space-y-4">
                <p className="text-[#B0B6C1]">Assessment history and results will appear here.</p>
                <div className="p-8 text-center rounded-lg bg-white/5 border border-white/10">
                  <Calendar className="w-12 h-12 text-[#B0B6C1] mx-auto mb-3" />
                  <p className="text-white">No assessments yet</p>
                  <p className="text-[#B0B6C1] text-sm mt-1">Assessments will be listed here once completed</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
