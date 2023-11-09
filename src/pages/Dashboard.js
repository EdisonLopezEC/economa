import React, { useContext } from 'react';
import { userContext } from '../App';
import { auth, db } from "../firebase";

export default function Dashboard() {

  const handleSignup = () => {
    auth
      .signOut()
      .then(() => {
        setIsAuthent(false);
     
      })
      .catch((error) => alert(error.message));
  };

  const [isAuthenth, setIsAuthent] = useContext(userContext);

  const handleButtonClick = () => {
    setIsAuthent('asdasd');
  };

  return (
    <div>
      <h2 className="text-4xl text-center font-bold mb-6 text-gray-800">
        ¡Bienvenido de nuevo! { isAuthenth}
      </h2>
      <button onClick={handleSignup}>Cerrar Sesion</button>
    </div>
  );
}
