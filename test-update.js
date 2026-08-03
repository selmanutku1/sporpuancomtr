const events = [{id: 1}, {id: 2}];
const updatedEvent = {id: 3};
const updatedList = events.map(ev => ev.id === updatedEvent.id ? updatedEvent : ev);
console.log(updatedList);
