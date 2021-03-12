require('dotenv').config();
const Wrike = require('./wrike');
const async = require('async');

async function init() {
  // get top folder from perma
  const ccIds = await Wrike.getCcPermaIds();
  console.log(ccIds);
  const id = Wrike.getIdByPermalink('https://www.wrike.com/open.htm?id=536313884');
  const TorinTeam = Wrike.get(`folders/${await id}`);
  const TorinTeamProjIds = await TorinTeam.then(res => res[0].childIds);
  for (const idx in TorinTeamProjIds) {
    const p = await Wrike.get(`folders/${TorinTeamProjIds[idx]}`).then(res => res[0]);
    // get custom field cid
    console.log(await p.customFields[0].value);
    const cid = p.customFields[0].value ? p.customFields[0].value : null;

    // get cc folder
    const ccPermaId = async () => {
      try {
        if (ccIds.find(x => x.cid === cid)) {
          return await Wrike.get(`folders/${(ccIds.find(x => x.cid === cid)).id}`)
            .then(r => r[0].permalink.replace('https://www.wrike.com/open.htm?id=', ''));
        } else {
          console.log(`cid ${cid} had no match`);
        }
      } catch (e) {
        if (e) throw e;
      }
    };


    // add to wrike description
    const updtObj = new Object({
      cid: cid,
      id: p.id,
      newDescription: `<p><b>Wrike CC Link:</b> wrike+into${await ccPermaId()}@wrike.com</p>${p.description}`,
    });
    console.log('writing for', updtObj.cid, updtObj.id);
    try {
      Wrike.put(`folders/${updtObj.id}?description=${encodeURIComponent(updtObj.newDescription)}`).then(r => r).then(r => console.log(r.title));
    } catch (e) {
      if (e) { console.error(`couldnt put desc for ${updtObj.cid}, ${updtObj.id}`); throw error };
    }
  }
}

init();