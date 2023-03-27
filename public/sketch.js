p5.disableFriendlyErrors = true;
let wFin = 500;
let hFin = 700;

let numBlueDots = 1;
let blueX = [];
let blueY = [];
let blueW;
let blueH;
let blueDirectionX = [];
let blueDirectionY = [];
let blueColor;
let blueSize = [];

let firstHost = 0;
let redX = [];
let redY = [];
let redDirectionX = [];
let redDirectionY = [];
let redStick = [];
let redSize = [];
let redColor;

let greenX = [];
let greenY = [];
let greenDirectionX = [];
let greenDirectionY = [];
let greenStick = [];
let greenSize = [];
let greenColor = [];
let numGreenDots = [];

let numRedDots;
let blueSpeed = 0.01;
let redSpeed = 0.05;
let greenSpeed = 0.08;
let stickSpeed = 0.05;
let stickCount = 0;

let prevRedX = [];
let prevRedY = [];
let bluePath = [];
let redPath = [];
let greenPath = [];
let greenPathInfected = [];

let infected;
let end = 0;
let ended = false;



function preload() {
    data = loadJSON('col.json');
}

function setup() { 
    createCanvas(wFin, hFin);
    blueSize[0] = wFin / 40;
    colorMode(HSB);
    colPal = data[Math.round(random(101))];
    document.body.style.backgroundColor = colPal[4];
    blueColor = color(colPal[2]);
    redColor = color(colPal[1]);
    numRedDots = floor(random(5, 10));
    numGreenDots = numRedDots;
    bluePath = [];
    redPath = [];
    greenPath = [];
    for (let i = 0; i < numRedDots; i++) {
        redX[i] = random(width);
        redY[i] = random(height);
        redSize[i] = wFin / 20;
        redDirectionX[i] = 1;
        redDirectionY[i] = 1;
        redStick[i] = false;
        prevRedX[i] = redX[i];
        prevRedY[i] = redY[i];
        greenX[i] = random(width);
        greenY[i] = random(height);
        greenSize[i] = wFin / 40;
        greenDirectionX[i] = 1;
        greenDirectionY[i] = 1;
        greenStick[i] = false;
        greenColor[i] = color(colPal[0]);
    }

    for (let i = 0; i < 20; i++) {
        blueX[i] = width * random(1);
        blueY[i] = height * random(1);
        blueDirectionX[i] = 1;
        blueDirectionY[i] = 1;
    }

    redPath = Array.from({
        length: numRedDots
    }, () => []);

    bluePath = Array.from({
        length: 100
    }, () => []);

    greenPath = Array.from({
        length: numRedDots
    }, () => []);

    greenPathInfected = Array.from({
        length: numRedDots
    }, () => []);
}

let ans = document.getElementsByClassName("answer-area");

