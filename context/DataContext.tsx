import React, { createContext, useContext, useState, useEffect } from 'react';
import { Document } from '../types';
import { MOCK_DOCUMENTS } from '../constants';

interface DataContextType {
  documents: Document[];
  addDocument: (doc: Document) => void;
  updateDocument: (id: string, updatedDoc: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  resetData: () => void;
  importDatabase: (data: Document[]) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from localStorage or fallback to mock data
  const [documents, setDocuments] = useState<Document[]>(() => {
    try {
      const savedDocs = localStorage.getItem('expert_tax_docs');
      return savedDocs ? JSON.parse(savedDocs) : MOCK_DOCUMENTS;
    } catch (e) {
      console.error("Failed to load data", e);
      return MOCK_DOCUMENTS;
    }
  });

  // Persist to localStorage whenever documents change
  useEffect(() => {
    try {
      localStorage.setItem('expert_tax_docs', JSON.stringify(documents));
    } catch (e) {
      console.error("Storage quota exceeded or error saving data", e);
      // Ideally show a toast notification here
    }
  }, [documents]);

  const addDocument = (doc: Document) => {
    setDocuments(prev => [doc, ...prev]);
  };

  const updateDocument = (id: string, updatedDoc: Partial<Document>) => {
    setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, ...updatedDoc } : doc));
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const resetData = () => {
    if (window.confirm("هل أنت متأكد؟ سيتم حذف جميع البيانات المضافة واستعادة البيانات الافتراضية.")) {
      setDocuments(MOCK_DOCUMENTS);
    }
  };

  const importDatabase = (data: Document[]) => {
    if (!Array.isArray(data)) {
        throw new Error("Invalid data format: Expected an array of documents.");
    }
    setDocuments(data);
  };

  return (
    <DataContext.Provider value={{ documents, addDocument, updateDocument, deleteDocument, resetData, importDatabase }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};