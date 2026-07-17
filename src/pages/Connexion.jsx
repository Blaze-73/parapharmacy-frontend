import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import { authApi } from '../api/index.js'
import { useAuth } from '../store/index.js'
import toast from 'react-hot-toast'

export default function Connexion() {
  const [voirMdp, setVoirMdp] = useState(false)
  const [chargement, setChargement] = useState(false)
  const { setAuth } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors }, setError } = useForm()

  async function onSubmit(data) {
    setChargement(true)
    try {
      const res = await authApi.connexion(data)
      const { user, token } = res.data.data
      setAuth(user, token)
      toast.success(`Bienvenue ${user.nom.split(' ')[0]} !`)
      navigate(user.role === 'admin' ? '/admin' : '/')
    } catch (e) {
      const errs = e.response?.data?.errors
      if (errs?.email) {
        setError('email', { message: errs.email[0] })
      } else {
        toast.error(e.response?.data?.message || 'Erreur de connexion.')
      }
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-vert-50 via-white to-teal-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-5">
            <div className="w-10 h-10 bg-vert-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-extrabold text-xl" style={{ fontFamily: 'Syne' }}>P</span>
            </div>
            <span className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: 'Syne' }}>Omar &amp; Karima's</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Connexion</h1>
          <p className="text-gray-500 mt-2">Bienvenue ! Connectez-vous à votre compte.</p>
        </div>

        <div className="carte p-8 shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse e-mail</label>
              <input
                {...register('email', { required: "L'email est obligatoire." })}
                type="email"
                autoComplete="email"
                className={`champ ${errors.email ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                placeholder="votre@email.com"
              />
              {errors.email && <p className="erreur">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
              <div className="relative">
                <input
                  {...register('password', { required: 'Le mot de passe est obligatoire.' })}
                  type={voirMdp ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`champ pr-11 ${errors.password ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setVoirMdp(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {voirMdp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="erreur">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={chargement}
              className="btn-vert w-full py-3.5 text-base"
            >
              {chargement
                ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : 'Se connecter'
              }
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Pas encore de compte ?{' '}
          <Link to="/inscription" className="text-vert-600 font-semibold hover:underline">
            S'inscrire gratuitement
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
