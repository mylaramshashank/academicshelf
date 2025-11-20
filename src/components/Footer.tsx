import { BookOpen, Mail, Phone, MapPin, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">Academic Shelf</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted platform for academic materials. Browse, order, and collect all your study essentials.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm text-muted-foreground hover:text-primary">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="text-sm text-muted-foreground hover:text-primary">
                  My Orders
                </Link>
              </li>
              <li>
                <Button variant="outline" size="sm" asChild className="mt-2">
                  <Link to="/admin" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Admin Portal
                  </Link>
                </Button>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mt-0.5" />
                <span>support@academicshelf.com</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 mt-0.5" />
                <span>+91 1234567890</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Campus Bookstore, Main Gate</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          © 2025 Academic Shelf. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
