import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = formData.email.trim().toLowerCase();

    if (isLogin) {
      // Admin login check first (case-insensitive email)
      if (normalizedEmail === "admin@samskruti.edu" && formData.password === "admin123") {
        const adminUser = {
          id: "admin",
          email: "admin@samskruti.edu",
          name: "Admin",
        };
        localStorage.setItem("currentUser", JSON.stringify(adminUser));
        toast.success("Welcome Admin!", { description: "Logged in successfully" });
        navigate("/admin");
        return;
      }

      // Regular user login
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(
        (u: any) => u.email === normalizedEmail && u.password === formData.password
      );

      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        toast.success("Login successful", { description: "Welcome back!" });
        navigate("/");
      } else {
        toast.error("Invalid credentials");
      }
    } else {
      // Register logic
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const existingUser = users.find(
        (u: any) => u.email.toLowerCase() === normalizedEmail
      );

      if (existingUser) {
        toast.error("Email already registered");
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        rollNo: formData.rollNo.trim(),
        email: normalizedEmail,
        password: formData.password,
        registeredAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      toast.success("Registration successful", { description: "Welcome to Academic Shelf!" });
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <BookOpen className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Academic Shelf</CardTitle>
          <CardDescription>
            {isLogin ? "Login to your account" : "Create a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rollNo">Roll Number</Label>
                  <Input
                    id="rollNo"
                    type="text"
                    placeholder="Enter your roll number"
                    value={formData.rollNo}
                    onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                    required
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full">
              {isLogin ? "Login" : "Register"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline"
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
