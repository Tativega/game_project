import { KEYBOARD_OR_MOUSE_TEXT_POSITION, CONFIG_KEYBOARD_TEXT_POSITION,
	ONE_OR_TWO_PLAYERS_TEXT_POSITION, BACK_TEXT_POSITION, CONFIG_BALL_TEXT_POSITION,SPEED_DIFICULTY_TEXT_POSITION,
	EASY_SPEED_INCREASE,NORMAL_SPEED_INCREASE,HARD_SPEED_INCREASE
} from "../Pong/constants";

export const drawBall = (canvas, ctx, ball, { scaleX, scaleY }) => {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(scaleX * ball.position.x, scaleY * ball.position.y, scaleX * ball.radius, 0, 2 * Math.PI);
    ctx.fill();
}

export const drawGameOver = (canvas, ctx, winner) => {
    ctx.font = "3em Arial";
    ctx.fillText(winner + " wins!", 0.5 * canvas.width, 0.4 * canvas.height);
    ctx.font = "1.5em Arial";
    ctx.fillText("Press any key to restart the game", 0.5 * canvas.width, 0.6 * canvas.height);
}

export const drawMenu = (canvas, ctx) => {
    ctx.font = "1.5em Arial";
    ctx.fillStyle = "white";

    ctx.fillText("Start Game", 0.5 * canvas.width, 0.4 * canvas.height)
    ctx.textAlign = "center";

    ctx.fillText("Settings", 0.5 * canvas.width, 0.6 * canvas.height)
    ctx.textAlign = "center";
} 

export const drawMiddleLine = (canvas, ctx, { scaleX, scaleY }) => {
    ctx.strokeStyle = "white";
    ctx.lineWidth = scaleX * 10;
    ctx.setLineDash([scaleY * 20, scaleY * 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();
}

export const drawPaddle = (canvas, ctx, paddle, x, y, { scaleX, scaleY }) => {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.rect(scaleX * x, scaleY * y, scaleX * paddle.width, scaleY * paddle.height);
    ctx.fill();
    ctx.closePath();
}

export const drawScore = (canvas, ctx, score) => {
    ctx.font = "1.5em Arial";
    ctx.fillText(score.player1, canvas.width / 2 - 70 , 50);
    ctx.fillText(score.player2, canvas.width / 2 + 50 , 50);
}

export const drawSettings = (canvas, ctx, {control, players}) => {
	ctx.font = "1.5em Arial";

	ctx.fillStyle = "white";
	ctx.fillText("Configure Ball", 0.5 * canvas.width, CONFIG_BALL_TEXT_POSITION * canvas.height);
	ctx.textAlign = "center";
  
	ctx.fillStyle = control === "keyboard" ? "yellow" : "white";
	ctx.fillText("Keyboard", 0.35 * canvas.width, KEYBOARD_OR_MOUSE_TEXT_POSITION * canvas.height);
	ctx.textAlign = "center";
	ctx.fillStyle = control === "mouse" ? "yellow" : "white";
	ctx.fillText("Mouse", 0.65 * canvas.width, KEYBOARD_OR_MOUSE_TEXT_POSITION * canvas.height);
	ctx.textAlign = "center";
  
	ctx.fillStyle = "white";
	ctx.fillText("Configure Keyboard", 0.5 * canvas.width, CONFIG_KEYBOARD_TEXT_POSITION * canvas.height);
	ctx.textAlign = "center";
  
	ctx.fillStyle = players === 1 ? "yellow" : "white";
	ctx.fillText("1 Player", 0.35 * canvas.width, ONE_OR_TWO_PLAYERS_TEXT_POSITION * canvas.height);
	ctx.textAlign = "center";
	ctx.fillStyle = players === 2 ? "yellow" : "white";
	ctx.fillText("2 Players", 0.65 * canvas.width, ONE_OR_TWO_PLAYERS_TEXT_POSITION * canvas.height);
	ctx.textAlign = "center";
  
	ctx.fillText("Back", 0.5 * canvas.width, BACK_TEXT_POSITION * canvas.height);
	ctx.textAlign = "center";
}

export const drawKeyboard = (canvas, ctx, keys) => {
    // Player 1
    ctx.font = "1.5em Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Player 1", 0.25 * canvas.width, 0.25 * canvas.height)
    ctx.font = "0.8em Arial";
    ctx.fillStyle = "yellow";
    ctx.fillText("Up:", 0.35 * canvas.width, 0.35 * canvas.height)
    ctx.fillStyle = "white";
    ctx.fillText(keys.player1Up, 0.60 * canvas.width, 0.35 * canvas.height)
    ctx.fillStyle = "yellow";
    ctx.fillText("Down:", 0.35 * canvas.width, 0.40 * canvas.height)
    ctx.fillStyle = "white";
    ctx.fillText(keys.player1Down, 0.60 * canvas.width, 0.40 * canvas.height)

    // Player 2
    ctx.font = "1.5em Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Player 2", 0.25 * canvas.width, 0.60 * canvas.height)
    ctx.font = "0.8em Arial";
    ctx.fillStyle = "yellow";
    ctx.fillText("Up:", 0.35 * canvas.width, 0.70 * canvas.height)
    ctx.fillStyle = "white";
    ctx.fillText(keys.player2Up, 0.60 * canvas.width, 0.70 * canvas.height)
    ctx.fillStyle = "yellow"
    ctx.fillText("Down:", 0.35 * canvas.width, 0.75 * canvas.height);
    ctx.fillStyle = "white";
    ctx.fillText(keys.player2Down, 0.60 * canvas.width, 0.75 * canvas.height)

    //Back
    ctx.font = "1.5em Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Back", 0.5 * canvas.width, BACK_TEXT_POSITION * canvas.height)
    ctx.textAlign = "center";
}

export const drawBallSettings = (canvas, ctx, {speedDificulty}) => {
	ctx.font = "1.5em Arial";
	
	ctx.fillText("Speed dificulty: ", 0.25 * canvas.width, SPEED_DIFICULTY_TEXT_POSITION * canvas.height)

	ctx.font = "1em Arial";
	ctx.fillStyle = speedDificulty === EASY_SPEED_INCREASE ? "yellow" : "white";
	ctx.fillText("easy", 0.50 * canvas.width, SPEED_DIFICULTY_TEXT_POSITION * canvas.height)
	ctx.fillStyle = speedDificulty === NORMAL_SPEED_INCREASE ? "yellow" : "white";
	ctx.fillText("normal", 0.70 * canvas.width, SPEED_DIFICULTY_TEXT_POSITION * canvas.height)
	ctx.fillStyle = speedDificulty === HARD_SPEED_INCREASE ? "yellow" : "white";
	ctx.fillText("hard", 0.90 * canvas.width, SPEED_DIFICULTY_TEXT_POSITION * canvas.height)

	//Back
	ctx.font = "1.5em Arial";
	ctx.fillStyle = "white";
	ctx.fillText("Back", 0.5 * canvas.width, BACK_TEXT_POSITION * canvas.height)
	ctx.textAlign = "center";
}