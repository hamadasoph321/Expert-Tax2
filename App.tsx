import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import DocumentPage from './pages/DocumentPage';
import ComparePage from './pages/ComparePage';
import SearchPage from './pages/SearchPage';
import SettingsPage from './pages/SettingsPage';
import ManageDataPage from './pages/ManageDataPage';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <DataProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/category/:id" element={<CategoryPage />} />
              <Route path="/document/:id" element={<DocumentPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/manage-data" element={<ManageDataPage />} />
            </Routes>
          </Layout>
        </Router>
      </DataProvider>
    </ThemeProvider>
  );
};

export default App;