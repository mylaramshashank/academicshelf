import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Package, Users as UsersIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Admin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!currentUser || currentUser.email !== "admin@samskruti.edu") {
      toast.error("Admin access only");
      navigate("/");
      return;
    }

    loadData();

    // Set up real-time subscription for orders
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          loadData(); // Reload data when orders change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate]);

  const loadData = async () => {
    // Load from localStorage for user records (backwards compatibility)
    setUsers(JSON.parse(localStorage.getItem("users") || "[]"));
    setProducts(JSON.parse(localStorage.getItem("products") || "[]"));

    // Fetch orders from Supabase for real-time data
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            product_id,
            products (name)
          )
        `)
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      // Transform Supabase data to match localStorage format
      const transformedOrders = ordersData?.map((order: any) => ({
        id: order.order_code,
        userId: order.user_id,
        userName: "User", // We don't have this in the DB
        userEmail: "",
        rollNo: "",
        items: order.order_items.map((item: any) => ({
          id: item.product_id,
          name: item.products.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total: order.total,
        paymentMethod: order.payment_method,
        status: order.status,
        createdAt: order.created_at,
      })) || [];

      setOrders(transformedOrders);
    } catch (error: any) {
      console.error("Error loading orders:", error);
      // Fallback to localStorage if Supabase fails
      setOrders(JSON.parse(localStorage.getItem("orders") || "[]"));
    }
  };

  const updateStock = (productId: string, newStock: number) => {
    const stockValue = Math.max(0, newStock);
    const updatedProducts = products.map((p) => {
      if (p.id === productId) {
        return { ...p, stock: stockValue };
      }
      return p;
    });
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    // Trigger storage event for cross-window updates
    window.dispatchEvent(new Event("storage"));
    toast.success("Stock updated");
  };

  // Calculate November stats
  const getNovemberStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth(); // 10 for November (0-indexed)
    const currentYear = now.getFullYear();

    const novemberOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });

    const totalRevenue = novemberOrders.reduce((sum, order) => sum + order.total, 0);
    
    let recordsQty = 0;
    let recordsPrice = 0;
    let bookletsQty = 0;
    let bookletsPrice = 0;

    novemberOrders.forEach((order) => {
      order.items.forEach((item: any) => {
        if (item.name === "Records") {
          recordsQty += item.quantity;
          recordsPrice += item.quantity * item.price;
        } else if (item.name === "Booklets") {
          bookletsQty += item.quantity;
          bookletsPrice += item.quantity * item.price;
        }
      });
    });

    return { totalRevenue, recordsQty, recordsPrice, bookletsQty, bookletsPrice };
  };

  // Generate November daily revenue data
  const getRevenueData = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const dailyRevenue: { [key: string]: number } = {};
    
    // Initialize all days with 0
    for (let day = 1; day <= daysInMonth; day++) {
      dailyRevenue[day] = 0;
    }

    // Calculate revenue per day
    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
        const day = orderDate.getDate();
        dailyRevenue[day] += order.total;
      }
    });

    // Convert to chart format (show every 5 days for clarity)
    return Object.keys(dailyRevenue)
      .filter((day) => parseInt(day) % 5 === 0 || parseInt(day) === 1 || parseInt(day) === daysInMonth)
      .map((day) => ({
        day: `Nov ${day}`,
        revenue: dailyRevenue[day],
      }));
  };

  const stats = getNovemberStats();
  const revenueData = getRevenueData();

  const getPaymentBadge = (method: string) => {
    if (method === "upi") {
      return <Badge className="bg-blue-500">UPI</Badge>;
    }
    return <Badge variant="outline">Cash</Badge>;
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            Logout
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue (Nov)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">₹{stats.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Records Sold</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.recordsQty}</div>
              <p className="text-sm text-muted-foreground mt-1">Total: ₹{stats.recordsPrice.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Booklets Sold</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.bookletsQty}</div>
              <p className="text-sm text-muted-foreground mt-1">Total: ₹{stats.bookletsPrice.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              November Revenue Trend
            </CardTitle>
            <CardDescription>Daily revenue tracking for current month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="purchases" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="purchases">Purchase Records</TabsTrigger>
            <TabsTrigger value="users">User Records</TabsTrigger>
            <TabsTrigger value="stock">Stock Management</TabsTrigger>
          </TabsList>

          {/* Purchase Records Tab */}
          <TabsContent value="purchases">
            <Card>
              <CardHeader>
                <CardTitle>All Purchase Records</CardTitle>
                <CardDescription>Complete order history with user details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Order ID</th>
                        <th className="text-left p-4">Name</th>
                        <th className="text-left p-4">Roll No</th>
                        <th className="text-left p-4">Items</th>
                        <th className="text-left p-4">Payment Method</th>
                        <th className="text-left p-4">Total</th>
                        <th className="text-left p-4">Date</th>
                        <th className="text-left p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="p-4">{order.id}</td>
                          <td className="p-4">{order.userName}</td>
                          <td className="p-4">{order.rollNo}</td>
                          <td className="p-4">
                            {order.items.map((item: any, idx: number) => (
                              <div key={idx} className="text-sm">
                                {item.name} x {item.quantity}
                              </div>
                            ))}
                          </td>
                          <td className="p-4">{getPaymentBadge(order.paymentMethod)}</td>
                          <td className="p-4 font-bold text-primary">₹{order.total}</td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleString()}
                          </td>
                          <td className="p-4">
                            <Badge variant="secondary">{order.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {orders.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No orders yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Records Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Registered Users</CardTitle>
                <CardDescription>All registered students and their details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Name</th>
                        <th className="text-left p-4">Roll No</th>
                        <th className="text-left p-4">Email</th>
                        <th className="text-left p-4">Registration Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users
                        .filter((u) => u.email !== "admin@samskruti.edu")
                        .map((user) => (
                          <tr key={user.id} className="border-b">
                            <td className="p-4">{user.name}</td>
                            <td className="p-4">{user.rollNo}</td>
                            <td className="p-4">{user.email}</td>
                            <td className="p-4 text-sm text-muted-foreground">
                              {new Date(user.registeredAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {users.filter((u) => u.email !== "admin@samskruti.edu").length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No users registered yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stock Management Tab */}
          <TabsContent value="stock">
            <Card>
              <CardHeader>
                <CardTitle>Stock Management</CardTitle>
                <CardDescription>Update inventory for academic materials</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <Card key={product.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-semibold">{product.name}</h3>
                            <p className="text-muted-foreground">₹{product.price}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">Current Stock:</span>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                min="0"
                                value={product.stock}
                                onChange={(e) => updateStock(product.id, parseInt(e.target.value) || 0)}
                                className="w-32 text-center font-bold text-lg"
                              />
                              <span className="text-sm text-muted-foreground">units</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
