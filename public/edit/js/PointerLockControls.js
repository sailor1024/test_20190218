/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function ( camera ) {
    this.pixelToRotation = 0.002;
    this.minRotateX = Math.PI/6.0;
    this.maxRotateX = -Math.PI/4.9; //-Math.PI/4.0;

    var scope = this;

    this.enableDamping = true;
    this.keepMove = false;
    this.curVelX = 1.0;
    this.curVelY = 1.0;
    this.dampingFactor = 0.05;
    this.clock = new THREE.Clock();
    this.timeDelta = 0.1;

    this.bouncingStep = 0.1;
    this.bouncePoint =  new THREE.Vector3();
    this.bounceDir = new THREE.Vector3();
    this.bouncingCount = 20;
    this.bouncingTime = 0;
    this.bouncing = false;

    camera.rotation.set( 0, 0, 0 );

    var pitchObject = new THREE.Object3D();
    pitchObject.add( camera );

    var yawObject = new THREE.Object3D();
    yawObject.position.y = 10;
    yawObject.add( pitchObject );

    var PI_3 = Math.PI / 3;
    var PI_4 = Math.PI / 4;
    var PI_5 = Math.PI / 5;
    var PI_6 = Math.PI / 6;

    var onMouseMove = function ( event ) {


        if ( scope.enabled === false ) return;
        if(!cameraController.isEnableRotate()) return;

        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        yawObject.rotation.y += movementX * scope.pixelToRotation;
        pitchObject.rotation.x += movementY * scope.pixelToRotation;

        scope.timeDelta = scope.clock.getDelta();
        scope.curVelX = movementY * scope.pixelToRotation/scope.timeDelta;
        scope.curVelY = movementX * scope.pixelToRotation/scope.timeDelta;


        //pitchObject.rotation.x = Math.max( - PI_3, Math.min(PI_6, pitchObject.rotation.x ) );
        pitchObject.rotation.x = Math.max(scope.maxRotateX, Math.min(scope.minRotateX, pitchObject.rotation.x));

    };

    var onMouseDown = function ( event ) {
        scope.keepMove = false;
        scope.timeDelta = scope.clock.getDelta();
    }

    var onMouseUp = function ( event ) {
        scope.keepMove = true;
    }

    this.bounce = function(curPoint,mousePoint){
        if(scope.bouncingTime>0 && scope.bouncingTime<20)
        {
            return;
        }
        var bounceDir = new THREE.Vector3();
        bounceDir.subVectors(mousePoint, curPoint);
        scope.bouncingStep =  bounceDir.length()/800.0;
        bounceDir.normalize();

        scope.bouncePoint = curPoint;
        scope.bounceDir = bounceDir;
        scope.bouncing = true;
        scope.bouncingTime = 0;

    }


    this.update = function( ) {
        if(scope.keepMove){

            var xmoving = true;
            var ymoving = true;

            if(scope.curVelY<0.001&&scope.curVelY>-0.001)
            {
                scope.curVelY = 0.0;
                ymoving = false;
            }
            else
            {
                scope.curVelY = scope.curVelY*(1.0-scope.dampingFactor);
            }

            if(scope.curVelX<0.001&&scope.curVelX>-0.001)
            {
                scope.curVelX = 0.0;
                xmoving = false;
            }
            else
            {
                scope.curVelX = scope.curVelX*(1.0-scope.dampingFactor);
            }

            if(xmoving==false&&ymoving==false)
            {
                scope.keepMove = false;
            }

            scope.timeDelta = scope.clock.getDelta();

            //alert(scope.curVelY);
            //alert(scope.curVelX);


            yawObject.rotation.y += scope.curVelY*scope.timeDelta;            ;
            pitchObject.rotation.x += scope.curVelX*scope.timeDelta;

            pitchObject.rotation.x = Math.max(scope.maxRotateX, Math.min(scope.minRotateX, pitchObject.rotation.x));
        }

        if(scope.bouncing)
        {
            //console.log("scope.bouncingTime"+scope.bouncingTime);
            //console.log("scope step = "+scope.bouncingStep );
            //console.log("scope dir x = "+scope.bounceDir.x+" y="+scope.bounceDir.y+" z=" + scope.bounceDir.z);
             if(scope.bouncingTime<=10) {
                var curPos = new THREE.Vector3();
                curPos.x = scope.bouncingStep * scope.bounceDir.x;
                curPos.y = scope.bouncingStep * scope.bounceDir.y;
                curPos.z = scope.bouncingStep * scope.bounceDir.z;
                //console.log("curPos x = "+curPos.x+" y="+curPos.y+" z=" + curPos.z);

                yawObject.position.x += curPos.x;
                yawObject.position.y += curPos.y;
                yawObject.position.z += curPos.z;
                //console.log("yawObject position x="+ yawObject.position.x+ " y= "+ yawObject.position.y + " z= "+ yawObject.position.z);
            }
            else{
                 var curPos = new THREE.Vector3();
                 curPos.x = scope.bouncingStep * scope.bounceDir.x;
                 curPos.y = scope.bouncingStep * scope.bounceDir.y;
                 curPos.z = scope.bouncingStep * scope.bounceDir.z;
                 //console.log("curPos x = "+curPos.x+" y="+curPos.y+" z=" + curPos.z);

                 yawObject.position.x -= curPos.x;
                 yawObject.position.y -= curPos.y;
                 yawObject.position.z -= curPos.z;
                //console.log("yawObject position x="+ yawObject.position.x+ " y= "+ yawObject.position.y + " z= "+ yawObject.position.z);
            }

            scope.bouncingTime += 1;

            if(scope.bouncingTime>=20)
            {
                scope.bouncing = false;
                scope.bouncingTime = 0;
            }

        }
    }

    this.touchX = this.touchY = 0;
    var onTouchStart = function( event ) {

        scope.touchX = event.changedTouches[0].clientX;
        scope.touchY = event.changedTouches[0].clientY;

        scope.keepMove = false;
        scope.timeDelta = scope.clock.getDelta();
    };

    var onTouchMove = function( event ) {
        //if ( scope.enabled === false ) return;
        event.preventDefault();
        event.stopPropagation();

        if(!cameraController.isEnableRotate()) return;

        yawObject.rotation.y += (event.changedTouches[0].clientX-scope.touchX) * scope.pixelToRotation*4;
        pitchObject.rotation.x += (event.changedTouches[0].clientY-scope.touchY) * scope.pixelToRotation*3;

        //pitchObject.rotation.x = Math.max( - PI_3, Math.min(PI_6, pitchObject.rotation.x ) );
        pitchObject.rotation.x = Math.max(scope.maxRotateX, Math.min(scope.minRotateX, pitchObject.rotation.x));

        scope.timeDelta = scope.clock.getDelta();
        scope.curVelY = ((event.changedTouches[0].clientX-scope.touchX) * scope.pixelToRotation*4)/scope.timeDelta;
        scope.curVelX =((event.changedTouches[0].clientY-scope.touchY) * scope.pixelToRotation*3)/scope.timeDelta;

        scope.touchX = event.changedTouches[0].clientX;
        scope.touchY = event.changedTouches[0].clientY;

    };

    var onTouchEnd = function( event ) {
        scope.touchX = event.changedTouches[0].clientX;
        scope.touchY = event.changedTouches[0].clientY;

        scope.keepMove = true;
    };

    this.dispose = function() {

        document.removeEventListener( 'mousemove', onMouseMove, false );
        document.removeEventListener( 'mouseup', onMouseUp, false );
        document.removeEventListener( 'mousedown', onMouseDown, false );
        document.removeEventListener( 'touchstart', onTouchStart, false );
        document.removeEventListener( 'touchmove', onTouchMove, false );
        document.removeEventListener('touchend',onTouchEnd, false);

    };

    document.addEventListener( 'touchstart', onTouchStart, false );
    //document.addEventListener( 'touchmove', onTouchMove, false);
    document.addEventListener( 'touchmove', onTouchMove, false);
    document.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener( 'mouseup', onMouseUp, false );
    document.addEventListener( 'mousedown', onMouseDown, false );
    document.addEventListener('touchend',onTouchEnd, false);


    this.enabled = false;

    this.getObject = function () {
        return yawObject;
    };

    this.getDirection = function() {

        // assumes the camera itself is not rotated

        var direction = new THREE.Vector3( 0, 0, - 1 );
        var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

        return function( v ) {

            rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

            v.copy( direction ).applyEuler( rotation );

            return v;

        };

    }();

};
