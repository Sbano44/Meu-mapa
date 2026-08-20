import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, onValue, get, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

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

function sanitizeKey(key) {
  return key.replace(/[.#$/\[\]]/g, "_");
}

window.verificarPermissaoADM = function(nomeUsuario) {
  if (!nomeUsuario) return;
  const userKey = sanitizeKey(nomeUsuario);

  get(ref(db, 'usuarios/' + userKey)).then((snapshot) => {
    if (snapshot.exists()) {
      const dados = snapshot.val();
      const ehAdmin = dados && dados.cargo === 'admin';
      
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

window.registrarUsuarioNuvem = function(nomeUsuario) {
  if (!nomeUsuario) return;
  const userKey = sanitizeKey(nomeUsuario);
  const userRef = ref(db, 'usuarios/' + userKey);
  
  get(userRef).then((snapshot) => {
    if (!snapshot.exists()) {
      set(userRef, {
        nome: nomeUsuario,
        cargo: 'publicador',
        ultimoAcesso: new Date().toISOString()
      });
    } else {
      update(userRef, {
        ultimoAcesso: new Date().toISOString()
      });
    }
  }).catch(err => console.error("Erro ao registrar usuário:", err));
};

window.salvarCargoUsuario = function(userKey, novoCargo) {
  const userRef = ref(db, 'usuarios/' + userKey);
  update(userRef, { cargo: novoCargo });
};

window.salvarEscalaSemanal = function(escalaData) {
  const escalaRef = ref(db, 'escala_dirigentes');
  set(escalaRef, escalaData);
};

onValue(ref(db, 'usuarios'), (snapshot) => {
  const usuarios = snapshot.val();
  if (typeof window.renderizarUsuariosADM === 'function') {
    window.renderizarUsuariosADM(usuarios);
  }
});

onValue(ref(db, 'escala_dirigentes'), (snapshot) => {
  const escala = snapshot.val();
  if (typeof window.renderizarEscalaADM === 'function') {
    window.renderizarEscalaADM(escala);
  }
});
