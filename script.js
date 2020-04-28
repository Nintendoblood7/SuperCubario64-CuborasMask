console.log("script.js loaded successfully.");



var renderer = null,
    scene = null,
    camera = null,
    cube = null,
    grass = null,
    animating = false;

var w = false,
    a = false,
    s = false,
    d = false,
    camL = false,
    camR = false,
    camU = false,
    camD = false,
    wheel = false;

//radius of camera circle and degrees of camera tilt downward. Used for unit circle math.
var radius = 5;
var degreesCamTilt = 30;
var degreesCamPan = 0;
var defaultCamTilt = 10;

var radians = -0.52;

function onLoad() {
    var container = document.getElementById("container");
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color("rgb(0, 162, 255)");




    //INSTANTIATE THE CAMERA WITH PROJECTION MATRIX CONSTRUCTOR. (field of view, aspect, near clipping plane, far clipping plane)
    camera = new THREE.PerspectiveCamera(45, container.offsetWidth/container.offsetHeight, 1, 100);

    camera.position.set(0, getCamY(degreesCamTilt, radius), getCamZ(degreesCamTilt, radius));
    camera.rotation.x = 0 - degreesToRadians(degreesCamTilt);




    //CREATE A LIGHT (color, intensity)
    var sun1 = new THREE.DirectionalLight(0xffffff, 1.0);
    var sun2 = new THREE.DirectionalLight(0xffffff, 1.0);
    var sun3 = new THREE.DirectionalLight(0xffffff, 1.0);
    sun1.position.set(3, 3, 2);
    sun2.position.set(-3, 3, 2);
    sun3.position.set(0, -3, 2);
    scene.add(sun1, sun2, sun3);




    //ASSEMBLE GEOMETRY WITH SHADING/TEXTURING
    var loader = new THREE.TextureLoader();

    var cubeMap = loader.load("assets/mushroom.png");
    var cubeMat = new THREE.MeshPhongMaterial({map: cubeMap});
    var cubeGeo = new THREE.BoxGeometry(1, 1, 1);
    
    var grassMap = loader.load("assets/grass.jpg");
    grassMap.wrapS = grassMap.wrapT = THREE.RepeatWrapping;
    grassMap.repeat.set( 10, 10 );
    var grassGeo = new THREE.BoxGeometry(50, 0.1, 50);
    var grassMat = new THREE.MeshPhongMaterial( { map: grassMap } );


    
    //STORE MATERIALIZED GEOMETRY INTO MESHES.
    cube = new THREE.Mesh(cubeGeo, cubeMat);
    grass = new THREE.Mesh(grassGeo, grassMat);
    grass.position.y -= 0.6;
    //ADD OBJECTS TO SCENE.
    scene.add(cube);
    scene.add(grass);



    addMovementHandlers();

    run();

}

function run() {
    //RENDER THE SCENE.
    renderer.render(scene, camera);

    //SPIN THE CUBE FOR NEXT FRAME.
    if (animating) {
        cube.rotation.y -= 0.01;
    }

    //PLAYER MOVEMENT KEYS
    if(a) {
        cube.position.x -= 0.1;
        camera.position.x -= 0.1;
        camera.updateProjectionMatrix();
    }
    if(d) {
        cube.position.x += 0.1;
        camera.position.x += 0.1;
        camera.updateProjectionMatrix();
    }
    if(s) {
        cube.position.z += 0.1;
        camera.position.z += 0.1;
        camera.updateProjectionMatrix();
    }
    if(w) {
        cube.position.z -= 0.1;
        camera.position.z -= 0.1;
        camera.updateProjectionMatrix();
    }

    //CAMERA ANIMATIONS
    if(camL) {
        degreesCamPan += 1.0;
        camera.rotation.y = degreesToRadians(degreesCamPan);
        camera.position.x = getCamY(degreesCamPan, radius);
        camera.position.z = getCamZ(degreesCamPan, radius);
    }
    if(camR) {
        degreesCamPan -= 0.05;
    }
    if(camU) {
        degreesCamTilt += 1.0;
        camera.position.y = getCamY(degreesCamTilt, radius);
        camera.position.z = getCamZ(degreesCamTilt, radius);
        camera.rotation.x = 0-(degreesToRadians(degreesCamTilt));
    }
    if(camD) {
        degreesCamTilt -= 1.0;
        camera.position.y = getCamY(degreesCamTilt, radius);
        camera.rotation.x = 0-(degreesToRadians(degreesCamTilt));
    }
    
    //GRAVITATE TOWARDS THE DEFAULT CAMERA TILT
    if(degreesCamTilt > defaultCamTilt) {
        degreesCamTilt -= 0.1;
        camera.position.y = getCamY(degreesCamTilt, radius);
        camera.rotation.x = 0-(degreesToRadians(degreesCamTilt));
    }
    if(degreesCamTilt < defaultCamTilt) {
        degreesCamTilt += 0.1;
        camera.position.y = getCamY(degreesCamTilt, radius);
        camera.rotation.x = 0-(degreesToRadians(degreesCamTilt));
    }
    //MOUSE WHEEL
    if(wheel) {
        wheel = false;
        camera.position.y = getCamY(degreesCamTilt, radius);
        camera.position.z = getCamZ(degreesCamTilt, radius);
    }

    requestAnimationFrame(run);
}







