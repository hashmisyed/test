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
  let currentToken = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  const bracketStack = [];
  const len = input.length;
  for (let i = 0; i < len; i++) {
      const char = input[i];
      if (char === "'" && !inDoubleQuote && bracketStack.length === 0) {
          if (inSingleQuote) {
              currentToken += char;
              tokens.push(currentToken);
              currentToken = '';
              inSingleQuote = false;
          } else {
              if (currentToken) {
                  tokens.push(currentToken);
                  currentToken = '';
              }
              inSingleQuote = true;
              currentToken += char;
          }
      } 
      else if (char === '"' && !inSingleQuote && bracketStack.length === 0) {
          if (inDoubleQuote) {
              currentToken += char;
              tokens.push(currentToken);
              currentToken = '';
              inDoubleQuote = false;
          } else {
              if (currentToken) {
                  tokens.push(currentToken);
                  currentToken = '';
              }
              inDoubleQuote = true;
              currentToken += char;
          }
      }
      else if (char === '(' || char === '[' || char === '{') {
        if (!inSingleQuote && !inDoubleQuote) {
          if (bracketStack.length === 0 && currentToken) {
            tokens.push(currentToken);
            currentToken = '';
          }
          bracketStack.push(char);
        }        
        currentToken += char;
      }
      else if (char === ')') {
        if (bracketStack[bracketStack.length - 1] === '(') {
          currentToken += char;
          bracketStack.pop();
          if (bracketStack.length === 0) {
              tokens.push(currentToken);
              currentToken = '';
          }
        } else { //misformed bracket ignore and add
          currentToken += char;
        }
      }
      else if (char === '}') {
        if (bracketStack[bracketStack.length - 1] === '{') {
          currentToken += char;
          bracketStack.pop();
          if (bracketStack.length === 0) {
              tokens.push(currentToken);
              currentToken = '';
          }
        } else { //misformed bracket ignore and add
          currentToken += char;
        }
      }
      else if (char === ']') {
        if (bracketStack[bracketStack.length - 1] === '[') {
          currentToken += char;
          bracketStack.pop();
          if (bracketStack.length === 0) {
              tokens.push(currentToken);
              currentToken = '';
          }
        } else { //misformed bracket ignore and add
          currentToken += char;
        }
      }
      else if (char === ' ' && !inSingleQuote && !inDoubleQuote && bracketStack.length === 0) {
          if (currentToken) {
              tokens.push(currentToken);
              currentToken = '';
          }
      }
      else {
          currentToken += char;
      }
  }
  (currentToken) && tokens.push(currentToken);
  return tokens;
}

