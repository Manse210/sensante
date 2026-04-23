import PatientCard from "./components/PatientCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-teal-700 mb-6">
        SénSanté
      </h1>
      <p className="text-gray-600 mb-8">
        Assistant de santé communautaire avec IA
      </p>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Patients
      </h2>
      <PatientCard />
    </main>
  );
}
