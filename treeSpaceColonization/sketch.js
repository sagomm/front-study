/**
 * 定义叶子对象
 */
function Leaf() {
    this.pos = createVector(random(width), random(height-100));
}
Leaf.prototype.show = function () {
    fill(255);
    noStroke();
    ellipse(this.pos.x, this.pos.y, 4, 4);
}


/**
 * 添加枝条
 * 
 * @param parent (该枝条的父亲枝条)
 * @param pos (该枝条的位置)
 * @param dir (方向)
 */
function Branch(parent, pos, dir) {
    this.pos = pos;
    this.parent = parent;
    this.dir = dir;
}
Branch.prototype.next = function () {
    var nextPos = p5.Vector.add(this.pos,this.dir);
    var nextBranch = new Branch(this,this.nextPos,this.dir.copy());
    return nextBranch;
}
Branch.prototype.show = function () {
    if(parent != null) {
        stroke(255);
        line(this.pos.x,this.pox.y,this.parent.pos.x,this.parent.pos.y);
    }
} 
/**
 * 定义树对象
 */
const max_dist = 10;
const min_dist = 10;
var tree;

function Tree(total) {
    this.leaves = [];
    this.total = total;
    this.branches = [];

    // 添加叶节点
    for (var i = 0; i < total; i++) {
        this.leaves.push(new Leaf());
    }
    // 添加枝
    var pos = createVector(width / 2, height);
    var dir = createVector(0, -1);
    var root = new Branch(null, pos, dir);
    this.branches.push(root);

    var current = root;
    var found = false;

    while (!found) {
        for (var i in this.leaves) {
            var d = p5.Vector.dist(root.pos, this.leaves[i].pos);
            if (d < max_dist) {
                found = true;
            }
        }
        if (!found) {
            var branch = current.next();
            current = branch;
            this.branches.push(current);
        }
    }

}
Tree.prototype.show = function () {
    // 画叶子
    for (var i in this.leaves) {
        this.leaves[i].show();
    }
    // 画枝条
    for(var i in this.branches) {
        this.branches[i].show();
    }
}


function setup() {
    createCanvas(400, 400);
    tree = new Tree(200);
}

function draw() {
    background(51);
    tree.show();
}