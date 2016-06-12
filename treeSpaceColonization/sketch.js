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
    let nextPos = p5.Vector.add(this.pos, this.dir);
    let nextBranch = new Branch(this, nextPos, this.dir.copy());
    return nextBranch;
}

/**
 * 定义树对象
 */
const max_dist = 500;
const min_dist = 10;
let tree;

function Tree(total) {
    this.leaves = [];
    this.total = total;
    this.branches = [];

    // 添加叶节点
    for (var i = 0; i < total; i++) {
        this.leaves.push(new Leaf());
    }
    // 添加枝
    let pos = createVector(width / 2, height / 2);
    let dir = createVector(0, -1);
    let root = new Branch(null, pos, dir);
    this.branchs.push(root);

    let current = root;
    let found = false;

    while (!found) {
        for (let i in leaves) {
            let d = p5.Vector.dist(root.pos, leaves[i].pos);
            if (d < max_dist) {
                found = true;
            }
        }
        if (!found) {
            let branch = current.next();
            current = branch;
            this.branchs.push(current);
        }
    }

}
Tree.prototype.show = function () {
    for (var i in this.leaves) {
        this.leaves[i].show();
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