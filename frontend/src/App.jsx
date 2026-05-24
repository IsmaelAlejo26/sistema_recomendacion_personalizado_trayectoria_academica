import { useEffect, useState } from 'react'
import subjects from './subjects'
import Subject from './components/Subject'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import './General.css'
import Recommendation from './components/Recommendation'
import { MdOutlineWbSunny } from "react-icons/md"
import { RiMoonLine } from "react-icons/ri";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const [currentSubjects, setSubjects] = useState([]);
  // const [exists, setExists] = useState(false);
  // let contador = 0;
  const [count, setCount] = useState(0);

  const handleSelectSubject = (subject) => {
    // console.log("asdasdasdasd");
    let exists = false;
    if (currentSubjects.length === 0) {
      setSubjects(prev => [...prev, subject]);
      setCount(prev => prev + 1);
      setMessage("");
      setError("");
    } else {
      currentSubjects.forEach(sub => {
        if (sub === subject) {
          setMessage("Ya has agregado esta materia");
          setError("Repetición");
          exists = true;
        }
      });
      if (!exists) {
        setSubjects(prev => [...prev, subject]);
        setCount(prev => prev + 1);
        setMessage("");
        setError("");
      }
    }
  };

  const handleVoidSelected = () => {
    setMessage("Selecciona una materia");
    setError("Falta seleccionar materia");
  }

  const sendRequest = () => {
    if (currentSubjects.length > 0) {
      // OBLIGATORIO
      handleSubmit();
      return;
    }
    // console.log("Agrega materias.");
    setMessage("Agrega por lo menos una materia a la lista");
    setError("Faltan materias");
  }

  const handleDeleteSubject = (subject) => {
    // let exists = false; // Se supone que el botón está cuando hay uno agregado
    setSubjects(prev => prev.filter((sub) => sub !== subject));
    setCount(prev => prev - 1);
    setMessage("");
    setError("");
  }

  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subjects: currentSubjects }),
      });

      const data = await res.json();
      console.log(data.recommendations); // { recommendations: [...] }
      setRecommendations(data.recommendations);
      setMessage("¡Recomendaciones generadas!");
    } catch (error) {
      console.error("Error:", error);
      setMessage("Ocurrió un problema al buscar recomendaciones");
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  const handleCleanAll = () => {
    setCount(0);
    setSubjects([]);
    setRecommendations([]);
    setMessage("");
    setError("");
  }

  const toggleDark = () => {
    setDarkMode(prev => {
      localStorage.setItem("darkMode", !prev);
      document.documentElement.classList.toggle("dark", !prev);
      return !prev;
    });
  };

  useEffect(() => {
    const saved = localStorage.getItem("darkMode") === "true";
    setDarkMode(saved);
    document.documentElement.classList.toggle("dark", saved);
  }, []);

  return (
    <>
      <button type='button' className='font-20 jost-400 bt_togglemode' onClick={() => toggleDark()}>
        {darkMode ? <MdOutlineWbSunny /> : <RiMoonLine />}
      </button>
      <div className='c_everything'>
        <div className='c_selected'>
          <Subject
            onSelectSubject={handleSelectSubject}
            onCleanAll={handleCleanAll}
            onVoidSelect={handleVoidSelected}
          />
          <p className={`no-margin ${error !== "" ? 'red' : 'green'} font-18 jost-400 tx_state`}>{message}</p>
          <div className='c_added'>
            {/* Nada más cuenta las materias que se han agregado */}
            <p className='font-20 jost-600'>Materias agregadas: {count}</p>
            {/* AQUI SE AGREGAN LAS MATERIAS SELECCIONADAS */}
            {currentSubjects.length === 0 ? (
              <span className='font-18 jost-400'> No hay ninguna materia agregada. </span>
            ) : (
              currentSubjects.map((sub) => {
                return (
                  <div className='c_subject'>
                    <p key={sub} className='font-18 jost-400 no-padding no-margin'>{sub}</p>
                    <button type='button' onClick={() => handleDeleteSubject(sub)} className='font-18 jost-400 bt_delete'>Descartar</button>
                  </div>
                )
              })
            )}
          </div>
        </div>
        <div div className='c_results'>
          {loading ? (
            <>
              <p className='font-20 jost-600'>Cargando...</p>
            </>
          ) : (
            recommendations.length === 0 ? (
              <>
                <p className='font-32 jost-400'>Aquí se mostrarán los resultados</p>
                <button type='button' className='font-20 jost-400 bt_recommend' onClick={() => sendRequest()}>Ver recomendaciones</button>
              </>
            ) : (recommendations.map((recoSub) => (
              <>
                <h2 className='font-20 jost-600'>{recoSub.subject}</h2>
                {recoSub.resources.map((recomm) => (
                  <Recommendation resource={recomm} />
                ))}
              </>
            ))
            )
          )}
        </div>
      </div>
    </>
  )
}

export default App;