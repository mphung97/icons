import { readFile, writeFile } from "node:fs/promises";
import { downloadNPMPackage, exportToDirectory, IconSet } from "@iconify/tools";

// Directories
const cacheDir = "cache";
const outDir = "svg";

// Download all icon sets
console.log("Downloading latest package");
const downloaded = await downloadNPMPackage({
  package: "@iconify/json",
  target: cacheDir,
});
console.log("Downloaded version", downloaded.version);

// Get a list of icon sets
const list = JSON.parse(
  await readFile(downloaded.contentsDir + "/collections.json", "utf8"),
);
// const prefixes = Object.keys(list);

const prefixes = ["tabler", "mdi"];
console.log("Got", prefixes.length, "icon sets");
const mdiIcons = [
  "star",
  "heart",
  "circle",
  "github",
  "google",
  "twitter",
  "facebook",
  "star-outline",
  "heart-outline",
];
// Export each icon set
for (let i = 0; i < prefixes.length; i++) {
  const prefix = prefixes[i];

  // Read file
  let data = JSON.parse(
    await readFile(
      downloaded.contentsDir + "/json/" + prefix + ".json",
      "utf8",
    ),
  );

  if (prefix === "mdi") {
    const mdiData = {
      prefix: data.prefix,
      info: data.info,
      width: data.width,
      height: data.height,
      icons: mdiIcons.reduce((previous, current) => {
        previous[current] = data.icons[current];
        return previous;
      }, {}),
    };
    data = mdiData;
  }
  // Create IconSet
  const iconSet = new IconSet(data);

  // Export it
  console.log("Exporting", iconSet.info.name);
  await exportToDirectory(iconSet, {
    target: outDir + "/" + prefix,
  });
}

console.log("Done");
