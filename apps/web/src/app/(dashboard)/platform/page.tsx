"use client";

import React, { useState } from "react";
import { Palette, Upload, Save, Globe, Smartphone, Loader2, CheckCircle2 } from "lucide-react";
import { useUploadStore } from "../../../stores/uploadStore";

export default function PlatformSettings() {
  const uploadState = useUploadStore();
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadState.uploadFile('constructos-assets', e.target.files[0], 'logos');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-white mb-2 flex items-center gap-3">
            <Palette className="text-fuchsia-500" size={28} /> Tenant White-Label Settings
          </h1>
          <p className="text-zinc-400">Customize the Maal-Material platform appearance and domains for your specific organization.</p>
        </div>
        <button className="flex items-center gap-2 bg-fuchsia-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-fuchsia-500 transition-colors">
          <Save size={18} /> Save & Apply
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Settings Form */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-medium text-lg mb-6 flex items-center gap-2"><Globe className="text-zinc-400" size={20}/> Custom Domain</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Company Subdomain</label>
                <div className="flex items-center">
                  <input type="text" defaultValue="jindal" className="bg-black border border-zinc-800 rounded-l-lg px-4 py-2 focus:outline-none focus:border-fuchsia-500 w-full" />
                  <span className="bg-zinc-800 border border-l-0 border-zinc-800 rounded-r-lg px-4 py-2 text-zinc-400 text-sm">.constructos.com</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Custom Apex Domain (Optional)</label>
                <input type="text" placeholder="e.g. erp.jindalsteel.com" className="bg-black border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-fuchsia-500 w-full text-sm" />
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-medium text-lg mb-6 flex items-center gap-2"><Palette className="text-zinc-400" size={20}/> Branding</h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs text-zinc-400 block mb-2">Platform Logo</label>
                <label className="border-2 border-dashed border-zinc-700 rounded-xl p-8 flex flex-col items-center justify-center text-zinc-500 hover:border-fuchsia-500 hover:text-fuchsia-400 transition-colors cursor-pointer bg-black/50">
                  {uploadState.isUploading ? (
                    <Loader2 size={24} className="mb-2 animate-spin text-fuchsia-500" />
                  ) : uploadState.uploadedUrl ? (
                    <CheckCircle2 size={24} className="mb-2 text-green-500" />
                  ) : (
                    <Upload size={24} className="mb-2" />
                  )}
                  <p className="text-sm font-medium">
                    {uploadState.isUploading ? 'Uploading...' : uploadState.uploadedUrl ? 'Uploaded Successfully' : 'Click to upload SVG or PNG'}
                  </p>
                  <p className="text-xs mt-1">Recommended size: 256x64px</p>
                  <input type="file" accept=".svg,.png,.jpg" className="hidden" disabled={uploadState.isUploading} onChange={handleLogoUpload} />
                </label>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-2">Primary Brand Color</label>
                <div className="flex gap-4 items-center">
                  <input 
                    type="color" 
                    value={primaryColor} 
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12 h-12 rounded cursor-pointer border-0 p-0 bg-transparent" 
                  />
                  <input 
                    type="text" 
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="bg-black border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:border-fuchsia-500 font-mono text-sm" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col">
          <h3 className="font-medium text-lg mb-6 flex items-center gap-2"><Smartphone className="text-zinc-400" size={20}/> Live Preview</h3>
          
          <div className="flex-1 bg-[#050505] border border-zinc-800 rounded-xl overflow-hidden flex flex-col relative">
            {/* Fake Browser Chrome */}
            <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              </div>
              <div className="mx-auto bg-black border border-zinc-800 rounded text-[10px] text-zinc-500 px-24 py-1">
                jindal.constructos.com
              </div>
            </div>

            {/* Fake App Preview */}
            <div className="flex-1 flex">
              {/* Fake Sidebar */}
              <div className="w-48 bg-zinc-900/50 border-r border-zinc-800 p-4">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center font-bold text-xs" style={{ color: primaryColor }}>J</div>
                  <span className="font-medium text-sm text-white">Jindal Steel</span>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-8 rounded" style={{ backgroundColor: `${primaryColor}20`, borderLeft: `2px solid ${primaryColor}` }}></div>
                  <div className="w-3/4 h-6 rounded bg-zinc-800"></div>
                  <div className="w-5/6 h-6 rounded bg-zinc-800"></div>
                </div>
              </div>
              {/* Fake Content */}
              <div className="flex-1 p-6">
                <div className="w-48 h-8 rounded bg-zinc-800 mb-6"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 rounded-lg bg-zinc-900 border border-zinc-800"></div>
                  <div className="h-24 rounded-lg bg-zinc-900 border border-zinc-800 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 h-1 w-full" style={{ backgroundColor: primaryColor }}></div>
                  </div>
                </div>
                <div className="mt-6">
                  <button className="px-4 py-2 rounded text-xs font-medium text-white" style={{ backgroundColor: primaryColor }}>
                    Primary Action
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
