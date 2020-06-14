import React, { useEffect, useRef} from "react";

import {PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_PADDING,BALL_SPEED, KEYBOARD_OR_MOUSE_TEXT_POSITION, CONFIG_KEYBOARD_TEXT_POSITION, ONE_OR_TWO_PLAYERS_TEXT_POSITION, BACK_TEXT_POSITION, CONFIG_BALL_TEXT_POSITION,SPEED_DIFICULTY_TEXT_POSITION,EASY_SPEED_INCREASE,NORMAL_SPEED_INCREASE,HARD_SPEED_INCREASE} from "../../Pong/constants";
import { drawBall, drawGameOver, drawMenu, drawMiddleLine, drawPaddle, drawScore, drawSettings, drawKeyboard, drawBallSettings } from "../../Pong/render";
import { update } from "../../Pong/update";
import { borderCollision } from "../../Pong/collision";
import { CanvasStyled, PongStyled } from "../Body/style";


const Pong = () => {

    /* useRef Declarations */

    const canvasRef = useRef(null);

    const refBall = useRef(null);
    const refPaddlePlayer1 = useRef();
    const refPaddlePlayer2 = useRef(null);

    /* when canvas is ready */
  
    useEffect( () => {
        const canvas = canvasRef.current;

        refBall.current = {
            position: {
                x: canvas.width / 2,
                y: canvas.height / 2,
            },
            velocity: {
                x: -refGame.current.ball.speed * Math.cos(Math.PI / 4),
                y: -refGame.current.ball.speed * Math.sin(Math.PI / 4),
            },
            radius: 5, 
        };
        
        refPaddlePlayer1.current = {
            y: canvas.height / 2,
            height: PADDLE_HEIGHT,
            width: PADDLE_WIDTH,
            velocity: 10,
        }
        
        refPaddlePlayer2.current = {
            y: canvas.height / 2,
            height: PADDLE_HEIGHT,
            width: PADDLE_WIDTH,
            velocity: 4,
        }
    }, [canvasRef]);            
    
    const gameAreaRef = useRef(null);

    const refGame = useRef({
        score: {
            player1 : 0,
            player2 : 0,
        },
        ball: {
			speed : BALL_SPEED,
		},
        screen: "menu", //menu - settings - keyboard - ball - game - gameover 
        pause: false,
    })

    const refWinCondition = useRef({
        gameOver : false,
        winner:"",
    });

    const refSettings = useRef({
        control: "keyboard",
        mouse: "none",
        keys : {
            player1Up: "ArrowUp",
            player1Down: "ArrowDown",
            player2Up: "w",
            player2Down: "s",
            pause: "p",
        },
		players: 1,
		ball:{
			speedDificulty: NORMAL_SPEED_INCREASE //EASY_SPEED_INCREASE - NORMAL_SPEED_INCREASE - HARD_SPEED_INCREASE
		}
    });

    const resizeGame = () => {
        const gameArea = gameAreaRef.current;
        const canvas = canvasRef.current;

        if(gameArea && canvas){
            const widthToHeight = 4 / 3;
            let newWidth = window.innerWidth;
            let newHeight = window.innerHeight;
            const newWidthToHeight = newWidth / newHeight;
    
            if (newWidthToHeight > widthToHeight) {
                // window width is too wide relative to desired game width
                newWidth = newHeight * widthToHeight;
                gameArea.style.height = newHeight + 'px';
                gameArea.style.width = newWidth + 'px';
            } else { // window height is too high relative to desired game height
                newHeight = newWidth / widthToHeight;
                gameArea.style.width = newWidth + 'px';
                gameArea.style.height = newHeight + 'px';
            }
    
            gameArea.style.marginTop = (-newHeight / 2) + 'px';
            gameArea.style.marginLeft = (-newWidth / 2) + 'px';
    
            gameArea.style.fontSize = (newWidth / 400) + 'em';
    
            canvas.width = newWidth;
            canvas.height = newHeight;
        }
    }

    /* Listeners */

    window.addEventListener('resize', resizeGame, false);
    window.addEventListener('orientationchange', resizeGame, false);

    window.addEventListener("click", (event) => {
        const canvas = canvasRef.current;
        const keys = refSettings.current.keys;
        const {clientX, clientY} = event;

        if(keys.player1Up === "" || 
            keys.player2Up === "" || 
            keys.player1Down === "" || 
            keys.player2Down === ""){
                return null;
            };

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

                if( x > 0.5 * (canvas.width - startWidth) && 
                    x < 0.5 * (canvas.width + startWidth) &&
                    y > 0.4 * canvas.height - fontHeight &&
                    y < 0.4 * canvas.height){
                    //Start Game
                    refGame.current.screen = "game";
                }

                if( x > 0.5 * (canvas.width - settingsWidth) && 
                    x < 0.5 * (canvas.width + settingsWidth) &&
                    y > 0.6 * canvas.height - fontHeight &&
                    y < 0.6 * canvas.height){
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
				
				if( x > 0.5 * (canvas.width - backWidth) && 
					x < 0.5 * (canvas.width + backWidth) &&
					y > CONFIG_BALL_TEXT_POSITION * canvas.height - fontHeight &&
					y < CONFIG_BALL_TEXT_POSITION * canvas.height){
				//Go to ball settings
				refGame.current.screen = "ball";
				}
            
                if( x > 0.5 * (canvas.width - backWidth) && 
                    x < 0.5 * (canvas.width + backWidth) &&
                    y > BACK_TEXT_POSITION * canvas.height - fontHeight &&
                    y < BACK_TEXT_POSITION * canvas.height){
                    //Menu
                    refGame.current.screen = "menu";
                }

                if( x > 0.35 * (canvas.width - keyboardWidth) && 
                    x < 0.35 * (canvas.width + keyboardWidth) &&
                    y > KEYBOARD_OR_MOUSE_TEXT_POSITION * canvas.height - fontHeight &&
                    y < KEYBOARD_OR_MOUSE_TEXT_POSITION * canvas.height){
                    //Choose keyboard
                    refSettings.current.control = "keyboard";
                    refPaddlePlayer1.current.velocity = 10;
                };

                if( x > 0.5 * (canvas.width - keysWidth) && 
                    x < 0.5 * (canvas.width + keysWidth) &&
                    y > CONFIG_KEYBOARD_TEXT_POSITION * canvas.height - fontHeight &&
                    y < CONFIG_KEYBOARD_TEXT_POSITION * canvas.height){
                    //Go to keyboard settings
                    refGame.current.screen = "keyboard";
                };

                if( x > 0.65 * (canvas.width - mouseWidth) && 
                    x < 0.65 * (canvas.width + mouseWidth) &&
                    y > KEYBOARD_OR_MOUSE_TEXT_POSITION * canvas.height - fontHeight &&
                    y < KEYBOARD_OR_MOUSE_TEXT_POSITION * canvas.height){
                    //Choose mouse
                    refSettings.current.control = "mouse";
                    refPaddlePlayer1.current.velocity = 5;
                };

                if( x > 0.35 * (canvas.width - onePlayerWidth) && 
                    x < 0.35 * (canvas.width + onePlayerWidth) &&
                    y > ONE_OR_TWO_PLAYERS_TEXT_POSITION * canvas.height - fontHeight &&
                    y < ONE_OR_TWO_PLAYERS_TEXT_POSITION * canvas.height){
                    //Choose 1 player
                    refSettings.current.players = 1;
                };

                if( x > 0.65 * (canvas.width - twoPlayersWidth) && 
                    x < 0.65 * (canvas.width + twoPlayersWidth) &&
                    y > ONE_OR_TWO_PLAYERS_TEXT_POSITION * canvas.height - fontHeight &&
                    y < ONE_OR_TWO_PLAYERS_TEXT_POSITION * canvas.height){
                    //Choose 2 players
                    refSettings.current.players = 2;
                };
            }

            if(screen === "keyboard") {
                const backWidth = ctx.measureText("back").width;
                const upWidth = ctx.measureText("up").width;
                const downWidth = ctx.measureText("down").width;

                // Go back to Settings
                if( x > 0.5 * (canvas.width - backWidth) && 
                    x < 0.5 * (canvas.width + backWidth) &&
                    y > 0.9 * canvas.height - fontHeight &&
                    y < 0.9 * canvas.height){
                    
                    refGame.current.screen = "settings";
                };

                // Set 'up' keys
                if( x > 0.35 * (canvas.width - upWidth) && 
                    x < 0.35 * (canvas.width + upWidth)){
                        if( y > 0.35 * canvas.height - fontHeight &&
                            y < 0.35 * canvas.height){
                                refSettings.current.keys.player1Up = "";
                            }
  
                        if( y > 0.70 * canvas.height - fontHeight &&
                            y < 0.70 * canvas.height){
                                refSettings.current.keys.player2Up = "";
                            }
                };

                // Set 'down' keys
                if( x > 0.35 * (canvas.width - downWidth) && 
                x < 0.35 * (canvas.width + downWidth)){
                    if( y > 0.40 * canvas.height - fontHeight &&
                        y < 0.40 * canvas.height){
                            refSettings.current.keys.player1Down = "";
                        }

                    if( y > 0.75 * canvas.height - fontHeight &&
                        y < 0.75 * canvas.height){
                            refSettings.current.keys.player2Down = "";
                        }
                };
			}
			
			if(screen === "ball") {
				const backWidth = ctx.measureText("back").width;
				const easyWidth = ctx.measureText("easy").width;
				const normalWidth = ctx.measureText("normal").width;
				const hardWidth = ctx.measureText("hard").width;

				if( x > 0.5 * (canvas.width - easyWidth) && 
					x < 0.5 * (canvas.width + easyWidth) &&
					y > SPEED_DIFICULTY_TEXT_POSITION * canvas.height - fontHeight &&
					y < SPEED_DIFICULTY_TEXT_POSITION * canvas.height){
				refSettings.current.ball.speedDificulty = EASY_SPEED_INCREASE;
				};

				if( x > 0.7 * (canvas.width - normalWidth) && 
					x < 0.7 * (canvas.width + normalWidth) &&
					y > SPEED_DIFICULTY_TEXT_POSITION * canvas.height - fontHeight &&
					y < SPEED_DIFICULTY_TEXT_POSITION * canvas.height){
			
				refSettings.current.ball.speedDificulty = NORMAL_SPEED_INCREASE;
				};

				if( x > 0.9 * (canvas.width - hardWidth) && 
					x < 0.9 * (canvas.width + hardWidth) &&
					y > SPEED_DIFICULTY_TEXT_POSITION * canvas.height - fontHeight &&
					y < SPEED_DIFICULTY_TEXT_POSITION * canvas.height){
				
				refSettings.current.ball.speedDificulty = HARD_SPEED_INCREASE;
				};

                // Go back to Settings
                if( x > 0.5 * (canvas.width - backWidth) && 
                    x < 0.5 * (canvas.width + backWidth) &&
                    y > 0.9 * canvas.height - fontHeight &&
                    y < 0.9 * canvas.height){
                    
                    refGame.current.screen = "settings";
                };
			
			}

            if(screen === "gameOver"){
                resetGame(event);
            }
        }
    });

    window.addEventListener("keydown", (event) => {
        const paddlePlayer1 = refPaddlePlayer1.current;
        const keys = refSettings.current.keys;
        const gameMode = refSettings.current.control;
        const canvas = canvasRef.current;

        if(refGame.current.screen === "gameOver"){
            resetGame(event);
        }

        if(keys.player1Up === "") refSettings.current.keys.player1Up = event.key;
        if(keys.player2Up === "") refSettings.current.keys.player2Up = event.key;
        if(keys.player1Down === "") refSettings.current.keys.player1Down = event.key;
        if(keys.player2Down === "") refSettings.current.keys.player2Down = event.key;

        if(event.key.toLowerCase() === keys.pause){
            pauseGame();
        }

        if(gameMode === "keyboard" && paddlePlayer1){
            switch(event.key) {
                case keys.player1Up:
                    if(paddlePlayer1.y - paddlePlayer1.height/2 >= paddlePlayer1.velocity){
                        paddlePlayer1.y -= paddlePlayer1.velocity;
                    } else {
                        paddlePlayer1.y = paddlePlayer1.height/2;
                    }
                    break;
                case keys.player1Down:
                    if(paddlePlayer1.y + paddlePlayer1.height/2 <= canvas.height - paddlePlayer1.velocity){
                        paddlePlayer1.y += paddlePlayer1.velocity;
                    } else {
                        paddlePlayer1.y = (canvas.height - paddlePlayer1.height/2);
                    }
                    break;
                default:
                    break;
            }
        };
    });

    const pauseGame = () => {
        refGame.current.pause = !refGame.current.pause;
        if (!refGame.current.pause){
            window.requestAnimationFrame(gameLoop) // restart loop
        }
    }

    window.addEventListener('mousemove', (event)=>{
        const gameMode = refSettings.current.control;
        
        if(gameMode === "mouse"){
            const rect = canvasRef.current.getBoundingClientRect();
        
            refSettings.current.mouse = event.clientY - rect.top;
        }
    });

    useEffect( () => {
        resizeGame();
        window.requestAnimationFrame(gameLoop)
    },[])

    const gameLoop = (timestamp) => {
        const canvas = canvasRef.current;
        if (refGame.current.pause) return; // <--- stop looping
        if(refGame.current.screen === "game"){
            detectMouseDirection();
            update(canvas, refBall, refGame, refPaddlePlayer2, refWinCondition);
            detectCollision();
        }
        draw();

        window.requestAnimationFrame(gameLoop)
    }

    const resetGame = (event) => {
        const canvas = canvasRef.current;
        // resetting the game
        refGame.current = {
            score: {
                player1 : 0,
                player2 : 0,
            },
			ball: {
				speed : BALL_SPEED,
			}
        };

        refBall.current = {
            position: {
                x: canvas.width / 2,
                y: canvas.height / 2,
            },
            velocity: {
                x: -refGame.current.ball.speed * Math.cos(Math.PI / 4),
                y: -refGame.current.ball.speed * Math.sin(Math.PI / 4),
            },
            radius: 5,
        };

        refPaddlePlayer1.current.y = canvas.height / 2;
        refPaddlePlayer2.current.y = canvas.height / 2;

        refWinCondition.current = {
            gameOver : false,
            winner:"",
        }

        if(event.key || event.type === "click") {
            refGame.current.screen = "game"
        }
    }

    const detectMouseDirection = () => {
        const gameMode = refSettings.current.control;
        const paddlePlayer1 = refPaddlePlayer1.current;
        const mouseY = refSettings.current.mouse;
        const canvas = canvasRef.current;
        
        if(gameMode === "mouse"){
            if(mouseY > paddlePlayer1.y && paddlePlayer1.y + paddlePlayer1.height/2 <= canvas.height - paddlePlayer1.velocity){
                refPaddlePlayer1.current.y += refPaddlePlayer1.current.velocity;
            };
            if(mouseY < paddlePlayer1.y && paddlePlayer1.y - paddlePlayer1.height/2 >= paddlePlayer1.velocity){
                refPaddlePlayer1.current.y -= refPaddlePlayer1.current.velocity; 
            } 
        };
    }

    const detectCollision = () => {
        const ball = refBall.current;
        const speed = refGame.current.ball.speed;
        const paddlePlayer1 = refPaddlePlayer1.current;
        const paddlePlayer2 = refPaddlePlayer2.current;
        const canvas = canvasRef.current;

        //Top and bottom collision
        borderCollision(refBall.current, canvasRef.current);

        //Paddle collision
        if(ball.position.x - ball.radius <= PADDLE_PADDING + paddlePlayer1.width &&
            ball.position.x + ball.radius >= PADDLE_PADDING &&
            ball.position.y + ball.radius >= paddlePlayer1.y - paddlePlayer1.height / 2 &&
            ball.position.y - ball.radius <= paddlePlayer1.y + paddlePlayer1.height / 2){
                //Zone of impact on the paddle, value between 0 and 1

                refGame.current.ball.speed = refGame.current.ball.speed + refSettings.current.ball.speedDificulty; 
               
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

        if(ball.position.x - ball.radius <= canvas.width - PADDLE_PADDING &&
            ball.position.x + ball.radius >= canvas.width - PADDLE_PADDING - paddlePlayer2.width &&
            ball.position.y + ball.radius >= paddlePlayer2.y - paddlePlayer2.height / 2 &&
            ball.position.y - ball.radius <= paddlePlayer2.y + paddlePlayer2.height / 2){
                //Zone of impact on the paddle, value between 0 and 1
                refGame.current.ball.speed = refGame.current.ball.speed + refSettings.current.ball.speedDificulty; 
                let paddleZone = Math.abs(paddlePlayer2.y - ball.position.y) / (paddlePlayer2.height / 2);
        
                //Is the top half of the paddle (1) or the bottom one (-1)
                let sign = paddlePlayer2.y - ball.position.y >= 0 ? -1 : 1;
                //The angle is 45 in the extreme of the paddle (paddleZone = 1)
                //The angle is 0 in the center of the paddle (paddleZone = 0)
                let angle = paddleZone * Math.PI / 4;
                ball.velocity.x = - speed * Math.cos(angle);
                ball.velocity.y = sign * speed * Math.sin(angle);
                ball.position.x = canvas.width - PADDLE_PADDING - paddlePlayer2.width - ball.radius;
        }
    }

    const draw = () => {
        const canvas = canvasRef.current;
        
        if(canvas){
            const ctx = canvas.getContext('2d');
            const screen = refGame.current.screen;
            const winCondition = refWinCondition.current;

            //Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            switch(screen){
                case "menu":
                    drawMenu(canvas, ctx);
                    break;
                case "settings":
                    drawSettings(canvas, ctx, refSettings.current);
                    break;
                case "keyboard":
                    drawKeyboard(canvas, ctx, refSettings.current.keys);
                    break;
                case "ball":
                    drawBallSettings(canvas, ctx, refSettings.current.ball);
                    break;
                case "game":
                    //Draw the middle segmented line and ball
                    drawMiddleLine(canvas, ctx);
                    drawBall(canvas, ctx, refBall.current);

                    //Draw score
                    drawScore(canvas, ctx, refGame.current.score);

                    //Draw the paddles
                    const paddlePlayer1 = refPaddlePlayer1.current;
                    const paddlePlayer2 = refPaddlePlayer2.current;

                    drawPaddle(canvas, ctx, paddlePlayer1, PADDLE_PADDING, paddlePlayer1.y-paddlePlayer1.height/2);
                    
                    drawPaddle(canvas, ctx, paddlePlayer2, canvas.width-PADDLE_PADDING-paddlePlayer2.width, paddlePlayer2.y-paddlePlayer2.height/2);

                    break;
                case "gameOver":
                    drawGameOver(canvas, ctx, winCondition.winner);
                    break
                default:
                    break;
            }
        }
    }

    return(
        <PongStyled id="pong" ref={gameAreaRef}>
            <CanvasStyled ref={canvasRef}/>
        </PongStyled>
    ) 
}

export default Pong;
