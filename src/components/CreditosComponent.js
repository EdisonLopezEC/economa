import React, { useState } from "react";
import { db } from "../firebase"; // Asegúrate de importar la instancia de Firestore desde tu archivo de configuración de Firebase
import { collection, addDoc } from "firebase/firestore/lite";

const CreditosComponent = () => {
  const [creditoState, setCreditoState] = useState({
    nombreCredito: "",
    tasaInteresCredito: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCreditoState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const guardarCredito = async (credito) => {
    try {
      const creditosCollectionRef = collection(db, "creditos");
      await addDoc(creditosCollectionRef, credito);
      console.log("Credito guardado correctamente");
    } catch (error) {
      console.error("Error al guardar el credito: ", error);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await guardarCredito(creditoState);
    } catch (e) {
      console.error("Error al agregar el credito: ", e);
    }
  };

  return (
    <div className="max-w-md mx-auto m-4 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Formulario de Créditos</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombreCredito">
            Nombre del Crédito
          </label>
          <input
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            type="text"
            name="nombreCredito"
            value={creditoState.nombreCredito}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tasaInteresCredito">
            Tasa de Interés del Crédito
          </label>
          <input
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            type="text"
            name="tasaInteresCredito"
            value={creditoState.tasaInteresCredito}
            onChange={handleInputChange}
          />
        </div>
        <button
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-indigo-200"
          type="submit"
        >
          Guardar Crédito
        </button>
      </form>
    </div>
  );
};

export default CreditosComponent;
