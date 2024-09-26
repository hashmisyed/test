import * as sdk from "./sdk/index.ts";

async function refreshToken(): Promise<{
  b64: string;
  expires: number;
} | null> {
  const options = {
    body: {
      LoginName: process.env.HC_LoginName,
      Password: process.env.HC_Password,
      ApplicationName: process.env.HC_ApplicationName,
    },
    baseUrl: process.env.HC_baseUrl,
    url: "/auth-tokens",
  };
  const _token = await sdk.client.post(options);
  if ("error" in _token && _token.error) {
    console.log("error: ", _token.error);
    return null;
  } else if ("data" in _token && _token.data) {
    if (
      _token.data["AuthToken"] &&
      _token.data["IssuedOn"] &&
      _token.data["ExpiresIn"]
    ) {
      return {
        b64: btoa(_token.data["AuthToken"]),
        expires: new Date().valueOf() + _token.data["ExpiresIn"] * 3600000,
      };
    } else {
      return null;
    }
  }
}
let token = await refreshToken();

token === null && process.exit(0);

console.log(token);

sdk.client.setConfig({
  baseUrl: process.env.HC_baseUrl,
});

sdk.client.interceptors.request.use(async (request, options) => {
  if (token.expires < new Date().valueOf() - 10000) {
    token = await refreshToken();
  }
  request.headers.set("Authorization", `Token ${token.b64}`);
  console.log("request: ", request);
  return request;
});

sdk.client.interceptors.response.use(async (response: any) => {
  if (response.status === 200) {
    //  console.log(`request to ${response.url} was successful`);
  }
  return response;
});

export async function App() {
  //   try {
  //   console.log("starting deleting");
  //   const { data, error } = await sdk.exgMailboxDeleteExgMailbox({
  //     path: {
  //       exgMailboxId: 55947,
  //     },
  //   });
  //   if (error) {
  //     console.log("error: ", error);
  //   }
  //   if (data) {
  //     console.log("data: ", data);
  //   }
  // } catch (err) {
  //   console.log("error: ", err);
  // }

  try {
    console.log("starting");
    const { data, error } = await sdk.exgMailboxAddExgMailbox({
      body: {
        CreateNewUser: true,
        MailboxType: "usermailbox",
        DisplayName: "hc7@contoso-hc.ca",
        Password: "P@ssw0rd",
        MaildomainName: "contoso-hc.ca",
        CResourceId: 9,
        OrganizationId: 564,
      },
    });
    if (error) {
      console.log("error: ", error);
    }
    if (data) {
      console.log("data: ", data);
    }
  } catch (err) {
    console.log("error: ", err);
  }
}

App();
