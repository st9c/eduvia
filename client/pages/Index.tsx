import { Layout } from "@/components/Layout";
import { Feed } from "@/components/Feed";
import { AssignmentsSidebar } from "@/components/AssignmentsSidebar";

export default function Index() {
  return (
    <Layout>
      <div className="min-h-screen bg-background px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">Community Feed</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Feed - Left side */}
            <div className="lg:col-span-2">
              <Feed />
            </div>
            {/* Sidebar - Right side */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <AssignmentsSidebar />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
