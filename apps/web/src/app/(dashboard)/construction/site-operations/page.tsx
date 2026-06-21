"use client";

import React, { useState } from "react";
import { ClipboardEdit, CloudRain, Sun, Wind, AlertCircle, HardHat, Camera, Save, Loader2 } from "lucide-react";
import { useSiteOpsStore } from "../../../../stores/siteOpsStore";
import { useUploadStore } from "../../../../stores/uploadStore";

export default function SiteOperations() {
  const { submitDailyLog, isLoading } = useSiteOpsStore();
  const uploadState = useUploadStore();
  const [photos, setPhotos] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    weather: "Clear / Sunny",
    activities: "",
    incident: "No Incidents",
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = await uploadState.uploadFile('constructos-site', e.target.files[0], 'photos');
      if (url) {
        setPhotos(prev => [...prev, url]);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      await submitDailyLog(formData);
      alert("Daily log submitted successfully");
      setFormData({ weather: "Clear / Sunny", activities: "", incident: "No Incidents" });
    } catch (e) {
      alert("Failed to submit log");
    }
  };
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <ClipboardEdit className="text-purple-500" size={28} /> Daily Site Operations
          </h1>
          <p className="text-zinc-400">Log daily site conditions, weather, safety incidents, and work delays.</p>
        </div>
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 text-sm text-zinc-400">
          <span>Date:</span> <span className="text-white font-medium">15 Jun, 2026</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Log Form */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-medium mb-4">Weather Conditions</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <button 
                onClick={() => setFormData({ ...formData, weather: "Clear / Sunny" })}
                className={`${formData.weather === "Clear / Sunny" ? "bg-purple-500/10 border-purple-500/30 text-purple-400" : "bg-black border-zinc-800 text-zinc-500"} border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-colors`}>
                <Sun size={24} /> Clear / Sunny
              </button>
              <button 
                onClick={() => setFormData({ ...formData, weather: "Rainy / Wet" })}
                className={`${formData.weather === "Rainy / Wet" ? "bg-purple-500/10 border-purple-500/30 text-purple-400" : "bg-black border-zinc-800 text-zinc-500"} border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-colors`}>
                <CloudRain size={24} /> Rainy / Wet
              </button>
              <button 
                onClick={() => setFormData({ ...formData, weather: "Stormy / High Wind" })}
                className={`${formData.weather === "Stormy / High Wind" ? "bg-purple-500/10 border-purple-500/30 text-purple-400" : "bg-black border-zinc-800 text-zinc-500"} border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-colors`}>
                <Wind size={24} /> Stormy / High Wind
              </button>
            </div>
            <p className="text-xs text-zinc-500">Note: Severe weather will automatically flag a potential schedule delay in the main project timeline.</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-medium mb-4">Site Activities & Delays</h3>
            <textarea 
              value={formData.activities}
              onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
              rows={4} 
              placeholder="Describe main activities completed today, and any reasons for delay (e.g. material shortage, power outage)..." 
              className="w-full bg-black border border-zinc-800 rounded-xl p-4 focus:outline-none focus:border-purple-500 text-white resize-none"
            ></textarea>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-medium mb-4 text-red-400 flex items-center gap-2"><AlertCircle size={18}/> Safety & Incidents</h3>
            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" name="incident" className="accent-purple-500" 
                  checked={formData.incident === "No Incidents"}
                  onChange={() => setFormData({ ...formData, incident: "No Incidents" })}
                />
                <span className="text-sm text-zinc-300">No Incidents</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" name="incident" className="accent-red-500" 
                  checked={formData.incident === "Report an Incident"}
                  onChange={() => setFormData({ ...formData, incident: "Report an Incident" })}
                />
                <span className="text-sm text-red-400">Report an Incident</span>
              </label>
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-purple-500 text-white py-3.5 rounded-xl font-medium hover:bg-purple-400 transition-colors flex justify-center items-center gap-2 disabled:opacity-50">
            <Save size={18} /> {isLoading ? "Submitting..." : "Submit Daily Log"}
          </button>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-medium mb-4 flex items-center gap-2"><Camera size={18} className="text-zinc-400"/> Site Photos</h3>
            <label className="border-2 border-dashed border-zinc-700 rounded-xl h-32 flex flex-col items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-500 transition-colors cursor-pointer mb-4">
              {uploadState.isUploading ? <Loader2 size={24} className="mb-2 animate-spin text-purple-500" /> : <Camera size={24} className="mb-2" />}
              <span className="text-sm">{uploadState.isUploading ? 'Uploading...' : 'Click to upload progress photos'}</span>
              <input type="file" accept="image/*" className="hidden" disabled={uploadState.isUploading} onChange={handlePhotoUpload} />
            </label>
            <div className="flex gap-2 overflow-x-auto">
              {photos.length > 0 ? photos.map((url, i) => (
                <div key={i} className="w-16 h-16 bg-zinc-800 rounded-lg bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${url})` }}></div>
              )) : (
                <>
                  <div className="w-16 h-16 bg-zinc-800 rounded-lg shrink-0"></div>
                  <div className="w-16 h-16 bg-zinc-800 rounded-lg shrink-0"></div>
                </>
              )}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-medium mb-4 flex items-center gap-2"><HardHat size={18} className="text-zinc-400"/> Auto-Fetched Data</h3>
            <div className="space-y-3">
              <div className="bg-black border border-zinc-800 rounded-lg p-3 text-sm">
                <span className="text-zinc-500 block mb-1">Labor Headcount (Today)</span>
                <span className="text-white font-medium">45 Workers Logged</span>
              </div>
              <div className="bg-black border border-zinc-800 rounded-lg p-3 text-sm">
                <span className="text-zinc-500 block mb-1">Material Issues</span>
                <span className="text-white font-medium">3 Slips Generated</span>
              </div>
              <p className="text-xs text-zinc-500 text-center mt-2">These stats are linked from other modules.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
