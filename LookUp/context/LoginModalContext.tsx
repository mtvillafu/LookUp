
import React, { createContext, useContext, useState } from "react";

// define the loginModal's data
interface LoginModalContextProps {
  isLoginModalVisible: boolean;
  showLoginModal: () => void;
  hideLoginModal: () => void;
}

// create the context area with undefined init value, this requires a wrapper which is handled in _layout.tsx
const LoginModalContext = createContext<LoginModalContextProps | undefined>(undefined);

// wraps parts of the app where the login modal is needed, stores state and show / hide function
export const LoginModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);

  // show/hide modal
  const showLoginModal = () => setLoginModalVisible(true);
  const hideLoginModal = () => setLoginModalVisible(false);

  return (
    // show the state / functions to all children components.
    <LoginModalContext.Provider value={{ isLoginModalVisible, showLoginModal, hideLoginModal }}>
      {children}
    </LoginModalContext.Provider>
  );
};

// allows components inside LoginModalProvider to access the modal's state & functionality
export const useLoginModal = () => {
  const context = useContext(LoginModalContext);

  // throws error if outside of provider.
  if (!context) {
    throw new Error("useLoginModal must be used within a LoginModalProvider");
  }
  return context;
};
