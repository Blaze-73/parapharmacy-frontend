import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff } from 'lucide-react'
import { authApi } from '../api/index.js'
import { useAuth } from '../store/index.js'
import toast from 'react-hot-toast'

export default function Inscription() {
  const [voirMdp, setVoirMdp] = useState(false)
  const [chargement, setChargement] = useState(false)
  const { setAuth } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors }, setError } = useForm()

  async function onSubmit(data) {
    setChargement(true)
    try {
      const res = await authApi.inscription(data)
      const { user, token } = res.data.data
      setAuth(user, token)
      toast.success('Compte créé avec succès ! Bienvenue 🎉')
      navigate('/')
    } catch (e) {
      const errs = e.response?.data?.errors
      if (errs) {
        Object.entries(errs).forEach(([k, v]) => setError(k, { message: v[0] }))
      } else {
        toast.error('Erreur lors de la création du compte.')
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
            <span className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: 'Syne' }}>ParaPharma</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Créer un compte</h1>
          <p className="text-gray-500 mt-2">Rejoignez des milliers de clients satisfaits</p>
        </div>

        <div className="carte p-8 shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nom complet</label>
              <input
                {...register('nom', { required: 'Le nom est obligatoire.' })}
                className={`champ ${errors.nom ? 'border-red-400' : ''}`}
                placeholder="Youssef El Amrani"
              />
              {errors.nom && <p className="erreur">{errors.nom.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse e-mail</label>
              <input
                {...register('email', { required: "L'email est obligatoire." })}
                type="email"
                className={`champ ${errors.email ? 'border-red-400' : ''}`}
                placeholder="votre@email.com"
              />
              {errors.email && <p className="erreur">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Téléphone <span className="text-gray-400 font-normal">(optionnel)</span>
              </label>
              <input
                {...register('telephone')}
                type="tel"
                className="champ"
                placeholder="+212 6XX-XXXXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Le mot de passe est obligatoire.',
                    minLength: { value: 6, message: 'Minimum 6 caractères.' },
                  })}
                  type={voirMdp ? 'text' : 'password'}
                  className={`champ pr-11 ${errors.password ? 'border-red-400' : ''}`}
                  placeholder="Minimum 6 caractères"
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmer le mot de passe</label>
              <input
                {...register('password_confirmation', {
                  required: 'Veuillez confirmer le mot de passe.',
                  validate: v => v === watch('password') || 'Les mots de passe ne correspondent pas.',
                })}
                type="password"
                className={`champ ${errors.password_confirmation ? 'border-red-400' : ''}`}
                placeholder="Répéter le mot de passe"
              />
              {errors.password_confirmation && <p className="erreur">{errors.password_confirmation.message}</p>}
            </div>

            <button
              type="submit"
              disabled={chargement}
              className="btn-vert w-full py-3.5 text-base mt-2"
            >
              {chargement
                ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : 'Créer mon compte'
              }
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Déjà un compte ?{' '}
          <Link to="/connexion" className="text-vert-600 font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
