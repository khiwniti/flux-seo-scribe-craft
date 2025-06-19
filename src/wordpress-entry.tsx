import React from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SEODashboard from './components/SEODashboard';
import './index.css';

const queryClient = new QueryClient();

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
    console.log('FluxSEOApp.init called with containerId:', containerId);
    
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('FluxSEOApp: Container element not found:', containerId);
      return;
    }

    // Check if already mounted
    if (container.dataset.fluxSeoMounted === 'true') {
      console.warn('FluxSEOApp: Already mounted on this container');
      return;
    }

    try {
      console.log('FluxSEOApp: Creating React root and rendering...');
      const root = createRoot(container);
      root.render(React.createElement(WordPressApp));
      container.dataset.fluxSeoMounted = 'true';
      console.log('FluxSEOApp: Successfully mounted');
    } catch (error) {
      console.error('FluxSEOApp: Error mounting app:', error);
      container.innerHTML = `
        <div style="padding: 20px; border: 2px solid #dc3545; border-radius: 8px; background: #f8d7da; color: #721c24;">
          <h3>⚠️ Application Error</h3>
          <p>Failed to load the SEO application.</p>
          <p><strong>Error:</strong> ${error instanceof Error ? error.message : 'Unknown error'}</p>
          <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Refresh Page
          </button>
        </div>
      `;
    }
  }
};

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