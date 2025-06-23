import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  databaseURL: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// Chama a função initializeApp do firebase (ver o import acima)
let app = initializeApp(firebaseConfig);

// Retorna o objeto app gerado pelo firebase
export default app;