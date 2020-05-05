export const borderCollision = (ball, canvas) => {
    if(ball.position.y + ball.radius >= canvas.height || 
        ball.position.y - ball.radius <= 0){
        ball.velocity.y = -ball.velocity.y;
    }
}
