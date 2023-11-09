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

export const userContext = React.createContext();

const PrivateRoute = ({ element, path }) => {
  const [isAuthenth] = useContext(userContext);

  if (isAuthenth) {
    return <Route path={path} element={element} />;
  } else {
    return <Navigate to="/" />;
  }
};

function App() {
  const [isAuthenth, setIsAuthent] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthent(true);
      } else {
        setIsAuthent(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const SignInComponent = () => {
    if (isAuthenth) {
      return <Navigate to="/dashboard" />;
    } else {
      return <SignIn />;
    }
  };

  return (
    <userContext.Provider value={[isAuthenth, setIsAuthent]}>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<SignInComponent />} />
          <Route
            element={<ProtectedRoute canActivate={isAuthenth} />}
          >
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </userContext.Provider>
  );
}

export default App;
