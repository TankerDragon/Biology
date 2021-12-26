/*
function randomSign() {
    return Math.random() >= 0.5 ? 1 : -1;
}           

function getRndColor() {
    var r = 255*Math.random()|0,
    g = 255*Math.random()|0,
    b = 255*Math.random()|0;
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}*/

///////////Creating Constant Variables/////////////
const COLOR_SPACE = "black"; //Space Color
const FPS = 60; //Frames Per Second

const virus_num = 20; //Number of Viruses
const cell_num = 20; //Number of cells

const virus_speed = 50; //Speed of Viruses (pixels pes second)
const cell_speed = 200; //Speed of Cells (pixels pes second)

const virus_color = "red"; //Color of Viruses
const cell_color = "green"; //Color of Cells

const virus_rad = 10; //Radius of Viruses (pixels)
const cell_rad = 10; //Radius of Cells (pixels)

const virus_eye = 200; //distance that virus sees (pixels)
const cell_eye = 50; //distance that cell sees (pixels)

const canvas = document.getElementById("can");
const ctx = canvas.getContext("2d");
canvas.height = document.documentElement.clientHeight;
canvas.width = document.documentElement.clientWidth;

/////////Creating Classes//////////
class ball {
    x = Math.round(Math.random() * canvas.width);
    y = Math.round(Math.random() * canvas.height);
    a = 2 * Math.PI * Math.random();
}
class virus extends ball {
    linked_to = null;
    r = virus_rad;
    col = virus_color;
    speed = virus_speed;
    xv = Math.round(Math.sin(this.a) * this.speed);
    yv = Math.round(Math.cos(this.a) * this.speed);
    update() {
        let dx = cells[this.linked_to].x - this.x;
        let dy = cells[this.linked_to].y - this.y;
        let l = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
        this.xv = Math.round(this.speed * dx / l);
        this.yv = Math.round(this.speed * dy / l);
        
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineWidth = 5;
        ctx.strokeStyle = "yellow";
        ctx.lineTo(cells[this.linked_to].x, cells[this.linked_to].y);
        ctx.stroke();
        
        //console.log(Math.sqrt(Math.pow(this.xv,2) + Math.pow(this.yv,2)));
        /*
        let tang;
        
        if (dx == 0 && dy > 0) {
            this.a = Math.PI/2;
        } else if (dy == 0 && dx < 0) {
            this.a = Math.PI;
        } else if (dx == 0 && dy < 0) {
            this.a = 3 * Math.PI/2;
        } else if (dy == 0 && dx > 0) {
            this.a = 0;
        } else {
            tang = dy/dx;
            if (tang > 0 && dx > 0) {
                this.a = Math.atan(tang);
            } else if (tang < 0 && dx > 0) {
                this.a = 2 * Math.PI - Math.atan(tang);
            } else if (tang > 0 && dx < 0) {
                this.a = Math.PI + Math.atan(tang);
            } else if (tang < 0 && dx < 0) {
                this.a = Math.PI - Math.atan(tang);
            }
        }

        this.xv = Math.sin(this.a) * virus_speed;
        this.yv = Math.cos(this.a) * virus_speed;
        */

    }
}
class cell extends ball {
    linked_to = null;
    r = cell_rad;
    col = cell_color;
    speed = cell_speed;
    xv = Math.round(Math.sin(this.a) * cell_speed);
    yv = Math.round(Math.cos(this.a) * cell_speed);
}

var cells = [];
var viruses = [];

var choices = [];

function create() {
    for (let i = 0; i < cell_num; i++) {
        cells[i] = new cell;
    }
    for (let i = 0; i < virus_num; i++) {
        viruses[i] = new virus;
    }
}

create();

/*
function create_cell() {
    for (let i = 0; i < cell_num; i++) {
        cells[i] = {
            r: 0.01 * canvas.width / 2,
            x: Math.floor(Math.random() * canvas.width),
            y: Math.floor(Math.random() * canvas.height),
            xv: randomSign() * 1,
            yv: randomSign() * 1,
            col: "blue"
        }
    }
}
*/



function loop() {
    // Drawing Background
    ctx.fillStyle = COLOR_SPACE;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Drawing Cells
    for (let i = 0; i < cell_num; i++) {
        ctx.fillStyle = cells[i].col;
        ctx.beginPath();
        ctx.arc(cells[i].x, cells[i].y, cells[i].r, 0, Math.PI * 2);
        ctx.fill();

        cells[i].x += cells[i].xv/FPS;
        cells[i].y += cells[i].yv/FPS;

        if (cells[i].x < 0 || cells[i].x > canvas.width) {
            cells[i].xv = -cells[i].xv;
        }
        if (cells[i].y < 0 || cells[i].y > canvas.height) {
            cells[i].yv = -cells[i].yv;
        }
    }

    //Drawing Viruses
    for (let i = 0; i < virus_num; i++) {
        ctx.fillStyle = viruses[i].col;
        ctx.beginPath();
        ctx.arc(viruses[i].x, viruses[i].y, viruses[i].r, 0, Math.PI * 2);
        ctx.fill();

        viruses[i].x += viruses[i].xv/FPS;
        viruses[i].y += viruses[i].yv/FPS;

        if (viruses[i].x < 0 || viruses[i].x > canvas.width) {
            viruses[i].xv = -viruses[i].xv;
        }
        if (viruses[i].y < 0 || viruses[i].y > canvas.height) {
            viruses[i].yv = -viruses[i].yv;
        }

        if(viruses[i].linked_to == null) {
            for (let j = 0; j < cell_num; j++) {
                if(Math.sqrt(Math.pow((cells[j].x - viruses[i].x),2) + Math.pow((cells[j].y - viruses[i].y),2)) < virus_eye) {
                    choices.push(j);
                }
            }
            if(choices != []) {
                viruses[i].linked_to = choices[Math.floor(choices.length * Math.random())]; //Math.floor(Math.random() * 10)
                console.log(choices[Math.floor(choices.length * Math.random())]);
            }
            choices = [];
            //arr[i].update(arr[j].x, arr[j].y);
        }
        if(viruses[i].linked_to != null) {
            if(Math.sqrt(Math.pow((cells[viruses[i].linked_to].x - viruses[i].x),2) + Math.pow((cells[viruses[i].linked_to].y - viruses[i].y),2)) < virus_eye) {
                viruses[i].update();
            } else {
                viruses[i].linked_to = null;
            }
            
        }
    }
}

setInterval(loop, Math.round(1000 / FPS));
            

