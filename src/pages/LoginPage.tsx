import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { LoginCredentials } from '../types/Models';
import { Link } from 'react-router-dom';
import Spinner from '../components/common/Spinner';
import BanklifyLogoHorizontal from '../assets/logo-banklify-horizontal.png';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(credentials);
    } catch {
      console.debug("Login fallito (gestito globalmente)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 vw-100 bg-light d-flex flex-column align-items-center justify-content-center m-0 overflow-hidden">
      
      <div className="mb-4 text-center">
        <img 
          src={BanklifyLogoHorizontal} 
          alt="Banklify Logo" 
          className="img-fluid"
          style={{ maxHeight: '100px' }} 
        />
      </div>

      <div className="card shadow-lg border-0 w-100 overflow-hidden rounded-4" style={{ maxWidth: '450px' }}>
        
        <div className="py-3 text-center text-white fw-bold fs-4 rounded-top-4" style={{ backgroundColor: '#0d2e5b' }}>
          Login
        </div>
        
        <div className="card-body p-4 p-md-5">

          <form onSubmit={handleSubmit}>
            
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-medium">Email</label>
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

            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-medium">Password</label>
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
              className="btn btn-primary w-100 fw-bold py-2"
              style={{ backgroundColor: '#0d2e5b', borderColor: '#0d2e5b' }}
            >
              {loading ? ( <> <Spinner /> Accesso in corso... </> ) : ( 'Accedi' )}
            </button>
          </form>
        </div>
        
        <div className="card-footer text-center py-3 bg-light border-0">
          <p className="mb-0 text-muted">
            Non hai un conto? <Link to="/register" className="fw-bold text-primary text-decoration-none">Registrati qui</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;