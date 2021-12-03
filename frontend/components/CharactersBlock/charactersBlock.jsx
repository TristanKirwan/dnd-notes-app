export default function CharactersBlock(characters = []){
  return (
    <div>
      {characters.map(character => <span>This is character: {character}</span>)}
    </div>
  )
}