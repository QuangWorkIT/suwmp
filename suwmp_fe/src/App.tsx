import { RouterProvider } from "react-router";
import router from "./routes";
import { store } from "@/redux/store";
import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/sonner";
import AppInit from "./pages/AppInit";

function App() {
  return (
    <Provider store={store}>
      <Toaster richColors />
      <RouterProvider router={router} />
      <AppInit />
    </Provider>
  );
}

export default App;
