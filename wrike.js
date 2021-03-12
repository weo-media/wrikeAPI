require('dotenv').config();
const { writeFile } = require('fs');
const fetch = require('node-fetch');

let Wrike = class {
  constructor() {
    this.allClientsId = 'IEABXXTSI4L3Q7RE';
    this.get = async (location) => {
      if (location.match(/\?/) === null) { location += '?' }
      let returnData;
      const options = {
        hostname: 'https://www.wrike.com',
        port: 443,
        path: `/api/v4/${location}&access_token=${process.env.WRIKE_TOKEN}`,
        method: 'GET'
      };
      // console.log(options.hostname + options.path);
      await fetch(options.hostname + options.path, { method: options.method })
        .then(res => res.json())
        .then(json => returnData = json.data)
        .catch(err => console.error(err));

      return returnData;
    };
    this.put = async (location) => {
      if (location.match(/\?/) === undefined) { location += '?' }
      return await fetch(`https://www.wrike.com/api/v4/${location}&access_token=${process.env.WRIKE_TOKEN}`, { method: "PUT" })
        .then((r) => r.json())
        .then((r) => r.data)
        .then((r) => r[0])
        .catch(err => console.error(err));
    };
    this.writeJsonToFile = (filename, data) =>
      writeFile(`./wrikeResults/${filename.toString()}.json`, data, (err) => { if (err) { throw err } });
    this.getIdByPermalink = async (permalink) => {
      return await this.get(`folders?permalink=${permalink}`).then((r) => {
        if (r) { return r[0].id }
        return r.id
      }).catch((e) => {
        if (e) throw e;
      });
    };
    this.teamOsprey = async (cid) => {
      try {
        return await this.get(`folders/${await this.getIdByPermalink('https://www.wrike.com/open.htm?id=388816421')}/folders?descendants=false&customField={id:IEABXXTSJUABQ3AZ}&fields=[customFields]`);
      } catch (e) {
        if (e) throw e;
      }
    };
    this.teamRaven = async (cid) => {
      try {
        return await this.get(`folders/${await this.getIdByPermalink('https://www.wrike.com/open.htm?id=539262587')}/folders?descendants=false&customField={id:IEABXXTSJUABQ3AZ}&fields=[customFields]`);
      } catch (e) {
        if (e) throw e;
      }
    };
    this.teamPotoo = async (cid) => {
      try {
        return await this.get(`folders/${await this.getIdByPermalink('https://www.wrike.com/open.htm?id=207580056')}/folders?descendants=false&customField={id:IEABXXTSJUABQ3AZ}&fields=[customFields]`);
      } catch (e) {
        if (e) throw e;
      }
    };
    this.teamPhoenix = async (cid) => {
      try {
        return await this.get(`folders/${await this.getIdByPermalink('https://www.wrike.com/open.htm?id=392481659')}/folders?descendants=false&customField={id:IEABXXTSJUABQ3AZ}&fields=[customFields]`);
      } catch (e) {
        if (e) throw e;
      }
    };
    this.teamSparrow = async (cid) => {
      try {
        return await this.get(`folders/${await this.getIdByPermalink('https://www.wrike.com/open.htm?id=348351238')}/folders?descendants=false&customField={id:IEABXXTSJUABQ3AZ}&fields=[customFields]`);
      } catch (e) {
        if (e) throw e;
      }
    };
    this.getCcPermaIds = async () => {
      try {
        return await this.get(`folders/IEABXXTSI4L3Q7RE/folders`)
          .then(r => r)
          .then(r => r.filter(x => x.title.match(/^(c?(\d+))(\s(\s?)+)(cc)$/i)))
          .then(r => r.map(x => ({
            title: x.title,
            cid: x.title.replace(/^(c?)(\d+)(.*)/i, "$2"),
            id: x.id,
          })));
      } catch (e) {
        if (e) throw e;
      }
    };

  }
}

module.exports = new Wrike;