//CONVERT DEGREES TO RADIANS
function degreesToRadians(x) {
    return((x * Math.PI)/180);
}
//RETURN THE X VALUE FROM SEPARATE CIRCLE FXN OF SAME RADIUS??
function getCamX(dct, r) {

}
//RETURN THE Y VALUE FROM FXN
function getCamY(dct, r) {
    //Convert degrees to radians.
    let d = degreesToRadians(dct);
    return(r * Math.sin(d));
}
//RETURN THE Z VALUE FROM FXN (treat like x)
function getCamZ(dct, r) {
    let d = degreesToRadians(dct);
    return(r * Math.cos(d));
}

function getSphereX(degreesCamPan, degreesCamTilt, r) {
    let h = cube.position.x,
        k = cube.position.y,
        z = cube.position.z;
    //h,k,z are the center of the sphere (x,y,z) in this equation!
    //((x-h)*(x-h)) + ((y-k)*(y-k)) + ((z-0)*(z-0)) = r);
    //return (equation refactored/written as 'x = (hsdkjhkfdh)');
}
function getSphereY(degreesCamPan, degreesCamTilt, radius) {
    
}
function getSphereZ(degreesCamPan, degreesCamTilt, radius) {
    
}





function addMovementHandlers() {
    var dom = renderer.domElement;

    dom.addEventListener('mouseup', onMouseUp, false);
    dom.addEventListener('wheel', onMouseWheel, false);
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
}

function onMouseUp(event) {
    event.preventDefault();
    animating = !animating;
}
function onMouseWheel(event) {
    if(wheel) return;
    event.preventDefault();
    radius += event.deltaY;
    wheel = true;
}
function onKeyUp(e) {
    e.preventDefault();
    switch(e.keyCode) {
        //MOVEMENT = ADSW : keyCodes(a:65, d:68, s:83, w:87)
        case 65:
            a = false;
            break;
        case 68:
            d = false;
            break;
        case 83:
            s = false;
            break;
        case 87:
            w = false;
            break;
        //CAMERA = ARROWS : keyCodes(left:37, up:38, right:39, down:40)
        case 37:
            camL = false;
            break;
        case 38:
            camU = false;
            break;
        case 39:
            camR = false;
            break;
        case 40:
            camD = false;
            break;
        //DEFAULT
        default:
            break;
    }
}
function onKeyDown(e) {
    e.preventDefault();
    switch(event.keyCode) {
        //MOVEMENT ADSW
        case 65:
            if(a) return;
            a = true;
            break;
        case 68:
            if(d) return;
            d = true;
            break;
        case 83:
            if(s) return;
            s = true;
            break;
        case 87:
            if(w) return;
            w = true;
            break;
        //ARROW KEYS
        case 37:
            if(camL) return;
            camL = true;
            break;
        case 38:
            if(camU) return;
            camU = true;
            break;
        case 39:
            if(camR) return;
            camR = true;
            break;
        case 40:
            if(camD) return;
            camD = true;
            break;
        //DEFAULT
        default:
            break;
    }
}