import { RouterProvider } from "react-router";
import router from "./routes";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster richColors />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
