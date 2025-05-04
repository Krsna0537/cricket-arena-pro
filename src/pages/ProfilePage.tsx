
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  first_name: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  last_name: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  profile_picture: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const ProfilePage = () => {
  const { profile, updateProfile, userRole, updateUserRole } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingRole, setIsChangingRole] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      profile_picture: profile?.profile_picture || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    await updateProfile(data);
    setIsEditing(false);
  };

  const handleRoleChange = async () => {
    setIsChangingRole(true);
    try {
      await updateUserRole('creator');
      toast({
        title: "Role updated",
        description: "You are now a creator and can create tournaments.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role.",
        variant: "destructive",
      });
    } finally {
      setIsChangingRole(false);
    }
  };

  const getInitials = () => {
    if (!profile) return '?';
    const first = profile.first_name?.[0] || '';
    const last = profile.last_name?.[0] || '';
    return (first + last).toUpperCase();
  };

  const fullName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'User';

  return (
    <div className="container max-w-4xl mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src={profile?.profile_picture || ''} />
                <AvatarFallback className="bg-cricket-navy text-white text-xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">{fullName}</CardTitle>
              <CardDescription>Role: {userRole?.charAt(0).toUpperCase() + userRole?.slice(1) || 'User'}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {!isEditing && (
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(true)}
                  className="mt-2"
                >
                  Edit Profile
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                {isEditing 
                  ? 'Update your profile details below' 
                  : 'View your account information'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="profile_picture"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profile Picture URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://example.com/image.jpg" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        className="bg-cricket-navy hover:bg-cricket-navy-light"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">First Name</h3>
                    <p>{profile?.first_name || 'Not set'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Last Name</h3>
                    <p>{profile?.last_name || 'Not set'}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {userRole === 'viewer' && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Account Permissions</CardTitle>
            <CardDescription>
              Change your account role to access more features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Current Role: Viewer</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  As a viewer, you can join tournaments and view their details.
                </p>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
                <h3 className="font-medium text-amber-800">Become a Creator</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Creators can create and manage tournaments, teams, and matches.
                </p>
                <Button 
                  onClick={handleRoleChange}
                  className="mt-3 bg-amber-600 hover:bg-amber-700"
                  disabled={isChangingRole}
                >
                  {isChangingRole ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Change to Creator'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
