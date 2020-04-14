import React, {useEffect, useRef, useState} from "react";

const Pong = () => {

    const canvasRef = useRef(null);

    const [ball, setBall] = useState({
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

    const gameLoop = (timestamp) => {
        update();
        draw();

        window.requestAnimationFrame(gameLoop)
    }

    useEffect( () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        window.requestAnimationFrame(gameLoop)
    },[])

    const update = () => {
        setBall(previous => ({
            ...previous,
            position: {x: previous.position.x + previous.velocity.x , 
                    y: previous.position.y + previous.velocity.y}
        }))
    }

    const draw = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    return(
        <div>
            <canvas ref={canvasRef} width={640} height={480}/>
        </div>
    ) 
}

export default Pong;