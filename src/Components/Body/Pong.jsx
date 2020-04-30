import React, {useEffect, useRef} from "react";

import {WINDOW_WIDTH, WINDOW_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_PADDING} from "../../Pong/constants";

const Pong = () => {

    const canvasRef = useRef(null);

    const refGame = useRef({
        score: {
            player1 : 0,
            player2 : 0,
        },
    })

    const refBall = useRef({
        position: {
            x: WINDOW_WIDTH / 2,
            y: WINDOW_HEIGHT / 2,
        },
        velocity: {
            x: -2,
            y: -2,
        },
        radius: 5, 
    });

    const refPaddlePlayer1 = useRef({
        y: WINDOW_HEIGHT / 2,
        height: PADDLE_HEIGHT,
        width: PADDLE_WIDTH,
        velocity: 10,
    })

    const refPaddlePlayer2 = useRef({
        y: WINDOW_HEIGHT / 2,
        height: PADDLE_HEIGHT,
        width: PADDLE_WIDTH,
        velocity: 10,
    })

    const refWinCondition = useRef({
        gameOver : false,
        winner:"",
    })

    const keys = {
        player1Up: "ArrowUp",
        player1Down: "ArrowDown",
    }

    window.addEventListener("keydown", (event) => {
        const paddlePlayer1 = refPaddlePlayer1.current;
        const paddlePlayer2 = refPaddlePlayer2.current;

        switch(event.key) {
            case keys.player1Up:
                if(paddlePlayer1.y - paddlePlayer1.height/2 >= paddlePlayer1.velocity){
                    paddlePlayer1.y -= paddlePlayer1.velocity;
                }
                break;
            case keys.player1Down:
                if(paddlePlayer1.y + paddlePlayer1.height/2 < WINDOW_HEIGHT){
                    paddlePlayer1.y += paddlePlayer1.velocity;
                }
                break;
            default:
                break;
        }
    })

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
        const score = refGame.current.score;
        const winCondition = refWinCondition.current;

        //Update ball position
        ball.position.x += ball.velocity.x;
        ball.position.y += ball.velocity.y;

        //Update score and reset ball position and velocity
        const angle = Math.PI / 4;
        const velocity = 3;
        const sign = Math.random()<0.5 ? -1 : 1;

        if(ball.position.x <= 0){
            score.player2++;
            ball.position.x = WINDOW_WIDTH / 2;
            ball.position.y = WINDOW_HEIGHT / 2;
            ball.velocity.x = -velocity * Math.cos(angle);
            ball.velocity.y = sign * velocity * Math.sin(angle);
        }

        if(ball.position.x >= WINDOW_WIDTH){
            score.player1++;
            ball.position.x = WINDOW_WIDTH / 2;
            ball.position.y = WINDOW_HEIGHT / 2;
            ball.velocity.x = velocity * Math.cos(angle);
            ball.velocity.y = sign * velocity * Math.sin(angle);
        }

        //Check if winning condition achieved;
        if(score.player1 > 10 && score.player1 > score.player2 + 1){
            winCondition.gameOver = true;
            winCondition.winner = "Player 1";
            ball.velocity.x = 0;
            ball.velocity.y = 0;
        }

        if(score.player2 > 10 && score.player2 > score.player1 + 1){
            winCondition.gameOver = true;
            winCondition.winner = "Player 2";
            ball.velocity.x = 0;
            ball.velocity.y = 0;
        }
    }

    const detectCollision = () => {
        const canvas = canvasRef.current;
        const ball = refBall.current;
        const paddlePlayer1 = refPaddlePlayer1.current;
        const paddlePlayer2 = refPaddlePlayer2.current;

        //Top and bottom collision
        if(ball.position.y + ball.radius >= canvas.height || 
            ball.position.y - ball.radius <= 0){
            ball.velocity.y = -ball.velocity.y;
        }

        //Paddle collision
        if(ball.position.x - ball.radius <= PADDLE_PADDING + paddlePlayer1.width &&
            ball.position.x + ball.radius >= PADDLE_PADDING &&
            ball.position.y + ball.radius >= paddlePlayer1.y - paddlePlayer1.height / 2 &&
            ball.position.y - ball.radius <= paddlePlayer1.y + paddlePlayer1.height / 2){
                const velocity = 3;
                const paddleZone = Math.abs(paddlePlayer1.y - ball.position.y) / (paddlePlayer1.height / 2);
                const sign = paddlePlayer1 - ball.position.y >= 0 ? 1 : -1;
                const angle = paddleZone * Math.PI / 4;
            
                ball.velocity.x = velocity * Math.cos(angle);
                ball.velocity.y = sign * velocity * Math.sin(angle);
                ball.position.x = PADDLE_PADDING + paddlePlayer1.width + ball.radius;
        }

        if(ball.position.x + ball.radius >= canvas.width - PADDLE_PADDING - paddlePlayer2.width &&
            ball.position.x - ball.radius <= canvas.width - PADDLE_PADDING - paddlePlayer2.width &&
            ball.position.y + ball.radius >= paddlePlayer2.y - paddlePlayer2.height / 2 &&
            ball.position.y - ball.radius <= paddlePlayer2.y + paddlePlayer2.height / 2){
                ball.velocity.x = -ball.velocity.x;
                ball.position.x = paddlePlayer2.width + ball.radius;
        }

    }

    const draw = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const winCondition = refWinCondition.current;

        //Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        //Draw the middle segmented line
        if(!winCondition.gameOver){
            ctx.strokeStyle = "white";
            ctx.lineWidth = 10;
            ctx.setLineDash([20, 15]);
            ctx.beginPath();
            ctx.moveTo(canvas.width/2, 0);
            ctx.lineTo(canvas.width/2, canvas.height);
            ctx.stroke();
        }
        //Draw score
        const score = refGame.current.score;

        ctx.font = "30px Arial";
        ctx.fillText(score.player1, WINDOW_WIDTH / 2 - 70 , 50);
        ctx.fillText(score.player2, WINDOW_WIDTH / 2 + 50 , 50);

        //Draw the ball
        if(!winCondition.gameOver){
            const ball = refBall.current;

            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, 2 * Math.PI);
            ctx.fill();
        }

        //Draw the paddles
        const paddlePlayer1 = refPaddlePlayer1.current;
        const paddlePlayer2 = refPaddlePlayer2.current;

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.rect(PADDLE_PADDING, paddlePlayer1.y-paddlePlayer1.height/2, paddlePlayer1.width, paddlePlayer1.height);
        ctx.fill();
        ctx.closePath();

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.rect(canvas.width-PADDLE_PADDING-paddlePlayer2.width, paddlePlayer2.y-paddlePlayer2.height/2, paddlePlayer2.width, paddlePlayer2.height);
        ctx.fill();
        ctx.closePath();

        //Game over
        if(winCondition.gameOver){
            ctx.font = "60px Arial";
            ctx.fillText(winCondition.winner + " wins!", WINDOW_WIDTH / 6, WINDOW_HEIGHT / 2);
        }
    }

    return(
        <div id="pong">
            <canvas ref={canvasRef} width={WINDOW_WIDTH} height={WINDOW_HEIGHT}/>
        </div>
    ) 
}

export default Pong;