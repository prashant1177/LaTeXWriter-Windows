import { Link } from "react-router-dom";
import { useState } from "react";
import Button from "../ui/Button/Button";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="text-xl font-medium">LaTeXWriter</span>
          </div>

          {/* Desktop Menu */}
          

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button>Sign in</Button>
            </Link>
            <Link to="/register">
              <Button varient="transparent">Get Help</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          
        </div>
</div>
    </nav>
  );
}
