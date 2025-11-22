import { Link, useLocation } from "react-router-dom";
import { BookOpen, User, LogOut, Menu } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  onLogout?: () => void;
}

export const Navbar = ({ onLogout }: NavbarProps) => {
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/products", label: "Products" },
    { path: "/cart", label: "Cart" },
    { path: "/my-orders", label: "My Orders" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
    { path: "/admin", label: "Admin" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <BookOpen className="h-6 w-6" />
            Academic Shelf
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Button
                key={link.path}
                variant={location.pathname === link.path ? "default" : "ghost"}
                asChild
              >
                <Link to={link.path}>{link.label}</Link>
              </Button>
            ))}
          </div>

          {/* Desktop user controls */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {currentUser.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-2 text-sm">
                    <p className="font-semibold">{currentUser.name}</p>
                    <p className="text-muted-foreground text-xs">{currentUser.email}</p>
                    {currentUser.rollNo && (
                      <p className="text-muted-foreground text-xs">Roll: {currentUser.rollNo}</p>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-destructive cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link to="/auth">Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Academic Shelf
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-2">
                  {navLinks.map((link) => (
                    <Button
                      key={link.path}
                      variant={location.pathname === link.path ? "default" : "ghost"}
                      className="w-full justify-start"
                      asChild
                    >
                      <Link to={link.path}>{link.label}</Link>
                    </Button>
                  ))}

                  {!currentUser && (
                    <Button className="w-full justify-start mt-2" asChild>
                      <Link to="/auth">Login</Link>
                    </Button>
                  )}

                  {currentUser && (
                    <div className="mt-4 space-y-3 border-t pt-4">
                      <div className="text-sm">
                        <p className="font-semibold">{currentUser.name}</p>
                        <p className="text-muted-foreground text-xs">{currentUser.email}</p>
                        {currentUser.rollNo && (
                          <p className="text-muted-foreground text-xs">Roll: {currentUser.rollNo}</p>
                        )}
                      </div>
                      <Button
                        variant="destructive"
                        className="w-full justify-start"
                        onClick={() => onLogout?.()}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
