// src/components/ToastProvider.jsx
import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: '#fff',
        border: '1px solid #00786A',
        },
        success: {
          theme: {
            primary: 'green',
            secondary: 'black',
          },
        },
      }}
    />
  );
}