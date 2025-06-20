import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, KeyRound, AlertTriangle } from 'lucide-react';

const API_KEY_STORAGE_KEY = 'geminiApiKey';

const SettingsTab: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: 'API Key Empty',
        description: 'Please enter an API key before saving.',
        variant: 'destructive',
      });
      return;
    }
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    toast({
      title: 'API Key Saved',
      description: 'Your Google Gemini API Key has been saved locally.',
    });
  };

  const handleClearApiKey = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKey('');
    toast({
      title: 'API Key Cleared',
      description: 'Your Google Gemini API Key has been removed from local storage.',
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-gray-700" />
          API Key Management
        </CardTitle>
        <CardDescription>
          Manage your Google Gemini API Key. This key is required for AI features to function.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="gemini-api-key">Google Gemini API Key</Label>
          <div className="flex items-center gap-2">
            <Input
              id="gemini-api-key"
              type={showApiKey ? 'text' : 'password'}
              placeholder="Enter your API key here"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-grow"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowApiKey(!showApiKey)}
              aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
            >
              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleSaveApiKey} className="flex-1">
            Save API Key
          </Button>
          <Button onClick={handleClearApiKey} variant="outline" className="flex-1">
            Clear API Key
          </Button>
        </div>

        <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-md text-sm flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <strong>Security Note:</strong> Your API key is stored locally in your browser's local storage.
            While convenient, be cautious if using this on a shared computer. For optimal security, consider environment variables for development or server-side key management for production applications.
          </div>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Why is an API Key needed?</strong> The Gemini API requires an API key to authenticate requests and grant access to its generative AI models.</p>
            <p><strong>Where to get an API Key?</strong> You can obtain an API key from Google AI Studio after setting up your project.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsTab;
