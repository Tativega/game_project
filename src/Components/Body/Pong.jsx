import React, {useEffect, useRef} from "react";

const Pong = () => {

    const canvasRef = useRef(null);

    const refBall = useRef({
        position: {
            x: 320,
            y: 240,
        },
        velocity: {
            x: 1,
            y: 1,
        },
        radius: 5, 
    });

    useEffect( () => {

        window.requestAnimationFrame(gameLoop)
    },[])

    const gameLoop = (timestamp) => {
        update();
        detectCollision();
        draw();

        window.requestAnimationFrame(gameLoop)
    }

    const update = () => {
        const ball = refBall.current;

        //Update ball position
        ball.position.x += ball.velocity.x;
        ball.position.y += ball.velocity.y;
    }

    const detectCollision = () => {
        const canvas = canvasRef.current;
        const ball = refBall.current;

        //Top and bottom collision
        if(ball.position.y + ball.radius === canvas.height || 
            ball.position.y - ball.radius === 0){
            ball.velocity.y = -ball.velocity.y;
        }

        //Left and Right wall collision
        if(ball.position.x + ball.radius === canvas.width || 
            ball.position.x - ball.radius === 0){
            ball.velocity.x = -ball.velocity.x;
        }
    }

    const draw = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const ball = refBall.current;

        //Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        

        //Draw the middle segmented line
        ctx.strokeStyle = "white";
        ctx.lineWidth = 10;
        ctx.setLineDash([20, 15]);
        ctx.beginPath();
        ctx.moveTo(canvas.width/2, 0);
        ctx.lineTo(canvas.width/2, canvas.height);
        ctx.stroke();

        //Draw the ball
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    return(
        <div>
            <canvas ref={canvasRef} width={640} height={480} style={{border:"1px solid white"}}/>
        </div>
    ) 
}

export default Pong;