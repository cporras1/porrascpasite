import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type ValueTile = Database['public']['Tables']['value_tiles']['Row'];

export function useValueTiles() {
  const [valueTiles, setValueTiles] = useState<ValueTile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadValueTiles();
  }, []);

  const loadValueTiles = async () => {
    try {
      const { data, error } = await supabase
        .from('value_tiles')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setValueTiles(data || []);
    } catch (error) {
      console.error('Error loading value tiles:', error);
    } finally {
      setLoading(false);
    }
  };

  return { valueTiles, loading };
}
