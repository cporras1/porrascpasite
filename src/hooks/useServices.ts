import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Service = Database['public']['Tables']['services']['Row'];

export function useServices(category?: string) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      let query = supabase
        .from('services')
        .select('*')
        .order('display_order');

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (!error && data) {
        setServices(data);
      }
      setLoading(false);
    }

    fetchServices();
  }, [category]);

  return { services, loading };
}

export function useFeaturedServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_featured', true)
        .order('display_order')
        .limit(6);

      if (!error && data) {
        setServices(data);
      }
      setLoading(false);
    }

    fetchServices();
  }, []);

  return { services, loading };
}
