export default function PatientCard() {
  const nom = "Binetou DELL";
  const region = "Dakar";
  const groupe = 10;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-teal-500">
      <h3 className="text-lg font-bold text-gray-800">
        {nom}
      </h3>
      <p className="text-gray-600 mt-1">
        Région : {region}
      </p>
      <p className="text-gray-500 text-sm mt-1">
        Groupe {groupe}
      </p>
    </div>
  );
}
