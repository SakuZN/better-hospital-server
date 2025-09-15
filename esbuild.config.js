const { build } = require("esbuild");
const packageJson = require("./package.json");
const aliasPlugin = require("esbuild-plugin-path-alias");
const path = require("path");

const dependencies = packageJson.dependencies || {};
const peerDependencies = packageJson?.peerDependencies || {};

const ignoreEsmList = ["pocketbase"];

const sharedConfig = {
  entryPoints: ["src/server.ts"],
  bundle: true,
  platform: "node",
  target: "node18",
  format: "cjs",
  sourcemap: true,
  external: [
    ...Object.keys(dependencies).filter((d) => !ignoreEsmList.includes(d)),
    ...Object.keys(peerDependencies),
  ],
};

build({
  ...sharedConfig,
  outfile: "dist/server.js",
  plugins: [
    aliasPlugin({
      "@": path.resolve(__dirname, "./src"),
    }),
  ],
}).catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
