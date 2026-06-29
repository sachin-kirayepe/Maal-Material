"use client";

import React, { useState } from "react";
import { User, Mail, Building, Phone, ShieldCheck, Lock, Globe } from "lucide-react";
import { FileUpload } from "@/components/ui/FileUpload";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";

export default function SettingsPage() {
  const { user } = useAuthStore() as any;
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const handleUploadSuccess = (url: string) => {
    setProfilePic(url);
    toast.success("Profile picture updated successfully!");
    // In a real app, call a backend API here to save the profile picture URL to the user record
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      
      <div>
        <h1 className="text-3xl font-light tracking-tight text-white mb-2">Account Settings</h1>
        <p className="text-zinc-400">Manage your profile, preferences, and organization details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & Quick Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-3xl flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-800 bg-zinc-900 flex items-center justify-center">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className="text-zinc-600" />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-purple-500 text-white p-2 rounded-full border-4 border-black">
                <ShieldCheck size={16} />
              </div>
            </div>
            
            <h2 className="text-xl font-medium text-white">{user?.name || "System Admin"}</h2>
            <p className="text-sm text-zinc-400 mb-6">{user?.email || "admin@constructos.com"}</p>
            
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Identity Verified
            </span>
          </div>

          {/* Supabase Upload Component */}
          <div className="glass-panel p-6 rounded-3xl">
            <h3 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider">Update Avatar</h3>
            <FileUpload 
              bucketName="constructos-public" 
              label="Drop new profile photo" 
              onUploadSuccess={handleUploadSuccess} 
            />
          </div>
        </div>

        {/* Right Column: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-8 rounded-3xl">
            <h3 className="text-xl font-medium text-white mb-6">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-zinc-400 flex items-center gap-2"><User size={14}/> Full Name</label>
                <input type="text" defaultValue={user?.name || "System Admin"} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-zinc-400 flex items-center gap-2"><Mail size={14}/> Email Address</label>
                <input type="email" defaultValue={user?.email || "admin@constructos.com"} disabled className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-500 cursor-not-allowed" />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-400 flex items-center gap-2"><Phone size={14}/> Phone Number</label>
                <input type="tel" defaultValue="+91 98765 43210" className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-400 flex items-center gap-2"><Building size={14}/> Organization</label>
                <input type="text" defaultValue="Company Name" className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button className="px-6 py-2.5 rounded-xl font-medium text-zinc-400 hover:text-white transition-colors">Discard</button>
              <button className="bg-purple-500 text-white px-8 py-2.5 rounded-xl font-medium hover:bg-purple-400 transition-colors shadow-[0_0_20px_rgba(168,85,247,0.3)]">Save Changes</button>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl">
            <h3 className="text-xl font-medium text-white mb-6">Security & Preferences</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-black border border-zinc-800 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-900 rounded-lg"><Lock className="text-purple-400" size={20} /></div>
                  <div>
                    <h4 className="text-white font-medium">Two-Factor Authentication (2FA)</h4>
                    <p className="text-sm text-zinc-500">Secure your account with an extra layer of security.</p>
                  </div>
                </div>
                <button className="bg-zinc-900 text-white border border-zinc-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">Enable</button>
              </div>

              <div className="flex items-center justify-between p-4 bg-black border border-zinc-800 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-900 rounded-lg"><Globe className="text-purple-400" size={20} /></div>
                  <div>
                    <h4 className="text-white font-medium">Language Preference</h4>
                    <p className="text-sm text-zinc-500">Choose your preferred dashboard language.</p>
                  </div>
                </div>
                <select className="bg-zinc-900 text-white border border-zinc-800 px-4 py-2 rounded-lg text-sm font-medium focus:outline-none focus:border-purple-500">
                  <option>English (US)</option>
                  <option>Hindi (भारत)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
