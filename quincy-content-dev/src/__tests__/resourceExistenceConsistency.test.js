const fs = require("fs");
const glob = require("fast-glob");
const path = require("path");
const yaml = require("js-yaml");

let hasFailure = false;

function checkFile(parentDir, srcPath, folder) {
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
  } else if (srcPath.startsWith("/")) {
    // prepare path to check
    file = `src/content/shared/${folder}${srcPath}`;
  } else {
    // prepare path to check
    file = `${parentDir}/${folder}/${srcPath}`;
  }
  //Check file existence
  if (!fs.existsSync(file)) {
    hasFailure = true;
    console.error(`File ${file} does not exist`);
  }
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

  test.each(activityFiles)("Resource existence check for %s", (file) => {
    const aFile = yaml.load(fs.readFileSync(file, "utf8"));
    const parentDir = path.dirname(file);

    hasFailure = false;

    for (let { segmentId } of aFile.taskSequence) {
      const flyer = aFile.segments[segmentId].flyer;
      if (flyer && flyer["src"]) {
        const folder = "img";
        checkFile(parentDir, flyer["src"], folder);
      }
      const startVoiceOver = aFile.segments[segmentId].startVoiceOver;
      if (startVoiceOver && startVoiceOver["src"]) {
        const folder = "voice";
        checkFile(parentDir, startVoiceOver["src"], folder);
      }
      const listenAudioCue = aFile.segments[segmentId].listenAudioCue;
      if (listenAudioCue && listenAudioCue["src"]) {
        const folder = "audio";
        checkFile(parentDir, listenAudioCue["src"], folder);
      }
      const playAudioCue = aFile.segments[segmentId].playAudioCue;
      if (playAudioCue && playAudioCue["src"]) {
        const folder = "audio";
        checkFile(parentDir, playAudioCue["src"], folder);
      }
      const backingTrack = aFile.segments[segmentId].backingTrack;
      if (backingTrack && backingTrack["src"]) {
        const folder = "audio";
        checkFile(parentDir, backingTrack["src"], folder);
      }
      const handvideo = aFile.segments[segmentId].handvideo;
      if (handvideo && handvideo["src"]) {
        const folder = "video";
        checkFile(parentDir, handvideo["src"], folder);
      }
      const expectation = aFile.segments[segmentId].expectation;
      if (expectation && expectation["src"]) {
        const folder = "expect";
        checkFile(parentDir, expectation["src"], folder);
      }
    }
    // Final check to make the test fail if a subtest has errors
    if (hasFailure) {
      throw Error(`File ${file} has errors!`);
    } else {
      console.log(`File ${file} has no errors.`);
    }
  });
});
