import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type HeroContent = Database['public']['Tables']['hero_content']['Row'];

export function useHeroContent() {
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHeroContent();
  }, []);

  const loadHeroContent = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setHeroContent(data);
    } catch (error) {
      console.error('Error loading hero content:', error);
    } finally {
      setLoading(false);
    }
  };

  return { heroContent, loading };
}
