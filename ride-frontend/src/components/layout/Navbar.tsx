import { Link, useLocation } from "react-router-dom";
import { Phone, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/utils/cn"; // Small utility to manage classes

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Our Fleet", path: "/fleet" },
    { name: "About us", path: "/about" },
    { name: "Contacts", path: "/contacts" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 px-6 md:px-12",
        scrolled
          ? "h-20 bg-background/80 backdrop-blur-md"
          : "h-24 bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary text-background font-extrabold px-2 py-1 rounded transition-transform group-hover:scale-105">
            NYC
          </div>
          <span className="text-2xl font-bold tracking-tight">Taxi</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive(link.path) ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Contact info + CTA */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 text-primary font-bold">
            <Phone size={18} />
            <span>+1 (234) 567 89 00</span>
          </div>
          <Link
            to="/"
            className="bg-primary hover:bg-primary-dark text-background px-5 py-2 rounded-md font-bold text-sm shadow-lg transition-all hover:translate-y-[-2px]"
          >
            BOOK NOW
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 top-20 bg-background/95 backdrop-blur-lg z-40 md:hidden transition-all duration-300 flex flex-col items-center pt-12 gap-8",
        isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      )}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={() => setIsOpen(false)}
            className={cn(
              "text-2xl font-bold",
              isActive(link.path) ? "text-primary" : "text-foreground"
            )}
          >
            {link.name}
          </Link>
        ))}
        <div className="flex flex-col items-center gap-4 mt-8">
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <Phone size={24} />
            <span>+1 (234) 567 89 00</span>
          </div>
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="bg-primary text-background px-12 py-4 rounded-md font-bold text-xl"
          >
            BOOK NOW
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
