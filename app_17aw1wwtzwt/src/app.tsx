import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import InvitePage from "@/pages/InvitePage/InvitePage";
import ConfirmPage from "@/pages/ConfirmPage/ConfirmPage";
import DateTimePage from "@/pages/DateTimePage/DateTimePage";
import MenuPage from "@/pages/MenuPage/MenuPage";
import CardPage from "@/pages/CardPage/CardPage";
import NotFoundPage from "@/pages/NotFoundPage/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<InvitePage />} />
        <Route path="confirm" element={<ConfirmPage />} />
        <Route path="datetime" element={<DateTimePage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="card" element={<CardPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
