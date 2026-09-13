/** Google Maps turn-by-turn directions to a coordinate. */
export const googleMapsDirectionsUrl = (latitude: number, longitude: number) =>
  `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
