const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'
export function App() { return <main><section><span className="eyebrow">MINDCHECK</span><h1>Base do projeto pronta.</h1><p>Frontend configurado para evolução incremental, testes e integração com a API.</p><small>API: {apiUrl}</small></section></main> }
