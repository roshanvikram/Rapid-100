/**
 * liveMap.js
 * 
 * Generates distinct incident clusters for the Supervisor Heatmap.
 * Simulates a city-wide view of emergency events.
 */

const generateHeatmapData = () => {
    // Center point (Simulated City Center)
    const centerLat = 40.7128;
    const centerLng = -74.0060;

    const incidents = [
        { id: 'inc-001', type: 'FIRE', severity: 4, lat: centerLat + 0.01, lng: centerLng - 0.02, status: 'Active' },
        { id: 'inc-002', type: 'MEDICAL', severity: 5, lat: centerLat - 0.005, lng: centerLng + 0.01, status: 'Critical' },
        { id: 'inc-003', type: 'POLICE', severity: 3, lat: centerLat + 0.02, lng: centerLng + 0.005, status: 'Investigating' },
        { id: 'inc-004', type: 'ACCIDENT', severity: 2, lat: centerLat - 0.015, lng: centerLng - 0.01, status: 'Resolved' },
        { id: 'inc-005', type: 'FIRE', severity: 5, lat: centerLat + 0.012, lng: centerLng - 0.018, status: 'Spreading' }, // Cluster with 001
    ];

    return {
        timestamp: Date.now(),
        region: "Metro Area South",
        incidents
    };
};

module.exports = { generateHeatmapData };
