export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  userIban: string | null;
  userFirstName: string | null;
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
  iban: string;
  firstName: string;
}

export interface RegisterRequest extends LoginCredentials {
  firstName: string;
  lastName: string;
  taxCode: string;
  address: string;
  houseNumber: string;
  city: string;
  province: string;
  zipCode: string;
  phoneNumber: string;
  birthDate: Date;
}

export interface BalanceDTO {
  iban: string;
  ledgerBalance: string;
  availableBalance: string;
}

export interface TransactionDTO {
  transactionId: number;
  eventTimestamp: string;
  amount: string;
  counterpartyName: string;
  description: string;
}

export interface TransferDTO {
  senderIban: string;
  receiverIban: string;
  receiverName: string;
  amount: string; 
  description: string;
}

export interface BackendErrorResponse {
  error: string; 
  timestamp?: string;
  status?: number;
  path?: string;
}

export interface UserProfileDTO {
  firstName: string;
  lastName: string;
  birthDate: string;
  taxCode: string;
  email: string;
  phoneNumber: string;
  address: string;
  houseNumber: string;
  zipCode: string;
  city: string;
  province: string;
}