// Example usage:
const input = `_log "test first" {"ALLUSERSPROFILE":"C:\\ProgramData","APPDATA":"C:\\Users\\admin\\AppData\\Roaming","CHROME_CRASHPAD_PIPE_NAME":"\\\\.\\pipe\\crashpad_5944_DIRDZMKGFARHKGLV","COLOR":"1","COLORTERM":"truecolor","CommonProgramFiles":"C:\\Program Files\\Common Files","CommonProgramFiles(x86)":"C:\\Program Files (x86)\\Common Files","CommonProgramW6432":"C:\\Program Files\\Common Files","COMPUTERNAME":"LAPTOP-I825F7P8","ComSpec":"C:\\WINDOWS\\system32\\cmd.exe","DriverData":"C:\\Windows\\System32\\Drivers\\DriverData","EDITOR":"C:\\WINDOWS\\notepad.exe","EFC_9432":"1","EngineDB":"{\"host\":\"127.0.0.1\",\"user\":\"root\",\"password\":\"P@ssw0rd\",\"connectTimeout\":60000,\"multipleStatements\":true}","FPS_BROWSER_APP_PROFILE_STRING":"Internet Explorer","FPS_BROWSER_USER_PROFILE_STRING":"Default","GIT_ASKPASS":"c:\\Users\\admin\\AppData\\Local\\Programs\\Microsoft VS Code\\resources\\app\\extensions\\git\\dist\\askpass.sh","HC_ApplicationName":"gusto","HC_baseUrl":"http://hostingcontrollerdemo.com:8798/","HC_LoginName":"api-demo","HC_Password":"0@b@5-)ywNE","HOME":"C:\\Users\\admin","HOMEDRIVE":"C:","HOMEPATH":"\\Users\\admin","INIT_CWD":"D:\\Code\\test","iss":"uids.io","keysPath":"../process/keys/","kid":"uids.io","LANG":"en_US.UTF-8","LOCALAPPDATA":"C:\\Users\\admin\\AppData\\Local","LOGONSERVER":"\\\\LAPTOP-I825F7P8","NODE":"C:\\Program Files\\nodejs\\node.exe","NODE_EXE":"C:\\Program Files\\nodejs\\\\node.exe","npm_command":"exec","npm_config_cache":"C:\\Users\\admin\\AppData\\Local\\npm-cache","npm_config_engine_strict":"true","npm_config_globalconfig":"C:\\Users\\admin\\AppData\\Roaming\\npm\\etc\\npmrc","npm_config_global_prefix":"C:\\Users\\admin\\AppData\\Roaming\\npm","npm_config_init_module":"C:\\Users\\admin\\.npm-init.js","npm_config_local_prefix":"D:\\Code\\test","npm_config_node_gyp":"C:\\Users\\admin\\AppData\\Roaming\\npm\\node_modules\\npm\\node_modules\\node-gyp\\bin\\node-gyp.js","npm_config_noproxy":"","npm_config_npm_version":"10.9.0","npm_config_prefix":"C:\\Users\\admin\\AppData\\Roaming\\npm","npm_config_save_exact":"true","npm_config_userconfig":"C:\\Users\\admin\\.npmrc","npm_config_user_agent":"npm/10.9.0 node/v22.5.1 win32 x64 workspaces/false","npm_execpath":"C:\\Users\\admin\\AppData\\Roaming\\npm\\node_modules\\npm\\bin\\npm-cli.js","npm_lifecycle_event":"npx","npm_lifecycle_script":"tsx","npm_node_execpath":"C:\\Program Files\\nodejs\\node.exe","npm_package_json":"D:\\Code\\test\\package.json","npm_package_name":"@hc/orchestrator","npm_package_version":"0.0.11","NPM_PREFIX_JS":"C:\\Program Files\\nodejs\\\\node_modules\\npm\\bin\\npm-prefix.js","NPM_PREFIX_NPX_CLI_JS":"C:\\Users\\admin\\AppData\\Roaming\\npm\\node_modules\\npm\\bin\\npx-cli.js","NPX_CLI_JS":"C:\\Users\\admin\\AppData\\Roaming\\npm\\node_modules\\npm\\bin\\npx-cli.js","NUMBER_OF_PROCESSORS":"8","OneDrive":"C:\\Users\\admin\\OneDrive","OneDriveConsumer":"C:\\Users\\admin\\OneDrive","ORIGINAL_XDG_CURRENT_DESKTOP":"undefined","OS":"Windows_NT","PATH":"D:\\Code\\test\\node_modules\\.bin;D:\\Code\\test\\node_modules\\.bin;D:\\Code\\node_modules\\.bin;D:\\node_modules\\.bin;C:\\Users\\admin\\AppData\\Roaming\\npm\\node_modules\\npm\\node_modules\\@npmcli\\run-script\\lib\\node-gyp-bin;D:\\Code\\test/node_modules/.bin;D:\\Code\\test\\node_modules\\.bin;D:\\Code\\node_modules\\.bin;D:\\node_modules\\.bin;C:\\Users\\admin\\AppData\\Roaming\\npm\\node_modules\\npm\\node_modules\\@npmcli\\run-script\\lib\\node-gyp-bin;C:\\WINDOWS\\system32;C:\\WINDOWS;C:\\WINDOWS\\System32\\Wbem;C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\;C:\\WINDOWS\\System32\\OpenSSH\\;C:\\Program Files\\Microsoft SQL Server\\150\\Tools\\Binn\\;C:\\Program Files\\nodejs\\;C:\\Program Files\\TortoiseSVN\\bin;D:\\msys64\\mingw64\\bin;C:\\Program Files\\PuTTY\\;C:\\Program Files\\Git\\cmd;C:\\Users\\admin\\AppData\\Local\\Microsoft\\WindowsApps;C:\\Users\\admin\\AppData\\Roaming\\npm;C:\\Users\\admin\\AppData\\Local\\Programs\\Microsoft VS Code\\bin;C:\\Program Files\\MySQL\\MySQL Server 8.4\\bin;","PATHEXT":".COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC;.CPL","pemPrivateKey":"-----BEGIN RSA PRIVATE KEY-----\nMIIEogIBAAKCAQEAwqrYJotWrsqCvo74kBlJhZpprRYj7iqdtsda6sNwsHKFXXVb\nGIoOHKht0v/YQfgY3XSwlrhmJF4mZ9Xv+ZDJa8ycVaRlaDlDNw2O6hc4TRPUR9WJ\nQ5j8imF3uvwWHTDNXPK4CRsbveLVR8u4cxmZxvFDA96hwGxswcIr2YXSS5gN2z6u\nxS3THzuISSAt1hprEmYzqvQ8PMH98mh8OFUbFIcE0IZq5Bcy0/QHiBfku3wVyGDG\nkGCKwtSPlWRxFjXWWtUvw5VU67qNgKcQXwBkL3/GVOk9DXZtvzgu7LvBl4z82kcX\nc0a46fb1eXDnNBcjmYeeUi2qqE8xMgLkS5c0nQIDAQABAoIBAA9k0DP4F9I5rG4i\nQzCt9zzr8Yhg9FVspE0kZaGj8+DYJYi28420uRn2Db0+Qx0wX9L/W8mHanhcw5+5\ncMEk/HCcXQ5+shA0Wwba+R602FxsAYDut2yTiADvZTbxoVQMnGjJvtjlfmOdMO19\nBCiB8UGkqX6AV/0t9cm6r5oDdZZJnBw0yQoelFkcNjuG8HT297wjP/wQU2lkYT1C\nDQ7saL63znrvtTduREjTZwsdNAJ+B2Bo1bBPr9+tbrWn9M9FY8u0BOle0JjZUGkO\nPZMZt7DNCKxCS5TjZuPCyua4zBtq3j9KP56CjqstOFulW+utgV8kLzpImdzJMwAL\nO7vceUECgYEA4L8UbcMjiuBKRvMPLvHN9zZxHtkQo8/ZKuhOSyBnS5wKpQCcpPxg\nKbosE0E/c4DlqWg4G5m/MiQaILYn2AU3FWNgfgCHYa0yeYO5ZNO8XWp5i72ZQJSU\nEp6a44JgzybiGeHKGCHP+mCaGPKzfkh8RLblXYmvxbUL85qmdoV7qz0CgYEA3bz1\nHYVbMjSXPKgIQNEck7cO++iFsWKFjfnDI3xhHpLcfbXF2ph7plOqReeL5UC1/pgE\nNT48w8TSqvvapTTyQMbbuxp53AtWAFvvo7jxizO8lEgUyrIWNYc6S4N2vcW0qLlI\n9kpd3TNX5TO9/9ONYgCdcX19qjK1xzMGMU6nxOECgYA1M8aIPTt6sqGirgMYH9Gc\nBd09ajEQNjG4gImYKzGIqoWyjbSHMd8pwZKRdE6q7wZu1ecCUaD7I6Szvass7f8e\nJwo+ia2Cp9ddAJuwjJb4ni3rsJRIv2NWDQmpdcGpCBFaAyMuF0L+iEOySDHJYStZ\nsNoXDHL5oGQV5LQnNm4SGQKBgALzSK+j3prEaF6+PZ3fKmosvV5MsbqyfORutlH6\njbBCc/yYNpG6Baso4dMcSZg7TDCfBS9QLK7OJ59uynH4SmDiRHow1/49iF9o2b9r\n7orTnWa7rssjo3gC3Ju0nBfaUZUNIhNk2erfjAPYtGZ7Ah6Ts4SXDtz8375Ox35Q\ndZsBAoGAMDwytsBy6JflicXDX8sM/PedTwUbopJzScYgqZJKZERijm17ItgGsJqb\nr/udd0iyzhbisO43BMqJTcYnuOFCh1e4XUF9gDSTntOeLVYGE6A0MEOu9Gk/L9Ri\ngLFWmBIGFEPIbpoGApBJjDjPoj08QZWLE/vfUALDpac4ku80nss=\n-----END RSA PRIVATE KEY-----","pemPublicKey":"-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEAwqrYJotWrsqCvo74kBlJhZpprRYj7iqdtsda6sNwsHKFXXVbGIoO\nHKht0v/YQfgY3XSwlrhmJF4mZ9Xv+ZDJa8ycVaRlaDlDNw2O6hc4TRPUR9WJQ5j8\nimF3uvwWHTDNXPK4CRsbveLVR8u4cxmZxvFDA96hwGxswcIr2Yass7f8e\nJwo+ia2Cp9ddAJuwjJb4ni3rsJRIv2NWDQmpdcGpCBFaAyMuF0L+iEOySDHJYStZ\nsNoXDHL5oGQV5LQnNm4SGQKBgALzSK+j3prEaF6+PZ3fKmosvV5MsbqyfORutlH6\njbBCc/yYNpG6Baso4dMcSZg7TDCfBS9QLK7OJ59uynH4SmDiRHow1/49iF9o2b9r\n7orTnWa7rssjo3gC3Ju0nBfaUZUNIhNk2erfjAPYtGZ7Ah6Ts4SXDtz8375Ox35Q\ndZsBAoGAMDwytsBy6JflicXDX8sM/PedTwUbopJzScYgqZJKZERijm17ItgGsJqb\nr/udd0iyzhbisO43BMqJTcYnuOFCh1e4XUF9gDSTntOeLVYGE6A0MEOu9Gk/L9Ri\ngLFWmBIGFEPIbpoGApBJjDjPoj08QZWLE/vfUALDpac4ku80nss=\n-----END RSA PRIVATE KEY-----","pemPublicKey":"-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEAwqrYJotWrsqCvo74kBlJhZpprRYj7iqdtsda6sNwsHKFXXVbGIoO\nHKht0v/YQfgY3XSwlrhmJF4mZ9Xv+ZDJa8ycVaRlaDlDNw2O6hc4TRPUR9WJQ5j8\nimF3uvwWHTDNXPK4CRsbveLVR8u4cxmZxvFDA96hwGxswcIr2YCc/yYNpG6Baso4dMcSZg7TDCfBS9QLK7OJ59uynH4SmDiRHow1/49iF9o2b9r\n7orTnWa7rssjo3gC3Ju0nBfaUZUNIhNk2erfjAPYtGZ7Ah6Ts4SXDtz8375Ox35Q\ndZsBAoGAMDwytsBy6JflicXDX8sM/PedTwUbopJzScYgqZJKZERijm17ItgGsJqb\nr/udd0iyzhbisO43BMqJTcYnuOFCh1e4XUF9gDSTntOeLVYGE6A0MEOu9Gk/L9Ri\ngLFWmBIGFEPIbpoGApBJjDjPoj08QZWLE/vfUALDpac4ku80nss=\n-----END RSA PRIVATE KEY-----","pemPublicKey":"-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEAwqrYJotWrsqCvo74kBlJhZpprRYj7iqdtsda6sNwsHKFXXVbGIoO\nHKht0v/YQfgY3XSwlrhmJF4mZ9Xv+ZDJa8ycVaRlaDlDNw2O6hc4TRPUR9WJQ5j8\nimF3uvwWHTDNXPK4CRsbveLVR8u4cxmZxvFDA96hwGxswcIr2Yy6JflicXDX8sM/PedTwUbopJzScYgqZJKZERijm17ItgGsJqb\nr/udd0iyzhbisO43BMqJTcYnuOFCh1e4XUF9gDSTntOeLVYGE6A0MEOu9Gk/L9Ri\ngLFWmBIGFEPIbpoGApBJjDjPoj08QZWLE/vfUALDpac4ku80nss=\n-----END RSA PRIVATE KEY-----","pemPublicKey":"-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEAwqrYJotWrsqCvo74kBlJhZpprRYj7iqdtsda6sNwsHKFXXVbGIoO\nHKht0v/YQfgY3XSwlrhmJF4mZ9Xv+ZDJa8ycVaRlaDlDNw2O6hc4TRPUR9WJQ5j8\nimF3uvwWHTDNXPK4CRsbveLVR8u4cxmZxvFDA96hwGxswcIr2YXSS5gN2z6uxS3T\nHzuISSAt1hprEmYzqvQ8PMH98mh8OFUbFIcE0IZq5Bcy0/QHiBfku3wVyGDGkGCK\nwtSPlWRxFjXWWtUvw5VU67qNgKcQXwBkL3/GVOk9DXZtvzgu7LvBl4z82kcXc0a4\n6fb1eXDnNBcjmYeeUi2qqE8xMgLkS5c0nQIDAQAB\n-----END RSA PUBLIC KEY-----","PORT":"3000","PROCESSOR_ARCHITECTURE":"AMD64","PROCESSOR_IDENTIFIER8QZWLE/vfUALDpac4ku80nss=\n-----END RSA PRIVATE KEY-----","pemPublicKey":"-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEAwqrYJotWrsqCvo74kBlJhZpprRYj7iqdtsda6sNwsHKFXXVbGIoO\nHKht0v/YQfgY3XSwlrhmJF4mZ9Xv+ZDJa8ycVaRlaDlDNw2O6hc4TRPUR9WJQ5j8\nimF3uvwWHTDNXPK4CRsbveLVR8u4cxmZxvFDA96hwGxswcIr2YXSS5gN2z6uxS3T\nHzuISSAt1hprEmYzqvQ8PMH98mh8OFUbFIcE0IZq5Bcy0/QHiBfku3wVyGDGkGCK\nwtSPlWRxFjXWWtUvw5VU67qNgKcQXwBkL3/GVOk9DXZtvzgu7LvBl4z82kcXc0a4\n6fb1eXDnNBcjmYeeUi2qqE8xMgLkS5c0nQIDAQAB\n-----END RSA PUBLIC KEY-----","PORT":"3000","PROCESSOR_ARCHITECTURE":"AMD64","PROCESSOR_IDENTIFIERYj7iqdtsda6sNwsHKFXXVbGIoO\nHKht0v/YQfgY3XSwlrhmJF4mZ9Xv+ZDJa8ycVaRlaDlDNw2O6hc4TRPUR9WJQ5j8\nimF3uvwWHTDNXPK4CRsbveLVR8u4cxmZxvFDA96hwGxswcIr2YXSS5gN2z6uxS3T\nHzuISSAt1hprEmYzqvQ8PMH98mh8OFUbFIcE0IZq5Bcy0/QHiBfku3wVyGDGkGCK\nwtSPlWRxFjXWWtUvw5VU67qNgKcQXwBkL3/GVOk9DXZtvzgu7LvBl4z82kcXc0a4\n6fb1eXDnNBcjmYeeUi2qqE8xMgLkS5c0nQIDAQAB\n-----END RSA PUBLIC KEY-----","PORT":"3000","PROCESSOR_ARCHITECTURE":"AMD64","PROCESSOR_IDENTIFIER":"Intel64 Family 6 Model 140 Stepping 1, GenuineIntel","PROCESSOR_LEVEL":"6","PROCESSOR_REVISION":"8c01","ProgramData":"C:\\ProgramData","ProgrXSS5gN2z6uxS3T\nHzuISSAt1hprEmYzqvQ8PMH98mh8OFUbFIcE0IZq5Bcy0/QHiBfku3wVyGDGkGCK\nwtSPlWRxFjXWWtUvw5VU67qNgKcQXwBkL3/GVOk9DXZtvzgu7LvBl4z82kcXc0a4\n6fb1eXDnNBcjmYeeUi2qqE8xMgLkS5c0nQIDAQAB\n-----END RSA PUBLIC KEY-----","PORT":"3000","PROCESSOR_ARCHITECTURE":"AMD64","PROCESSOR_IDENTIFIER":"Intel64 Family 6 Model 140 Stepping 1, GenuineIntel","PROCESSOR_LEVEL":"6","PROCESSOR_REVISION":"8c01","ProgramData":"C:\\ProgramData","ProgramFiles":"C:\\Program Files","ProgramFiles(x86)":"C:\\Program Files (x86)","ProgramW6432":"C:\\Program Files","PROMPT":"$P$G","PSModulePath":"C:":"Intel64 Family 6 Model 140 Stepping 1, GenuineIntel","PROCESSOR_LEVEL":"6","PROCESSOR_REVISION":"8c01","ProgramData":"C:\\ProgramData","ProgramFiles":"C:\\Program Files","ProgramFiles(x86)":"C:\\Program Files (x86)","ProgramW6432":"C:\\Program Files","PROMPT":"$P$G","PSModulePath":"C:\\Users\\admin\\Documents\\WindowsPowerShell\\Modules;C:\\Program Files\\WindowsPowerShell\\Modules;C:\\WINDOWS\\system32\\WindowsPowerShell\\v1amFiles":"C:\\Program Files","ProgramFiles(x86)":"C:\\Program Files (x86)","ProgramW6432":"C:\\Program Files","PROMPT":"$P$G","PSModulePath":"C:\\Users\\admin\\Documents\\WindowsPowerShell\\Modules;C:\\Program Files\\WindowsPowerShell\\Modules;C:\\WINDOWS\\system32\\WindowsPowerShell\\v1.0\\Modules","PUBLIC":"C:\\Users\\Public","secretKey":"Here I Go Again.","SESSIONNAME":"Console","SystemDrive":"C:","SystemRoot":"C:\\WINDOWS","\\Users\\admin\\Documents\\WindowsPowerShell\\Modules;C:\\Program Files\\WindowsPowerShell\\Modules;C:\\WINDOWS\\system32\\WindowsPowerShell\\v1.0\\Modules","PUBLIC":"C:\\Users\\Public","secretKey":"Here I Go Again.","SESSIONNAME":"Console","SystemDrive":"C:","SystemRoot":"C:\\WINDOWS",".0\\Modules","PUBLIC":"C:\\Users\\Public","secretKey":"Here I Go Again.","SESSIONNAME":"Console","SystemDrive":"C:","SystemRoot":"C:\\WINDOWS","TEMP":"C:\\Users\\admin\\AppData\\Local\\Temp","TERM_PROGRAM":"vscode","TERM_PROGRAM_VERSION":"1.95.3","TMP":"C:\\Users\\admin\\AppData\\Local\\Temp","USERDOMAIN":"LAPTOP-I825F7P8","USERDOMAIN_ROAMINGPROFILE":"LAPTOP-I825F7P8","USERNAME":"admin","USERPROFILE":"C:\\Users\\admin","VSCODE_GIT_ASKPASS_EXTRA_ARGS":"","VSCODE_GIT_ASKPASS_MAIN":"c:\\Users\\admin\\AppData\\Local\\Programs\\Microsoft VS Code\\resources\\app\\extensions\\git\\dist\\askpass-main.js","VSCODE_GIT_ASKPASS_NODE":"C:\\Users\\admin\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe","VSCODE_GIT_IPC_HANDLE":"\\\\.\\pipe\\vscode-git-e7e7381906-sock","VSCODE_INJECTION":"1","windir":"C:\\WINDOWS","ZES_ENABLE_SYSMAN":"1"} [ 'here',) 'I'{, 'go', 'ag}ain' ] true false 1732329492915`;
const tokens = tokenize(input);
console.log(tokens);

// DBInstance.InitalizeDbPool();
// DBInstance.VerifyInitialization();
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});