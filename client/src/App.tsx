import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Home from "@/pages/Home";
import Universities from "@/pages/Universities";
import UniversityDetails from "@/pages/UniversityDetails";
import Colleges from "@/pages/Colleges";
import Projects from "@/pages/Projects";
import Guidance from "@/pages/Guidance";
import Apply from "@/pages/Apply";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Compare from "@/pages/Compare";
import NotFound from "@/pages/not-found";

// Component to scroll to top on route change
function ScrollToTop() {
  const [pathname] = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/universities" component={Universities} />
      <Route path="/universities/:id" component={UniversityDetails} />
      <Route path="/colleges" component={Colleges} />
      <Route path="/projects" component={Projects} />
      <Route path="/guidance" component={Guidance} />
      <Route path="/apply/:uniId?" component={Apply} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/login" component={Login} />
      <Route path="/compare" component={Compare} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="appTheme">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <ScrollToTop />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
