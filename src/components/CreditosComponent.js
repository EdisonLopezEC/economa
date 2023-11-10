import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import Modal from "react-modal"; // Importa react-modal
import { collection, addDoc, doc, deleteDoc, getDocs, updateDoc } from "firebase/firestore/lite";
import "animate.css"; // Importa la biblioteca de animaciones Animate.css

const CreditosComponent = () => {
  const [creditoState, setCreditoState] = useState({
    nombreCredito: "",
    tasaInteresCredito: "",
  });

  const [creditosList, setCreditosList] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCredito, setSelectedCredito] = useState(null); // Nuevo estado para almacenar el crédito seleccionado
  const [seguro, setSeguro] = useState("");
  const [donacion, setDonacion] = useState("");

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
    setSelectedCredito(credito); // Actualiza el crédito seleccionado
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

  const openModal = (credito) => {
    setSelectedCredito(credito); // Actualiza el crédito seleccionado
    setSeguro(credito.seguro || ""); // Establece el valor del seguro del crédito o un string vacío si no existe
    setDonacion(credito.donacion || ""); // Establece el valor de la donación del crédito o un string vacío si no existe
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleAccept = () => {
    const updatedCredito = {
      ...selectedCredito,
      seguro: seguro,
      donacion: donacion,
    };
    guardarCredito(updatedCredito);
    closeModal();
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
              <button
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-indigo-200 mr-2 animate__animated animate__fadeIn"
                onClick={() => editarCredito(credito)}
              >
                Editar
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-red-200 animate__animated animate__fadeIn"
                onClick={() => borrarCredito(credito.id)}
              >
                Borrar
              </button>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-green-200 mr-2 animate__animated animate__fadeIn"
                onClick={() => openModal(credito)}
              >
                Añadir
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Example Modal"
            className="modal bg-white p-6 rounded-md w-80"
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }
            }}
        >
            <h2 className="text-xl font-bold mb-4 text-center">Agregar Seguro y Donación</h2>
            <form className="flex flex-col items-center">
                <div className="w-full mb-4">
                    <label className="text-base" htmlFor="seguro">Seguro:</label>
                    <input
                        type="text"
                        id="seguro"
                        value={seguro}
                        onChange={(e) => setSeguro(e.target.value)}
                        className="w-full bg-gray-100 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-blue-500 text-base py-2 px-4 block"
                    />
                </div>
                <div className="w-full mb-4">
                    <label className="text-base" htmlFor="donacion">Donación:</label>
                    <input
                        type="text"
                        id="donacion"
                        value={donacion}
                        onChange={(e) => setDonacion(e.target.value)}
                        className="w-full bg-gray-100 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-blue-500 text-base py-2 px-4 block"
                    />
                </div>
                <div className="flex justify-center items-center space-x-4">
                    <button
                        onClick={handleAccept}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Aceptar
                    </button>
                    <button
                        onClick={closeModal}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </Modal>
      </div>



    </div>
  );
};

export default CreditosComponent;
