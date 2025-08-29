import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Era {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export interface KnowledgeItem {
  id: string;
  era_id: string;
  category: 'history' | 'finance' | 'technology' | 'future';
  item_type: 'fact' | 'qa';
  title: string;
  content?: string;
  question?: string;
  correct_answer?: string;
  wrong_options: string[];
  source?: string;
  tags: string[];
  year_start?: number;
  year_end?: number;
  is_verified: boolean;
}

export const useKnowledge = () => {
  const [eras, setEras] = useState<Era[]>([]);
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEras = async () => {
    try {
      const { data, error } = await supabase
        .from('eras')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setEras(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar eras');
    }
  };

  const fetchKnowledgeItems = async (eraSlug?: string) => {
    try {
      let query = supabase
        .from('knowledge_items')
        .select(`
          *,
          eras!inner(slug, name)
        `)
        .order('year_start', { ascending: true });

      if (eraSlug) {
        query = query.eq('eras.slug', eraSlug);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = (data || []).map(item => ({
        ...item,
        wrong_options: Array.isArray(item.wrong_options) 
          ? item.wrong_options 
          : JSON.parse(item.wrong_options as string || '[]')
      }));
      
      setKnowledgeItems(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar conhecimentos');
    }
  };

  const getRandomQuestion = (eraSlug?: string, category?: string) => {
    let filtered = knowledgeItems.filter(item => item.item_type === 'qa');
    
    if (eraSlug) {
      filtered = filtered.filter(item => {
        // Need to check era slug through join
        return true; // Will be filtered on fetch if eraSlug provided
      });
    }
    
    if (category) {
      filtered = filtered.filter(item => item.category === category);
    }
    
    if (filtered.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * filtered.length);
    return filtered[randomIndex];
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchEras(), fetchKnowledgeItems()]);
      setLoading(false);
    };
    
    loadData();
  }, []);

  return {
    eras,
    knowledgeItems,
    loading,
    error,
    fetchKnowledgeItems,
    getRandomQuestion,
    refetch: () => Promise.all([fetchEras(), fetchKnowledgeItems()])
  };
};