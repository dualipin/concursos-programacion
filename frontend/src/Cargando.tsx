export default function Cargando() {
  return (
    <div className="flex items-center justify-center h-screen flex-col gap-10">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      <span className="ml-4 text-lg">Cargando...</span>
    </div>
  );
}