// Alternar o modal do Painel ADM
window.abrirPainelADM = function() {
  document.getElementById("adm-modal").style.display = "flex";
};

window.fecharPainelADM = function() {
  document.getElementById("adm-modal").style.display = "none";
};

// Navegação por abas dentro do Painel ADM
window.trocarAbaADM = function(nomeAba) {
  const abas = document.querySelectorAll('.adm-section');
  const btns = document.querySelectorAll('.adm-tab-btn');

  abas.forEach(aba => aba.classList.remove('active'));
  btns.forEach(btn => btn.classList.remove('active'));

  document.getElementById('tab-' + nomeAba).classList.add('active');
  
  const btnAtivo = Array.from(btns).find(b => b.getAttribute('onclick').includes(nomeAba));
  if (btnAtivo) btnAtivo.classList.add('active');
};

// Renderiza a lista de usuários cadastrados e controle de cargos
window.renderizarUsuariosADM = function(usuariosObj) {
  const container = document.getElementById("container-usuarios");
  if (!container) return;

  if (!usuariosObj) {
    container.innerHTML = "<p style='color:#a0aec0;'>Nenhum usuário cadastrado até o momento.</p>";
    return;
  }

  let html = "";
  Object.keys(usuariosObj).forEach(key => {
    const u = usuariosObj[key];
    const ehAdmin = u.cargo === 'admin';
    const nomeExibicao = u.nome || key;
    
    html += `
      <div class="user-card">
        <div>
          <strong style="font-size:16px;">${nomeExibicao}</strong><br>
          <small style="color:#a0aec0;">Cargo: ${u.cargo || 'publicador'}</small>
        </div>
        <select onchange="window.salvarCargoUsuario('${key}', this.value)">
          <option value="publicador" ${!ehAdmin ? 'selected' : ''}>Publicador</option>
          <option value="admin" ${ehAdmin ? 'selected' : ''}>Administrador</option>
        </select>
      </div>
    `;
  });

  container.innerHTML = html;
};

// Renderiza o formulário da escala semanal de dirigentes
window.renderizarEscalaADM = function(escalaObj) {
  const container = document.getElementById("container-escala");
  if (!container) return;

  const diasSemana = [
    { id: 'segunda', nome: 'Segunda-feira' },
    { id: 'terca', nome: 'Terça-feira' },
    { id: 'quarta', nome: 'Quarta-feira' },
    { id: 'quinta', nome: 'Quinta-feira' },
    { id: 'sexta', nome: 'Sexta-feira' },
    { id: 'sabado', nome: 'Sábado' },
    { id: 'domingo', nome: 'Domingo' }
  ];

  const dadosEscala = escalaObj || {};

  let html = `<form id="form-escala-adm" onsubmit="event.preventDefault(); window.salvarEscalaForm();">`;

  diasSemana.forEach(dia => {
    const dirigenteAtual = dadosEscala[dia.id] || "";
    html += `
      <div class="escala-row">
        <span><strong>${dia.nome}</strong></span>
        <input type="text" id="escala-input-${dia.id}" value="${dirigenteAtual}" placeholder="Nome do Dirigente" style="background:#1a202c; color:white; border:1px solid #4a5568; padding:8px; border-radius:6px; font-size:15px; width:55%;">
      </div>
    `;
  });

  html += `
    <button type="submit" style="background:#2b6cb0; color:white; border:none; padding:14px; border-radius:10px; font-weight:bold; width:100%; font-size:16px; margin-top:10px; cursor:pointer;">
      💾 Salvar Escala Semanal
    </button>
  </form>`;

  container.innerHTML = html;
};

// Coleta e salva os dados da escala preenchida
window.salvarEscalaForm = function() {
  const dias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
  const novaEscala = {};

  dias.forEach(dia => {
    const el = document.getElementById(`escala-input-${dia}`);
    if (el) {
      novaEscala[dia] = el.value.trim();
    }
  });

  if (typeof window.salvarEscalaSemanal === 'function') {
    window.salvarEscalaSemanal(novaEscala);
    if (typeof window.mostrarToast === 'function') {
      window.mostrarToast("📅 Escala atualizada com sucesso!");
    } else {
      alert("Escala salva com sucesso!");
    }
  }
};
