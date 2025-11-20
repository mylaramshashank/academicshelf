import { Target, Zap, BookOpen, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About Academic Shelf</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simplifying academic material procurement for students
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
              <p className="text-sm text-muted-foreground">
                To provide students with a seamless digital platform for ordering academic materials,
                eliminating long queues and making the process efficient and hassle-free.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="bg-accent/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick & Easy</h3>
              <p className="text-sm text-muted-foreground">
                Browse materials, place orders online, and collect them at your convenience. No more
                waiting in lines during peak hours.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Materials</h3>
              <p className="text-sm text-muted-foreground">
                We offer high-quality lab records, booklets, and study materials specifically designed
                for academic requirements.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="bg-accent/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Student Focused</h3>
              <p className="text-sm text-muted-foreground">
                Built by students, for students. We understand your needs and strive to make your
                academic journey smoother.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Academic Shelf was born out of a simple observation: students were spending too much time
                waiting in long queues to purchase essential academic materials like lab records and
                booklets, especially during peak hours.
              </p>
              <p>
                We realized that with the power of technology, we could create a platform that would make
                this process seamless and efficient. Students could browse, order, and collect their
                materials at their convenience without the hassle of long waits.
              </p>
              <p>
                Today, Academic Shelf serves students at Samskruti College of Engineering and Technology,
                helping them focus more on their studies and less on administrative tasks.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
