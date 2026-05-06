import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center glass rounded-2xl p-10">
        <h1 className="mb-4 text-5xl font-bold gradient-text">404</h1>
        <p className="mb-6 text-lg text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
