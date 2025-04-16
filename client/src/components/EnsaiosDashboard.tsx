/* Estilos para a página de Visualização de Ensaio */

.view-ensaio-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .view-ensaio-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 30px;
  }
  
  .back-button-container {
    width: 80px;
  }
  
  .back-button {
    background-color: transparent;
    border: none;
    color: #3498db;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    padding: 0;
    display: flex;
    align-items: center;
  }
  
  .back-button {
    background-color: transparent;
    border: none;
    color: #3498db;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    padding: 0;
    display: flex;
    align-items: center;
  }
  
  .back-button:hover {
    color: #2980b9;
  }
  
  .ensaio-title-container {
    flex-grow: 1;
    text-align: center;
  }
  
  h1 {
    color: #2c3e50;
    font-size: 28px;
    margin: 0 0 8px 0;
  }
  
  .ensaio-subtitle {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
  }
  
  .ensaio-id {
    color: #7f8c8d;
    font-size: 14px;
  }
  
  .status-badge {
    display: inline-block;
    padding: 5px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    text-align: center;
  }
  
  .status-conforme {
    background-color: #27ae60;
    color: white;
  }
  
  .status-nao-conforme {
    background-color: #e74c3c;
    color: white;
  }
  
  .status-em-analise {
    background-color: #f39c12;
    color: white;
  }
  
  .status-pendente {
    background-color: #3498db;
    color: white;
  }
  
  .actions-container {
    display: flex;
    gap: 10px;
  }
  
  .edit-btn, .approve-btn, .print-btn {
    padding: 10px 15px;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    font-size: 14px;
    display: inline-block;
    text-align: center;
  }
  
  .edit-btn {
    background-color: #f1c40f;
    color: #333;
    border: none;
  }
  
  .approve-btn {
    background-color: #27ae60;
    color: white;
    border: none;
  }
  
  .print-btn {
    background-color: #ecf0f1;
    color: #2c3e50;
    border: none;
  }
  
  .edit-btn:hover {
    background-color: #f39c12;
  }
  
  .approve-btn:hover {
    background-color: #219653;
  }
  
  .print-btn:hover {
    background-color: #bdc3c7;
  }
  
  /* Informações do ensaio */
  .ensaio-info-container {
    margin-bottom: 30px;
  }
  
  .ensaio-overview {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .info-panel {
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
  
  .info-panel h2 {
    margin-top: 0;
    margin-bottom: 20px;
    color: #2c3e50;
    font-size: 20px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 15px;
  }
  
  .info-item {
    display: flex;
    margin-bottom: 10px;
  }
  
  .info-label {
    font-weight: 600;
    min-width: 150px;
    color: #7f8c8d;
  }
  
  .result-value {
    font-weight: 700;
    color: #2c3e50;
  }
  
  .description-panel {
    margin-top: 15px;
  }
  
  .description-panel h3 {
    margin-top: 0;
    margin-bottom: 10px;
    color: #2c3e50;
    font-size: 16px;
  }
  
  .equipment-panel {
    margin-top: 15px;
  }
  
  .equipment-panel h3 {
    margin-top: 0;
    margin-bottom: 10px;
    color: #2c3e50;
    font-size: 16px;
  }
  
  .equipment-list {
    list-style-type: none;
    padding-left: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 10px;
    margin: 0;
  }
  
  .equipment-list li {
    background-color: #f8f9fa;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 14px;
  }
  
  /* Tabs */
  .tabs-container {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }
  
  .tabs-header {
    display: flex;
    background-color: #f8f9fa;
    border-bottom: 1px solid #eee;
  }
  
  .tab-btn {
    padding: 15px 20px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    font-weight: 600;
    color: #7f8c8d;
    position: relative;
    transition: color 0.3s;
  }
  
  .tab-btn.active {
    color: #3498db;
  }
  
  .tab-btn.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #3498db;
  }
  
  .tab-btn:hover {
    color: #3498db;
  }
  
  .tab-content {
    padding: 30px;
  }
  
  /* Tab de Resultados */
  .results-tab h2 {
    margin-top: 0;
    margin-bottom: 20px;
    color: #2c3e50;
    font-size: 20px;
  }
  
  .results-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 30px;
  }
  
  .results-table th {
    background-color: #2c3e50;
    color: white;
    text-align: left;
    padding: 12px 15px;
    font-weight: 600;
  }
  
  .results-table td {
    padding: 12px 15px;
    border-bottom: 1px solid #eee;
  }
  
  .value-cell {
    font-weight: 700;
  }
  
  .conformity-cell {
    text-align: center;
  }
  
  .conformity-badge {
    display: inline-block;
    padding: 5px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
  }
  
  .conformity-badge.conform {
    background-color: #27ae60;
    color: white;
  }
  
  .conformity-badge.non-conform {
    background-color: #e74c3c;
    color: white;
  }
  
  .results-chart {
    margin-top: 30px;
  }
  
  .results-chart h3 {
    margin-top: 0;
    margin-bottom: 15px;
    color: #2c3e50;
    font-size: 18px;
  }
  
  .chart-placeholder {
    height: 300px;
    background-color: #f8f9fa;
    border: 1px dashed #bdc3c7;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
  }
  
  .placeholder-text {
    color: #7f8c8d;
    font-size: 18px;
  }
  
  /* Tab de Amostras */
  .samples-tab h2 {
    margin-top: 0;
    margin-bottom: 20px;
    color: #2c3e50;
    font-size: 20px;
  }
  
  .samples-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .sample-card {
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 20px;
  }
  
  .sample-header {
    margin-bottom: 15px;
  }
  
  .sample-header h3 {
    margin: 0;
    color: #2c3e50;
    font-size: 18px;
  }
  
  .sample-details {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .sample-detail {
    display: flex;
    flex-direction: column;
  }
  
  .detail-label {
    font-weight: 600;
    color: #7f8c8d;
    font-size: 14px;
    margin-bottom: 3px;
  }
  
  /* Tab de Histórico */
  .history-tab h2 {
    margin-top: 0;
    margin-bottom: 20px;
    color: #2c3e50;
    font-size: 20px;
  }
  
  .timeline {
    position: relative;
    padding-left: 30px;
  }
  
  .timeline::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 0;
    height: 100%;
    width: 2px;
    background-color: #bdc3c7;
  }
  
  .timeline-item {
    position: relative;
    margin-bottom: 25px;
  }
  
  .timeline-point {
    position: absolute;
    left: -30px;
    top: 5px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #3498db;
    z-index: 1;
  }
  
  .timeline-content {
    background-color: #f8f9fa;
    border-radius: 6px;
    padding: 15px;
  }
  
  .timeline-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }
  
  .activity-action {
    font-weight: 700;
    color: #2c3e50;
  }
  
  .activity-date {
    color: #7f8c8d;
    font-size: 14px;
  }
  
  .activity-user {
    color: #3498db;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .activity-details {
    color: #34495e;
    font-size: 14px;
  }
  
  /* Tab de Anexos */
  .attachments-tab h2 {
    margin-top: 0;
    margin-bottom: 20px;
    color: #2c3e50;
    font-size: 20px;
  }
  
  .attachments-tools {
    margin-bottom: 20px;
  }
  
  .add-attachment-btn {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
  }
  
  .add-attachment-btn:hover {
    background-color: #2980b9;
  }
  
  .attachments-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .attachment-item {
    display: flex;
    align-items: center;
    background-color: #f8f9fa;
    border-radius: 6px;
    padding: 15px;
  }
  
  .attachment-icon {
    width: 50px;
    height: 50px;
    background-color: #3498db;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    font-weight: 700;
    margin-right: 15px;
  }
  
  .attachment-info {
    flex-grow: 1;
  }
  
  .attachment-name {
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 5px;
  }
  
  .attachment-meta {
    font-size: 13px;
    color: #7f8c8d;
    display: flex;
    justify-content: space-between;
  }
  
  .attachment-actions {
    display: flex;
    gap: 10px;
  }
  
  .download-btn, .delete-btn {
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    border: none;
  }
  
  .download-btn {
    background-color: #3498db;
    color: white;
  }
  
  .delete-btn {
    background-color: #e74c3c;
    color: white;
  }
  
  .download-btn:hover {
    background-color: #2980b9;
  }
  
  .delete-btn:hover {
    background-color: #c0392b;
  }
  
  /* Modal de Aprovação */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .approval-modal {
    background-color: white;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    padding: 30px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .approval-modal h2 {
    margin-top: 0;
    margin-bottom: 20px;
    color: #2c3e50;
    font-size: 22px;
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;
  }
  
  .approval-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .approval-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 10px;
  }
  
  .reject-btn, .approve-btn, .cancel-btn {
    padding: 10px 20px;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    border: none;
  }
  
  .reject-btn {
    background-color: #e74c3c;
    color: white;
  }
  
  .approve-btn {
    background-color: #27ae60;
    color: white;
  }
  
  .cancel-btn {
    background-color: #ecf0f1;
    color: #2c3e50;
  }
  
  .reject-btn:hover {
    background-color: #c0392b;
  }
  
  .approve-btn:hover {
    background-color: #219653;
  }
  
  .cancel-btn:hover {
    background-color: #bdc3c7;
  }
  
  /* Loading e Not Found */
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    font-size: 18px;
    color: #7f8c8d;
  }
  
  .not-found-container {
    text-align: center;
    padding: 50px;
  }
  
  .not-found-container h2 {
    color: #2c3e50;
    margin-bottom: 15px;
  }
  
  .back-link {
    display: inline-block;
    margin-top: 20px;
    color: #3498db;
    text-decoration: none;
    font-weight: 600;
  }
  
  /* Responsividade */
  @media (max-width: 992px) {
    .view-ensaio-header {
      flex-direction: column;
      gap: 15px;
    }
    
    .back-button-container {
      width: 100%;
    }
    
    .ensaio-title-container {
      text-align: left;
    }
    
    .ensaio-subtitle {
      justify-content: flex-start;
    }
    
    .actions-container {
      width: 100%;
      justify-content: flex-start;
    }
    
    .info-grid {
      grid-template-columns: 1fr;
    }
    
    .equipment-list {
      grid-template-columns: 1fr;
    }
    
    .samples-grid {
      grid-template-columns: 1fr;
    }
  }
  
  @media (max-width: 768px) {
    .tabs-header {
      overflow-x: auto;
      white-space: nowrap;
      padding-bottom: 5px;
    }
    
    .tab-btn {
      padding: 12px 15px;
    }
    
    .tab-content {
      padding: 20px;
    }
    
    .attachment-item {
      flex-direction: column;
      gap: 15px;
      align-items: flex-start;
    }
    
    .attachment-actions {
      width: 100%;
      justify-content: flex-end;
    }
    
    .approval-buttons {
      flex-direction: column;
    }
  }