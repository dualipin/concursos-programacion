export default function ParticipanteLayout() {
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold">Panel del Participante</h1>
      </header>
      <main className="flex-1 p-4 overflow-y-auto">
        {/* Aquí iría el contenido principal del participante */}
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        &copy; {new Date().getFullYear()} Panel del Participante
      </footer>
    </div>
  );
}