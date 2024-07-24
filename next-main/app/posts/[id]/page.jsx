import { Suspense } from 'react'
import PostPages from '../page'

async function loadPost(id) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
    const data = await res.json()
    return data
}
async function Page({ params }) {
    //console.log(props)
    const post = await loadPost(params.id)
    return (
        <div>
            <Suspense fallback={<div>Cargando publicaciones...</div>}>
                <PostPages />
            </Suspense>
            <h1>Post Page {params.id}</h1>
            <h2>{post.id}. {post.title}</h2>
            <p>{post.body}</p>
            <hr />
            <h3>Otras publicaciones</h3>
        </div>
    )
}
export default Page