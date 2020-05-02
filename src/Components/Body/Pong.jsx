import React, {useEffect, useRef} from "react";

import {WINDOW_WIDTH, WINDOW_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_PADDING} from "../../Pong/constants";
import { drawBall, drawGameOver,  drawMiddleLine, drawPaddle, drawScore } from "../../Pong/render";

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
        const gameOver = refWinCondition.current.gameOver;

        if(gameOver){
            // resetting the game
            refGame.current = {
                score: {
                    player1 : 0,
                    player2 : 0,
                },
            };

            refBall.current = {
                position: {
                    x: WINDOW_WIDTH / 2,
                    y: WINDOW_HEIGHT / 2,
                },
                velocity: {
                    x: -2,
                    y: -2,
                },
                radius: 5, 
            };

            refPaddlePlayer1.current.y = WINDOW_HEIGHT / 2;
            refPaddlePlayer2.current.y = WINDOW_HEIGHT / 2;

            refWinCondition.current = {
                gameOver : false,
                winner:"",
            }
        }
        

        switch(event.key) {
            case keys.player1Up:
                if(paddlePlayer1.y - paddlePlayer1.height/2 >= paddlePlayer1.velocity){
                    paddlePlayer1.y -= paddlePlayer1.velocity;
                } else {
                    paddlePlayer1.y = paddlePlayer1.height/2;
                }
                break;
            case keys.player1Down:
                if(paddlePlayer1.y + paddlePlayer1.height/2 < WINDOW_HEIGHT){
                    paddlePlayer1.y += paddlePlayer1.velocity;
                } else {
                    paddlePlayer1.y = (WINDOW_HEIGHT - paddlePlayer1.height/2);
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

    const paddleAuto = () => {
        const ball = refBall.current;

        const paddlePlayer2 = refPaddlePlayer2.current;

        if(ball.position.x > WINDOW_WIDTH / 2) {
            paddlePlayer2.y = ball.position.y
        } else {
            paddlePlayer2.y = WINDOW_HEIGHT / 2
        }
    }

    const update = () => {
        const ball = refBall.current;
        const score = refGame.current.score;
        paddleAuto();
        const winCondition = refWinCondition.current;

        //Update ball position
        ball.position.x += ball.velocity.x;
        ball.position.y += ball.velocity.y;

        //Update score and reset ball position and velocity
        const angle = Math.PI / 4;
        const velocity = 3;
        const sign = Math.random()< 0.5 ? -1 : 1;

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
                //Zone of impact on the paddle, value between 0 and 1
                
                const paddleZone = Math.abs(paddlePlayer1.y - ball.position.y) / (paddlePlayer1.height / 2);
        
                //Is the top half of the paddle (1) or the bottom one (-1)
                const sign = paddlePlayer1 - ball.position.y >= 0 ? 1 : -1;
                //The angle is 45 in the extreme of the paddle (paddleZone = 1)
                //The angle is 0 in the center of the paddle (paddleZone = 0)
                const angle = paddleZone * Math.PI / 4;
                ball.velocity.x = velocity * Math.cos(angle);
                ball.velocity.y = sign * velocity * Math.sin(angle);
                ball.position.x = PADDLE_PADDING + paddlePlayer1.width + ball.radius;
        }

        if(ball.position.x + ball.radius >= canvas.width - PADDLE_PADDING - paddlePlayer2.width &&
            ball.position.x - ball.radius <= canvas.width - PADDLE_PADDING - paddlePlayer2.width &&
            ball.position.y + ball.radius >= paddlePlayer2.y - paddlePlayer2.height / 2 &&
            ball.position.y - ball.radius <= paddlePlayer2.y + paddlePlayer2.height / 2){
                const paddleZone = Math.abs(paddlePlayer2.y - ball.position.y) / (paddlePlayer2.height / 2);
              
                
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
        
        if(!winCondition.gameOver){
            //Draw the middle segmented line and ball
            drawMiddleLine(canvas, ctx);
            drawBall(ctx, refBall.current);
        } else {
            //Game over
            drawGameOver(ctx, winCondition.winner);
        }

        //Draw score
        drawScore(ctx, refGame.current.score);

        //Draw the paddles
        const paddlePlayer1 = refPaddlePlayer1.current;
        const paddlePlayer2 = refPaddlePlayer2.current;

        drawPaddle(ctx, paddlePlayer1, PADDLE_PADDING, paddlePlayer1.y-paddlePlayer1.height/2);
        
        drawPaddle(ctx, paddlePlayer2, canvas.width-PADDLE_PADDING-paddlePlayer2.width, paddlePlayer2.y-paddlePlayer2.height/2);
    }

    return(
        <div id="pong">
            <canvas ref={canvasRef} width={WINDOW_WIDTH} height={WINDOW_HEIGHT}/>
        </div>
    ) 
}

export default Pong;