function draw() {
    background(colPal[4]);
    noStroke();
    fill(blueColor);

    for (let i = 0; i < numBlueDots; i++) {
        ellipse(blueX[i], blueY[i], blueSize[i], blueSize[i]);
        if (blueSize[i] != 0) {
            bluePath[i].push(createVector(blueX[i], blueY[i]));
        }
        let blueNoiseX = map(noise(frameCount * blueSpeed + i), 0, 1, -5, 5) * blueDirectionX[i];
        let blueNoiseY = map(noise(frameCount * blueSpeed + i + 1.4), 0, 1, -5, 5) * blueDirectionY[i];
        blueX[i] += blueNoiseX;
        blueY[i] += blueNoiseY;

        if (blueX[i] < 0 || blueX[i] > width) {
            blueDirectionX[i] *= -1;
        }
        if (blueY[i] < 0 || blueY[i] > height) {
            blueDirectionY[i] *= -1;
        }
    }


    for (let i = 0; i < numRedDots; i++) {
        if (redSize[i] != 0) {
            redPath[i].push(createVector(redX[i], redY[i]));
        }
        fill(redColor);
        ellipse(redX[i], redY[i], redSize[i], redSize[i]);
        if (!redStick[i]) {
            let redNoiseX = map(noise(frameCount * redSpeed + i * 100 + 1000), 0, 1, -10, 10) * redDirectionX[i];
            let redNoiseY = map(noise(frameCount * redSpeed + i * 100 + 999.8), 0, 1, -10, 10) * redDirectionY[i];
            redX[i] += redNoiseX;
            redY[i] += redNoiseY;
        } else {
            // use lerp() to smoothly transition the red dot to the blue dot's position
            redX[i] = lerp(redX[i], blueX, stickSpeed);
            redY[i] = lerp(redY[i], blueY, stickSpeed);
            /* if (redSize[i] > 0 && stickCount !== numRedDots) {
                redSize[i] += 0.1;
                blueSize += 0.01;
            } else if (stickCount === numRedDots) {
                blueSpeed += 0.0001;
                if (blueSpeed >= 0.15) {
                    blueSize -= 0.05;
                    redSize[i] -= 1;
                    if (blueSize < 0) {
                        blueSize = 0;
                        noLoop();
                    }
                    if (redSize[i] < 0) {
                        redSize[i] = 0;
                    }

                }
            }*/

        }

        if (greenSize[i] != 0) {
            greenPath[i].push(createVector(greenX[i], greenY[i]));
        }
        fill(greenColor[i]);
        ellipse(greenX[i], greenY[i], greenSize[i], greenSize[i]);


        let greenNoiseX = map(noise(frameCount * greenSpeed + i * 100 + 1000), 0, 1, -10, 10) * greenDirectionX[i];
        let greenNoiseY = map(noise(frameCount * greenSpeed + i * 100 + 999.8), 0, 1, -10, 10) * greenDirectionY[i];
        greenX[i] += greenNoiseX;
        greenY[i] += greenNoiseY;

        // Make green dots keep distance from red dots
        for (let j = 0; j < numRedDots; j++) {
            for (let b = 0; b < numBlueDots; b++) {
                let r;
                if (blueSize[b] === wFin / 20) {
                    r = b;
                }
                if (i !== j && dist(greenX[i], greenY[i], redX[j], redY[j]) < 50 || dist(greenX[i], greenY[i], blueX[r], blueY[r]) < 50) { // if green dot is too close to another red dot
                    let angle = atan2(greenY[i] - redY[j], greenX[i] - redX[j]); // calculate angle between green and red dots
                    let newX = greenX[i] + 3 * cos(angle); // move green dot away from red dot in x direction
                    let newY = greenY[i] + 3 * sin(angle); // move green dot away from red dot in y direction
                    if (newX > 0 && newX < width && newY > 0 && newY < height) { // check if new position is within canvas boundaries
                        greenX[i] = newX;
                        greenY[i] = newY;
                        // Check if the new position of the green dot is too close to another red dot
                        for (let k = 0; k < numRedDots; k++) {
                            if (k !== i && dist(greenX[i], greenY[i], redX[k], redY[k]) < 50) {
                                greenX[i] = greenX[i] + 2 * cos(angle + PI / 2); // move green dot away from red dot in x direction
                                greenY[i] = greenY[i] + 2 * sin(angle + PI / 2); // move green dot away from red dot in y direction
                            }
                        }
                    }
                }
                if (dist(greenX[i], greenY[i], redX[j], redY[j]) < 30) {
                    greenSize[i] = 0;
                    greenX[i] = -2000;
                }
            }
        }

        //INFECTED
        for (let j = 0; j < numBlueDots; j++) {
            if (dist(greenX[i], greenY[i], blueX[j], blueY[j]) < 30) {
                numBlueDots += 1;
                blueX[numBlueDots - 1] = greenX[i];
                blueY[numBlueDots - 1] = greenY[i];
                if (blueSize[j] == wFin / 20) {
                    blueSize[numBlueDots - 1] = 0;
                    blueX[numBlueDots - 1] = -100;
                }
                blueSize[numBlueDots - 1] = wFin / 40;
                greenSize[i] = 0;
                greenX[i] = -2000;
            }
        }

        for (let j = 0; j < numBlueDots; j++) {
            if (dist(redX[i], redY[i], blueX[j], blueY[j]) < 30) {
                console.log("collided " + numBlueDots);
                numBlueDots += 1;
                blueX[numBlueDots - 1] = redX[i];
                blueY[numBlueDots - 1] = redY[i];
                blueSize[numBlueDots - 1] = wFin / 20;
                redSize[i] = 0;
                redX[i] = -2000;
                if (blueSize[j] === wFin / 40) {
                    blueX[j] = -100;
                    blueSize[j] = 0;
                }
            }
        }

        for (let j = 0; j < numBlueDots; j++) {
            if (dist(blueX[i], blueY[i], blueX[j], blueY[j]) < 30) {
                if (blueSize[j] > blueSize[i]) {
                    blueX[i] = -100;
                    blueSize[i] = 0;
                } else if (blueSize[j] === blueSize[i]) {} else if (blueSize[j] < blueSize[i]) {
                    blueX[j] = -100;
                    blueSize[j] = 0;
                }
            }
        }

        for (let j = 1; j < greenPath[i].length; j++) {
            let prevPos = greenPath[i][j - 1];
            let currPos = greenPath[i][j];
            stroke(colPal[0]);
            line(prevPos.x, prevPos.y, currPos.x, currPos.y);
        }

        for (let j = 1; j < redPath[i].length; j++) {
            let prevPos = redPath[i][j - 1];
            let currPos = redPath[i][j];
            stroke(redColor);
            line(prevPos.x, prevPos.y, currPos.x, currPos.y);
        }

        for (let j = 1; j < bluePath[i].length; j++) {
            let prevPos = bluePath[i][j - 1];
            let currPos = bluePath[i][j];
            stroke(blueColor);
            line(prevPos.x, prevPos.y, currPos.x, currPos.y);
        }



        noStroke();

        if (redX[i] < 0 || redX[i] > width) {
            redDirectionX[i] *= -1;
        }
        if (redY[i] < 0 || redY[i] > height) {
            redDirectionY[i] *= -1;
        }

        if (greenX[i] < 0 || greenX[i] > width) {
            greenDirectionX[i] *= -1;
        }
        if (greenY[i] < 0 || greenY[i] > height) {
            greenDirectionY[i] *= -1;
        }

        //URIN
        for (let b = 0; b < numBlueDots; b++) {
            let r;
            if (blueSize[b] === wFin / 40) {
                r = b;
            }
            if (dist(blueX[r], blueY[r], redX[i], redY[i]) < 100) {
                blueX[r] = lerp(blueX[r], redX[i], stickSpeed);
                blueY[r] = lerp(blueY[r], redY[i], stickSpeed);
            }
        }


        let d = dist(blueX, blueY, redX[i], redY[i]);
        if (d < redSize[firstHost] && !redStick[i]) {
            redStick[i] = true;
            stickCount += 1;
            if (stickCount === 1) {
                firstHost = i;
            }
            console.log(stickCount);
        }
        fill(blueColor);
        ellipse(blueX, blueY, blueSize, blueSize);

        //ENDE
        if (greenX[i] === -2000) {
            numGreenDots -= 1;
        }

        if (redX[i] === -2000) {
            end += 1;
        }
        console.log(end);
        if (end === numRedDots) {
            for (let j = 0; j < numBlueDots; j++) {
                blueSize[j] = 0;
                blueX[j] = -100;
                greenSize[i] = 0;
                greenX[i] = -2000;
                setInterval(ending, 1000);
            }
        }
    }
}

function ending() {
    noLoop();
    ended = true;
    document.getElementsByClassName('our-form')[0].style.top = '0px'
    textSize(24);
    fill(colPal[1])
    text(ans[0].innerHTML, 15, hFin-100, 400, 400)
}

function keyTyped() {
if(key == '1' && ended == true){
    save('gondii.png');
  }
}