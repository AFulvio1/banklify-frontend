import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { RegisterRequest } from '../types/Models';
import { Link } from 'react-router-dom';
import ErrorMessage from '../components/common/ErrorMessage';
import Spinner from '../components/common/Spinner';
import BanklifyLogoHorizontal from '../assets/logo-banklify-horizontal.png';

const RegisterPage: React.FC = () => {
  const { register } = useAuth(); 
  
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register(formData);
      // Login automatico e reindirizzamento gestiti nel contesto
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message || 'Errore sconosciuto durante la registrazione.');
        } else {
            setError(String(err) || 'Errore sconosciuto durante la registrazione.');
        }
        setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-5"> 
          
          <div className="card shadow-lg">
            <div className="card-header text-center bg-success text-white">
              <h4 className="mb-0">Crea il tuo Conto Banklify</h4>
            </div>
            
            <div className="card-body">

              <div className="text-center mb-4">
                  <img 
                      src={BanklifyLogoHorizontal} 
                      alt="Banklify Logo" 
                      className="img-fluid mb-3" 
                      style={{ maxHeight: '100px' }}
                  />
                  <h2 className="card-title fs-3 fw-bold">Accedi al tuo conto</h2>
              </div>

              {error && <ErrorMessage message={error} />}

              <form onSubmit={handleSubmit}>
                
                {/* Riga per Nome e Cognome */}
                <div className="row mb-3">
                    <div className="col-6">
                        <label htmlFor="firstName" className="form-label">Nome</label>
                        <input name="firstName" type="text" id="firstName" placeholder="Nome" value={formData.firstName} onChange={handleChange} required className="form-control" disabled={loading}/>
                    </div>
                    <div className="col-6">
                        <label htmlFor="lastName" className="form-label">Cognome</label>
                        <input name="lastName" type="text" id="lastName" placeholder="Cognome" value={formData.lastName} onChange={handleChange} required className="form-control" disabled={loading}/>
                    </div>
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input name="email" type="email" id="email" placeholder="La tua email" value={formData.email} onChange={handleChange} required className="form-control" disabled={loading}/>
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input name="password" type="password" id="password" placeholder="Scegli una password sicura" value={formData.password} onChange={handleChange} required className="form-control" disabled={loading}/>
                </div>
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-success w-100"
                >
                  {loading ? (
                    <>
                      <Spinner /> Registrazione in corso...
                    </>
                  ) : (
                    'Crea Conto'
                  )}
                </button>
              </form>
            </div>
          </div>
          
          <p className="mt-3 text-center">
            Hai già un conto? <Link to="/login" className="text-decoration-none">Accedi qui</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;