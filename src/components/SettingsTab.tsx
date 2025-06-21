import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, KeyRound, AlertTriangle, Save } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { makeWpAjaxRequest, WpAjaxError } from '@/lib/wpApiService';
import { toast as sonnerToast } from 'sonner';

// const API_KEY_STORAGE_KEY = 'geminiApiKey'; // No longer using localStorage

const SETTING_KEY_GEMINI_API = 'gemini_api_key';

const SettingsTab: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const queryClient = useQueryClient();

  // Fetch the API key from WordPress backend
  const { data: initialApiKey, isLoading: isLoadingApiKey } = useQuery<string, WpAjaxError>({
    queryKey: ['setting', SETTING_KEY_GEMINI_API],
    queryFn: async () => {
      // This requires a new PHP AJAX action or an addition to the proxy
      // Assuming 'get_setting_value' action in 'flux_seo_proxy'
      return makeWpAjaxRequest<string>({
        wpAjaxAction: 'flux_seo_proxy',
        action: 'get_setting_value', // Custom action for the proxy to handle
        data: { setting_key: SETTING_KEY_GEMINI_API },
        method: 'POST', // Or GET if preferred for fetching
      });
    },
    enabled: true, // Fetch on component mount
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      if (data) {
        setApiKey(data);
      }
    },
    onError: (error) => {
      sonnerToast.error(`Failed to load API key: ${error.message}`);
    }
  });

  useEffect(() => {
    if (initialApiKey) {
      setApiKey(initialApiKey);
    }
  }, [initialApiKey]);

  const saveSettingsMutation = useMutation<
    any, // Expecting generic success response data
    WpAjaxError,
    Record<string, string> // Settings object {key: value}
  >({
    mutationFn: async (settingsToSave) => {
      return makeWpAjaxRequest({
        wpAjaxAction: 'flux_seo_save_settings', // Main WordPress AJAX action
        data: { settings: JSON.stringify(settingsToSave) }, // Payload expected by handle_save_settings in PHP
      });
    },
    onSuccess: (data, variables) => {
      sonnerToast.success('Settings saved successfully!');
      // Invalidate the query for the specific setting to refetch if needed,
      // or update the query cache directly.
      Object.keys(variables).forEach(key => {
        queryClient.invalidateQueries({ queryKey: ['setting', key] });
        // Optionally, update the cache directly if the response confirms the new value
        queryClient.setQueryData(['setting', key], variables[key]);
      });
    },
    onError: (error) => {
      sonnerToast.error(`Failed to save settings: ${error.message}`);
    }
  });

  const handleSaveApiKey = () => {
    // No trim check needed if we allow saving an empty key to clear it.
    // The PHP side will save it as an empty string.
    saveSettingsMutation.mutate({ [SETTING_KEY_GEMINI_API]: apiKey });
  };

  const handleClearApiKey = () => {
    setApiKey(''); // Clear local state
    saveSettingsMutation.mutate({ [SETTING_KEY_GEMINI_API]: '' }); // Save empty string to backend
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-gray-700" />
          API Key Management
        </CardTitle>
        <CardDescription>
          Manage your Google Gemini API Key. This key is required for AI features to function and is stored securely on your server.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="gemini-api-key">Google Gemini API Key</Label>
          <div className="flex items-center gap-2">
            <Input
              id="gemini-api-key"
              type={showApiKey ? 'text' : 'password'}
              placeholder={isLoadingApiKey ? "Loading API Key..." : "Enter your API key here"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-grow"
              disabled={isLoadingApiKey || saveSettingsMutation.isPending}
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
          <Button
            onClick={handleSaveApiKey}
            className="flex-1"
            disabled={saveSettingsMutation.isPending || isLoadingApiKey}
          >
            {saveSettingsMutation.isPending ? (
              <>
                <Save className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save API Key
              </>
            )}
          </Button>
          <Button
            onClick={handleClearApiKey}
            variant="outline"
            className="flex-1"
            disabled={saveSettingsMutation.isPending || isLoadingApiKey}
          >
            Clear API Key
          </Button>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-md text-sm flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0 text-blue-600" />
          <div>
            <strong>Security Note:</strong> Your API key is stored securely on your server via WordPress options.
            It is not exposed directly to the client-side application after being saved.
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
