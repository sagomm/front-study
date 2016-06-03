/**
 * 定义叶子对象
 */
function Leaf() {
    this.pos = createVector(random(width),random(height));      
}
Leaf.prototype.show = function () {
    
}
/**
 * 定义树枝对象
 */
function Branch(pos, parent) {
    this.pos = pos;
    this.parent = parent;    
}
/**
 * 定义树对象
 */
// function Tree(num,) {
//     this.leaves = [];
//     // for(var i =)
// }





function setup() {
    createCanvas(400, 400);
}    

function draw() {
    background(51);
}