// src/hooks/useAuth.ts

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import type { AuthContextType } from '../types/Models'; 

export const useAuth = (): AuthContextType => { 
    const context = useContext(AuthContext);
    
    if (context === undefined) {
        throw new Error('useAuth deve essere usato all\'interno di un AuthProvider');
    }
    
    return context; 
};