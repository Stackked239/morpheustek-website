/**
 * Full-screen HUD overlay that only shows when the Sensor-view (LiDAR) theme is
 * active. Renders a point-cloud grid, a sweeping scan line, a cyan vignette,
 * corner brackets, and a labeled readout — so toggling sensor view is
 * unmistakable on any page. Always in the DOM; visibility is CSS-driven by the
 * `.sensor-view` class on <html>. Pointer-events: none, so it never blocks UI.
 */
export function SensorOverlay() {
  return (
    <div className="sensor-overlay" aria-hidden="true">
      <div className="sensor-grid" />
      <div className="sensor-scan" />
      <div className="sensor-vignette" />
      <span className="sensor-bracket sensor-bracket--tl" />
      <span className="sensor-bracket sensor-bracket--tr" />
      <span className="sensor-bracket sensor-bracket--bl" />
      <span className="sensor-bracket sensor-bracket--br" />
      <span className="sensor-hud">
        <span className="sensor-hud-dot" /> Sensor view · LiDAR
      </span>
    </div>
  );
}
