import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TabelaNCs = () => {
  const [dados, setDados] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  const AIRTABLE_API_KEY = 'SUA_API_KEY';
  const BASE_ID = 'SUA_BASE_ID';
  const TABELA = 'NCs'; // nome da tua tabela no Airtable

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://api.airtable.com/v0/${BASE_ID}/${TABELA}`, {
          headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          },
        });
        setDados(res.data.records);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    fetchData();
  }, []);

  const dadosFiltrados = dados.filter((item) => {
    const tipo = item.fields['TIPO NC'] || '';
    const estado = item.fields['NC ABERTA/FECHADA/ENCERRADA'] || '';
    return (
      (filtroTipo === '' || tipo === filtroTipo) &&
      (filtroEstado === '' || estado === filtroEstado)
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Lista de NCs (dados reais)</h2>

      <div className="flex gap-4 mb-4">
        <select onChange={(e) => setFiltroTipo(e.target.value)} className="border p-2">
          <option value="">Filtrar por Tipo</option>
          <option value="MAIOR">MAIOR</option>
          <option value="MENOR">MENOR</option>
          <option value="OBSERVAÇÃO">OBSERVAÇÃO</option>
        </select>

        <select onChange={(e) => setFiltroEstado(e.target.value)} className="border p-2">
          <option value="">Filtrar por Estado</option>
          <option value="ABERTA">ABERTA</option>
          <option value="FECHADA">FECHADA</option>
          <option value="ENCERRADA">ENCERRADA</option>
        </select>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2 border">Nº</th>
            <th className="p-2 border">Data</th>
            <th className="p-2 border">Zona</th>
            <th className="p-2 border">Descrição</th>
            <th className="p-2 border">Tipo</th>
            <th className="p-2 border">Estado</th>
            <th className="p-2 border">Responsável</th>
          </tr>
        </thead>
        <tbody>
          {dadosFiltrados.map((item, idx) => (
            <tr key={item.id} className="hover:bg-gray-100">
              <td className="p-2 border">{item.fields['Nº NC']}</td>
              <td className="p-2 border">{item.fields['DATA DO REGISTRO']}</td>
              <td className="p-2 border">{item.fields['LOCAL DA NC']}</td>
              <td className="p-2 border">{item.fields['DESCRIÇÃO NC']}</td>
              <td className="p-2 border">{item.fields['TIPO NC']}</td>
              <td className="p-2 border">{item.fields['NC ABERTA/FECHADA/ENCERRADA']}</td>
              <td className="p-2 border">{item.fields['RESP']}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TabelaNCs;
