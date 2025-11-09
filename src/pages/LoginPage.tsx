import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { LoginCredentials } from '../types/Financial';
import { Link } from 'react-router-dom'; // Importa Link per il riferimento alla registrazione
import ErrorMessage from '../components/common/ErrorMessage';
import Spinner from '../components/common/Spinner';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Chiama la funzione di login definita nel tuo AuthContext
      await login(credentials);
      // Reindirizzamento gestito internamente dal contesto
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Credenziali non valide. Riprova.");
      } else {
        setError(String(err) || "Credenziali non valide. Riprova.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          
          <div className="card shadow-lg">
            <div className="card-header text-center bg-primary text-white">
              <h4 className="mb-0">Accedi a Banklify</h4>
            </div>
            
            <div className="card-body">
              {error && <ErrorMessage message={error} />}

              <form onSubmit={handleSubmit}>
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email" 
                    placeholder="Esempio: test@banklify.it" 
                    value={credentials.email} 
                    onChange={handleChange} 
                    required 
                    className="form-control"
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input 
                    type="password" 
                    id="password"
                    name="password" 
                    placeholder="Password" 
                    value={credentials.password} 
                    onChange={handleChange} 
                    required 
                    className="form-control"
                    disabled={loading}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-primary w-100"
                >
                  {loading ? (
                    <>
                      <Spinner /> Accesso in corso...
                    </>
                  ) : (
                    'Accedi'
                  )}
                </button>
              </form>
            </div>
          </div>
          
          {/* Riferimento alla Pagina di Registrazione */}
          <p className="mt-3 text-center">
            Non hai un conto? <Link to="/register" className="text-decoration-none">Registrati qui</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;