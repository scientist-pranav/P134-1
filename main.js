status = "";
objects = [];
song = "";
function preload() {
    song = loadSound('alarm.wav', songLoaded);
}

function songLoaded()
{
    console.log('song loaded')
    //song.play();
}

function setup() {
    canvas = createCanvas(640, 420);
    canvas.center();
    video = createCapture(VIDEO);
    video.size(640, 420);
    video.hide();
    objectDetector = ml5.objectDetector('cocossd', modelLoaded);
    document.getElementById("status").innerHTML = "status: Detecting Objects";
}

function modelLoaded() {
    console.log("Model is Loaded")
    status = true;
    
}
function gotResult(error, results) {
    
    if (error) {
        console.log(error);
    } else {
        console.log(results);
        objects = results;
    }
} 

function draw() {
    image(video, 0, 0, 640, 420);
    if (status!="") {
        r = random(255);
        g = random(255);
        b = random(255);
        objectDetector.detect(video, gotResult);

        let personFound = false;
        
        for (index = 0; index < objects.length; index++) {
            document.getElementById("status").innerHTML = "status: object is detected";
            document.getElementById("number_of_objects").innerHTML = "number_of_objects: " + objects.length;
            fill(r, g, b);
            percent = floor(objects[index].confidence*100);
            text(objects[index].label+" "+percent+"%", objects[index].x, objects[index].y);
            noFill()
            stroke(r, g, b);
            rect(objects[index].x, objects[index].y, objects[index].width, objects[index].height);

            if ( objects[index] && objects[index].label == "person") {
                personFound = true;
            }
        }
        if (personFound) {
            document.getElementById("number_of_objects").innerHTML = "Person Found";
            console.log("stop sound");
            song.stop();
        } else {
            if (objects.length > 0 && objects[index] && objects[index].label != "person")
            {
                console.log("label:" + objects[index].label);
            }

            document.getElementById("number_of_objects").innerHTML = "Person not Found";
            console.log("play sound " );
            song.play();
        }
    }
}

