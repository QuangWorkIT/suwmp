import { RouterProvider } from "react-router";
import router from "./routes";
import { store } from "@/redux/store"
import { Provider } from "react-redux";

function App() {
    return (
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    );
}

export default App;