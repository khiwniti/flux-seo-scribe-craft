import React from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SEODashboard from './components/SEODashboard';
import './index.css';

// Disable service workers in WordPress environment
console.log('🔧 FluxSEO: Checking for service workers to disable...');
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    if (registrations.length > 0) {
      console.log('🚫 FluxSEO: Found', registrations.length, 'service worker(s), unregistering...');
      for(let registration of registrations) {
        console.log('🚫 Unregistering service worker:', registration.scope);
        registration.unregister();
      }
    } else {
      console.log('✅ FluxSEO: No service workers found to unregister');
    }
  });
} else {
  console.log('ℹ️ FluxSEO: Service workers not supported in this browser');
}

// Configure QueryClient with better defaults for WordPress
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: 1000,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (replaces deprecated cacheTime)
      refetchOnWindowFocus: false,
    },
  },
});

// WordPress-compatible App component (no BrowserRouter)
const WordPressApp = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <SEODashboard />
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

// Global function to initialize the app
declare global {
  interface Window {
    FluxSEOApp: {
      init: (containerId?: string) => void;
      render: (containerId?: string) => void;
      component: React.ComponentType;
    };
  }
}

// WordPress integration object
window.FluxSEOApp = {
  component: WordPressApp,
  render: (containerId = 'root') => {
    window.FluxSEOApp.init(containerId);
  },
  init: (containerId = 'root') => {
    console.log('🚀 FluxSEOApp.init called with containerId:', containerId);
    console.log('🔍 Current window.FluxSEOApp:', window.FluxSEOApp);
    
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('❌ FluxSEOApp: Container element not found:', containerId);
      console.log('📋 Available elements with IDs:', Array.from(document.querySelectorAll('[id]')).map(el => el.id));
      return;
    }

    console.log('✅ FluxSEOApp: Container found:', container);

    // Check if already mounted
    if (container.dataset.fluxSeoMounted === 'true') {
      console.warn('⚠️ FluxSEOApp: Already mounted on this container');
      return;
    }

    try {
      console.log('🎯 FluxSEOApp: Creating React root and rendering...');
      const root = createRoot(container);
      root.render(React.createElement(WordPressApp));
      container.dataset.fluxSeoMounted = 'true';
      console.log('🎉 FluxSEOApp: Successfully mounted');
      
      // Dispatch a custom event to notify that the app is ready
      window.dispatchEvent(new CustomEvent('fluxSeoAppReady', { 
        detail: { containerId, timestamp: Date.now() } 
      }));
    } catch (error) {
      console.error('💥 FluxSEOApp: Error mounting app:', error);
      console.error('📊 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      container.innerHTML = `
        <div style="padding: 20px; border: 2px solid #dc3545; border-radius: 8px; background: #f8d7da; color: #721c24;">
          <h3>⚠️ Application Error</h3>
          <p>Failed to load the SEO application.</p>
          <p><strong>Error:</strong> ${error instanceof Error ? error.message : 'Unknown error'}</p>
          <details style="margin-top: 10px;">
            <summary>Technical Details</summary>
            <pre style="background: #fff; padding: 10px; border-radius: 4px; overflow: auto; font-size: 12px;">${error instanceof Error ? error.stack : 'No stack trace available'}</pre>
          </details>
          <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Refresh Page
          </button>
        </div>
      `;
    }
  }
};

// Immediately log that the script is loading
console.log('📦 FluxSEOApp script loaded, window.FluxSEOApp available:', !!window.FluxSEOApp);

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('FluxSEOApp: DOM ready, checking for root element...');
  const rootElement = document.getElementById('root');
  if (rootElement) {
    window.FluxSEOApp.init();
  }
});

// Also listen for custom initialization events
window.addEventListener('fluxSeoInit', (event: CustomEvent) => {
  console.log('FluxSEOApp: Custom init event received:', event.detail);
  const containerId = event.detail?.containerId || 'root';
  window.FluxSEOApp.init(containerId);
});

export default WordPressApp;
