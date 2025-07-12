
"use client";

import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Clipboard, ClipboardCheck, Save } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'online-notepad-data';

export function OnlineNotepad() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const { title, content } = JSON.parse(savedData);
        setTitle(title || '');
        setContent(content || '');
      }
    } catch (error) {
      console.error("Failed to read from localStorage", error);
    }
  }, []);

  const handleSave = () => {
    try {
      const dataToSave = JSON.stringify({ title, content });
      localStorage.setItem(LOCAL_STORAGE_KEY, dataToSave);
      toast({
        title: "Saved!",
        description: "Your notes have been saved.",
      });
    } catch (error) {
      console.error("Failed to write to localStorage", error);
      toast({
        title: "Error",
        description: "Could not save your notes. Your browser's local storage might be full or disabled.",
        variant: "destructive",
      });
    }
  };

  const handleCopy = () => {
    const textToCopy = `Title: ${title}\n\n${content}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      toast({
        title: "Copied!",
        description: "Your notes have been copied to the clipboard.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    }, (err) => {
      console.error('Could not copy text: ', err);
      toast({
        title: "Error",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    });
  };

  return (
    <div className="space-y-4">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note Title"
        className="text-lg font-semibold"
        aria-label="Note Title"
      />
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing your notes here..."
        className="min-h-[300px] h-[60vh] max-h-[800px] text-lg resize-none"
        aria-label="Note Content"
      />
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Your notes are saved in your browser.
        </p>
        <div className="flex gap-2">
          <Button onClick={handleCopy} variant="outline" size="sm" disabled={!content && !title}>
            {isCopied ? <ClipboardCheck className="mr-2" /> : <Clipboard className="mr-2" />}
            {isCopied ? 'Copied' : 'Copy All'}
          </Button>
          <Button onClick={handleSave} size="sm">
            <Save className="mr-2" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
