import React, {useEffect, useRef} from "react";

const Pong = () => {

    const canvasRef = useRef(null);

    const ball = useRef({
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
        const prevBall = ball.current;
        prevBall.position.x += prevBall.velocity.x;
        prevBall.position.y += prevBall.velocity.y;
    }

    const detectCollision = () => {
        const canvas = canvasRef.current;
        const prevBall = ball.current;

        if(prevBall.position.y + prevBall.radius === canvas.height || 
            prevBall.position.y - prevBall.radius === 0){
            prevBall.velocity.y = -prevBall.velocity.y;
        }

        if(prevBall.position.x + prevBall.radius === canvas.width || 
            prevBall.position.x - prevBall.radius === 0){
            prevBall.velocity.x = -prevBall.velocity.x;
        }
    }

    const draw = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(ball.current.position.x, ball.current.position.y, ball.current.radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    return(
        <div>
            <canvas ref={canvasRef} width={640} height={480}/>
        </div>
    ) 
}

export default Pong;