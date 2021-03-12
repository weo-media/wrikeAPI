require('dotenv').config();
const Wrike = require('./wrike');
const async = require('async');

async function addClientIdToSubfolders(perma) {
  // get folder id from permalink
  let topFolderId = Wrike.get(`folders?permalink="${perma}"`)
    .then(res =>
      res[0].id)
    .catch((e) => console.error(e));

  let descendants = Wrike.get(`folders/${await topFolderId}/folders?descendants=false`).then(data => data.map(x => x.id)).then(ids => ids.join(',')).catch(e => { if (e) throw e });

  // get only ids of proj/folders that have cid and SEO in title and are immediate descendants of an seo team pod folder 
  let cleanDescendants = Wrike.get(`folders/${await descendants}`)
    .then(fldr => fldr).then(data => data.filter(x => x.title.match(/(^c)(\d+)(.?)+(SEO)/))).then(cleans => cleans.map(clean => new Object({ 'clientId': clean.title.match(/(^c)(\d+)(.?)+(SEO)/)[2], 'folderId': clean.id })))
    .catch(e => { if (e) throw e });

  // set cid to proj/folder
  async.each(await cleanDescendants, async (fldr) => {
    Wrike.put(`folders/${fldr.folderId}?customFields=[{id:'IEABXXTSJUABQ3AZ',value:'${fldr.clientId}'}]`)
      .then(console.log(`posted ${fldr.clientId}`))
  }, (err) => { if (err) throw err });

  // Wrike.get(`customfields`).then(res => console.log(res));
  // console.log(await cleanDescendants);
}
let seoTeam = {
  // teamOsprey: addClientIdToSubfolders('https://www.wrike.com/open.htm?id=388816421'),

  // teamRaven: addClientIdToSubfolders('https://www.wrike.com/open.htm?id=539262587'),

  // teamPotoo: addClientIdToSubfolders('https://www.wrike.com/open.htm?id=207580056'),

  // teamPhoenix: addClientIdToSubfolders('https://www.wrike.com/open.htm?id=392481659'),

  // teamSparrow: addClientIdToSubfolders('https://www.wrike.com/open.htm?id=348351238'),

  teamTorin: addClientIdToSubfolders('https://www.wrike.com/open.htm?id=536313884'),

};

// loop through seo team and set all cids as custom field
const SetAllCidForSeo = () => async.eachSeries(Object.values(seoTeam), async (x) => x, (e) => { if (e) throw e });

SetAllCidForSeo();