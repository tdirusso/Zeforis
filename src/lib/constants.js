const statuses = [
  { name: 'New', color: '#273bce' },
  { name: 'In Progress', color: '#ffa500' },
  { name: 'Review', color: ' #00d0d0' },
  { name: 'Complete', color: '#27ce88' },
  { name: 'On Hold', color: '#a52a2a' },
  { name: 'Blocked', color: '#ff0000' },
];

const appLimits = {
  invites: 20,
  freePlanTasks: 200,
  freePlanEngagements: 2
};

const isMobile = Boolean(
  navigator.userAgent.match(/Android/i)
  || navigator.userAgent.match(/webOS/i)
  || navigator.userAgent.match(/iPhone/i)
  || navigator.userAgent.match(/iPad/i)
  || navigator.userAgent.match(/iPod/i)
  || navigator.userAgent.match(/BlackBerry/i)
  || navigator.userAgent.match(/Windows Phone/i)
);

export {
  statuses,
  isMobile,
  appLimits
};