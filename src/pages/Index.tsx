
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4">Welcome to MiraklePay</h1>
        <p className="text-xl text-gray-600 mb-8">Secure digital payment platform</p>
        <div className="space-x-4">
          <Button asChild>
            <Link to="/admin">Admin Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
