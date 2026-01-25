import { RouterProvider } from "react-router";
import router from "./routes";
import { store } from "@/redux/store";
import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <Provider store={store}>
      <Toaster richColors />
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
