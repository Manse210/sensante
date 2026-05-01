"use client";

import { useState, useEffect } from "react";

interface Patient {
  id: number;
  nom: string;
  prenom: string;
  region: string;
}

const SYMPTOMES_DISPONIBLES = [
  "Fièvre",
  "Toux",
  "Maux de tête",
  "Fatigue",
  "Diarrhée",
  "Vomissements",
  "Douleur abdominale",
  "Éruption cutanée",
  "Frissons",
  "Douleur thoracique",
  "Essoufflement",
  "Vertiges",
];

export default function ConsultationForm({ onSuccess }: { onSuccess: () => void }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/patients")
      .then((res) => res.json())
      .then(setPatients)
      .catch((err) => console.error("Erreur chargement patients:", err));
  }, []);

  function toggleSymptome(s: string) {
    setSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (symptoms.length === 0) {
      alert("Veuillez cocher au moins un symptôme.");
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const patientIdValue = formData.get("patientId");

    if (!patientIdValue) {
      alert("Veuillez sélectionner un patient.");
      setLoading(false);
      return;
    }

    const payload = {
      patientId: parseInt(patientIdValue as string, 10),
      symptoms: symptoms,
      notes: formData.get("notes") || null,
    };

    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // ✅ Réinitialisation du formulaire
        setSymptoms([]);
        (e.target as HTMLFormElement).reset();
        onSuccess();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Erreur lors de l'enregistrement");
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
      alert("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6 space-y-4"
    >
      <h3 className="text-lg font-bold text-gray-800">Nouvelle consultation</h3>

      {/* Sélection du patient */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Patient *
        </label>
        <select
          name="patientId"
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
        >
          <option value="">-- Sélectionner un patient --</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.prenom} {p.nom} — {p.region}
            </option>
          ))}
        </select>
      </div>

      {/* Symptômes (checkboxes) */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Symptômes ({symptoms.length} sélectionné(s)) *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {SYMPTOMES_DISPONIBLES.map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={symptoms.includes(s)}
                onChange={() => toggleSymptome(s)}
                className="w-4 h-4 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">{s}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Notes optionnelles */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Notes (optionnel)
        </label>
        <textarea
          name="notes"
          rows={3}
          placeholder="Observations cliniques..."
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Bouton d'envoi */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Enregistrement..." : "Enregistrer la consultation"}
      </button>
    </form>
  );
}
