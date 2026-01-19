"use client";
import { Button } from "@/components/common/button";



export default function GlobalError({
 
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
   
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md text-center">
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {"Something went wrong!"}
            </h1>
            <p className="mt-4 text-base text-muted-foreground">
              {"We apologize for the inconvenience. Please try again."}
            </p>
            <div className="mt-6">
              <Button
                onClick={() => reset()}
                className=""
              >
                {"Try again"}
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
