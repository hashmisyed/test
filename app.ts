import express, { Request, Response, NextFunction } from 'express';
// import express from 'express';
// import { DBInstance, executePathProc } from './src/services/db.ts';
// import procs from './src/procs.ts';
const app = express()
const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
// app.use((err, req, res, next) => {
    res.status(500).send(err.message);
    next();
})

function tokenize(input) {
  const tokens = [];
  let lastindex = 0;
  const opening = new RegExp(/['"({[\s]/, 'g');
  const singleQuote = new RegExp(/'/, 'g');
  const doubleQuote = new RegExp(/"/, 'g');
  const OpenPar = new RegExp(/\(/, 'g');
  const OpenCur = new RegExp(/{/, 'g');
  const OpenSq = new RegExp(/\[/, 'g');
  const closePar = new RegExp(/\)/, 'g');
  const closeCur = new RegExp(/}/, 'g');
  const closeSq = new RegExp(/]/, 'g');
  const len = input.length;
  let match: RegExpExecArray;
  match = opening.exec(input);
  while (match) {
    tokens.push(input.slice(lastindex, match.index));
    lastindex = match.index + 1;
    if (match[0] !== ' ') {      
      match = opening.exec(input);
    }
    else {
      if (match[0] === "'") {
        singleQuote.lastIndex = lastindex;
        match = singleQuote.exec(input);
      }
      else {
        opening.lastIndex = lastindex;
      }
    }
  }
  tokens.push(input.slice(lastindex));
  return tokens;
}

const input = `_log "test first" {"ALLUSERSPROFILE":"C:\\ProgramData","APPDATA":"C:\\Users\\admin\\AppData\\Roaming","CHROME_CRASHPAD_PIPE_NAME":"\\\\.\\pipe\\crashpad_5944_DIRDZMKGFARHKGLV","COLOR":"1","COLORTERM":"truecolor","CommonProgramFiles":"C:\\Program Files\\Common Files","CommonProgramFiles(x86)":"C:\\Program Files (x86)\\Common Files","CommonProgramW6432":"C:\\Program Files\\Common Files","COMPUTERNAME":"LAPTOP-I825F7P8","ComSpec":"C:\\WINDOWS\\system32\\cmd.exe","DriverData":"C:\\Windows\\System32\\Drivers\\DriverData","EDITOR":"C:\\WINDOWS\\notepad.exe","EFC_9432":"1","EngineDB":"{\"host\":\"127.0.0.1\",\"user\":\"root\",\"password\":\"P@ssw0rd\",\"connectTimeout\":60000,\"multipleStatements\":true}","FPS_BROWSER_APP_PROFILE_STRING":"Internet Explorer","VSCODE_GIT_ASKPASS_NODE":"C:\\Users\\admin\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe","VSCODE_GIT_IPC_HANDLE":"\\\\.\\pipe\\vscode-git-e7e7381906-sock","VSCODE_INJECTION":"1","windir":"C:\\WINDOWS","ZES_ENABLE_SYSMAN":"1"} [ 'here', 'I', 'go', 'again' ] true false 1732329492915`;
const tokens = tokenize(input);
console.log(tokens);

// DBInstance.InitalizeDbPool();
// DBInstance.VerifyInitialization();
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});