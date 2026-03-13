/* ======================================================
   FLORAPEDIA EVENT BUS
   Lightweight global event system
====================================================== */

class EventBus {

  constructor(){
    this.events = {};
  }

  /* =========================================
     SUBSCRIBE
  ========================================= */

  on(event, callback){

    if(!this.events[event]){
      this.events[event] = [];
    }

    this.events[event].push(callback);

  }

  /* =========================================
     UNSUBSCRIBE
  ========================================= */

  off(event, callback){

    if(!this.events[event]) return;

    this.events[event] =
      this.events[event].filter(cb => cb !== callback);

  }

  /* =========================================
     EMIT EVENT
  ========================================= */

  emit(event, data){

    if(!this.events[event]) return;

    this.events[event].forEach(cb => {

      try{
        cb(data);
      }
      catch(err){
        console.error("Event error:", err);
      }

    });

  }

}

export const eventBus = new EventBus();