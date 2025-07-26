'use client';

import { useState } from 'react';

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>eGrow Academy - Test Page</h1>
      <p>Esta es una página de prueba para identificar el problema de webpack.</p>
      <button 
        onClick={() => setCount(count + 1)}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Contador: {count}
      </button>
      <p>Si puedes ver esta página y el botón funciona, el problema está en algún componente específico.</p>
    </div>
  );
}
