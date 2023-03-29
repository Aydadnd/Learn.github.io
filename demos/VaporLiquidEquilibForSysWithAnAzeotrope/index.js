
window.g = {
    cnv: undefined,
    diagram: "T-x-y",

    temperature: 75, // slider value

    // Graph edges
    lx: 75,
    rx: 475,
    by: 440,
    ty: 50,

    // For moving the dot around
    radius: 8,
    points: [],
    nP: 1,
    dragPoint: null,

    // Colors to be used repeatedly
    green: [0,120,0],
    blue: [0,70,250],

    // Coefficients
    P: 1,
    A12: 1.2278,
    A21: 1.9228,

    // For moving the dot around
    radius: 5,
    points: [],
    nP: 1,
    dragPoint: null,
}

function setup(){
    g.cnv = createCanvas(700,500);
    g.cnv.parent("graphics-wrapper");
    document.getElementsByTagName("main")[0].remove();
    g.points.push(createVector(g.lx + (g.rx-g.lx)/2,g.ty + (g.by-g.ty)/2));

}

function draw(){
    background(250);
    graphDraw();
    curveDraw();

    if(g.diagram == "P-x-y"){
        pxyDraw();
    } else {
        txyDraw();
    }

    barGraphFrame();

    let temp = g.points[0];
    push(); noStroke(); fill(0);
    ellipse(temp.x,temp.y,2*g.radius);
    pop();
}

const diagramType = document.getElementById("diagram-type").children;
const hideSlider = document.getElementById("hide-slider");
const tempSlider = document.getElementById("temp-slider");
const tempValue = document.getElementById("temp-value");

for(let i = 0; i < diagramType.length; i++){
    diagramType[i].addEventListener("click", function(){
        
        for(let j = 0; j < diagramType.length; j++){
            diagramType[j].classList.remove("selected");
        };
        diagramType[i].classList.add("selected");
        g.diagram = diagramType[i].value;
        
        if(g.diagram == "T-x-y"){
            hideSlider.style.display = 'none';;
        } else {
            hideSlider.style.display = 'grid';
        }
    });
};

tempSlider.addEventListener("input", function(){
    const temp = Number(tempSlider.value);
    tempValue.innerHTML = `${temp}`;
    g.temperature = temp;
});

// For manipulating the position of the purple dot
function mousePressed() {
    for (let i = g.points.length - 1; i >= 0; i--) {
      const isPressed = inCircle(g.points[i], g.radius);
      if (isPressed) {
        g.dragPoint = g.points.splice(i, 1)[0];
        g.points.push(g.dragPoint);
      }
    }
}

function mouseDragged() {

    if(g.dragPoint){
        if(mouseX >= g.lx && mouseX <= g.rx && mouseY >= g.ty && mouseY <= g.by){ // Within the graph
            g.dragPoint.x = mouseX;
            g.dragPoint.y = mouseY;
        } else if (mouseX < g.lx && mouseY >= g.ty && mouseY <= g.by){ // Left of the graph
            g.dragPoint.x = g.lx;
            g.dragPoint.y = mouseY;
        } else if (mouseX < g.lx && mouseY < g.ty){ // Upper left corner of the graph
            g.dragPoint.x = g.lx;
            g.dragPoint.y = g.ty;
        } else if (mouseX >= g.lx && mouseX <= g.rx && mouseY < g.ty){ // Above the graph
            g.dragPoint.x = mouseX;
            g.dragPoint.y = g.ty;
        } else if (mouseX > g.rx && mouseY < g.ty){ // Upper right corner of the graph
            g.dragPoint.x = g.rx;
            g.dragPoint.y = g.ty;
        } else if (mouseX > g.rx && mouseY >= g.ty && mouseY <= g.ty){ // Right of the graph
            g.dragPoint.x = g.rx;
            g.dragPoint.y = mouseY;
        } else if (mouseX > g.rx && mouseY > g.by){ // Lower right corner of the graph
            g.dragPoint.x = g.rx;
            g.dragPoint.y = g.by;
        } else if (mouseX <= g.rx && mouseX >= g.lx && mouseY > g.by){ // Below the graph
            g.dragPoint.x = mouseX;
            g.dragPoint.y = g.by;
        } else if (mouseX < g.lx && mouseY > g.by){
            g.dragPoint.x = g.lx;
            g.dragPoint.y = g.by;
        }
    }
}

function mouseReleased() {
    g.dragPoint = null;
}

function inCircle(pos, radius) {
    return dist(mouseX, mouseY, pos.x, pos.y) < radius;
}