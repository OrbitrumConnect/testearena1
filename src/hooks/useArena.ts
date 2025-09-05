import { useState, useEffect } from "react";
import { supabase } from "../integrations/supabase/client";

interface Question {
  id: string;
  era: string;
  question: string;
  options: string[];
  answer: string;
}

interface Transaction {
  id: string;
  user_id: string;
  transaction_type: string;
  amount: number;
  description: string;
  battle_id?: string;
  created_at: string;
}

interface UseArenaResult {
  questions: Question[];
  transactions: Transaction[];
  totalCredits: number;
  loading: boolean;
  error: string | null;
}

export const useArena = (userId: string, era: string, numQuestions: number = 10): UseArenaResult => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArenaData = async () => {
      setLoading(true);
      setError(null);

      try {
        // --- BUSCA PERGUNTAS ---
        const { data: questionsData, error: questionsError } = await supabase
          .from<Question>("questions")
          .select("*")
          .eq("era", era);

        if (questionsError) {
          console.warn("Erro ao buscar perguntas:", questionsError);
          // Fallback: usar perguntas demo se não encontrar
          const demoQuestions: Question[] = [
            {
              id: "demo-1",
              era: era,
              question: `Pergunta demo para ${era}`,
              options: ["Opção A", "Opção B", "Opção C", "Opção D"],
              answer: "Opção A"
            }
          ];
          setQuestions(demoQuestions);
        } else {
          // Seleciona aleatoriamente o número desejado de perguntas
          const shuffled = questionsData.sort(() => 0.5 - Math.random());
          setQuestions(shuffled.slice(0, numQuestions));
        }

        // --- BUSCA TRANSAÇÕES ---
        const { data: transactionsData, error: transactionsError } = await supabase
          .from<Transaction>("wallet_transactions")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (transactionsError) {
          console.warn("Erro ao buscar transações:", transactionsError);
          
          // Fallback: usar transações demo se não encontrar
          const demoTransactions: Transaction[] = [
            { id: '1', user_id: userId, transaction_type: 'credit', amount: 1.5, description: 'Participação - Egito Antigo', created_at: new Date().toISOString() },
            { id: '2', user_id: userId, transaction_type: 'credit', amount: 2.0, description: 'Participação - Mesopotâmia', created_at: new Date().toISOString() },
            { id: '3', user_id: userId, transaction_type: 'credit', amount: 4.5, description: 'Vitória - Era Medieval', created_at: new Date().toISOString() },
            { id: '4', user_id: userId, transaction_type: 'credit', amount: 5.0, description: 'Vitória - Era Digital', created_at: new Date().toISOString() },
            { id: '5', user_id: userId, transaction_type: 'credit', amount: 2.0, description: 'Participação - Arena - Egito Antigo', created_at: new Date().toISOString() }
          ];
          setTransactions(demoTransactions);
          
          // Calcular total dos dados demo
          const total = demoTransactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
          setTotalCredits(total);
        } else {
          setTransactions(transactionsData || []);
          
          // --- CALCULA TOTAL DE CRÉDITOS ---
          const total = (transactionsData || []).reduce((sum, tx) => sum + Number(tx.amount), 0);
          setTotalCredits(total);
        }

      } catch (err: any) {
        console.error("Erro no hook useArena:", err.message);
        setError(err.message);

        // Fallback: dados demo
        const demoQuestions: Question[] = [
          {
            id: "demo-1",
            era: era,
            question: `Pergunta demo para ${era}`,
            options: ["Opção A", "Opção B", "Opção C", "Opção D"],
            answer: "Opção A"
          }
        ];
        
        const demoTransactions: Transaction[] = [
          { id: '1', user_id: userId, transaction_type: 'credit', amount: 1.5, description: 'Participação - Egito Antigo', created_at: new Date().toISOString() },
          { id: '2', user_id: userId, transaction_type: 'credit', amount: 2.0, description: 'Participação - Mesopotâmia', created_at: new Date().toISOString() },
          { id: '3', user_id: userId, transaction_type: 'credit', amount: 4.5, description: 'Vitória - Era Medieval', created_at: new Date().toISOString() },
          { id: '4', user_id: userId, transaction_type: 'credit', amount: 5.0, description: 'Vitória - Era Digital', created_at: new Date().toISOString() },
          { id: '5', user_id: userId, transaction_type: 'credit', amount: 2.0, description: 'Participação - Arena - Egito Antigo', created_at: new Date().toISOString() }
        ];
        
        setQuestions(demoQuestions);
        setTransactions(demoTransactions);
        setTotalCredits(15.0); // Total dos dados demo
      } finally {
        setLoading(false);
      }
    };

    // Só roda se o userId for UUID válido
    if (userId && /^[0-9a-fA-F-]{36}$/.test(userId)) {
      fetchArenaData();
    } else {
      setError("UUID do usuário inválido");
      setLoading(false);
    }
  }, [userId, era, numQuestions]);

  return { questions, transactions, totalCredits, loading, error };
};