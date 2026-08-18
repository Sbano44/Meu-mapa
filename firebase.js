// Importação dos módulos do Firebase (Versão Web Compatível)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Suas chaves de configuração do Firebase
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

// Função para salvar o estado de uma quadra na nuvem
window.salvarQuadraNuvem = function (quadraId, dados) {
  set(ref(database, 'quadras/' + quadraId), dados)
    .then(() => {
      console.log("Dados sincronizados com sucesso!");
    })
    .catch((error) => {
      console.error("Erro ao salvar na nuvem:", error);
    });
};

// Escuta mudanças em tempo real na nuvem
const quadrasRef = ref(database, 'quadras/');
onValue(quadrasRef, (snapshot) => {
  const data = snapshot.val();
  if (data && window.atualizarMapaLocal) {
    // Atualiza as cores e estados no mapa HTML
    window.atualizarMapaLocal(data);
  }
});

// Função para enviar alertas/notificações para o Kodular
window.enviarAlertaParaKodular = function (mensagem) {
  if (window.AppInventor) {
    // Envia o texto da notificação direto para os blocos do Kodular
    window.AppInventor.setWebViewString(JSON.stringify({
      tipo: "ALERTA",
      conteudo: mensagem
    }));
  }
};