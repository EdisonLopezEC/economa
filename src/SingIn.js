import React, { useContext, useState } from 'react';
import { auth, db } from './firebase';
import "animate.css/animate.min.css";
import { AuthContext } from './context/AuthContext';
import { userContext } from './App';
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from 'firebase/firestore/lite';


export default function SignIn() {
  const navigate = useNavigate();
  const [isAuthenth, setIsAuthenth] = useContext(userContext);
  const [isRegistering, setIsRegistering] = useState(false);

  const [formState, setFormState] = useState({
    email: '',
    password: '',
  });

  const [registerFormState, setRegisterFormState] = useState({
    nombre: '',
    registroEmail: '',
    registroPassword: '',
  });

  const { email, password } = formState;
  const { nombre, registroEmail, registroPassword } = registerFormState;
  const [errorLogin, setErrorLogin] = useState(false);

  const handleInputChange = ({ target }) => {
    setFormState({
      ...formState,
      [target.name]: target.value,
    });
  };

  const handleRegisterInputChange = ({ target }) => {
    setRegisterFormState({
      ...registerFormState,
      [target.name]: target.value,
    });
  };

  const handleLogin = () => {
    setErrorLogin(false);
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        setErrorLogin(false);
        setIsAuthenth(true);
        navigate("/dashboard");
      })
      .catch((error) => {
        setErrorLogin(true);
        setIsAuthenth(false);
        console.log('Error al iniciar sesión: ', error);
      });
  };

  const guardarUsuario = async (usuario) => {
    // Aquí debes asegurarte de tener los datos del usuario, como nombre, correo, etc.
    try {
      // Reemplaza "usuarios" con el nombre de tu colección en Firestore
      const docRef = doc(db, "usuarios", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
  
      if (docSnap.exists()) {
        // Si el usuario ya existe, actualiza sus datos
        await setDoc(docRef, {
          nombre: usuario.nombre,
          correo: usuario.correo,
          permisos: "usuario",
          uid: auth.currentUser.uid,
          // Agrega más campos de datos si es necesario
        });
        console.log("Usuario actualizado en la base de datos");
      } else {
        // Si el usuario no existe, crea un nuevo documento con sus datos
        await setDoc(docRef, {
          nombre: usuario.nombre,
          correo: usuario.correo,
          permisos: usuario.permisos,
          uid: auth.currentUser.uid,
          // Agrega más campos de datos si es necesario
        });
        console.log("Nuevo usuario guardado en la base de datos");
      }
    } catch (error) {
      console.error("Error al guardar el usuario: ", error);
    }
  };
  

  const handleRegister = () => {
    if (registroEmail && registroPassword && nombre) {
      auth
        .createUserWithEmailAndPassword(registroEmail, registroPassword)
        .then((userCredential) => {
          const user = userCredential.user;
          const { uid } = user;
          guardarUsuario({ nombre, correo: registroEmail, permisos: "usuario" });
          console.log('Registro exitoso');
        })
        .catch((error) => {
          console.error('Error al registrar el usuario: ', error);
        });
    } else {
      console.error('Error al registrar el usuario: alguno de los campos está vacío');
    }
  };
  

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-indigo-500">
      <div className="w-full max-w-md rounded-lg shadow-lg bg-white p-8 animate__animated animate__fadeIn">
        <h2 className="text-4xl text-center font-bold mb-6 text-gray-800">
          {isRegistering ? '¡Regístrate!' : '¡Bienvenido de nuevo!'}
        </h2>
        <form className="mb-4">
          {!isRegistering && (
            <div className="mb-4">
              <input
                className="w-full rounded-md border-purple-300 shadow-sm p-4 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                type="text"
                placeholder="Correo electrónico"
                value={email}
                name="email"
                onChange={handleInputChange}
              />
            </div>
          )}
          {!isRegistering && (
            <div className="mb-6">
              <input
                className="w-full rounded-md border-purple-300 shadow-sm p-4 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                type="password"
                name="password"
                placeholder="Contraseña"
                value={password}
                onChange={handleInputChange}
              />
            </div>
          )}
          {isRegistering && (
            <div className="mb-4">
              <input
                className="w-full rounded-md border-purple-300 shadow-sm p-4 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                type="text"
                placeholder="Nombre"
                value={nombre}
                name="nombre"
                onChange={handleRegisterInputChange}
              />
            </div>
          )}
          {isRegistering && (
            <div className="mb-4">
              <input
                className="w-full rounded-md border-purple-300 shadow-sm p-4 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                type="text"
                placeholder="Correo electrónico"
                value={registroEmail}
                name="registroEmail"
                onChange={handleRegisterInputChange}
              />
            </div>
          )}
          {isRegistering && (
            <div className="mb-6">
              <input
                className="w-full rounded-md border-purple-300 shadow-sm p-4 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                type="password"
                name="registroPassword"
                placeholder="Contraseña"
                value={registroPassword}
                onChange={handleRegisterInputChange}
              />
            </div>
          )}

          {errorLogin && (
            <div className="text-red-500 text-sm italic text-center mb-4">Credenciales incorrectas. Inténtalo de nuevo.</div>
          )}

          {isRegistering ? (
            <button
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50 w-full transition duration-300"
              type="button"
              onClick={handleRegister}
            >
              Registrarse
            </button>
          ) : (
            <button
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 w-full transition duration-300 mb-4"
              type="button"
              onClick={handleLogin}
            >
              {isAuthenth ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          )}

          <button
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50 w-full transition duration-300"
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? 'Volver al inicio de sesión' : 'Registrarse'}
          </button>
        </form>
      </div>

      <div className="w-full max-w-md ml-6">
        <div className="bg-indigo-200 p-8 rounded-lg shadow-lg animate__animated animate__fadeInUp">
          <div className="text-center">
            <h3 className="text-4xl text-indigo-800 font-extrabold mb-4">¡Gestin te da la bienvenida!</h3>
            <p className="text-gray-700">
              Descubre una forma eficiente de gestionar tus proyectos y tareas. ¡Pruébalo hoy mismo!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
