'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';

// Disable SSR for Three.js component so Vercel build server does not execute canvas code
const ThreeViewer = dynamic(() => import('./ThreeViewer'), { ssr: false });

export default function Home() {
  const [front, setFront] = useState<File | null>(null);
  const [side, setSide] = useState<File | null>(null);
  const [height, setHeight] = useState<number>(175);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const RENDER_API_URL = "https://body-scan-gateway.onrender.com/api/scan"; 

  const handleRunScan = async () => {
    if (!front || !side) return alert("Please upload both front and side photos.");
    setLoading(true);

    const formData = new FormData();
    formData.append("front", front);
    formData.append("side", side);
    formData.append("height", height.toString());

    try {
      const res = await fetch(RENDER_API_URL, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      setData(result);
    } catch (err) {
      alert("Error generating 3D scan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white p-8 max-w-3xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center">3D Body Scanner</h1>

      <div className="bg-slate-800 p-6 rounded-xl space-y-4 mb-6">
        <div>
          <label className="block mb-2 text-sm font-medium">Front Photo</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={e => setFront(e.target.files?.[0] || null)} 
            className="w-full bg-slate-700 p-2 rounded text-sm"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Side Photo</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={e => setSide(e.target.files?.[0] || null)} 
            className="w-full bg-slate-700 p-2 rounded text-sm"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Height (cm)</label>
          <input 
            type="number" 
            value={height} 
            onChange={e => setHeight(Number(e.target.value))} 
            className="w-full bg-slate-700 p-2 rounded text-sm text-white"
          />
        </div>

        <button 
          onClick={handleRunScan} 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-semibold transition"
        >
          {loading ? "Reconstructing Mesh (~10s)..." : "Generate 3D Scan"}
        </button>
      </div>

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80 bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
            <ThreeViewer />
          </div>

          <div className="bg-slate-800 p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Body Measurements</h2>
            <ul className="space-y-3">
              <li className="flex justify-between border-b border-slate-700 pb-2">
                <span>Chest</span>
                <span className="font-semibold">{data.measurements?.chest_cm} cm</span>
              </li>
              <li className="flex justify-between border-b border-slate-700 pb-2">
                <span>Waist</span>
                <span className="font-semibold">{data.measurements?.waist_cm} cm</span>
              </li>
              <li className="flex justify-between border-b border-slate-700 pb-2">
                <span>Hips</span>
                <span className="font-semibold">{data.measurements?.hips_cm} cm</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}

