import React from 'react';
import { Header } from './Header';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};
