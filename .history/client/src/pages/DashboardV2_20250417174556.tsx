
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="dashboard-v2-empty-state">
                <i className="fas fa-box"></i>
                <p>Não existem materiais cadastrados</p>
                <Link to="/materiais/novo" className="dashboard-v2-btn-primary">
                  <i className="fas fa-plus"></i> Adicionar Material
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardV2;