/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, type ReactNode } from "react";
import { LeadModal } from "../components/modals/LeadModal";

type LeadModalContextValue = {
  openLeadModal: () => void;
  closeLeadModal: () => void;
};

const LeadModalContext = createContext<LeadModalContextValue | null>(null);

type LeadModalProviderProps = {
  children: ReactNode;
};

export function LeadModalProvider({ children }: LeadModalProviderProps) {
  const [isOpen, setOpen] = useState(false);

  function openLeadModal() {
    setOpen(true);
  }

  function closeLeadModal() {
    setOpen(false);
  }

  return (
    <LeadModalContext.Provider value={{ openLeadModal, closeLeadModal }}>
      {children}
      <LeadModal isOpen={isOpen} onClose={closeLeadModal} />
    </LeadModalContext.Provider>
  );
}

export function useLeadModal() {
  const context = useContext(LeadModalContext);

  if (!context) {
    throw new Error("useLeadModal must be used inside LeadModalProvider.");
  }

  return context;
}
