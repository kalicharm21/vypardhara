export default function UbidPage({ params }: { params: { id: string } }) {
  return <main style={{padding:32}}><h1>UBID {params.id}</h1></main>;
}
