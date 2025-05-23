import React, { useState } from 'react';

const encuestaPreguntas = [
  // (Tus preguntas igual que antes)
  {
    id: 'edad',
    pregunta: '¿Cuál es tu edad?',
    opciones: ['Menos de 30', '30 a 45', '46 a 60', 'Más de 60'],
  },
  {
    id: 'objetivo',
    pregunta: '¿Cuál es tu objetivo principal con esta inversión?',
    opciones: [
      'Ahorro para una meta específica',
      'Retiro',
      'Generar ingresos periódicos',
      'Incrementar capital',
    ],
  },
  {
    id: 'horizonte',
    pregunta: '¿En cuánto tiempo planeas usar el dinero invertido?',
    opciones: ['Menos de 1 año', '1 a 3 años', '3 a 5 años', 'Más de 5 años'],
  },
  {
    id: 'comodidadRiesgo',
    pregunta: '¿Qué tan cómodo te sientes con las pérdidas temporales en tus inversiones?',
    opciones: ['Nada cómodo', 'Poco cómodo', 'Algo cómodo', 'Muy cómodo'],
  },
  {
    id: 'experiencia',
    pregunta: '¿Qué nivel de experiencia tienes con inversiones?',
    opciones: [
      'Ninguna',
      'Básica (he escuchado de fondos, acciones, etc.)',
      'Moderada (he invertido en algunos productos antes)',
      'Alta (gestiono activamente mis inversiones)',
    ],
  },
  {
    id: 'situacionFinanciera',
    pregunta: '¿Cuál es tu situación financiera actual?',
    opciones: [
      'Mis ingresos apenas cubren mis gastos',
      'Tengo algunos ahorros',
      'Tengo ahorros sólidos y capacidad de inversión mensual',
      'Alta capacidad de inversión',
    ],
  },
  {
    id: 'montoInversion',
    pregunta: '¿Qué monto planeas invertir inicialmente?',
    opciones: ['Menos de $1,000', '$1,000 - $10,000', '$10,000 - $50,000', 'Más de $50,000'],
  },
];

function interpretarRespuestas(respuestas) {
  let score = 0;

  switch (respuestas.comodidadRiesgo) {
    case 'Nada cómodo':
      score += 0;
      break;
    case 'Poco cómodo':
      score += 1;
      break;
    case 'Algo cómodo':
      score += 2;
      break;
    case 'Muy cómodo':
      score += 3;
      break;
  }

  switch (respuestas.horizonte) {
    case 'Menos de 1 año':
      score += 0;
      break;
    case '1 a 3 años':
      score += 1;
      break;
    case '3 a 5 años':
      score += 2;
      break;
    case 'Más de 5 años':
      score += 3;
      break;
  }

  switch (respuestas.experiencia) {
    case 'Ninguna':
      score += 0;
      break;
    case 'Básica (he escuchado de fondos, acciones, etc.)':
      score += 1;
      break;
    case 'Moderada (he invertido en algunos productos antes)':
      score += 2;
      break;
    case 'Alta (gestiono activamente mis inversiones)':
      score += 3;
      break;
  }

  switch (respuestas.situacionFinanciera) {
    case 'Mis ingresos apenas cubren mis gastos':
      score += 0;
      break;
    case 'Tengo algunos ahorros':
      score += 1;
      break;
    case 'Tengo ahorros sólidos y capacidad de inversión mensual':
      score += 2;
      break;
    case 'Alta capacidad de inversión':
      score += 3;
      break;
  }

  if (score <= 4) {
    return {
      perfil: 'Conservador',
      recomendacion: 'Fondos de renta fija, bonos gubernamentales, inversiones de bajo riesgo.',
    };
  } else if (score <= 8) {
    return {
      perfil: 'Moderado',
      recomendacion:
        'Fondos mixtos, combinación de renta fija y variable, diversificación moderada.',
    };
  } else {
    return {
      perfil: 'Agresivo',
      recomendacion:
        'Fondos de renta variable, acciones, inversiones con mayor riesgo y potencial de retorno.',
    };
  }
}

export default function Encuesta() {
  const [respuestas, setRespuestas] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [resultado, setResultado] = useState(null);

  function handleChange(e, id) {
    setRespuestas((prev) => ({
      ...prev,
      [id]: e.target.value,
    }));
  }

  const enviarRespuestas = async (respuestasInterpretadas) => {
    try {
      const res = await fetch('http://localhost:3001/api/respuestas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(respuestasInterpretadas),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error enviando datos al backend:', error);
      throw error;
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (Object.keys(respuestas).length !== encuestaPreguntas.length) {
      alert('Por favor, responde todas las preguntas.');
      return;
    }

    const interpretacion = interpretarRespuestas(respuestas);

    try {
      await enviarRespuestas({
        data: respuestas,
        perfil: interpretacion.perfil,
        recomendacion: interpretacion.recomendacion,
      });
      setResultado(interpretacion);
      setEnviado(true);
    } catch {
      alert('Hubo un error enviando los datos. Por favor, intenta de nuevo.');
    }
  }

  if (enviado) {
    return (
      <div style={{ maxWidth: 600, margin: 'auto' }}>
        <h2>¡Gracias por completar la encuesta!</h2>
        <p>
          <strong>Perfil:</strong> {resultado.perfil}
        </p>
        <p>
          <strong>Recomendación:</strong> {resultado.recomendacion}
        </p>
        <p>Un asesor se pondrá en contacto contigo pronto.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: 'auto' }}>
      <h1>Encuesta para recomendaciones de inversión</h1>
      {encuestaPreguntas.map(({ id, pregunta, opciones }) => (
        <div key={id} style={{ marginBottom: 20 }}>
          <p>
            <strong>{pregunta}</strong>
          </p>
          {opciones.map((opcion) => (
            <label key={opcion} style={{ display: 'block', marginBottom: 5 }}>
              <input
                type="radio"
                name={id}
                value={opcion}
                checked={respuestas[id] === opcion}
                onChange={(e) => handleChange(e, id)}
                required
              />{' '}
              {opcion}
            </label>
          ))}
        </div>
      ))}
      <button type="submit" style={{ padding: '10px 20px', fontSize: 16 }}>
        Enviar
      </button>
    </form>
  );
}
