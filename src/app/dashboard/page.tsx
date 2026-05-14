"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

interface Stats {
  kpi: {
    totalPatients: number;
    totalConsultations: number;
    consultationsTerminees: number;
    alertesUrgentes: number;
  };
  parRegion: { region: string; total: number }[];
  parMois: { mois: string; total: number }[];
  dernieresAlertes: {
    id: number;
    patient: string;
    region: string;
    diagnostic: string | null;
    confiance: number | null;
    date: string;
  }[];
}

const COULEURS_PIE = [
  "#0F766E", "#0EA5E9", "#F59E0B",
  "#EF4444", "#8B5CF6", "#10B981",
];

function StatCard({
  titre, valeur, unite, couleur, icon,
}: {
  titre: string; valeur: number; unite: string; couleur: string; icon: string;
}) {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${couleur} flex items-center gap-4`}>
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-3xl font-bold text-gray-800">{valeur}</p>
        <p className="text-sm font-semibold text-gray-600">{titre}</p>
        <p className="text-xs text-gray-400">{unite}</p>
      </div>
    </div>
  );
}

function UrgenceBadge({ confiance }: { confiance: number | null }) {
  const niveau =
    confiance === null ? "moyen" : confiance >= 70 ? "urgent" : confiance >= 40 ? "moyen" : "faible";
  const styles: Record<string, string> = {
    urgent: "bg-red-100 text-red-700 border border-red-200",
    moyen: "bg-orange-100 text-orange-700 border border-orange-200",
    faible: "bg-green-100 text-green-700 border border-green-200",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${styles[niveau]}`}>
      {niveau}
    </span>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => {
        if (!res.ok) throw new Error("Non autorisé ou erreur serveur");
        return res.json();
      })
      .then((data) => { setStats(data); setLoading(false); })
      .catch((e) => { setErreur(e.message); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  if (erreur || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 font-semibold">
          {erreur ?? "Impossible de charger le dashboard"}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-sm text-gray-400 mt-1">SénSanté · Données en temps réel</p>
      </div>

      {/* Zone 1 — KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard titre="Patients" valeur={stats.kpi.totalPatients}
          unite="enregistrés" couleur="border-teal-500" icon="👤" />
        <StatCard titre="Consultations" valeur={stats.kpi.totalConsultations}
          unite="au total" couleur="border-orange-500" icon="🩺" />
        <StatCard titre="Diagnostics IA" valeur={stats.kpi.consultationsTerminees}
          unite="terminés" couleur="border-purple-500" icon="🤖" />
        <StatCard titre="Alertes" valeur={stats.kpi.alertesUrgentes}
          unite="urgentes" couleur="border-red-500" icon="🚨" />
      </div>

      {/* Zone 2 + 4 — Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* BarChart — Consultations par mois */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">
            Consultations par mois
          </h2>
          {stats.parMois.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">
              Aucune consultation sur les 6 derniers mois.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.parMois}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mois" tick={{ fontSize: 12, fill: "#6B7280" }} />
                <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
                <Bar dataKey="total" fill="#E65100" radius={[4, 4, 0, 0]} name="Consultations" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* PieChart — Patients par région */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-700 mb-4">
            Patients par région
          </h2>
          {stats.parRegion.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">
              Aucune donnée régionale disponible.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.parRegion}
                  dataKey="total"
                  nameKey="region"
                  cx="50%" cy="50%"
                  outerRadius={90}
                  label={({ region, percent }) =>
                    `${region} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {stats.parRegion.map((_, i) => (
                    <Cell key={i} fill={COULEURS_PIE[i % COULEURS_PIE.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Legend formatter={(v) => <span style={{ fontSize: 12, color: "#6B7280" }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Zone 3 — Derniers diagnostics IA */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-700 mb-4">
          Derniers diagnostics IA
        </h2>
        {stats.dernieresAlertes.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            Aucun diagnostic IA disponible pour le moment.
          </p>
        ) : (
          <div className="space-y-3">
            {stats.dernieresAlertes.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm">
                    {a.patient.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{a.patient}</p>
                    <p className="text-xs text-gray-400">
                      {a.region} · {new Date(a.date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
                <div className="text-right max-w-xs">
                  <p className="text-sm text-gray-700 line-clamp-1">
                    {a.diagnostic ? a.diagnostic.substring(0, 60) + "…" : "—"}
                  </p>
                  <div className="flex items-center justify-end gap-2 mt-1">
                    {a.confiance !== null && (
                      <span className="text-xs text-gray-400">
                        Confiance : {a.confiance}%
                      </span>
                    )}
                    <UrgenceBadge confiance={a.confiance} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}