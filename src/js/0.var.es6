const isProduction = true;
const urlBase = `http://${isProduction ? 'api.baristawars2016.com/public' : '192.168.2.50:8080'}`;

axios.defaults.baseURL = urlBase;
 
