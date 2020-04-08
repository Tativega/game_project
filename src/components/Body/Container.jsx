import React from "react"
import { GamesContainer } from "./style";
import SingleView from "./SingleView"

function Container () {
return(
    <GamesContainer>
<SingleView></SingleView>
<SingleView></SingleView>
<SingleView></SingleView>
<SingleView></SingleView>
    </GamesContainer>
)
}

export default Container;