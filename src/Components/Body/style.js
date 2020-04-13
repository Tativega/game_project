import styled from 'styled-components';

export const BannerStyled = styled.div`
borders: solid 2px grey;
height: 300px;
width: 100vw;
`
export const GamesStyled = styled.div`
display: flex;
width: 900px;
flex-wrap: wrap;
margin: 50px auto;
`

export const SingleStyled = styled.div`
background-image: linear-gradient(to right, #342ead , #ea6227, #f2a51a);
width: 400px;
height: 300px;
margin: 20px;
border-radius: 20px;
&:hover {
    opacity: 0.5
}
`
