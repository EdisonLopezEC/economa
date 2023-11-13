import logo from './logo.svg';
import { auth, db } from './firebase';
import './App.css';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore/lite';
import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';

import SignIn from './SingIn';
import Dashboard from './pages/Dashboard';
import { useHistory } from "react-router-dom";
import ProtectedRoute from './utils/protectedRoute';
import Client from './pages/Client';
import BoxComponent from './components/BoxComponent';
import styles from './styles/BoxComponent.module.css';

export const userContext = React.createContext();
export const infoUserContext = React.createContext();



const PrivateRoute = ({ element, path }) => {
  const [isAuthenth] = useContext(userContext);


  if (isAuthenth) {
    return <Route path={path} element={element} />;
  } else {
    return <Navigate to="/" />;
  }
};

function App() {
  const [infoUser, setInfoUser] = useState([]);
  const [isAuthenth, setIsAuthent] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Agrega un estado de carga inicial


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthent(true);
        // Aquí realizas la consulta para obtener los permisos del usuario
        const userRef = doc(db, 'usuarios', user.uid);
        getDoc(userRef).then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setInfoUser(userData);
          }
          setIsLoading(false);
        });
      } else {
        setIsAuthent(false);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const SignInComponent = () => {


    
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <BoxComponent />
        </div>
      )
    }
  

    if (isAuthenth) {
      if (infoUser.permisos === "admin") {
        return <Navigate to="/dashboard" />;
      } else if (infoUser.permisos === "usuario") {
        return <Navigate to="/client" />;
      }
      // Manejo de otros roles si es necesario
    } else {
      return <SignIn />;
    }
  }
  return (
    
    <userContext.Provider value={[isAuthenth, setIsAuthent]}>
      <infoUserContext.Provider value={[infoUser, setInfoUser]}>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<SignInComponent />} />
            <Route
              element={<ProtectedRoute canActivate={isAuthenth} />}
            >
              {console.log("Aqui permisos", infoUser.permisos)}
              {infoUser.permisos === "admin" && <Route path="/dashboard" element={<Dashboard />} />} 
              {infoUser.permisos === "usuario" && <Route path="/client" element={<Client />}/>}
            </Route>

          </Routes>
        </BrowserRouter>
      </infoUserContext.Provider>
    </userContext.Provider>
  );
}

export default App;
