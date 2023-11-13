import React, { useContext, useEffect, useState, useRef } from "react";
import "jspdf-autotable";
import "animate.css/animate.min.css";
import { IoMdLogOut } from "react-icons/io";
import { collection, doc, getDoc, getDocs } from "firebase/firestore/lite";
import { auth, db } from "../firebase";
import { infoUserContext, userContext } from "../App";
import { useNavigate } from "react-router-dom";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const CreditosComponent = () => {
  const navigate = useNavigate();
  const [infoUser, setInfoUser] = useContext(infoUserContext);
  const [isAuthent, setIsAuthent] = useContext(userContext);

  const [empresa, setEmpresa] = useState([]);
  const [monto, setMonto] = useState(0);
  const [plazo, setPlazo] = useState(0);
  const [tasaInteres, setTasaInteres] = useState(0);
  const [seguro, setSeguro] = useState(0);
  const [amortizationTable, setAmortizationTable] = useState([]);
  const [selectedCredito, setSelectedCredito] = useState("");
  const [sistemaAmortizacion, setSistemaAmortizacion] = useState("aleman");
  const [showLogout, setShowLogout] = useState(false);

  const [totalCuota, setTotalCuota] = useState(0);
  const [totalSeguro, setTotalSeguro] = useState(0);
  const [totalCuotaTotal, setTotalCuotaTotal] = useState(0);
  const [totalInteres, setTotalInteres] = useState(0);
  const [totalCapital, setTotalCapital] = useState(0);

  const tableRef = useRef(null);

  const handleAvatarClick = () => {
    setShowLogout(!showLogout);
  };

  const getEmpresa = async () => {
    const fetchEmpresaData = async () => {
      const docRef = doc(db, "empresas", "info");
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      setEmpresa(data);
    };
    fetchEmpresaData();
  };

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
    getEmpresa();
    fetchCreditos();
  }, []);

  const calculateAmortization = (monto, plazo, tasaInteres, seguro) => {
    if (seguro === "") {
      seguro = 0;
    }

    setTotalCuota(0);
    setTotalSeguro(0);
    setTotalCuotaTotal(0);
    setTotalInteres(0);
    setTotalCapital(0);
    const amortizationTable = [];
    const tasaMensual = tasaInteres / 100 / 12;
    let saldo = monto;

    const cuotaSinSeguro = saldo / plazo;
    const seguroPorCuota = seguro / plazo;

    for (let i = 1; i <= plazo; i++) {
      const interes = saldo * tasaMensual;
      const capital = monto / plazo;
      const cuota = interes + capital;
      const seguroCuota = seguroPorCuota;
      const cuotaTotal = cuota + seguroCuota;

      saldo -= capital;

      amortizationTable.push({
        numeroCuota: i,
        cuota: cuota.toFixed(2),
        seguro: seguroCuota.toFixed(2),
        cuotaTotal: cuotaTotal.toFixed(2),
        interes: interes.toFixed(2),
        capital: capital.toFixed(2),
        saldo: saldo.toFixed(2),
      });
      setTotalCuota((prev) => prev + parseFloat(cuota.toFixed(2)));
      setTotalSeguro((prev) => prev + parseFloat(seguroPorCuota.toFixed(2)));
      setTotalCuotaTotal((prev) => prev + parseFloat(cuotaTotal.toFixed(2)));
      setTotalInteres((prev) => prev + parseFloat(interes.toFixed(2)));
      setTotalCapital((prev) => prev + parseFloat(capital.toFixed(2)));
    }

    return amortizationTable;
  };

  const calculateAmortizationFrances = (monto, plazo, tasaInteres, seguro) => {
    if (seguro === "") {
      seguro = 0;
    }
    setTotalCuota(0);
    setTotalSeguro(0);
    setTotalCuotaTotal(0);
    setTotalInteres(0);
    setTotalCapital(0);
    const amortizationTable = [];
    const tasaMensual = tasaInteres / 100 / 12;
    let saldo = monto;

    for (let i = 1; i <= plazo; i++) {
      let cuota;
      let interes;
      let capital;
      let seguroCuota;
      let cuotaTotal;

      if (sistemaAmortizacion === "aleman") {
        // Cálculos para el sistema alemán
        cuota = interes + capital;
        saldo -= capital;
        seguroCuota = seguro / plazo;
        cuotaTotal = cuota + seguroCuota;
      } else if (sistemaAmortizacion === "frances") {
        // Cálculos para el sistema francés
        interes = saldo * tasaMensual;
        cuota = (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazo));
        capital = cuota - interes;
        seguroCuota = seguro / plazo;
        cuotaTotal = cuota + seguroCuota;
        saldo -= capital;
      }

      amortizationTable.push({
        numeroCuota: i,
        cuota: cuota.toFixed(2),
        seguro: seguroCuota.toFixed(2),
        cuotaTotal: cuotaTotal.toFixed(2),
        interes: interes.toFixed(2),
        capital: capital.toFixed(2),
        saldo: saldo.toFixed(2),
      });

      setTotalCuota((prev) => prev + parseFloat(cuota.toFixed(2)));
      setTotalSeguro((prev) => prev + parseFloat(seguroCuota.toFixed(2)));
      setTotalCuotaTotal((prev) => prev + parseFloat(cuotaTotal.toFixed(2)));
      setTotalInteres((prev) => prev + parseFloat(interes.toFixed(2)));
      setTotalCapital((prev) => prev + parseFloat(capital.toFixed(2)));
    }

    return amortizationTable;
  };

  const handleCalculate = () => {
    console.log("====>>>" + sistemaAmortizacion);

    sistemaAmortizacion === "aleman"
      ? setAmortizationTable(
          calculateAmortization(monto, plazo, tasaInteres, seguro)
        )
      : setAmortizationTable(
          calculateAmortizationFrances(monto, plazo, tasaInteres, seguro)
        );
  };

  const handleSignup = () => {
    auth
      .signOut()
      .then(() => {
        setIsAuthent(false);
        setInfoUser([]);
        navigate("/", { replace: true });
      })
      .catch((error) => alert(error.message));
  };

  const handleSaveAsPDF = () => {
    if (!tableRef.current) {
      return;
    }

    const pdf = new jsPDF("p", "pt", "letter");

    const source = tableRef.current;

    const margins = {
      top: 60,
      bottom: 60,
      left: 40,
      right: 40,
    };

    pdf.autoTable({
      html: source,
      startY: margins.top + 10,
      margin: margins,
    });

    pdf.save("amortization_table.pdf");
  };

  return (
    <>
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <header className="flex justify-between items-center py-4 px-8">
          <div className="flex items-center">
            <div className="rounded-full overflow-hidden h-16 w-16 flex-shrink-0 mr-4">
              <img
                className="h-full w-full object-cover"
                src={empresa.logo}
                alt="Logo de la empresa"
              />
            </div>

            <h2 className="text-3xl font-bold animate__animated animate__fadeIn">
              {empresa.institucion}
            </h2>
          </div>

          <div className="flex items-center">
            <div
              className="cursor-pointer relative rounded-full overflow-hidden mr-4 animate__animated animate__fadeIn"
              onClick={handleSignup}
            >
              <IoMdLogOut size={30} />
            </div>
          </div>
        </header>
      </div>

      <div className="max-w-3xl mx-auto bg-gray-100 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Calculadora de Amortización
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Sistema de Amortización
            </label>
            <div className="relative">
              <select
                value={sistemaAmortizacion}
                onChange={(e) => setSistemaAmortizacion(e.target.value)}
                className="input-field"
              >
                <option value="aleman">Alemán</option>
                <option value="frances">Francés</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tipo de Crédito
            </label>
            <select
              value={selectedCredito}
              onChange={(e) => {
                const selectedCreditObject = creditosList.find(
                  (credito) => credito.nombreCredito === e.target.value
                );
                setSelectedCredito(selectedCreditObject.nombreCredito);
                setTasaInteres(selectedCreditObject.tasaInteresCredito);
                setSeguro(selectedCreditObject.seguro);
              }}
              className="input-field"
            >
              <option value="" disabled>
                Selecciona un tipo de crédito
              </option>
              {creditosList.map((credito, index) => (
                <option
                  key={index}
                  value={credito.nombreCredito}
                  interes={credito.tasaInteresCredito}
                  seguro={credito.seguro}
                >
                  {credito.nombreCredito}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Monto
            </label>
            <input
              type="number"
              placeholder="Ingrese el monto"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Plazo en Meses
            </label>
            <input
              type="number"
              placeholder="Ingrese el plazo"
              value={plazo}
              onChange={(e) => setPlazo(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-4 w-full md:w-auto"
          onClick={handleCalculate}
        >
          Calcular Amortización
        </button>

        {
          totalCuota > 0 && (  <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full mt-4 w-full md:w-auto"
            onClick={handleSaveAsPDF}
          >
            Guardar como PDF
          </button>)
        }
 

        <div className="mt-8 overflow-x-auto rounded-lg shadow-md">
          <table
            ref={tableRef}
            className="table-auto w-full border-collapse border rounded overflow-hidden"
          >
            <thead>
              <tr className="bg-gray-200">
                <th className="px-3 py-2 border">Número de cuota (N)</th>
                <th className="px-3 py-2 border">Cuota</th>
                <th className="px-3 py-2 border">Seguro</th>
                <th className="px-3 py-2 border">Cuota + Seguro</th>
                <th className="px-3 py-2 border">Interés</th>
                <th className="px-3 py-2 border">Capital</th>
                <th className="px-3 py-2 border">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {amortizationTable.map((row, index) => (
                <tr
                  key={index}
                  className={`bg-gray-${
                    index % 2 === 0 ? "100" : "200"
                  } transition-all duration-300 transform hover:scale-105 animate__animated animate__fadeIn`}
                >
                  <td className="px-3 py-2 border text-center">
                    {row.numeroCuota}
                  </td>
                  <td className="px-3 py-2 border text-center">{row.cuota}</td>
                  <td className="px-3 py-2 border text-center">{row.seguro}</td>
                  <td className="px-3 py-2 border text-center">
                    {row.cuotaTotal}
                  </td>
                  <td className="px-3 py-2 border text-center">
                    {row.interes}
                  </td>
                  <td className="px-3 py-2 border text-center">
                    {row.capital}
                  </td>
                  <td className="px-3 py-2 border text-center">{row.saldo}</td>
                </tr>
              ))}
              <tr className="bg-gray-300 font-bold">
                <td className="px-3 py-2 border text-center" colSpan="1">
                  Total
                </td>
                <td className="px-3 py-2 border text-center">
                  {totalCuota.toFixed(2)}
                </td>
                <td className="px-3 py-2 border text-center">
                  {totalSeguro.toFixed(2)}
                </td>
                <td className="px-3 py-2 border text-center">
                  {totalCuotaTotal.toFixed(2)}
                </td>
                <td className="px-3 py-2 border text-center">
                  {totalInteres.toFixed(2)}
                </td>
                <td className="px-3 py-2 border text-center">
                  {totalCapital.toFixed(2)}
                </td>
                <td className="px-3 py-2 border text-center"></td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
};

export default CreditosComponent;
