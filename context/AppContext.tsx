'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CitizenApplication, INITIAL_APPLICATIONS, SUVIDHA_SCHEMES } from '@/lib/data';

export type UserRole = 'citizen' | 'partner' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization?: string;
  organizationId?: string;
  status: 'active' | 'inactive' | 'suspended';
  phone?: string;
  aadhaarMasked?: string;
}

export interface UserProfile {
  isLoggedIn: boolean;
  name: string;
  phone: string;
  aadhaarMasked: string;
}

export const DEMO_OFFICIAL_USERS: Record<string, { password: string; user: AuthUser }> = {
  'admin@suvidha.demo': {
    password: 'admin123',
    user: {
      id: 'usr-admin-01',
      name: 'Vikramaditya Sharma',
      email: 'admin@suvidha.demo',
      role: 'admin',
      organization: 'SUVIDHA Administration (Central Nodal Mission)',
      organizationId: 'org-suvidha-hq',
      status: 'active',
      phone: '+91 11 2338 1234',
    },
  },
  'partner@suvidha.demo': {
    password: 'partner123',
    user: {
      id: 'usr-partner-01',
      name: 'Rajesh Kumar',
      email: 'partner@suvidha.demo',
      role: 'partner',
      organization: 'State Bank of India (Varanasi Nodal Desk)',
      organizationId: 'sbi-civil-lines',
      status: 'active',
      phone: '0542-250123',
    },
  },
  'inactive@suvidha.demo': {
    password: 'inactive123',
    user: {
      id: 'usr-partner-inactive',
      name: 'Suspended Agency Agent',
      email: 'inactive@suvidha.demo',
      role: 'partner',
      organization: 'Deactivated Partner Desk',
      organizationId: 'org-deactivated',
      status: 'inactive',
      phone: '9876500000',
    },
  },
};

