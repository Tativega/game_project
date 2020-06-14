import { BALL_SPEED } from "../Pong/constants";

export const paddleAuto = (canvas, ball, paddle) => {
    if(ball.velocity.x > 0) {
        if(Math.abs(ball.position.y - paddle.y) < paddle.velocity){
            paddle.y = ball.position.y;
        } else if(ball.position.y > paddle.y + paddle.height / 2){
            paddle.y += paddle.velocity;
        } else if (ball.position.y < paddle.y - paddle.height / 2){
            paddle.y -= paddle.velocity;
        }
    } else {
        if(Math.abs(paddle.y - canvas.height / 2) < paddle.velocity){
            paddle.y = canvas.height / 2;
        } else if(paddle.y > canvas.height / 2){
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

export const update = (canvas, refBall, refGame, refPaddlePlayer2, refWinCondition) => {
    const ball = refBall.current;
    const score = refGame.current.score;
    const paddlePlayer2 = refPaddlePlayer2.current;
	const winCondition = refWinCondition.current;

    updateBall(refBall.current)
    
    paddleAuto(canvas, ball, paddlePlayer2);

    //Update score and reset ball position and velocity
    const  initialPosition = canvas.height / 2 - 50 + Math.random() * 100; 
    const angle = Math.random() * Math.PI / 4;
    const sign = Math.random()< 0.5 ? -1 : 1;
  
    if(ball.position.x <= 0){
        score.player2++;
        ball.position.x = canvas.width / 2;
        ball.position.y = initialPosition;
        ball.velocity.x = -BALL_SPEED * Math.cos(angle);
        ball.velocity.y = sign * BALL_SPEED * Math.sin(angle);
        
    }

    if(ball.position.x >= canvas.width){
        score.player1++;
        ball.position.x = canvas.width / 2;
        ball.position.y = canvas.height / 2;
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