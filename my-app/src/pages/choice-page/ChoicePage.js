import { useState } from "react";
import { Link } from "react-router-dom";

  function ChoicePage ({onItemClick}) {

    const pictures = [
      {id: 1, url: "https://klike.net/uploads/posts/2019-07/1564314090_3.jpg"},
      {id: 2, url: "https://funart.pro/uploads/posts/2021-07/1626361117_6-funart-pro-p-kotik-v-ochkakh-zhivotnie-krasivo-foto-12.jpg"},
      {id: 3, url: "https://cdnn21.img.ria.ru/images/148839/96/1488399659_0:0:960:960_600x0_80_0_1_e38b72053fffa5d3d7e82d2fe116f0b3.jpg"},
      {id: 4, url: "https://n1s2.hsmedia.ru/da/4b/ee/da4bee6e4076fc844e25b33e55c211b1/600x600_1_be9ea092fc2f1e9241738f95952f6470@720x720_0xac120003_4816389971639922535.jpeg"},
      {id: 5, url: "https://sib.fm/new_files/img/cats/cat-right.jpg"},
      {id: 6, url: "https://www.meme-arsenal.com/memes/4b1a30917c6cc16a08db14f46a4761a3.jpg"},
      {id: 7, url: "https://cdn.fishki.net/upload/post/2016/05/06/1943278/d89e2a91d9932fef64ac532f756cbd06.jpg"},
      {id: 8, url: "http://android-obzor.com/wp-content/uploads/2022/03/5kvsjbsj2mk.jpg"},
      {id: 9, url: "https://bipbap.ru/wp-content/uploads/2017/09/1476347564_krasavicy-koshki-i-koty-1.jpg"},
    ]
    
    return (
      <div className='game-container'>
      <div className='game-header'>
        <h1> Choose the picture and start</h1>
      </div>
        <div className="game-choice">
       {pictures.map((picture) => {
         return (
          <Link to={"/main"}>
          <div className="picture" onClick={()=> localStorage.setItem("url", picture.url)}>
            <img src={picture.url}></img>       
            </div>
            </Link>
         )
         }
       )}
       </div>
      </div>
    );
  }
  
export default ChoicePage;
