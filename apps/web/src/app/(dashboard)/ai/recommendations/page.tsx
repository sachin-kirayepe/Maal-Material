"use client";

import React, { useEffect } from "react";
import { useRecommendationStore } from "../../../../stores/recommendationStore";

export default function Recommendations() {
  const { recommendations, fetchRecommendations, actionRecommendation, isLoading } = useRecommendationStore();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Intelligent Recommendations</h1>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
        {isLoading ? (
          <p>Loading recommendations...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.length > 0 ? (
              recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-5 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      {rec.domain}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-bold rounded ${rec.priority === "CRITICAL" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}
                    >
                      {rec.priority}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{rec.action}</h3>
                  <p className="text-gray-600 text-sm mb-4">{rec.description}</p>

                  <div className="flex gap-2">
                    {rec.status === "PENDING" ? (
                      <>
                        <button
                          onClick={() => actionRecommendation(rec.id, "ACCEPTED")}
                          className="px-3 py-1.5 bg-green-600 text-white text-sm font-semibold rounded hover:bg-green-700"
                        >
                          Accept & Execute
                        </button>
                        <button
                          onClick={() => actionRecommendation(rec.id, "REJECTED")}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded hover:bg-gray-200 border border-gray-300"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-sm font-semibold text-gray-500">
                        Status: {rec.status}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No active recommendations.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
