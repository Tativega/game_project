import { BALL_SPEED } from "../Pong/constants";

export const paddleAuto = ({ height: gameHeight }, ball, paddle) => {
    if(ball.velocity.x > 0) {
        if(Math.abs(ball.position.y - paddle.y) < paddle.velocity){
            paddle.y = ball.position.y;
        } else if(ball.position.y > paddle.y + paddle.height / 2){
            paddle.y += paddle.velocity;
        } else if (ball.position.y < paddle.y - paddle.height / 2){
            paddle.y -= paddle.velocity;
        }
    } else {
        if(Math.abs(paddle.y - gameHeight / 2) < paddle.velocity){
            paddle.y = gameHeight / 2;
        } else if(paddle.y > gameHeight / 2){
            paddle.y -= paddle.velocity;
        } else {
            paddle.y += paddle.velocity;
        }
    }
}

export const updateBall = ball => {
    ball.position.x += ball.velocity.x;
    ball.position.y += ball.velocity.y;
}

export const update = ( refBall, refGame, refPaddlePlayer2, refWinCondition) => {
    const ball = refBall.current;
    const { playArea, score } = refGame.current;
    const paddlePlayer2 = refPaddlePlayer2.current;
	const winCondition = refWinCondition.current;

    updateBall(refBall.current)
    
    //Update paddle
    if(control === "keyboard"){
        if(paddlePlayer1.key.up){
            if(paddlePlayer1.y - paddlePlayer1.height/2 >= paddlePlayer1.velocity){
                paddlePlayer1.y -= paddlePlayer1.velocity;
            } else {
                paddlePlayer1.y = paddlePlayer1.height/2;
            }
        }   
        if(paddlePlayer1.key.down){
            if(paddlePlayer1.y + paddlePlayer1.height/2 <= WINDOW_HEIGHT-paddlePlayer1.velocity){
                paddlePlayer1.y += paddlePlayer1.velocity;
            } else {
                paddlePlayer1.y = (WINDOW_HEIGHT - paddlePlayer1.height/2);
            }
        }
    };

    paddleAuto(ball, paddlePlayer2);

    //Update score and reset ball position and velocity
    const  initialPosition = playArea.height / 2 - 50 + Math.random() * 100; 
    const angle = Math.random() * Math.PI / 4;
    const sign = Math.random()< 0.5 ? -1 : 1;
  
    if(ball.position.x <= 0){
        score.player2++;
        ball.position.x = playArea.width / 2;
        ball.position.y = initialPosition;
        ball.velocity.x = -BALL_SPEED * Math.cos(angle);
        ball.velocity.y = sign * BALL_SPEED * Math.sin(angle);
        
    }

    if(ball.position.x >= playArea.width){
        score.player1++;
        ball.position.x = playArea.width / 2;
        ball.position.y = playArea.height / 2;
        ball.velocity.x = BALL_SPEED * Math.cos(angle);
        ball.velocity.y = sign * BALL_SPEED * Math.sin(angle);
    }

    //Check if winning condition achieved;
    if(score.player1 > 3 && score.player1 > score.player2 + 1){
        winCondition.gameOver = true;
        refGame.current.screen = "gameOver";
        winCondition.winner = "Player 1";
        ball.velocity.x = 0;
        ball.velocity.y = 0;
    }

    if(score.player2 > 3 && score.player2 > score.player1 + 1){
        winCondition.gameOver = true;
        refGame.current.screen = "gameOver";
        winCondition.winner = "Player 2";
        ball.velocity.x = 0;
        ball.velocity.y = 0;
    }
}