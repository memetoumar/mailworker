const genApi= ()=>{
    const random=["A","q","Q","Y",'1',"3","g","o","c","z","d","u","g","6","8","4",'9','5','1',"7","T","W","F"];
    let keys= "LIVE_"
    for(let i=0; i<50;i++){
        keys+=random[Math.floor(Math.random()* random.length)]
    }
    return keys

}
module.exports= genApi