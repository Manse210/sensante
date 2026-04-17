export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <nav>
        <ul className="space-y-2">
          <li className="p-2 hover:bg-gray-700 rounded">Tableau de bord</li>
          <li className="p-2 hover:bg-gray-700 rounded">Patients</li>
          <li className="p-2 hover:bg-gray-700 rounded">Consultations</li>
          <li className="p-2 hover:bg-gray-700 rounded">Alertes IA</li>
        </ul>
      </nav>
    </aside>
  );
}
