import * as fs from 'fs';
import * as path from 'path';

const srcDir = path.join(__dirname, '../src');

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllFiles(srcDir);
let modifiedCount = 0;

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');


  // Simple removal of setInterval inside useEffect
  // Match: const interval = setInterval(..., ...); return () => clearInterval(interval);
  
  if (content.includes('setInterval')) {
    // We will comment them out to prevent breaking complex logic, 
    // effectively stopping the fake polling and letting our Websocket take over.
    content = content.replace(/const interval = setInterval/g, '// const interval = setInterval');
    content = content.replace(/return \(\) => clearInterval\(interval\)/g, '// return () => clearInterval(interval)');
    
    fs.writeFileSync(file, content);
    modifiedCount++;
    console.log(`Cleaned up Realtime setIntervals in: ${path.basename(file)}`);
  }
});

console.log(`\nSuccessfully cleaned up fake realtime intervals in ${modifiedCount} files!`);
