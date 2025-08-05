import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BlouseStitchingPanel from "@/components/BlouseStitchingPanel";
import DressStitchingPanel from "@/components/DressStitchingPanel";

const StitchingSection = () => {
  // Mock user data for admin access to both panels
  const mockUser = { id: "admin", name: "Admin", role: "admin" };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Stitching Section</h1>
        <p className="text-gray-600">Manage blouse and dress stitching orders</p>
      </div>

      <Tabs defaultValue="blouse" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="blouse">Blouse Stitching</TabsTrigger>
          <TabsTrigger value="dress">Dress Stitching</TabsTrigger>
        </TabsList>
        
        <TabsContent value="blouse" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Blouse Stitching Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <BlouseStitchingPanel user={mockUser} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dress" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Dress Stitching Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <DressStitchingPanel user={mockUser} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StitchingSection;