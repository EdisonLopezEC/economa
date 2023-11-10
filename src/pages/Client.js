import React, { useEffect, useState } from 'react';
import "animate.css/animate.min.css";
import { collection, getDocs } from 'firebase/firestore/lite';
import { db } from '../firebase';

const CreditosComponent = () => {
  const [monto, setMonto] = useState(0);
  const [plazo, setPlazo] = useState(0);
  const [tasaInteres, setTasaInteres] = useState(0);
  const [seguro, setSeguro] = useState(0);
  const [amortizationTable, setAmortizationTable] = useState([]);
  const [selectedCredito, setSelectedCredito] = useState('');
  const [sistemaAmortizacion, setSistemaAmortizacion] = useState('aleman');

// ...



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
 

  const calculateAmortization = (monto, plazo, tasaInteres, seguro) => {
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
    }
    return amortizationTable;
  };

  const calculateAmortizationFrances = (monto, plazo, tasaInteres, seguro) => {
    const amortizationTable = [];
    const tasaMensual = tasaInteres / 100 / 12;
    let saldo = monto;
  
    for (let i = 1; i <= plazo; i++) {
      let cuota;
      let interes;
      let capital;
      let seguroCuota;
      let cuotaTotal;
  
      if (sistemaAmortizacion === 'aleman') {
        // Cálculos para el sistema alemán
        cuota = interes + capital;
        saldo -= capital;
        seguroCuota = seguro / plazo;
        cuotaTotal = cuota + seguroCuota;
      } else if (sistemaAmortizacion === 'frances') {
        // Cálculos para el sistema francés
        interes = saldo * tasaMensual;
        cuota = monto * (tasaMensual) / (1 - Math.pow(1 + tasaMensual, -plazo));
        capital = cuota - interes;
        seguroCuota = seguro / plazo;
        cuotaTotal = cuota + seguroCuota;
        saldo -= capital;
      }
  
      amortizationTable.push({
        numeroCuota: i,
        cuota: cuota.toFixed(2),        // <-- Error puede estar aquí
        seguro: seguroCuota.toFixed(2), // <-- Error puede estar aquí
        cuotaTotal: cuotaTotal.toFixed(2), // <-- Error puede estar aquí
        interes: interes.toFixed(2),   // <-- Error puede estar aquí
        capital: capital.toFixed(2),   // <-- Error puede estar aquí
        saldo: saldo.toFixed(2),       // <-- Error puede estar aquí
      });
    }
  
    return amortizationTable;
  };
  
  const handleCalculate = () => {
    console.log("====>>>" + sistemaAmortizacion)

    sistemaAmortizacion === 'aleman' ? setAmortizationTable(calculateAmortization(monto, plazo, tasaInteres, seguro)) : setAmortizationTable(calculateAmortizationFrances(monto, plazo, tasaInteres, seguro));

  };
  return (
    <div>
      <h2 className="text-2xl text-center font-bold mb-4 text-gray-800">Calculadora de Amortización Alemana</h2>
      <div className="flex flex-col items-center space-y-4">

<select
  value={sistemaAmortizacion}
  onChange={(e) => setSistemaAmortizacion(e.target.value)}
  className="input-field"
>
  <option value="aleman">Alemán</option>
  <option value="frances">Francés</option>
</select>

      <select
          value={selectedCredito}
          onChange={(e) => {
            const selectedCreditObject = creditosList.find((credito) => credito.nombreCredito === e.target.value);
            setSelectedCredito(selectedCreditObject.nombreCredito);
            setTasaInteres(selectedCreditObject.tasaInteresCredito);
            setSeguro(selectedCreditObject.seguro);

            console.log( tasaInteres, seguro);
          }}
          className="input-field"
        >
          <option value="" disabled>Selecciona un tipo de credito</option>
          {creditosList.map((credito, index) => (
            <option key={index} value={credito.nombreCredito} interes={credito.tasaInteresCredito} seguro={credito.seguro}>{credito.nombreCredito}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Monto"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          className="input-field"
        />
        <input
          type="number"
          placeholder="Plazo en meses"
          value={plazo}
          onChange={(e) => setPlazo(e.target.value)}
          className="input-field"
        />
        {/* <input
          type="number"
          placeholder="Tasa de Interés"
          value={tasaInteres}
          onChange={(e) => setTasaInteres(e.target.value)}
          className="input-field"
        />
        <input
          type="number"
          placeholder="Seguro (opcional)"
          value={seguro}
          onChange={(e) => setSeguro(e.target.value)}
          className="input-field"
        /> */}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={handleCalculate}
        >
          Calcular Amortización
        </button>
      </div>
      <div className="mt-8 overflow-x-auto rounded-lg shadow-md">
  <table className="table-auto w-full border-collapse border rounded overflow-hidden">
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
        <tr key={index} className={`bg-gray-${index % 2 === 0 ? '100' : '200'} transition-all duration-300 transform hover:scale-105 animate__animated animate__fadeIn`}>
          <td className="px-3 py-2 border text-center">{row.numeroCuota}</td>
          <td className="px-3 py-2 border text-center">{row.cuota}</td>
          <td className="px-3 py-2 border text-center">{row.seguro}</td>
          <td className="px-3 py-2 border text-center">{row.cuotaTotal}</td>
          <td className="px-3 py-2 border text-center">{row.interes}</td>
          <td className="px-3 py-2 border text-center">{row.capital}</td>
          <td className="px-3 py-2 border text-center">{row.saldo}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  </div>
  );
  
};

export default CreditosComponent;
