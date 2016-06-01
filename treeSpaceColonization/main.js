/**
 * 定义叶子对象
 */
class Leaf {
    Leaf(){
        this.pos = createVector(random(width),random(height));    
    }
    show(){
        
    }
}
/**
 * 定义树枝对象
 */
class Branch {
    Branch(pos, parent) {
        this.pos = pos;
        this.parent = parent;
    }
}

/**
 * 定义树对象
 */
class Tree {
    Tree(num, ){
        this.leaves = [];
        for(var i = 0; i<num; i++){
            this.leaves.push(new Leaf());
        }
    }   
    show() {
        for(var i in this.leaves) {
            this.leaves[i].show();
        }                
    }         
}


function setup() {
    createCanvas(400, 400);
}    

function draw() {
    background(51);
}