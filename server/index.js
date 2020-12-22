function getBoundsFromLatLng(lat, lon, d) {
  const minLat = lat - 0.009 * d;
  const maxLat = lat + 0.009 * d;
  const minLon = lon - 0.009 * d;
  const maxLon = lon + 0.009 * d;
  return { minLat, maxLat, minLon, maxLon };
}
console.log(getBoundsFromLatLng(28.905253, -9.577019, 50));
