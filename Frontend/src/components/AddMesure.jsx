import {useState, useEffect} from 'react';
import api from '../services/api.js'; 

const AddMesure = ({selectedClientId, editingMesure, setEditingMesure, fetchMesures}) => {
    const [poitrine, setPoitrine] = useState("");
    const [taille, setTaille] = useState("");
    const [hanche, setHanche] = useState("");
    const [epaule, setEpaule] = useState("");
    const [manche, setManche] = useState("");
    const [tour_bras, setTourBras] = useState("");
    const [tour_cou, setTourCou] = useState("");
    const [poignet, setPoignet] = useState("");
    const [cuisse, setCuisse] = useState("");
    const [bas_pantalon, setBasPantalon] = useState("");
    const [mollet, setMollet] = useState("");
    const [longueur, setLongueur] = useState("");
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

   useEffect(() => {
    if (editingMesure) {
        setPoitrine(editingMesure.poitrine);
        setTaille(editingMesure.taille);
        setHanche(editingMesure.hanche);
        setEpaule(editingMesure.epaule);
        setManche(editingMesure.manche);
        setLongueur(editingMesure.longueur);
        setTourBras(editingMesure.tour_bras);
        setTourCou(editingMesure.tour_cou);
        setPoignet(editingMesure.poignet);
        setCuisse(editingMesure.cuisse);
        setBasPantalon(editingMesure.bas_pantalon);
        setMollet(editingMesure.mollet);
    } else {
        resetForm();
    }
}, [editingMesure]);

    const resetForm = () => {
    setPoitrine("");
    setTaille("");
    setHanche("");
    setEpaule("");
    setManche("");
    setLongueur("");
    setTourBras("");
    setTourCou("");
    setPoignet("");
    setCuisse("");
    setBasPantalon("");
    setMollet("");
    setFormError("");
};
    const handleSubmit = async(e) => {
    e.preventDefault();
    
    if (!poitrine || !taille || !hanche || !epaule || !manche || !longueur) {
        setFormError("Tous les champs sont obligatoires");
        return;
    }
    setSubmitting(true);
    setFormError("");
    try {
        if (editingMesure) {
            await api.patch(`/mesures/${editingMesure.id}`, {
                poitrine, taille, hanche, epaule, manche, longueur,
                tour_bras, tour_cou, poignet, cuisse, bas_pantalon, mollet
            });
            setEditingMesure(null);
        } else {
            await api.post(`/mesures/${selectedClientId}`, {
                poitrine, taille, hanche, epaule, manche, longueur,
                tour_bras, tour_cou, poignet, cuisse, bas_pantalon, mollet
            });
        }
        
        await fetchMesures();
        resetForm();
    }
    catch(error) {
        setFormError("Erreur lors de l'enregistrement");
        console.log(error);
    } finally {
        setSubmitting(false);
    }
};

    const handleCancel = () => {
        setEditingMesure(null);
        resetForm();
    };
   
    return (
    <form className="mesures-form" onSubmit={handleSubmit}>
        <div className="form-grid">
            {/* Colonne gauche */}
            <div className="form-group">
                <label>Poitrine (cm)</label>
                <input type="number" value={poitrine} onChange={(e) => setPoitrine(e.target.value)} required/>
            </div>
            <div className="form-group">
                <label>Taille (cm)</label>
                <input type="number" value={taille} onChange={(e) => setTaille(e.target.value)} required/>
            </div>
            <div className="form-group">
                <label>Hanche (cm)</label>
                <input type="number" value={hanche} onChange={(e) => setHanche(e.target.value)} required/>
            </div>
            <div className="form-group">
                <label>Épaule (cm)</label>
                <input type="number" value={epaule} onChange={(e) => setEpaule(e.target.value)} required/>
            </div>
            <div className="form-group">
                <label>Manche (cm)</label>
                <input type="number" value={manche} onChange={(e) => setManche(e.target.value)} required/>
            </div>
            <div className="form-group">
                <label>Longueur (cm)</label>
                <input type="number" value={longueur} onChange={(e) => setLongueur(e.target.value)} required/>
            </div>
            <div className="form-group">
                <label>Tour de bras (cm)</label>
                <input type="number" value={tour_bras} onChange={(e) => setTourBras(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Tour de cou (cm)</label>
                <input type="number" value={tour_cou} onChange={(e) => setTourCou(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Poignet (cm)</label>
                <input type="number" value={poignet} onChange={(e) => setPoignet(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Cuisse (cm)</label>
                <input type="number" value={cuisse} onChange={(e) => setCuisse(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Bas de pantalon (cm)</label>
                <input type="number" value={bas_pantalon} onChange={(e) => setBasPantalon(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Mollet (cm)</label>
                <input type="number" value={mollet} onChange={(e) => setMollet(e.target.value)} />
            </div>
        </div>

        <div className="form-actions">
            {formError && <p className="form-error">{formError}</p>}
            <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? "Enregistrement..." : (editingMesure ? "Enregistrer les modifications" : "Enregistrer les mesures")}
            </button>
            {editingMesure && (
                <button type="button" className="btn-cancel" onClick={handleCancel}>
                    Annuler
                </button>
            )}
        </div>
    </form>
);
};

export default AddMesure;