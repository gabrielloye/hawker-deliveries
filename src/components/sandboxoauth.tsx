const clientId = 'ec6761ae-e5b9-43f4-909c-1186304ea894';

const clientSecret = '43637b67-4a9b-452e-b28d-fa84aebdc775';

export const authCode = btoa(`${clientId}:${clientSecret}`)

export const redirectURI = `http://localhost:3000/main/15052020/checkout`;

export const authURL =
`https://www.dbs.com/sandbox/api/sg/v1/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectURI}&scope=Read&response_type=code&state=0399`;