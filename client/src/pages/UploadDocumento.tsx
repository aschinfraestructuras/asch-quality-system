import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useApp } from '../contexts/AppContext';

const UploadDocumento: React.FC = () => {
  const { showNotification, setIsLoading } = useApp();

  const [file, setFile] = useState<File | null>(null);
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [tipo, setTipo] = useState('');
  const [estado, setEstado] = useState('');
  const [obra, setObra] = useState('');

  const handleUpload = async () => {
    if (!file || !titulo || !autor || !tipo || !estado || !obra) {
      showNotification('⚠️ Preenche todos os campos!', 'error');
      return;
    }

    try {
      setIsLoading(true);
      
      // ✅ Caminho simples para gravar diretamente na raiz do bucket "documentos"
      const path = `${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('documentos')
        .upload(path, file);

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase
        .from('documentos')
        .insert([{
          titulo,
          tipo,
          estado,
          upload_de_dados: new Date().toISOString().split('T')[0],
          obra,
          autor,
          ficheiro_url: path // ✅ Só o nome do ficheiro, sem subpastas
        }]);

      if (insertError) throw insertError;

      showNotification('✅ Documento enviado e registado com sucesso!', 'success');

      // Reset dos campos
      setTitulo('');
      setAutor('');
      setTipo('');
      setEstado('');
      setObra('');
      setFile(null);
    } catch (err: any) {
      console.error(err);
      showNotification('❌ Erro ao enviar documento.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>📤 Enviar Documento</h2>

      <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
      <input type="text" placeholder="Autor" value={autor} onChange={(e) => setAutor(e.target.value)} />
      <input type="text" placeholder="Tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} />
      <input type="text" placeholder="Estado" value={estado} onChange={(e) => setEstado(e.target.value)} />
      <input type="text" placeholder="Obra" value={obra} onChange={(e) => setObra(e.target.value)} />
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} style={{ marginTop: '1rem' }} />

      <button onClick={handleUpload} style={{ marginTop: '1rem' }}>
        Submeter
      </button>
    </div>
  );
};

export default UploadDocumento;
