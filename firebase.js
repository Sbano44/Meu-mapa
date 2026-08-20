import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, onValue, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCTNTSgggJZMBxyzj-jfjvFvOIolKyRmIg",
  authDomain: "territorios-campo-sba4.firebaseapp.com",
  databaseURL: "https://territorios-campo-sba4-default-rtdb.firebaseio.com",
  projectId: "territorios-campo-sba4",
  storageBucket: "territorios-campo-sba4.firebasestorage.app",
  messagingSenderId: "845307175979",
  appId: "1:845307175979:web:8f55b96aafd97e3240766e"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

window.verificarPermissaoADM = function(nomeUsuario) {
  if (!nomeUsuario) return;

  get(ref(db, 'administradores')).then((snapshot) => {
    if (snapshot.exists()) {
      const adms = snapshot.val();
      // Verifica se o nome digitado existe no nó de administradores (independente de maiúsculas/minúsculas)
      const ehAdmin = Object.keys(adms).some(nome => nome.toLowerCase() === nomeUsuario.trim().toLowerCase() && adms[nome] === true);
      
      if (typeof window.aplicarPermissoesADM === 'function') {
        window.aplicarPermissoesADM(ehAdmin);
      }
    } else {
      if (typeof window.aplicarPermissoesADM === 'function') {
        window.aplicarPermissoesADM(false);
      }
    }
  }).catch((error) => {
    console.error("Erro ao verificar permissão de ADM:", error);
    if (typeof window.aplicarPermissoesADM === 'function') {
      window.aplicarPermissoesADM(false);
    }
  });
};

window.resetarTodasQuadrasNuvem = function() {
  set(ref(db, 'quadras'), null)
    .then(() => {
      console.log("Todas as quadras foram resetadas no Firebase.");
    })
    .catch((error) => {
      console.error("Erro ao resetar quadras no Firebase:", error);
    });
};

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

onValue(ref(db, 'quadras'), (snapshot) => {
  const data = snapshot.val();
  if (typeof window.atualizarMapaLocal === 'function') {
    window.atualizarMapaLocal(data);
  }
}, (error) => {
  console.error("Erro ao escutar mudanças no Firebase:", error);
});

window.enviarAlertaParaKodular = function(mensagem) {
  if (window.AppInventor && typeof window.AppInventor.setWebViewString === 'function') {
    window.AppInventor.setWebViewString(mensagem);
  }
};
