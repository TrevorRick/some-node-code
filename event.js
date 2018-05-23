const EventEmitter = require('events').EventEmitter;
const myEmitter = new EventEmitter();

// EventEmitter实例在添加一个listener到its internal array of listeners之前会触发'newListener' event。
// Listeners registered for the 'newListener' event will be passed the event name and a reference to the listener being added.
myEmitter.once('newListener', function (event, lisntener) {
    if (event === 'event') {
        // insert a new listener in front
      myEmitter.on('event', () => {
          console.log('B');
      });
    };
})
myEmitter.on('event', () => {
    console.log('A');
});
myEmitter.emit('event');

// console.log(myEmitter.emit('event'));
// console.log(myEmitter.emit('events'));

// console.log(EventEmitter.listenerCount(myEmitter, 'event'));
// console.log(EventEmitter.defaultMaxListeners = 100);
// console.log(EventEmitter.defaultMaxListeners);



// event.on('some_event', function () {        // register listener(callback function) to named event('some_event')
//     console.log('some_event occured.');
// });
// setTimeout(function () {
//     event.emit('some_event');       // trigger the named event('some_event')
// }, 1000);

// it is important to keep in mind that when an ordinary listener function is called, the standard this keyword is intentionally set to reference the EventEmitter instance to which the listener is attached.
// 当一个listerner被调用时， this关键字指向listener注册的EventEmitter实例. 所有触发事件的object都是一个EventEmitter实例。
// myEmitter.on('event', function(a, b) {
//     console.log(a, b, this, this === myEmitter);
//     // Prints:
//     //   a b MyEmitter {
//     //     domain: null,
//     //     _events: { event: [Function] },
//     //     _eventsCount: 1,
//     //     _maxListeners: undefined } true
//   });
//   myEmitter.emit('event', 'a', 'b');