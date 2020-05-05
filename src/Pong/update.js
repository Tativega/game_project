import { WINDOW_HEIGHT, WINDOW_WIDTH } from "../Pong/constants";

export const paddleAuto = (ball, paddle) => {
    if(ball.velocity.x > 0) {
        if(Math.abs(ball.position.y - paddle.y) < paddle.velocity){
            paddle.y = ball.position.y;
        } else if(ball.position.y > paddle.y + paddle.height / 2){
            paddle.y += paddle.velocity;
        } else if (ball.position.y < paddle.y - paddle.height / 2){
            paddle.y -= paddle.velocity;
        }
    } else {
        if(Math.abs(paddle.y - WINDOW_HEIGHT / 2) < paddle.velocity){
            paddle.y = WINDOW_HEIGHT / 2;
        } else if(paddle.y > WINDOW_HEIGHT / 2){
            paddle.y -= paddle.velocity;
        } else {
            paddle.y += paddle.velocity;
        }
    }
}

export const updateBall = (ball) => {
    ball.position.x += ball.velocity.x;
    ball.position.y += ball.velocity.y;
}