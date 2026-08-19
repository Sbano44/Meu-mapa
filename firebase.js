import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";[cite: 1]
import { getDatabase, ref, set, onValue, get } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";[cite: 1]

const firebaseConfig = {[cite: 1]
  apiKey: "AIzaSyCTNTSgggJZMBxyzj-jfjvFvOIolKyRmIg",[cite: 1]
  authDomain: "territorios-campo-sba4.firebaseapp.com",[cite: 1]
  databaseURL: "https://territorios-campo-sba4-default-rtdb.firebaseio.com",[cite: 1]
  projectId: "territorios-campo-sba4",[cite: 1]
  storageBucket: "territorios-campo-sba4.firebasestorage.app",[cite: 1]
  messagingSenderId: "845307175979",[cite: 1]
  appId: "1:845307175979:web:8f55b96aafd97e3240766e"[cite: 1]
};[cite: 1]

const app = initializeApp(firebaseConfig);[cite: 1]
const db = getDatabase(app);[cite: 1]

window.verificarPermissaoADM = function(nomeUsuario) {[cite: 1]
  if (!nomeUsuario) return;[cite: 1]
  
  const idFormatado = nomeUsuario.trim().replace(/[.#$\[\]]/g, "_");[cite: 1]

  get(ref(db, 'administradores/' + idFormatado)).then((snapshot) => {[cite: 1]
    const val = snapshot.val();
    // Aceita true booleano, string "true" ou número 1
    const ehAdmin = snapshot.exists() && (val === true || val === "true" || val === 1);[cite: 1]
    
    if (typeof window.aplicarPermissoesADM === 'function') {[cite: 1]
      window.aplicarPermissoesADM(ehAdmin);[cite: 1]
    }
  }).catch((error) => {[cite: 1]
    console.error("Erro ao verificar permissão de ADM:", error);[cite: 1]
    if (typeof window.aplicarPermissoesADM === 'function') {[cite: 1]
      window.aplicarPermissoesADM(false);[cite: 1]
    }
  });[cite: 1]
};

window.resetarTodasQuadrasNuvem = function() {[cite: 1]
  set(ref(db, 'quadras'), null)[cite: 1]
    .then(() => {[cite: 1]
      console.log("Todas as quadras foram resetadas no Firebase.");[cite: 1]
    })[cite: 1]
    .catch((error) => {[cite: 1]
      console.error("Erro ao resetar quadras no Firebase:", error);[cite: 1]
    });[cite: 1]
};

window.salvarQuadraNuvem = function(idUnico, payload) {[cite: 1]
  if (!idUnico) return;[cite: 1]
  
  set(ref(db, 'quadras/' + idUnico), payload)[cite: 1]
    .then(() => {[cite: 1]
      console.log("Dados sincronizados com o Firebase:", idUnico);[cite: 1]
    })[cite: 1]
    .catch((error) => {[cite: 1]
      console.error("Erro ao salvar no Firebase:", error);[cite: 1]
    });[cite: 1]
};

onValue(ref(db, 'quadras'), (snapshot) => {[cite: 1]
  const data = snapshot.val();[cite: 1]
  if (typeof window.atualizarMapaLocal === 'function') {[cite: 1]
    window.atualizarMapaLocal(data);[cite: 1]
  }
}, (error) => {[cite: 1]
  console.error("Erro ao escutar mudanças no Firebase:", error);[cite: 1]
});[cite: 1]

window.enviarAlertaParaKodular = function(mensagem) {[cite: 1]
  if (window.AppInventor && typeof window.AppInventor.setWebViewString === 'function') {[cite: 1]
    window.AppInventor.setWebViewString(mensagem);[cite: 1]
  }
};[cite: 1]
