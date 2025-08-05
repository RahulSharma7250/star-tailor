import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BlouseFinishingPanel from "@/components/BlouseFinishingPanel";
import DressFinishingPanel from "@/components/DressFinishingPanel";

const FinishingSection = () => {
  // Mock user data for admin access to both panels
  const mockUser = { id: "admin", name: "Admin", role: "admin" };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Finishing Section</h1>
        <p className="text-gray-600">Manage blouse and dress finishing orders</p>
      </div>

      <Tabs defaultValue="blouse" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="blouse">Blouse Finishing</TabsTrigger>
          <TabsTrigger value="dress">Dress Finishing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="blouse" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Blouse Finishing Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <BlouseFinishingPanel user={mockUser} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dress" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Dress Finishing Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <DressFinishingPanel user={mockUser} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinishingSection;