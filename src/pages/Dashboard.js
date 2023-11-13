import React, { useContext, useState, useEffect } from "react";
import { infoUserContext, userContext } from "../App";
import { auth, db } from "../firebase";
import DatosComponent from "../components/DatosComponent";
import CreditosComponent from "../components/CreditosComponent";
import { RiFileTextLine, RiSettings3Line } from "react-icons/ri";
import "animate.css";
import { IconContext } from "react-icons";
import { useNavigate } from "react-router-dom";

import { IoMdLogOut } from "react-icons/io";
import { doc, getDoc } from "firebase/firestore/lite";


const Sidebar = ({ handleOptionSelect }) => {
  const navigate = useNavigate();
  const [infoUser, setInfoUser] = useContext(infoUserContext);
  const [isAuthent, setIsAuthent] = useContext(userContext);
  const handleSignup = () => {
    auth.signOut().then(() => {
      setIsAuthent(false);
      setInfoUser([]);
      navigate("/");
    });
  };

  return (
    <div className="bg-gray-800 text-white h-screen w-1/5 overflw-y-auto ">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Menu</h2>
        <ul>
          <li
            className="p-4 hover:bg-gray-700 cursor-pointer flex items-center"
            onClick={() => handleOptionSelect("datos")}
          >
            <IconContext.Provider value={{ className: "text-white mr-2" }}>
              <RiFileTextLine />
            </IconContext.Provider>
            <span>Datos de la institución</span>
          </li>
          <li
            className="p-4 hover:bg-gray-700 cursor-pointer flex items-center"
            onClick={() => handleOptionSelect("creditos")}
          >
            <IconContext.Provider value={{ className: "text-white mr-2" }}>
              <RiSettings3Line />
            </IconContext.Provider>
            <span>Configurar Créditos</span>
          </li>

          <li
            className="p-4 hover:bg-gray-700 cursor-pointer flex items-center"
            onClick={() => handleSignup()}
          >
            <IconContext.Provider value={{ className: "text-white mr-2" }}>
              <IoMdLogOut />
            </IconContext.Provider>
            <span>Cerrar Sesión</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [isAuthent, setIsAuthent] = useContext(userContext);
  const [infoUser, setInfoUser] = useContext(infoUserContext);
  const [empresa, setEmpresa] = useState([]);

  const [selectedOption, setSelectedOption] = useState(" ");

  const getEmpresa = async () => {
    const fetchEmpresaData = async () => {
      const docRef = doc(db, "empresas", "info");
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      setEmpresa(data);
    };
    fetchEmpresaData();
  };

  useEffect(() => {
    getEmpresa();
  }, []);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="flex flex-col md:flex-row">
    <Sidebar handleOptionSelect={handleOptionSelect} />
    {/* Calcular y centrar tomando en cuenta el sidebar */}
    <div className="w-full mx-auto md:w-4/5 p-8 flex flex-col items-center">

      {selectedOption == " " && (
        <>
          <h2 className="text-4xl text-center font-bold mb-6 text-gray-800">
            ¡Bienvenido de nuevo! {isAuthent}
          </h2>
  
          <div className="rounded-full overflow-hidden h-100 w-00 mb-4"> {/* Ajustamos el tamaño del contenedor y de la imagen */}
            <img
              className="h-full w-full object-cover"
              src={empresa.logo}
              alt="Logo de la empresa"
            />
          </div>

          <p className="text-center text-gray-600 mb-4 text-xl font-bold hover:text-gray-800 transition duration-300 ease-in-out cursor-pointer ">
            {empresa.institucion}
          </p>

          
        </>
      )}
  
      {selectedOption === "datos" && <DatosComponent />}
      {selectedOption === "creditos" && <CreditosComponent />}
    </div>
  </div>
  
  );
}
