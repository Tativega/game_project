import React, {useEffect, useRef} from "react";

import {WINDOW_WIDTH, WINDOW_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_PADDING,BALL_SPEED,SPEED_INCREASE} from "../../Pong/constants";
import { drawBall, drawGameOver, drawMenu, drawMiddleLine, drawPaddle, drawScore, drawSettings, drawKeyboard } from "../../Pong/render";
import { updateBall } from "../../Pong/update";
import { borderCollision } from "../../Pong/collision";

const Pong = () => {

    const canvasRef = useRef(null);

    const refGame = useRef({
        score: {
            player1 : 0,
            player2 : 0,
        },
        ballSpeed : BALL_SPEED,
        screen: "menu", //menu - settings - keyboard - game - gameover
   
    })

    const refBall = useRef({
        position: {
            x: WINDOW_WIDTH / 2,
            y: WINDOW_HEIGHT / 2,
        },
        velocity: {
            x: -refGame.current.ballSpeed * Math.cos(Math.PI / 4),
            y: -refGame.current.ballSpeed * Math.sin(Math.PI / 4),
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
        velocity: 4,
    })

    const refWinCondition = useRef({
        gameOver : false,
        winner:"",
    });

    const refSettings = useRef({
        control: "keyboard",
        keys : {
            player1Up: "ArrowUp",
            player1Down: "ArrowDown",
            player2Up: "w",
            player2Down: "s",
        },
        players: 1,
    });

    window.addEventListener("click", ({clientX, clientY}) => {
        const canvas = canvasRef.current;

        if(canvas){
            let screen = refGame.current.screen;
            const ctx = canvas.getContext('2d');
            const rect = ctx.canvas.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            ctx.font = "30px Arial";
            const fontHeight = parseInt(ctx.font) * 0.8; 

            if(screen === "menu") {                   
                const startWidth = ctx.measureText("Start Game").width;
                const settingsWidth = ctx.measureText("Settings").width;

                if( x > 0.5 * (WINDOW_WIDTH - startWidth) && 
                    x < 0.5 * (WINDOW_WIDTH + startWidth) &&
                    y > 0.4 * WINDOW_HEIGHT - fontHeight &&
                    y < 0.4 * WINDOW_HEIGHT){
                    //Start Game
                    refGame.current.screen = "game";
                }

                if( x > 0.5 * (WINDOW_WIDTH - settingsWidth) && 
                    x < 0.5 * (WINDOW_WIDTH + settingsWidth) &&
                    y > 0.6 * WINDOW_HEIGHT - fontHeight &&
                    y < 0.6 * WINDOW_HEIGHT){
                    //Settings
                    refGame.current.screen = "settings";
                }
            }

            if(screen === "settings") {     
                const backWidth = ctx.measureText("Start Game").width;
                const keyboardWidth = ctx.measureText("Keyboard").width;
                const mouseWidth = ctx.measureText("Mouse").width;
                const onePlayerWidth = ctx.measureText("1 Player").width;
                const twoPlayersWidth = ctx.measureText("2 Player").width;
                const keysWidth = ctx.measureText("Configure Keyboard").width;
            
                if( x > 0.5 * (WINDOW_WIDTH - backWidth) && 
                    x < 0.5 * (WINDOW_WIDTH + backWidth) &&
                    y > 0.9 * WINDOW_HEIGHT - fontHeight &&
                    y < 0.9 * WINDOW_HEIGHT){
                    //Menu
                    refGame.current.screen = "menu";
                }

                if( x > 0.35 * (WINDOW_WIDTH - keyboardWidth) && 
                    x < 0.35 * (WINDOW_WIDTH + keyboardWidth) &&
                    y > 0.25 * WINDOW_HEIGHT - fontHeight &&
                    y < 0.25 * WINDOW_HEIGHT){
                    //Choose keyboard
                    refSettings.current.control = "keyboard";
                };

                if( x > 0.5 * (WINDOW_WIDTH - keysWidth) && 
                    x < 0.5 * (WINDOW_WIDTH + keysWidth) &&
                    y > 0.45 * WINDOW_HEIGHT - fontHeight &&
                    y < 0.45 * WINDOW_HEIGHT){
                    //Go to keyboard settings
                    refGame.current.screen = "keyboard";
                };

                if( x > 0.65 * (WINDOW_WIDTH - mouseWidth) && 
                    x < 0.65 * (WINDOW_WIDTH + mouseWidth) &&
                    y > 0.25 * WINDOW_HEIGHT - fontHeight &&
                    y < 0.25 * WINDOW_HEIGHT){
                    //Choose mouse
                    refSettings.current.control = "mouse";
                };

                if( x > 0.35 * (WINDOW_WIDTH - onePlayerWidth) && 
                    x < 0.35 * (WINDOW_WIDTH + onePlayerWidth) &&
                    y > 0.65 * WINDOW_HEIGHT - fontHeight &&
                    y < 0.65 * WINDOW_HEIGHT){
                    //Choose 1 player
                    refSettings.current.players = 1;
                };

                if( x > 0.65 * (WINDOW_WIDTH - twoPlayersWidth) && 
                    x < 0.65 * (WINDOW_WIDTH + twoPlayersWidth) &&
                    y > 0.65 * WINDOW_HEIGHT - fontHeight &&
                    y < 0.65 * WINDOW_HEIGHT){
                    //Choose 2 players
                    refSettings.current.players = 2;
                };
            }

            if(screen === "keyboard") {
                const backWidth = ctx.measureText("back").width;
                const upWidth = ctx.measureText("up").width;
                const downWidth = ctx.measureText("down").width;

                if( x > 0.65 * (WINDOW_WIDTH - backWidth) && 
                    x < 0.65 * (WINDOW_WIDTH + backWidth) &&
                    y > 0.65 * WINDOW_HEIGHT - fontHeight &&
                    y < 0.65 * WINDOW_HEIGHT){
                    //Choose 2 players
                    refSettings.current.players = 2;
                };
            }
        }
    });

    window.addEventListener("keydown", (event) => {
        const paddlePlayer1 = refPaddlePlayer1.current;
        const gameOver = refWinCondition.current.gameOver;
        const keys = refSettings.current.keys;

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
                    x: -refGame.current.ballSpeed * Math.cos(Math.PI / 4),
                    y: -refGame.current.ballSpeed * Math.sin(Math.PI / 4),
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
        
        console.log(event.key)
        switch(event.key) {
            case keys.player1Up:
                if(paddlePlayer1.y - paddlePlayer1.height/2 >= paddlePlayer1.velocity){
                    paddlePlayer1.y -= paddlePlayer1.velocity;
                } else {
                    paddlePlayer1.y = paddlePlayer1.height/2;
                }
                break;
            case keys.player1Down:
                if(paddlePlayer1.y + paddlePlayer1.height/2 <= WINDOW_HEIGHT-paddlePlayer1.velocity){
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
        if(refGame.current.screen === "game"){
            update();
            detectCollision();
        }
        draw();

        window.requestAnimationFrame(gameLoop)
    }

    const paddleAuto = () => {
        const ball = refBall.current;

        const paddlePlayer2 = refPaddlePlayer2.current;

        if(ball.position.x > WINDOW_WIDTH / 2) {
            ball.position.y > paddlePlayer2.y ? paddlePlayer2.y += paddlePlayer2.velocity
                                              : paddlePlayer2.y -= paddlePlayer2.velocity;
        } 
    }

    const update = () => {
        const ball = refBall.current;
        const score = refGame.current.score;
        const speed = refGame.current.ballSpeed;
        const paddlePlayer2 = refPaddlePlayer2.current;
        const winCondition = refWinCondition.current;
        
        updateBall(refBall.current)
        
        paddleAuto(ball, paddlePlayer2);

        //Update score and reset ball position and velocity
        const  initialPosition = WINDOW_HEIGHT / 2 - 50 + Math.random() * 100; 
        const angle = Math.random() * Math.PI / 4;
        const sign = Math.random()< 0.5 ? -1 : 1;
      
        if(ball.position.x <= 0){
            score.player2++;
            refGame.current.ballSpeed = BALL_SPEED;
            ball.position.x = WINDOW_WIDTH / 2;
            ball.position.y = initialPosition;
            ball.velocity.x = -speed * Math.cos(angle);
            ball.velocity.y = sign * speed * Math.sin(angle);
            
        }

        if(ball.position.x >= WINDOW_WIDTH){
            score.player1++;
            refGame.current.ballSpeed = BALL_SPEED;
            ball.position.x = WINDOW_WIDTH / 2;
            ball.position.y = WINDOW_HEIGHT / 2;
            ball.velocity.x = speed * Math.cos(angle);
            ball.velocity.y = sign * speed * Math.sin(angle);
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
        const ball = refBall.current;
        const speed = refGame.current.ballSpeed;
        const paddlePlayer1 = refPaddlePlayer1.current;
        const paddlePlayer2 = refPaddlePlayer2.current;


        //Top and bottom collision
        borderCollision(refBall.current, canvasRef.current);

        //Paddle collision
        if(ball.position.x - ball.radius <= PADDLE_PADDING + paddlePlayer1.width &&
            ball.position.x + ball.radius >= PADDLE_PADDING &&
            ball.position.y + ball.radius >= paddlePlayer1.y - paddlePlayer1.height / 2 &&
            ball.position.y - ball.radius <= paddlePlayer1.y + paddlePlayer1.height / 2){
                //Zone of impact on the paddle, value between 0 and 1

                refGame.current.ballSpeed = refGame.current.ballSpeed + SPEED_INCREASE; 
               
                let paddleZone = Math.abs(paddlePlayer1.y - ball.position.y) / (paddlePlayer1.height / 2);
                let addedSpeed = paddleZone * 15
                //Is the top half of the paddle (1) or the bottom one (-1)
                const sign = paddlePlayer1.y - ball.position.y >= 0 ? -1 : 1;
                //The angle is 45 in the extreme of the paddle (paddleZone = 1)
                //The angle is 0 in the center of the paddle (paddleZone = 0)
                let angle = paddleZone * Math.PI / 2.5;
                ball.velocity.x = (speed + addedSpeed) * Math.cos(angle);
                ball.velocity.y = sign * speed * Math.sin(angle);
                ball.position.x = PADDLE_PADDING + paddlePlayer1.width + ball.radius;
        }

        if(ball.position.x - ball.radius <= WINDOW_WIDTH - PADDLE_PADDING &&
            ball.position.x + ball.radius >= WINDOW_WIDTH - PADDLE_PADDING - paddlePlayer2.width &&
            ball.position.y + ball.radius >= paddlePlayer2.y - paddlePlayer2.height / 2 &&
            ball.position.y - ball.radius <= paddlePlayer2.y + paddlePlayer2.height / 2){
                //Zone of impact on the paddle, value between 0 and 1
                refGame.current.ballSpeed = refGame.current.ballSpeed + SPEED_INCREASE; 
                let paddleZone = Math.abs(paddlePlayer2.y - ball.position.y) / (paddlePlayer2.height / 2);
        
                //Is the top half of the paddle (1) or the bottom one (-1)
                let sign = paddlePlayer2.y - ball.position.y >= 0 ? -1 : 1;
                //The angle is 45 in the extreme of the paddle (paddleZone = 1)
                //The angle is 0 in the center of the paddle (paddleZone = 0)
                let angle = paddleZone * Math.PI / 4;
                ball.velocity.x = - speed * Math.cos(angle);
                ball.velocity.y = sign * speed * Math.sin(angle);
                ball.position.x = WINDOW_WIDTH - PADDLE_PADDING - paddlePlayer2.width - ball.radius;
        }
    }

    const draw = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const screen = refGame.current.screen;
        const winCondition = refWinCondition.current;

        //Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        switch(screen){
            case "menu":
                drawMenu(ctx);
                break;
            case "settings":
                drawSettings(ctx);
                break;
            case "keyboard":
                drawKeyboard(ctx, refSettings.current.keys);
                break;
            case "game":
                //Draw the middle segmented line and ball
                drawMiddleLine(canvas, ctx);
                drawBall(ctx, refBall.current);

                //Draw score
                drawScore(ctx, refGame.current.score);

                //Draw the paddles
                const paddlePlayer1 = refPaddlePlayer1.current;
                const paddlePlayer2 = refPaddlePlayer2.current;

                drawPaddle(ctx, paddlePlayer1, PADDLE_PADDING, paddlePlayer1.y-paddlePlayer1.height/2);
                
                drawPaddle(ctx, paddlePlayer2, canvas.width-PADDLE_PADDING-paddlePlayer2.width, paddlePlayer2.y-paddlePlayer2.height/2);

                break;
            case "gameOver":
                drawGameOver(ctx, winCondition.winner);
                break
            default:
                break;
        }

        // if(!winCondition.gameOver){
        //     //Draw the middle segmented line and ball
        //     drawMiddleLine(canvas, ctx);
        //     drawBall(ctx, refBall.current);
        // } else {
        //     //Game over
        //     drawGameOver(ctx, winCondition.winner);
        // }

        // //Draw score
        // drawScore(ctx, refGame.current.score);

        // //Draw the paddles
        // const paddlePlayer1 = refPaddlePlayer1.current;
        // const paddlePlayer2 = refPaddlePlayer2.current;

        // drawPaddle(ctx, paddlePlayer1, PADDLE_PADDING, paddlePlayer1.y-paddlePlayer1.height/2);
        
        // drawPaddle(ctx, paddlePlayer2, canvas.width-PADDLE_PADDING-paddlePlayer2.width, paddlePlayer2.y-paddlePlayer2.height/2);
    }

    return(
        <div id="pong">
            <canvas ref={canvasRef} width={WINDOW_WIDTH} height={WINDOW_HEIGHT}/>
        </div>
    ) 
}

export default Pong;
