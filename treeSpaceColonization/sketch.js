/**
 * 定义叶子对象
 */
function Leaf() {
    this.pos = createVector(random(width), random(height));
}
Leaf.prototype.show = function () {
    fill(255);
    noStroke();
    ellipse(this.pos.x, this.pos.y, 4, 4);
}
/**
 * 定义树枝对象
 */
function Branch( parent,os,dir) {
    this.pos = pos;
    this.parent = parent;
    this.dir = dir;
}
/**
 * 定义树对象
 */
const max_dist = 500;
const min_dist = 10;


function Tree(total) {
    this.leaves = [];
    this.total = total;
    this.branchs = []
    
    var pos = createVector(width/2,height/2);
    var dir = createVector(0,-1);
    var root = new Branch(null,pos,dir);
    this.branchs.push(root);
    
    for (var i = 0; i < total; i++) {
        this.leaves.push(new Leaf());
    }

}
Tree.prototype.show = function () {
    for (var i in this.leaves) {
        this.leaves[i].show();
    }
}
var tree;

function setup() {
    createCanvas(400, 400);
    tree = new Tree(200);
}

function draw() {
    background(51);
    tree.show();
}