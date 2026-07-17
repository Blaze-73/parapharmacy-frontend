import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import Layout from './components/layout/Layout.jsx'
import AdminLayout from './components/layout/AdminLayout.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { useAuth } from './store/index.js'

const Accueil          = lazy(() => import('./pages/Accueil.jsx'))
const Produits         = lazy(() => import('./pages/Produits.jsx'))
const DetailProduit    = lazy(() => import('./pages/DetailProduit.jsx'))
const Panier           = lazy(() => import('./pages/Panier.jsx'))
const Checkout         = lazy(() => import('./pages/Checkout.jsx'))
const CommandeOk       = lazy(() => import('./pages/CommandeOk.jsx'))
const Connexion        = lazy(() => import('./pages/Connexion.jsx'))
const Inscription      = lazy(() => import('./pages/Inscription.jsx'))
const MesCommandes     = lazy(() => import('./pages/MesCommandes.jsx'))
const NotFound         = lazy(() => import('./pages/NotFound.jsx'))
const AdminTableau     = lazy(() => import('./pages/admin/Tableau.jsx'))
const AdminProduits    = lazy(() => import('./pages/admin/Produits.jsx'))
const AdminCommandes   = lazy(() => import('./pages/admin/Commandes.jsx'))
const AdminClients     = lazy(() => import('./pages/admin/Clients.jsx'))

const qc = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 1 },
    mutations: { retry: 0 },
  },
})

function RouteProtegee({ children }) {
  const { connecte } = useAuth()
  if (connecte === null) return <Chargement />
  return connecte ? children : <Navigate to="/connexion" replace />
}

function RouteAdmin({ children }) {
  const { connecte, user } = useAuth()
  if (connecte === null) return <Chargement />
  if (!connecte) return <Navigate to="/connexion" replace />
  if (user?.role !== 'admin') return <Navigate to="/" replace />
  return children
}

function Chargement() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-vert-200 border-t-vert-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-400">Chargement…</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={qc}>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Suspense fallback={<Chargement />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/"               element={<Accueil />} />
                <Route path="/produits"       element={<Produits />} />
                <Route path="/produits/:slug" element={<DetailProduit />} />
                <Route path="/panier"         element={<Panier />} />
                <Route path="/connexion"      element={<Connexion />} />
                <Route path="/inscription"    element={<Inscription />} />
                <Route path="/checkout"       element={<RouteProtegee><Checkout /></RouteProtegee>} />
                <Route path="/commande-confirmee/:numero" element={<RouteProtegee><CommandeOk /></RouteProtegee>} />
                <Route path="/mes-commandes"  element={<RouteProtegee><MesCommandes /></RouteProtegee>} />
                <Route path="*"              element={<NotFound />} />
              </Route>

              <Route element={<RouteAdmin><AdminLayout /></RouteAdmin>}>
                <Route path="/admin"              element={<AdminTableau />} />
                <Route path="/admin/produits"     element={<AdminProduits />} />
                <Route path="/admin/commandes"    element={<AdminCommandes />} />
                <Route path="/admin/clients"      element={<AdminClients />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>

        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily: 'DM Sans, sans-serif', borderRadius: '12px', fontSize: '14px' },
            success: { style: { border: '1px solid #16a34a', color: '#15803d' } },
            error:   { style: { border: '1px solid #dc2626', color: '#b91c1c' } },
          }}
        />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
