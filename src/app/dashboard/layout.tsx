import type { ReactNode } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { RequireAuth } from "@/features/auth/RequireAuth";

export default function MainRouteLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <MainLayout>{children}</MainLayout>
    </RequireAuth>
  );
}
