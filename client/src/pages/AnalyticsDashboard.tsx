import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import ProjetosChart from '../components/dashboard/charts/ProjetosChart';
import DocumentosChart from '../components/dashboard/charts/DocumentosChart';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState({
    projetosEmCurso: 0,
    projetosConcluidos: 0,
    projetosSuspensos: 0,
    documentosTotal: 0
  });
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        
        // Buscar estatísticas de projetos
        const { data: projetos, error: projetosError } = await supabase
          .from('projetos')
          .select('estado');
        
        if (projetosError) throw projetosError;
        
        // Buscar estatísticas de documentos
        const { count: documentosCount, error: documentosError } = await supabase
          .from('documentos')
          .select('*', { count: 'exact', head: true });
        
        if (documentosError) throw documentosError;
        
        // Processar dados
        const emCurso = projetos?.filter(p => p.estado === 'em curso').length || 0;
        const concluidos = projetos?.filter(p => p.estado === 'concluido').length || 0;
        const suspensos = projetos?.filter(p => p.estado === 'suspenso').length || 0;
        
        setStats({
          projetosEmCurso: emCurso,
          projetosConcluidos: concluidos,
          projetosSuspensos: suspensos,
          documentosTotal: documentosCount || 0
        });
      } catch (error) {
        console.error('Erro ao buscar dados analíticos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, []);
  
  if (loading) return <div className="loading">A carregar dados analíticos...</div>;
  
  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1>Dashboard Analítico</h1>
      </div>
      
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-title">Projetos em Curso</div>
          <div className="stat-value">{stats.projetosEmCurso}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-title">Projetos Concluídos</div>
          <div className="stat-value">{stats.projetosConcluidos}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-title">Projetos Suspensos</div>
          <div className="stat-value">{stats.projetosSuspensos}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-title">Total de Documentos</div>
          <div className="stat-value">{stats.documentosTotal}</div>
        </div>
      </div>
      
      <div className="charts-container">
        <div className="chart-card">
          <div className="chart-title">Distribuição de Projetos</div>
          <div className="chart">
            <ProjetosChart />
          </div>
        </div>
        
        <div className="chart-card">
          <div className="chart-title">Documentos por Tipo</div>
          <div className="chart">
            <DocumentosChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;