interface AppContextType {
  applications: CitizenApplication[];
  addApplication: (data: {
    schemeId: string;
    fullName: string;
    phone: string;
    aadhaarMasked: string;
    amount: string;
    bankBranch: string;
  }) => string;
  updateApplicationStatus: (
    arn: string,
    status: CitizenApplication['status'],
    stage: 1 | 2 | 3 | 4,
    remarks?: string
  ) => void;
  trackingQuery: string;
  setTrackingQuery: (arn: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  fontSize: 'sm' | 'md' | 'lg';
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;
  screenReaderMode: boolean;
  setScreenReaderMode: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isCompanionOpen: boolean;
  setIsCompanionOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  // Citizen profile (backward compatible)
  user: UserProfile;
  login: (phone: string, name?: string) => void;
  // Unified Auth System
  authUser: AuthUser | null;
  isAuthLoaded: boolean;
  loginAsCitizen: (phone: string, name?: string) => AuthUser;
  loginAsOfficial: (email: string, password: string) => { success: boolean; error?: string; user?: AuthUser };
  logout: () => void;
  notification: { message: string; type: 'success' | 'info' | 'error' } | null;
  showNotification: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<CitizenApplication[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedApps = localStorage.getItem('suvidha_applications');
        if (savedApps) return JSON.parse(savedApps);
      } catch {
        // ignore
      }
    }
    return INITIAL_APPLICATIONS;
  });

  const [trackingQuery, setTrackingQuery] = useState<string>('ARN-2025-UP-8841');
  const [selectedLanguage, setSelectedLanguageState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const storedLanguage = localStorage.getItem('suvidha_language');
      if (storedLanguage) return storedLanguage;

      const cookieValue = document.cookie
        .split('; ')
        .find((cookie) => cookie.startsWith('googtrans='))
        ?.split('=')[1];
      const cookieLanguage = decodeURIComponent(cookieValue ?? '').split('/').pop();
      if (cookieLanguage) return cookieLanguage;
    }
    return 'en';
  });
  const setSelectedLanguage = (lang: string) => {
    setSelectedLanguageState(lang);
    if (typeof window !== 'undefined') localStorage.setItem('suvidha_language', lang);
  };
  const [fontSize, setFontSizeState] = useState<'sm' | 'md' | 'lg'>('md');
  const [screenReaderMode, setScreenReaderMode] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isCompanionOpen, setIsCompanionOpen] = useState<boolean>(false);

  // Backward compatible citizen user state
  const [user, setUser] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedUser = localStorage.getItem('suvidha_user');
        if (savedUser) return JSON.parse(savedUser);
      } catch {
        // ignore
      }
    }
    return {
      isLoggedIn: false,
      name: 'Citizen Guest',
      phone: '',
      aadhaarMasked: '',
    };
  });

  // Unified persistent authenticated user
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedAuth = localStorage.getItem('suvidha_auth_user');
        if (savedAuth) {
          return JSON.parse(savedAuth);
        }
      } catch {
        // ignore
      }
    }
    return null;
  });

  const [isAuthLoaded] = useState<boolean>(true);

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const setFontSize = (size: 'sm' | 'md' | 'lg') => {
    setFontSizeState(size);
    if (typeof document !== 'undefined') {
      const scales: Record<'sm' | 'md' | 'lg', string> = {
        sm: '0.9rem',
        md: '1rem',
        lg: '1.125rem',
      };
      document.documentElement.style.setProperty('--font-scale', scales[size]);
    }
  };

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const addApplication = (data: {
    schemeId: string;
    fullName: string;
    phone: string;
    aadhaarMasked: string;
    amount: string;
    bankBranch: string;
  }): string => {
    const scheme = SUVIDHA_SCHEMES.find((s) => s.id === data.schemeId) || SUVIDHA_SCHEMES[0];
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const arn = `ARN-2025-UP-${randomSuffix}`;
    const today = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const newApp: CitizenApplication = {
      arn,
      schemeId: scheme.id,
      scheme: scheme.name,
      applicant: data.fullName || 'Citizen Beneficiary',
      phone: data.phone || '9876543210',
      aadhaarMasked: data.aadhaarMasked || 'XXXX-XXXX-4812',
      amount: data.amount.startsWith('₹') ? data.amount : `₹${Number(data.amount).toLocaleString('en-IN')}`,
      date: today,
      status: 'Under Verification',
      stage: 2,
      bank: data.bankBranch,
      remarks: 'Application registered digitally. Automated Aadhaar & Gram/ULB verification in progress.',
      timeline: [
        {
          title: 'Application Submitted Online',
          description: 'Citizen digital receipt registered with nodal portal. Acknowledgement sent via SMS.',
          completed: true,
          date: today,
        },
        {
          title: 'Automated Eligibility & KYC Check',
          description: 'Aadhaar e-KYC cross-referenced against public sector welfare records.',
          completed: true,
          date: 'In Progress',
        },
        {
          title: 'Bank Branch Credit Officer Review',
          description: `Desk evaluation and subsidy subvention scrutiny at ${data.bankBranch}.`,
          completed: false,
          date: 'Pending',
        },
        {
          title: 'Concessional Sanction & DBT Disbursal',
          description: 'Subject to nodal credit guarantee approval and direct DBT linkage.',
          completed: false,
          date: 'Pending',
        },
      ],
    };

    const updated = [newApp, ...applications];
    setApplications(updated);
    setTrackingQuery(arn);
    try {
      localStorage.setItem('suvidha_applications', JSON.stringify(updated));
    } catch {
      // ignore
    }

    showNotification(`Application ${arn} registered successfully!`, 'success');
    return arn;
  };

  const updateApplicationStatus = (
    arn: string,
    status: CitizenApplication['status'],
    stage: 1 | 2 | 3 | 4,
    remarks?: string
  ) => {
    const updated = applications.map((app) => {
      if (app.arn.toLowerCase() === arn.toLowerCase()) {
        const newTimeline = app.timeline.map((t, idx) => ({
          ...t,
          completed: idx + 1 <= stage,
        }));
        return {
          ...app,
          status,
          stage,
          remarks: remarks || app.remarks,
          timeline: newTimeline,
        };
      }
      return app;
    });

    setApplications(updated);
    try {
      localStorage.setItem('suvidha_applications', JSON.stringify(updated));
    } catch {
      // ignore
    }
    showNotification(`Application ${arn} updated to "${status}".`, 'info');
  };

  // Login as Citizen
  const loginAsCitizen = (phone: string, name = 'Sunita Devi'): AuthUser => {
    const citizenUser: AuthUser = {
      id: `usr-citizen-${phone.slice(-4) || '8841'}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@citizen.demo`,
      role: 'citizen',
      phone,
      aadhaarMasked: 'XXXX-XXXX-4812',
      status: 'active',
    };

    setAuthUser(citizenUser);
    setUser({
      isLoggedIn: true,
      name,
      phone,
      aadhaarMasked: 'XXXX-XXXX-4812',
    });

    try {
      localStorage.setItem('suvidha_auth_user', JSON.stringify(citizenUser));
      localStorage.setItem('suvidha_user', JSON.stringify({
        isLoggedIn: true,
        name,
        phone,
        aadhaarMasked: 'XXXX-XXXX-4812',
      }));
    } catch {
      // ignore
    }

    setIsLoginModalOpen(false);
    showNotification(`Welcome back, ${name}! Citizen session verified.`, 'success');
    return citizenUser;
  };

  // Legacy login alias
  const login = (phone: string, name = 'Sunita Devi') => {
    loginAsCitizen(phone, name);
  };

  // Login as Official (Administrator or Channel Partner)
  const loginAsOfficial = (
    email: string,
    password: string
  ): { success: boolean; error?: string; user?: AuthUser } => {
    const normalizedEmail = email.trim().toLowerCase();
    const entry = DEMO_OFFICIAL_USERS[normalizedEmail];

    if (!entry) {
      return {
        success: false,
        error: 'Invalid official credentials. Please check your registered User ID or Email.',
      };
    }

    if (entry.password !== password) {
      return {
        success: false,
        error: 'Incorrect security password. Please re-enter your official password.',
      };
    }

    if (entry.user.status === 'inactive' || entry.user.status === 'suspended') {
      return {
        success: false,
        error: 'This official account is currently deactivated. Please contact SUVIDHA Central Nodal Administration.',
      };
    }

    const authenticated = entry.user;
    setAuthUser(authenticated);

    try {
      localStorage.setItem('suvidha_auth_user', JSON.stringify(authenticated));
    } catch {
      // ignore
    }

    showNotification(
      `Authenticated successfully as ${authenticated.role === 'admin' ? 'Administrator' : 'Channel Partner'}. Welcome, ${authenticated.name}!`,
      'success'
    );

    return { success: true, user: authenticated };
  };

  // Universal Logout
  const logout = () => {
    setAuthUser(null);
    const guestUser: UserProfile = {
      isLoggedIn: false,
      name: 'Citizen Guest',
      phone: '',
      aadhaarMasked: '',
    };
    setUser(guestUser);

    try {
      localStorage.removeItem('suvidha_auth_user');
      localStorage.removeItem('suvidha_user');
    } catch {
      // ignore
    }

    showNotification('Logged out successfully.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        applications,
        addApplication,
        updateApplicationStatus,
        trackingQuery,
        setTrackingQuery,
        selectedLanguage,
        setSelectedLanguage,
        fontSize,
        setFontSize,
        screenReaderMode,
        setScreenReaderMode,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isCompanionOpen,
        setIsCompanionOpen,
        user,
        login,
        authUser,
        isAuthLoaded,
        loginAsCitizen,
        loginAsOfficial,
        logout,
        notification,
        showNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
