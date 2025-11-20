import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, CreditCard, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cash">("cash");
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderCode, setOrderCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!currentUser) {
      navigate("/auth");
      return;
    }
    loadCart();
  }, [navigate]);

  const loadCart = () => {
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(cartData);
  };

  const removeFromCart = (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Removed from cart");
  };

  const updateQuantity = (id: string, change: number) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    setShowCheckout(true);
  };

  const confirmOrder = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    const code = "AC" + Date.now();

    const order = {
      id: code,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      rollNo: currentUser.rollNo,
      items: cart,
      total: getTotalPrice(),
      paymentMethod,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    setOrderCode(code);
    setShowCheckout(false);
    setShowSuccess(true);
    localStorage.setItem("cart", JSON.stringify([]));
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        {cart.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground text-lg mb-4">Your cart is empty</p>
              <Button onClick={() => navigate("/products")}>Browse Products</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 mb-8">
              {cart.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-muted-foreground">₹{item.price} each</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          -
                        </Button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          +
                        </Button>
                      </div>
                      <p className="font-bold w-24 text-right">₹{item.price * item.quantity}</p>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg">Total:</span>
                  <span className="text-2xl font-bold text-primary">₹{getTotalPrice()}</span>
                </div>
                <Button onClick={handleCheckout} className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
            <DialogDescription>Choose how you'd like to pay for your order</DialogDescription>
          </DialogHeader>
          <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
            <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted">
              <RadioGroupItem value="upi" id="upi" />
              <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                <CreditCard className="h-5 w-5" />
                <div>
                  <p className="font-semibold">UPI Payment</p>
                  <p className="text-sm text-muted-foreground">Pay via UPI</p>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-muted">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                <Wallet className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Cash at Counter</p>
                  <p className="text-sm text-muted-foreground">Pay when collecting</p>
                </div>
              </Label>
            </div>
          </RadioGroup>
          
          {paymentMethod === "upi" && (
            <div className="mt-4 p-4 border rounded-lg bg-muted/50">
              <h4 className="font-semibold mb-3 text-center">Scan QR Code to Pay</h4>
              <div className="flex flex-col items-center gap-3">
                <div className="bg-white p-4 rounded-lg">
                  <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=samskruti@upi&pn=Samskruti%20College&am=" 
                    alt="UPI QR Code" 
                    className="w-48 h-48"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Or pay to UPI ID:</p>
                  <p className="font-mono font-semibold text-primary">samskruti@upi</p>
                  <p className="text-sm text-muted-foreground mt-2">Samskruti College of Engineering</p>
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowCheckout(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={confirmOrder} className="flex-1">
              Confirm Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl flex items-center justify-center gap-2">
              🎉 Order Placed Successfully!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-primary/10 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">Your Order Code</p>
              <p className="text-3xl font-bold text-primary">{orderCode}</p>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                📦 Collection Instructions
              </h4>
              <p className="text-sm mb-2">Please collect your items at the</p>
              <p className="font-semibold">Library of Samskruti College</p>
              <p className="text-xs text-muted-foreground mt-1">
                Samskruti College of Engineering and Technology
              </p>
            </div>

            {paymentMethod === "cash" && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-amber-900">
                  💰 Cash Payment
                </h4>
                <p className="text-sm text-amber-800">Please pay ₹{getTotalPrice()} at the library counter</p>
              </div>
            )}

            <Button onClick={() => navigate("/my-orders")} className="w-full">
              View My Orders
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
