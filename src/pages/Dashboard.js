import React, { useContext, useState } from 'react';
import { userContext } from '../App';
import { auth } from "../firebase";
import DatosComponent from '../components/DatosComponent';
import CreditosComponent from '../components/CreditosComponent';
import { RiFileTextLine, RiSettings3Line } from 'react-icons/ri';
import "animate.css";
import { IconContext } from 'react-icons';

const Sidebar = ({ handleOptionSelect }) => {
  return (
    <div className="bg-gray-800 text-white h-screen w-1/5 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Menu</h2>
        <ul>
          <li
            className="p-4 hover:bg-gray-700 cursor-pointer flex items-center"
            onClick={() => handleOptionSelect('datos')}
          >
            <IconContext.Provider value={{ className: 'text-white mr-2' }}>
              <RiFileTextLine />
            </IconContext.Provider>
            <span>Datos de la institución</span>
          </li>
          <li
            className="p-4 hover:bg-gray-700 cursor-pointer flex items-center"
            onClick={() => handleOptionSelect('creditos')}
          >
            <IconContext.Provider value={{ className: 'text-white mr-2' }}>
              <RiSettings3Line />
            </IconContext.Provider>
            <span>Configurar Créditos</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [isAuthent, setIsAuthent] = useContext(userContext);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSignup = () => {
    auth
      .signOut()
      .then(() => {
        setIsAuthent(false);
      })
      .catch((error) => alert(error.message));
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar handleOptionSelect={handleOptionSelect} />
      <div className="w-full md:w-4/5 p-8">
        <h2 className="text-4xl text-center font-bold mb-6 text-gray-800">
          ¡Bienvenido de nuevo! {isAuthent}
        </h2>
        {selectedOption === 'datos' && <DatosComponent />}
        {selectedOption === 'creditos' && <CreditosComponent />}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={handleSignup}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
