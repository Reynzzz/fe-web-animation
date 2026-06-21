import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchSiteContent, fetchProjects } from '@/lib/api';

export type SiteContentState = {
  settings: Record<string, any>;
  items: Record<string, any[]>;
  projects: any[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const SiteContentContext = createContext<SiteContentState | null>(null);

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [items, setItems] = useState<Record<string, any[]>>({});
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [content, proj] = await Promise.all([
        fetchSiteContent(),
        fetchProjects(),
      ]);
      setSettings(content.settings || {});
      setItems(content.items || {});
      setProjects(proj || []);

      // Signal to LoadingScreen that content is ready
      (window as any).__siteContentReady = true;
      window.dispatchEvent(new Event('site-content-ready'));
    } catch (err: any) {
      setError(err.message || 'Failed to load content');
      console.error(err);

      // Even on error, signal readiness so LoadingScreen doesn't hang forever
      (window as any).__siteContentReady = true;
      window.dispatchEvent(new Event('site-content-ready'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <SiteContentContext.Provider
      value={{ settings, items, projects, loading, error, refresh }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    throw new Error('useSiteContent must be used within SiteContentProvider');
  }
  return ctx;
}
