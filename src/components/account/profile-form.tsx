
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { auth, storage } from '@/lib/firebase';
import { updateProfile, onAuthStateChanged, type User } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export function ProfileForm() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setDisplayName(currentUser.displayName || '');
        setPhotoURL(currentUser.photoURL || '');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewAvatar(file);
      setPhotoURL(URL.createObjectURL(file));
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    let newPhotoURL = user.photoURL;

    try {
      if (newAvatar) {
        const storageRef = ref(storage, `avatars/${user.uid}/${newAvatar.name}`);
        const snapshot = await uploadBytes(storageRef, newAvatar);
        newPhotoURL = await getDownloadURL(snapshot.ref);
      }

      await updateProfile(user, {
        displayName,
        photoURL: newPhotoURL,
      });
      
      setNewAvatar(null);

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) {
    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-6">
                <div className="h-24 w-24 rounded-full bg-muted animate-pulse" />
                <div className="space-y-2">
                     <div className="h-9 w-28 rounded-md bg-muted animate-pulse" />
                     <div className="h-4 w-40 rounded-md bg-muted animate-pulse" />
                </div>
            </div>
            <div className="space-y-2">
                <div className="h-5 w-24 rounded-md bg-muted animate-pulse" />
                <div className="h-10 w-full rounded-md bg-muted animate-pulse" />
            </div>
             <div className="h-10 w-32 rounded-md bg-muted animate-pulse" />
        </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center space-x-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={photoURL} alt={displayName} />
          <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
            Change Avatar
            </Button>
            <p className="text-xs text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleAvatarChange}
          className="hidden"
          accept="image/png, image/jpeg, image/gif"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name</Label>
        <Input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}
