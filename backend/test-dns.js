import dns from 'dns';

dns.setServers(['8.8.8.8']);

const hostname = 'cluster0.jw1lbp4.mongodb.net';

dns.resolve(hostname, (err, addresses) => {
  if (err) {
    console.error('DNS Resolution Error:', err);
    return;
  }
  console.log('Addresses:', addresses);
});
