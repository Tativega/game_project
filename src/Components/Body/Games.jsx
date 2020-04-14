import React from "react"
import {Link} from "react-router-dom"

import { GamesStyled } from "./style";
import Single from "./Single"

function Games () {
return(
    <GamesStyled>
        <Link to='/pong'>
            <Single text="PONG" />
        </Link>
        <Single/>
        <Single/>
        <Single/>
    </GamesStyled>
    )
}

export default Games;