require('dotenv').config();
const Wrike = require('./wrike');
const async = require('async');
const fs = require("fs");
const { stdout } = require('process');
const Tabletop = require('tabletop');

const sheet = 'https://docs.google.com/spreadsheets/d/1rp3HnxhM4_t0VM0QjAvQoggWVt5GtTxr-QC1gp-Khw0/edit?usp=sharing';
const allClientsId = 'IEABXXTSI4L3Q7RE';
const isTopLevelId = 'IEABXXTSJUABCVPP';
let fileName;

const tTop = Tabletop.init({
  key: sheet,
  simpleSheet: true
})
  .then(data => {
    return data;
  })
  .catch(e => { if (e) throw e });

const doIt = async () => {
  tTopData = await tTop;
  let projs = [];
  const ccIds = await Wrike.getCcPermaIds();
  try {
    await Wrike.teamOsprey()
      .then(r => projs = [...projs, ...r]);
    await Wrike.teamRaven()
      .then(r => projs = [...projs, ...r]);
    await Wrike.teamPotoo()
      .then(r => projs = [...projs, ...r]);
    await Wrike.teamPhoenix()
      .then(r => projs = [...projs, ...r]);
    await Wrike.teamSparrow()
      .then(r => projs = [...projs, ...r]);
    console.log(projs.map(x => ({
      cid: 'c' + x.customFields.find(y => y.id === 'IEABXXTSJUABQ3AZ').value,
      id: x.id
    })));
  } catch (e) {
    if (e) throw e;
  }

  // loop find matches with seo projs and tTop clients
  for (const idx in projs) {
    const p = projs[idx];
    // console.log();
    const cid = p.customFields.find(y => y.id === 'IEABXXTSJUABQ3AZ').value;
    const findCidInTtop = tTopData.find(x => x.ID === 'c' + cid);
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
    if (findCidInTtop) {
      const updtObj = new Object({
        cid: cid,
        id: p.id,
        newDescription: `Wrike CC Link: wrike+into${await ccPermaId()}@wrike.com\n\n ${p.description}\n<b>Services (as of 8/26/20):</b>\n${findCidInTtop.Deal_Info}`,
      });
      console.log('writing for', updtObj.cid, updtObj.id);
      try {
        Wrike.put(`folders/${updtObj.id}?description=${encodeURIComponent(updtObj.newDescription + '\n---\n')}`).then(r => r).then(r => console.log(r.title));
      } catch (e) {
        if (e) { console.error(`couldnt put desc for ${updtObj.cid}, ${updtObj.id}`); throw error };
      }
    };
  }

}

module.exports = { default: doIt }