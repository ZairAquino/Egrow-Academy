'use client';

import { useState } from 'react';
import RegisterForm from '@/components/auth/RegisterForm';

import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import CompaniesMarquee from '@/components/ui/CompaniesMarquee';

export default function RegisterPage() {
  

  

  return (
    <>
      <Navbar hideSidebar={true} />
      <main className="main-content pt-16" style={{ 
        padding: '0.5rem 0.5rem 0',
        height: 'calc(100vh - 200px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '0 1rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          maxWidth: '1200px',
          margin: '0 auto',
          flex: '1',
          overflow: 'auto'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: 'bold',
              color: '#2d3748',
              marginBottom: '0.5rem',
              margin: 0
            }}>
              ¡Únete a la comunidad!
            </h1>
            <p style={{
              color: '#718096',
              fontSize: '1rem',
              margin: 0
            }}>
              Comienza tu viaje en inteligencia artificial
            </p>
          </div>

          {/* Form */}
          <RegisterForm />
        </div>
        
        {/* Marquesina de empresas */}
        <div style={{ flexShrink: 0 }}>
          <CompaniesMarquee />
        </div>
      </main>
      
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  )
}