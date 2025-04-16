// Atualização do componente NewEnsaio.tsx para incluir os tipos de ensaios específicos em português

// Constantes atualizadas para ensaios em português
const materialOptions = [
    'Betão', // Alterado de Concreto para Betão (português de Portugal)
    'Solo',
    'Aço',
    'Balastro',
    'Agregado',
    'Argamassa',
    'Asfalto',
    'Outro'
  ];
  
  // Tipos de ensaios atualizados para o contexto português
  const ensaioTypes = [
    {
      category: 'Betão',
      types: [
        { id: 'comp-betao', name: 'Compressão', norm: 'EN 12390-3' },
        { id: 'abat-betao', name: 'Abaixamento', norm: 'EN 12350-2' },
        { id: 'trac-betao', name: 'Tração por Compressão Diametral', norm: 'EN 12390-6' },
        { id: 'mod-betao', name: 'Módulo de Elasticidade', norm: 'EN 12390-13' },
        { id: 'dens-betao', name: 'Densidade', norm: 'EN 12390-7' }
      ]
    },
    {
      category: 'Solos',
      types: [
        { id: 'cbr-solo', name: 'CBR', norm: 'LNEC E 198' },
        { id: 'comp-solo', name: 'Compactação Proctor', norm: 'LNEC E 197' },
        { id: 'gran-solo', name: 'Granulometria', norm: 'LNEC E 196' },
        { id: 'lim-solo', name: 'Limites de Consistência', norm: 'NP 143' },
        { id: 'gama-solo', name: 'Controlo de Compactação (Gamadensímetro)', norm: 'ASTM D6938' },
        { id: 'placa-solo', name: 'Ensaio de Placa de Carga', norm: 'DIN 18134' }
      ]
    },
    {
      category: 'Agregados',
      types: [
        { id: 'gran-agreg', name: 'Análise Granulométrica', norm: 'EN 933-1' },
        { id: 'abs-agreg', name: 'Absorção de Água', norm: 'EN 1097-6' },
        { id: 'abr-agreg', name: 'Resistência ao Desgaste (Los Angeles)', norm: 'EN 1097-2' },
        { id: 'form-agreg', name: 'Índice de Forma', norm: 'EN 933-4' },
        { id: 'bal-agreg', name: 'Análise Granulométrica de Balastro', norm: 'EN 13450' }
      ]
    },
    {
      category: 'Aços e Metais',
      types: [
        { id: 'trac-aco', name: 'Tração', norm: 'EN ISO 6892-1' },
        { id: 'flex-aco', name: 'Flexão', norm: 'EN ISO 7438' },
        { id: 'dur-aco', name: 'Dureza', norm: 'EN ISO 6508' },
        { id: 'sold-aco', name: 'Ensaio de Soldadura', norm: 'EN ISO 17637' }
      ]
    },
    {
      category: 'Ensaios Não Destrutivos',
      types: [
        { id: 'ultra-end', name: 'Ultrassons', norm: 'EN 12504-4' },
        { id: 'escl-end', name: 'Esclerómetro', norm: 'EN 12504-2' },
        { id: 'mag-end', name: 'Partículas Magnéticas', norm: 'EN ISO 17638' },
        { id: 'rx-end', name: 'Radiografia', norm: 'EN ISO 17636-1' }
      ]
    },
    {
      category: 'Argamassas',
      types: [
        { id: 'flex-arg', name: 'Resistência à Flexão', norm: 'EN 1015-11' },
        { id: 'comp-arg', name: 'Resistência à Compressão', norm: 'EN 1015-11' },
        { id: 'ader-arg', name: 'Aderência', norm: 'EN 1015-12' },
        { id: 'abs-arg', name: 'Absorção de Água por Capilaridade', norm: 'EN 1015-18' }
      ]
    },
    {
      category: 'Geotecnia',
      types: [
        { id: 'triax-geo', name: 'Ensaio Triaxial', norm: 'ISO 17892-9' },
        { id: 'edeo-geo', name: 'Ensaio Edométrico', norm: 'ISO 17892-5' },
        { id: 'dens-geo', name: 'Densidade das Partículas', norm: 'ISO 17892-3' },
        { id: 'pene-geo', name: 'Penetrómetro Dinâmico', norm: 'ISO 22476-2' },
        { id: 'spt-geo', name: 'Ensaio SPT', norm: 'ISO 22476-3' }
      ]
    }
  ];
  
  // Definições de parâmetros por tipo de ensaio
  const ensaioParameters = {
    // Betão
    'comp-betao': {
      parameters: [
        { name: 'Resistência à Compressão', unit: 'MPa', min: '25', max: '40' },
        { name: 'Diâmetro do Provete', unit: 'mm' },
        { name: 'Altura do Provete', unit: 'mm' },
        { name: 'Idade', unit: 'dias' }
      ]
    },
    'abat-betao': {
      parameters: [
        { name: 'Abaixamento', unit: 'mm', min: '80', max: '120' },
        { name: 'Temperatura do Betão', unit: '°C', min: '15', max: '30' }
      ]
    },
    
    // Solos
    'cbr-solo': {
      parameters: [
        { name: 'Valor CBR', unit: '%', min: '10', max: '100' },
        { name: 'Expansão', unit: '%', min: '0', max: '2' },
        { name: 'Teor de Humidade Ótimo', unit: '%' },
        { name: 'Massa Volúmica Seca Máxima', unit: 'g/cm³' }
      ]
    },
    'gama-solo': {
      parameters: [
        { name: 'Grau de Compactação', unit: '%', min: '95', max: '100' },
        { name: 'Massa Volúmica Seca', unit: 'g/cm³' },
        { name: 'Teor de Humidade', unit: '%' },
        { name: 'Profundidade', unit: 'cm' }
      ]
    },
    'placa-solo': {
      parameters: [
        { name: 'Módulo de Deformabilidade (Ev2)', unit: 'MPa', min: '80', max: '120' },
        { name: 'Relação Ev2/Ev1', unit: '', min: '0', max: '2.2' },
        { name: 'Assentamento Máximo', unit: 'mm' }
      ]
    },
    
    // Agregados
    'gran-agreg': {
      parameters: [
        { name: 'Módulo de Finura', unit: '' },
        { name: 'Dimensão Máxima', unit: 'mm' },
        { name: 'Teor de Finos', unit: '%', min: '0', max: '5' }
      ]
    },
    'bal-agreg': {
      parameters: [
        { name: 'Categoria Granulométrica', unit: '' },
        { name: 'Percentagem Passada Peneiro 22,4mm', unit: '%' },
        { name: 'Percentagem Passada Peneiro 31,5mm', unit: '%' },
        { name: 'Percentagem Passada Peneiro 40mm', unit: '%' },
        { name: 'Percentagem Passada Peneiro 50mm', unit: '%' },
        { name: 'Percentagem Passada Peneiro 63mm', unit: '%' }
      ]
    },
    
    // Aços e Metais
    'trac-aco': {
      parameters: [
        { name: 'Tensão de Cedência', unit: 'MPa', min: '400', max: '600' },
        { name: 'Tensão de Rotura', unit: 'MPa', min: '500', max: '800' },
        { name: 'Alongamento', unit: '%', min: '12', max: '40' },
        { name: 'Relação Rm/Re', unit: '', min: '1.15', max: '1.35' }
      ]
    },
    'sold-aco': {
      parameters: [
        { name: 'Classificação de Defeitos', unit: '', min: '1', max: '3' },
        { name: 'Comprimento do Cordão', unit: 'mm' },
        { name: 'Altura do Cordão', unit: 'mm' },
        { name: 'Penetração', unit: 'mm', min: '0', max: '10' }
      ]
    },
    
    // Ensaios Não Destrutivos
    'ultra-end': {
      parameters: [
        { name: 'Velocidade de Propagação', unit: 'm/s', min: '3500', max: '5000' },
        { name: 'Distância de Medição', unit: 'mm' },
        { name: 'Tempo de Propagação', unit: 'μs' }
      ]
    },
    'escl-end': {
      parameters: [
        { name: 'Índice Esclerométrico', unit: '', min: '30', max: '50' },
        { name: 'Resistência Equivalente', unit: 'MPa' },
        { name: 'Número de Leituras', unit: '' }
      ]
    },
    
    // Argamassas
    'comp-arg': {
      parameters: [
        { name: 'Resistência à Compressão', unit: 'MPa', min: '5', max: '20' },
        { name: 'Dimensão do Provete', unit: 'mm' },
        { name: 'Idade', unit: 'dias' }
      ]
    },
    'ader-arg': {
      parameters: [
        { name: 'Tensão de Aderência', unit: 'MPa', min: '0.5', max: '2.0' },
        { name: 'Tipo de Ruptura', unit: '', min: 'A', max: 'C' }
      ]
    },
    
    // Geotecnia
    'triax-geo': {
      parameters: [
        { name: 'Coesão', unit: 'kPa' },
        { name: 'Ângulo de Atrito', unit: '°' },
        { name: 'Tensão de Confinamento', unit: 'kPa' },
        { name: 'Tensão de Desvio', unit: 'kPa' }
      ]
    },
    'spt-geo': {
      parameters: [
        { name: 'Número de Pancadas (N)', unit: '', min: '0', max: '50' },
        { name: 'Profundidade', unit: 'm' },
        { name: 'Valor N Corrigido', unit: '' }
      ]
    }
  };