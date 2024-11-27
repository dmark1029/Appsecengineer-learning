import jwt_encode from 'jwt-encode'

addEventListener('fetch', (event, env) => {
  event.respondWith(handleRequest(event.request))
})

export default {
  async fetch(event, env) {
    return await handleRequest(event, env)
  }
}

async function handleRequest(request, env) {
  const requestHeaders = Object.fromEntries(request.headers)
  const dataInfo = requestHeaders
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, PUT, GET, OPTIONS, HEAD',
    'Access-Control-Max-Age': '86400',
    'content-type': 'application/json',
    'Access-Control-Allow-Credentials': false
  }
  const token_simple = jwt_encode(
    {
      email: dataInfo.dataemail || '',
      name: dataInfo.datafirstname || ''
    },
    `${env.JWT_SECRET}`
  )

  const c_url = `https://community.appsecengineer.com/auth/sso?jwt=${token_simple}`
  const respHeaders = {
    ...corsHeaders,
    'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers')
  }
  return new Response(c_url, {
    headers: respHeaders
  })
}
