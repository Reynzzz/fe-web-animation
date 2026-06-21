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
    } catch (err: any) {
      setError(err.message || 'Failed to load content');
      console.error(err);
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
