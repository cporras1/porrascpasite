import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type SiteSettings = Database['public']['Tables']['site_settings']['Row'];

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .maybeSingle();

      if (!error && data) {
        setSettings(data);
      }
      setLoading(false);
    }

    fetchSettings();

    const channel = supabase
      .channel('site_settings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => {
        fetchSettings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { settings, loading };
}
