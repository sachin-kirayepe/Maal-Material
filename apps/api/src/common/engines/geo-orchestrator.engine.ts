import { Injectable, Logger } from "@nestjs/common";

/**
 * GeoOrchestratorEngine
 *
 * Provides reusable spatial calculation and geohash utilities.
 * Acts as the application-level spatial engine, abstracting distance and bounding calculations.
 */
@Injectable()
export class GeoOrchestratorEngine {
  private readonly logger = new Logger(GeoOrchestratorEngine.name);

  /**
   * Calculates the Haversine distance between two points on Earth in kilometers.
   */
  calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Checks if a target location falls within a specified radius of a source location.
   */
  isWithinRadius(
    sourceLat: number,
    sourceLon: number,
    targetLat: number,
    targetLon: number,
    radiusKm: number,
  ): boolean {
    const distance = this.calculateDistanceKm(sourceLat, sourceLon, targetLat, targetLon);
    return distance <= radiusKm;
  }

  /**
   * Computes bounding box coordinates (minLat, maxLat, minLon, maxLon)
   * around a central point for a given radius in km.
   * Useful for initial coarse SQL filtering before exact Haversine calculation.
   */
  calculateBoundingBox(lat: number, lon: number, radiusKm: number) {
    const R = 6371; // Earth's radius in km
    const maxLat = lat + (radiusKm / R) * (180 / Math.PI);
    const minLat = lat - (radiusKm / R) * (180 / Math.PI);

    // Adjust for longitude shrinking at higher latitudes
    const maxLon = lon + ((radiusKm / R) * (180 / Math.PI)) / Math.cos(lat * (Math.PI / 180));
    const minLon = lon - ((radiusKm / R) * (180 / Math.PI)) / Math.cos(lat * (Math.PI / 180));

    return { minLat, maxLat, minLon, maxLon };
  }
}
