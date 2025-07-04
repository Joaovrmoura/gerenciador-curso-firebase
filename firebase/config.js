// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: "AIzaSyBTxQVAXNSw4bEb0n5yyDiLJ0IYdcJDG4Q",
  authDomain: "faeterj-drfo-faculdade-projeto.firebaseapp.com",
  databaseURL: "https://faeterj-drfo-faculdade-projeto-default-rtdb.firebaseio.com",
  projectId: "faeterj-drfo-faculdade-projeto",
  storageBucket: "faeterj-drfo-faculdade-projeto.firebasestorage.app",
  messagingSenderId: "393664081982",
  appId: "1:393664081982:web:e1be305c9c265795ffe16f",
  measurementId: "G-4TFZCD8J7C"
};

// Chama a função initializeApp do firebase (ver o import acima)
let app = initializeApp(firebaseConfig);


// Retorna o objeto app gerado pelo firebase
export default app;