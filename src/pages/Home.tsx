import { useState, useEffect } from "react";
import { GraduationCap, Target, Zap, BookOpen, Users, ShoppingCart, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  type: "records" | "booklets";
  price: number;
  stock: number;
  description: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts();
    
    const handleStorageChange = () => {
      loadProducts();
    };

    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const loadProducts = () => {
    const storedProducts = localStorage.getItem("products");
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  };

  const addToCart = (product: Product) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!currentUser) {
      toast.error("Please login first");
      return;
    }

    if (currentUser.email === "admin@samskruti.edu") {
      toast.error("Admins cannot purchase products");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItem = cart.find((item: any) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success("Added to cart");
  };
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary via-primary/90 to-accent text-white py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <GraduationCap className="h-16 w-16" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Academic Shelf</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Your one-stop destination for quality academic materials. Browse, order, and excel in your studies.
          </p>
          <Button asChild size="lg" variant="secondary" className="font-semibold">
            <Link to="/products">
              <BookOpen className="mr-2 h-5 w-5" />
              Shop Now
            </Link>
          </Button>
        </div>
      </section>

      {/* Browse Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse Academic Materials</h2>
          <p className="text-center text-muted-foreground mb-8">
            Select the materials you need for your academic work
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {products.map((product) => (
              <Card key={product.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div
                    className={`${
                      product.type === "records" ? "bg-primary/10" : "bg-accent/10"
                    } rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}
                  >
                    {product.type === "records" ? (
                      <BookOpen className="h-8 w-8 text-primary" />
                    ) : (
                      <FileText className="h-8 w-8 text-accent" />
                    )}
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                  <p className="text-3xl font-bold text-primary mb-2">₹{product.price}</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Stock: {product.stock} available
                  </p>
                  <Button onClick={() => addToCart(product)} className="w-full">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">About Academic Shelf</h2>
          <p className="text-center text-muted-foreground mb-12">
            Simplifying academic material procurement for students
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
                <p className="text-sm text-muted-foreground">
                  To provide students with a seamless digital platform for ordering academic materials, eliminating long queues and making the process efficient and hassle-free.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="bg-accent/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quick & Easy</h3>
                <p className="text-sm text-muted-foreground">
                  Browse materials, place orders online, and collect them at your convenience. No more waiting in lines during peak hours.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Materials</h3>
                <p className="text-sm text-muted-foreground">
                  We offer high-quality lab records, booklets, and study materials specifically designed for academic requirements.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="bg-accent/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Student Focused</h3>
                <p className="text-sm text-muted-foreground">
                  Built by students, for students. We understand your needs and strive to make your academic journey smoother.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {[
                "Register or login to your account",
                "Browse available academic materials",
                "Add items to cart and select payment method (UPI or Cash at Counter)",
                "Complete your order and receive a unique order code",
                "Collect your materials from the counter using your order code"
              ].map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                    {index + 1}
                  </div>
                  <p className="pt-1 text-foreground">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
          <p className="text-muted-foreground mb-8">Have questions? We're here to help!</p>
          <Button asChild size="lg">
            <Link to="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
