import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import { usePanier } from '../store/index.js'
import { commandesApi } from '../api/index.js'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export default function Checkout() {
  const { articles, viderPanier, sousTotal, fermer } = usePanier()
  const navigate = useNavigate()
  const [chargement, setChargement] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { paiement: 'livraison' } })
  const sous = sousTotal()
  const livraison = sous > 0 && sous < 300 ? 30 : 0
  const total = sous + livraison

  if (articles.length === 0) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <ShoppingBag className="w-14 h-14 text-gray-200 mx-auto mb-4" />
      <p className="text-gray-500 mb-5">Votre panier est vide.</p>
      <Link to="/produits" className="btn-vert">Voir les produits</Link>
    </div>
  )

  async function onSubmit(data) {
    setChargement(true)
    try {
      const payload = {
        items: articles.map(a => ({ produit_id: a.produit.id, quantite: a.quantite })),
        adresse_livraison: data.adresse,
        ville: data.ville,
        code_postal: data.code_postal || '',
        paiement: data.paiement,
        notes: data.notes || '',
      }
      const res = await commandesApi.creer(payload)
      viderPanier()
      fermer()
      toast.success('Commande passée avec succès !')
      navigate(`/commande-confirmee/${res.data.data.numero}`)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Erreur lors de la commande.')
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Passer la commande</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="carte p-6">
              <h2 className="font-bold text-gray-900 mb-5 text-lg">📍 Adresse de livraison</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Adresse *</label>
                  <input {...register('adresse', { required: "L'adresse est obligatoire." })}
                    className={`champ ${errors.adresse ? 'border-red-400' : ''}`}
                    placeholder="Numéro et nom de rue" />
                  {errors.adresse && <p className="erreur">{errors.adresse.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ville *</label>
                    <input {...register('ville', { required: 'La ville est obligatoire.' })}
                      className={`champ ${errors.ville ? 'border-red-400' : ''}`}
                      placeholder="Casablanca" />
                    {errors.ville && <p className="erreur">{errors.ville.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Code postal</label>
                    <input {...register('code_postal')} className="champ" placeholder="20000" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Notes <span className="text-gray-400 font-normal">(optionnel)</span>
                  </label>
                  <textarea {...register('notes')} className="champ resize-none" rows={2}
                    placeholder="Instructions particulières pour la livraison…" />
                </div>
              </div>
            </div>

            <div className="carte p-6">
              <h2 className="font-bold text-gray-900 mb-5 text-lg">💳 Mode de paiement</h2>
              <div className="space-y-3">
                {[
                  { v: 'livraison', label: '💵 Paiement à la livraison', desc: 'Payez en espèces à la réception' },
                  { v: 'carte',     label: '💳 Carte bancaire',          desc: 'Paiement sécurisé (bientôt disponible)' },
                ].map(opt => (
                  <label key={opt.v}
                    className="flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-colors border-gray-100 hover:border-vert-300">
                    <input {...register('paiement')} type="radio" value={opt.v}
                      className="mt-0.5 accent-vert-600 w-4 h-4 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{opt.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="carte p-6 h-fit sticky top-24">
            <h2 className="font-bold text-gray-900 mb-4 text-lg">🛒 Votre commande</h2>
            <div className="space-y-2 mb-4 max-h-56 overflow-y-auto">
              {articles.map(({ produit, quantite }) => (
                <div key={produit.id} className="flex justify-between text-sm gap-2">
                  <span className="text-gray-600 line-clamp-1 flex-1">{produit.nom}</span>
                  <span className="font-semibold text-gray-900 flex-shrink-0">
                    ×{quantite} — {(Number(produit.prix_effectif) * quantite).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span><span>{sous.toFixed(2)} MAD</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span className={livraison === 0 ? 'text-vert-600 font-semibold' : ''}>
                  {livraison === 0 ? 'GRATUITE' : `${livraison} MAD`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100 text-base">
                <span>Total</span>
                <span className="prix-principal text-xl">{total.toFixed(2)} MAD</span>
              </div>
            </div>
            <button type="submit" disabled={chargement} className="btn-vert w-full mt-5 py-3.5">
              {chargement
                ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <>Confirmer la commande <ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
