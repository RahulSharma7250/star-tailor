
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LoginPage = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    role: ""
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.username && credentials.password && credentials.role) {
      onLogin({
        name: credentials.username,
        role: credentials.role
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-blue-900 font-bold text-2xl">ST</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">STAR TAILORS</CardTitle>
          <p className="text-gray-600">Management System Login</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                placeholder="Enter username"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                placeholder="Enter password"
                required
              />
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={credentials.role} onValueChange={(value) => setCredentials({...credentials, role: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Billing Staff">Billing Staff</SelectItem>
                  <SelectItem value="cutting">Cutting Department</SelectItem>
                  <SelectItem value="blouse-stitching">Blouse Stitching</SelectItem>
                  <SelectItem value="dress-stitching">Dress Stitching</SelectItem>
                  <SelectItem value="finishing">Finishing Department</SelectItem>
                  <SelectItem value="ironing">Ironing Department</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700"
            >
              Login
            </Button>
          </form>

          <div className="mt-6 text-sm text-gray-600">
            <p className="font-semibold mb-2">Demo Credentials:</p>
            <div className="space-y-1">
              <p><strong>Admin:</strong> admin / admin123</p>
              <p><strong>Billing Staff:</strong> billing / billing123</p>
              <p><strong>Cutting:</strong> cutting / cutting123</p>
              <p><strong>Blouse Stitching:</strong> blouse / blouse123</p>
              <p><strong>Dress Stitching:</strong> dress / dress123</p>
              <p><strong>Finishing:</strong> finishing / finishing123</p>
              <p><strong>Ironing:</strong> ironing / ironing123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
