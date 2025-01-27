import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center p-10">
      <Outlet />
    </div>
  );
}

export default App;