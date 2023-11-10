import React, { useState, useEffect } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../firebase"; // Importa la instancia de Firestore desde tu archivo de configuración de Firebase
import { doc, getDoc, setDoc } from "firebase/firestore/lite";

const DatosComponent = () => {
  const storage = getStorage();

  const [formState, setFormState] = useState({
    institucion: "",
    logo: "",
    contacto: "",
    direccion: "",
  });

  const [logoURL, setLogoURL] = useState("");

  useEffect(() => {
    const fetchEmpresaData = async () => {
      try {
        const docRef = doc(db, "empresas", "info");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormState(data);
          setLogoURL(data.logo);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };
    fetchEmpresaData();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    setFormState((prevState) => ({
      ...prevState,
      logo: downloadURL,
    }));
    setLogoURL(downloadURL); // Actualiza la URL del logo para mostrarla
  };

  const guardarEmpresa = async (empresa) => {
    try {
      const docRef = doc(db, "empresas", "info");
      await setDoc(docRef, empresa);
      console.log("Datos de la empresa actualizados correctamente");
    } catch (error) {
      console.error("Error al guardar los datos de la empresa: ", error);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await guardarEmpresa(formState);
    } catch (e) {
      console.error("Error al agregar el documento: ", e);
    }
  };

  return (
    <div className="max-w-md mx-auto m-4 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        Datos de la Institución
      </h2>
      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="institucion"
          >
            Nombre de la Institución
          </label>
          <input
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            type="text"
            name="institucion"
            value={formState.institucion}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="logo"
          >
            Logo (Subir Imagen)
          </label>
          <input
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            type="file"
            name="logo"
            onChange={handleFileChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="contacto"
          >
            Contacto
          </label>
          <input
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            type="text"
            name="contacto"
            value={formState.contacto}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="direccion"
          >
            Dirección
          </label>
          <input
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            type="text"
            name="direccion"
            value={formState.direccion}
            onChange={handleInputChange}
          />
        </div>
        <button
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-indigo-200"
          type="submit"
        >
          Actualizar
        </button>
        {logoURL && (
  <div className="mt-4 flex justify-center items-center flex-col">
    <h3 className="text-lg font-bold mb-2">Logo:</h3>
    <img
      src={logoURL}
      alt="Logo"
      style={{ maxWidth: "100px", maxHeight: "100px" }} // Ajusta el tamaño máximo aquí como prefieras
    />
  </div>
)}
      </form>
    </div>
  );
};

export default DatosComponent;
