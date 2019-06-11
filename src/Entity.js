class Entity {

    constructor() {
        this._domainEvents = [];
    }

    addDomainEvent(event) {
        this._domainEvents.push(event);
    }
}
module.exports = Entity;
