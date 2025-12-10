// app/dashboard/layout.tsx (SERVER)
import DashboardClientLayout from "./dashboard-client-layout"

export default function Layout({ children }: { children: any }) {
  return <DashboardClientLayout>{children}</DashboardClientLayout>
}
