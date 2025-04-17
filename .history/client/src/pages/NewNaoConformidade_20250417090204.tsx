/* Estilos para o componente de Nova Não Conformidade */
.new-nao-conformidade {
    padding: 20px;
  }
  
  .new-nao-conformidade h2 {
    margin-bottom: 25px;
    color: #2c3e50;
    font-weight: 600;
  }
  
  /* Stepper (etapas) */
  .stepper {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    padding: 0 10px;
  }
  
  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
  }
  
  .step-number {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #ecf0f1;
    color: #7f8c8d;
    font-weight: bold;
    margin-bottom: 8px;
    transition: all 0.3s ease;
  }
  
  .step.active .step-number {
    background-color: #3498db;
    color: white;
  }
  
  .step-title {
    font-size: 13px;
    color: #7f8c8d;
    font-weight: 500;
    transition: color 0.3s ease;
  }
  
  .step.active .step-title {
    color: #3498db;
    font-weight: 600;
  }
  
  .step-line {
    flex-grow: 1;
    height: 2px;
    background-color: #ecf0f1;
    margin: 0 -5px;
    margin-bottom: 25px;
    transition: background-color 0.3s ease;
  }
  
  .step-line.active {
    background-color: #3498db;
  }
  
  /* Conteúdo do formulário */
  .form-step {
    margin-bottom: 20px;
  }
  
  .form-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
  }
  
  .btn-voltar,
  .btn-continuar,
  .btn-cancelar,
  .btn-registar {
    padding: 10px 20px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
  }