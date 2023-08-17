const statuses = [
  { name: 'New', color: '#273bce' },
  { name: 'Next Up', color: ' #8527ce' },
  { name: 'In Progress', color: '#ffa500' },
  { name: 'Currently Writing', color: '#ffc0cb' },
  { name: 'Pending Approval', color: '#ff0000' },
  { name: 'Approved', color: ' #00d0d0' },
  { name: 'Ready to Implement', color: '#a52a2a' },
  { name: 'Complete', color: '#27ce88' }
];

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
  isMobile
};