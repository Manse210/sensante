interface PatientCardProps {
  nom: string;
  role: string;
  groupe: number;
}

export default function PatientCard({ nom, role, groupe }: PatientCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-400">
      <p className="text-orange-500 font-semibold text-sm mb-2">PatientCard</p>
      <h3 className="text-lg font-bold text-gray-800">{nom}</h3>
      <p className="text-gray-500 text-sm mt-1">{role} — Groupe {groupe}</p>
    </div>
  );
}
