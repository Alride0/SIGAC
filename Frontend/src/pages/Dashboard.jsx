import { useState, useEffect } from 'react';
import api from '../services/api.js';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import {
    FiUsers, FiUserPlus, FiClock, FiCheckCircle, FiCreditCard,
    FiTrendingUp, FiCalendar, FiArrowRight, FiAward, FiStar
} from 'react-icons/fi';
import { GiSewingMachine } from 'react-icons/gi';

const COLORS = {
    EN_ATTENTE: '#F7931E',
    EN_COURS: '#4F7CFF',
    TERMINE: '#2E8B57',
    LIVRE: '#3E2723'
};
const STATUT_LABELS = {
    EN_ATTENTE: 'En attente',
    EN_COURS: 'En cours',
    TERMINE: 'Terminées',
    LIVRE: 'Livrées'
};

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/stats/dashboard')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error("Erreur au chargement du dashboard", error);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading || !data) {
        return <div className="dashboard-page"><p>Chargement...</p></div>;
    }

    const { stats, donutData, evolutionData, paiementsData, typeData, activites, livraisons } = data;

    const totalCommandesDonut = donutData.reduce((sum, d) => sum + d.count, 0);
    const totalTypeVetement = typeData.reduce((sum, t) => sum + t.count, 0);
    const totalPaiements = Number(paiementsData.totalAvances) + Number(paiementsData.totalReste);
    const pourcentAvance = totalPaiements > 0 ? ((paiementsData.totalAvances / totalPaiements) * 100).toFixed(1) : 0;
    const pourcentReste = totalPaiements > 0 ? ((paiementsData.totalReste / totalPaiements) * 100).toFixed(1) : 0;

    
    const objectifMensuel = 1500000;
    const pourcentObjectif = Math.min(100, ((stats.totalEncaisse / objectifMensuel) * 100)).toFixed(0);

    const getActiviteIcon = (type) => {
        if (type === 'commande') return <GiSewingMachine size={18} />;
        if (type === 'paiement') return <FiCreditCard size={18} />;
        return <FiUserPlus size={18} />;
    };

    const getActiviteTitle = (activite) => {
        if (activite.type === 'commande') return `Nouvelle commande #CMD-${activite.id.toString().padStart(4, '0')}`;
        if (activite.type === 'paiement') return `Paiement reçu #PAY-${activite.id.toString().padStart(4, '0')}`;
        return `Nouveau client inscrit`;
    };

    const getActiviteSubtitle = (activite) => {
        if (activite.type === 'paiement') return `Montant: ${Number(activite.label).toLocaleString('fr-FR')} FCFA`;
        if (activite.type === 'commande') return `Par ${activite.nom} ${activite.prenom}`;
        return `${activite.nom} ${activite.prenom}`;
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="custom-tooltip-date">
                        {new Date(label).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="custom-tooltip-value">{payload[0].value} commandes</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="dashboard-page">
           
            <div className="page-header">
                <div>
                    <h1 className="page-title">Tableau de bord</h1>
                    <p className="page-subtitle">Voici un aperçu général de votre activité aujourd'hui.</p>
                </div>
                <div className="date-selector">
                    <FiCalendar size={18} />
                    {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </div>
            </div>

            
            <div className="stats-cards">
                <div className="stat-card">
                    <div className="stat-card-left">
                        <div className="stat-icon"><FiUsers size={24} /></div>
                        <div className="stat-content">
                            <p className="stat-label">Total clients</p>
                            <p className="stat-value">{stats.totalClients}</p>
                            <p className="stat-trend"><FiTrendingUp size={12} /> +{stats.clientsCeMois} ce mois</p>
                        </div>
                    </div>
                    <FiUserPlus size={20} className="stat-icon-right" />
                </div>

                <div className="stat-card">
                    <div className="stat-card-left">
                        <div className="stat-icon"><GiSewingMachine size={22} /></div>
                        <div className="stat-content">
                            <p className="stat-label">Commandes en cours</p>
                            <p className="stat-value">{stats.commandesEnCours}</p>
                            <p className="stat-trend"><FiTrendingUp size={12} /> +{stats.commandesEnCoursCeMois} ce mois</p>
                        </div>
                    </div>
                    <FiClock size={20} className="stat-icon-right" />
                </div>

                <div className="stat-card">
                    <div className="stat-card-left">
                        <div className="stat-icon"><FiCheckCircle size={24} /></div>
                        <div className="stat-content">
                            <p className="stat-label">Commandes terminées</p>
                            <p className="stat-value">{stats.commandesTerminees}</p>
                            <p className="stat-trend"><FiTrendingUp size={12} /> +{stats.commandesTermineesCeMois} ce mois</p>
                        </div>
                    </div>
                    <FiTrendingUp size={20} className="stat-icon-right" />
                </div>

                <div className="stat-card">
                    <div className="stat-card-left">
                        <div className="stat-icon"><FiCreditCard size={24} /></div>
                        <div className="stat-content">
                            <p className="stat-label">Total encaissé</p>
                            <p className="stat-value">{Number(stats.totalEncaisse).toLocaleString('fr-FR')} FCFA</p>
                            <p className="stat-trend"><FiTrendingUp size={12} /> Ce mois</p>
                        </div>
                    </div>
                    <FiCreditCard size={20} className="stat-icon-right" />
                </div>
            </div>

            
            <div className="dashboard-grid">
                
                <div className="card">
    <div className="card-header">
        <h3>Aperçu des commandes</h3>
        <select className="period-select"><option>Ce mois</option></select>
    </div>
    <div className="donut-wrapper">
        <ResponsiveContainer width={140} height={140}>
            <PieChart>
                <Pie
                    data={donutData}
                    dataKey="count"
                    nameKey="statut"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={2}
                >
                    {donutData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[entry.statut] || '#ccc'} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
        <div className="donut-legend">
            <p style={{ fontSize: '1.4rem', fontWeight: 700, color: '#3E2723', margin: 0 }}>
                {totalCommandesDonut}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#999', margin: '0 0 0.5rem 0' }}>Total</p>
            {donutData.map((entry) => (
                <div key={entry.statut} className="legend-item">
                    <span className="legend-dot" style={{ backgroundColor: COLORS[entry.statut] }}></span>
                    <span className="legend-label">{STATUT_LABELS[entry.statut] || entry.statut}</span>
                    <span className="legend-value">
                        {entry.count} ({((entry.count / totalCommandesDonut) * 100).toFixed(1)}%)
                    </span>
                </div>
            ))}
        </div>
    </div>
</div>

<div className="card">
    <div className="card-header">
        <h3>Évolution des commandes</h3>
        <select className="period-select"><option>Ce mois</option></select>
    </div>
    {evolutionData.length < 2 ? (
        <div className="chart-empty-state">
            <FiTrendingUp size={28} />
            <p>Pas assez de données sur cette période pour afficher une tendance.</p>
        </div>
    ) : (
        <ResponsiveContainer width="100%" height={220}>
            <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                    dataKey="date"
                    tickFormatter={(date) => new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                    tick={{ fontSize: 11, fill: '#999' }}
                />
                <YAxis tick={{ fontSize: 11, fill: '#999' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="count" stroke="#F7B801" strokeWidth={3} dot={{ fill: '#F7B801', r: 4 }} />
            </LineChart>
        </ResponsiveContainer>
    )}
</div>
               
                <div className="card">
                    <div className="card-header">
                        <h3>Activités récentes</h3>
                    </div>
                    <div className="activites-list">
                        {activites.map((activite, index) => (
                            <div key={index} className="activite-item">
                                <div className={`activite-icon type-${activite.type}`}>
                                    {getActiviteIcon(activite.type)}
                                </div>
                                <div className="activite-content">
                                    <p className="activite-title">{getActiviteTitle(activite)}</p>
                                    <p className="activite-subtitle">{getActiviteSubtitle(activite)}</p>
                                </div>
                                <span className="activite-time">
                                    {new Date(activite.date_event).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}
                    </div>
                    <a href="#" className="card-link">Voir toutes les activités <FiArrowRight size={14} /></a>
                </div>
            </div>

            
            <div className="dashboard-grid row-2">
                
                <div className="card">
                    <div className="card-header">
                        <h3>Répartition des paiements</h3>
                        <select className="period-select"><option>Ce mois</option></select>
                    </div>
                    <p className="paiements-total">{totalPaiements.toLocaleString('fr-FR')} FCFA</p>
                    <div className="progress-bar-split">
                        <div className="progress-avance" style={{ width: `${pourcentAvance}%` }}></div>
                        <div className="progress-reste" style={{ width: `${pourcentReste}%` }}></div>
                    </div>
                    <div className="paiements-legend">
                        <div className="paiements-legend-item">
                            <div className="legend-item">
                                <span className="legend-dot" style={{ backgroundColor: '#F7B801' }}></span>
                                <span className="legend-label">Reste à encaisser</span>
                            </div>
                            <span className="legend-value">{Number(paiementsData.totalAvances).toLocaleString('fr-FR')} FCFA ({pourcentAvance}%)</span>
                        </div>
                        <div className="paiements-legend-item">
                            <div className="legend-item">
                                <span className="legend-dot" style={{ backgroundColor: '#F7B801' }}></span>
                                <span className="legend-label">Reste à encaisser</span>
                            </div>
                            <span className="legend-value">{Number(paiementsData.totalReste).toLocaleString('fr-FR')} FCFA ({pourcentReste}%)</span>
                        </div>
                    </div>
                    <a href="#" className="card-link">Voir tous les paiements <FiArrowRight size={14} /></a>
                </div>

                
                <div className="card">
                    <div className="card-header">
                        <h3>Commandes par type de vêtement</h3>
                        <select className="period-select"><option>Ce mois</option></select>
                    </div>
                    <div className="type-list">
                        {typeData.map((type) => (
                            <div key={type.type_vetement} className="type-item">
                                <GiSewingMachine size={16} className="type-icon" />
                                <span className="type-name">{type.type_vetement}</span>
                                <div className="type-bar-wrapper">
                                    <div
                                        className="type-bar-fill"
                                        style={{ width: `${(type.count / totalTypeVetement) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="type-percent">{((type.count / totalTypeVetement) * 100).toFixed(0)}%</span>
                                <span className="type-count">{type.count}</span>
                            </div>
                        ))}
                    </div>
                    <a href="#" className="card-link">Voir le rapport détaillé <FiArrowRight size={14} /></a>
                </div>
            </div>

            
            <div className="card livraisons-card" style={{ marginBottom: '1.5rem' }}>
                <div className="card-header">
                    <h3>Prochaines livraisons</h3>
                </div>
                {livraisons.length === 0 ? (
                    <div className="livraisons-empty">
                <FiCalendar size={24} />
                <p>Aucune livraison à venir pour le moment.</p>
            </div>
                ) : (
                    livraisons.map((livraison) => (
                        <div key={livraison.id} className="livraison-item">
                            <div>
                                <p className="livraison-title">
                                    CMD-{livraison.id.toString().padStart(4, '0')} — {livraison.type_vetement}
                                </p>
                                <p className="livraison-subtitle">Par {livraison.nom} {livraison.prenom}</p>
                            </div>
                            <div className="livraison-date">
                                <span className="livraison-date-day">
                                    {new Date(livraison.date_livraison).getDate()}
                                </span>
                                <span className="livraison-date-month">
                                    {new Date(livraison.date_livraison).toLocaleDateString('fr-FR', { month: 'short' })}
                                </span>
                            </div>
                        </div>
                    ))
                )}
                <a href="#" className="card-link">Voir toutes les livraisons <FiArrowRight size={14} /></a>
            </div>

            
            <div className="objectif-card">
                <div className="objectif-icon"><FiAward size={26} /></div>
                <div className="objectif-content">
                    <p className="objectif-title">Objectif du mois</p>
                    <p className="objectif-subtitle">
                        {pourcentObjectif >= 75 ? 'Excellent !' : 'Continuez !'} Vous avez atteint {pourcentObjectif}% de votre objectif mensuel.
                    </p>
                </div>
                <div className="objectif-progress-wrapper">
                    <p className="objectif-amounts">
                        {Number(stats.totalEncaisse).toLocaleString('fr-FR')} / {objectifMensuel.toLocaleString('fr-FR')} FCFA
                    </p>
                    <div className="objectif-progress-bar">
                        <div className="objectif-progress-fill" style={{ width: `${pourcentObjectif}%` }}></div>
                    </div>
                </div>
                <span className="objectif-percent">{pourcentObjectif}%</span>
                <div className="objectif-star"><FiStar size={22} /></div>
            </div>
        </div>
    );
};

export default Dashboard;