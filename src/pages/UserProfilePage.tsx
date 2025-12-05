import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client'; // Usa il nuovo client centralizzato
import { useAuth } from '../hooks/useAuth';
import type { UserProfileDTO } from '../types/Models';
import Spinner from '../components/common/Spinner';
import BanklifyLogoHorizontal from '../assets/logo-banklify-horizontal.png';

const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [profile, setProfile] = useState<UserProfileDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        const response = await client.get<UserProfileDTO>('/client/profile');
        setProfile(response.data);
      } catch (err) {
        console.debug("Errore recupero profilo:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated]);

  if (loading) {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <Spinner /> <p className="ms-2 text-muted">Caricamento profilo...</p>
        </div>
    );
  }

  if (!profile) {
    return (
        <div className="container mt-5">
            <div className="card shadow-sm p-4 mx-auto text-center" style={{ maxWidth: '600px' }}>
                <h4 className="text-danger mb-3">Profilo non disponibile</h4>
                <p className="text-muted">Impossibile visualizzare i dati utente. Riprova più tardi.</p>
                <button onClick={() => navigate('/dashboard')} className="btn btn-primary mt-3">
                    Torna alla Dashboard
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light d-flex flex-column align-items-center justify-content-center p-4">
      
      <div className="mb-4 text-center">
        <img 
          src={BanklifyLogoHorizontal} 
          alt="Banklify" 
          className="img-fluid"
          style={{ maxHeight: '70px' }} 
        />
      </div>

      <div className="card shadow-lg border-0 w-100 overflow-hidden rounded-4" style={{ maxWidth: '1200px' }}>
        
        <div className="py-3 text-center text-white fw-bold fs-4 rounded-top-4" style={{ backgroundColor: '#0d2e5b' }}>
          Il tuo Profilo
        </div>

        <div className="card-body p-5">
          
          <form>
            <div className="row g-5">
              
              <div className="col-lg-6">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-medium text-muted">Nome</label>
                    <input type="text" className="form-control bg-light" value={profile.firstName} readOnly />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium text-muted">Cognome</label>
                    <input type="text" className="form-control bg-light" value={profile.lastName} readOnly />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-medium text-muted">Data di Nascita</label>
                    <input type="date" className="form-control bg-light" value={profile.birthDate} readOnly />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-medium text-muted">Codice Fiscale</label>
                    <input type="text" className="form-control bg-light text-uppercase" value={profile.taxCode} readOnly />
                  </div>

                  <div className="col-12 mt-4"></div>

                  <div className="col-md-9">
                    <label className="form-label fw-medium text-muted">Via / Piazza</label>
                    <input type="text" className="form-control bg-light" value={profile.address} readOnly />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-medium text-muted">N°</label>
                    <input type="text" className="form-control bg-light" value={profile.houseNumber} readOnly />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-medium text-muted">CAP</label>
                    <input type="text" className="form-control bg-light" value={profile.zipCode} readOnly />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-medium text-muted">Città</label>
                    <input type="text" className="form-control bg-light" value={profile.city} readOnly />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-medium text-muted">Provincia</label>
                    <input type="text" className="form-control bg-light text-uppercase" value={profile.province} readOnly />
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-medium text-muted">Telefono</label>
                    <input type="text" className="form-control bg-light" value={profile.phoneNumber} readOnly />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-medium text-muted">Email</label>
                    <input type="text" className="form-control bg-light" value={profile.email} readOnly />
                  </div>

                  <div className="col-12 mt-5">
                    <button 
                      type="button" 
                      onClick={() => navigate('/dashboard')}
                      className="btn btn-outline-secondary btn-lg w-100 fw-bold py-2"
                    >
                      Torna alla Dashboard
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;