
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {  return (
  
   
         <div className="min-h-screen flex flex-col bg-auth">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-4">
       
        
         {children}
       
      </div>
      
    </div>
      
     
  );
}