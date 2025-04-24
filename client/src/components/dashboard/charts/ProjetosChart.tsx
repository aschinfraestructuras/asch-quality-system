import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { supabase } from '../../../services/supabaseClient';

ChartJS.register(ArcElement, Tooltip, Legend);

const ProjetosChart = () => {
  const [chartData, setChartData] = useState({
    labels: ['Em Curso', 'Concluídos', 'Suspensos'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('projetos')
          .select('estado');

        if (error) throw error;

        if (data) {
          const emCurso = data.filter(p => p.estado === 'em curso').length;
          const concluidos = data.filter(p => p.estado === 'concluido').length;
          const suspensos = data.filter(p => p.estado === 'suspenso').length;

          setChartData(prev => ({
            ...prev,
            datasets: [
              {
                ...prev.datasets[0],
                data: [emCurso, concluidos, suspensos]
              }
            ]
          }));
        }
      } catch (error) {
        console.error('Erro ao carregar dados para o gráfico:', error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: false, // título desativado para usar título externo
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default ProjetosChart;
