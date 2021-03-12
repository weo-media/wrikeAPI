require('dotenv').config();
const Wrike = require('./wrike');

let doIt = async () => {

  let topProj = await Wrike.getIdByPermalink('https://www.wrike.com/open.htm?id=565081244');
  let allTasks = await Wrike.get(`folders/${topProj}/tasks?fields=[description]`);

  let allTasksClean = allTasks.map(task => ({ title: task.title, description: task.description, permalink: task.permalink }))
  let allTasksCleanForWriters = allTasks.map(task => ({ title: task.title, description: task.description }))
  Wrike.writeJsonToFile('allTasks', JSON.stringify(allTasksClean));
  Wrike.writeJsonToFile('allTasksForWriters', JSON.stringify(allTasksCleanForWriters));

}

doIt();