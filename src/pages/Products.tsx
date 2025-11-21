import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, FileText, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  type: "records" | "booklets";
  price: number;
  stock: number;
  description: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize products if not exists
    const storedProducts = localStorage.getItem("products");
    if (!storedProducts) {
      const defaultProducts: Product[] = [
        {
          id: "1",
          name: "Records",
          type: "records",
          price: 120,
          stock: 50,
          description: "Academic Material",
        },
        {
          id: "2",
          name: "Booklets",
          type: "booklets",
          price: 30,
          stock: 100,
          description: "Academic Material",
        },
      ];
      localStorage.setItem("products", JSON.stringify(defaultProducts));
      setProducts(defaultProducts);
    } else {
      setProducts(JSON.parse(storedProducts));
    }
  }, []);

  // Refresh products when component mounts or localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const storedProducts = localStorage.getItem("products");
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    // Also check every second for changes (for same-window updates)
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const addToCart = (product: Product) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!currentUser) {
      toast.error("Please login first");
      navigate("/auth");
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
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-accent text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Browse Academic Materials</h1>
          <p className="text-lg">Select the materials you need for your academic work</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {products.map((product) => (
            <Card key={product.id} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="text-center">
                  <div
                    className={`${
                      product.type === "records" ? "bg-primary/10" : "bg-accent/10"
                    } rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4`}
                  >
                    {product.type === "records" ? (
                      <BookOpen
                        className={`h-8 w-8 ${product.type === "records" ? "text-primary" : "text-accent"}`}
                      />
                    ) : (
                      <FileText className="h-8 w-8 text-accent" />
                    )}
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">{product.name}</h3>
                  <Badge variant="secondary" className="mb-4">
                    {product.description}
                  </Badge>
                  <p className="text-3xl font-bold text-primary mb-2">₹{product.price}</p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Stock: {product.stock} available
                  </p>
                  <Button onClick={() => addToCart(product)} className="w-full" size="lg">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
