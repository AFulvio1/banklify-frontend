export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (request: RegisterRequest) => Promise<void>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  firstName?: string; 
}

export interface RegisterRequest extends LoginCredentials {
  firstName: string;
  lastName: string;
}

export interface BalanceDTO {
  iban: string;
  ledgerBalance: string;
  availableBalance: string;
}

export interface TransactionDTO {
  transactionId: number;
  timestamp: string;
  amount: string;
  transactionType: string;
  description: string;
}

export interface TransferDTO {
  senderIban: string;
  receiverIban: string;
  amount: string; 
  description: string;
}

export interface BackendErrorResponse {
  error: string; 
  timestamp?: string;
  status?: number;
  path?: string;
}