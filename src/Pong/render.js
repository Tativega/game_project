import { WINDOW_HEIGHT, WINDOW_WIDTH } from "../Pong/constants";

export const drawBall = (ctx, ball) => {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, 2 * Math.PI);
    ctx.fill();
}

export const drawGameOver = (ctx, winner) => {
    ctx.font = "60px Arial";
    ctx.fillText(winner + " wins!", WINDOW_WIDTH / 6, WINDOW_HEIGHT / 2);
    ctx.font = "30px Arial";
    ctx.fillText("Press any key to restart the game", WINDOW_WIDTH / 6, WINDOW_HEIGHT / 2 + 30);
}

export const drawMenu = (ctx) => {
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Start Game", 0.35 * WINDOW_WIDTH, WINDOW_HEIGHT / 2)
    //ctx.rect(0.35 * WINDOW_WIDTH, 0.45 * WINDOW_HEIGHT, 153, 30); Start Game hit box
} 

export const drawMiddleLine = (canvas, ctx) => {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 10;
    ctx.setLineDash([20, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();
}

export const drawPaddle = (ctx, paddle, x, y) => {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.rect(x, y, paddle.width, paddle.height);
    ctx.fill();
    ctx.closePath();
}

export const drawScore = (ctx, score) => {
    ctx.font = "30px Arial";
    ctx.fillText(score.player1, WINDOW_WIDTH / 2 - 70 , 50);
    ctx.fillText(score.player2, WINDOW_WIDTH / 2 + 50 , 50);
}
