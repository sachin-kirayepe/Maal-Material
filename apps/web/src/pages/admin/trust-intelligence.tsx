import React, { useEffect } from "react";
import { useTrustStore } from "../../stores/trustStore";
import { ShieldCheck as ShieldCheckIcon, Users as UsersIcon } from "lucide-react";
const ShieldCheck = ShieldCheckIcon as any;
const Users = UsersIcon as any;

export default function TrustIntelligenceDashboard() {
  const { profiles, metrics, fetchTrustProfiles, fetchTrustMetrics, isLoading } = useTrustStore();
  const tenantId = "t-001";

  useEffect(() => {
    fetchTrustProfiles(tenantId);
    fetchTrustMetrics(tenantId);
  }, [tenantId]);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <ShieldCheck className="w-8 h-8 mr-3 text-green-600" /> Trust Intelligence Center
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Network Trust & Entity Verification</p>
        </div>
      </header>

      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">
              Total Trust Profiles
            </h3>
            <p className="text-3xl font-black text-gray-900 mt-2">{metrics.totalProfiles}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">
              GST Verified Entities
            </h3>
            <p className="text-3xl font-black text-green-600 mt-2">{metrics.verifiedGst}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">
              Network Trust Score
            </h3>
            <p className="text-3xl font-black text-blue-600 mt-2">
              {metrics.networkTrustScore} / 100
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">Entity Trust Profiles</h2>
        </div>
        <div className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading trust profiles...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Entity ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Trust Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Verification
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {profile.entityId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {profile.entityType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-bold ${profile.trustScore < 400 ? "text-red-600" : "text-green-600"}`}
                      >
                        {profile.trustScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {profile.gstVerified ? (
                        <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                          GST Verified
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${profile.status === "ACTIVE" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}`}
                      >
                        {profile.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
