const check = (value)=>{
  let part1,part2;
  let part3 = "";
  [part1,part2] = value.split('@')
  console.log("part1,2",part1,part2)
  if(part1 && part2)
  {
    if (part2.split('.').length > 2){
      const result = part2.split('.')
      part2 = result[0]
      result.map((item,index)=>index>0?part3 +=item:0)
    }
    else
      [part2,part3] = part2.split('.')
    console.log("part2,3",part2,part3)
    if (part2 && part3)
    {
      return (
        /[\-\.\_]{0,1}/.test(part1) && /[a-zA-Z0-9][a-zA-Z0-9\_\-\.]{0,20}[a-zA-Z0-9]/.test(part1) && 
        /[\-\_]{0,1}/.test(part2) && /[a-zA-Z0-9][a-zA-Z0-9\_\-]{0,10}[a-zA-Z0-9]/.test(part2) &&
        /[\.]{0,1}/.test(part3) && /[a-zA-Z0-9][a-zA-Z0-9\.]{0,10}[a-zA-Z0-9]/.test(part3)
      )
    }
  }
  return (false)
}
console.log(process.argv[2])
console.log(/^[a-zA-Z0-9]{1,10}[\-\_\.]{0,1}[a-zA-Z0-9]{1,10}@[a-zA-Z0-9]{1,5}[\-\_]{0,1}[a-zA-Z0-9]{1,5}.[a-zA-Z0-9]{1,5}[\.]{0,1}[a-zA-Z0-9]{1,5}$/.test(process.argv[2]))
