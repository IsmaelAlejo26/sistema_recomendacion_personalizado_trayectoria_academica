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
import capitalize from './capitalize';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const [currentSubjects, setSubjects] = useState([]);
  const [currentSkills, setSkills] = useState([]);
  // const [exists, setExists] = useState(false);
  // let contador = 0;
  const [count, setCount] = useState(0);
  const [countSkills, setCountSkills] = useState(0);

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

  const handleSelectSkill = (skill) => {
    // console.log("asdasdasdasd");
    let exists = false;
    if (currentSkills.length === 0) {
      setSkills(prev => [...prev, skill]);
      setCountSkills(prev => prev + 1);
      setMessage("");
      setError("");
    } else {
      currentSkills.forEach(sk => {
        if (sk === skill) {
          setMessage("Ya has agregado esta habilidad");
          setError("Repetición");
          exists = true;
        }
      });
      if (!exists) {
        setSkills(prev => [...prev, skill]);
        setCountSkills(prev => prev + 1);
        setMessage("");
        setError("");
      }
    }
  };

  const handleVoidSubjectSelected = () => {
    setMessage("Selecciona una materia");
    setError("Falta seleccionar materia");
  }

  const handleVoidSkillSelected = () => {
    setMessage("Selecciona una habilidad");
    setError("Falta seleccionar materia");
  }

  const sendRequest = (objectives) => {
    if (currentSkills.length <= 0) {
      setMessage("Agrega por lo menos una habilidad a la lista");
      setError("Faltan habilidades");
      return;
    }

    if (currentSubjects.length <= 0) {
      // OBLIGATORIO
      setMessage("Agrega por lo menos una materia a la lista");
      setError("Faltan materias");
      return;
    }

    if (!objectives) {
      // OBLIGATORIO
      setMessage("Escribe algo en metas profesionales");
      setError("Faltan metas");
      return;
    }

    if (objectives.trim().length < 50) {
      setMessage("Escribe más de 50 letras en metas profesionales");
      setError("Faltan letras en metas");
      return;
    }
    handleSubmit(objectives);
    return;
  }

  const handleDeleteSubject = (subject) => {
    // let exists = false; // Se supone que el botón está cuando hay uno agregado
    setSubjects(prev => prev.filter((sub) => sub !== subject));
    setCount(prev => prev - 1);
    setMessage("");
    setError("");
  }

  const handleDeleteSkill = (skill) => {
    // let exists = false; // Se supone que el botón está cuando hay uno agregado
    setSkills(prev => prev.filter((sk) => sk !== skill));
    setCountSkills(prev => prev - 1);
    setMessage("");
    setError("");
  }

  const [loading, setLoading] = useState(false);
  // PRUEBAS
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (objectives) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subjects: currentSubjects, skills: currentSkills, goals: objectives }),
      });
      const data = await res.json();
      if (data.error === "invalid_goals") {
        setMessage(data.message);
        setError("Metas no válidas");
      } else {
        handleCleanAll();
        console.log(data.recommendations); // { recommendations: [...] }
        setRecommendations(data.recommendations);
        setMessage("¡Recomendaciones generadas!");
      }
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
    setCountSkills(0);
    setSubjects([]);
    setSkills([]);
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

  // ESTADOS DE LOS DATOS RECOMENDADOS
  const [category, setCategory] = useState("");

  return (
    <>
      <button type='button' className='font-20 jost-400 bt_togglemode' onClick={() => toggleDark()}>
        {darkMode ? <MdOutlineWbSunny /> : <RiMoonLine />}
      </button>
      <div className='c_everything'>
        <div className='c_selected'>
          <div className='c_subjectSelected'>
            <Subject
              onSelectSubject={handleSelectSubject}
              onSelectSkill={handleSelectSkill}
              onCleanAll={handleCleanAll}
              onVoidSubjectSelect={handleVoidSubjectSelected}
              onVoidSkillSelect={handleVoidSkillSelected}
              onShowRecommendatios={sendRequest}
            />
            <p className={`no-margin ${error !== "" ? 'red' : 'green'} font-18 jost-400 tx_state`}>{message}</p>
          </div>
          <div className='c_added'>
            <div className='c_skillsAdded'>
              <p className='font-20 jost-600'>Habilidades: {countSkills}</p>
              {/* AQUI SE AGREGAN LAS MATERIAS SELECCIONADAS */}
              {currentSkills.length === 0 ? (
                <span className='font-18 jost-400'> No hay ninguna habilidad agregada. </span>
              ) : (
                currentSkills.map((sk) => {
                  return (
                    <div className='c_subject'>
                      <p key={sk} className='font-18 jost-400 no-padding no-margin'>{sk}</p>
                      <button type='button' onClick={() => handleDeleteSkill(sk)} className='font-18 jost-400 bt_delete'>Descartar</button>
                    </div>
                  )
                })
              )}
            </div>
            <div className='c_subjectAdded'>
              {/* Nada más cuenta las materias que se han agregado */}
              <p className='font-20 jost-600'>Materias con mal rendimiento: {count}</p>
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
        </div>
        <div div className='c_results'>
          {loading ? (
            <>
              <img src="public/carga_gid.gif" className='img_carga' />
              {/*<p className='font-20 jost-600'>Cargando...</p>*/}
            </>
          ) : (
            recommendations.length === 0 ? (
              <>
                <p className='font-32 jost-400'>
                  Aquí se mostrarán los resultados</p>
              </>
            ) : (
              <>
                {/* HABILIDADES */}
                <h2 className='font-28 jost-600'>Recomendaciones basadas en: Habilidad</h2>
                {recommendations.map((rec) => (
                  rec.category === "habilidad" ? (
                    <>
                      <h2 className='font-20 jost-600 h2_name'>Habilidad: {capitalize(rec.name)}</h2>
                      {rec.resources.map((recomm) => (
                        <Recommendation resource={recomm} />
                      ))}
                    </>
                  ) : ""
                ))}
                {/* MATERIAS */}
                <h2 className='font-28 jost-600'>Recomendaciones basadas en: Materia</h2>
                {recommendations.map((rec) => (
                  rec.category === "materia" ? (
                    <>
                      <h2 className='font-20 jost-600 h2_name'>Materia: {capitalize(rec.name)}</h2>
                      {rec.resources.map((recomm) => (
                        <Recommendation resource={recomm} />
                      ))}
                    </>
                  ) : ""
                ))}
                {/* METAS */}
                <h2 className='font-28 jost-600'>Recomendaciones basadas en: Meta profesional</h2>
                {recommendations.map((rec) => (
                  rec.category === "meta" ? (
                    <>
                      <h2 className='font-20 jost-600 h2_name'>Meta profesional: {capitalize(rec.name)}</h2>
                      {rec.resources.map((recomm) => (
                        <Recommendation resource={recomm} />
                      ))}
                    </>
                  ) : ""
                ))}
              </>
            )
          )}
        </div>
      </div>
    </>
  )
}

export default App;

/*
              // Materias
              <>
                <h2 className='font-28 jost-600'>Materia</h2>
                
              </>
              <>
                <h2 className='font-28 jost-600'>{capitalize(recoSub.category)}</h2>
                {recommendations.map((recoSub) => (
                  (recoSub.category === "materia" && (
                    <>
                      <h2 className='font-20 jost-600'>{capitalize(recoSub.name)}</h2>
                      {recoSub.resources.map((recomm) => (
                        <Recommendation resource={recomm} />
                      ))}
                    </>
                  )))
                }
              </>
            )

            */