import CryptoJS from "crypto-js";

// We generate these at build time/development time and use the hardcoded results for static export.
// Example: hash("dashboard") -> d3b07384...
// Since we are exporting a static site, we MUST know the routes beforehand to create the folders.
// For dynamic segments in static export, we would need generateStaticParams, but for top-level pages
// it's easier to just name the folders with the hashes.

export const ROUTE_MAP = {
  dashboard: "/d3b07384d113edec49eaa6238ad5ff00",
  login: "/99b0c26ebfc3b97b0a7edbcff29cdaea",
  forgotPassword: "/6f7a6f23b7a58a7428f8045bc117a206",
  settings: "/3a502f6b86d9a18016f4d38c64e5264f"
};

// Utility to generate hashes during dev if needed
export function generateRouteHash(routeName: string) {
  return CryptoJS.SHA256(routeName).toString(CryptoJS.enc.Hex).substring(0, 32); 
}
