function isString(str) {
    return 
}
function isFunction(funciton) {
    return;
}

var EventSet = [];

var EventEmmiter = {
    send : function (str) {
        if(isString(str)){

        }else{
            throw new TypeError('argument must be a string');
        }
    }
}



function SimpleEvent(eventName,callback) {
    if(isString(eventName) && isFunction(callback)) {
        this.eventName = eventName;
        this.callback = callback;
        EventSet.push(SimpleEvent);
    }    
}


// 事件循环
while(1){

}
