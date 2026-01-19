import { AppSidebar } from "@/components/layout/app-sidebar/app-sidebar-component";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (

    
    <div className="flex flex-col md:flex-row min-h-screen bg-white md:p-2">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="h-full w-full">
        {children}
      </div>
    </div>
  );
}