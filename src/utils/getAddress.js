export default function getAddress ({ headers, connection }) {
  if (headers['x-forwarded-for']) {
    const ips = headers['x-forwarded-for'].split(', ')
    return ips[ips.length - 1]
  } else return connection.remoteAddress
}
