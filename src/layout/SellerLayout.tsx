import React from 'react';
import { Outlet } from 'react-router-dom';
import SellerSidebar from '../components/seller/SellerSidebar';
import '../css/seller.css';

const SellerLayout: React.FC = () => {
  return (
    <div className="seller-layout">
      <SellerSidebar />
      <main className="seller-main">
        <Outlet />
      </main>
    </div>
  );
};

export default SellerLayout;