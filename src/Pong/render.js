import { WINDOW_HEIGHT, WINDOW_WIDTH, KEYBOARD_OR_MOUSE_TEXT_Y, CONFIG_KEYBOARD_TEXT_Y,
	ONE_OR_TWO_PLAYERS_TEXT_Y, BACK_TEXT_Y, CONFIG_BALL_TEXT_Y
} from "../Pong/constants";

export const drawBall = (ctx, ball) => {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, 2 * Math.PI);
    ctx.fill();
}

export const drawGameOver = (ctx, winner) => {
    ctx.font = "60px Arial";
    ctx.fillText(winner + " wins!", 0.5 * WINDOW_WIDTH, 0.4 * WINDOW_HEIGHT);
    ctx.font = "30px Arial";
    ctx.fillText("Press any key to restart the game", 0.5 * WINDOW_WIDTH, 0.6 * WINDOW_HEIGHT);
}

export const drawMenu = (ctx) => {
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";

    ctx.fillText("Start Game", 0.5 * WINDOW_WIDTH, 0.4 * WINDOW_HEIGHT)
    ctx.textAlign = "center";

    ctx.fillText("Settings", 0.5 * WINDOW_WIDTH, 0.6 * WINDOW_HEIGHT)
    ctx.textAlign = "center";
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

export const drawSettings = (ctx, {control, players}) => {
	ctx.font = "30px Arial";

	ctx.fillStyle = "white";
	ctx.fillText("Configure Ball", 0.5 * WINDOW_WIDTH, CONFIG_BALL_TEXT_Y * WINDOW_HEIGHT);
	ctx.textAlign = "center";
  
	ctx.fillStyle = control === "keyboard" ? "yellow" : "white";
	ctx.fillText("Keyboard", 0.35 * WINDOW_WIDTH, KEYBOARD_OR_MOUSE_TEXT_Y * WINDOW_HEIGHT);
	ctx.textAlign = "center";
	ctx.fillStyle = control === "mouse" ? "yellow" : "white";
	ctx.fillText("Mouse", 0.65 * WINDOW_WIDTH, KEYBOARD_OR_MOUSE_TEXT_Y * WINDOW_HEIGHT);
	ctx.textAlign = "center";
  
	ctx.fillStyle = "white";
	ctx.fillText("Configure Keyboard", 0.5 * WINDOW_WIDTH, CONFIG_KEYBOARD_TEXT_Y * WINDOW_HEIGHT);
	ctx.textAlign = "center";
  
	ctx.fillStyle = players === 1 ? "yellow" : "white";
	ctx.fillText("1 Player", 0.35 * WINDOW_WIDTH, ONE_OR_TWO_PLAYERS_TEXT_Y * WINDOW_HEIGHT);
	ctx.textAlign = "center";
	ctx.fillStyle = players === 2 ? "yellow" : "white";
	ctx.fillText("2 Players", 0.65 * WINDOW_WIDTH, ONE_OR_TWO_PLAYERS_TEXT_Y * WINDOW_HEIGHT);
	ctx.textAlign = "center";
  
	ctx.fillText("Back", 0.5 * WINDOW_WIDTH, BACK_TEXT_Y * WINDOW_HEIGHT);
	ctx.textAlign = "center";
} 

export const drawKeyboard = (ctx, keys) => {
    // Player 1
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Player 1", 0.25 * WINDOW_WIDTH, 0.25 * WINDOW_HEIGHT)
    ctx.font = "20px Arial";
    ctx.fillStyle = "yellow";
    ctx.fillText("Up:", 0.35 * WINDOW_WIDTH, 0.35 * WINDOW_HEIGHT)
    ctx.fillStyle = "white";
    ctx.fillText(keys.player1Up, 0.60 * WINDOW_WIDTH, 0.35 * WINDOW_HEIGHT)
    ctx.fillStyle = "yellow";
    ctx.fillText("Down:", 0.35 * WINDOW_WIDTH, 0.40 * WINDOW_HEIGHT)
    ctx.fillStyle = "white";
    ctx.fillText(keys.player1Down, 0.60 * WINDOW_WIDTH, 0.40 * WINDOW_HEIGHT)

    // Player 2
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Player 2", 0.25 * WINDOW_WIDTH, 0.60 * WINDOW_HEIGHT)
    ctx.font = "20px Arial";
    ctx.fillStyle = "yellow";
    ctx.fillText("Up:", 0.35 * WINDOW_WIDTH, 0.70 * WINDOW_HEIGHT)
    ctx.fillStyle = "white";
    ctx.fillText(keys.player2Up, 0.60 * WINDOW_WIDTH, 0.70 * WINDOW_HEIGHT)
    ctx.fillStyle = "yellow"
    ctx.fillText("Down:", 0.35 * WINDOW_WIDTH, 0.75 * WINDOW_HEIGHT);
    ctx.fillStyle = "white";
    ctx.fillText(keys.player2Down, 0.60 * WINDOW_WIDTH, 0.75 * WINDOW_HEIGHT)

    //Back
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Back", 0.5 * WINDOW_WIDTH, 0.9 * WINDOW_HEIGHT)
    ctx.textAlign = "center";
}