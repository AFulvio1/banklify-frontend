import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';
import toast from 'react-hot-toast';
import Spinner from '../components/common/Spinner';
import BanklifyLogoHorizontal from '../assets/logo-banklify-horizontal.png';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '', 
    taxCode: '',
    address: '',
    houseNumber: '',
    zipCode: '',
    city: '',
    province: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Le password non coincidono.");
      return;
    }

    setLoading(true);

    try {
      await client.post('/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
        taxCode: formData.taxCode,
        email: formData.email,
        password: formData.password,
        address: formData.address,
        houseNumber: formData.houseNumber,
        city: formData.city,
        zipCode: formData.zipCode,
        province: formData.province,
        phoneNumber: formData.phoneNumber
      });

      toast.success('Registrazione avvenuta con successo!');
      navigate('/login');
      
    } catch {
      console.debug("Errore registrazione gestito globalmente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 vw-100 bg-light d-flex flex-column align-items-center justify-content-center m-0 overflow-hidden p-3">
      
      <div className="mb-3 text-center flex-shrink-0">
        <img 
          src={BanklifyLogoHorizontal} 
          alt="Banklify" 
          className="img-fluid"
          style={{ maxHeight: '80px' }} // Logo leggermente più piccolo per salvare spazio verticale
        />
      </div>

      <div className="card shadow-lg border-0 w-100 rounded-4 d-flex flex-column" style={{ maxWidth: '1000px', maxHeight: '85vh' }}>
        
        <div className="py-3 text-center text-white fw-bold fs-5 rounded-top-4 flex-shrink-0" style={{ backgroundColor: '#0d2e5b' }}>
          Registrati
        </div>

        <div className="card-body p-4 overflow-y-auto">
          
          <form onSubmit={handleSubmit}>
            
            <div className="row g-3">
              
              <div className="col-lg-6">
                <div className="row g-2">
                  <div className="col-md-6">
                    <label className="form-label fw-medium small">Nome</label>
                    <input
                      type="text"
                      name="firstName"
                      className="form-control"
                      placeholder="Mario"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium small">Cognome</label>
                    <input
                      type="text"
                      name="lastName"
                      className="form-control"
                      placeholder="Rossi"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-medium small">Data di Nascita</label>
                    <input
                      type="date"
                      name="birthDate"
                      className="form-control"
                      value={formData.birthDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-medium small">Codice Fiscale</label>
                    <input
                      type="text"
                      name="taxCode"
                      className="form-control text-uppercase"
                      placeholder="RSSMRA80A01H501U"
                      value={formData.taxCode}
                      onChange={handleChange}
                      required
                      maxLength={16}
                    />
                  </div>

                  <div className="col-12 my-1"><hr className="text-muted opacity-25"/></div>

                  <div className="col-md-9">
                    <label className="form-label fw-medium small">Via / Piazza</label>
                    <input
                      type="text"
                      name="address"
                      className="form-control"
                      placeholder="Via Roma"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-medium small">N° Civico</label>
                    <input
                      type="text"
                      name="houseNumber"
                      className="form-control"
                      placeholder="10"
                      value={formData.houseNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-medium small">CAP</label>
                    <input
                      type="text"
                      name="zipCode"
                      className="form-control"
                      placeholder="20121"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                      maxLength={5}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium small">Città</label>
                    <input
                      type="text"
                      name="city"
                      className="form-control"
                      placeholder="Milano"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-medium small">Prov</label>
                    <input
                      type="text"
                      name="province"
                      className="form-control text-uppercase"
                      placeholder="MI"
                      value={formData.province}
                      onChange={handleChange}
                      required
                      maxLength={2}
                    />
                  </div>
                </div>
              </div>

              <div className="col-lg-6 d-flex flex-column justify-content-between">
                <div className="row g-2">
                  <div className="col-12">
                    <label className="form-label fw-medium small">Telefono</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      className="form-control"
                      placeholder="+39 333 1234567"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-medium small">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="nome@esempio.it"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 my-1"><hr className="text-muted opacity-25"/></div>

                  <div className="col-12">
                    <label className="form-label fw-medium small">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-medium small">Conferma Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="col-12 mt-4">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg w-100 fw-bold py-2 shadow-sm"
                      disabled={loading}
                      style={{ backgroundColor: '#0d2e5b', borderColor: '#0d2e5b' }}
                    >
                      {loading ? (
                        <span><Spinner /> Creazione in corso...</span>
                      ) : (
                        "Crea il conto"
                      )}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </form>
        </div>
        
        <div className="card-footer text-center py-3 bg-light border-0 flex-shrink-0">
          <p className="mb-0 text-muted small">
            Hai già un conto? <Link to="/login" className="fw-bold text-primary text-decoration-none">Accedi qui</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;