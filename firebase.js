// Importação dos módulos do Firebase (Versão Web Compatível)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCTNTSgggJZMBxyzj-jfjvFvOIolKyRmIg",
  authDomain: "territorios-campo-sba4.firebaseapp.com",
  databaseURL: "https://territorios-campo-sba4-default-rtdb.firebaseio.com",
  projectId: "territorios-campo-sba4",
  storageBucket: "territorios-campo-sba4.firebasestorage.app",
  messagingSenderId: "845307175979",
  appId: "1:845307175979:web:8f55b96aafd97e3240766e"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// 1. Função para salvar a quadra no Realtime Database
window.salvarQuadraFirebase = function (idUnico, dados) {
  set(ref(database, 'quadras/' + idUnico), dados)
    .then(() => {
      console.log("☁️ Dados sincronizados no Firebase para:", idUnico);
    })
    .catch((error) => {
      console.error("❌ Erro ao salvar no Firebase:", error);
    });
};

// 2. Escuta ativa em tempo real (Sincronização em tempo real)
const quadrasRef = ref(database, 'quadras/');

window.carregarQuadrasFirebase = function () {
  onValue(quadrasRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    Object.keys(data).forEach(idUnico => {
      const dadosNuvem = data[idUnico];

      // Atualiza o armazenamento local para manter suporte offline
      localStorage.setItem("quadra_data_" + idUnico, JSON.stringify(dadosNuvem));

      // Se a quadra já estiver carregada e desenhada no mapa, atualiza ela dinamicamente
      if (window.quadrasObjetos && window.quadrasObjetos[idUnico]) {
        const q = window.quadrasObjetos[idUnico];
        
        q.estado = dadosNuvem.estado || 0;
        q.anotacao = dadosNuvem.anotacao || "";
        q.autorAnotacao = dadosNuvem.autorAnotacao || "";
        q.dadosFacesSalvas = dadosNuvem.faces || [];

        // Atualiza a cor/estilo da quadra
        if (q.estado === 1 && window.estilos) {
          q.setStyle(window.estilos.amarelo);
        } else if (q.estado === 2 && window.estilos) {
          q.setStyle(window.estilos.verde);
          if (window.limparElementosVisuais) window.limparElementosVisuais(q);
        } else if (window.estilos) {
          q.setStyle(window.estilos.cinza);
          if (window.limparElementosVisuais) window.limparElementosVisuais(q);
        }

        // Restaura as faces no mapa se ela estiver aberta (estado 1)
        if (q.estado === 1 && window.restaurarFacesSalvas) {
          if (window.limparElementosVisuais) window.limparElementosVisuais(q);
          window.restaurarFacesSalvas(q);
        }

        if (q.atualizarRotulo) q.atualizarRotulo();
        if (window.atualizarStatusTerritorio) window.atualizarStatusTerritorio(q.idTerritorio);
      }
    });

    if (window.atualizarProgressoEIndicador) {
      window.atualizarProgressoEIndicador();
    }
  });
};

// 3. Comunicação com Kodular (se aplicável)
window.enviarAlertaParaKodular = function (mensagem) {
  if (window.AppInventor) {
    window.AppInventor.setWebViewString(JSON.stringify({
      tipo: "ALERTA",
      conteudo: mensagem
    }));
  }
};
