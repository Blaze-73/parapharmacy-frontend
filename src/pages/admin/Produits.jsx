import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Check, Upload, Image } from 'lucide-react'
import CategoryIcon from '../../components/CategoryIcon.jsx'
import { adminApi } from '../../api/index.js'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export default function AdminProduits() {
  const qc = useQueryClient()
  const [modal, setModal]               = useState(null)
  const [supprConfirm, setSupprConfirm] = useState(null)
  const [previews, setPreviews]         = useState([null, null, null])

  const { data, isLoading } = useQuery({ queryKey: ['admin-produits'], queryFn: () => adminApi.produits() })
  const { data: catData }   = useQuery({ queryKey: ['admin-categories'], queryFn: adminApi.categories })
  const produits   = data?.data?.data    || []
  const categories = catData?.data?.data || []

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const fd = new FormData()
      if (formData.nom)          fd.append('nom',          formData.nom)
      if (formData.categorie_id) fd.append('categorie_id', formData.categorie_id)
      if (formData.marque)       fd.append('marque',       formData.marque)
      if (formData.prix)         fd.append('prix',         formData.prix)
      if (formData.prix_promo)   fd.append('prix_promo',   formData.prix_promo)
      if (formData.stock !== undefined) fd.append('stock', formData.stock)
      if (formData.description)  fd.append('description',  formData.description)
      fd.append('actif',      formData.actif      ? '1' : '0')
      fd.append('en_vedette', formData.en_vedette ? '1' : '0')
      previews.forEach((p, i) => { if (p && p.startsWith('data:')) fd.append(`image_${i + 1}`, p) })
      if (modal?.id) {
        fd.append('_method', 'PUT')
        return adminApi.modifierProduit(modal.id, fd)
      }
      return adminApi.creerProduit(fd)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-produits'] })
      toast.success(modal?.id ? 'Produit modifié !' : 'Produit créé !')
      setModal(null); reset(); setPreviews([null, null, null])
    },
    onError: (e) => {
      const errs = e.response?.data?.errors
      if (errs) toast.error(Object.values(errs)[0][0])
      else toast.error(e.response?.data?.message || 'Erreur.')
    },
  })

  const supprimer = useMutation({
    mutationFn: (id) => adminApi.supprimerProduit(id),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['admin-produits'] }); toast.success('Produit supprimé.'); setSupprConfirm(null) },
  })

  function ouvrirModal(produit) {
    setPreviews([null, null, null])
    if (produit) {
      setModal(produit)
      setTimeout(() => {
        setValue('nom',          produit.nom)
        setValue('categorie_id', produit.categorie_id)
        setValue('marque',       produit.marque       || '')
        setValue('prix',         produit.prix)
        setValue('prix_promo',   produit.prix_promo   || '')
        setValue('stock',        produit.stock)
        setValue('description',  produit.description  || '')
        setValue('actif',        produit.actif)
        setValue('en_vedette',   produit.en_vedette)
      }, 0)
      if (produit.images?.length) setPreviews([produit.images[0], produit.images[1] || null, produit.images[2] || null])
      else if (produit.image) setPreviews([produit.image, null, null])
    } else {
      setModal('creer')
      reset({ nom:'', categorie_id:'', marque:'', prix:'', prix_promo:'', stock:'', description:'', actif:true, en_vedette:false })
    }
  }

  function handleImageChange(slot, file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setPreviews(prev => { const n = [...prev]; n[slot] = reader.result; return n })
    }
    reader.readAsDataURL(file)
  }

  function retirerImage(slot) {
    setPreviews(prev => { const n = [...prev]; n[slot] = null; return n })
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900" style={{ fontFamily: 'Syne' }}>Produits</h1>
          <p className="text-gray-500 text-sm mt-1">{produits.length} produit{produits.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => ouvrirModal(null)} className="btn-vert flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouveau produit
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3,4,5].map(i=><div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse"/>)}</div>
      ) : (
        <div className="carte overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Produit','Catégorie','Prix','Stock','Statut','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {produits.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {p.image
                          ? <img src={p.image} alt={p.nom} className="w-full h-full object-cover" />
                          : <CategoryIcon slug={p.categorie?.slug} className="w-5 h-5 text-gray-400" />
                        }
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 line-clamp-1 max-w-[160px]">{p.nom}</p>
                        {p.marque && <p className="text-xs text-gray-400">{p.marque}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.categorie?.nom}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{Number(p.prix).toFixed(2)} MAD</p>
                    {p.prix_promo && <p className="text-xs text-vert-600">Promo : {Number(p.prix_promo).toFixed(2)}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${p.stock<=5?'text-red-500':p.stock<=15?'text-orange-500':'text-gray-700'}`}>{p.stock}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={p.actif ? 'badge-vert' : 'badge-rouge'}>{p.actif ? 'Actif' : 'Inactif'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => ouvrirModal(p)} className="p-2 text-gray-400 hover:text-vert-600 hover:bg-vert-50 rounded-lg transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      {supprConfirm === p.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => supprimer.mutate(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Check className="w-4 h-4"/></button>
                          <button onClick={() => setSupprConfirm(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4"/></button>
                        </div>
                      ) : (
                        <button onClick={() => setSupprConfirm(p.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {produits.length === 0 && (
                <tr><td colSpan="6" className="px-5 py-12 text-center text-gray-400">Aucun produit</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="fixed inset-0 bg-black/50 z-50" onClick={() => setModal(null)} />
            <motion.div
              initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}} transition={{duration:0.15}}
              className="fixed inset-x-4 top-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg bg-white rounded-2xl shadow-2xl z-50 overflow-y-auto max-h-[95vh]"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                <h2 className="font-bold text-gray-900 text-lg" style={{ fontFamily: 'Syne' }}>
                  {modal?.id ? 'Modifier le produit' : 'Nouveau produit'}
                </h2>
                <button onClick={() => setModal(null)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="p-6 space-y-4">
                {/* Images (up to 3) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Images <span className="text-gray-400 font-normal">(jusqu'à 3)</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[0, 1, 2].map(slot => (
                      <div key={slot} className="relative">
                        <div className="aspect-square rounded-xl border-2 border-gray-100 flex items-center justify-center overflow-hidden bg-gray-50">
                          {previews[slot]
                            ? <img src={previews[slot]} alt="" className="w-full h-full object-cover" />
                            : <Image className="w-6 h-6 text-gray-300" />
                          }
                        </div>
                        {previews[slot] && (
                          <button type="button" onClick={() => retirerImage(slot)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                        <label className="mt-1 flex items-center justify-center gap-1 py-1.5 border border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-vert-400 hover:bg-vert-50 transition-colors text-xs text-gray-500">
                          <Upload className="w-3 h-3" />
                          {previews[slot] ? 'Changer' : 'Ajouter'}
                          <input type="file" accept="image/*" onChange={e => handleImageChange(slot, e.target.files?.[0])} className="hidden" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nom */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nom *</label>
                  <input {...register('nom', { required: 'Le nom est obligatoire.' })} className={`champ ${errors.nom ? 'border-red-400' : ''}`} placeholder="Nom du produit" />
                  {errors.nom && <p className="erreur">{errors.nom.message}</p>}
                </div>

                {/* Catégorie + Marque */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Catégorie *</label>
                    <select {...register('categorie_id', { required: 'La catégorie est obligatoire.' })} className={`champ ${errors.categorie_id ? 'border-red-400' : ''}`}>
                      <option value="">Choisir…</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                    </select>
                    {errors.categorie_id && <p className="erreur">{errors.categorie_id.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Marque</label>
                    <input {...register('marque')} className="champ" placeholder="Ex: Vichy" />
                  </div>
                </div>

                {/* Prix */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Prix (MAD) *</label>
                    <input {...register('prix', { required: 'Le prix est obligatoire.' })} type="number" step="0.01" min="0" className={`champ ${errors.prix ? 'border-red-400' : ''}`} placeholder="0.00" />
                    {errors.prix && <p className="erreur">{errors.prix.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Prix promo</label>
                    <input {...register('prix_promo')} type="number" step="0.01" min="0" className="champ" placeholder="Optionnel" />
                  </div>
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stock *</label>
                  <input {...register('stock', { required: 'Le stock est obligatoire.' })} type="number" min="0" className={`champ ${errors.stock ? 'border-red-400' : ''}`} placeholder="0" />
                  {errors.stock && <p className="erreur">{errors.stock.message}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                  <textarea {...register('description')} className="champ resize-none" rows={3} placeholder="Description du produit…" />
                </div>

                {/* Toggles */}
                <div className="flex gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input {...register('actif')} type="checkbox" defaultChecked className="accent-vert-600 w-4 h-4" />
                    <span className="text-sm text-gray-700">Actif</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input {...register('en_vedette')} type="checkbox" className="accent-vert-600 w-4 h-4" />
                    <span className="text-sm text-gray-700">⭐ En vedette</span>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(null)} className="btn-blanc flex-1">Annuler</button>
                  <button type="submit" disabled={mutation.isPending} className="btn-vert flex-1 flex items-center justify-center gap-2">
                    {mutation.isPending
                      ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : (modal?.id ? 'Enregistrer' : 'Créer le produit')
                    }
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
