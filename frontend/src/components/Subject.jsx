import subjects from '../subjects'
import { useEffect, useState } from 'react';
import './Subject.css';
import '../General.css'

export default function Subject({ onSelectSubject, onCleanAll, onVoidSelect }) {
    const [currentSubjects, setSubjects] = useState(subjects[0].subjects);
    const [subject, setSubject] = useState(""); // La materia a mandar
    const [currentSemester, setSemester] = useState(1);
    // const selectedSubjects = [];

    // Cada que cambie el semestre, cambian las materias
    // console.log(subjects);

    const changeSubjects = () => {
        // console.log(subjects[semester - 1].subjects);
        setSubjects(subjects[currentSemester - 1].subjects);
    }

    useEffect(() => {
        changeSubjects();
    }, [currentSemester]);

    const sendSubject = (subjectSelect) => {
        // selectedSubjects.push(subjectSelect);
        // console.log("dasdasdasdasd");
        if(subjectSelect !== '-' && subjectSelect !== ""){
            onSelectSubject(subjectSelect);
            setSubject("");
            return;
        }
        // No se seleccionó un valor
        onVoidSelect();
    }

    /**
     * c_ = contenedor
     * t_ = titulo
     * tx_ = texto
     * in_ = input
     * bt_ = button
     * sc_ = seccion
     * sp_ = span
     */

    return (
        <div className='c_materia'>
            <div className='c_title'>
                <h3 className='t_materias font-32 no-padding no-margin jost-600'>Materias</h3>
                <button 
                type='button' 
                className='jost-400 font-18 bt_clean'
                onClick={() => onCleanAll()}>Limpiar todo</button>
            </div>
            <section className='selectSemester sc_general'>
                <span className='jost-400 font-20'>Selecciona el semestre de la materia:</span>
                <div className='c_select'>
                    <button 
                    type='button'
                    onClick={() => {
                        currentSemester > 1 ? setSemester(prev => prev - 1) : setSemester(1);
                    }}
                    className='bt_select font-20 jost-400'
                    >-</button>
                    <span 
                    className='sp_semester font-20 jost-400'
                    >{currentSemester}</span>
                    <button 
                    type='button'
                    onClick={() => {
                        currentSemester < 8 ? setSemester(prev => prev + 1) : setSemester(8);
                    }}
                    className='bt_select font-20 jost-400'>
                    +</button>
                </div>
            </section>
            <section className='selectSubject sc_materia'>
                <span className='jost-400 font-20'>Selecciona la materia: </span>
                <select
                    value={subject}
                    name="selSub" id=""
                    onChange={(e) => setSubject(e.target.value)}
                    className='jost-400 font-16 in_general in_selection'>
                    <option
                        value="-"
                        className='jost-400 font-16 in_general'> -- Selecciona una opción --</option>
                    {currentSubjects && currentSubjects.map((sub) => (
                        <option
                            key={sub}
                            value={sub}
                            className='jost-400 font-16 in_general'>{sub}</option>
                    ))}
                </select>
            </section>
            <button
                type='button'
                onClick={() => sendSubject(subject)}
                className='jost-400 font-18 bt_agregar'
            > + Agregar materia </button>
        </div>
    );
}