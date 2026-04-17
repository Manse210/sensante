interface ConsultationCardProps {
  patient: string;
  date: string;
  symptomes: string;
  statut: "En attente" | "Terminé";
}

export default function ConsultationCard({ patient, date, symptomes, statut }: ConsultationCardProps) {
  // Changement de couleur selon le statut
  const badgeColor = statut === "Terminé" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-gray-900 text-lg">{patient}</h3>
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${badgeColor}`}>
          {statut}
        </span>
      </div>
      <p className="text-sm text-blue-600 font-medium mb-2">{date}</p>
      <div className="bg-gray-50 p-3 rounded-lg">
        <p className="text-sm text-gray-700 italic">"{symptomes}"</p>
      </div>
    </div>
  );
}
