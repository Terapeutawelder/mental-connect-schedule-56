import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Secure database operations hook with error handling and improved type safety
 */
export const useSecureDatabase = () => {
  const { toast } = useToast();

  /**
   * Safely execute a database query with error handling
   */
  const safeQuery = async <T>(
    queryFn: () => Promise<{ data: T | null; error: any }>,
    operation: string = 'operação'
  ): Promise<T | null> => {
    try {
      const { data, error } = await queryFn();
      
      if (error) {
        console.error(`Database error in ${operation}:`, error);
        toast({
          title: "Erro de Conexão",
          description: `Falha ao executar ${operation}. Tente novamente.`,
          variant: "destructive",
        });
        return null;
      }
      
      return data;
    } catch (error) {
      console.error(`Unexpected error in ${operation}:`, error);
      toast({
        title: "Erro Inesperado",
        description: `Ocorreu um erro inesperado durante ${operation}.`,
        variant: "destructive",
      });
      return null;
    }
  };

  /**
   * Safely execute a query that returns multiple records
   */
  const safeQueryMany = async <T>(
    queryFn: () => Promise<{ data: T[] | null; error: any }>,
    operation: string = 'operação'
  ): Promise<T[] | null> => {
    try {
      const { data, error } = await queryFn();
      
      if (error) {
        console.error(`Database error in ${operation}:`, error);
        toast({
          title: "Erro de Conexão",
          description: `Falha ao executar ${operation}. Tente novamente.`,
          variant: "destructive",
        });
        return null;
      }
      
      return data || [];
    } catch (error) {
      console.error(`Unexpected error in ${operation}:`, error);
      toast({
        title: "Erro Inesperado",
        description: `Ocorreu um erro inesperado durante ${operation}.`,
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    safeQuery,
    safeQueryMany
  };
};