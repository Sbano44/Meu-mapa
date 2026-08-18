// Importações do SDK v10 do Firebase para a WEB via CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Configuração do seu aplicativo Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCTNTSgggJZMBxyzj-jfjvFvOIolKyRmIg",
  authDomain: "territorios-campo-sba4.firebaseapp.com",
  databaseURL: "https://territorios-campo-sba4-default-rtdb.firebaseio.com",
  projectId: "territorios-campo-sba4",
  storageBucket: "territorios-campo-sba4.firebasestorage.app",
  messagingSenderId: "845307175979",
  appId: "1:845307175979:web:8f55b96aafd97e3240766e"
};

// Inicialização do Firebase e Banco em Tempo Real
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/**
 * 1. Função para SALVAR alterações na nuvem.
 * Chamada pelo HTML sempre que o estado da quadra, nota ou face muda.
 */
window.salvarQuadraNuvem = function(idUnico, payload) {
  if (!idUnico) return;
  
  set(ref(db, 'quadras/' + idUnico), payload)
    .then(() => {
      console.log("Dados sincronizados com o Firebase:", idUnico);
    })
    .catch((error) => {
      console.error("Erro ao salvar no Firebase:", error);
    });
};

/**
 * 2. Listener em tempo real (ESCUTADOR).
 * Qualquer alteração dispara este trecho e atualiza o mapa em todas as telas conectadas.
 */
onValue(ref(db, 'quadras'), (snapshot) => {
  const data = snapshot.val();
  
  // Envia os dados sincronizados para a função do HTML
  if (typeof window.atualizarMapaLocal === 'function') {
    window.atualizarMapaLocal(data);
  }
}, (error) => {
  console.error("Erro ao escutar mudanças no Firebase:", error);
});

/**
 * 3. Ponte de notificação com o Kodular (WebViewString)
 */
window.enviarAlertaParaKodular = function(mensagem) {
  if (window.AppInventor && typeof window.AppInventor.setWebViewString === 'function') {
    window.AppInventor.setWebViewString(mensagem);
  }
};
