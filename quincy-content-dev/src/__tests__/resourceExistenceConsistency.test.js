const fs = require("fs");
const glob = require("fast-glob");
const path = require("path");
const yaml = require("js-yaml");

function checkFile(parentDir, srcPath, folder) {
  console.log(`Parent dir: ${parentDir}`);
  console.log(`src: ${srcPath}`);

  let file;
  if (srcPath.startsWith("/l/")) {
    // drop prefix
    const newPath = srcPath.replace(/\/l\//, "");
    const dir = path.dirname(newPath);
    const name = path.basename(newPath);
    // prepare path to check
    file = `src/content/shared/${folder}${
      dir && dir !== "." ? `/${dir}` : ""
    }/en/${name}`;
  } else if (srcPath.startsWith("l/")) {
    // drop prefix
    const newPath = srcPath.replace(/l\//, "");
    const dir = path.dirname(newPath);
    const name = path.basename(newPath);
    // prepare path to check
    file = `${parentDir}/${folder}${
      dir && dir !== "." ? `/${dir}` : ""
    }/en/${name}`;
  } else {
    // prepare path to check
    file = `${parentDir}/${folder}/${srcPath}`;
  }
  //Final Check
  function checkIfFileExists(file) {
    console.log(`Path of file to check: ${file}`);
    try {
      if (fs.existsSync(file)) {
        console.log("File Exists");
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    console.log("File Doesn't Exists");
    return false;
  }
  // checkIfFileExists(file);
  checkIfFileExists(file);
}

describe("Test-Suite file Existence Consistency Check", () => {
  const ymlFiles = glob.sync(["**/index.yml"], { onlyFiles: true });
  const activityFiles = [];
  // Find activity files
  for (let i = 0; i < ymlFiles.length; i++) {
    const fileContentsIndex = fs.readFileSync(ymlFiles[i]);
    let [dataIndex] = yaml.safeLoad(fileContentsIndex);
    // Check type and add to activityFiles
    if (dataIndex.type === "flyer") {
      activityFiles.push(
        path.dirname(ymlFiles[i]) + "/" + dataIndex.src + ".yml"
      );
    }
  }

  test.each(activityFiles)("Resource Existence check for %s", (file) => {
    const aFile = yaml.load(fs.readFileSync(file, "utf8"));
    const parentDir = path.dirname(file);

    for (let { segmentId } of aFile.taskSequence) {
      const flyer = aFile.segments[segmentId].flyer;
      const startVoiceOver = aFile.segments[segmentId].startVoiceOver;
      const listenAudioCue = aFile.segments[segmentId].listenAudioCue;
      const playAudioCue = aFile.segments[segmentId].playAudioCue;
      const backingTrack = aFile.segments[segmentId].backingTrack;
      const handvideo = aFile.segments[segmentId].handvideo;
      const expectation = aFile.segments[segmentId].expectation;
      if (flyer && flyer["src"]) {
        const folder = "img";
        checkFile(parentDir, flyer["src"], folder);
      }
      if (startVoiceOver && startVoiceOver["src"]) {
        const folder = "voice";
        checkFile(parentDir, startVoiceOver["src"], folder);
      }
      if (
        (listenAudioCue && listenAudioCue["src"]) ||
        (playAudioCue && playAudioCue["src"]) ||
        (backingTrack && backingTrack["src"])
      ) {
        const folder = "audio";
        checkFile(parentDir, listenAudioCue["src"], folder);
      }
      if (handvideo && handvideo["src"]) {
        const folder = "video";
        checkFile(parentDir, handvideo["src"], folder);
      }
      if (expectation && expectation["src"]) {
        const folder = "expect";
        checkFile(parentDir, expectation["src"], folder);
      }
    }
    expect(fs.existsSync(file)).toBe(true);
  });
});
