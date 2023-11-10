import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, doc, deleteDoc, getDocs, updateDoc } from "firebase/firestore/lite";
import "animate.css"; // Importa la biblioteca de animaciones Animate.css

const CreditosComponent = () => {
  const [creditoState, setCreditoState] = useState({
    nombreCredito: "",
    tasaInteresCredito: "",
  });

  const [creditosList, setCreditosList] = useState([]);

  const fetchCreditos = async () => {
    const creditosCollectionRef = collection(db, "creditos");
    const querySnapshot = await getDocs(creditosCollectionRef);
    const creditos = [];
    querySnapshot.forEach((doc) => {
      creditos.push({ id: doc.id, ...doc.data() });
    });
    setCreditosList(creditos);
  };

  useEffect(() => {
    fetchCreditos();
  }, []);

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
      if (credito.id) {
        const creditoRef = doc(db, "creditos", credito.id);
        await updateDoc(creditoRef, credito);
        console.log("Credito actualizado correctamente");
      } else {
        await addDoc(creditosCollectionRef, credito);
        console.log("Credito guardado correctamente");
      }
      fetchCreditos();
      setCreditoState({ nombreCredito: "", tasaInteresCredito: "" });
    } catch (error) {
      console.error("Error al guardar el credito: ", error);
    }
  };

  const editarCredito = (credito) => {
    setCreditoState({
      id: credito.id,
      nombreCredito: credito.nombreCredito,
      tasaInteresCredito: credito.tasaInteresCredito,
    });
  };

  const borrarCredito = async (id) => {
    try {
      const creditoRef = doc(db, "creditos", id);
      await deleteDoc(creditoRef);
      console.log("Credito eliminado correctamente");
      fetchCreditos();
    } catch (error) {
      console.error("Error al eliminar el credito: ", error);
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
    <div className="max-w-md mx-auto m-4 p-6 bg-white rounded shadow-md animate__animated animate__fadeIn">
      <h2 className="text-2xl font-bold text-center mb-6">Formulario de Créditos</h2>
      <form onSubmit={handleFormSubmit} className="animate__animated animate__fadeIn">
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

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-center mb-6">Lista de Créditos</h2>
        <ul>
          {creditosList.map((credito) => (
            <li key={credito.id} className="mb-4 p-4 border rounded shadow-sm animate__animated animate__fadeInUp">
              <div className="mb-2 font-bold">{credito.nombreCredito}</div>
              <div className="mb-2">{credito.tasaInteresCredito}%</div>
              <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-indigo-200 mr-2 animate__animated animate__fadeIn" onClick={() => editarCredito(credito)}>
                Editar
              </button>
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-red-200 animate__animated animate__fadeIn" onClick={() => borrarCredito(credito.id)}>
                Borrar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CreditosComponent;
