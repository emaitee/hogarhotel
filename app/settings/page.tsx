'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Hotel, Save, Bell, Mail, Shield } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage hotel settings and preferences
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hotel Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Hotel className="h-5 w-5" />
                <span>Hotel Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hotelName">Hotel Name</Label>
                <Input
                  id="hotelName"
                  defaultValue="HotelPro Grand Lagos"
                  placeholder="Enter hotel name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hotelAddress">Address</Label>
                <Textarea
                  id="hotelAddress"
                  defaultValue="123 Victoria Island, Lagos, Nigeria"
                  placeholder="Enter hotel address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hotelPhone">Phone</Label>
                <Input
                  id="hotelPhone"
                  defaultValue="+234-803-123-4567"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hotelEmail">Email</Label>
                <Input
                  id="hotelEmail"
                  type="email"
                  defaultValue="info@hotelgrandlagos.com"
                  placeholder="Enter email address"
                />
              </div>
              <Button className="w-full bg-[#1B2A41] hover:bg-[#1B2A41]/90">
                <Save className="h-4 w-4 mr-2" />
                Save Hotel Information
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Room Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Room Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="checkInTime">Check-in Time</Label>
                <Input
                  id="checkInTime"
                  type="time"
                  defaultValue="15:00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkOutTime">Check-out Time</Label>
                <Input
                  id="checkOutTime"
                  type="time"
                  defaultValue="11:00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  defaultValue="10"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select defaultValue="ngn">
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ngn">NGN (₦)</SelectItem>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-[#1B2A41] hover:bg-[#1B2A41]/90">
                <Save className="h-4 w-4 mr-2" />
                Save Room Settings
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Email Notifications</div>
                  <div className="text-sm text-gray-500">Receive notifications via email</div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">New Booking Alerts</div>
                  <div className="text-sm text-gray-500">Get notified of new bookings</div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Payment Notifications</div>
                  <div className="text-sm text-gray-500">Alerts for payment updates</div>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Maintenance Alerts</div>
                  <div className="text-sm text-gray-500">Room maintenance notifications</div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-gray-500">Add an extra layer of security</div>
                </div>
                <Switch />
              </div>
              <Button className="w-full bg-[#1B2A41] hover:bg-[#1B2A41]/90">
                <Save className="h-4 w-4 mr-2" />
                Update Security Settings
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
