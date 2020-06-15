export const borderCollision = (ball, { height: gameHeight }) => {
    if(ball.position.y + ball.radius >= gameHeight || 
        ball.position.y - ball.radius <= 0){
        ball.velocity.y = -ball.velocity.y;
    }
}
