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
    taxCode: '',
    street: '',
    houseNumber: '',
    city: '',
    province: '',
    zipCode: '',
    phoneNumber: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== confirmPassword) {
      setError('Le password non coincidono.');
      setLoading(false);
      return; 
    }

    if (formData.password.length < 8) {
        setError('La password deve essere di almeno 8 caratteri.');
        setLoading(false);
        return;
    }

    try {
      await register(formData);
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message || 'Errore sconosciuto durante la registrazione.');
        } else {
            setError(String(err) || 'Errore sconosciuto durante la registrazione.');
        }
        setLoading(false);
    }
  };

  const isFormInvalid = 
    loading ||
    !formData.firstName ||
    !formData.lastName ||
    !formData.email ||
    !formData.password ||
    !confirmPassword ||
    formData.password !== confirmPassword ||
    formData.password.length < 8 ||
    !formData.taxCode ||
    !formData.street ||
    !formData.houseNumber ||
    !formData.city ||
    !formData.province ||
    !formData.zipCode ||
    !formData.phoneNumber;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-5"> 
          
          <div className="card shadow-lg">
            <div className="card-header text-center bg-success text-white">
              <h4 className="mb-0">Registrati</h4>
            </div>
            
            <div className="card-body">

              <div className="text-center mb-4">
                  <img 
                      src={BanklifyLogoHorizontal} 
                      alt="Banklify Logo" 
                      className="img-fluid mb-3" 
                      style={{ maxHeight: '100px' }}
                  />
              </div>

              {error && <ErrorMessage message={error} />}

              <form onSubmit={handleSubmit}>
                
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

                <div className="mb-3">
                  <label htmlFor="taxCode" className="form-label">Codice Fiscale</label>
                  <input 
                    name="taxCode" 
                    type="text" 
                    id="taxCode" 
                    placeholder="RSSMRA80A01H501U" 
                    value={formData.taxCode} 
                    onChange={handleChange} 
                    required 
                    className="form-control text-uppercase"
                    disabled={loading}
                    maxLength={16}
                  />
                </div>

                <div className="row mb-3">
                    <div className="col-md-9">
                        <label htmlFor="street" className="form-label">Via / Piazza</label>
                        <input name="street" type="text" id="street" placeholder="Via Roma" value={formData.street} onChange={handleChange} required className="form-control" disabled={loading}/>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="houseNumber" className="form-label">N° Civico</label>
                        <input name="houseNumber" type="text" id="houseNumber" placeholder="10" value={formData.houseNumber} onChange={handleChange} required className="form-control" disabled={loading}/>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-3">
                        <label htmlFor="zipCode" className="form-label">CAP</label>
                        <input name="zipCode" type="text" id="zipCode" placeholder="20121" value={formData.zipCode} onChange={handleChange} required className="form-control" disabled={loading} maxLength={5}/>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="city" className="form-label">Città</label>
                        <input name="city" type="text" id="city" placeholder="Milano" value={formData.city} onChange={handleChange} required className="form-control" disabled={loading}/>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="province" className="form-label">Provincia</label>
                        <input 
                            name="province" 
                            type="text" 
                            id="province" 
                            placeholder="MI" 
                            value={formData.province} 
                            onChange={handleChange} 
                            required 
                            className="form-control text-uppercase" 
                            disabled={loading}
                            maxLength={2}
                        />
                    </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="phoneNumber" className="form-label">Telefono</label>
                  <input 
                    name="phoneNumber" 
                    type="tel"
                    id="phoneNumber" 
                    placeholder="+39 333 1234567" 
                    value={formData.phoneNumber} 
                    onChange={handleChange} 
                    required 
                    className="form-control" 
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input name="email" type="email" id="email" placeholder="La tua email" value={formData.email} onChange={handleChange} required className="form-control" disabled={loading}/>
                </div>

                <div className="row mb-4">
                    <div className="col-md-6 mb-3 mb-md-0">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input 
                            name="password" 
                            type="password" 
                            id="password" 
                            placeholder="Password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                            className="form-control" 
                            disabled={loading}
                            minLength={8}
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="confirmPassword" className="form-label">Conferma Password</label>
                        <input 
                            name="confirmPassword" 
                            type="password" 
                            id="confirmPassword" 
                            placeholder="Ripeti Password" 
                            value={confirmPassword} 
                            onChange={handleConfirmPasswordChange} 
                            required 
                            className={`form-control ${confirmPassword && formData.password !== confirmPassword ? 'is-invalid' : ''}`}
                            disabled={loading}
                        />
                        {confirmPassword && formData.password !== confirmPassword && (
                            <div className="invalid-feedback">
                                Le password non coincidono
                            </div>
                        )}
                    </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isFormInvalid}
                  className="btn btn-primary w-100"
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