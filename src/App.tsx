import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router";
import TopPage from "@/page/TopPage";
import CollageSelect from "@/page/CollageSelect";
import WorkCreate from "@/page/WorkCreate";
import WorkList from "@/page/WorkList";
import Layout from "./page/Layout";

const root = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<TopPage />} />
      <Route element={<Layout />}>
        <Route path="collage-select" element={<CollageSelect />} />
        <Route path="work-create" element={<WorkCreate />} />
        <Route path="work-list" element={<WorkList />} />
      </Route>
    </Route>
  )
);

function App() {
  return <RouterProvider router={root} />;
}

export default App;
