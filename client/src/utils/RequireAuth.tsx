import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const [loading, setLoading] = useState(true);
  const [autenticado, setAutenticado] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAutenticado(true);
      } else {
        navigate("/login");
      }
      setLoading(false);
    });

    return () => unsub();
  }, [navigate]);

  if (loading) return <p>Carregando...</p>;

  return autenticado ? children : null;
}
